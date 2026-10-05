import { BrokenChip } from "@/components/illustrations/DeskArt";

/** Small identifying illustration for each project card. */
export function ProjectGlyph({ slug, className = "" }: { slug: string; className?: string }) {
  if (slug === "midpoint-fuzzer") return <BrokenChip className={className} />;

  return (
    <svg viewBox="0 0 120 90" className={className} aria-hidden focusable="false">
      {slug === "armsoa" && (
        <g stroke="var(--line)" strokeWidth="2.5">
          <path d="M18 46 L48 20 L84 30 L104 60 L60 72 Z M48 20 L60 72" fill="none" />
          <path d="M84 30 L104 60" stroke="var(--terracotta)" strokeDasharray="5 4" />
          {[
            [18, 46],
            [48, 20],
            [84, 30],
            [104, 60],
            [60, 72],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="7" fill={i === 3 ? "var(--mustard)" : "var(--teal)"} />
          ))}
        </g>
      )}
      {slug === "quant-ai" && (
        <g stroke="var(--line)" strokeWidth="2.5">
          <rect x="10" y="10" width="100" height="70" rx="6" fill="var(--card)" />
          <path d="M20 62 L40 48 L56 54 L74 32" fill="none" stroke="var(--teal)" strokeWidth="3" />
          <path d="M74 32 L100 22" fill="none" strokeDasharray="4 5" stroke="var(--ink-soft)" />
          <text
            x="86"
            y="66"
            fontSize="16"
            fontWeight="700"
            fill="var(--danger)"
            stroke="none"
            fontFamily="var(--font-mono)"
          >
            ?
          </text>
        </g>
      )}
      {slug === "wheat-segmentation" && (
        <g stroke="var(--line)" strokeWidth="2">
          <rect x="10" y="8" width="100" height="74" rx="6" fill="#c9b36a" strokeWidth="2.5" />
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M${20 + i * 20} 12 C${16 + i * 20} 40 ${26 + i * 20} 54 ${20 + i * 20} 78`}
              stroke="#6f8f3a"
              strokeWidth="7"
              fill="none"
            />
          ))}
          <path d="M60 8 V82" strokeDasharray="4 3" stroke="var(--line)" />
          <rect
            x="60"
            y="8"
            width="50"
            height="74"
            fill="var(--teal)"
            opacity="0.35"
            stroke="none"
          />
        </g>
      )}
      {slug === "insurance-fraud" && (
        <g stroke="var(--line)" strokeWidth="2.5">
          <rect x="22" y="10" width="64" height="74" rx="4" fill="var(--card)" />
          <path d="M32 26 h44 M32 38 h36 M32 50 h40" opacity="0.5" />
          <circle cx="82" cy="60" r="18" fill="var(--mustard-soft)" />
          <path d="M95 73 L108 86" strokeWidth="5" strokeLinecap="round" />
          <path d="M75 60 l5 5 l9 -10" stroke="var(--teal)" strokeWidth="3" fill="none" />
        </g>
      )}
      {slug === "bittrickle" && (
        <g stroke="var(--line)" strokeWidth="2.5">
          <path d="M30 24 L90 24 M30 24 L60 70 M90 24 L60 70" strokeDasharray="5 4" />
          {[
            [30, 24],
            [90, 24],
            [60, 70],
          ].map(([x, y], i) => (
            <rect
              key={i}
              x={x! - 12}
              y={y! - 10}
              width="24"
              height="20"
              rx="4"
              fill={["var(--sky)", "var(--mustard)", "var(--teal-soft)"][i]}
            />
          ))}
        </g>
      )}
      {slug === "tributary" && (
        <g stroke="var(--line)" strokeWidth="2.5">
          {[20, 45, 70].map((y, i) => (
            <g key={y}>
              <path d={`M10 45 C30 45 30 ${y} 50 ${y} H110`} fill="none" />
              <rect
                x={60 + i * 12}
                y={y - 6}
                width="12"
                height="12"
                rx="2"
                fill={["var(--mustard)", "var(--teal)", "var(--terracotta)"][i]}
              />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
