"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        className="n-icon-btn"
        aria-label="Toggle theme"
        type="button"
      >
        <div className="w-4 h-4" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="n-icon-btn group"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      type="button"
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? (
        <i className="ri-sun-fill text-[15px]" />
      ) : (
        <i className="ri-moon-fill text-[15px]" />
      )}
    </button>
  );
}
