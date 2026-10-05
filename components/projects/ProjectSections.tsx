import Link from "next/link";
import { getDecision } from "@/content/decisions";
import type { FeaturedProject } from "@/content/types";
import { SectionLabel } from "@/components/ui/PageIntro";

function Section({
  id,
  n,
  title,
  children,
}: {
  id: string;
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={`${id}-h`}
      className="border-line/15 grid gap-5 border-t-2 border-dashed py-10 md:grid-cols-[240px_1fr]"
    >
      <SectionLabel n={n} id={`${id}-h`}>
        {title}
      </SectionLabel>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export function ArchitectureDiagram({
  intro,
  layers,
  style = "layers",
}: FeaturedProject["architecture"]) {
  return (
    <figure>
      <figcaption className="text-ink-soft mb-4">{intro}</figcaption>
      <ol className="space-y-0">
        {layers.map((l, i) => (
          <li key={l.name} className="relative">
            <div className="border-line bg-card grid gap-1 rounded-2xl border-2 p-4 sm:grid-cols-[180px_1fr] sm:gap-4">
              <p className="font-mono text-sm font-semibold">
                <span className="text-terracotta-ink">
                  {style === "layers" ? `L${layers.length - i}` : String(i + 1).padStart(2, "0")}
                </span>{" "}
                {l.name}
              </p>
              <p className="text-ink-soft text-[0.95rem]">{l.detail}</p>
            </div>
            {i < layers.length - 1 && <div aria-hidden className="bg-line/40 ml-8 h-5 w-0.5" />}
          </li>
        ))}
      </ol>
    </figure>
  );
}

export function ProjectSections({ project }: { project: FeaturedProject }) {
  const decisions = project.decisionIds.map(getDecision).filter((d) => d !== undefined);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <Section id="problem" n="01" title="Problem">
        <div className="prose-copy max-w-2xl text-[1.05rem] leading-relaxed">
          {project.problem.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Section>

      <Section id="owned" n="02" title="What I Built / Owned">
        <ul className="max-w-2xl space-y-2">
          {project.owned.map((o) => (
            <li key={o} className="flex gap-3">
              <span aria-hidden className="bg-teal mt-2.5 size-2 shrink-0 rounded-full" />
              <span>{o}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <p className="text-ink-soft mb-3 font-mono text-xs tracking-wider uppercase">
            The parts, in detail
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {project.facets.map((f) => (
              <li
                key={f.id}
                id={f.id}
                className="border-line/20 bg-paper-deep/60 target:border-terracotta target:bg-mustard-soft scroll-mt-24 rounded-2xl border p-4 target:border-2"
              >
                <p className="font-semibold">{f.label}</p>
                <p className="text-ink-soft mt-1 text-sm">{f.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="architecture" n="03" title={project.architecture.heading ?? "Architecture"}>
        <ArchitectureDiagram {...project.architecture} />
      </Section>

      <Section id="decisions" n="04" title="Interesting Decisions">
        <div className="grid gap-4 lg:grid-cols-2">
          {project.interesting.map((d) => (
            <article key={d.title} className="border-line bg-card rounded-2xl border-2 p-5">
              <h3 className="font-display text-lg font-semibold">{d.title}</h3>
              <p className="text-ink-soft mt-2 text-[0.95rem]">{d.body}</p>
            </article>
          ))}
        </div>
        {decisions.length > 0 && (
          <p className="mt-5 text-sm">
            Longer write-ups:{" "}
            {decisions.map((d, i) => (
              <span key={d.id}>
                {i > 0 && " · "}
                <Link
                  className="text-teal font-semibold underline-offset-4 hover:underline"
                  href={`/decisions#${d.slug}`}
                >
                  {d.number} {d.title}
                </Link>
              </span>
            ))}
          </p>
        )}
      </Section>

      <Section id="failure-modes" n="05" title="Failure Modes">
        <dl className="divide-line/15 border-line bg-card divide-y overflow-hidden rounded-2xl border-2">
          {project.failureModes.map((f) => (
            <div key={f.failure} className="grid gap-1 p-4 sm:grid-cols-2 sm:gap-6">
              <dt className="flex gap-2">
                <span aria-hidden className="text-danger font-mono">
                  ✕
                </span>
                <span>
                  <span className="sr-only">If: </span>
                  {f.failure}
                </span>
              </dt>
              <dd className="text-ink-soft flex gap-2">
                <span aria-hidden className="text-teal font-mono">
                  ↳
                </span>
                <span>
                  <span className="sr-only">Then: </span>
                  {f.response}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="shipped" n="06" title="What I Shipped">
        <ul className="grid max-w-3xl gap-2 sm:grid-cols-2">
          {project.shipped.map((s) => (
            <li key={s} className="bg-teal-soft/70 flex gap-2.5 rounded-xl px-4 py-3">
              <span aria-hidden className="text-teal font-mono">
                ✓
              </span>
              {s}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="learned" n="07" title="What I Learned">
        <div className="prose-copy font-display max-w-2xl text-xl leading-relaxed italic">
          {project.learned.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
      </Section>
    </div>
  );
}
