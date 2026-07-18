"use client";

import { useEffect, useState } from "react";
import { personalInfo } from "@/data/portfolio";

export function FigmaCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Check if device supports hover/fine pointer (desktop)
    const mq = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia("(pointer: fine)") : null;
    const isDesktop = mq ? mq.matches : false;
    if (!isDesktop) return;

    // Inject styles to hide the default cursor on all elements
    const style = document.createElement("style");
    style.id = "hide-cursor-style";
    style.innerHTML = `
      body, a, button, [role="button"], .n-btn, .n-card, .n-section, .n-card-inner, input, select, textarea {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    // Hover detection for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".n-card") ||
        target.closest(".n-btn") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver);

    // Hide original cursor by adding style to body
    document.body.style.cursor = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
      document.body.style.cursor = "auto";
      const styleEl = document.getElementById("hide-cursor-style");
      if (styleEl) styleEl.remove();
    };
  }, [isVisible]);

  if (!isVisible) return null;

  // Render Figma-style colored pointer + tag name
  return (
    <div
      className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-2px, -2px) scale(${isClicking ? 0.9 : isHovering ? 1.05 : 1})`,
      }}
    >
      {/* Figma Cursor Arrow SVG */}
      <svg
        width="14"
        height="19"
        viewBox="0 0 14 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
      >
        <path
          d="M0 0V18.5L5.13889 13.3611H13L0 0Z"
          fill={isHovering ? "var(--fg)" : "#000000"}
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* Figma Name Tag Badge */}
      <div
        className="absolute left-3 top-3.5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white select-none whitespace-nowrap rounded-r rounded-b shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
        style={{
          backgroundColor: isHovering ? "#333333" : "#000000",
          fontFamily: "var(--font-doto), monospace",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          transformOrigin: "top left",
          transform: "scale(0.95)",
        }}
      >
        {personalInfo.name.split(" ").at(-1)}
      </div>
    </div>
  );
}
