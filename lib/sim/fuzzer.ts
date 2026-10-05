/**
 * A toy fuzzing campaign for the Midpoint demo. The "mystery program" is a
 * tiny function with planted bugs; the campaign genuinely runs every
 * generated input through it and classifies the result, like the real
 * harness does with signals from a child process.
 */

export type Outcome = "ok" | "rejected" | "timeout" | "crash";

export interface ExecResult {
  outcome: Outcome;
  signal?: "SIGSEGV" | "SIGFPE";
  /** Toy "crash site", standing in for a stack signature. */
  site?: string;
  ms: number;
}

function arrayDepth(value: unknown): number {
  if (Array.isArray(value)) return 1 + Math.max(0, ...value.map(arrayDepth));
  if (value && typeof value === "object")
    return Math.max(0, ...Object.values(value).map(arrayDepth));
  return 0;
}

export function mysteryProgram(input: string): ExecResult {
  let data: unknown;
  try {
    data = JSON.parse(input);
  } catch {
    return { outcome: "rejected", ms: 1 };
  }
  if (/\d{16,}/.test(input)) return { outcome: "timeout", ms: 1000 };
  if (arrayDepth(data) >= 6)
    return { outcome: "crash", signal: "SIGSEGV", site: "parse_tags", ms: 4 };
  const id = (data as { id?: unknown })?.id;
  if (id === 0) return { outcome: "crash", signal: "SIGFPE", site: "ratio_for_id", ms: 2 };
  return { outcome: "ok", ms: 2 + (input.length % 5) };
}

/** Small deterministic PRNG so runs are reproducible and testable. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Toy dedup key: FNV-1a of the crashing input bytes. The real fuzzer uses
 * SHA-256 of the input, so identical crashing inputs are stored once.
 */
export function inputHash(input: string): string {
  let h = 0x811c9dc5;
  for (const ch of input) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

export interface Execution extends ExecResult {
  n: number;
  input: string;
  strategy: string;
}

export interface Campaign {
  executions: Execution[];
  crash: { signal: string; site: string; key: string; input: string; duplicate: boolean } | null;
}

type Seed = { id: number; tags: unknown };

const SAFE_NUMBERS = [-1, 7, 2147483647, -2147483648, 65535, 3];

function nest(tags: unknown, levels: number): unknown {
  let out = tags;
  for (let i = 0; i < levels; i++) out = [out];
  return out;
}

function corrupt(text: string, rand: () => number): string {
  const i = Math.floor(rand() * text.length);
  const junk = ["\u0000", "}", '"', "\\", "ÿ"][Math.floor(rand() * 5)]!;
  return text.slice(0, i) + junk + text.slice(i + 1);
}

/**
 * Runs one campaign. Target bug alternates so visitors can see both a
 * duplicate and a second, distinct crash class on repeat presses.
 */
export function runCampaign(run: number, knownKeys: ReadonlySet<string>, maxExecs = 40): Campaign {
  // The second campaign in each group of three replays the previous seed, so it
  // rediscovers the exact same crashing input and deduplication is visible.
  const seed = run % 3 === 1 ? run - 1 : run;
  const rand = mulberry32(1337 + seed * 7919);
  const hunting: "depth" | "zero" = run % 3 === 2 ? "zero" : "depth";
  const executions: Execution[] = [];
  let depth = 1;

  for (let n = 1; n <= maxExecs; n++) {
    const roll = rand();
    let strategy: string;
    let input: string;
    const base: Seed = { id: SAFE_NUMBERS[Math.floor(rand() * SAFE_NUMBERS.length)]!, tags: ["a"] };

    if (n === 3) {
      strategy = "json-ast: huge number";
      input = JSON.stringify({ id: 7, tags: ["a"] }).replace("7", "99999999999999999999");
    } else if (roll < 0.3) {
      strategy = "bytes: corrupt";
      input = corrupt(JSON.stringify(base), rand);
    } else if (hunting === "depth" && roll < 0.8) {
      depth += 1;
      strategy = `json-ast: nest array (depth ${depth})`;
      input = JSON.stringify({ ...base, tags: nest(["a"], depth - 1) });
    } else if (hunting === "zero" && roll < 0.8 && n > 5) {
      strategy = "json-ast: boundary value";
      input = JSON.stringify({ ...base, id: 0 });
    } else {
      strategy = "json-ast: replace value";
      input = JSON.stringify(base);
    }

    const result = mysteryProgram(input);
    executions.push({ n, input, strategy, ...result });

    if (result.outcome === "crash" && result.signal && result.site) {
      const key = inputHash(input);
      return {
        executions,
        crash: {
          signal: result.signal,
          site: result.site,
          key,
          input,
          duplicate: knownKeys.has(key),
        },
      };
    }
  }
  return { executions, crash: null };
}
