"use client";

import { useEffect, useRef } from "react";
import { ContactLinks } from "@/components/ui/ContactLinks";

/** Native <dialog> gives focus trapping, Escape and inert background for free. */
export function ContactDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal?.();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="contact-title"
      className="border-line bg-card text-ink shadow-hard-lg backdrop:bg-ink/30 m-auto w-[min(92vw,460px)] rounded-3xl border-2 p-0"
    >
      <div className="p-6 sm:p-8">
        <p className="text-ink-soft font-mono text-xs tracking-wider uppercase">Say hello</p>
        <h2 id="contact-title" className="font-display mt-1 text-3xl font-semibold tracking-tight">
          Got something difficult to build?
        </h2>
        <ContactLinks className="mt-6" />
        <button
          type="button"
          onClick={onClose}
          className="border-line hover:bg-paper-deep mt-6 rounded-full border-2 px-4 py-1.5 text-sm font-semibold"
        >
          Close
        </button>
      </div>
    </dialog>
  );
}
