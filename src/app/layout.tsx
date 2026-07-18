"use client";

import { Geist_Mono, Doto } from "next/font/google";
import { ClientWrappers } from "@/components/client-wrappers";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <title>MUHAMMAD HAMMAD — SOFTWARE ENGINEER</title>
        <meta
          name="description"
          content="Software engineer focused on end-to-end delivery. Strong in React, React Native, and .NET, with a parallel track as founder of open-source tooling and a live SaaS product."
        />
        <meta
          name="keywords"
          content="Muhammad Hammad, Software Engineer, Product Builder, Full Stack, React, React Native, .NET, true-coord, LoopNode"
        />
        <meta name="author" content="Muhammad Hammad" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Muhammad Hammad" />
        <meta
          property="og:description"
          content="Software engineer focused on end-to-end delivery. Strong in React, React Native, and .NET, with a parallel track as founder of open-source tooling and a live SaaS product."
        />
        <meta property="og:site_name" content="Muhammad Hammad" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
      </head>
      <body
        className={`${geistMono.variable} ${doto.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientWrappers>
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </ClientWrappers>
      </body>
    </html>
  );
}
