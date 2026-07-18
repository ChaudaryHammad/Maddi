import { NextResponse } from "next/server";

export const revalidate = 3600;

type NpmDownloads = {
  downloads: number;
  start: string;
  end: string;
  package: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pkg = searchParams.get("package") || "true-coord";

  if (!/^[a-z0-9@/_-]+$/i.test(pkg)) {
    return NextResponse.json({ error: "Invalid package name" }, { status: 400 });
  }

  try {
    const [metaRes, monthRes, yearRes, weekRes] = await Promise.all([
      fetch(`https://registry.npmjs.org/${encodeURIComponent(pkg)}/latest`, {
        next: { revalidate: 3600 },
      }),
      fetch(
        `https://api.npmjs.org/downloads/point/last-month/${encodeURIComponent(pkg)}`,
        { next: { revalidate: 3600 } },
      ),
      fetch(
        `https://api.npmjs.org/downloads/point/last-year/${encodeURIComponent(pkg)}`,
        { next: { revalidate: 3600 } },
      ),
      fetch(
        `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(pkg)}`,
        { next: { revalidate: 3600 } },
      ),
    ]);

    if (!metaRes.ok) {
      return NextResponse.json(
        { error: `Package "${pkg}" not found` },
        { status: 404 },
      );
    }

    const meta = (await metaRes.json()) as {
      name: string;
      version: string;
      description?: string;
    };
    const month = (await monthRes.json()) as NpmDownloads;
    const year = (await yearRes.json()) as NpmDownloads;
    const week = (await weekRes.json()) as NpmDownloads;

    let stars: number | null = null;
    const repoUrl =
      typeof (meta as { repository?: { url?: string } }).repository?.url ===
      "string"
        ? (meta as { repository: { url: string } }).repository.url
        : null;

    const githubMatch = repoUrl?.match(/github\.com[/:]([^/]+\/[^/.]+)/i);
    if (githubMatch) {
      const repo = githubMatch[1].replace(/\.git$/, "");
      try {
        const gh = await fetch(`https://api.github.com/repos/${repo}`, {
          headers: {
            "User-Agent": "hammad-portfolio",
            ...(process.env.GITHUB_TOKEN
              ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
              : {}),
          },
          next: { revalidate: 3600 },
        });
        if (gh.ok) {
          const ghJson = (await gh.json()) as { stargazers_count?: number };
          stars = ghJson.stargazers_count ?? null;
        }
      } catch {
        // stars optional
      }
    }

    return NextResponse.json({
      name: meta.name,
      version: meta.version,
      description: meta.description,
      downloads: {
        week: week.downloads ?? 0,
        month: month.downloads ?? 0,
        year: year.downloads ?? 0,
      },
      stars,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to fetch npm stats",
      },
      { status: 500 },
    );
  }
}
