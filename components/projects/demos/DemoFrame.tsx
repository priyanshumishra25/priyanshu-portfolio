/** Shared shell for interactive models: a titled board with a caveat line. */
export function DemoFrame({
  title,
  caption,
  controls,
  children,
  aside,
}: {
  title: string;
  caption: string;
  controls: React.ReactNode;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <figure className="border-line bg-card shadow-hard-lg overflow-hidden rounded-3xl border-2">
      <div className="border-line bg-paper-deep flex flex-wrap items-center justify-between gap-3 border-b-2 px-5 py-3">
        <p className="font-mono text-xs font-semibold tracking-wider uppercase">{title}</p>
        <div className="flex flex-wrap gap-2">{controls}</div>
      </div>
      <div className={aside ? "grid lg:grid-cols-[1fr_320px]" : ""}>
        <div className="min-w-0 p-4 sm:p-6">{children}</div>
        {aside && (
          <div className="border-line/20 border-t-2 border-dashed p-5 lg:border-t-0 lg:border-l-2">
            {aside}
          </div>
        )}
      </div>
      <figcaption className="border-line/15 text-ink-soft border-t px-5 py-2.5 text-xs">
        {caption}
      </figcaption>
    </figure>
  );
}

export function DemoButton({
  children,
  onClick,
  disabled,
  tone = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tone?: "default" | "primary" | "danger";
}) {
  const tones = {
    default: "bg-card",
    primary: "bg-mustard",
    danger: "bg-[#f3c9bd]",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`border-line shadow-hard rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none disabled:translate-y-0 disabled:opacity-40 disabled:shadow-none ${tones[tone]}`}
    >
      {children}
    </button>
  );
}
