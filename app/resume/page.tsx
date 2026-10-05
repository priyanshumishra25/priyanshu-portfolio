import type { Metadata } from "next";
import { ResumeViewer } from "@/components/ui/ResumeViewer";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Resume",
  description: `${site.name}'s resume, as a PDF to view or download.`,
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-10 sm:px-6">
      <p className="text-ink-soft mb-6 font-mono text-xs tracking-wider uppercase">
        The Boring Version™
      </p>
      <ResumeViewer pdfs={site.resumePdfs} />
    </div>
  );
}
