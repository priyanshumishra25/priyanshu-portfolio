"use client";

import { useMemo, useState } from "react";
import { buildField, FIELD_H, FIELD_W, PATCH, superpixelEdges } from "@/lib/sim/field";
import { DemoFrame } from "./DemoFrame";

type Method = "original" | "slic" | "rf" | "unet" | "segformer";

const METHODS: { id: Method; label: string; family: string; how: string }[] = [
  {
    id: "original",
    label: "Original",
    family: "Input",
    how: "An aerial view of a wheat field: crop rows, a tractor track and a bare patch.",
  },
  {
    id: "slic",
    label: "SLIC",
    family: "Traditional superpixel segmentation",
    how: "Groups nearby pixels with similar colour into superpixels, so the image becomes a few hundred regions instead of thousands of pixels.",
  },
  {
    id: "rf",
    label: "Random Forest",
    family: "Classical supervised ML",
    how: "Classifies crop versus background from engineered features, such as colour and texture, computed for each pixel or region.",
  },
  {
    id: "unet",
    label: "U-Net",
    family: "CNN semantic segmentation",
    how: "An encoder-decoder network, here with a ResNet50 backbone, that learns features directly from labelled images and predicts a mask.",
  },
  {
    id: "segformer",
    label: "SegFormer",
    family: "Transformer semantic segmentation",
    how: "A transformer encoder over image patches with a lightweight decoder. B0 is the smallest SegFormer variant.",
  },
];

const S = 10; // px per cell

function soil(shade: number) {
  return `hsl(26 ${32 + shade * 8}% ${46 + shade * 6}%)`;
}
function wheat(shade: number) {
  return `hsl(${74 + shade * 12} ${40 + shade * 8}% ${40 + shade * 7}%)`;
}

