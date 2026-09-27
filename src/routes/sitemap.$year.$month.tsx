import { createFileRoute, Link } from "@tanstack/react-router";
import { getMonthPosts, type Post } from "@/lib/blog.functions";

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

export const Route = createFileRoute("/sitemap/$year/$month")({
  loader: ({ params }) =>
    getMonthPosts({
      data: { year: Number(params.year), month: Number(params.month) },
    }),
  head: ({ params }) => {
    const label = `${MONTHS[Number(params.month) - 1] ?? params.month} de ${params.year}`;
    return {
      meta: [
        { title: `Mapa do Site — ${label} | Jornal Web Digital` },
        {
          name: "description",
          content: `Todas as notícias publicadas pelo Jornal Web Digital em ${label}, listadas por dia.`,
        },
        { property: "og:title", content: `Mapa do Site — ${label} | Jornal Web Digital` },
        {
          property: "og:description",
          content: `Notícias do Jornal Web Digital em ${label}, dia a dia.`,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: MonthPage,
});

function MonthPage() {
  const { year, month } = Route.useParams();
  const posts = Route.useLoaderData() as Post[];
  const monthName = MONTHS[Number(month) - 1] ?? month;

  const byDay = new Map<string, Post[]>();
  for (const p of posts) {
    const day = p.published.slice(0, 10);
    const list = byDay.get(day) ?? [];
    list.push(p);
    byDay.set(day, list);
  }
  const days = [...byDay.keys()].sort();

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <nav className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <Link to="/" className="link-underline">
          Mapa do Site
        </Link>
        <span className="px-2">/</span>
        <Link to="/sitemap/$year" params={{ year }} className="link-underline">
          {year}
        </Link>
        <span className="px-2">/</span>
        <span className="text-foreground">{monthName}</span>
      </nav>

      <header className="mt-4 border-b border-rule pb-6">
        <h1 className="font-display text-5xl tracking-tight">
          {monthName} <span className="text-muted-foreground">{year}</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {posts.length === 0
            ? "Nenhuma publicação encontrada neste mês."
            : `${posts.length} publicaç${posts.length === 1 ? "ão" : "ões"} em ${days.length} dia${days.length === 1 ? "" : "s"}.`}
        </p>
      </header>

      <div className="mt-10 space-y-10">
        {days.map((day) => (
          <section key={day}>
            <h2 className="section-title border-b border-rule pb-2">
              {Number(day.slice(8, 10))} de {monthName}
            </h2>
            <ul className="mt-4 space-y-3">
              {byDay.get(day)!.map((p) => (
                <li key={p.id} className="leading-snug">
                  <a href={p.url} className="link-underline" rel="noreferrer">
                    {p.title}
                  </a>
                  {p.labels.length > 0 && (
                    <span className="ml-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {p.labels.slice(0, 3).join(" · ")}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
