"use client";

import { useEffect, useState } from "react";

type VisitorInfo = {
  ip: string;
  place: string;
};

function formatVisitor(data: {
  ip?: string;
  city?: string | null;
  country_code?: string | null;
  country_name?: string | null;
}): VisitorInfo | null {
  if (!data.ip) return null;

  const city = data.city?.trim();
  const code = data.country_code?.trim()?.toUpperCase();
  const country = data.country_name?.trim()?.toUpperCase();

  let place = "";
  if (city && code) place = `${city.toUpperCase()}, ${code}`;
  else if (code) place = code;
  else if (country) place = country;

  return { ip: data.ip, place };
}

export function VisitorSignal() {
  const [info, setInfo] = useState<VisitorInfo | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("lookup failed");
        const data = await res.json();
        if (cancelled) return;
        if (data.error) throw new Error(String(data.reason || data.error));
        const next = formatVisitor(data);
        if (next) setInfo(next);
        else setFailed(true);
      } catch {
        // Fallback: IP only via ipify
        try {
          const res = await fetch("https://api.ipify.org?format=json");
          if (!res.ok) throw new Error("ipify failed");
          const data = (await res.json()) as { ip?: string };
          if (cancelled) return;
          if (data.ip) setInfo({ ip: data.ip, place: "" });
          else setFailed(true);
        } catch {
          if (!cancelled) setFailed(true);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return (
      <span className="n-mono text-[11px]" style={{ color: "var(--fg-subtle)" }}>
        SIGNAL · OFFLINE
      </span>
    );
  }

  if (!info) {
    return (
      <span
        className="n-mono text-[11px] tabular-nums animate-pulse"
        style={{ color: "var(--fg-subtle)" }}
      >
        TRACING SIGNAL…
      </span>
    );
  }

  return (
    <span
      className="n-mono text-[11px] tabular-nums flex flex-wrap items-center gap-x-2 gap-y-1"
      style={{ color: "var(--fg-subtle)" }}
      title="Your public network identity — only shown to you"
    >
      <span className="inline-flex items-center gap-1.5">
        <span
          className="status-indicator !w-1.5 !h-1.5"
          aria-hidden
        />
        YOU
      </span>
      <span aria-hidden>·</span>
      <span className="text-[var(--fg-muted)]">{info.ip}</span>
      {info.place && (
        <>
          <span aria-hidden>·</span>
          <span>{info.place}</span>
        </>
      )}
    </span>
  );
}
