import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const BLOG = "https://jornalwebdigital.blogspot.com";

export type Post = {
  id: string;
  title: string;
  url: string;
  published: string;
  labels: string[];
};

const feedUrl = (params: Record<string, string>) =>
  `${BLOG}/feeds/posts/summary?${new URLSearchParams({ alt: "json", orderby: "published", ...params })}`;

function parseEntries(json: any): Post[] {
  const entries = json?.feed?.entry ?? [];
  return entries.map((e: any) => ({
    id: e.id?.$t ?? "",
    title: (e.title?.$t ?? "").trim() || "(sem título)",
    url:
      (e.link ?? []).find((l: any) => l.rel === "alternate")?.href ??
      BLOG,
    published: e.published?.$t ?? "",
    labels: (e.category ?? []).map((c: any) => c.term).filter(Boolean),
  }));
}

async function fetchRange(min: string, max: string, limit = 800): Promise<Post[]> {
  const out: Post[] = [];
  let start = 1;
  while (out.length < limit) {
    const res = await fetch(
      feedUrl({
        "max-results": "150",
        "start-index": String(start),
        "published-min": min,
        "published-max": max,
      }),
    );
    if (!res.ok) break;
    const batch = parseEntries(await res.json());
    out.push(...batch);
    if (batch.length < 150) break;
    start += 150;
  }
  return out;
}

const pad = (n: number) => String(n).padStart(2, "0");

export const getMonthPosts = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z.object({ year: z.number().int(), month: z.number().int().min(1).max(12) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { year, month } = data;
    const min = `${year}-${pad(month)}-01T00:00:00-03:00`;
    const nextY = month === 12 ? year + 1 : year;
    const nextM = month === 12 ? 1 : month + 1;
    const max = `${nextY}-${pad(nextM)}-01T00:00:00-03:00`;
    const posts = await fetchRange(min, max);
    posts.sort((a, b) => a.published.localeCompare(b.published));
    return posts;
  });

export const getYearMonthCounts = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ year: z.number().int() }).parse(data))
  .handler(async ({ data }) => {
    const { year } = data;
    const posts = await fetchRange(
      `${year}-01-01T00:00:00-03:00`,
      `${year + 1}-01-01T00:00:00-03:00`,
      20000,
    );
    const counts: number[] = Array(12).fill(0);
    for (const p of posts) {
      const m = Number(p.published.slice(5, 7));
      if (m >= 1 && m <= 12) counts[m - 1]! += 1;
    }
    return counts;
  });
