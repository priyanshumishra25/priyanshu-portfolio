interface Props {
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  aside?: React.ReactNode;
}

export function PageIntro({ eyebrow, title, children, aside }: Props) {
  return (
    <header className="mx-auto grid max-w-6xl gap-8 px-4 pt-12 pb-8 sm:px-6 sm:pt-16 md:grid-cols-[1fr_auto] md:items-end">
      <div className="max-w-3xl">
        <p className="text-ink-soft font-mono text-xs tracking-[0.18em] uppercase">{eyebrow}</p>
        <h1 className="font-display mt-3 text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.02] font-semibold tracking-tight">
          {title}
        </h1>
        {children && (
          <div className="text-ink-soft mt-5 max-w-2xl text-lg leading-relaxed">{children}</div>
        )}
      </div>
      {aside}
    </header>
  );
}

export function StackList({
  items,
  label = "Stack",
}: {
  items: readonly string[];
  label?: string;
}) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-1.5">
      {items.map((s) => (
        <li
          key={s}
          className="border-line/25 bg-card rounded-md border px-2 py-0.5 font-mono text-[0.78rem]"
        >
          {s}
        </li>
      ))}
    </ul>
  );
}

export function SectionLabel({
  n,
  children,
  id,
}: {
  n: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <h2
      id={id}
      className="font-display flex items-baseline gap-3 text-2xl font-semibold tracking-tight sm:text-[1.75rem]"
    >
      <span className="text-terracotta-ink font-mono text-sm font-medium">{n}</span>
      {children}
    </h2>
  );
}
