"use client";

import { useReducer } from "react";
import {
  initialNetwork,
  isolatedNodes,
  links,
  networkReducer,
  nodeLabel,
  nodes,
  recommendation,
  type NetLink,
} from "@/lib/sim/network";
import { DemoButton, DemoFrame } from "./DemoFrame";

const KIND_STYLE: Record<NetLink["kind"], { color: string; dash?: string }> = {
  "4G/5G": { color: "var(--teal)" },
  Microwave: { color: "var(--sky)" },
  "UHF/VHF": { color: "#8a6f3c", dash: "2 5" },
  SATCOM: { color: "var(--mustard)", dash: "8 6" },
};

const pos = (id: string) => nodes.find((n) => n.id === id)!;

function midpoint(l: NetLink) {
  const a = pos(l.a);
  const b = pos(l.b);
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function NetworkDemo() {
  const [state, dispatch] = useReducer(networkReducer, initialNetwork);
  const isolated = isolatedNodes(state);
  const { phase } = state;

  const status =
    phase === "nominal"
      ? "All links up. Every site can reach HQ."
      : phase === "failed"
        ? `Storm damage: ${state.failed.length} links down. ${isolated.map(nodeLabel).join(" and ")} cut off from HQ.`
        : phase === "proposed"
          ? "Recovery agent has a recommendation. Nothing changes until an operator approves it."
          : phase === "rejected"
            ? "Recommendation rejected. The network stays as it is. You can ask again."
            : `Service restored over a temporary path. ${state.failed.length} physical links are still down.`;

  return (
    <DemoFrame
      title="Interactive model · network under stress"
      caption="Illustrative topology and confidence value. The real platform models 4G/5G, microwave, SATCOM and UHF/VHF links under failure and environmental stress."
      controls={
        <>
          <DemoButton
            tone="danger"
            onClick={() => dispatch({ type: "fail" })}
            disabled={phase !== "nominal"}
          >
            Introduce Failure
          </DemoButton>
          <DemoButton
            tone="primary"
            onClick={() => dispatch({ type: "propose" })}
            disabled={phase !== "failed" && phase !== "rejected"}
          >
            Attempt Recovery
          </DemoButton>
          <DemoButton onClick={() => dispatch({ type: "reset" })} disabled={phase === "nominal"}>
            Reset
          </DemoButton>
        </>
      }
      aside={
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-ink-soft font-mono text-[0.7rem] tracking-wider uppercase">
              Physical state
            </p>
            <p className="mt-1 font-semibold">
              {state.failed.length === 0 ? "No failures" : `${state.failed.length} links failed`}
            </p>
            {state.failed.length > 0 && (
              <ul className="text-ink-soft mt-1 space-y-0.5">
                {state.failed.map((id) => {
                  const l = links.find((x) => x.id === id)!;
                  return (
                    <li key={id}>
                      ✕ {nodeLabel(l.a)} to {nodeLabel(l.b)} ({l.kind})
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div>
            <p className="text-ink-soft font-mono text-[0.7rem] tracking-wider uppercase">
              Restored state
            </p>
            <p className="mt-1 font-semibold">
              {state.temporary.length === 0
                ? "No temporary paths"
                : "Temporary SATCOM relay active"}
            </p>
            <p className="text-ink-soft">
              {isolated.length === 0
                ? "All sites reachable."
                : `${isolated.length} sites unreachable.`}
            </p>
          </div>

          {phase === "proposed" && (
            <div
              className="border-line bg-mustard-soft rounded-2xl border-2 p-4"
              role="region"
              aria-label="Agent recommendation"
            >
              <p className="font-mono text-[0.7rem] tracking-wider uppercase">Agent recommends</p>
              <p className="mt-1 font-semibold">{recommendation.action}</p>
              <p className="text-ink-soft mt-1">{recommendation.rationale}</p>
              <p className="mt-2 font-mono text-xs">
                Confidence {recommendation.confidence.toFixed(2)}
              </p>
              <div className="mt-3 flex gap-2">
                <DemoButton tone="primary" onClick={() => dispatch({ type: "approve" })}>
                  Approve
                </DemoButton>
                <DemoButton onClick={() => dispatch({ type: "reject" })}>Reject</DemoButton>
              </div>
            </div>
          )}
          {phase === "recovered" && (
            <p className="bg-teal-soft rounded-xl p-3">
              Note the failed links are still marked failed. The workaround never pretends to be a
              repair.
            </p>
          )}
        </div>
      }
    >
      <p aria-live="polite" className="mb-3 min-h-12 text-[0.95rem] font-medium">
        {status}
      </p>
      <svg
        viewBox="0 -30 660 360"
        className="h-auto w-full"
        role="img"
        aria-label={`Network diagram. ${status}`}
      >
        {links.map((l) => {
          const a = pos(l.a);
          const b = pos(l.b);
          const failed = state.failed.includes(l.id);
          const s = KIND_STYLE[l.kind];
          const m = midpoint(l);
          return (
            <g key={l.id}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={failed ? "var(--danger)" : s.color}
                strokeWidth={failed ? 2.5 : 5}
                strokeDasharray={failed ? "4 7" : s.dash}
                strokeLinecap="round"
                opacity={failed ? 0.7 : 1}
                style={{ transition: "all 0.4s ease" }}
              />
              {failed && (
                <g transform={`translate(${m.x} ${m.y})`}>
                  <circle r="11" fill="var(--card)" stroke="var(--danger)" strokeWidth="2.5" />
                  <path
                    d="M-5 -5 L5 5 M5 -5 L-5 5"
                    stroke="var(--danger)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </g>
              )}
            </g>
          );
        })}
        {state.temporary.map((l) => {
          const a = pos(l.a);
          const b = pos(l.b);
          return (
            <line
              key={l.id}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--mustard)"
              strokeWidth="5"
              strokeDasharray="10 8"
              strokeLinecap="round"
              className="animate-dash"
            />
          );
        })}
        {nodes.map((n) => {
          const cut = isolated.includes(n.id);
          const standby = n.id === "sat" && state.temporary.length === 0;
          return (
            <g key={n.id} transform={`translate(${n.x} ${n.y})`} opacity={standby ? 0.45 : 1}>
              <circle
                r={n.id === "hq" ? 20 : 15}
                fill={
                  n.id === "hq"
                    ? "var(--ink)"
                    : cut
                      ? "var(--card)"
                      : n.id === "sat"
                        ? "var(--mustard)"
                        : "var(--teal)"
                }
                stroke={cut ? "var(--danger)" : "var(--line)"}
                strokeWidth="3"
                strokeDasharray={cut ? "4 3" : undefined}
              />
              <text
                y={n.id === "sat" ? -24 : 34}
                textAnchor="middle"
                fontSize="13"
                fontWeight="600"
                fill="var(--ink)"
                fontFamily="var(--font-sans)"
              >
                {n.label}
                {cut ? " (cut off)" : standby ? " (standby)" : ""}
              </text>
            </g>
          );
        })}
      </svg>
      <ul className="text-ink-soft mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs" aria-label="Legend">
        {Object.entries(KIND_STYLE).map(([k, s]) => (
          <li key={k} className="flex items-center gap-1.5">
            <svg width="26" height="8" aria-hidden>
              <line
                x1="1"
                y1="4"
                x2="25"
                y2="4"
                stroke={s.color}
                strokeWidth="4"
                strokeDasharray={s.dash}
              />
            </svg>
            {k}
          </li>
        ))}
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="text-danger font-mono">
            ✕
          </span>{" "}
          failed link
        </li>
      </ul>
    </DemoFrame>
  );
}
