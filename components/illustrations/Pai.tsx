/** PAI, a small desk companion. Asleep by default, awake on hover or when open. */
export function Pai({ awake = false, className = "" }: { awake?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 132"
      className={`${awake ? "pai-awake" : ""} ${className}`}
      aria-hidden
      focusable="false"
    >
      {/* antenna */}
      <path d="M60 22 V8" stroke="var(--line)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="8" r="6" fill="var(--mustard)" stroke="var(--line)" strokeWidth="2.5" />
      {/* feet */}
      <rect
        x="28"
        y="112"
        width="20"
        height="12"
        rx="5"
        fill="var(--slate)"
        stroke="var(--line)"
        strokeWidth="2.5"
      />
      <rect
        x="72"
        y="112"
        width="20"
        height="12"
        rx="5"
        fill="var(--slate)"
        stroke="var(--line)"
        strokeWidth="2.5"
      />
      {/* body */}
      <rect
        x="12"
        y="22"
        width="96"
        height="94"
        rx="26"
        fill="var(--card)"
        stroke="var(--line)"
        strokeWidth="3"
      />
      <rect
        x="24"
        y="36"
        width="72"
        height="50"
        rx="14"
        fill="var(--slate)"
        stroke="var(--line)"
        strokeWidth="2.5"
      />
      {/* eyes */}
      <g className="pai-eyes-closed svg-part">
        <path
          d="M38 62 q8 6 16 0"
          stroke="#9fd9c4"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M66 62 q8 6 16 0"
          stroke="#9fd9c4"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
        <text x="88" y="34" fontSize="13" fontFamily="var(--font-mono)" fill="var(--ink-soft)">
          z
        </text>
      </g>
      <g className="pai-eyes-open svg-part" opacity="0">
        <ellipse cx="46" cy="60" rx="6" ry="8" fill="#9fd9c4" />
        <ellipse cx="74" cy="60" rx="6" ry="8" fill="#9fd9c4" />
        <circle cx="48" cy="57" r="2" fill="var(--card)" />
        <circle cx="76" cy="57" r="2" fill="var(--card)" />
      </g>
      {/* cheek light and speaker grille */}
      <circle cx="30" cy="100" r="4" fill="var(--terracotta)" />
      <path
        d="M70 98 h22 M70 104 h22"
        stroke="var(--line)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
