/**
 * Static desk objects. Hover and focus behaviour lives in globals.css
 * (".desk-object:hover .notebook-cover" and friends) so these stay pure SVG.
 */

const ink = { stroke: "var(--line)", strokeWidth: 3, strokeLinejoin: "round" as const };

export function Laptop({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 200" className={className} aria-hidden focusable="false">
      {/* lid */}
      <rect x="42" y="8" width="216" height="144" rx="10" fill="var(--slate)" {...ink} />
      <rect x="54" y="20" width="192" height="118" rx="4" fill="#26333a" />
      <path
        d="M70 30 L96 30"
        stroke="#fff"
        strokeOpacity="0.15"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* screen wakes on hover: a tiny network and a terminal */}
      <g className="laptop-screen-on svg-part" opacity="0">
        <rect x="54" y="20" width="192" height="118" rx="4" fill="#f6f1e7" />
        <g stroke="var(--line)" strokeWidth="1.6">
          <path d="M80 54 L118 40 L156 58 L118 80 Z M118 40 L118 80" fill="none" />
          <path d="M156 58 L188 46" strokeDasharray="3 3" stroke="var(--terracotta)" />
        </g>
        {[
          [80, 54],
          [118, 40],
          [156, 58],
          [118, 80],
          [188, 46],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="5"
            fill={i === 4 ? "var(--mustard)" : "var(--teal)"}
            stroke="var(--line)"
            strokeWidth="1.5"
          />
        ))}
        <rect x="64" y="96" width="172" height="34" rx="3" fill="#e9e1d1" />
        <text x="70" y="110" fontSize="9" fontFamily="var(--font-mono)" fill="var(--ink)">
          $ make things
        </text>
        <text x="70" y="123" fontSize="9" fontFamily="var(--font-mono)" fill="var(--teal)">
          4 projects found
        </text>
      </g>
      {/* sticky note */}
      <g transform="rotate(6 236 128)">
        <rect
          x="216"
          y="108"
          width="40"
          height="38"
          fill="var(--mustard)"
          stroke="var(--line)"
          strokeWidth="2"
        />
        <path
          d="M222 120 h26 M222 128 h20 M222 136 h24"
          stroke="var(--line)"
          strokeWidth="1.6"
          opacity="0.6"
        />
      </g>
      {/* base */}
      <path d="M24 152 H276 L296 182 Q296 190 288 190 H12 Q4 190 4 182 Z" fill="#ddd5c6" {...ink} />
      <path
        d="M40 160 H260 M36 168 H264 M32 176 H268"
        stroke="var(--line)"
        strokeOpacity="0.25"
        strokeWidth="2"
      />
      <rect
        x="122"
        y="178"
        width="56"
        height="8"
        rx="3"
        fill="#cbc2b1"
        stroke="var(--line)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function Notebook({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 170" className={className} aria-hidden focusable="false">
      {/* pencil */}
      <g transform="rotate(-18 150 150)">
        <rect
          x="70"
          y="146"
          width="110"
          height="10"
          rx="2"
          fill="var(--mustard)"
          stroke="var(--line)"
          strokeWidth="2.5"
        />
        <path
          d="M180 146 L194 151 L180 156 Z"
          fill="#f2d7b0"
          stroke="var(--line)"
          strokeWidth="2"
        />
        <rect
          x="62"
          y="146"
          width="10"
          height="10"
          fill="#e88f86"
          stroke="var(--line)"
          strokeWidth="2"
        />
      </g>
      {/* pages */}
      <rect x="30" y="22" width="140" height="118" rx="5" fill="var(--card)" {...ink} />
      <path
        d="M44 48 h100 M44 62 h92 M44 76 h104 M44 90 h70"
        stroke="var(--sky)"
        strokeWidth="2"
        opacity="0.6"
      />
      {/* cover lifts on hover */}
      <g className="notebook-cover svg-part" style={{ transformOrigin: "left center" }}>
        <rect x="22" y="14" width="140" height="118" rx="6" fill="var(--terracotta)" {...ink} />
        <rect
          x="46"
          y="44"
          width="84"
          height="30"
          rx="3"
          fill="var(--card)"
          stroke="var(--line)"
          strokeWidth="2"
        />
        <text
          x="88"
          y="64"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fontFamily="var(--font-mono)"
          fill="var(--ink)"
        >
          WHY?
        </text>
        <rect x="140" y="14" width="8" height="118" fill="var(--line)" />
      </g>
    </svg>
  );
}

