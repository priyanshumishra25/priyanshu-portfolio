"use client";

import Link from "next/link";
import { Coffee } from "@/components/illustrations/DeskArt";
import { Lamp } from "@/components/illustrations/Lamp";
import { Pai } from "@/components/illustrations/Pai";
import { site } from "@/content/site";

export function Opening({ onEnter }: { onEnter: () => void }) {
  return (
    <section
      aria-labelledby="opening-title"
      className="relative mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.15fr_1fr]"
    >
      <div className="relative z-10">
        <h1
          id="opening-title"
          className="font-display text-[clamp(2.8rem,8vw,5.6rem)] leading-[0.92] font-semibold tracking-tight"
        >
          PRIYANSHU
          <br />
          MISHRA
        </h1>
        <p className="text-ink-soft mt-5 font-mono text-sm tracking-[0.2em] uppercase">
          {site.role}
        </p>
        <p className="font-display mt-6 max-w-md text-[clamp(1.25rem,2.4vw,1.6rem)] leading-snug italic">
          &ldquo;{site.tagline}&rdquo;
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <button
            type="button"
            onClick={onEnter}
            className="group border-line bg-mustard shadow-hard-lg active:shadow-hard inline-flex items-center gap-3 rounded-full border-2 px-6 py-3 text-base font-semibold transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
          >
            Enter Workspace
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
          <ul className="flex gap-5 text-sm font-semibold" aria-label="Quick links">
            <li>
              <a
                className="decoration-line/30 hover:decoration-line underline underline-offset-4"
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                className="decoration-line/30 hover:decoration-line underline underline-offset-4"
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <Link
                className="decoration-line/30 hover:decoration-line underline underline-offset-4"
                href="/resume"
              >
                Resume
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* A corner of the desk. The lamp follows your pointer; nothing else moves. */}
      <div
        className="relative mx-auto aspect-square w-full max-w-[300px] md:max-w-[440px]"
        aria-hidden
      >
        <div className="bg-wood/70 absolute inset-x-0 bottom-[8%] h-[16%] rounded-[50%]" />
        <Lamp className="absolute bottom-[14%] left-[4%] h-auto w-[62%]" />
        <Coffee className="absolute right-[24%] bottom-[14%] h-auto w-[19%]" />
        <Pai className="absolute right-[2%] bottom-[14%] h-auto w-[17%]" />
      </div>
    </section>
  );
}
