import type { DecisionId } from "@/content/types";

const s = {
  stroke: "var(--line)",
  strokeWidth: 2.5,
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const t = { fontSize: 11, fontFamily: "var(--font-mono)", fill: "var(--ink)", fontWeight: 600 };

function Box({
  x,
  y,
  w,
  label,
  fill = "var(--card)",
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  fill?: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height="26"
        rx="6"
        fill={fill}
        stroke="var(--line)"
        strokeWidth="2.5"
      />
      <text x={x + w / 2} y={y + 17} textAnchor="middle" {...t}>
        {label}
      </text>
    </g>
  );
}

const descriptions: Record<DecisionId, string> = {
  d01: "Diagram: an agent sends a recommendation to a human, who is the only one who can trigger the action.",
  d02: "Diagram: two separate layers, physical failure state underneath and temporary restored state on top.",
  d03: "Diagram: frontend, backend and AI agents all connect to a shared contract in the middle.",
  d04: "Diagram: four data sources, one marked missing, and the output keeps the gap visible.",
  d05: "Diagram: a parent process forks isolated children; one crashes, one hangs, the parent survives.",
  d06: "Diagram: a confidence dial instead of a yes or no switch.",
};

/** Margin sketches for each decision. Simple on purpose: a whiteboard, not a poster. */
export function DecisionDiagram({ id }: { id: DecisionId }) {
  return (
    <svg viewBox="0 0 220 130" className="h-auto w-full" role="img" aria-label={descriptions[id]}>
      {id === "d01" && (
        <>
          <defs>
            <marker
              id="decision-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10 z" fill="var(--line)" />
            </marker>
          </defs>
          <Box x={6} y={14} w={70} label="agent" fill="var(--teal-soft)" />
          <Box x={120} y={14} w={90} label="operator" fill="var(--mustard-soft)" />
          <Box x={120} y={90} w={90} label="action" />
          <path d="M76 27 H118" {...s} markerEnd="url(#decision-arrow)" />
          <text x="80" y="48" {...t} fontSize={9}>
            recommends
          </text>
          <path d="M165 40 V88" {...s} />
          <text x="170" y="68" {...t} fontSize={9}>
            approves
          </text>
          <path
            d="M40 40 C40 90 80 104 118 103"
            {...s}
            strokeDasharray="4 5"
            stroke="var(--danger)"
          />
          <text x="34" y="96" {...t} fontSize={14} fill="var(--danger)">
            ✕
          </text>
        </>
      )}
      {id === "d02" && (
        <>
          <rect
            x="20"
            y="70"
            width="180"
            height="40"
            rx="6"
            fill="#f7dcd5"
            stroke="var(--line)"
            strokeWidth="2.5"
          />
          <text x="110" y="95" textAnchor="middle" {...t}>
            physical: link failed
          </text>
          <rect
            x="34"
            y="20"
            width="152"
            height="36"
            rx="6"
            fill="var(--mustard-soft)"
            stroke="var(--line)"
            strokeWidth="2.5"
            strokeDasharray="6 4"
          />
          <text x="110" y="42" textAnchor="middle" {...t}>
            restored: temp SATCOM
          </text>
          <path d="M110 56 V68" {...s} />
        </>
      )}
      {id === "d03" && (
        <>
          <Box x={70} y={52} w={80} label="contract" fill="var(--mustard)" />
          <Box x={4} y={8} w={70} label="frontend" />
          <Box x={146} y={8} w={70} label="backend" />
          <Box x={75} y={100} w={70} label="agents" fill="var(--teal-soft)" />
          <path d="M40 34 L84 52 M180 34 L136 52 M110 78 V100" {...s} />
        </>
      )}
      {id === "d04" && (
        <>
          {["price", "news", "reddit", "api"].map((label, i) => (
            <g key={label}>
              <Box
                x={4}
                y={6 + i * 30}
                w={66}
                label={label}
                fill={i === 3 ? "var(--card)" : "var(--teal-soft)"}
              />
              <path
                d={`M70 ${19 + i * 30} C110 ${19 + i * 30} 110 65 140 65`}
                {...s}
                strokeDasharray={i === 3 ? "3 5" : undefined}
                stroke={i === 3 ? "var(--danger)" : "var(--line)"}
              />
            </g>
          ))}
          <Box x={140} y={52} w={76} label="3 of 4" fill="var(--mustard-soft)" />
          <text x="98" y="112" {...t} fill="var(--danger)">
            ✕ stays ✕
          </text>
        </>
      )}
      {id === "d05" && (
        <>
          <Box x={70} y={6} w={80} label="fuzzer" fill="var(--mustard-soft)" />
          {["exit 0", "SIGSEGV", "timeout"].map((label, i) => (
            <g key={label}>
              <path d={`M110 32 L${38 + i * 72} 84`} {...s} />
              <Box
                x={4 + i * 72}
                y={86}
                w={68}
                label={label}
                fill={i === 1 ? "#f7dcd5" : i === 2 ? "var(--paper-deep)" : "var(--teal-soft)"}
              />
            </g>
          ))}
          <text x="132" y="60" {...t} fontSize={9}>
            fork/exec
          </text>
        </>
      )}
      {id === "d06" && (
        <>
          <path
            d="M40 110 A70 70 0 0 1 180 110"
            {...s}
            strokeWidth={10}
            stroke="var(--paper-deep)"
          />
          <path d="M40 110 A70 70 0 0 1 160 62" {...s} strokeWidth={10} stroke="var(--teal)" />
          <path d="M110 110 L150 66" {...s} strokeWidth={3} />
          <circle cx="110" cy="110" r="6" fill="var(--line)" />
          <text x="20" y="126" {...t} fontSize={9}>
            unsure
          </text>
          <text x="170" y="126" {...t} fontSize={9}>
            sure
          </text>
        </>
      )}
    </svg>
  );
}
