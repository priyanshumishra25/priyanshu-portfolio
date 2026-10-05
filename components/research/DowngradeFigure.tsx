"use client";

import { useState } from "react";

type Mode = "normal" | "blocked";

interface Lookup {
  t: string;
  domain: string;
  proto: "DoH" | "DoT" | "DoQ" | "UDP/53";
  session: string;
  confidence: number;
}

// Illustrative events. They show the shape of the output, not real capture data.
const EVENTS: Record<Mode, Lookup[]> = {
  normal: [
    { t: "00.12", domain: "news.example", proto: "DoH", session: "tab 1", confidence: 0.96 },
    { t: "00.48", domain: "cdn.example", proto: "DoH", session: "tab 1", confidence: 0.91 },
    { t: "01.30", domain: "mail.example", proto: "DoT", session: "tab 2", confidence: 0.88 },
    { t: "02.05", domain: "api.example", proto: "DoQ", session: "tab 2", confidence: 0.83 },
  ],
  blocked: [
    { t: "00.12", domain: "news.example", proto: "DoH", session: "tab 1", confidence: 0.96 },
    { t: "00.48", domain: "cdn.example", proto: "UDP/53", session: "tab 1", confidence: 0.93 },
    { t: "01.30", domain: "mail.example", proto: "UDP/53", session: "tab 2", confidence: 0.71 },
    {
      t: "02.05",
      domain: "tracker.example",
      proto: "UDP/53",
      session: "background?",
      confidence: 0.42,
    },
  ],
};

export function DowngradeFigure() {
  const [mode, setMode] = useState<Mode>("normal");
  const rows = EVENTS[mode];
  const fallbacks = rows.filter((r) => r.proto === "UDP/53").length;

  return (
    <figure className="border-line bg-card rounded-2xl border-2 p-4 sm:p-5">
      <div
        className="mb-4 flex flex-wrap items-center gap-2"
        role="radiogroup"
        aria-label="Capture scenario"
      >
        {(
          [
            ["normal", "Normal session"],
            ["blocked", "Encrypted resolver blocked"],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            onClick={() => setMode(m)}
            className={`border-line rounded-full border-2 px-3.5 py-1 text-sm font-semibold ${
              mode === m ? "bg-ink text-paper" : "bg-paper hover:bg-paper-deep"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse font-mono text-[0.8rem]">
          <caption className="sr-only">
            DNS lookups correlated to browser sessions, with confidence
          </caption>
          <thead>
            <tr className="border-line border-b-2 text-left">
              <th className="py-1.5 pr-3 font-semibold">t (s)</th>
              <th className="py-1.5 pr-3 font-semibold">lookup</th>
              <th className="py-1.5 pr-3 font-semibold">transport</th>
              <th className="py-1.5 pr-3 font-semibold">session</th>
              <th className="py-1.5 font-semibold">confidence</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const plain = r.proto === "UDP/53";
              return (
                <tr key={r.t} className={`border-line/15 border-b ${plain ? "bg-[#f7dcd5]" : ""}`}>
                  <td className="py-1.5 pr-3">{r.t}</td>
                  <td className="py-1.5 pr-3">{r.domain}</td>
                  <td className={`py-1.5 pr-3 ${plain ? "text-danger font-bold" : "text-teal"}`}>
                    {plain ? "⚠ " : ""}
                    {r.proto}
                    {plain && <span className="sr-only"> plaintext fallback</span>}
                  </td>
                  <td className="py-1.5 pr-3">{r.session}</td>
                  <td className="py-1.5">
                    <span className="inline-flex items-center gap-2">
                      <span
                        aria-hidden
                        className="bg-paper-deep inline-block h-2 w-16 overflow-hidden rounded-full"
                      >
                        <span
                          className="bg-teal block h-full"
                          style={{ width: `${r.confidence * 100}%` }}
                        />
                      </span>
                      {r.confidence.toFixed(2)}
                      {r.confidence < 0.6 && (
                        <span className="text-ink-soft">lead, not verdict</span>
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p aria-live="polite" className="mt-3 text-sm font-semibold">
        {fallbacks === 0
          ? "No plaintext fallback detected."
          : `Plaintext fallback detected on ${fallbacks} lookups. One correlation is uncertain and is reported that way.`}
      </p>
      <figcaption className="text-ink-soft mt-2 text-xs">
        Fig. 2. Illustrative output shape. Encrypted DNS stays encrypted until the resolver is
        blocked, then lookups fall back to plaintext UDP port 53. Values are examples, not measured
        results.
      </figcaption>
    </figure>
  );
}
