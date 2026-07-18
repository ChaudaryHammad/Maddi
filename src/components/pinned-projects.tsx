"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";

type GithubProject = {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  stars?: number;
  forks?: number;
  gradient: string;
};

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

function GlyphPattern({ pattern }: { pattern: number[] }) {
  return (
    <div className="glyph-pattern" aria-hidden>
      {Array.from({ length: 25 }, (_, i) => (
        <div
          key={i}
          className={`glyph-dot ${pattern.includes(i) ? "active" : ""}`}
        />
      ))}
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="space-y-5">
      <div
        className="h-12 animate-pulse rounded-sm"
        style={{ background: "var(--border)" }}
      />
      <div className="x-line" />
      <div
        className="h-32 animate-pulse rounded-sm"
        style={{ background: "var(--border)" }}
      />
    </div>
  );
}

export function PinnedProjects() {
  const [projects, setProjects] = useState<GithubProject[]>([]);
  const [source, setSource] = useState<"pinned" | "recent" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [projectKey, setProjectKey] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/github-projects");
        const json = await res.json();
        if (!res.ok) {
          if (!cancelled) {
            setError(
              typeof json.error === "string"
                ? json.error
                : "Failed to load projects",
            );
            setLoading(false);
          }
          return;
        }
        if (cancelled) return;
        setProjects(json.projects ?? []);
        setSource(json.source === "recent" ? "recent" : "pinned");
        setError(null);
      } catch {
        if (!cancelled) setError("Failed to load projects");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selectProject = (idx: number) => {
    setActiveProjectIdx(idx);
    setProjectKey((k) => k + 1);
    setIsDropdownOpen(false);
  };

  const active = projects[activeProjectIdx];

  return (
    <section className="x-row py-10 px-5 sm:py-16 sm:px-7">
      <div className="section-header flex items-center gap-4 mb-8">
        <GlyphPattern pattern={[2, 3, 4, 6, 10, 11, 12, 14, 20, 21, 22]} />
        <div className="min-w-0">
          <span className="coord-label block mb-1">SEC_03 / WORK</span>
          <h2 className="n-heading text-xl sm:text-2xl">PROJECTS</h2>
        </div>
      </div>

      {loading && <ProjectsSkeleton />}

      {!loading && error && (
        <p className="text-sm n-mono" style={{ color: "var(--fg-muted)" }}>
          {error}
        </p>
      )}

      {!loading && !error && projects.length === 0 && (
        <p className="text-sm n-mono" style={{ color: "var(--fg-muted)" }}>
          No repositories found. Pin repos on your GitHub profile to show them
          here.
        </p>
      )}

      {!loading && !error && active && (
        <>
          {source === "recent" && (
            <p
              className="text-xs n-mono mb-4"
              style={{ color: "var(--fg-subtle)" }}
            >
              No pinned repos — showing recent public repositories. Pin projects
              on GitHub to curate this list.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mb-0 items-stretch sm:items-center relative z-50">
            <div className="relative flex-1" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between n-card-inner px-4 py-3 text-left focus:outline-none focus-visible:border-[var(--fg-muted)]"
                aria-expanded={isDropdownOpen}
                aria-haspopup="listbox"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="coord-label shrink-0">PROJECT</span>
                  <span className="n-heading text-sm truncate">
                    {active.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="coord-label tabular-nums">
                    {String(activeProjectIdx + 1).padStart(2, "0")}/
                    {String(projects.length).padStart(2, "0")}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    style={{ color: "var(--fg-subtle)" }}
                  />
                </div>
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute left-0 right-0 mt-1.5 z-50 overflow-hidden border"
                  style={{
                    background: "var(--bg)",
                    borderColor: "var(--line)",
                  }}
                  role="listbox"
                >
                  {projects.map((project, idx) => (
                    <button
                      key={project.title}
                      type="button"
                      role="option"
                      aria-selected={idx === activeProjectIdx}
                      onClick={() => selectProject(idx)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors
                        ${
                          idx === activeProjectIdx
                            ? "bg-[var(--bg-elevated)]"
                            : "hover:bg-[var(--line-hover)]"
                        }
                        ${idx < projects.length - 1 ? "border-b" : ""}
                      `}
                      style={{ borderColor: "var(--line)" }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="coord-label shrink-0 w-12"
                          style={{
                            color:
                              idx === activeProjectIdx
                                ? "var(--fg)"
                                : undefined,
                          }}
                        >
                          PRJ_{String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="n-heading text-sm truncate">
                          {project.title}
                        </span>
                      </div>
                      <div className="hidden sm:flex flex-wrap gap-1 justify-end">
                        {project.technologies.slice(0, 2).map((tech) => (
                          <span
                            key={tech}
                            className="text-[9px] px-1.5 py-0.5 border"
                            style={{
                              color: "var(--fg-subtle)",
                              borderColor: "var(--line)",
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="x-line my-5" />

          <div
            key={projectKey}
            className="min-h-[140px] flex flex-col justify-between relative z-10 project-content-enter"
          >
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="coord-label">
                  PRJ_{String(activeProjectIdx + 1).padStart(2, "0")}
                </span>
                <div className="flex gap-1">
                  {active.githubUrl && (
                    <a
                      href={active.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="n-icon-btn !w-8 !h-8"
                      aria-label="Source code"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {active.liveUrl && (
                    <a
                      href={active.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="n-icon-btn !w-8 !h-8"
                      aria-label="Live demo"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <h3 className="n-heading text-base sm:text-lg mb-2">
                  {active.title}
                </h3>
                <p
                  className="text-xs sm:text-[13px] leading-relaxed mb-5"
                  style={{ color: "var(--fg-muted)" }}
                >
                  {active.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {active.technologies.map((tech) => (
                  <span key={tech} className="n-tag">
                    {tech}
                  </span>
                ))}
                {typeof active.stars === "number" && active.stars > 0 && (
                  <span className="n-tag">★ {active.stars}</span>
                )}
              </div>

              <div className="x-line mb-3" />
              <div className="flex items-center justify-between">
                <div className="red-line" />
                <span className="coord-label">
                  {String(activeProjectIdx + 1).padStart(2, "0")} OF{" "}
                  {String(projects.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-5">
            {projects.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectProject(idx)}
                aria-label={`View project ${idx + 1}`}
                className="transition-all duration-150"
                style={{
                  width: idx === activeProjectIdx ? 16 : 6,
                  height: 6,
                  background:
                    idx === activeProjectIdx ? "var(--fg)" : "var(--line)",
                }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
