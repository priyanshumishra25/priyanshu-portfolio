"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAssistant } from "@/components/assistant/AssistantProvider";
import { Lamp } from "@/components/illustrations/Lamp";
import { DeskObject } from "./DeskObject";
import { DeskSurface } from "./DeskSurface";
import type { WorkspaceObject } from "./objects";
import { workspaceObjects } from "./objects";

interface Props {
  onActivate: (object: WorkspaceObject) => void;
  wobbleId: string | null;
  bubble: { id: string; text: string } | null;
}

export function DeskScene({ onActivate, wobbleId, bubble }: Props) {
  // Labels show briefly on arrival so nobody has to guess what is clickable.
  const [introLabels, setIntroLabels] = useState(true);
  const [pinned, setPinned] = useState(false);
  const { isOpen: assistantOpen } = useAssistant();

  useEffect(() => {
    const t = setTimeout(() => setIntroLabels(false), 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="text-ink-soft text-sm">
          Click anything on the desk. The menu at the top goes to the same places.
        </p>
        <button
          type="button"
          aria-pressed={pinned}
          onClick={() => setPinned((v) => !v)}
          className="border-line bg-card hover:bg-paper-deep shrink-0 rounded-full border-2 px-3 py-1 text-xs font-semibold"
        >
          {pinned ? "Hide labels" : "Show labels"}
        </button>
      </div>
      <motion.div
        className={`border-line shadow-hard-lg relative aspect-[16/10] w-full overflow-hidden rounded-[28px] border-2 ${
          introLabels || pinned ? "labels-on" : ""
        }`}
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        role="group"
        aria-label="Priyanshu's desk. Each object opens part of the portfolio."
      >
        <DeskSurface />
        <div
          className="pointer-events-none absolute"
          style={{ left: "4.5%", top: "4%", width: "17%" }}
        >
          <Lamp className="h-auto w-full" />
        </div>
        {workspaceObjects.map((o) => (
          <DeskObject
            key={o.id}
            object={o}
            onActivate={onActivate}
            wobble={wobbleId === o.id}
            awake={o.id === "pai" && assistantOpen}
            bubble={bubble?.id === o.id ? bubble.text : null}
          />
        ))}
      </motion.div>
    </div>
  );
}
