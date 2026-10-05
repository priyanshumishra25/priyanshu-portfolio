import { knowledge } from "./knowledge";
import type { KnowledgeChunk } from "./types";

const STOPWORDS = new Set(
  (
    "a an and are as at be been but by can could did do does done for from had has have he her " +
    "him his how i if in into is it its me more my of on or our she show so some tell than that " +
    "the their them then there these they this to us was we were what when where which who why " +
    "will with would you your about any anything something thing things get got give find look " +
    "priyanshu priyanshus mishra know knows built build builds made make work worked working " +
    "project projects done ever really please"
  ).split(" "),
);

/** Query expansions. Keys and values are already normalised terms. */
const SYNONYMS: Record<string, string[]> = {
  backend: ["fastapi", "api", "service", "python", "server"],
  frontend: ["react", "typescript", "ui", "operator"],
  ai: ["llm", "claude", "agent", "ml"],
  llm: ["ai", "claude", "agent"],
  ml: ["machine", "classification", "classifier", "ai"],
  agent: ["ai", "claude", "recommendation"],
  distributed: ["partition", "consumer", "stream", "event"],
  kafka: ["stream", "partition", "consumer"],
  systems: ["c++", "posix", "fork", "isolation"],
  debug: ["debugging", "crash", "fuzzing", "signal"],
  crash: ["sigsegv", "signal", "fuzzing"],
  test: ["testing", "regression", "ci"],
  reliability: ["degradation", "failure", "resilience", "observability"],
  security: ["dns", "encrypted", "fuzzing", "sanitizer"],
  api: ["openapi", "rest", "contract", "schema"],
  data: ["provenance", "pipeline", "degradation"],
  network: ["resilience", "dns", "simulation"],
  resume: ["experience", "education", "role"],
  hire: ["contact", "email"],
  vision: ["segmentation", "image", "computer"],
  segmentation: ["vision", "image", "iou"],
  leadership: ["resident", "advisor", "stakeholder"],
  imbalanced: ["smote", "fraud"],
  java: ["tributary", "streaming"],
};

export function normalize(term: string): string {
  let t = term.toLowerCase().replace(/^[^a-z0-9+#]+|[^a-z0-9+#]+$/g, "");
  if (t.length > 4 && t.endsWith("ies")) t = `${t.slice(0, -3)}y`;
  else if (t.length > 5 && t.endsWith("ing")) t = t.slice(0, -3);
  else if (t.length > 4 && t.endsWith("ed") && !t.endsWith("eed")) t = t.slice(0, -2);
  else if (t.length > 4 && /(sh|ch|x|ss)es$/.test(t)) t = t.slice(0, -2);
  else if (t.length > 3 && t.endsWith("s") && !t.endsWith("ss")) t = t.slice(0, -1);
  return t;
}

export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9+#][a-z0-9+#./-]*/g) ?? [])
    .flatMap((raw) => {
      const parts = raw.split(/[./-]/).filter(Boolean);
      return parts.length > 1 ? [raw, ...parts] : [raw];
    })
    .map(normalize)
    .filter((t) => t.length > 0);
}

export function queryTerms(question: string): string[] {
  const base = tokenize(question).filter((t) => !STOPWORDS.has(t));
  const expanded = new Set(base);
  for (const t of base) for (const s of SYNONYMS[t] ?? []) expanded.add(s);
  return [...expanded];
}

interface IndexedChunk {
  chunk: KnowledgeChunk;
  tagTerms: Set<string>;
  labelTerms: Set<string>;
  textCounts: Map<string, number>;
}

const index: IndexedChunk[] = knowledge.map((chunk) => {
  const textCounts = new Map<string, number>();
  for (const t of tokenize(chunk.text)) textCounts.set(t, (textCounts.get(t) ?? 0) + 1);
  return {
    chunk,
    tagTerms: new Set(chunk.tags.flatMap(tokenize)),
    labelTerms: new Set(tokenize(chunk.label)),
    textCounts,
  };
});

/** Every term that appears anywhere in the portfolio. */
export const vocabulary: ReadonlySet<string> = new Set(
  index.flatMap((i) => [...i.tagTerms, ...i.labelTerms, ...i.textCounts.keys()]),
);

export interface ScoredChunk {
  chunk: KnowledgeChunk;
  score: number;
}

export function retrieve(question: string, limit = 5): ScoredChunk[] {
  const original = new Set(tokenize(question).filter((t) => !STOPWORDS.has(t)));
  const terms = queryTerms(question);
  if (terms.length === 0) return [];

  const scored = index.map(({ chunk, tagTerms, labelTerms, textCounts }) => {
    let score = 0;
    for (const term of terms) {
      // Terms the visitor actually typed matter more than expansions.
      const weight = original.has(term) ? 1 : 0.5;
      if (tagTerms.has(term)) score += 3 * weight;
      if (labelTerms.has(term)) score += 2.5 * weight;
      score += Math.min(textCounts.get(term) ?? 0, 3) * 0.6 * weight;
    }
    // Facets are the most precise citations, so give them a small edge.
    if (chunk.kind === "facet" || chunk.kind === "decision") score *= 1.1;
    return { chunk, score };
  });

  return scored
    .filter((s) => s.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
