"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAssistant } from "@/components/assistant/AssistantProvider";
import { getExperience } from "@/content/experience";
import { site } from "@/content/site";
import { formatPeriod } from "@/lib/period";
import { ContactDialog } from "./ContactDialog";
import { DeskScene } from "./DeskScene";
import { MobileWorkspace } from "./MobileWorkspace";
import type { WorkspaceObject } from "./objects";

const COFFEE_LINES = [
  "Still compiling.",
  "Still compiling.",
  "Still compiling..",
  "Okay, maybe one more.",
];

export function Workspace() {
  const { open: openAssistant } = useAssistant();
  const [contactOpen, setContactOpen] = useState(false);
  const [bubble, setBubble] = useState<{ id: string; text: string } | null>(null);
  const [wobbleId, setWobbleId] = useState<string | null>(null);
  const sips = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const onActivate = useCallback(
    (object: WorkspaceObject) => {
      switch (object.action.type) {
        case "assistant":
          openAssistant();
          break;
        case "contact":
          setContactOpen(true);
          break;
        case "coffee": {
          const text = COFFEE_LINES[Math.min(sips.current++, COFFEE_LINES.length - 1)]!;
          setBubble({ id: object.id, text });
          setWobbleId(null);
          requestAnimationFrame(() => setWobbleId(object.id));
          timers.current.push(setTimeout(() => setBubble(null), 2200));
          break;
        }
        case "link":
          break;
      }
    },
    [openAssistant],
  );

  return (
    <section aria-labelledby="desk-title" className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-10">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-ink-soft font-mono text-xs tracking-wider uppercase">The workspace</p>
          <h1
            id="desk-title"
            className="font-display text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Priyanshu&apos;s desk
          </h1>
        </div>
      </div>

      <div className="hidden md:block">
        <DeskScene onActivate={onActivate} wobbleId={wobbleId} bubble={bubble} />
      </div>
      <div className="md:hidden">
        <MobileWorkspace onActivate={onActivate} bubble={bubble} />
      </div>

      <QuickFacts />
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </section>
  );
}

/** The thirty-second version, for anyone who does not want to explore. */
function QuickFacts() {
  const armsoa = getExperience("armsoa");
  const research = getExperience("unsw-research");
  return (
    <aside
      aria-label="The short version"
      className="border-line/30 mt-8 grid gap-4 rounded-3xl border-2 border-dashed p-5 sm:grid-cols-[1.3fr_1fr] sm:p-6"
    >
      <div>
        <p className="text-ink-soft font-mono text-xs tracking-wider uppercase">
          In thirty seconds
        </p>
        <p className="mt-2 text-[1.05rem] leading-relaxed">
          {site.role} in {site.location}. UNSW Computer Science graduate, with Distinction.
        </p>
        <p className="mt-2 text-[1.05rem] leading-relaxed">
          Most recently a Software Engineer at <strong>ArmsOA</strong>{" "}
          <span className="text-ink-soft text-sm">({formatPeriod(armsoa.period)})</span>: owned the
          Claude-based AI interface and built Python/FastAPI services and React/TypeScript operator
          workflows for a network resilience platform. Before that, AI research at UNSW{" "}
          <span className="text-ink-soft text-sm">({formatPeriod(research.period)})</span>. Also:
          C++ systems tooling, machine learning and computer vision.
        </p>
      </div>
      <ul className="flex flex-col justify-center gap-2 text-sm font-semibold">
        <li>
          <Link className="text-teal underline-offset-4 hover:underline" href="/work/armsoa">
            → The flagship: ArmsOA
          </Link>
        </li>
        <li>
          <Link className="text-teal underline-offset-4 hover:underline" href="/decisions">
            → How I make decisions
          </Link>
        </li>
        <li>
          <Link className="text-teal underline-offset-4 hover:underline" href="/resume">
            → The resume, minus the fun
          </Link>
        </li>
      </ul>
    </aside>
  );
}
