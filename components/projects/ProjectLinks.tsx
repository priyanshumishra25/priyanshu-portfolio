import type { Project } from "@/content/types";

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden
      className="size-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M4.5 2.5h5v5M9.5 2.5 3 9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const linkClass =
  "inline-flex items-center gap-1.5 rounded-full border-2 border-line bg-card px-3 py-1 text-sm font-semibold shadow-hard transition-transform hover:-translate-y-0.5";

/**
 * Evidence links for a project. Renders only what is configured in content:
 * no repo means no button, never a "#" placeholder.
 */
export function ProjectLinks({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  const { repoUrl, demoUrl, sourceNote } = project;
  if (!repoUrl && !demoUrl && !sourceNote) return null;
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {repoUrl && (
        <a href={repoUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
          View source <ExternalIcon />
          <span className="sr-only"> (opens GitHub in a new tab)</span>
        </a>
      )}
      {demoUrl && (
        <a href={demoUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
          Live demo <ExternalIcon />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
      {!repoUrl && sourceNote && <p className="text-ink-soft font-mono text-xs">{sourceNote}</p>}
    </div>
  );
}
