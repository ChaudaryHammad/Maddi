import { NextResponse } from "next/server";
import { personalInfo } from "@/data/portfolio";

export const revalidate = 3600; // cache for 1 hour

type ContributionDay = {
  date: string;
  contributionCount: number;
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
};

type GraphQLResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: { contributionDays: ContributionDay[] }[];
        };
      };
    };
  };
  errors?: { message: string }[];
};

const LEVEL_MAP: Record<ContributionDay["contributionLevel"], 0 | 1 | 2 | 3 | 4> =
  {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
  };

const QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

export async function GET() {
  const username = personalInfo.githubUsername;
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return NextResponse.json(
      {
        error:
          "Missing GITHUB_TOKEN. Create a fine-grained or classic PAT with read:user and add it to .env.local",
      },
      { status: 500 },
    );
  }

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "hammad-portfolio",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { login: username },
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `GitHub API error: ${res.status}`, detail: text },
        { status: 502 },
      );
    }

    const json = (await res.json()) as GraphQLResponse;

    if (json.errors?.length) {
      return NextResponse.json(
        { error: json.errors.map((e) => e.message).join("; ") },
        { status: 502 },
      );
    }

    const calendar =
      json.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      return NextResponse.json(
        { error: `User "${username}" not found or has no contribution data` },
        { status: 404 },
      );
    }

    const days = calendar.weeks.flatMap((w) => w.contributionDays);
    let best = 0;
    let active = 0;

    const contributions = days.map((day) => {
      if (day.contributionCount > best) best = day.contributionCount;
      if (day.contributionCount > 0) active += 1;
      return {
        date: day.date,
        count: day.contributionCount,
        level: LEVEL_MAP[day.contributionLevel] ?? 0,
      };
    });

    return NextResponse.json({
      username,
      source: "github-graphql",
      total: calendar.totalContributions,
      best,
      active,
      contributions,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to fetch GitHub stats",
      },
      { status: 500 },
    );
  }
}
