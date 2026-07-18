"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ActivityCalendar } from "react-activity-calendar";
import { personalInfo } from "@/data/portfolio";

type ContributionStats = {
  total: number;
  best: number;
  active: number;
};

type Activity = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

function StatSkeleton() {
  return (
    <div
      className="h-9 w-16 animate-pulse rounded-sm"
      style={{ background: "var(--border)" }}
    />
  );
}

export function GitHubActivity() {
  const { theme } = useTheme();
  const username = personalInfo.githubUsername;
  const [stats, setStats] = useState<ContributionStats | null>(null);
  const [data, setData] = useState<Activity[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const res = await fetch("/api/github-stats");
        const json = await res.json();

        if (!res.ok) {
          if (!cancelled) {
            setError(
              typeof json.error === "string"
                ? json.error
                : "Failed to load GitHub stats",
            );
          }
          return;
        }

        if (cancelled) return;

        setStats({
          total: json.total,
          best: json.best,
          active: json.active,
        });
        setData(json.contributions as Activity[]);
        setError(null);
      } catch {
        if (!cancelled) {
          setError("Failed to load GitHub stats");
        }
      }
    }

    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="flex flex-col mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 border border-[var(--border)] divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]">
          <div className="p-4 sm:p-5 flex flex-col gap-2">
            <div
              className="flex items-center gap-2 text-xs n-mono uppercase"
              style={{ color: "var(--fg-muted)" }}
            >
              <span className="w-1.5 h-1.5 bg-red-700" />
              Contributions
            </div>
            {stats ? (
              <div className="text-3xl font-bold tracking-tight">
                {stats.total.toLocaleString()}
              </div>
            ) : (
              <StatSkeleton />
            )}
          </div>
          <div className="p-4 sm:p-5 flex flex-col gap-2">
            <div
              className="flex items-center gap-2 text-xs n-mono uppercase"
              style={{ color: "var(--fg-muted)" }}
            >
              <span className="w-1.5 h-1.5 bg-red-700" />
              Best Day
            </div>
            {stats ? (
              <div className="text-3xl font-bold tracking-tight">
                {stats.best}{" "}
                <span className="text-sm font-normal text-[var(--fg-muted)]">
                  commits
                </span>
              </div>
            ) : (
              <StatSkeleton />
            )}
          </div>
          <div className="p-4 sm:p-5 flex flex-col gap-2">
            <div
              className="flex items-center gap-2 text-xs n-mono uppercase"
              style={{ color: "var(--fg-muted)" }}
            >
              <span className="w-1.5 h-1.5 bg-red-700" />
              Active Days
            </div>
            {stats ? (
              <div className="text-3xl font-bold tracking-tight">
                {stats.active}{" "}
                <span className="text-sm font-normal text-[var(--fg-muted)]">
                  days
                </span>
              </div>
            ) : (
              <StatSkeleton />
            )}
          </div>
        </div>
      </div>

      <div className="relative pt-6 pb-6">
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--fg-muted)]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--fg-muted)]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--fg-muted)]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--fg-muted)]" />

        <div className="overflow-x-auto hide-scrollbar">
          <div className="min-w-[750px] px-2">
            {mounted && data && (
              <ActivityCalendar
                data={data}
                colorScheme={theme === "light" ? "light" : "dark"}
                theme={{
                  dark: [
                    "rgba(255,255,255,0.1)",
                    "rgba(255,255,255,0.3)",
                    "rgba(255,255,255,0.5)",
                    "rgba(255,255,255,0.7)",
                    "rgba(255,255,255,1)",
                  ],
                  light: [
                    "rgba(0,0,0,0.05)",
                    "rgba(0,0,0,0.25)",
                    "rgba(0,0,0,0.5)",
                    "rgba(0,0,0,0.75)",
                    "rgba(0,0,0,1)",
                  ],
                }}
                style={{
                  color: "var(--fg-muted)",
                }}
              />
            )}
            {mounted && !data && !error && (
              <div
                className="h-[120px] animate-pulse rounded-sm"
                style={{ background: "var(--border)" }}
              />
            )}
            {error && (
              <p className="text-sm n-mono" style={{ color: "var(--fg-muted)" }}>
                {error}
              </p>
            )}
          </div>
        </div>
      </div>

      <div
        className="flex justify-between items-center mt-6 text-xs n-mono"
        style={{ color: "var(--fg-muted)" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full border border-[var(--fg-muted)]" />
          @{username}
        </div>
        <div className="uppercase">Last 12 Months · GitHub API</div>
      </div>
    </>
  );
}
