export type ChunkKind = "project" | "facet" | "decision" | "research" | "about" | "experience";

/** One citable piece of portfolio knowledge, derived from /content. */
export interface KnowledgeChunk {
  id: string;
  kind: ChunkKind;
  /** Citation label, e.g. "ArmsOA / Recovery Simulation". */
  label: string;
  href: string;
  /** Short, quotable summary. */
  summary: string;
  /** Full text used for retrieval and LLM grounding. */
  text: string;
  tags: string[];
}

export interface SourceRef {
  id: string;
  label: string;
  href: string;
}

export interface AssistantAnswer {
  /** Plain text. Paragraphs separated by blank lines, bullets start with "- ". */
  text: string;
  sources: SourceRef[];
  cta?: { label: string; href: string };
  kind: "answer" | "not-found" | "interesting";
  mode: "local" | "llm";
}

export interface HistoryTurn {
  role: "user" | "assistant";
  text: string;
}
