"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Opening } from "./Opening";

const STORAGE_KEY = "pm:entered";

const Workspace = dynamic(() => import("./Workspace").then((m) => m.Workspace), {
  ssr: false,
  loading: () => (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6" role="status">
      <div className="bg-paper-deep aspect-[16/10] w-full animate-pulse rounded-[28px]" />
      <span className="sr-only">Setting up the desk</span>
    </div>
  ),
});

function readEntered(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function HomeExperience() {
  const [stage, setStage] = useState<"opening" | "workspace">("opening");

  // Returning in the same session skips straight to the desk.
  useEffect(() => {
    if (readEntered()) setStage("workspace"); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const enter = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Storage can be unavailable; entering still works.
    }
    setStage("workspace");
    window.scrollTo({ top: 0 });
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {stage === "opening" ? (
        <motion.div key="opening" exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.3 }}>
          <Opening onEnter={enter} />
        </motion.div>
      ) : (
        <motion.div
          key="workspace"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Workspace />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
