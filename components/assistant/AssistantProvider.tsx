"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { AssistantAnswer, HistoryTurn } from "@/lib/assistant/types";
import { fetchAnswer } from "./client";

export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  text: string;
  answer?: AssistantAnswer;
  error?: boolean;
}

interface AssistantContextValue {
  isOpen: boolean;
  open: (question?: string) => void;
  close: () => void;
  messages: ChatMessage[];
  pending: boolean;
  ask: (question: string) => Promise<void>;
  showInteresting: () => Promise<void>;
}

const AssistantContext = createContext<AssistantContextValue | null>(null);

// The panel and the local knowledge base only load once someone opens PAI.
const AssistantPanel = dynamic(() => import("./AssistantPanel").then((m) => m.AssistantPanel), {
  ssr: false,
});

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState(false);
  const nextId = useRef(1);
  const interestingTurn = useRef(0);

  const push = useCallback((m: Omit<ChatMessage, "id">) => {
    setMessages((prev) => [...prev, { ...m, id: nextId.current++ }]);
  }, []);

  const ask = useCallback(
    async (question: string) => {
      const q = question.trim();
      if (!q || pending) return;
      const history: HistoryTurn[] = messages
        .slice(-6)
        .map((m) => ({ role: m.role, text: m.answer?.text ?? m.text }));
      push({ role: "user", text: q });
      setPending(true);
      try {
        const answer = await fetchAnswer(q, history);
        push({ role: "assistant", text: answer.text, answer });
      } catch {
        push({
          role: "assistant",
          text: "Something went wrong on my side. Try asking again.",
          error: true,
        });
      } finally {
        setPending(false);
      }
    },
    [messages, pending, push],
  );

  const showInteresting = useCallback(async () => {
    const { interestingAnswer } = await import("@/lib/assistant/local");
    push({ role: "user", text: "Show me something interesting." });
    const answer = interestingAnswer(interestingTurn.current++);
    push({ role: "assistant", text: answer.text, answer });
  }, [push]);

  const open = useCallback(
    (question?: string) => {
      setHasOpened(true);
      setIsOpen(true);
      if (question) void ask(question);
    },
    [ask],
  );
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, open, close, messages, pending, ask, showInteresting }),
    [isOpen, open, close, messages, pending, ask, showInteresting],
  );

  return (
    <AssistantContext.Provider value={value}>
      {children}
      {hasOpened && <AssistantPanel />}
    </AssistantContext.Provider>
  );
}

export function useAssistant(): AssistantContextValue {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error("useAssistant must be used inside AssistantProvider");
  return ctx;
}
