"use client";

import { useState } from "react";
import { BrokenChip } from "@/components/illustrations/DeskArt";

const LINES: Record<number, string> = {
  3: "It is still broken.",
  5: "Have you tried turning it off and on again?",
  7: "Off. On. Still broken. That is why there is a fuzzer.",
};

export function ChipEasterEgg() {
  const [clicks, setClicks] = useState(0);
  const line = Object.entries(LINES)
    .filter(([n]) => clicks >= Number(n))
    .at(-1)?.[1];

  return (
    <div className="relative hidden w-48 md:block">
      <button
        type="button"
        onClick={() => setClicks((c) => c + 1)}
        aria-label="A broken circuit board. Poke it."
        className="desk-object block w-full"
      >
        <BrokenChip className="object-art h-auto w-full" />
      </button>
      <p role="status" className="text-ink-soft mt-2 min-h-10 text-center text-sm font-medium">
        {line}
      </p>
    </div>
  );
}
