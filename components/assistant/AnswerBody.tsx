"use client";

import Link from "next/link";
import type { AssistantAnswer } from "@/lib/assistant/types";

/** Renders PAI's plain-text format: paragraphs and "- " bullet lists. */
export function FormattedText({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="space-y-2.5">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="marker:text-terracotta list-disc space-y-1 pl-5">
              {lines.map((l, j) => (
                <li key={j}>{l.slice(2)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="whitespace-pre-line">
            {block}
          </p>
        );
      })}
    </div>
  );
}

export function AnswerBody({
  answer,
  onNavigate,
}: {
  answer: AssistantAnswer;
  onNavigate: () => void;
}) {
  return (
    <div className="space-y-3">
      <FormattedText text={answer.text} />
      {answer.sources.length > 0 && (
        <div>
          <p className="text-ink-soft font-mono text-[0.7rem] tracking-wider uppercase">Sources</p>
          <ul className="mt-1 space-y-0.5">
            {answer.sources.map((s) => (
              <li key={s.id}>
                <Link
                  href={s.href}
                  onClick={onNavigate}
                  className="text-teal decoration-teal/30 hover:decoration-teal text-sm font-medium underline underline-offset-4"
                >
                  <span aria-hidden>→ </span>
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {answer.cta && (
        <Link
          href={answer.cta.href}
          onClick={onNavigate}
          className="border-line bg-mustard shadow-hard inline-block rounded-full border-2 px-3.5 py-1 text-sm font-semibold transition-transform hover:-translate-y-0.5"
        >
          {answer.cta.label}
        </Link>
      )}
    </div>
  );
}
