"use client";

import Image from "next/image";
import { useState, useEffect, type ReactNode } from "react";
import {
  personalInfo,
  socials,
  techStack,
} from "@/data/portfolio";
import { ThemeToggle } from "@/components/theme-toggle";
import { GitHubActivity } from "@/components/github-activity";
import { PinnedProjects } from "@/components/pinned-projects";
import { ContactForm } from "@/components/contact-form";
import {
  ExperienceSection,
  EducationSection,
} from "@/components/timeline-sections";
import { BuildsSection } from "@/components/builds-section";
import { VisitorSignal } from "@/components/visitor-signal";
import {
  FileText,
  Mail,
  ArrowUpRight,
  MapPin,
} from "lucide-react";

/* ========= ICONS ========= */
const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const socialIcons: Record<string, (p: { className?: string }) => React.ReactNode> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon,
};

/* ========= STAGGER ANIMATION ========= */
function FadeIn({
  children,
  index = 0,
  className = "",
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVis(true), 150);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 70}ms, transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 70}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ========= GLYPH PATTERN ========= */
function GlyphPattern({ pattern }: { pattern: number[] }) {
  return (
    <div className="glyph-pattern" aria-hidden>
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          className={`glyph-dot ${pattern.includes(i) ? "active" : ""}`}
        />
      ))}
    </div>
  );
}

/* ========= SECTION HEADER ========= */
function SectionHeader({
  code,
  title,
  pattern,
}: {
  code: string;
  title: string;
  pattern: number[];
}) {
  return (
    <div className="section-header flex items-center gap-4 mb-8">
      <GlyphPattern pattern={pattern} />
      <div className="min-w-0">
        <span className="coord-label block mb-1">{code}</span>
        <h2 className="n-heading text-xl sm:text-2xl">{title}</h2>
      </div>
    </div>
  );
}

