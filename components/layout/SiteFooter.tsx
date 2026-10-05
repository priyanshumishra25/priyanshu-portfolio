import Link from "next/link";
import { site } from "@/content/site";
import { externalLinks } from "./nav";

export function SiteFooter() {
  return (
    <footer className="no-print border-line/10 relative z-10 mt-24 border-t">
      <div className="text-ink-soft mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Built by {site.name}. Next.js, hand-drawn SVG and a fair amount of coffee.</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          <li>
            <a className="underline-offset-4 hover:underline" href={`mailto:${site.email}`}>
              Email
            </a>
          </li>
          {externalLinks.map((l) => (
            <li key={l.label}>
              <a
                className="underline-offset-4 hover:underline"
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <Link className="underline-offset-4 hover:underline" href="/resume">
              Resume
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
