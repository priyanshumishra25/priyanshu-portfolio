import Link from "next/link";
import { timeline } from "@/content/experience";
import type { TimelineEntry } from "@/content/types";
import { formatPeriod } from "@/lib/period";

function Entry({ e }: { e: TimelineEntry }) {
  const body = (
    <>
      <span className="block font-semibold">{e.title}</span>
      <span className="text-ink-soft block text-sm">{e.detail}</span>
      {e.period && (
        <span className="text-ink-soft/80 mt-0.5 block font-mono text-[0.68rem] tracking-wide">
          {formatPeriod(e.period)}
        </span>
      )}
    </>
  );
  return e.href ? (
    <Link
      href={e.href}
      className="hover:bg-mustard-soft block rounded-xl px-3 py-2 transition-colors"
    >
      {body}
    </Link>
  ) : (
    <div className="px-3 py-2">{body}</div>
  );
}

/** Main path on the left, things built alongside it on the right. Dates stay small. */
export function Timeline() {
  const main = timeline.filter((e) => e.track === "main");
  const side = timeline.filter((e) => e.track === "side");

  return (
    <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
      <div>
        <p className="text-ink-soft mb-3 font-mono text-xs tracking-wider uppercase">The path</p>
        <ol className="border-line relative space-y-1 border-l-2 pl-5">
          {main.map((e, i) => (
            <li key={e.id} className="relative">
              <span
                aria-hidden
                className={`border-line absolute top-3.5 -left-[29px] size-4 rounded-full border-2 ${
                  i === main.length - 1 ? "bg-mustard" : "bg-card"
                }`}
              />
              <Entry e={e} />
            </li>
          ))}
        </ol>
      </div>
      <div>
        <p className="text-ink-soft mb-3 font-mono text-xs tracking-wider uppercase">Alongside</p>
        <ul className="grid gap-2">
          {side.map((e) => (
            <li key={e.id} className="border-line/30 bg-card rounded-2xl border-2 border-dashed">
              <Entry e={e} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
