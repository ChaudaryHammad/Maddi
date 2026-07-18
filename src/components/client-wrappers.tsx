"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";

const GlyphBackground = dynamic(() => import("@/components/glyph-background").then(m => m.GlyphBackground), { ssr: false });
const FigmaCursor = dynamic(() => import("@/components/figma-cursor").then(m => m.FigmaCursor), { ssr: false });

export function ClientWrappers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
      <GlyphBackground />
      <FigmaCursor />
      {children}
    </ThemeProvider>
  );
}
