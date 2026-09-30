import { createFileRoute, Link } from "@tanstack/react-router";
import { ArchiveSearch } from "@/components/archive-search";
import { AdBanner } from "@/components/AdBanner";
import { searchPosts } from "@/lib/blog.functions";

const searchSchema = (search: Record<string, unknown>) => ({
  q: typeof search["q"] === "string" ? search["q"] : "",
});

const formatPublishedDate = (published: string) => {
  const [year = "", month = "", day = ""] = published.slice(0, 10).split("-");
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ query: search.q.trim().slice(0, 120) }),
  loader: ({ deps }) => searchPosts({ data: { query: deps.query } }),
  head: () => ({
    meta: [
      { title: "Search the Archive | Jornal Web Digital" },
      {
        name: "description",
        content: "Search stories in the Jornal Web Digital archive.",
      },
      { property: "og:title", content: "Search the Archive | Jornal Web Digital" },
      {
        property: "og:description",
        content: "Search stories in the Jornal Web Digital archive.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const posts = Route.useLoaderData();
  const query = q.trim();

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <nav className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <Link to="/" className="link-underline">
          Site Map
        </Link>
        <span className="px-2">/</span>
        <span className="text-foreground">Search</span>
      </nav>

      <header className="mt-4 border-b border-rule pb-8">
        <h1 className="font-display text-5xl leading-none tracking-tight">Search the Archive</h1>
        <AdBanner placement="aboveSearch" />
        <ArchiveSearch defaultValue={q} />
        <AdBanner placement="belowSearch" />
      </header>

      <section className="mt-10">
        {query.length < 2 ? (
          <p className="text-sm text-muted-foreground">Enter at least two characters to search.</p>
        ) : (
          <>
            <h2 className="section-title border-b border-rule pb-3">
              {posts.length === 0
                ? `No results for “${query}”`
                : `${posts.length} ${posts.length === 1 ? "result" : "results"} for “${query}”`}
            </h2>
            <ul className="divide-y divide-rule">
              {posts.map((post) => (
                <li key={post.id} className="py-5">
                  <a
                    href={post.url}
                    className="font-display text-lg leading-snug transition-colors hover:text-accent"
                    rel="noreferrer"
                  >
                    {post.title}
                  </a>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {formatPublishedDate(post.published)}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
      <AdBanner placement="belowContent" />
    </main>
  );
}