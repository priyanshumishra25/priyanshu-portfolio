import type { Metadata } from "next";
import { Timeline } from "@/components/about/Timeline";
import { PaiExplainer } from "@/components/assistant/PaiExplainer";
import { ContactLinks } from "@/components/ui/ContactLinks";
import { PageIntro, SectionLabel } from "@/components/ui/PageIntro";
import { about } from "@/content/about";
import { experience } from "@/content/experience";
import { formatPeriod } from "@/lib/period";

export const metadata: Metadata = {
  title: "About",
  description:
    "Software Engineer in Sydney. Backend, distributed systems, full-stack, AI-native products and difficult debugging.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const [first, ...rest] = about.intro;
  const leadership = experience.filter((e) => e.kind === "leadership");

  return (
    <>
      <PageIntro eyebrow="About" title={first}>
        <div className="prose-copy text-ink">
          {rest.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </PageIntro>

      <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6">
        <section aria-labelledby="basics" className="grid gap-6 md:grid-cols-2">
          <div className="border-line bg-card shadow-hard rounded-3xl border-2 p-6">
            <h2 id="basics" className="text-ink-soft font-mono text-xs tracking-wider uppercase">
              Education
            </h2>
            <p className="font-display mt-3 text-2xl font-semibold">{about.education.school}</p>
            <p className="mt-1">{about.education.degree}</p>
            <p className="text-ink-soft mt-1 font-mono text-xs">
              {formatPeriod(about.education.period)}
            </p>
            <p className="border-line bg-mustard mt-3 inline-block rounded-full border-2 px-3 py-0.5 text-sm font-semibold">
              {about.education.honours}
            </p>
          </div>
          <div className="border-line bg-card shadow-hard rounded-3xl border-2 p-6">
            <h2 className="text-ink-soft font-mono text-xs tracking-wider uppercase">
              What I gravitate towards
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {about.interests.map((i) => (
                <li
                  key={i}
                  className="bg-teal-soft rounded-full px-3 py-1 text-[0.95rem] font-medium"
                >
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="timeline-h" className="space-y-6">
          <SectionLabel n="→" id="timeline-h">
            How I got here
          </SectionLabel>
          <Timeline />
        </section>

        <section id="other-experience" aria-labelledby="other-h" className="scroll-mt-24 space-y-4">
          <SectionLabel n="+" id="other-h">
            Other experience
          </SectionLabel>
          <ul className="grid gap-4 md:grid-cols-2">
            {leadership.map((e) => (
              <li
                key={e.id}
                className="border-line/30 bg-card rounded-2xl border-2 border-dashed p-5"
              >
                <p className="font-semibold">
                  {e.role}{" "}
                  <span className="text-ink-soft font-normal">
                    · {e.org}
                    {e.location ? `, ${e.location}` : ""}
                  </span>
                </p>
                <p className="text-ink-soft font-mono text-xs">{formatPeriod(e.period)}</p>
                <p className="mt-2">{e.summary}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="how-pai-works" aria-labelledby="pai-h" className="scroll-mt-24 space-y-4">
          <SectionLabel n="?" id="pai-h">
            How PAI works
          </SectionLabel>
          <div className="border-line bg-card rounded-3xl border-2 p-6">
            <PaiExplainer />
          </div>
        </section>

        <section
          id="contact"
          aria-labelledby="contact-h"
          className="border-line bg-mustard-soft shadow-hard-lg scroll-mt-24 rounded-3xl border-2 p-6 sm:p-10"
        >
          <h2
            id="contact-h"
            className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight font-semibold tracking-tight"
          >
            Got something difficult to build?
          </h2>
          <ContactLinks className="mt-6 max-w-xl" />
        </section>
      </div>
    </>
  );
}
