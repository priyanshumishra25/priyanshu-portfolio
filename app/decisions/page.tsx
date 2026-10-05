import type { Metadata } from "next";
import Link from "next/link";
import { DecisionDiagram } from "@/components/decisions/DecisionDiagram";
import { PageIntro } from "@/components/ui/PageIntro";
import { decisions } from "@/content/decisions";

export const metadata: Metadata = {
  title: "Decisions I've Made",
  description:
    "Short write-ups of engineering trade-offs: human-in-the-loop AI, honest state, API contracts, missing data, process isolation and confidence.",
  alternates: { canonical: "/decisions" },
};

export default function DecisionsPage() {
  return (
    <>
      <PageIntro eyebrow="The notebook" title="Decisions I've Made">
        Not a blog. Six choices from real projects, what I traded away for each one, and why I would
        make them again. Each takes a minute or two to read.
      </PageIntro>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav aria-label="Decisions index" className="mb-10">
          <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {decisions.map((d) => (
              <li key={d.id}>
                <a
                  href={`#${d.slug}`}
                  className="border-line/20 bg-card hover:border-line hover:bg-mustard-soft flex h-full gap-3 rounded-xl border px-4 py-3 text-[0.95rem] transition-colors"
                >
                  <span className="text-terracotta-ink font-mono text-sm">{d.number}</span>
                  <span className="font-medium">{d.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-10">
          {decisions.map((d, i) => (
            <article
              key={d.id}
              id={d.slug}
              aria-labelledby={`${d.slug}-title`}
              className={`border-line bg-card shadow-hard-lg relative scroll-mt-24 overflow-hidden rounded-[22px] border-2 ${
                i % 2 ? "md:rotate-[0.25deg]" : "md:-rotate-[0.25deg]"
              }`}
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(110,143,191,0.18) 31px, rgba(110,143,191,0.18) 32px)",
              }}
            >
              <div
                aria-hidden
                className="bg-terracotta/40 absolute inset-y-0 left-10 hidden w-0.5 sm:block"
              />
              <div className="grid gap-8 p-6 sm:py-10 sm:pr-10 sm:pl-16 lg:grid-cols-[1fr_240px]">
                <div className="max-w-2xl">
                  <p className="text-terracotta-ink font-mono text-sm">Decision {d.number}</p>
                  <h2
                    id={`${d.slug}-title`}
                    className="font-display mt-1 text-[1.9rem] leading-tight font-semibold tracking-tight"
                  >
                    {d.title}
                  </h2>
                  <p className="text-ink-soft mt-2 text-sm italic">{d.context}</p>
                  <div className="prose-copy mt-6 text-[1.04rem] leading-8">
                    {d.body.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                  <p className="bg-mustard-soft font-display mt-6 inline box-decoration-clone px-1 text-xl leading-9 italic">
                    {d.takeaway}
                  </p>
                </div>
                <aside className="space-y-5 lg:pt-10">
                  <div className="border-line/30 bg-paper/70 rounded-2xl border-2 border-dashed p-3">
                    <DecisionDiagram id={d.id} />
                  </div>
                  <div>
                    <p className="text-ink-soft font-mono text-[0.7rem] tracking-wider uppercase">
                      See it in
                    </p>
                    <ul className="mt-1 space-y-1 text-sm">
                      {d.related.map((r) => (
                        <li key={r.href}>
                          <Link
                            className="text-teal font-semibold underline-offset-4 hover:underline"
                            href={r.href}
                          >
                            → {r.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
