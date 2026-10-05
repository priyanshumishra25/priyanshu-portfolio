/**
 * Simulated source fetches for the Quant AI demo. No real market data is
 * fetched or invented: the demo is about how failures are reported.
 */

export type SourceStatus = "ok" | "cached" | "rate-limited" | "timeout";
export type Scenario = "rate-limited" | "reddit-timeout" | "healthy";

export interface SourceResult {
  id: string;
  label: string;
  status: SourceStatus;
  detail: string;
}

export interface QuantRun {
  company: string;
  sources: SourceResult[];
  available: number;
  summary: string;
}

export const scenarios: { id: Scenario; label: string }[] = [
  { id: "rate-limited", label: "Provider rate limited" },
  { id: "reddit-timeout", label: "Reddit times out" },
  { id: "healthy", label: "Everything healthy" },
];

const SOURCES = [
  { id: "price", label: "Price history" },
  { id: "news", label: "Market news" },
  { id: "reddit", label: "Reddit" },
  { id: "provider", label: "Provider API" },
] as const;

export function validateCompany(
  raw: string,
): { ok: true; value: string } | { ok: false; error: string } {
  const value = raw.trim().replace(/\s+/g, " ");
  if (!value) return { ok: false, error: "Enter a company name." };
  if (value.length > 40) return { ok: false, error: "Keep it under 40 characters." };
  if (!/^[\p{L}\p{N} .&'-]+$/u.test(value))
    return { ok: false, error: "Letters, numbers and simple punctuation only." };
  return { ok: true, value };
}

export function runQuery(
  company: string,
  scenario: Scenario,
  cache: ReadonlySet<string>,
): QuantRun {
  const key = company.toLowerCase();
  const sources: SourceResult[] = SOURCES.map(({ id, label }) => {
    if (id === "provider" && scenario === "rate-limited") {
      return { id, label, status: "rate-limited", detail: "429 Too Many Requests. Retry later." };
    }
    if (id === "reddit" && scenario === "reddit-timeout") {
      return { id, label, status: "timeout", detail: "No response before the timeout." };
    }
    if (id === "price" && cache.has(key)) {
      return { id, label, status: "cached", detail: "Served from Redis cache." };
    }
    return { id, label, status: "ok", detail: "Fetched from documented API." };
  });

  const available = sources.filter((s) => s.status === "ok" || s.status === "cached").length;
  const missing = sources.filter((s) => s.status === "rate-limited" || s.status === "timeout");
  const summary =
    missing.length === 0
      ? `All ${sources.length} sources available. Every item keeps its provenance.`
      : `Assembled from ${available} of ${sources.length} sources. ${missing
          .map((m) => m.label)
          .join(", ")} unavailable. No substitute data used.`;

  return { company, sources, available, summary };
}
