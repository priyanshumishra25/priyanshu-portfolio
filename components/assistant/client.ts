import type { AssistantAnswer, HistoryTurn } from "@/lib/assistant/types";

function isAnswer(value: unknown): value is AssistantAnswer {
  const v = value as AssistantAnswer | null;
  return Boolean(v && typeof v.text === "string" && Array.isArray(v.sources));
}

/**
 * Asks the server first (which may use an LLM). If the server is unreachable
 * or misbehaves, answers in the browser with the same local engine, so PAI
 * keeps working on a static host or a flaky connection.
 */
export async function fetchAnswer(
  question: string,
  history: HistoryTurn[],
): Promise<AssistantAnswer> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);
  try {
    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, history }),
      signal: controller.signal,
    });
    if (res.ok) {
      const data: unknown = await res.json();
      if (isAnswer(data)) return data;
    }
  } catch {
    // Fall through to the local engine.
  } finally {
    clearTimeout(timer);
  }
  const { answerLocally } = await import("@/lib/assistant/local");
  return answerLocally(question);
}
