import type { Period, YearMonth } from "@/content/types";

const SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function month(ym: YearMonth, names: string[]): string {
  const [year, m] = ym.split("-");
  return `${names[Number(m) - 1]} ${year}`;
}

/** "Jun 2026 to Sep 2026" or "June 2026 to September 2026". No dashes, by design. */
export function formatPeriod(period: Period, style: "short" | "long" = "short"): string {
  const names = style === "short" ? SHORT : LONG;
  const end =
    period.end === "present"
      ? style === "short"
        ? "Present"
        : "present"
      : month(period.end, names);
  return `${month(period.start, names)} to ${end}`;
}

export function isCurrent(period: Period): boolean {
  return period.end === "present";
}
