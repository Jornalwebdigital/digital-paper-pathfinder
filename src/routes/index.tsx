import { createFileRoute, Link } from "@tanstack/react-router";
import { ArchiveSearch } from "@/components/archive-search";
import { AdBanner } from '@/components/AdBanner';

const YEARS = Array.from({ length: 2026 - 2013 + 1 }, (_, i) => 2026 - i);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Site Map | Jornal Web Digital" },
      {
        name: "description",
        content:
          "Jornal Web Digital site map: browse the complete news archive by year, month, and day.",
      },
      { property: "og:title", content: "Site Map | Jornal Web Digital" },
      {
        property: "og:description",
        content: "The complete Jornal Web Digital news archive by year, month, and day.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SitemapIndex,
});

function SitemapIndex() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <header className="border-b border-rule pb-6">
        <p className="kicker">Jornal Web Digital</p>
        <h1 className="mt-3 font-display text-5xl leading-none tracking-tight">Site Map</h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          All content published by Jornal Web Digital, organized by year, month, and day. Choose a
          year to begin.
        </p>

        {/* Bloco de anúncio 1 — acima da pesquisa */}
        <AdBanner />

        <ArchiveSearch />

        {/* Bloco de anúncio 2 — abaixo da pesquisa */}
        <AdBanner />
      </header>

      <section className="mt-10">
        <h2 className="section-title">Archive by year</h2>
        <ul className="mt-5 grid grid-cols-2 gap-x-10 sm:grid-cols-3">
          {YEARS.map((y) => (
            <li key={y} className="border-b border-rule">
              <Link
                to="/sitemap/$year"
                params={{ year: String(y) }}
                className="block py-3 font-display text-2xl transition-colors hover:text-accent"
              >
                {y}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 border-t border-rule pt-6">
        <h2 className="section-title">Blog sections</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {[
            ["Home page", "https://jornalwebdigital.blogspot.com/"],
            ["News feed (Atom)", "https://jornalwebdigital.blogspot.com/feeds/posts/default"],
            ["Sitemap XML", "https://jornalwebdigital.blogspot.com/sitemap.xml"],
          ].map(([label, href]) => (
            <li key={href}>
              <a href={href} className="link-underline" rel="noreferrer">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
