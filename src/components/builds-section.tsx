"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { builds, type BuildProduct } from "@/data/portfolio";

type NpmStats = {
  version: string;
  downloads: { week: number; month: number; year: number };
  stars: number | null;
};

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

function StatBox({
  label,
  value,
  loading,
  npm = false,
}: {
  label: string;
  value: string;
  loading?: boolean;
  npm?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <span className={`coord-label ${npm ? "!text-white/40" : ""}`}>
        {label}
      </span>
      {loading ? (
        <div
          className="h-7 w-14 animate-pulse rounded-sm"
          style={{ background: npm ? "rgba(255,255,255,0.1)" : "var(--border)" }}
        />
      ) : (
        <span
          className={`text-xl sm:text-2xl font-bold tracking-tight tabular-nums ${
            npm ? "text-white" : ""
          }`}
        >
          {value}
        </span>
      )}
    </div>
  );
}

function TrueCoordCard({ product }: { product: BuildProduct }) {
  const [stats, setStats] = useState<NpmStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!product.npmPackage) return;
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(
          `/api/npm-stats?package=${encodeURIComponent(product.npmPackage!)}`,
        );
        if (!res.ok) return;
        const json = await res.json();
        if (cancelled) return;
        setStats({
          version: json.version,
          downloads: json.downloads,
          stars: json.stars,
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [product.npmPackage]);

  return (
    <article className="npm-card relative overflow-hidden flex flex-col h-full p-5 sm:p-6">
      {/* npm brand wash */}
      <div className="npm-card-glow" aria-hidden />
      <div className="npm-card-grid" aria-hidden />

      <div className="relative z-10 flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="npm-badge" aria-hidden>
              npm
            </span>
          </div>
          <h3 className="n-heading text-base sm:text-lg text-white">
            {product.name}
          </h3>
        </div>
        {stats?.version && (
          <span className="npm-version shrink-0">v{stats.version}</span>
        )}
      </div>

      <p className="relative z-10 text-xs sm:text-[13px] leading-relaxed mb-4 flex-1 text-white/60">
        {product.description}
      </p>

      <div className="relative z-10 npm-install mb-5">
        <span className="text-[#CB3837]">$</span>
        <code className="ml-2">npm i {product.npmPackage}</code>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-3 mb-5 py-4 border-y border-white/10">
        <StatBox
          label="Week"
          value={stats ? stats.downloads.week.toLocaleString() : "—"}
          loading={loading}
          npm
        />
        <StatBox
          label="Month"
          value={stats ? stats.downloads.month.toLocaleString() : "—"}
          loading={loading}
          npm
        />
        <StatBox
          label="Year"
          value={stats ? stats.downloads.year.toLocaleString() : "—"}
          loading={loading}
          npm
        />
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5 flex-1">
          {product.tags.map((tag) => (
            <span key={tag} className="npm-tag">
              {tag}
            </span>
          ))}
          {typeof stats?.stars === "number" && stats.stars > 0 && (
            <span className="npm-tag">★ {stats.stars}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {product.links.map((link) => {
            const isNpm = link.label.toLowerCase() === "npm";
            return (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={isNpm ? "npm-link-btn npm-link-btn-primary" : "npm-link-btn"}
              >
                {link.label}
                <ExternalLink className="w-3 h-3" />
              </a>
            );
          })}
        </div>
      </div>
    </article>
  );
}

function LoopNodeCard({ product }: { product: BuildProduct }) {
  const live = product.links[0]?.url;

  const scores = [
    { label: "Perf", value: "98" },
    { label: "A11y", value: "100" },
    { label: "SEO", value: "92" },
    { label: "Security", value: "100" },
  ];

  return (
    <article className="n-card-inner p-5 sm:p-6 flex flex-col h-full">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="n-heading text-base sm:text-lg">{product.name}</h3>
        </div>
        <span className="inline-flex items-center gap-1.5 n-tag">
          <span className="status-indicator !w-1.5 !h-1.5" aria-hidden />
          LIVE
        </span>
      </div>

      <p
        className="text-xs sm:text-[13px] leading-relaxed mb-5 flex-1"
        style={{ color: "var(--fg-muted)" }}
      >
        {product.description}
      </p>

      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 py-4 border-y"
        style={{ borderColor: "var(--line)" }}
      >
        {scores.map((item) => (
          <div key={item.label} className="flex flex-col gap-1.5">
            <span className="coord-label">{item.label}</span>
            <span className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5 flex-1">
          {product.tags.map((tag) => (
            <span key={tag} className="n-tag">
              {tag}
            </span>
          ))}
        </div>
        {live && (
          <a
            href={live}
            target="_blank"
            rel="noopener noreferrer"
            className="n-btn n-btn-primary !py-2 !px-3"
          >
            Open
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}

export function BuildsSection() {
  const trueCoord = builds.find((b) => b.id === "true-coord");
  const loopNode = builds.find((b) => b.id === "loopnode");

  return (
    <section className="x-row py-10 px-5 sm:py-16 sm:px-7">
      <div className="section-header flex items-center gap-4 mb-8">
        <GlyphPattern pattern={[0, 4, 5, 8, 9, 12, 16, 17, 20, 24]} />
        <div className="min-w-0">
          <span className="coord-label block mb-1">SEC_02 / BUILDS</span>
          <h2 className="n-heading text-xl sm:text-2xl">BUILDS</h2>
        </div>
      </div>

      <p
        className="text-sm leading-relaxed mb-6 max-w-md"
        style={{ color: "var(--fg-muted)" }}
      >
        Products under my ownership — open-source software and a SaaS platform I continue to develop and operate.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trueCoord && <TrueCoordCard product={trueCoord} />}
        {loopNode && <LoopNodeCard product={loopNode} />}
      </div>
    </section>
  );
}
