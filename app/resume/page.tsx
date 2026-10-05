import type { Metadata } from "next";
import { PrintButton } from "@/components/ui/PrintButton";
import { about } from "@/content/about";
import { getExperience } from "@/content/experience";
import { featuredProjects, projects, workbenchProjects } from "@/content/projects";
import { research } from "@/content/research";
import { site } from "@/content/site";
import { formatPeriod } from "@/lib/period";

export const metadata: Metadata = {
  title: "Resume",
  description: `The plain, printable version of ${site.name}'s experience and projects.`,
  alternates: { canonical: "/resume" },
};

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="border-ink/30 mt-8 border-b pb-1 text-xs font-bold tracking-[0.18em] uppercase">
      {children}
    </h2>
  );
}

function Role({ title, period }: { title: string; period: string }) {
  return (
    <p className="flex flex-wrap items-baseline justify-between gap-x-4">
      <span className="font-bold">{title}</span>
      <span className="text-ink-soft text-sm">{period}</span>
    </p>
  );
}

const ARMSOA_BULLETS = [
  "Owned the AI interface: Claude Opus and Sonnet recovery agents with live-state context, persistent sessions, confidence scoring and operator approval.",
  "Built Python and FastAPI services and React and TypeScript operator workflows, deployed with Docker.",
  "Wrote the API contract layer (OpenAPI, versioned JSON schemas) and implemented simulation and multi-run recovery logic.",
  "Wrote backend regression tests in a suite of 500+.",
];

/** Deliberately plain. Generated from the same content as the rest of the site. */
export default function ResumePage() {
  const armsoa = getExperience("armsoa");
  const ra = getExperience("resident-advisor");
  const projectsList = featuredProjects.filter((p) => p.context !== "professional");
  const skills = [...new Set([...projects.flatMap((p) => p.stack), ...research.stack])];

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-ink-soft font-mono text-xs tracking-wider uppercase">
          The Boring Version™
        </p>
        <div className="flex flex-wrap gap-2">
          {site.resumePdfs.map((pdf) => (
            <a
              key={pdf.href}
              href={pdf.href}
              download
              className="border-line bg-mustard shadow-hard rounded-full border-2 px-4 py-1.5 text-sm font-semibold"
            >
              {pdf.label} PDF
            </a>
          ))}
          <PrintButton />
        </div>
      </div>

      <article className="text-ink bg-white px-6 py-10 text-[0.95rem] leading-relaxed shadow-[0_18px_40px_-24px_rgba(43,38,32,0.35)] sm:px-12 print:p-0 print:shadow-none">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">{site.name}</h1>
          <p className="mt-1">
            {site.role} · {site.location}
          </p>
          <p className="mt-1 text-sm">
            <a href={`mailto:${site.email}`} className="underline">
              {site.email}
            </a>{" "}
            ·{" "}
            <a href={site.github} className="underline">
              GitHub
            </a>{" "}
            ·{" "}
            <a href={site.linkedin} className="underline">
              LinkedIn
            </a>
          </p>
        </header>

        <Heading>Experience</Heading>
        <section className="mt-3">
          <Role title={`${armsoa.role}, ${armsoa.org}`} period={formatPeriod(armsoa.period)} />
          <p className="text-ink-soft text-sm">{armsoa.summary}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {ARMSOA_BULLETS.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>
        <section className="mt-5">
          <Role
            title={`${research.role}, ${research.org}`}
            period={formatPeriod(research.period)}
          />
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Encrypted DNS downgrade detection: a data pipeline over real pcapng captures with{" "}
              {research.stack.slice(0, 4).join(", ")}.
            </li>
            <li>
              ML classification reaching {research.result.value} {research.result.label}, with
              correlations reported as confidence scores.
            </li>
            <li>
              Owned scoping, data collection, pipeline design, evaluation and stakeholder
              presentations.
            </li>
          </ul>
        </section>

        <Heading>Projects</Heading>
        {projectsList.map((p) => (
          <section key={p.slug} className="mt-3">
            <p>
              <span className="font-bold">{p.title}</span>{" "}
              <span className="text-ink-soft text-sm">({p.stack.join(", ")})</span>
            </p>
            <p>{p.oneLiner}</p>
          </section>
        ))}
        <p className="mt-3 text-sm">
          Also:{" "}
          {workbenchProjects
            .map(
              (p) =>
                `${p.title}${p.metrics ? ` (${p.metrics.map((m) => `${m.value} ${m.label}`).join(", ")})` : ""}`,
            )
            .join("; ")}
          .
        </p>

        <Heading>Education</Heading>
        <section className="mt-3">
          <Role
            title={`${about.education.degree}, ${about.education.school}`}
            period={formatPeriod(about.education.period)}
          />
          <p>{about.education.honours}.</p>
        </section>

        <Heading>Leadership</Heading>
        <section className="mt-3">
          <Role title={`${ra.role}, ${ra.org}`} period={formatPeriod(ra.period)} />
          <p>{ra.summary}</p>
        </section>

        <Heading>Technologies</Heading>
        <p className="mt-3">{skills.join(", ")}</p>
      </article>
    </div>
  );
}
