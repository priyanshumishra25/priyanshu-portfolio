import { site } from "@/content/site";

export type NavItem =
  | { kind: "link"; label: string; href: string; match: string }
  | { kind: "assistant"; label: string };

/** The practical layer. Every important destination is one click away. */
export const navItems: NavItem[] = [
  { kind: "link", label: "Work", href: "/work", match: "/work" },
  { kind: "link", label: "Decisions", href: "/decisions", match: "/decisions" },
  { kind: "link", label: "Research", href: "/research", match: "/research" },
  { kind: "link", label: "About", href: "/about", match: "/about" },
  { kind: "assistant", label: "Ask AI" },
  { kind: "link", label: "Resume", href: "/resume", match: "/resume" },
];

export const externalLinks = [
  { label: "GitHub", href: site.github },
  { label: "LinkedIn", href: site.linkedin },
] as const;

export function isActive(pathname: string, match: string): boolean {
  return pathname === match || pathname.startsWith(`${match}/`);
}
