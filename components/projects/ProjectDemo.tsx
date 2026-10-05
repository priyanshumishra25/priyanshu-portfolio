"use client";

import dynamic from "next/dynamic";

function DemoLoading() {
  return (
    <div
      role="status"
      className="border-line/30 text-ink-soft grid h-80 place-items-center rounded-3xl border-2 border-dashed"
    >
      Warming up the simulation...
    </div>
  );
}

// Each demo is its own chunk, loaded only on its project page.
export const demos: Record<string, React.ComponentType> = {
  armsoa: dynamic(() => import("./demos/NetworkDemo").then((m) => m.NetworkDemo), {
    loading: DemoLoading,
  }),
  "midpoint-fuzzer": dynamic(() => import("./demos/FuzzerDemo").then((m) => m.FuzzerDemo), {
    loading: DemoLoading,
  }),
  "quant-ai": dynamic(() => import("./demos/QuantDemo").then((m) => m.QuantDemo), {
    loading: DemoLoading,
  }),
  "wheat-segmentation": dynamic(() => import("./demos/WheatDemo").then((m) => m.WheatDemo), {
    loading: DemoLoading,
  }),
  tributary: dynamic(() => import("./demos/TributaryDemo").then((m) => m.TributaryDemo), {
    loading: DemoLoading,
  }),
};

export function ProjectDemo({ slug }: { slug: string }) {
  const Demo = demos[slug];
  return Demo ? <Demo /> : null;
}
