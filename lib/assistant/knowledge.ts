import { about } from "@/content/about";
import { paiArchitecture } from "@/content/assistant";
import { decisions } from "@/content/decisions";
import { experience } from "@/content/experience";
import { contextLabels, projectHref, projects } from "@/content/projects";
import { research } from "@/content/research";
import { site } from "@/content/site";
import { formatPeriod, isCurrent } from "@/lib/period";
import type { KnowledgeChunk, SourceRef } from "./types";

/**
 * Flattens /content into citable chunks. This is the only knowledge PAI has,
 * for both the local retriever and the LLM path. Ids are generated here and
 * nowhere else: project:<slug>, facet:<slug>/<facet>, decision:<id>,
 * experience:<id>, research, facet:research/<facet>, about, contact, pai.
 */
function buildKnowledge(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];

  for (const p of projects) {
    const period = p.period ? ` (${formatPeriod(p.period, "long")})` : "";
    const lines = [
      `${p.title}. ${p.question}`,
      p.oneLiner,
      `Context: ${contextLabels[p.context]}${p.role ? `, ${p.role}${period}` : period}.${p.event ? ` ${p.event}.` : ""}`,
      `Categories: ${p.categories.join(", ")}. Stack: ${p.stack.join(", ")}.`,
      ...(p.metrics ?? []).map((m) => `Result: ${m.value} ${m.label}.`),
      p.repoUrl ? `Source code: ${p.repoUrl}` : p.sourceNote ? `Source: ${p.sourceNote}.` : "",
    ];
    if (p.featured) {
      lines.push(
        ...p.problem,
        `What he built or owned: ${p.owned.join("; ")}.`,
        `Shipped: ${p.shipped.join("; ")}.`,
        ...p.interesting.map((i) => `${i.title}: ${i.body}`),
        ...p.failureModes.map((f) => `Failure mode: ${f.failure} Response: ${f.response}`),
        `Learned: ${p.learned.join(" ")}`,
      );
    } else {
      lines.push(...p.details);
    }

    chunks.push({
      id: `project:${p.slug}`,
      kind: "project",
      label: p.shortTitle,
      href: projectHref(p),
      summary: p.oneLiner,
      text: lines.filter(Boolean).join("\n"),
      tags: [
        ...p.tags,
        ...p.categories.map((c) => c.toLowerCase()),
        ...p.stack.map((s) => s.toLowerCase()),
        p.context,
      ],
    });

    for (const f of p.facets) {
      chunks.push({
        id: `facet:${p.slug}/${f.id}`,
        kind: "facet",
        label: `${p.shortTitle} / ${f.label}`,
        href: projectHref(p, f.id),
        summary: f.summary,
        text: `${p.shortTitle}: ${f.label}. ${f.summary}`,
        tags: [...f.tags, p.slug],
      });
    }
  }

  for (const d of decisions) {
    chunks.push({
      id: `decision:${d.id}`,
      kind: "decision",
      label: `Engineering Decision ${d.number}`,
      href: `/decisions#${d.slug}`,
      summary: `${d.title}. ${d.takeaway}`,
      text: [`Decision ${d.number}: ${d.title}.`, d.context, ...d.body, d.takeaway].join("\n"),
      tags: d.tags,
    });
  }

  chunks.push({
    id: "research",
    kind: "research",
    label: "UNSW Research",
    href: "/research",
    summary: `${research.role}, ${research.org} (${formatPeriod(research.period, "long")}). ${research.question} ${research.result.value} ${research.result.label}.`,
    text: [
      `${research.title}. ${research.role} at ${research.org}, ${formatPeriod(research.period, "long")}.`,
      research.question,
      ...research.abstract,
      `Stack: ${research.stack.join(", ")}.`,
      ...research.pipeline.map((s) => `${s.name}: ${s.detail}`),
      `Result: ${research.result.value} ${research.result.label}.`,
      research.philosophy,
      `Owned end to end: ${research.ownership.join(", ")}.`,
      `Presented to: ${research.audiences.join("; ")}.`,
      research.relatedRepo
        ? `Related public repository: ${research.relatedRepo.url}. ${research.relatedRepo.note}`
        : "",
    ]
      .filter(Boolean)
      .join("\n"),
    tags: [...research.tags, ...research.stack.map((s) => s.toLowerCase())],
  });

  for (const f of research.facets) {
    chunks.push({
      id: `facet:research/${f.id}`,
      kind: "facet",
      label: `UNSW Research / ${f.label}`,
      href: `/research#${f.id}`,
      summary: f.summary,
      text: `UNSW Research: ${f.label}. ${f.summary}`,
      tags: [...f.tags, "unsw", "research"],
    });
  }

  for (const e of experience) {
    const when = formatPeriod(e.period, "long");
    const status = isCurrent(e.period)
      ? "Current role."
      : `Past role. It ended in ${when.split(" to ")[1]}.`;
    const kind =
      e.kind === "leadership"
        ? "Leadership experience, not a software engineering role."
        : e.kind === "research"
          ? "Research role."
          : "Software engineering role.";
    chunks.push({
      id: `experience:${e.id}`,
      kind: "experience",
      label: `Experience / ${e.role}, ${e.org}`,
      href: e.href ?? "/about",
      summary: `${e.role}, ${e.org}, ${when}. ${e.summary}`,
      text: `${e.role} at ${e.org}${e.location ? `, ${e.location}` : ""}, ${when}. ${status} ${kind} ${e.summary}`,
      tags: [
        "experience",
        "career",
        "role",
        "when",
        "dates",
        e.kind,
        ...(isCurrent(e.period) ? ["current", "now"] : []),
      ],
    });
  }

  chunks.push({
    id: "about",
    kind: "about",
    label: "About",
    href: "/about",
    summary: about.intro.join(" "),
    text: [
      ...about.intro,
      `Education: ${about.education.degree}, ${about.education.school}, ${about.education.honours}, ${formatPeriod(about.education.period, "long")}.`,
      `Interests: ${about.interests.join(", ")}.`,
      `Location: ${site.location}.`,
    ].join("\n"),
    tags: ["about", "bio", "education", "unsw", "degree", "interests", "sydney", "location"],
  });

  chunks.push({
    id: "contact",
    kind: "about",
    label: "Contact",
    href: "/about#contact",
    summary: `Email ${site.email}, or find him on GitHub and LinkedIn.`,
    text: `Contact: email ${site.email}. GitHub ${site.github}. LinkedIn ${site.linkedin}.`,
    tags: ["contact", "email", "hire", "reach", "linkedin", "github", "hello"],
  });

  chunks.push({
    id: "pai",
    kind: "about",
    label: "How PAI works",
    href: "/about#how-pai-works",
    summary: paiArchitecture.summary,
    text: [
      "PAI is the portfolio assistant on this website, which is built with Next.js, React, TypeScript, Tailwind CSS and hand-drawn SVG.",
      paiArchitecture.summary,
      ...paiArchitecture.points,
    ].join("\n"),
    tags: ["pai", "assistant", "grounding", "how", "website", "site", "next.js", "llm", "claude"],
  });

  return chunks;
}

export const knowledge: KnowledgeChunk[] = buildKnowledge();

const byId = new Map(knowledge.map((c) => [c.id, c]));

/** Lowercased text of everything PAI knows. Used to check whether a technology is mentioned at all. */
export const corpusText: string = knowledge
  .map((c) => `${c.label}\n${c.text}\n${c.tags.join(" ")}`)
  .join("\n")
  .toLowerCase();

export function getChunk(id: string): KnowledgeChunk | undefined {
  return byId.get(id);
}

export function toSourceRef(chunk: KnowledgeChunk): SourceRef {
  return { id: chunk.id, label: chunk.label, href: chunk.href };
}

/** Resolves ids to source refs, silently dropping anything unknown. */
export function resolveSources(ids: readonly string[]): SourceRef[] {
  const seen = new Set<string>();
  const out: SourceRef[] = [];
  for (const id of ids) {
    const c = byId.get(id);
    if (c && !seen.has(id)) {
      seen.add(id);
      out.push(toSourceRef(c));
    }
  }
  return out;
}
