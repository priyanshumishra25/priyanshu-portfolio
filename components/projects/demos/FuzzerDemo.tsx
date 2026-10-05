"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { runCampaign, type Campaign, type Execution } from "@/lib/sim/fuzzer";
import { DemoButton, DemoFrame } from "./DemoFrame";

const STEP_MS = 160;

function outcomeLabel(e: Execution) {
  switch (e.outcome) {
    case "ok":
      return { text: `exit 0  ${e.ms}ms`, cls: "text-ink-soft" };
    case "rejected":
      return { text: "exit 1  rejected", cls: "text-ink-soft" };
    case "timeout":
      return { text: "TIMEOUT  killed", cls: "text-[#8a5a00] font-semibold" };
    case "crash":
      return { text: e.signal ?? "CRASH", cls: "text-danger font-bold" };
  }
}

export function FuzzerDemo() {
  const reduced = useReducedMotion();
  const [run, setRun] = useState(0);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [shown, setShown] = useState(0);
  const known = useRef(new Set<string>());
  const [uniqueCrashes, setUniqueCrashes] = useState(0);
  const logRef = useRef<HTMLOListElement>(null);

  const running = campaign !== null && shown < campaign.executions.length;
  const done = campaign !== null && !running;

  useEffect(() => {
    if (!campaign || shown >= campaign.executions.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [campaign, shown]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [shown]);

  function fuzz() {
    const c = runCampaign(run, known.current);
    if (c.crash && !c.crash.duplicate) {
      known.current.add(c.crash.key);
      setUniqueCrashes(known.current.size);
    }
    setRun((r) => r + 1);
    setCampaign(c);
    setShown(reduced ? c.executions.length : 0);
  }

  function reset() {
    known.current.clear();
    setUniqueCrashes(0);
    setRun(0);
    setCampaign(null);
    setShown(0);
  }

  const visible = campaign?.executions.slice(0, shown) ?? [];
  const timeouts = visible.filter((e) => e.outcome === "timeout").length;

  return (
    <DemoFrame
      title="Interactive model · black-box fuzzing"
      caption="A toy target with planted bugs, running in your browser, with a toy hash. The real fuzzer forks a child per input, enforces poll-based timeouts and memory limits, and saves each crashing input once by its SHA-256."
      controls={
        <>
          <DemoButton tone="primary" onClick={fuzz} disabled={running}>
            {run === 0 ? "Fuzz It" : "Fuzz Again"}
          </DemoButton>
          <DemoButton onClick={reset} disabled={running || run === 0}>
            Reset
          </DemoButton>
        </>
      }
      aside={
        <div className="space-y-4 text-sm">
          <dl className="grid grid-cols-2 gap-3">
            {[
              ["Executions", visible.length],
              ["Hangs killed", timeouts],
              ["Campaigns", run],
              [
                "Unique crashes",
                running && campaign.crash && !campaign.crash.duplicate
                  ? uniqueCrashes - 1
                  : uniqueCrashes,
              ],
            ].map(([k, v]) => (
              <div key={k} className="bg-paper-deep rounded-xl p-3">
                <dt className="text-ink-soft font-mono text-[0.68rem] tracking-wider uppercase">
                  {k}
                </dt>
                <dd className="font-display text-2xl font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          {done && campaign.crash && (
            <div
              role="status"
              className="border-line rounded-2xl border-2 bg-[#f7dcd5] p-4 font-mono text-[0.8rem] leading-relaxed"
            >
              <p className="text-danger text-base font-bold">{campaign.crash.signal}</p>
              <p>Crash discovered</p>
              <p>Input hash: {campaign.crash.key}</p>
              <p>
                Input saved:{" "}
                {campaign.crash.duplicate
                  ? "no, identical input already saved"
                  : `${campaign.crash.signal}_${campaign.crash.key}.in`}
              </p>
              <p>
                Duplicate: <strong>{campaign.crash.duplicate ? "Yes, skipped" : "No"}</strong>
              </p>
            </div>
          )}
          {done && campaign.crash?.duplicate && (
            <p className="text-ink-soft">
              Same input bytes, same hash, so it is stored once. Press again for a different crash.
            </p>
          )}
          {!campaign && (
            <p className="text-ink-soft">
              Press Fuzz It to start throwing inputs at mystery_program.
            </p>
          )}
        </div>
      }
    >
      <div className="border-line rounded-2xl border-2 bg-[#f7f3ea] font-mono text-[0.78rem]">
        <p className="border-line/20 text-ink-soft border-b px-4 py-2">
          $ ./midpoint --target ./mystery_program --format json --seed seed.json
        </p>
        <ol ref={logRef} className="h-72 overflow-y-auto px-4 py-2" aria-label="Execution log">
          {visible.length === 0 && <li className="text-ink-soft">waiting for input...</li>}
          {visible.map((e) => {
            const o = outcomeLabel(e);
            return (
              <li
                key={e.n}
                className="grid grid-cols-[3ch_1fr_auto] gap-x-3 py-0.5 sm:grid-cols-[3ch_15rem_1fr_auto]"
              >
                <span className="text-ink-soft">{String(e.n).padStart(2, "0")}</span>
                <span className="text-teal hidden truncate sm:block">{e.strategy}</span>
                <span className="truncate" title={e.input}>
                  {e.input}
                </span>
                <span className={o.cls}>{o.text}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </DemoFrame>
  );
}
