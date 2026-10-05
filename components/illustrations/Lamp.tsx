"use client";

import { useEffect, useRef } from "react";

const PIVOT = { x: 186, y: 62 };

/**
 * An anglepoise lamp whose head leans gently toward the pointer.
 * Writes a CSS variable directly so pointer movement never re-renders React.
 */
export function Lamp({ className = "", glow = true }: { className?: string; glow?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = svg.getBoundingClientRect();
        const scale = box.width / 240;
        const px = box.left + PIVOT.x * scale;
        const py = box.top + PIVOT.y * scale;
        const deg = (Math.atan2(e.clientY - py, e.clientX - px) * 180) / Math.PI - 90;
        const wrapped = ((deg + 540) % 360) - 180;
        const clamped = Math.max(-28, Math.min(28, wrapped * 0.45));
        svg.style.setProperty("--lamp-angle", `${clamped.toFixed(2)}deg`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 240 300"
      className={`overflow-visible ${className}`}
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id="lamp-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe6a6" stopOpacity="0.75" />
          <stop offset="0.9" stopColor="#ffe6a6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* base */}
      <ellipse
        cx="70"
        cy="282"
        rx="56"
        ry="13"
        fill="var(--slate)"
        stroke="var(--line)"
        strokeWidth="3"
      />
      <rect
        x="58"
        y="262"
        width="24"
        height="18"
        rx="4"
        fill="var(--slate)"
        stroke="var(--line)"
        strokeWidth="3"
      />

      {/* arms */}
      <path d="M70 264 L122 150" stroke="var(--line)" strokeWidth="13" strokeLinecap="round" />
      <path d="M70 264 L122 150" stroke="var(--terracotta)" strokeWidth="7" strokeLinecap="round" />
      <path d="M122 150 L180 70" stroke="var(--line)" strokeWidth="13" strokeLinecap="round" />
      <path d="M122 150 L180 70" stroke="var(--terracotta)" strokeWidth="7" strokeLinecap="round" />
      <path d="M84 238 L130 170" stroke="var(--line)" strokeWidth="2" strokeDasharray="3 4" />
      <circle cx="122" cy="150" r="9" fill="var(--mustard)" stroke="var(--line)" strokeWidth="3" />

      {/* head, rotates around its pivot */}
      <g
        style={{
          transform: "rotate(var(--lamp-angle, 8deg))",
          transformOrigin: `${PIVOT.x}px ${PIVOT.y}px`,
          transition: "transform 0.25s ease-out",
        }}
      >
        {glow && <path d="M158 122 L214 122 L292 330 L70 330 Z" fill="url(#lamp-light)" />}
        <path
          d="M172 66 C176 54 196 54 200 66 L222 118 Q186 134 150 118 Z"
          fill="var(--terracotta)"
          stroke="var(--line)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M180 66 L166 112"
          stroke="#fff"
          strokeOpacity="0.35"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <ellipse
          cx="186"
          cy="121"
          rx="31"
          ry="7"
          fill="#fff4cf"
          stroke="var(--line)"
          strokeWidth="2.5"
        />
        <circle
          cx={PIVOT.x}
          cy={PIVOT.y}
          r="7"
          fill="var(--mustard)"
          stroke="var(--line)"
          strokeWidth="3"
        />
      </g>
    </svg>
  );
}
