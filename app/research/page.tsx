import type { Metadata } from "next";
import { DowngradeFigure } from "@/components/research/DowngradeFigure";
import { StackList } from "@/components/ui/PageIntro";
import { research } from "@/content/research";
import { site } from "@/content/site";
import { formatPeriod } from "@/lib/period";

export const metadata: Metadata = {
  title: "Research",
  description: research.question,
  alternates: { canonical: "/research" },
};

function H2({ id, n, children }: { id: string; n: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-display scroll-mt-24 text-2xl font-semibold tracking-tight">
      <span className="text-ink-soft mr-2 font-mono text-base">{n}</span>
      {children}
    </h2>
  );
}

export default function ResearchPage() {
  const facet = (id: string) => research.facets.find((f) => f.id === id)!;

  return (
    <article className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 sm:pt-16">
      {/* Styled as a paper: this section is about investigation, not shipping. */}
      <div className="border-line/20 rounded-[4px] border bg-[#fffdf8] px-5 py-10 shadow-[0_1px_0_rgba(0,0,0,0.04),0_18px_40px_-24px_rgba(43,38,32,0.35)] sm:px-14 sm:py-14">
        <header className="border-line border-b-2 pb-8 text-center">
          <p className="text-ink-soft font-mono text-xs tracking-[0.2em] uppercase">
            Things I&apos;ve investigated
          </p>
          <h1 className="font-display mx-auto mt-4 max-w-2xl text-[clamp(1.9rem,4.5vw,2.9rem)] leading-tight font-semibold tracking-tight">
            {research.question}
          </h1>
          <p className="mt-4 text-[0.95rem]">
            {site.name} · {research.role} · {research.org}
          </p>
          <p className="text-ink-soft mt-1 font-mono text-xs">{formatPeriod(research.period)}</p>
          <div className="mt-5 flex justify-center">
            <StackList items={research.stack} />
          </div>
          {research.relatedRepo && (
            <p className="text-ink-soft mx-auto mt-5 max-w-xl text-sm">
              <a
                href={research.relatedRepo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal font-semibold underline underline-offset-4"
              >
                Related public tool on GitHub ↗
                <span className="sr-only"> (opens in a new tab)</span>
              </a>{" "}
              · {research.relatedRepo.note}
            </p>
          )}
        </header>

        <div className="mt-10 grid gap-8 sm:grid-cols-[1fr_200px]">
          <section aria-labelledby="abstract">
            <H2 id="abstract" n="§0">
              Abstract
            </H2>
            <div className="prose-copy font-display mt-3 text-[1.08rem] leading-relaxed">
              {research.abstract.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
          <aside className="border-line bg-mustard-soft self-start rounded-2xl border-2 p-5 text-center">
            <p className="font-display text-6xl font-semibold">{research.result.value}</p>
            <p className="mt-1 font-semibold">{research.result.label}</p>
            <p className="text-ink-soft mt-2 text-xs">{research.result.caveat}</p>
          </aside>
        </div>

        <section aria-labelledby="pipeline" className="mt-12">
          <H2 id="pipeline" n="§1">
            Method
          </H2>
          <p className="text-ink-soft mt-2">{facet("pipeline").summary}</p>
          <figure className="mt-5">
            <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {research.pipeline.map((step, i) => (
                <li
                  key={step.name}
                  className="border-line bg-card relative rounded-xl border-2 p-3"
                >
                  <p className="text-terracotta-ink font-mono text-xs">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="font-semibold">{step.name}</p>
                  <p className="text-ink-soft mt-1 text-xs leading-snug">{step.detail}</p>
                </li>
              ))}
            </ol>
            <figcaption className="text-ink-soft mt-2 text-xs">
              Fig. 1. Pipeline, from capture to correlated, scored detections.
            </figcaption>
          </figure>
        </section>

        <section aria-labelledby="classification" className="mt-12">
          <H2 id="classification" n="§2">
            Detection
          </H2>
          <p className="text-ink-soft mt-2">{facet("classification").summary}</p>
          <div className="mt-5">
            <DowngradeFigure />
          </div>
        </section>

        <section aria-labelledby="confidence" className="mt-12">
          <H2 id="confidence" n="§3">
            Confidence, not certainty
          </H2>
          <blockquote className="border-terracotta font-display mt-4 border-l-4 pl-5 text-xl leading-relaxed italic">
            {research.philosophy}
          </blockquote>
          <p className="text-ink-soft mt-4">{facet("confidence").summary}</p>
        </section>

        <section aria-labelledby="ownership" className="mt-12 grid gap-8 sm:grid-cols-2">
          <div>
            <H2 id="ownership" n="§4">
              Owned end to end
            </H2>
            <ol className="mt-3 space-y-1.5">
              {research.ownership.map((o, i) => (
                <li key={o} className="flex gap-3">
                  <span className="text-ink-soft font-mono text-sm">{i + 1}.</span>
                  {o}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold">Presented to two audiences</h3>
            <ul className="mt-3 space-y-3">
              {research.audiences.map((a) => (
                <li key={a} className="bg-paper-deep rounded-xl p-3 text-[0.95rem]">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </article>
  );
}
