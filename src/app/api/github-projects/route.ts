import { NextResponse } from "next/server";
import { personalInfo, projectOverrides } from "@/data/portfolio";

export const revalidate = 3600;

type PinnedRepoNode = {
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: { name: string; color: string | null } | null;
  languages: { nodes: { name: string }[] };
};

type GraphQLResponse = {
  data?: {
    user?: {
      pinnedItems?: {
        nodes: (PinnedRepoNode | null)[];
      };
      repositories?: {
        nodes: PinnedRepoNode[];
      };
    };
  };
  errors?: { message: string }[];
};

const QUERY = `
  query($login: String!) {
    user(login: $login) {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            url
            homepageUrl
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
            languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
              nodes {
                name
              }
            }
          }
        }
      }
      repositories(
        first: 6
        privacy: PUBLIC
        ownerAffiliations: OWNER
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        nodes {
          name
          description
          url
          homepageUrl
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
          languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
            nodes {
              name
            }
          }
        }
      }
    }
  }
`;

const GRADIENTS = [
  "from-violet-500/20 to-purple-500/20",
  "from-sky-500/20 to-cyan-500/20",
  "from-amber-500/20 to-orange-500/20",
  "from-emerald-500/20 to-teal-500/20",
  "from-rose-500/20 to-pink-500/20",
  "from-indigo-500/20 to-blue-500/20",
];

function mapRepo(repo: PinnedRepoNode, index: number) {
  const override = projectOverrides[repo.name.toLowerCase()];
  const technologies =
    override?.technologies ??
    (repo.languages.nodes.length > 0
      ? repo.languages.nodes.map((l) => l.name)
      : repo.primaryLanguage
        ? [repo.primaryLanguage.name]
        : []);

  return {
    title: override?.title ?? repo.name,
    description:
      override?.description ??
      repo.description?.trim() ??
      "No description provided.",
    technologies,
    githubUrl: repo.url,
    liveUrl: override?.liveUrl ?? repo.homepageUrl ?? undefined,
    stars: repo.stargazerCount,
    forks: repo.forkCount,
    language: repo.primaryLanguage?.name,
    languageColor: repo.primaryLanguage?.color || undefined,
    gradient: GRADIENTS[index % GRADIENTS.length],
  };
}

export async function GET() {
  const username = personalInfo.githubUsername;
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return NextResponse.json(
      {
        error:
          "Missing GITHUB_TOKEN. Create a PAT with read:user and add it to .env.local",
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

    const user = json.data?.user;
    if (!user) {
      return NextResponse.json(
        { error: `User "${username}" not found` },
        { status: 404 },
      );
    }

    const pinned = (user.pinnedItems?.nodes ?? []).filter(
      (n): n is PinnedRepoNode => Boolean(n?.name),
    );

    // If nothing is pinned on the profile, fall back to recent public repos
    const source = pinned.length > 0 ? "pinned" : "recent";
    const repos = pinned.length > 0 ? pinned : (user.repositories?.nodes ?? []);

    return NextResponse.json({
      username,
      source,
      projects: repos.map(mapRepo),
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to fetch GitHub projects",
      },
      { status: 500 },
    );
  }
}
