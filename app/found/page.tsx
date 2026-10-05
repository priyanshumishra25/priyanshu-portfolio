import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "You found it",
  robots: { index: false, follow: false },
};

export default function FoundPage() {
  return (
    <section className="mx-auto grid min-h-[70dvh] max-w-2xl place-items-center px-4 text-center">
      <div>
        <p className="text-ink-soft font-mono text-sm">↑ ↑ ↓ ↓ ← → ← → B A</p>
        <h1 className="font-display mt-4 text-5xl font-semibold tracking-tight">
          Okay, you definitely looked around.
        </h1>
        <p className="text-ink-soft mt-4 text-lg">
          That is roughly how I approach a new codebase too. Thanks for poking at things.
        </p>
        <Link
          href="/"
          className="border-line bg-mustard shadow-hard mt-8 inline-block rounded-full border-2 px-5 py-2 font-semibold"
        >
          Back to the desk
        </Link>
      </div>
    </section>
  );
}
