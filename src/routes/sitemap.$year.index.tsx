import { createFileRoute, Link } from "@tanstack/react-router";
import { ArchiveSearch } from "@/components/archive-search";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const Route = createFileRoute("/sitemap/$year/")({
  head: ({ params }) => ({
    meta: [
      { title: `Site Map ${params.year} | Jornal Web Digital` },
      {
        name: "description",
        content: `Jornal Web Digital news archive for ${params.year}, organized month by month.`,
      },
      { property: "og:title", content: `Site Map ${params.year} | Jornal Web Digital` },
      {
        property: "og:description",
        content: `The ${params.year} news archive from Jornal Web Digital.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: YearPage,
});

function YearPage() {
  const { year } = Route.useParams();

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <nav className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <Link to="/" className="link-underline">
          Site Map
        </Link>
        <span className="px-2">/</span>
        <span className="text-foreground">{year}</span>
      </nav>

      <h1 className="mt-4 border-b border-rule pb-6 font-display text-5xl tracking-tight">
        {year}
      </h1>

      <ArchiveSearch />

      <ul className="mt-8 grid grid-cols-2 gap-x-10 sm:grid-cols-3">
        {MONTHS.map((name, i) => (
          <li key={name} className="border-b border-rule">
            <Link
              to="/sitemap/$year/$month"
              params={{ year, month: String(i + 1).padStart(2, "0") }}
              className="block py-3 text-lg transition-colors hover:text-accent"
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
