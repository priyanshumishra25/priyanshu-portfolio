import { paiArchitecture } from "@/content/assistant";

function Box({ children, tone = "bg-card" }: { children: React.ReactNode; tone?: string }) {
  return (
    <div
      className={`border-line rounded-lg border-2 px-2 py-1 text-center text-[0.72rem] font-semibold ${tone}`}
    >
      {children}
    </div>
  );
}

const Down = () => (
  <p aria-hidden className="text-ink-soft text-center leading-none">
    ↓
  </p>
);

/** The grounding flow, drawn with plain boxes so it reads the same in the panel and on /about. */
export function PaiFlow() {
  const f = paiArchitecture.flow;
  return (
    <figure aria-label="How PAI answers: structured content becomes citable knowledge, answered by local retrieval or optionally Claude, with evidence links.">
      <div className="mx-auto grid max-w-xs gap-1">
        <Box>{f.content}</Box>
        <Down />
        <Box tone="bg-mustard-soft">{f.knowledge}</Box>
        <p aria-hidden className="text-ink-soft flex justify-around leading-none">
          <span>↙</span>
          <span>↘</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Box tone="bg-teal-soft">{f.local}</Box>
          <Box tone="bg-paper-deep">{f.model}</Box>
        </div>
        <p aria-hidden className="text-ink-soft flex justify-around leading-none">
          <span>↘</span>
          <span>↙</span>
        </p>
        <Box tone="bg-ink text-paper">{f.answer}</Box>
      </div>
    </figure>
  );
}

export function PaiExplainer({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "space-y-3 text-[0.82rem]" : "grid gap-6 md:grid-cols-[1fr_300px]"}>
      <div>
        <p className={compact ? "font-medium" : "text-lg"}>{paiArchitecture.summary}</p>
        <ul className="marker:text-terracotta mt-2 list-disc space-y-1 pl-5">
          {paiArchitecture.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
      <PaiFlow />
    </div>
  );
}
