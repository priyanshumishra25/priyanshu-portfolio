import { describe, expect, it } from "vitest";
import { curatedAnswers, interestingPicks, suggestedPromptIds } from "@/content/assistant";
import { getChunk, knowledge, resolveSources } from "@/lib/assistant/knowledge";
import {
  answerLocally,
  findCurated,
  interestingAnswer,
  unknownTechnologies,
} from "@/lib/assistant/local";
import { retrieve, tokenize } from "@/lib/assistant/retrieve";
import { technologyHits } from "@/lib/assistant/technologies";

const ask = (q: string) => answerLocally(q);
const ids = (q: string) => ask(q).sources.map((s) => s.id);

describe("knowledge base", () => {
  it("has unique chunk ids", () => {
    const all = knowledge.map((c) => c.id);
    expect(new Set(all).size).toBe(all.length);
  });

  it("every chunk links somewhere on the site", () => {
    for (const c of knowledge) expect(c.href).toMatch(/^\/[a-z]/);
  });

  it("generates chunks for every project, including workbench ones", () => {
    for (const id of [
      "project:wheat-segmentation",
      "facet:wheat-segmentation/result",
      "project:insurance-fraud",
      "facet:insurance-fraud/results",
      "project:bittrickle",
    ]) {
      expect(getChunk(id), id).toBeDefined();
    }
    expect(getChunk("project:insurance-fraud")!.href).toBe("/work#insurance-fraud");
  });

  it("puts experience dates into knowledge automatically", () => {
    expect(getChunk("experience:armsoa")!.text).toContain("June 2026 to September 2026");
    expect(getChunk("experience:armsoa")!.text).toContain("Past role");
    expect(getChunk("experience:resident-advisor")!.text).toContain("Current role");
    expect(getChunk("experience:resident-advisor")!.text).toContain(
      "not a software engineering role",
    );
  });

  it("drops unknown ids when resolving sources", () => {
    expect(resolveSources(["project:armsoa", "made-up", "project:armsoa"])).toEqual([
      { id: "project:armsoa", label: "ArmsOA", href: "/work/armsoa" },
    ]);
  });
});

describe("retrieval", () => {
  it("tokenizes technical terms sensibly", () => {
    expect(tokenize("C++17 and SHA-256 crashes")).toEqual(
      expect.arrayContaining(["c++17", "sha-256", "sha", "256", "crash"]),
    );
  });

  it("ranks ArmsOA highly for backend questions", () => {
    expect(retrieve("FastAPI backend services", 3).some((h) => h.chunk.id.includes("armsoa"))).toBe(
      true,
    );
  });

  it("finds the fuzzer for process isolation", () => {
    expect(retrieve("fork exec isolation", 1)[0]?.chunk.id).toMatch(/midpoint-fuzzer|d05/);
  });

  it("returns nothing for unrelated questions", () => {
    expect(retrieve("favourite pizza topping")).toEqual([]);
  });
});

describe("unknown technologies keep their real names", () => {
  it("returns canonical labels, not stemmed tokens", () => {
    expect(unknownTechnologies("Does he know Kubernetes or Rust?")).toEqual(["Kubernetes", "Rust"]);
    expect(unknownTechnologies("Has he used Postgres?")).toEqual(["PostgreSQL"]);
    expect(unknownTechnologies("k8s experience?")).toEqual(["Kubernetes"]);
  });

  it("says Kubernetes, not kubernete", () => {
    const a = ask("Does he have Kubernetes experience?");
    expect(a.kind).toBe("not-found");
    expect(a.text).toMatch(/^Kubernetes is not mentioned anywhere on this site/);
    expect(a.text).not.toMatch(/kubernete\b/);
  });

  it("names several unknown technologies naturally", () => {
    expect(ask("Does he know Kubernetes or Rust?").text).toMatch(
      /^Kubernetes and Rust are not mentioned/,
    );
  });

  it("points Kafka questions at the closest real project without claiming Kafka", () => {
    const a = ask("Has he used Kafka?");
    expect(a.kind).toBe("not-found");
    expect(a.text).toMatch(/^Kafka is not mentioned/);
    expect(a.sources[0]?.id).toMatch(/tributary/);
  });

  it("does not treat technologies on the site as unknown", () => {
    expect(unknownTechnologies("Does he know Python, Docker, Redis and PyTorch?")).toEqual([]);
  });
});

