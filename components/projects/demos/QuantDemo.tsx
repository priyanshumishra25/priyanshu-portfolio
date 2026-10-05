"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  runQuery,
  scenarios,
  validateCompany,
  type QuantRun,
  type Scenario,
  type SourceStatus,
} from "@/lib/sim/quant";
import { DemoButton, DemoFrame } from "./DemoFrame";

const STATUS: Record<SourceStatus, { mark: string; cls: string; label: string }> = {
  ok: { mark: "✓", cls: "text-teal", label: "available" },
  cached: { mark: "✓", cls: "text-teal", label: "cached" },
  "rate-limited": { mark: "✕", cls: "text-danger", label: "rate limited" },
  timeout: { mark: "✕", cls: "text-danger", label: "timed out" },
};

export function QuantDemo() {
  const reduced = useReducedMotion();
  const [company, setCompany] = useState("NVIDIA");
  const [scenario, setScenario] = useState<Scenario>("rate-limited");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuantRun | null>(null);
  const [revealed, setRevealed] = useState(0);
  const cache = useRef(new Set<string>());

  const total = result?.sources.length ?? 0;
  const running = result !== null && revealed < total;

  useEffect(() => {
    if (!result || revealed >= result.sources.length) return;
    const t = setTimeout(() => setRevealed((r) => r + 1), 450);
    return () => clearTimeout(t);
  }, [result, revealed]);

  function run(e?: React.FormEvent) {
    e?.preventDefault();
    const v = validateCompany(company);
    if (!v.ok) {
      setError(v.error);
      setResult(null);
      return;
    }
    setError(null);
    const r = runQuery(v.value, scenario, cache.current);
    cache.current.add(v.value.toLowerCase());
    setResult(r);
    setRevealed(reduced ? r.sources.length : 0);
  }

  const done = result !== null && !running;
  const degraded = done && result.available < result.sources.length;

  return (
    <DemoFrame
      title="Interactive model · degraded data sources"
      caption="Simulated fetches. No market data is retrieved and nothing here is a prediction. The point is what happens when a source fails."
      controls={
        <DemoButton tone="primary" onClick={() => run()} disabled={running}>
          Run
        </DemoButton>
      }
      aside={
        <fieldset className="space-y-2 text-sm">
          <legend className="text-ink-soft mb-2 font-mono text-[0.7rem] tracking-wider uppercase">
            Scenario
          </legend>
          {scenarios.map((s) => (
            <label
              key={s.id}
              className="border-line/20 bg-paper has-[:checked]:border-line has-[:checked]:bg-mustard-soft flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2"
            >
              <input
                type="radio"
                name="quant-scenario"
                value={s.id}
                checked={scenario === s.id}
                onChange={() => setScenario(s.id)}
                className="accent-[var(--teal)]"
              />
              {s.label}
            </label>
          ))}
          <p className="text-ink-soft pt-2">
            Run the same company twice to see the Redis cache answer for price history.
          </p>
        </fieldset>
      }
    >
      <form onSubmit={run} className="flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1">
          <label
            htmlFor="quant-company"
            className="text-ink-soft font-mono text-[0.7rem] tracking-wider uppercase"
          >
            Company
          </label>
          <input
            id="quant-company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "quant-error" : undefined}
            className="border-line bg-paper mt-1 w-full rounded-xl border-2 px-3 py-2 font-mono"
          />
        </div>
      </form>
      {error && (
        <p id="quant-error" role="alert" className="text-danger mt-2 text-sm font-semibold">
          {error}
        </p>
      )}

      <ul className="mt-5 space-y-1.5 font-mono text-sm" aria-live="polite">
        {result?.sources.slice(0, revealed).map((s) => {
          const st = STATUS[s.status];
          return (
            <li
              key={s.id}
              className="bg-paper grid grid-cols-[1fr_auto] gap-x-4 rounded-lg px-3 py-2 sm:grid-cols-[11rem_auto_1fr]"
            >
              <span className="font-semibold">{s.label}</span>
              <span className={st.cls}>
                {st.mark} <span className="sr-only">{st.label}</span>
                <span aria-hidden className="text-xs">
                  {s.status === "ok" ? "" : st.label}
                </span>
              </span>
              <span className="text-ink-soft col-span-2 text-xs sm:col-span-1">{s.detail}</span>
            </li>
          );
        })}
        {running && (
          <li className="text-ink-soft px-3 py-2">checking {result.sources[revealed]?.label}...</li>
        )}
        {!result && (
          <li className="text-ink-soft px-3 py-2">
            Press Run to query four sources for {company || "a company"}.
          </li>
        )}
      </ul>

      {done && (
        <div
          className={`border-line mt-5 rounded-2xl border-2 p-4 ${degraded ? "bg-paper-deep" : "bg-teal-soft"}`}
        >
          <p className="font-semibold">{result.summary}</p>
          {degraded && (
            <p className="font-display mt-2 text-xl italic">
              &ldquo;Unavailable data remains unavailable.&rdquo;
            </p>
          )}
        </div>
      )}
    </DemoFrame>
  );
}
