"use client";

import { ExternalLink } from "lucide-react";
import { experiences, education } from "@/data/portfolio";

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

export function ExperienceSection() {
  return (
    <section className="x-row py-10 px-5 sm:py-16 sm:px-7">
      <div className="section-header flex items-center gap-4 mb-8">
        <GlyphPattern pattern={[0, 1, 5, 6, 10, 11, 15, 16, 20, 21]} />
        <div className="min-w-0">
          <span className="coord-label block mb-1">SEC_02B / EXP</span>
          <h2 className="n-heading text-xl sm:text-2xl">EXPERIENCE</h2>
        </div>
      </div>

      <div className="flex flex-col">
        {experiences.map((exp, idx) => (
          <article
            key={`${exp.company}-${exp.role}`}
            className={`py-5 ${idx < experiences.length - 1 ? "border-b" : ""}`}
            style={{ borderColor: "var(--line)" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 mb-2">
              <div className="min-w-0">
                <h3 className="n-heading text-sm sm:text-base">{exp.role}</h3>
                <p className="n-mono text-xs mt-1" style={{ color: "var(--fg-muted)" }}>
                  {exp.company}
                </p>
              </div>
              <span className="coord-label shrink-0 tabular-nums">{exp.period}</span>
            </div>
            <p
              className="text-xs sm:text-[13px] leading-relaxed mb-3 max-w-xl"
              style={{ color: "var(--fg-muted)" }}
            >
              {exp.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {exp.technologies.map((tech) => (
                <span key={tech} className="n-tag">
                  {tech}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function EducationSection() {
  return (
    <section className="x-row py-10 px-5 sm:py-16 sm:px-7">
      <div className="section-header flex items-center gap-4 mb-8">
        <GlyphPattern pattern={[2, 7, 8, 12, 13, 17, 18, 22, 23]} />
        <div className="min-w-0">
          <span className="coord-label block mb-1">SEC_02C / EDU</span>
          <h2 className="n-heading text-xl sm:text-2xl">EDUCATION</h2>
        </div>
      </div>

      <div className="flex flex-col">
        {education.map((item, idx) => (
          <article
            key={`${item.org}-${item.title}`}
            className={`py-5 ${idx < education.length - 1 ? "border-b" : ""}`}
            style={{ borderColor: "var(--line)" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 mb-2">
              <div className="min-w-0">
                <h3 className="n-heading text-sm sm:text-base">{item.title}</h3>
                <p className="n-mono text-xs mt-1" style={{ color: "var(--fg-muted)" }}>
                  {item.org}
                </p>
              </div>
              <span className="coord-label shrink-0 tabular-nums">{item.period}</span>
            </div>
            <p
              className="text-xs sm:text-[13px] leading-relaxed mb-3 max-w-xl"
              style={{ color: "var(--fg-muted)" }}
            >
              {item.description}
            </p>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 n-mono text-[11px] transition-colors hover:text-[var(--fg)]"
                style={{ color: "var(--fg-subtle)" }}
              >
                View certificate
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
