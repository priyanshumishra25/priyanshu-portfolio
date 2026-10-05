"use client";

import Link from "next/link";
import type { WorkspaceObject } from "./objects";

interface Props {
  object: WorkspaceObject;
  onActivate: (object: WorkspaceObject) => void;
  wobble?: boolean;
  awake?: boolean;
  bubble?: string | null;
}

/** One clickable object on the desk. Links navigate; everything else is a button. */
export function DeskObject({ object, onActivate, wobble, awake, bubble }: Props) {
  const { Art, pos, label, description, action } = object;
  const style = { left: `${pos.left}%`, top: `${pos.top}%`, width: `${pos.width}%` };
  const className = `desk-object group absolute block rounded-xl focus-visible:outline-offset-8 ${
    wobble ? "coffee-wobble" : ""
  } ${awake ? "pai-awake" : ""}`;

  const inner = (
    <>
      <span
        className="desk-label border-line bg-card shadow-hard pointer-events-none absolute bottom-full left-1/2 mb-1 rounded-md border-2 px-2.5 py-1 font-mono text-[clamp(0.62rem,0.9vw,0.8rem)] font-semibold whitespace-nowrap"
        aria-hidden
      >
        {label}
      </span>
      <Art className="object-art block h-auto w-full" />
      {bubble && (
        <span
          role="status"
          className="border-line bg-card shadow-hard absolute -top-2 left-full ml-2 rounded-xl rounded-bl-none border-2 px-3 py-1.5 text-sm font-medium whitespace-nowrap"
        >
          {bubble}
        </span>
      )}
    </>
  );

  if (action.type === "link") {
    return (
      <Link
        href={action.href}
        className={className}
        style={style}
        aria-label={`${label}: ${description}`}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={`${className} cursor-pointer`}
      style={style}
      aria-label={`${label}: ${description}`}
      aria-haspopup={action.type === "coffee" ? undefined : "dialog"}
      onClick={() => onActivate(object)}
    >
      {inner}
    </button>
  );
}
