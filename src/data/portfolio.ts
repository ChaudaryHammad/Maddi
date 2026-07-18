export const personalInfo = {
  name: "Muhammad Hammad",
  tagline: "Code, Create & Innovate!",
  bio: "Software engineer focused on end-to-end delivery. Strong in React, React Native, and .NET, with a parallel track as founder of open-source tooling and a live SaaS product.",
  email: "hammad.node@gmail.com",
  location: "Pakistan",
  resumeUrl:
    "https://drive.google.com/file/d/18UNz3pRb6CzakpLKmfPrTAHeZqL3O0jY/view?usp=sharing",
  /** GitHub profile avatar — swap for a local /images/ file anytime */
  avatar: "https://github.com/ChaudaryHammad.png",
  bannerLight: "",
  bannerDark: "",
  githubUsername: "ChaudaryHammad",
  phone: "+92 314 6146 470",
};

export const socials = [
  {
    name: "GitHub",
    url: "https://github.com/ChaudaryHammad",
    icon: "github",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/mdhamad/",
    icon: "linkedin",
  },
  {
    name: "X",
    url: "https://x.com/hammad_node",
    icon: "twitter",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/hammad.node",
    icon: "instagram",
  },
];

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
}

export const experiences: Experience[] = [
  {
    company: "SDSol Technologies",
    role: "Frontend Developer",
    period: "Mar 2025 — Present",
    description:
      "I build web and mobile interfaces day to day with React and React Native — shipping clean, responsive UI and working with the team to get solid product out.",
    technologies: [
      "React.js",
      "React Native",
      "TypeScript",
      "Tailwind CSS",
      "JavaScript",
    ],
  },
];

export interface Education {
  title: string;
  org: string;
  period: string;
  description: string;
  link?: string;
}

export const education: Education[] = [
  {
    title: "Bachelor's in Computer Science",
    org: "COMSATS University Islamabad",
    period: "Sep 2020 — Jul 2024",
    description:
      "Graduated with a Bachelor of Computer Science in 2024. Built a solid foundation in software development, data structures, algorithms, and database management through coursework and hands-on projects.",
  },
];

export type BuildProduct = {
  id: string;
  kind: "npm" | "product";
  name: string;
  label: string;
  description: string;
  tags: string[];
  links: { label: string; url: string }[];
  /** npm package name — enables live download stats */
  npmPackage?: string;
  githubRepo?: string;
};

export const builds: BuildProduct[] = [
  {
    id: "true-coord",
    kind: "npm",
    name: "true-coord",
    label: "NPM",
    description:
      "Zero-config geocoding library I built for myself first — offline country data for 250+ countries, free OpenStreetMap geocoding, no API keys.",
    tags: ["JavaScript", "Geocoding", "Open Source"],
    npmPackage: "true-coord",
    githubRepo: "ChaudaryHammad/true-coord",
    links: [
      { label: "npm", url: "https://www.npmjs.com/package/true-coord" },
      {
        label: "GitHub",
        url: "https://github.com/ChaudaryHammad/true-coord",
      },
    ],
  },
  {
    id: "loopnode",
    kind: "product",
    name: "LoopNode",
    label: "SAAS",
    description:
      "Website health command center — Lighthouse performance, axe-core accessibility, SEO, and security audits in one dashboard so you catch issues before users do.",
    tags: ["SaaS", "Audits", "Performance", "A11y"],
    links: [
      { label: "Live", url: "https://loopnode.vercel.app" },
    ],
  },
];

/**
 * Richer copy for known repos (overrides GitHub description when present).
 * Keys are case-insensitive repo names.
 */
export const projectOverrides: Record<
  string,
  { title?: string; description?: string; technologies?: string[]; liveUrl?: string }
> = {
  autoessentials: {
    title: "AutoEssentials — FYP",
    description:
      "Multi-vendor e-commerce platform connecting car owners with premium auto parts, plus real-time CNN-based inspection tools for safety and maintenance.",
    technologies: ["React", "Node.js", "MongoDB", "Express.js"],
    liveUrl: "https://autoessentials.vercel.app/",
  },
  runo: {
    title: "Runo",
    description:
      "Full-stack blogging app with authentication, commenting, and post categorization.",
    technologies: ["HTML", "CSS", "Angular", "Firebase"],
    liveUrl: "https://runo-nine.vercel.app",
  },
  passsense: {
    title: "PassSense",
    description:
      "Password / credentials companion built with React — focused on a clean, practical UX.",
    technologies: ["HTML", "CSS", "React", "Bootstrap"],
    liveUrl: "https://pass-sense.vercel.app",
  },
  "expense-tracking-app": {
    title: "Expense Tracking App",
    description:
      "Track expenses and manage finances with a React + GraphQL stack.",
    technologies: ["React", "GraphQL", "Tailwind CSS"],
  },
};

export interface Project {
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  gradient: string;
}

/** Projects are loaded live from GitHub pinned repos via /api/github-projects */

export interface TechCategory {
  name: string;
  items: { name: string; icon: string }[];
}

export const techStack: TechCategory[] = [
  {
    name: "Languages",
    items: [
      { name: "TypeScript", icon: "devicon-typescript-plain" },
      { name: "JavaScript", icon: "devicon-javascript-plain" },
      { name: "C#", icon: "devicon-csharp-plain" },
      { name: "SQL", icon: "devicon-azuresqldatabase-plain" },
    ],
  },
  {
    name: "Frontend",
    items: [
      { name: "React", icon: "devicon-react-original" },
      { name: "React Native", icon: "devicon-react-original" },
      { name: "Next.js", icon: "devicon-nextjs-plain" },
      { name: "Tailwind", icon: "devicon-tailwindcss-original" },
      { name: "HTML5", icon: "devicon-html5-plain" },
    ],
  },
  {
    name: "Backend",
    items: [
      { name: "Node.js", icon: "devicon-nodejs-plain" },
      { name: "Express", icon: "devicon-express-original" },
      { name: ".NET", icon: "devicon-dotnetcore-plain" },
      { name: "ASP.NET", icon: "devicon-dotnetcore-plain" },
      { name: "MongoDB", icon: "devicon-mongodb-plain" },
      { name: "SQL Server", icon: "devicon-microsoftsqlserver-plain" },
    ],
  },
  {
    name: "Tools",
    items: [
      { name: "Git", icon: "devicon-git-plain" },
      { name: "VS Code", icon: "devicon-vscode-plain" },
      { name: "Firebase", icon: "devicon-firebase-plain" },
    ],
  },
];
