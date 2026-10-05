"use client";

import Link from "next/link";
import type { WorkspaceObject } from "./objects";
import { workspaceObjects } from "./objects";

interface Props {
  onActivate: (object: WorkspaceObject) => void;
  bubble: { id: string; text: string } | null;
}

/**
 * The same desk, rearranged for a phone: a drawer of objects you scroll
 * through instead of a scene squeezed onto a tiny screen.
 */
export function MobileWorkspace({ onActivate, bubble }: Props) {
  return (
    <div>
      <p className="text-ink-soft mb-4 text-sm">The pocket edition of the desk. Tap anything.</p>
      <ul className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
        {workspaceObjects.map((o, i) => {
          const { Art } = o;
          const body = (
            <>
              <span className="bg-paper-deep grid size-16 shrink-0 place-items-center rounded-xl p-1.5">
                <Art className="h-auto max-h-14 w-full" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-display block text-lg leading-tight font-semibold">
                  {o.label}
                </span>
                <span className="text-ink-soft mt-0.5 block text-sm">
                  {bubble?.id === o.id ? (
                    <span role="status" className="text-terracotta-ink font-semibold">
                      {bubble.text}
                    </span>
                  ) : (
                    o.description
                  )}
                </span>
              </span>
              <span aria-hidden className="text-ink-soft font-mono">
                {o.action.type === "link" ? "→" : "+"}
              </span>
            </>
          );
          const cls = `flex w-full items-center gap-3 rounded-2xl border-2 border-line bg-card p-3 text-left shadow-hard transition-transform active:translate-y-0.5 ${
            i % 2 ? "rotate-[0.4deg]" : "-rotate-[0.4deg]"
          }`;
          return (
            <li key={o.id}>
              {o.action.type === "link" ? (
                <Link href={o.action.href} className={cls}>
                  {body}
                </Link>
              ) : (
                <button type="button" className={cls} onClick={() => onActivate(o)}>
                  {body}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
