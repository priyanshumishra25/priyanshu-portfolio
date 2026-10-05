/** The room: a wall, a pinboard and the desk itself. Purely decorative. */
export function DeskSurface() {
  return (
    <svg
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden
      focusable="false"
    >
      <rect width="1600" height="1000" fill="#ece3d3" />
      {/* pinboard */}
      <rect
        x="560"
        y="26"
        width="420"
        height="150"
        rx="10"
        fill="#d8bf98"
        stroke="var(--line)"
        strokeWidth="4"
      />
      <g transform="rotate(-3 640 100)">
        <rect
          x="590"
          y="50"
          width="110"
          height="96"
          fill="var(--card)"
          stroke="var(--line)"
          strokeWidth="3"
        />
        <path
          d="M606 76 h76 M606 92 h60 M606 108 h70"
          stroke="var(--line)"
          strokeWidth="3"
          opacity="0.35"
        />
        <circle
          cx="645"
          cy="56"
          r="7"
          fill="var(--terracotta)"
          stroke="var(--line)"
          strokeWidth="2.5"
        />
      </g>
      <g transform="rotate(4 790 100)">
        <rect
          x="730"
          y="46"
          width="124"
          height="104"
          fill="var(--teal-soft)"
          stroke="var(--line)"
          strokeWidth="3"
        />
        <path
          d="M748 126 L774 96 L796 110 L828 72"
          fill="none"
          stroke="var(--teal)"
          strokeWidth="4"
        />
        <circle
          cx="792"
          cy="52"
          r="7"
          fill="var(--mustard)"
          stroke="var(--line)"
          strokeWidth="2.5"
        />
      </g>
      <g transform="rotate(-2 920 100)">
        <rect
          x="878"
          y="58"
          width="82"
          height="82"
          fill="var(--mustard)"
          stroke="var(--line)"
          strokeWidth="3"
        />
        <text
          x="919"
          y="106"
          textAnchor="middle"
          fontSize="22"
          fontFamily="var(--font-display)"
          fontWeight="600"
          fill="var(--ink)"
        >
          why?
        </text>
      </g>
      {/* desk */}
      <path
        d="M80 270 H1520 L1600 880 H0 Z"
        fill="var(--wood)"
        stroke="var(--line)"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M0 880 H1600 V940 H0 Z"
        fill="var(--wood-edge)"
        stroke="var(--line)"
        strokeWidth="5"
      />
      <g stroke="#c9ad83" strokeWidth="3" fill="none" opacity="0.7">
        <path d="M200 380 C500 360 800 400 1200 370" />
        <path d="M120 560 C460 540 900 590 1480 550" />
        <path d="M60 760 C420 740 1000 790 1560 750" />
      </g>
      <rect y="940" width="1600" height="60" fill="#e4dac8" />
    </svg>
  );
}
