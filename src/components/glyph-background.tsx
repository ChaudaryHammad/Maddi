"use client";

import { useEffect, useState } from "react";

export function GlyphBackground() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden dot-grid">
      {/* Soft edge vignette so content reads cleaner on the grid */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 40%, transparent 40%, var(--bg) 100%)",
          opacity: 0.55,
        }}
      />

      {/* Scroll progress — Nothing-style charging strip */}
      <div className="absolute left-5 lg:left-10 top-[15%] bottom-[15%] w-[6px] border border-[var(--border)] overflow-hidden hidden sm:flex flex-col justify-end">
        <div
          className="w-full transition-all duration-100 ease-out"
          style={{
            height: `${Math.max(scrollProgress * 100, 0)}%`,
            background: "var(--fg)",
            boxShadow:
              "0 0 10px 1px color-mix(in srgb, var(--fg) 40%, transparent)",
          }}
        />
        {/* Tip marker */}
        {scrollProgress > 0.02 && (
          <div
            className="absolute left-0 right-0 h-[2px]"
            style={{
              bottom: `${scrollProgress * 100}%`,
              background: "var(--fg-subtle)",
            }}
          />
        )}
      </div>
    </div>
  );
}
