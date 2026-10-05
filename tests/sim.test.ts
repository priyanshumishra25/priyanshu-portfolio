import { describe, expect, it } from "vitest";
import { createSequenceDetector, KONAMI } from "@/components/animations/EasterEggs";
import {
  createRateLimiter,
  DEFAULT_LLM_REQUESTS_PER_MINUTE,
  llmRequestsPerMinute,
} from "@/lib/assistant/rate-limit";
import { formatPeriod, isCurrent } from "@/lib/period";
import { buildField, FIELD_H, FIELD_W, superpixelEdges } from "@/lib/sim/field";
import { inputHash, mysteryProgram, runCampaign } from "@/lib/sim/fuzzer";
import { failureSet, initialNetwork, isolatedNodes, networkReducer } from "@/lib/sim/network";
import { runQuery, validateCompany } from "@/lib/sim/quant";
import {
  append,
  assignPartitions,
  choosePartition,
  consumeTick,
  offsetsInOrder,
  type Message,
} from "@/lib/sim/tributary";

describe("network resilience model", () => {
  it("walks fail, propose, approve and keeps physical failures", () => {
    let s = networkReducer(initialNetwork, { type: "fail" });
    expect(s.phase).toBe("failed");
    expect(isolatedNodes(s).sort()).toEqual(["alpha", "delta"]);

    s = networkReducer(s, { type: "propose" });
    expect(s.phase).toBe("proposed");
    expect(isolatedNodes(s).length).toBe(2); // nothing changes before approval

    s = networkReducer(s, { type: "approve" });
    expect(s.phase).toBe("recovered");
    expect(isolatedNodes(s)).toEqual([]);
    expect(s.failed).toEqual(failureSet); // recovery never erases the failure
  });

  it("rejecting leaves the network untouched and allows asking again", () => {
    let s = networkReducer(networkReducer(initialNetwork, { type: "fail" }), { type: "propose" });
    s = networkReducer(s, { type: "reject" });
    expect(s.temporary).toEqual([]);
    expect(networkReducer(s, { type: "propose" }).phase).toBe("proposed");
  });

  it("ignores out-of-order actions", () => {
    expect(networkReducer(initialNetwork, { type: "approve" })).toBe(initialNetwork);
    expect(networkReducer(initialNetwork, { type: "propose" })).toBe(initialNetwork);
  });
});

describe("fuzzer model", () => {
  it("classifies target behaviour", () => {
    expect(mysteryProgram("{nope").outcome).toBe("rejected");
    expect(mysteryProgram('{"id":99999999999999999999}').outcome).toBe("timeout");
    expect(mysteryProgram('{"id":0}')).toMatchObject({ outcome: "crash", signal: "SIGFPE" });
    expect(mysteryProgram('{"tags":[[[[[["a"]]]]]]}')).toMatchObject({
      outcome: "crash",
      signal: "SIGSEGV",
    });
    expect(mysteryProgram('{"id":7,"tags":["a"]}').outcome).toBe("ok");
  });

  it("dedups by the crashing input, like the real fuzzer", () => {
    const known = new Set<string>();
    const first = runCampaign(0, known);
    expect(first.crash).toMatchObject({ signal: "SIGSEGV", duplicate: false });
    expect(first.executions.some((e) => e.outcome === "timeout")).toBe(true);
    expect(first.crash!.key).toBe(inputHash(first.crash!.input));
    known.add(first.crash!.key);

    const second = runCampaign(1, known);
    expect(second.crash!.input).toBe(first.crash!.input);
    expect(second.crash).toMatchObject({ duplicate: true, key: first.crash!.key });

    const third = runCampaign(2, known);
    expect(third.crash).toMatchObject({ signal: "SIGFPE", duplicate: false });
  });

  it("is deterministic and hashes inputs", () => {
    expect(runCampaign(4, new Set())).toEqual(runCampaign(4, new Set()));
    expect(inputHash("a")).toBe(inputHash("a"));
    expect(inputHash("a")).not.toBe(inputHash("b"));
  });
});

