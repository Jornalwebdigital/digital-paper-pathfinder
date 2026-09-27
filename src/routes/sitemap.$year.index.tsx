import { createFileRoute, Link } from "@tanstack/react-router";

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const Route = createFileRoute("/sitemap/$year/")({
  head: ({ params }) => ({
    meta: [
      { title: `Mapa do Site ${params.year} | Jornal Web Digital` },
      {
        name: "description",
        content: `Arquivo de notícias do Jornal Web Digital publicadas em ${params.year}, mês a mês.`,
      },
      { property: "og:title", content: `Mapa do Site ${params.year} | Jornal Web Digital` },
      {
        property: "og:description",
        content: `Arquivo de notícias de ${params.year} no Jornal Web Digital.`,
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
          Mapa do Site
        </Link>
        <span className="px-2">/</span>
        <span className="text-foreground">{year}</span>
      </nav>

      <h1 className="mt-4 border-b border-rule pb-6 font-display text-5xl tracking-tight">
        {year}
      </h1>

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