export function WheatDemo() {
  const cells = useMemo(() => buildField(), []);
  const edges = useMemo(() => superpixelEdges(cells), [cells]);
  const [method, setMethod] = useState<Method>("slic");
  const [reveal, setReveal] = useState(60);
  const active = METHODS.find((m) => m.id === method)!;
  const crop = cells.filter((c) => c.crop);
  const W = FIELD_W * S;
  const H = FIELD_H * S;

  return (
    <DemoFrame
      title="Interactive model · how much model does a field need?"
      caption="Illustrative reconstruction of the segmentation workflow. Every approach is drawn over the same field and target mask; drag the slider to compare."
      controls={
        <div role="radiogroup" aria-label="Approach" className="flex flex-wrap gap-1.5">
          {METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={method === m.id}
              onClick={() => setMethod(m.id)}
              className={`border-line rounded-full border-2 px-3 py-1 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                method === m.id ? "bg-ink text-paper" : "bg-card shadow-hard"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      }
      aside={
        <div className="space-y-4 text-sm">
          <div aria-live="polite">
            <p className="text-ink-soft font-mono text-[0.7rem] tracking-wider uppercase">
              {active.family}
            </p>
            <p className="font-display mt-1 text-xl font-semibold">{active.label}</p>
            <p className="text-ink-soft mt-1">{active.how}</p>
          </div>
          <div className="border-line/20 rounded-xl border-2 border-dashed p-3">
            <p className="text-ink-soft font-mono text-[0.7rem] tracking-wider uppercase">
              Measured for every approach
            </p>
            <ul className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5">
              {["Segmentation accuracy", "IoU", "Latency", "Compute cost"].map((m) => (
                <li key={m}>· {m}</li>
              ))}
            </ul>
          </div>
          <div className="border-line bg-mustard-soft rounded-xl border-2 p-3">
            <p className="font-display text-3xl font-semibold">0.91 IoU</p>
            <p>Best result in the benchmark, on held-out test data.</p>
          </div>
        </div>
      }
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="border-line h-auto w-full rounded-xl border-2"
        role="img"
        aria-label={`Illustrative aerial wheat field${method === "original" ? "" : `, with a ${active.label} style crop mask over ${reveal}% of the image`}.`}
      >
        <defs>
          <clipPath id="wheat-reveal">
            <rect x="0" y="0" width={(W * reveal) / 100} height={H} />
          </clipPath>
        </defs>
        {cells.map((c) => (
          <rect
            key={`${c.x}-${c.y}`}
            x={c.x * S}
            y={c.y * S}
            width={S}
            height={S}
            fill={c.crop ? wheat(c.shade) : soil(c.shade)}
          />
        ))}

        {method !== "original" && (
          <g clipPath="url(#wheat-reveal)">
            {method === "slic" && (
              <>
                {crop.map((c) => (
                  <rect
                    key={c.x + "," + c.y}
                    x={c.x * S}
                    y={c.y * S}
                    width={S}
                    height={S}
                    fill="var(--teal)"
                    opacity="0.3"
                  />
                ))}
                {edges.map(([x1, y1, x2, y2], i) => (
                  <line
                    key={i}
                    x1={x1 * S}
                    y1={y1 * S}
                    x2={x2 * S}
                    y2={y2 * S}
                    stroke="#fff6dc"
                    strokeWidth="1.4"
                  />
                ))}
              </>
            )}
            {method === "rf" &&
              crop.map((c) => (
                <rect
                  key={c.x + "," + c.y}
                  x={c.x * S + 1.5}
                  y={c.y * S + 1.5}
                  width={S - 3}
                  height={S - 3}
                  fill="var(--teal)"
                  opacity="0.8"
                />
              ))}
            {method === "unet" && (
              <g fill="var(--teal)" opacity="0.7">
                {crop.map((c) => (
                  <circle
                    key={c.x + "," + c.y}
                    cx={c.x * S + S / 2}
                    cy={c.y * S + S / 2}
                    r={S * 0.72}
                  />
                ))}
              </g>
            )}
            {method === "segformer" && (
              <>
                {crop.map((c) => (
                  <rect
                    key={c.x + "," + c.y}
                    x={c.x * S}
                    y={c.y * S}
                    width={S}
                    height={S}
                    fill="var(--teal)"
                    opacity="0.62"
                  />
                ))}
                {Array.from({ length: FIELD_W / PATCH + 1 }, (_, i) => (
                  <line
                    key={`v${i}`}
                    x1={i * PATCH * S}
                    y1={0}
                    x2={i * PATCH * S}
                    y2={H}
                    stroke="#fff6dc"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                ))}
                {Array.from({ length: Math.ceil(FIELD_H / PATCH) + 1 }, (_, i) => (
                  <line
                    key={`h${i}`}
                    x1={0}
                    y1={i * PATCH * S}
                    x2={W}
                    y2={i * PATCH * S}
                    stroke="#fff6dc"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                ))}
              </>
            )}
            <line
              x1={(W * reveal) / 100}
              y1={0}
              x2={(W * reveal) / 100}
              y2={H}
              stroke="var(--line)"
              strokeWidth="2.5"
            />
          </g>
        )}
      </svg>

      <div className="mt-4 flex items-center gap-3">
        <label
          htmlFor="wheat-reveal-range"
          className="text-ink-soft shrink-0 font-mono text-xs tracking-wider uppercase"
        >
          Original
        </label>
        <input
          id="wheat-reveal-range"
          type="range"
          min={0}
          max={100}
          value={reveal}
          disabled={method === "original"}
          onChange={(e) => setReveal(Number(e.target.value))}
          aria-label="Drag to compare the original image with the mask"
          className="w-full accent-[var(--teal)] disabled:opacity-40"
        />
        <span className="text-ink-soft shrink-0 font-mono text-xs tracking-wider uppercase">
          Mask
        </span>
      </div>
      <p className="text-ink-soft mt-2 text-xs">
        Teal marks pixels labelled as crop. Lines show superpixel boundaries (SLIC) or transformer
        patches (SegFormer).
      </p>
    </DemoFrame>
  );
}
