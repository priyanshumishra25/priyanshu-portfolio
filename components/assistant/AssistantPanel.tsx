"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { curatedAnswers, greeting, suggestedPromptIds } from "@/content/assistant";
import { Pai } from "@/components/illustrations/Pai";
import { AnswerBody, FormattedText } from "./AnswerBody";
import { PaiExplainer } from "./PaiExplainer";
import { useAssistant } from "./AssistantProvider";

const suggestions = suggestedPromptIds
  .map((id) => curatedAnswers.find((c) => c.id === id)?.prompt)
  .filter((p): p is string => Boolean(p));

export function AssistantPanel() {
  const { isOpen, close, messages, pending, ask, showInteresting } = useAssistant();
  const [draft, setDraft] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // Focus handling: remember the trigger, focus the input, restore on close.
  useEffect(() => {
    if (!isOpen) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      clearTimeout(t);
      returnFocus.current?.focus?.();
    };
  }, [isOpen]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled]), input:not([disabled])",
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    void ask(draft);
    setDraft("");
  }

  const asked = new Set(messages.filter((m) => m.role === "user").map((m) => m.text));
  const remaining = suggestions.filter((s) => !asked.has(s));
  const visibleSuggestions = messages.length === 0 ? remaining : remaining.slice(0, 3);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="no-print fixed inset-0 z-50" onKeyDown={onKeyDown}>
          <motion.div
            className="bg-ink/25 absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pai-title"
            className="border-line bg-card shadow-hard-lg absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-3xl border-2 sm:inset-y-4 sm:right-4 sm:left-auto sm:max-h-none sm:w-[440px] sm:rounded-3xl"
            initial={{ y: 40, opacity: 0, rotate: 1 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            <header className="border-line/20 flex items-center gap-3 border-b-2 border-dashed px-5 py-4">
              <Pai awake className="size-12 shrink-0" />
              <div className="min-w-0 flex-1">
                <h2 id="pai-title" className="font-display text-xl leading-tight font-semibold">
                  PAI
                </h2>
                <p className="text-ink-soft text-sm">Priyanshu&apos;s Portfolio Assistant</p>
              </div>
              <button
                type="button"
                onClick={close}
                className="border-line hover:bg-paper-deep rounded-full border-2 px-3 py-1 text-sm font-semibold"
              >
                Close<span className="sr-only"> assistant</span>
              </button>
            </header>

            <div
              ref={logRef}
              className="flex-1 space-y-4 overflow-y-auto px-5 py-4"
              aria-live="polite"
            >
              <Bubble from="assistant">
                <FormattedText text={greeting} />
              </Bubble>
              {messages.map((m) => (
                <Bubble key={m.id} from={m.role} error={m.error}>
                  {m.answer ? <AnswerBody answer={m.answer} onNavigate={close} /> : <p>{m.text}</p>}
                </Bubble>
              ))}
              {pending && (
                <Bubble from="assistant">
                  <p className="text-ink-soft">
                    Looking through the site<span className="animate-pulse">...</span>
                  </p>
                </Bubble>
              )}
            </div>

            <div className="border-line/20 space-y-3 border-t-2 border-dashed px-5 py-4">
              {visibleSuggestions.length > 0 && (
                <div>
                  <p className="text-ink-soft mb-1.5 font-mono text-[0.7rem] tracking-wider uppercase">
                    {messages.length === 0 ? "Try asking" : "Also worth asking"}
                  </p>
                  <ul className="flex max-h-36 flex-wrap gap-1.5 overflow-y-auto">
                    {visibleSuggestions.map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => void ask(s)}
                          className="border-line/30 bg-paper hover:border-line hover:bg-mustard-soft rounded-full border px-3 py-1 text-left text-[0.82rem] disabled:opacity-50"
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                type="button"
                disabled={pending}
                onClick={() => void showInteresting()}
                className="border-line bg-teal-soft w-full rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                Show me something interesting
              </button>
              <form onSubmit={submit} className="flex gap-2">
                <label htmlFor="pai-input" className="sr-only">
                  Ask PAI a question about Priyanshu
                </label>
                <input
                  id="pai-input"
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  maxLength={500}
                  placeholder="Ask about his work..."
                  autoComplete="off"
                  className="border-line bg-paper placeholder:text-ink-soft/70 min-w-0 flex-1 rounded-xl border-2 px-3 py-2 text-[0.95rem]"
                />
                <button
                  type="submit"
                  disabled={pending || !draft.trim()}
                  className="border-line bg-ink text-paper rounded-xl border-2 px-4 py-2 text-sm font-semibold disabled:opacity-40"
                >
                  Ask
                </button>
              </form>
              <details className="text-ink-soft text-[0.72rem]">
                <summary className="cursor-pointer">
                  Answers come only from this site, with links to where each fact lives.{" "}
                  <span className="text-teal font-semibold underline underline-offset-2">
                    How PAI works
                  </span>
                </summary>
                <div className="text-ink mt-2 max-h-56 overflow-y-auto pr-1">
                  <PaiExplainer compact />
                </div>
              </details>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Bubble({
  from,
  error,
  children,
}: {
  from: "user" | "assistant";
  error?: boolean;
  children: React.ReactNode;
}) {
  const isUser = from === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[92%] rounded-2xl px-4 py-3 text-[0.94rem] leading-relaxed ${
          isUser
            ? "bg-ink text-paper rounded-br-sm"
            : `border-line/15 rounded-bl-sm border ${error ? "bg-[#f7dcd5]" : "bg-paper"}`
        }`}
      >
        <span className="sr-only">{isUser ? "You said: " : "PAI said: "}</span>
        {children}
      </div>
    </div>
  );
}
