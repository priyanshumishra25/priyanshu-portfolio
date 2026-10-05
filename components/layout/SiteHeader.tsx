"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAssistant } from "@/components/assistant/AssistantProvider";
import { site } from "@/content/site";
import { isActive, navItems } from "./nav";

const linkBase =
  "rounded-full px-3 py-1.5 text-[0.92rem] font-medium transition-colors hover:bg-paper-deep";

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const { open: openAssistant } = useAssistant();
  // The menu is open only for the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const menuOpen = openOn === pathname;
  const setMenuOpen = (open: boolean) => setOpenOn(open ? pathname : null);

  const items = navItems.map((item) =>
    item.kind === "assistant" ? (
      <li key="assistant">
        <button
          type="button"
          onClick={() => {
            setMenuOpen(false);
            openAssistant();
          }}
          className={`${linkBase} text-teal inline-flex items-center gap-1.5`}
        >
          <span aria-hidden className="bg-teal inline-block size-2 rounded-full" />
          {item.label}
        </button>
      </li>
    ) : (
      <li key={item.href}>
        <Link
          href={item.href}
          aria-current={isActive(pathname, item.match) ? "page" : undefined}
          className={`${linkBase} ${isActive(pathname, item.match) ? "bg-ink text-paper hover:bg-ink" : ""}`}
        >
          {item.label}
        </Link>
      </li>
    ),
  );

  return (
    <header className="no-print border-line/10 bg-paper/85 sticky top-0 z-40 border-b backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label={`${site.name}, home`}
        >
          <span
            aria-hidden
            className="border-line bg-mustard font-display shadow-hard grid size-9 place-items-center rounded-full border-2 text-sm font-semibold transition-transform group-hover:-rotate-6"
          >
            PM
          </span>
          <span className="font-display hidden text-lg font-medium tracking-tight sm:inline">
            {site.name}
          </span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">{items}</ul>
        </nav>

        <button
          type="button"
          className="border-line bg-card shadow-hard rounded-full border-2 px-4 py-1.5 text-sm font-semibold md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-line/10 bg-paper border-t px-4 pb-4 md:hidden"
        >
          <ul className="flex flex-col gap-1 pt-3 [&_a]:block [&_a]:py-2.5 [&_a]:text-base [&_button]:py-2.5 [&_button]:text-base">
            {items}
          </ul>
        </nav>
      )}
    </header>
  );
}