describe("PAI as a project finder", () => {
  it("lists only verified PyTorch projects", () => {
    expect(technologyHits("What projects use PyTorch?")).toEqual([
      expect.objectContaining({ label: "PyTorch", names: ["Wheat Segmentation"] }),
    ]);
  });

  it("finds Java, C++ and Python work from project stacks", () => {
    expect(ids("What has he built in Java?")).toEqual(["project:tributary"]);
    expect(ids("Show me something involving C++")).toEqual(["project:midpoint-fuzzer"]);
    expect(ids("Which projects use Python?")).toEqual(
      expect.arrayContaining([
        "project:armsoa",
        "project:quant-ai",
        "project:wheat-segmentation",
        "research",
      ]),
    );
  });

  it("answers computer vision, ML, imbalanced data and other-project questions", () => {
    expect(ids("What computer vision work has Priyanshu done?")).toContain(
      "project:wheat-segmentation",
    );
    expect(ask("What is his strongest computer vision project?").text).toContain(
      "Wheat Crop Segmentation Benchmark",
    );
    expect(ids("What machine learning projects has he built?")).toEqual(
      expect.arrayContaining([
        "project:wheat-segmentation",
        "facet:research/classification",
        "facet:insurance-fraud/overview",
      ]),
    );
    expect(ids("Has he worked with imbalanced datasets?")).toContain(
      "facet:insurance-fraud/overview",
    );
    expect(ids("What distributed systems work has he done?")).toContain(
      "facet:tributary/partitioning",
    );
    expect(ids("What systems programming has he done?")).toContain(
      "facet:midpoint-fuzzer/process-isolation",
    );
    expect(ids("Show me a project involving model evaluation.")).toContain(
      "project:wheat-segmentation",
    );
    const other = ask("Show me his other projects.");
    for (const name of [
      "Midpoint Fuzzer",
      "Quant AI",
      "Tributary",
      "Wheat Segmentation",
      "Fraud Detection",
      "BitTrickle",
    ]) {
      expect(other.text).toContain(name);
    }
  });
});

describe("employment answers", () => {
  it("knows when he worked at ArmsOA", () => {
    expect(ask("When did he work at ArmsOA?").text).toContain("June 2026 to September 2026");
  });

  it("says ArmsOA is not current", () => {
    const a = ask("Does he currently work at ArmsOA?");
    expect(a.text).toBe(
      "No. His ArmsOA Software Engineer role ran from June 2026 to September 2026.",
    );
  });

  it.each([
    "What is his current experience?",
    "What is he doing currently?",
    "What is he doing now?",
  ])("%s does not imply current engineering work at ArmsOA", (q) => {
    const t = ask(q).text;
    expect(t).toContain("Resident Advisor");
    expect(t).toContain("not a software engineering one");
    expect(t).not.toMatch(/(is|currently|now)( a)? software engineer at armsoa/i);
    expect(t).toMatch(/most recent software engineering role was at ArmsOA/);
  });

  it("references Resident Advisor for leadership and communication", () => {
    for (const q of [
      "What leadership experience does he have?",
      "What experience does he have communicating with people?",
    ]) {
      const a = ask(q);
      expect(a.text).toContain("Resident Advisor at Shalom College");
      expect(a.text).toContain("130 residents");
      expect(a.text).toContain("not an engineering one");
    }
  });

  it("uses past tense and precise ownership for ArmsOA", () => {
    const shipped = ask("What has he shipped professionally?").text;
    expect(shipped).toContain("most recent software engineering role was at ArmsOA");
    const owned = ask("What did Priyanshu own at ArmsOA?").text;
    expect(owned).toMatch(/^He owned the AI interface/);
    expect(owned).toContain("directly built or implemented");
    expect(ask("What did Priyanshu build at ArmsOA?").text).toContain(
      "The AI interface, which he owned",
    );
  });

  it("explains how the capstone became professional work", () => {
    expect(ask("How did the capstone become professional work?").text).toMatch(
      /capstone for ArmsOA.*initial client delivery/s,
    );
  });
});

describe("curated answers", () => {
  it.each(suggestedPromptIds)("suggested prompt %s answers with sources", (id) => {
    const prompt = curatedAnswers.find((c) => c.id === id)!.prompt;
    const a = ask(prompt);
    expect(a.kind).toBe("answer");
    expect(a.sources.length).toBeGreaterThan(0);
    expect(findCurated(prompt)?.id).toBe(id);
  });

  it("explains its own grounding in under 100 words", () => {
    const a = ask("How do you work?");
    expect(a.text.split(/\s+/).length).toBeLessThan(100);
    expect(a.sources.map((s) => s.id)).toEqual(["pai"]);
    expect(a.text).not.toMatch(/\bRAG\b/);
  });

  it("fills every template", () => {
    for (const c of curatedAnswers) expect(ask(c.prompt).text, c.id).not.toContain("{{");
  });

  it("never calls projects independent of university", () => {
    for (const c of curatedAnswers)
      expect(ask(c.prompt).text.toLowerCase()).not.toMatch(/independent|outside (of )?university/);
  });

  it("admits when it has nothing", () => {
    const a = ask("What is his favourite pizza topping?");
    expect(a.kind).toBe("not-found");
    expect(a.sources).toEqual([]);
  });

  it("falls back to retrieval with citations for free-form questions", () => {
    expect(ids("Tell me about GeoJSON exports")).toContain("facet:armsoa/observability");
  });

  it("handles empty input", () => {
    expect(ask("   ").kind).toBe("not-found");
  });

  it("never uses em dashes", () => {
    const prompts = curatedAnswers
      .map((c) => c.prompt)
      .concat(["kafka?", "pizza", "geojson", "Which projects use Python?"]);
    for (const p of prompts) expect(ask(p).text).not.toContain("—");
  });
});

describe("show me something interesting", () => {
  it("cycles through every pick with valid sources", () => {
    const seen = new Set<string>();
    for (let i = 0; i < interestingPicks.length; i++) {
      const a = interestingAnswer(i);
      expect(a.kind).toBe("interesting");
      expect(a.sources.length).toBe(interestingPicks[i]!.sources.length);
      seen.add(a.text);
    }
    expect(seen.size).toBe(interestingPicks.length);
    expect(interestingAnswer(interestingPicks.length).text).toBe(interestingAnswer(0).text);
  });
});
