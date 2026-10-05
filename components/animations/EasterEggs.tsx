"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/** Returns a key handler that calls onMatch when the sequence is typed. */
export function createSequenceDetector(sequence: string[], onMatch: () => void) {
  let recent: string[] = [];
  return (key: string) => {
    recent = [...recent, key.length === 1 ? key.toLowerCase() : key].slice(-sequence.length);
    if (recent.length === sequence.length && recent.every((k, i) => k === sequence[i])) {
      recent = [];
      onMatch();
    }
  };
}

/** Tiny, optional, and never in the way. */
export function EasterEggs() {
  const router = useRouter();

  useEffect(() => {
    console.log(
      "%cAchievement unlocked: inspected the implementation.",
      "font: 600 14px/1.6 ui-monospace, monospace; color: #2d6a5e; background: #f6e3b8; padding: 4px 10px; border-radius: 6px;",
    );
    console.log("Curious how PAI stays grounded? Look at lib/assistant. Or try the Konami code.");
  }, []);

  useEffect(() => {
    const detect = createSequenceDetector(KONAMI, () => router.push("/found"));
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable='true']")) return;
      detect(e.key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return null;
}
