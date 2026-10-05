"use client";

import { useState } from "react";

interface ResumePdf {
  readonly label: string;
  readonly href: string;
}

/** Shows one resume PDF at a time. The first entry is the default. */
export function ResumeViewer({ pdfs }: { pdfs: readonly ResumePdf[] }) {
  const [active, setActive] = useState(0);
  const pdf = pdfs[active];
  if (!pdf) return null;
  const chip = "rounded-full border px-3 py-1 text-[0.82rem] transition-colors";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Choose a resume" className="flex flex-wrap gap-1.5">
          {pdfs.map((p, i) => (
            <button
              key={p.href}
              type="button"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className={`${chip} ${i === active ? "border-line bg-ink text-paper" : "border-line/25 hover:border-line bg-card"}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={pdf.href}
            target="_blank"
            rel="noopener noreferrer"
            className="border-line bg-card shadow-hard hover:bg-paper-deep rounded-full border-2 px-4 py-1.5 text-sm font-semibold"
          >
            Open
          </a>
          <a
            href={pdf.href}
            download
            className="border-line bg-mustard shadow-hard rounded-full border-2 px-4 py-1.5 text-sm font-semibold"
          >
            Download PDF
          </a>
        </div>
      </div>

      <iframe
        key={pdf.href}
        src={pdf.href}
        title={`${pdf.label} resume`}
        className="border-line h-[80vh] min-h-[480px] w-full rounded-xl border-2 bg-white"
      />
    </div>
  );
}