export function ResearchFolder({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 170" className={className} aria-hidden focusable="false">
      <path
        d="M14 30 Q14 22 22 22 H78 L90 34 H198 Q206 34 206 42 V150 H14 Z"
        fill="#d9b468"
        {...ink}
      />
      <g className="folder-papers svg-part">
        <rect
          x="34"
          y="18"
          width="140"
          height="110"
          rx="3"
          fill="var(--card)"
          transform="rotate(-4 104 72)"
          {...ink}
        />
        <rect x="44" y="26" width="140" height="110" rx="3" fill="#fffdf8" {...ink} />
        <text
          x="56"
          y="46"
          fontSize="9"
          fontWeight="700"
          fontFamily="var(--font-mono)"
          fill="var(--ink)"
        >
          FIG. 1: DoH vs fallback
        </text>
        <path
          d="M58 92 L80 80 L100 86 L120 60 L140 66 L162 52"
          fill="none"
          stroke="var(--teal)"
          strokeWidth="2.5"
        />
        <path d="M58 100 H170" stroke="var(--line)" strokeWidth="1.5" />
        <circle
          cx="120"
          cy="60"
          r="5"
          fill="var(--terracotta)"
          stroke="var(--line)"
          strokeWidth="1.5"
        />
      </g>
      <path
        d="M8 66 Q8 58 16 58 H204 Q212 58 212 66 L204 150 Q204 158 196 158 H24 Q16 158 16 150 Z"
        fill="#ecca7f"
        {...ink}
      />
      <rect
        x="30"
        y="76"
        width="70"
        height="18"
        rx="2"
        fill="var(--card)"
        stroke="var(--line)"
        strokeWidth="2"
      />
      <text
        x="36"
        y="89"
        fontSize="9"
        fontWeight="700"
        fontFamily="var(--font-mono)"
        fill="var(--ink)"
      >
        UNSW / DNS
      </text>
      <path
        d="M180 50 V92 Q180 100 172 100 Q164 100 164 92 V60"
        fill="none"
        stroke="#8b8f96"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BrokenChip({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 190 150" className={className} aria-hidden focusable="false">
      {/* probe wire */}
      <path
        d="M2 120 C30 120 34 96 58 96"
        fill="none"
        stroke="var(--terracotta)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <rect x="10" y="22" width="170" height="112" rx="10" fill="var(--teal)" {...ink} />
      <g stroke="#a9d1bd" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M24 40 H60 V60 M24 112 H50 V92 M150 36 V56 H130 M168 104 H140 V88 M100 30 V48 M110 130 V112" />
      </g>
      {[24, 112, 168, 150].map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy={[40, 112, 104, 36][i]}
          r="4"
          fill="var(--mustard)"
          stroke="var(--line)"
          strokeWidth="1.5"
        />
      ))}
      {/* IC with pins */}
      <g stroke="var(--line)" strokeWidth="2.5">
        {[66, 78, 90, 102, 114].map((x) => (
          <path key={x} d={`M${x} 52 V44 M${x} 108 V116`} />
        ))}
      </g>
      <rect x="58" y="52" width="70" height="56" rx="5" fill="#3a3530" {...ink} />
      <circle cx="68" cy="62" r="3" fill="#6b645b" />
      {/* the crack */}
      <path
        d="M84 52 L96 70 L88 80 L104 94 L98 108"
        fill="none"
        stroke="var(--card)"
        strokeWidth="3"
        strokeLinejoin="bevel"
      />
      <g className="chip-spark svg-part" opacity="0">
        <path
          d="M110 62 L116 72 L126 68 L118 78 L124 88 L112 82 L104 90 L108 78 L98 72 L110 72 Z"
          fill="var(--mustard)"
          stroke="var(--line)"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

export function ResumeSheet({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 200" className={className} aria-hidden focusable="false">
      <g
        className="resume-sheet svg-part"
        style={{ transformOrigin: "center", transform: "rotate(-5deg)" }}
      >
        <rect x="20" y="10" width="140" height="180" rx="3" fill="#fffdf8" {...ink} />
        <rect x="34" y="26" width="70" height="10" rx="2" fill="var(--ink)" />
        <path
          d="M34 46 h90 M34 64 h112 M34 74 h100 M34 84 h108 M34 102 h112 M34 112 h96 M34 122 h104 M34 140 h112 M34 150 h80"
          stroke="var(--line)"
          strokeWidth="2"
          opacity="0.35"
        />
        <g transform="rotate(-14 104 136)" opacity="0.85">
          <rect
            x="62"
            y="122"
            width="88"
            height="30"
            rx="4"
            fill="none"
            stroke="var(--terracotta)"
            strokeWidth="3"
          />
          <text
            x="106"
            y="143"
            textAnchor="middle"
            fontSize="15"
            fontWeight="800"
            fontFamily="var(--font-mono)"
            fill="var(--terracotta)"
          >
            BORING
          </text>
        </g>
      </g>
    </svg>
  );
}

export function ContactCards({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 190 150" className={className} aria-hidden focusable="false">
      <rect
        x="20"
        y="48"
        width="140"
        height="84"
        rx="6"
        fill="var(--paper-deep)"
        transform="rotate(-6 90 90)"
        {...ink}
      />
      <g className="card-top svg-part">
        <rect x="28" y="40" width="140" height="84" rx="6" fill="var(--card)" {...ink} />
        <circle
          cx="56"
          cy="70"
          r="14"
          fill="var(--mustard)"
          stroke="var(--line)"
          strokeWidth="2.5"
        />
        <text
          x="56"
          y="75"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fontFamily="var(--font-display)"
          fill="var(--ink)"
        >
          PM
        </text>
        <path d="M80 64 h66 M80 76 h50" stroke="var(--line)" strokeWidth="2.5" opacity="0.5" />
        <text
          x="44"
          y="108"
          fontSize="11"
          fontWeight="600"
          fontFamily="var(--font-mono)"
          fill="var(--teal)"
        >
          say hello →
        </text>
      </g>
      {/* phone handset */}
      <path
        d="M150 8 C170 8 182 20 182 30 L170 40 L160 32 C154 36 150 44 150 52 L160 60 L150 72 C138 70 130 50 132 30 C134 18 140 8 150 8 Z"
        fill="var(--sky)"
        {...ink}
      />
    </svg>
  );
}

export function Coffee({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 110 120"
      className={`overflow-visible ${className}`}
      aria-hidden
      focusable="false"
    >
      <g
        className="coffee-steam svg-part"
        opacity="0"
        fill="none"
        stroke="var(--ink-soft)"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <path d="M36 30 q-6 -8 0 -16 q6 -8 0 -16" />
        <path d="M52 28 q-6 -8 0 -16 q6 -8 0 -16" />
        <path d="M68 30 q-6 -8 0 -16 q6 -8 0 -16" />
      </g>
      <ellipse
        cx="52"
        cy="108"
        rx="44"
        ry="8"
        fill="var(--paper-deep)"
        stroke="var(--line)"
        strokeWidth="2.5"
      />
      <path d="M84 56 q22 0 22 18 q0 18 -24 18" fill="none" stroke="var(--line)" strokeWidth="9" />
      <path d="M84 56 q22 0 22 18 q0 18 -24 18" fill="none" stroke="var(--card)" strokeWidth="4" />
      <path d="M18 40 H86 V96 Q86 106 76 106 H28 Q18 106 18 96 Z" fill="var(--card)" {...ink} />
      <ellipse cx="52" cy="40" rx="34" ry="8" fill="#6b4a32" {...ink} />
      <path d="M30 64 h44" stroke="var(--terracotta)" strokeWidth="5" />
      <text
        x="52"
        y="86"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fontFamily="var(--font-mono)"
        fill="var(--ink)"
      >
        {"{ }"}
      </text>
    </svg>
  );
}
