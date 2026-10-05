import { site } from "@/content/site";

const links = [
  { label: "Email", value: site.email, href: `mailto:${site.email}`, external: false },
  {
    label: "LinkedIn",
    value: site.linkedin.replace(/^https?:\/\/(www\.)?/, ""),
    href: site.linkedin,
    external: true,
  },
  {
    label: "GitHub",
    value: site.github.replace(/^https?:\/\/(www\.)?/, ""),
    href: site.github,
    external: true,
  },
];

export function ContactLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`space-y-2 ${className}`}>
      {links.map((l) => (
        <li key={l.label}>
          <a
            href={l.href}
            {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group border-line/15 bg-paper hover:border-line hover:bg-mustard-soft flex items-baseline justify-between gap-4 rounded-xl border-2 px-4 py-3 transition-colors"
          >
            <span className="font-semibold">{l.label}</span>
            <span className="text-ink-soft group-hover:text-ink truncate font-mono text-sm">
              {l.value}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
