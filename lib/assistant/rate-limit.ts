/**
 * Best-effort fixed-window limiter, per runtime instance. On serverless hosts
 * each instance keeps its own counts, so this is a guard against loops and
 * casual abuse of the LLM key, not a global quota. Requests over the limit are
 * answered by the local engine, never rejected.
 */
export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return function check(key: string, now = Date.now()): boolean {
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      if (hits.size > 5_000) hits.clear();
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    entry.count += 1;
    return entry.count <= limit;
  };
}

export const DEFAULT_LLM_REQUESTS_PER_MINUTE = 8;

/** Reads ASSISTANT_LLM_REQUESTS_PER_MINUTE, falling back to a conservative default. */
export function llmRequestsPerMinute(raw = process.env.ASSISTANT_LLM_REQUESTS_PER_MINUTE): number {
  const n = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(n) && n >= 0 && n <= 1000 ? n : DEFAULT_LLM_REQUESTS_PER_MINUTE;
}
