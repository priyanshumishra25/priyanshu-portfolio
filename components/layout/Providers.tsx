"use client";

import { MotionConfig } from "framer-motion";
import { AssistantProvider } from "@/components/assistant/AssistantProvider";
import { EasterEggs } from "@/components/animations/EasterEggs";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <AssistantProvider>
        {children}
        <EasterEggs />
      </AssistantProvider>
    </MotionConfig>
  );
}