/* ========= MAIN PAGE ========= */
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    setMounted(true);
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-0 sm:px-6 py-8 sm:py-10">
      {/* ===== TOP BAR ===== */}
      <FadeIn index={0}>
        <nav className="flex items-center justify-between mb-8 sm:mb-10 px-5 sm:px-0">
          <div className="flex items-center gap-3">
            <div className="red-dot" />
            <span
              className="n-mono text-xs tabular-nums"
              style={{ color: "var(--fg-muted)" }}
            >
              {mounted ? time : "--:--:--"}
            </span>
            <span className="coord-label hidden sm:inline">{"// LOCAL"}</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="status-indicator" />
              <span
                className="n-mono text-[11px] tracking-wider"
                style={{ color: "var(--fg-subtle)" }}
              >
                ONLINE
              </span>
            </div>
            <ThemeToggle />
          </div>
        </nav>
      </FadeIn>

      {/* X-style feed column: side rails + hairline dividers between blocks */}
      <div className="x-feed">
        {/* ===== HERO ===== */}
        <FadeIn index={1}>
          <section className="x-row py-10 px-5 sm:py-16 sm:px-7 scan-line">
            <div className="flex items-start gap-5 sm:gap-6 mb-6">
              <div className="relative shrink-0">
                <div className="n-card p-[3px]" style={{ width: "fit-content" }}>
                  <Image
                    src={personalInfo.avatar}
                    alt={`${personalInfo.name} profile`}
                    width={92}
                    height={92}
                    className="block w-[84px] h-[84px] sm:w-[92px] sm:h-[92px] object-cover"
                    style={{ imageRendering: "pixelated" }}
                    priority
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div
                  className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2"
                  style={{ borderColor: "var(--fg-subtle)" }}
                  aria-hidden
                />
              </div>

              <div className="pt-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="red-line" />
                  <span className="coord-label">SEC_01 / ID</span>
                </div>
                <h1 className="n-heading text-3xl sm:text-4xl mb-2 break-words">
                  {personalInfo.name}
                </h1>
                <p className="n-mono mb-2" style={{ color: "var(--fg-muted)" }}>
                  {personalInfo.tagline}
                </p>
                {personalInfo.location && (
                  <div
                    className="flex items-center gap-1.5 n-mono text-[11px]"
                    style={{ color: "var(--fg-subtle)" }}
                  >
                    <MapPin className="w-3 h-3" />
                    {personalInfo.location.toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <p
              className="text-sm leading-relaxed max-w-lg mb-6"
              style={{ color: "var(--fg-muted)" }}
            >
              {personalInfo.bio}
            </p>

            <div className="flex items-center gap-5 flex-wrap">
              <a
                href={`mailto:${personalInfo.email}`}
                className="n-btn hover:n-btn-primary"
              >
                <Mail className="w-3.5 h-3.5" />
                CONTACT
              </a>
              {personalInfo.resumeUrl && personalInfo.resumeUrl !== "#" && (
                <a
                  href={personalInfo.resumeUrl}
                  className="n-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  RESUME
                </a>
              )}
            </div>

            {/* X-style hairline before socials */}
            <div className="x-line my-6" />

            <div className="flex flex-wrap items-center gap-5">
              <span className="coord-label mr-3 hidden sm:inline">SOCIAL</span>
              {socials.map((s) => {
                const Icon = socialIcons[s.icon];
                return (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="n-icon-btn"
                    aria-label={s.name}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                  </a>
                );
              })}
            </div>
          </section>
        </FadeIn>

        {/* ===== BUILDS (true-coord + LoopNode) ===== */}
        <FadeIn index={2}>
          <BuildsSection />
        </FadeIn>

        {/* ===== PROJECTS ===== */}
        <FadeIn index={3}>
          <PinnedProjects />
        </FadeIn>

        {/* ===== EXPERIENCE ===== */}
        <FadeIn index={4}>
          <ExperienceSection />
        </FadeIn>

        {/* ===== EDUCATION ===== */}
        <FadeIn index={5}>
          <EducationSection />
        </FadeIn>

        {/* ===== TECH STACK ===== */}
        <FadeIn index={6}>
          <section className="x-row py-10 px-5 sm:py-16 sm:px-7">
            <SectionHeader
              code="SEC_03 / TOOLS"
              title="TECH STACK"
              pattern={[0, 4, 5, 9, 10, 12, 14, 15, 19, 20, 24]}
            />

            <div className="n-card-inner ticker-wrap mb-5">
              <div className="ticker-track py-3">
                {[...techStack, ...techStack].flatMap((cat, ci) =>
                  cat.items.map((item, ii) => (
                    <div
                      key={`${ci}-${ii}`}
                      className="flex items-center gap-2 px-4 shrink-0"
                    >
                      {mounted && (
                        <i
                          className={`${item.icon} text-[14px]`}
                          style={{ color: "var(--fg-subtle)" }}
                          aria-hidden
                        />
                      )}
                      <span className="n-mono whitespace-nowrap">
                        {item.name}
                      </span>
                      <span
                        className="w-1 h-1 ml-1 shrink-0"
                        style={{ background: "var(--fg-subtle)" }}
                        aria-hidden
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* X-style list of tech categories */}
            <div className="border-t" style={{ borderColor: "var(--line)" }}>
              {techStack.map((category) => (
                <div
                  key={category.name}
                  className="py-4 border-b last:border-b-0"
                  style={{ borderColor: "var(--line)" }}
                >
                  <span className="coord-label block mb-3">{category.name}</span>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {category.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center gap-2 group"
                      >
                        {mounted && (
                          <i
                            className={`${item.icon} text-[13px] transition-colors group-hover:text-[var(--fg)]`}
                            style={{ color: "var(--fg-subtle)" }}
                            aria-hidden
                          />
                        )}
                        <span className="n-mono text-[11px] group-hover:text-[var(--fg)] transition-colors">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* ===== GITHUB ACTIVITY ===== */}
        <FadeIn index={7}>
          <section className="x-row py-10 px-5 sm:py-16 sm:px-7">
            <SectionHeader
              code="SEC_04 / ACTIVITY"
              title="GITHUB"
              pattern={[1, 5, 9, 13, 17, 21]}
            />

            <GitHubActivity />
          </section>
        </FadeIn>

        {/* ===== CONNECT ===== */}
        <FadeIn index={8}>
          <section className="x-row py-10 px-5 sm:py-16 sm:px-7">
            <SectionHeader
              code="SEC_05 / LINK"
              title="CONNECT"
              pattern={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]}
            />

            <p
              className="text-sm leading-relaxed mb-2 max-w-md"
              style={{ color: "var(--fg-muted)" }}
            >
              Open to interesting conversations and collaboration opportunities.
              Let&apos;s build something remarkable.
            </p>

            <div className="x-line my-4" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              <div className="order-2 lg:order-1">
                <span className="coord-label block mb-4">CHANNELS</span>
                <div>
                  {socials.map((s) => {
                    const Icon = socialIcons[s.icon];
                    return (
                      <a
                        key={s.name}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="connect-row group"
                      >
                        <div className="flex items-center gap-3">
                          {Icon && (
                            <Icon className="w-4 h-4 transition-colors group-hover:text-[var(--fg)]" />
                          )}
                          <span className="n-mono">{s.name.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="coord-label hidden sm:inline opacity-0 group-hover:opacity-100 transition-opacity">
                            OPEN
                          </span>
                          <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-all" />
                        </div>
                      </a>
                    );
                  })}
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="connect-row group"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 transition-colors group-hover:text-[var(--fg)]" />
                      <span className="n-mono">MAIL</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="coord-label hidden sm:inline opacity-0 group-hover:opacity-100 transition-opacity truncate max-w-[160px]">
                        {personalInfo.email}
                      </span>
                      <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-all" />
                    </div>
                  </a>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <span className="coord-label block mb-4">DIRECT MESSAGE</span>
                <ContactForm />
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ===== FOOTER ===== */}
        <FadeIn index={9}>
          <footer className="x-row py-8 px-5 sm:py-10 sm:px-7">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="red-dot opacity-70" />
                <span
                  className="n-mono text-[11px]"
                  style={{ color: "var(--fg-subtle)" }}
                >
                  © {new Date().getFullYear()} {personalInfo.name.toUpperCase()}
                </span>
              </div>
              <VisitorSignal />
            </div>
          </footer>
        </FadeIn>
      </div>
    </div>
  );
}
