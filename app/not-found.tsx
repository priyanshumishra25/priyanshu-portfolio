import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[70dvh] max-w-2xl place-items-center px-4 text-center">
      <div>
        <p className="text-danger font-mono text-sm">404 · SIGNOTFOUND</p>
        <h1 className="font-display mt-4 text-5xl font-semibold tracking-tight">
          This page broke before I could.
        </h1>
        <p className="text-ink-soft mt-4 text-lg">
          Nothing lives at this address. The desk is a safer bet.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/"
            className="border-line bg-mustard shadow-hard rounded-full border-2 px-5 py-2 font-semibold"
          >
            Back to the desk
          </Link>
          <Link
            href="/work"
            className="border-line bg-card shadow-hard rounded-full border-2 px-5 py-2 font-semibold"
          >
            See the work
          </Link>
        </div>
      </div>
    </section>
  );
}
