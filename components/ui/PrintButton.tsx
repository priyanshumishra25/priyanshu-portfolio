"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="border-line bg-card shadow-hard hover:bg-paper-deep rounded-full border-2 px-4 py-1.5 text-sm font-semibold"
    >
      Print
    </button>
  );
}
