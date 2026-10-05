import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChipEasterEgg } from "@/components/projects/ChipEasterEgg";
import { ProjectDemo } from "@/components/projects/ProjectDemo";
import { ProjectLinks } from "@/components/projects/ProjectLinks";
import { ProjectSections } from "@/components/projects/ProjectSections";
import { PageIntro, StackList } from "@/components/ui/PageIntro";
import { contextLabels, featuredProjects, getFeaturedProject } from "@/content/projects";
import { formatPeriod } from "@/lib/period";

export function generateStaticParams() {
  return featuredProjects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getFeaturedProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: `${project.question} ${project.oneLiner}`,
    alternates: { canonical: `/work/${slug}` },
  };
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getFeaturedProject(slug);
  if (!project) notFound();

  const index = featuredProjects.findIndex((p) => p.slug === project.slug);
  const next = featuredProjects[(index + 1) % featuredProjects.length]!;
  const eyebrow = [
    contextLabels[project.context],
    project.role,
    project.period && formatPeriod(project.period),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article>
      <PageIntro
        eyebrow={eyebrow}
        title={project.question}
        aside={project.slug === "midpoint-fuzzer" ? <ChipEasterEgg /> : undefined}
      >
        <p className="text-ink font-semibold">{project.title}</p>
        <p className="mt-2">{project.oneLiner}</p>
        <div className="mt-5">
          <StackList items={project.stack} />
        </div>
        {project.metrics && (
          <dl className="mt-5 flex flex-wrap gap-3">
            {project.metrics.map((m) => (
              <div
                key={m.label}
                className="border-line bg-mustard-soft rounded-xl border-2 px-3 py-1.5"
              >
                <dt className="sr-only">{m.label}</dt>
                <dd className="text-ink text-sm">
                  <span className="font-display text-xl font-semibold">{m.value}</span> {m.label}
                </dd>
              </div>
            ))}
          </dl>
        )}
        <ProjectLinks project={project} className="mt-5" />
      </PageIntro>

      {project.interactive && (
        <section
          id="demo"
          aria-label="Interactive model"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-6 sm:px-6"
        >
          <ProjectDemo slug={project.slug} />
          {project.demoNote && (
            <p className="text-ink-soft mt-3 flex gap-2 text-sm">
              <span aria-hidden>ⓘ</span>
              {project.demoNote}
            </p>
          )}
        </section>
      )}

      <ProjectSections project={project} />

      <nav aria-label="Next project" className="mx-auto mt-6 max-w-6xl px-4 sm:px-6">
        <Link
          href={`/work/${next.slug}`}
          className="group border-line bg-card shadow-hard flex flex-col gap-1 rounded-3xl border-2 p-6 transition-transform hover:-translate-y-1"
        >
          <span className="text-ink-soft font-mono text-xs tracking-wider uppercase">
            Next question
          </span>
          <span className="font-display text-2xl font-semibold">
            {next.question}{" "}
            <span
              aria-hidden
              className="inline-block transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </Link>
      </nav>
    </article>
  );
}