describe("quant model", () => {
  it("reports missing sources instead of filling them", () => {
    const run = runQuery("NVIDIA", "rate-limited", new Set());
    expect(run.available).toBe(3);
    expect(run.sources.find((s) => s.id === "provider")?.status).toBe("rate-limited");
    expect(run.summary).toContain("No substitute data used");
  });

  it("serves price history from cache on repeat", () => {
    const run = runQuery("NVIDIA", "healthy", new Set(["nvidia"]));
    expect(run.sources[0]?.status).toBe("cached");
    expect(run.available).toBe(4);
  });

  it("validates company input", () => {
    expect(validateCompany("  ").ok).toBe(false);
    expect(validateCompany("<script>").ok).toBe(false);
    expect(validateCompany("x".repeat(41)).ok).toBe(false);
    expect(validateCompany(" AT&T ")).toEqual({ ok: true, value: "AT&T" });
  });
});

describe("tributary model", () => {
  it("rebalances with Range and RoundRobin like ConsumerGroup", () => {
    expect(assignPartitions("Range", 2, 3)).toEqual([[0, 1], [2]]);
    expect(assignPartitions("RoundRobin", 2, 3)).toEqual([[0, 2], [1]]);
    for (const s of ["Range", "RoundRobin"] as const) {
      for (const c of [1, 2, 3]) expect(assignPartitions(s, c, 3).flat().sort()).toEqual([0, 1, 2]);
    }
    expect(assignPartitions("Range", 0, 3)).toEqual([]);
  });

  it("allocates manually or at random", () => {
    expect(choosePartition("Manual", 2, 3, () => 0)).toBe(2);
    expect(choosePartition("Random", 2, 3, () => 0.4)).toBe(1);
  });

  it("keeps messages as a log and supports replay from offset 0", () => {
    let logs: Message[][] = [[], [], []];
    logs = append(append(logs, 1, 1, "a"), 1, 2, "b");
    expect(offsetsInOrder(logs[1]!)).toBe(true);

    let tick = consumeTick(logs, [0, 0, 0]);
    expect(tick.read.map((r) => r.message.label)).toEqual(["a"]);
    tick = consumeTick(logs, tick.offsets);
    expect(tick.offsets).toEqual([0, 2, 0]);
    expect(logs[1]!.length).toBe(2); // reading does not delete

    const replay = consumeTick(logs, [0, 0, 0]);
    expect(replay.read[0]!.message.label).toBe("a");
  });
});

describe("field model", () => {
  it("is deterministic and has both crop and soil", () => {
    const a = buildField();
    expect(a).toEqual(buildField());
    expect(a.length).toBe(FIELD_W * FIELD_H);
    expect(a.some((c) => c.crop)).toBe(true);
    expect(a.some((c) => !c.crop)).toBe(true);
  });

  it("draws superpixel boundaries along crop edges", () => {
    const cells = buildField();
    expect(superpixelEdges(cells).length).toBeGreaterThan(0);
  });
});

describe("utilities", () => {
  it("formats periods without dashes", () => {
    expect(formatPeriod({ start: "2026-06", end: "2026-09" })).toBe("Jun 2026 to Sep 2026");
    expect(formatPeriod({ start: "2026-02", end: "present" }, "long")).toBe(
      "February 2026 to present",
    );
    expect(isCurrent({ start: "2026-02", end: "present" })).toBe(true);
  });

  it("rate limiter allows up to the limit per window", () => {
    const allow = createRateLimiter(2, 1000);
    expect([allow("a", 0), allow("a", 1), allow("a", 2)]).toEqual([true, true, false]);
    expect(allow("a", 1001)).toBe(true);
    expect(allow("b", 2)).toBe(true);
  });

  it("reads the LLM rate limit from env with a conservative default", () => {
    expect(llmRequestsPerMinute(undefined)).toBe(DEFAULT_LLM_REQUESTS_PER_MINUTE);
    expect(DEFAULT_LLM_REQUESTS_PER_MINUTE).toBeLessThanOrEqual(10);
    expect(llmRequestsPerMinute("5")).toBe(5);
    expect(llmRequestsPerMinute("lots")).toBe(DEFAULT_LLM_REQUESTS_PER_MINUTE);
    expect(llmRequestsPerMinute("-1")).toBe(DEFAULT_LLM_REQUESTS_PER_MINUTE);
  });

  it("detects the Konami code, including after a false start", () => {
    let hits = 0;
    const detect = createSequenceDetector(KONAMI, () => hits++);
    ["ArrowUp", "x", ...KONAMI].forEach(detect);
    expect(hits).toBe(1);
    ["ArrowUp", ...KONAMI].forEach(detect);
    expect(hits).toBe(2);
    KONAMI.slice(0, -1).forEach(detect);
    expect(hits).toBe(2);
  });
});
