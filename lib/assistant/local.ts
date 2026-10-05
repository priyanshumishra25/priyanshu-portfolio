import { curatedAnswers, interestingPicks, type CuratedAnswer } from "@/content/assistant";
import { about } from "@/content/about";
import { decisions } from "@/content/decisions";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { formatPeriod } from "@/lib/period";
import { getChunk, resolveSources, toSourceRef } from "./knowledge";
import { retrieve } from "./retrieve";
import { technologyHits, unknownTechnologies } from "./technologies";
import type { AssistantAnswer } from "./types";

export { unknownTechnologies } from "./technologies";

const UNSUPPORTED_NOTE = "I only know what Priyanshu has put on this site, so I will not guess.";

function firstSentence(text: string): string {
  return text.split(/(?<=\.)\s/)[0] ?? text;
}

function periodFor(id: string): string {
  if (id === "education") return formatPeriod(about.education.period, "long");
  const e = experience.find((x) => x.id === id);
  if (!e) throw new Error(`Unknown period template: ${id}`);
  return formatPeriod(e.period, "long");
}

export function fillTemplate(text: string): string {
  return text
    .replace(/\{\{period:([a-z-]+)\}\}/g, (_, id: string) => periodFor(id))
    .replace("{{decisions}}", decisions.map((d) => `- ${d.number}: ${d.title}`).join("\n"))
    .replace(
      "{{other-projects}}",
      projects
        .filter((p) => p.context !== "professional")
        .map((p) => `- ${p.shortTitle}: ${firstSentence(p.oneLiner)}`)
        .join("\n"),
    )
    .replace("{{email}}", site.email);
}

function matchesWord(tokens: string[], word: string): boolean {
  const w = word.toLowerCase();
  return tokens.some((t) => (w.length <= 2 ? t === w : t.startsWith(w)));
}

function simplify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function findCurated(question: string): CuratedAnswer | undefined {
  const tokens = question.toLowerCase().match(/[a-z0-9+#]+/g) ?? [];
  if (tokens.length === 0) return undefined;
  // Exact prompt clicks always resolve to their own answer.
  const exact = curatedAnswers.find((c) => simplify(c.prompt) === simplify(question));
  if (exact) return exact;
  return curatedAnswers.find((c) =>
    c.match.some((group) => group.every((w) => matchesWord(tokens, w))),
  );
}

function curatedToAnswer(c: CuratedAnswer): AssistantAnswer {
  return {
    text: fillTemplate(c.answer),
    sources: resolveSources(c.sources),
    cta: c.cta,
    kind: "answer",
    mode: "local",
  };
}

function technologyAnswer(question: string): AssistantAnswer | undefined {
  const hits = technologyHits(question);
  if (hits.length === 0) return undefined;

  let text: string;
  if (hits.length === 1) {
    const hit = hits[0]!;
    const lines = hit.sourceIds.map((id) => {
      const c = getChunk(id)!;
      return `- ${c.label}: ${firstSentence(c.summary)}`;
    });
    text = `${hit.label} shows up in:\n\n${lines.join("\n")}`;
  } else {
    text = `Here is where each one shows up:\n\n${hits.map((h) => `- ${h.label}: ${h.names.join(", ")}`).join("\n")}`;
  }

  const sources = resolveSources(hits.flatMap((h) => h.sourceIds)).slice(0, 6);
  const top = sources[0];
  return {
    text,
    sources,
    cta: top ? { label: `Open ${top.label}`, href: top.href } : undefined,
    kind: "answer",
    mode: "local",
  };
}

export function answerLocally(question: string): AssistantAnswer {
  const q = question.trim();
  if (!q) {
    return {
      text: "Ask me about his work, his decisions, or what he has built with AI.",
      sources: [],
      kind: "not-found",
      mode: "local",
    };
  }

  const unknown = unknownTechnologies(q);
  if (unknown.length > 0) {
    const named =
      unknown.length > 1 ? `${unknown.slice(0, -1).join(", ")} and ${unknown.at(-1)}` : unknown[0];
    // Synonym expansion lets e.g. "Kafka" still find Tributary as the nearest thing.
    const closest = retrieve(q, 1)[0]?.chunk;
    return {
      text:
        `${named} ${unknown.length > 1 ? "are" : "is"} not mentioned anywhere on this site. ${UNSUPPORTED_NOTE}` +
        (closest
          ? `\n\nThe closest thing I do know about: ${closest.label}. ${closest.summary}`
          : ""),
      sources: closest ? [toSourceRef(closest)] : [],
      cta: closest ? { label: `Open ${closest.label}`, href: closest.href } : undefined,
      kind: "not-found",
      mode: "local",
    };
  }

  const tech = technologyAnswer(q);
  if (tech) return tech;

  const curated = findCurated(q);
  if (curated) return curatedToAnswer(curated);

  const hits = retrieve(q, 3);
  const top = hits[0];
  if (!top) {
    return {
      text: `I could not find anything about that on this site. ${UNSUPPORTED_NOTE}\n\nTry asking about ArmsOA, the Midpoint Fuzzer, his engineering decisions or his UNSW research.`,
      sources: [],
      kind: "not-found",
      mode: "local",
    };
  }

  const lines = hits.map((h) => `- ${h.chunk.label}: ${h.chunk.summary}`);
  return {
    text: `Here is what the site says that looks relevant:\n\n${lines.join("\n")}`,
    sources: hits.map((h) => toSourceRef(h.chunk)),
    cta: { label: `Open ${top.chunk.label}`, href: top.chunk.href },
    kind: "answer",
    mode: "local",
  };
}

/** Cycles through picks so repeated presses show something new. */
export function interestingAnswer(turn: number): AssistantAnswer {
  const n = interestingPicks.length;
  const pick = interestingPicks[((turn % n) + n) % n]!;
  return {
    text: `${pick.intro}\n\n${pick.why}`,
    sources: resolveSources(pick.sources),
    cta: pick.cta,
    kind: "interesting",
    mode: "local",
  };
}
