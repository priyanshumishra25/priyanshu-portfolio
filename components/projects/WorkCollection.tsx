"use client";

import Link from "next/link";
import { useState } from "react";
import { StackList } from "@/components/ui/PageIntro";
import type { FeaturedProject, ProjectCategory, WorkbenchProject } from "@/content/types";
import { ProjectGlyph } from "./ProjectGlyph";
import { ProjectLinks } from "./ProjectLinks";

const CATEGORY_ORDER: ProjectCategory[] = [
  "Full Stack",
  "Backend",
  "AI",
  "Machine Learning",
  "Computer Vision",
  "Systems",
  "Developer Tooling",
  "Distributed Systems",
  "Networking",
];

interface Props {
  featured: FeaturedProject[];
  workbench: WorkbenchProject[];
  contextLabels: Record<string, string>;
}

function Meta({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-ink-soft font-mono text-[0.7rem] tracking-wider uppercase">{children}</p>
  );
}

export function WorkCollection({ featured, workbench, contextLabels }: Props) {
  const [category, setCategory] = useState<ProjectCategory | null>(null);
  const present = new Set([...featured, ...workbench].flatMap((p) => p.categories));
  const categories = CATEGORY_ORDER.filter((c) => present.has(c));
  const keep = <T extends { categories: ProjectCategory[] }>(p: T) =>
    !category || p.categories.includes(category);

  const shownFeatured = featured.filter(keep);
  const shownWorkbench = workbench.filter(keep);
  const [flagship, ...rest] = shownFeatured;
  const flagshipIsFirst = flagship?.slug === featured[0]?.slug;

  const chip = "rounded-full border px-3 py-1 text-[0.82rem] transition-colors";
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div
        role="group"
        aria-label="Filter projects by category"
        className="mb-6 flex flex-wrap gap-1.5"
      >
        <button
          type="button"
          aria-pressed={category === null}
          onClick={() => setCategory(null)}
          className={`${chip} ${category === null ? "border-line bg-ink text-paper" : "border-line/25 hover:border-line bg-card"}`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => setCategory(category === c ? null : c)}
            className={`${chip} ${category === c ? "border-line bg-ink text-paper" : "border-line/25 hover:border-line bg-card"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-5" aria-live="polite">
        {flagship && flagshipIsFirst && (
          <Link
            href={`/work/${flagship.slug}`}
            className="group border-line bg-card shadow-hard-lg grid gap-6 rounded-3xl border-2 p-6 transition-transform hover:-translate-y-1 sm:p-8 md:grid-cols-[1fr_220px]"
          >
            <div>
              <p className="text-terracotta-ink font-mono text-xs tracking-wider uppercase">
                Flagship · {contextLabels[flagship.context]} · {flagship.role}
              </p>
              <h2 className="font-display mt-3 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                {flagship.question}
              </h2>
              <p className="mt-2 font-semibold">{flagship.title}</p>
              <p className="text-ink-soft mt-3 max-w-2xl">{flagship.oneLiner}</p>
              <div className="mt-5">
                <StackList items={flagship.stack} />
              </div>
              <p className="text-teal mt-6 font-semibold">
                Break the network yourself{" "}
                <span
                  aria-hidden
                  className="inline-block transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </p>
            </div>
            <ProjectGlyph slug={flagship.slug} className="hidden w-full self-center md:block" />
          </Link>
        )}

        <ul className="grid gap-5 md:grid-cols-2">
          {(flagshipIsFirst ? rest : shownFeatured).map((p) => (
            <li key={p.slug}>
              <Link
                href={`/work/${p.slug}`}
                className="group border-line bg-card shadow-hard flex h-full flex-col rounded-3xl border-2 p-6 transition-transform hover:-translate-y-1"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <ProjectGlyph slug={p.slug} className="h-20 w-auto" />
                  <Meta>{contextLabels[p.context]}</Meta>
                </div>
                <h2 className="font-display text-xl leading-snug font-semibold">{p.question}</h2>
                <p className="mt-2 text-sm font-semibold">{p.title}</p>
                <p className="text-ink-soft mt-2 flex-1 text-sm">{p.oneLiner}</p>
                <div className="mt-4">
                  <StackList items={p.stack} />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {shownWorkbench.length > 0 && (
          <section aria-labelledby="workbench-h" className="pt-12">
            <h2
              id="workbench-h"
              className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              The Rest of the Workbench
            </h2>
            <p className="text-ink-soft mt-2 max-w-2xl">
              Smaller builds that did not get a mini-game but are worth a look. Open one for the
              interesting part.
            </p>
            <ul className="mt-6 grid gap-6 md:grid-cols-2">
              {shownWorkbench.map((p, i) => (
                <li
                  key={p.slug}
                  id={p.slug}
                  className={`border-line/25 bg-card target:border-terracotta relative scroll-mt-24 rounded-md border-2 p-5 pt-7 shadow-[3px_4px_0_rgba(43,38,32,0.15)] ${
                    i % 2 ? "md:rotate-[0.5deg]" : "md:-rotate-[0.5deg]"
                  }`}
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, transparent 30px, rgba(194,80,47,0.35) 30px, rgba(194,80,47,0.35) 31px, transparent 31px)",
                  }}
                >
                  <span
                    aria-hidden
                    className="bg-mustard/70 absolute -top-2.5 left-1/2 h-5 w-20 -translate-x-1/2 -rotate-2"
                  />
                  <div className="flex items-start gap-4">
                    <ProjectGlyph slug={p.slug} className="h-14 w-auto shrink-0" />
                    <div className="min-w-0">
                      <Meta>
                        {contextLabels[p.context]}
                        {p.event ? ` · ${p.event}` : ""}
                      </Meta>
                      <h3 className="font-display mt-1 text-xl font-semibold">{p.title}</h3>
                      <p className="font-display mt-1 italic">&ldquo;{p.question}&rdquo;</p>
                    </div>
                  </div>
                  <p className="text-ink-soft mt-3 text-sm">{p.oneLiner}</p>
                  <p className="mt-3 font-mono text-xs">{p.stack.join(" · ")}</p>
                  {p.metrics && (
                    <ul className="mt-3 flex flex-wrap gap-2" aria-label="Results">
                      {p.metrics.map((m) => (
                        <li
                          key={m.label}
                          className="bg-mustard-soft rounded-md px-2 py-0.5 text-sm"
                        >
                          <strong>{m.value}</strong> {m.label}
                        </li>
                      ))}
                    </ul>
                  )}
                  <details className="group/details mt-3">
                    <summary className="text-teal cursor-pointer text-sm font-semibold">
                      Read more
                    </summary>
                    <div className="prose-copy text-ink-soft mt-2 text-sm">
                      {p.details.map((d) => (
                        <p key={d}>{d}</p>
                      ))}
                    </div>
                  </details>
                  <ProjectLinks project={p} className="mt-4" />
                </li>
              ))}
            </ul>
          </section>
        )}

        {shownFeatured.length === 0 && shownWorkbench.length === 0 && (
          <p className="text-ink-soft">Nothing in this category yet.</p>
        )}
      </div>
    </div>
  );
}
