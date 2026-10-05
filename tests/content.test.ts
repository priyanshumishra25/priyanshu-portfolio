import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { about } from "@/content/about";
import * as assistant from "@/content/assistant";
import { curatedAnswers, interestingPicks } from "@/content/assistant";
import { decisions } from "@/content/decisions";
import { experience, timeline } from "@/content/experience";
import { featuredProjects, projectHref, projects, workbenchProjects } from "@/content/projects";
import { research } from "@/content/research";
import { site } from "@/content/site";
import { getChunk } from "@/lib/assistant/knowledge";
import { formatPeriod } from "@/lib/period";

const ROOT = path.resolve(import.meta.dirname, "..");
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory()
      ? sourceFiles(full)
      : /\.(ts|tsx)$/.test(name)
        ? [full]
        : [];
  });
}

/** Every user-facing source file: content plus UI. */
const uiSources = ["content", "app", "components"].flatMap((d) => sourceFiles(path.join(ROOT, d)));
const allContent = JSON.stringify([
  about,
  assistant,
  decisions,
  experience,
  projects,
  research,
  site,
  timeline,
]);

function knownAnchors(): Set<string> {
  const anchors = new Set<string>([
    "/work",
    "/decisions",
    "/research",
    "/about",
    "/about#contact",
    "/about#other-experience",
    "/about#how-pai-works",
    "/resume",
  ]);
  for (const p of projects) {
    anchors.add(projectHref(p));
    if (p.featured) anchors.add(`/work/${p.slug}#demo`);
    for (const f of p.facets) anchors.add(projectHref(p, f.id));
  }
  for (const d of decisions) anchors.add(`/decisions#${d.slug}`);
  for (const f of research.facets) anchors.add(`/research#${f.id}`);
  return anchors;
}

describe("copy rules", () => {
  it("contains no em dashes in content or UI source", () => {
    expect(allContent).not.toContain("—");
    for (const f of uiSources) expect(readFileSync(f, "utf8"), f).not.toContain("—");
  });

  it("avoids buzzwords the brief rules out", () => {
    const all = allContent.toLowerCase();
    for (const banned of [
      "passionate",
      "innovative solutions",
      "cutting-edge",
      "leverag",
      "expert",
    ]) {
      expect(all, banned).not.toContain(banned);
    }
  });

  it("does not describe the PAI model path as RAG", () => {
    expect(allContent).not.toMatch(/\bRAG\b/);
  });

  it("does not claim agents learn from rejections", () => {
    expect(allContent.toLowerCase()).not.toMatch(
      /rejection is a signal|learns? from (operator )?reject|self-improv/,
    );
  });
});

describe("contact details", () => {
  it("uses real values, not placeholders", () => {
    expect(site.email).toBe("priyanshumishra2508@gmail.com");
    expect(site.github).toBe("https://github.com/priyanshumishra25");
    expect(site.linkedin).toBe("https://www.linkedin.com/in/priyanshu-mishra-unsw");
    expect(site.location).toBe("Sydney, NSW");
  });

  it("never reintroduces placeholder contact values anywhere", () => {
    for (const f of uiSources) {
      const text = readFileSync(f, "utf8");
      expect(text, f).not.toMatch(
        /example\.com|your-github-username|your-linkedin-handle|TODO\(priyanshu\)/,
      );
    }
  });
});

describe("ArmsOA is past employment", () => {
  const presentTense = [
    /\b(he|i) (is|am) (a |the )?software engineer at armsoa/i,
    /\b(he|i) (currently|now) (works|is working|am working)[^.?]{0,20}armsoa/i,
    /\b(is|am) (currently|now) (a |an |employed|working)[^.?]{0,30}armsoa/i,
    /armsoa, where he is/i,
    /\bworks at armsoa/i,
    /\bcurrently at armsoa/i,
  ];

  it("no content or UI copy uses current tense for ArmsOA", () => {
    const corpus = [allContent, ...uiSources.map((f) => readFileSync(f, "utf8"))];
    for (const text of corpus) for (const re of presentTense) expect(text).not.toMatch(re);
  });

  it("has the right dates, from one place", () => {
    const armsoa = experience.find((e) => e.id === "armsoa")!;
    expect(formatPeriod(armsoa.period, "long")).toBe("June 2026 to September 2026");
    expect(projects.find((p) => p.slug === "armsoa")!.period).toBe(armsoa.period);
    expect(timeline.find((t) => t.id === "engineer")!.period).toBe(armsoa.period);
  });
});

describe("experience dates", () => {
  it("matches the known periods", () => {
    const short = (id: string) => formatPeriod(experience.find((e) => e.id === id)!.period);
    expect(short("armsoa")).toBe("Jun 2026 to Sep 2026");
    expect(short("unsw-research")).toBe("Jun 2025 to Feb 2026");
    expect(short("resident-advisor")).toBe("Feb 2026 to Present");
    expect(formatPeriod(about.education.period)).toBe("Sep 2023 to Aug 2026");
    expect(research.period).toBe(experience.find((e) => e.id === "unsw-research")!.period);
  });

  it("never types a date string directly into UI components", () => {
    for (const f of uiSources.filter((f) => !f.includes(`${path.sep}content${path.sep}`))) {
      expect(readFileSync(f, "utf8"), f).not.toMatch(
        /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* 20\d\d\b/,
      );
    }
  });

  it("keeps the Resident Advisor role out of engineering work", () => {
    const ra = experience.find((e) => e.id === "resident-advisor")!;
    expect(ra.kind).toBe("leadership");
    expect(projects.some((p) => p.title.includes("Resident"))).toBe(false);
  });
});

describe("decisions", () => {
  it("has six numbered entries", () => {
    expect(decisions.map((d) => d.number)).toEqual(["01", "02", "03", "04", "05", "06"]);
  });

  it.each(decisions.map((d) => [d.number, d] as const))(
    "decision %s is 150 to 300 words",
    (_, d) => {
      const n = words(d.body.join(" "));
      expect(n).toBeGreaterThanOrEqual(150);
      expect(n).toBeLessThanOrEqual(300);
    },
  );

  it("links only to anchors that exist", () => {
    const anchors = knownAnchors();
    for (const d of decisions)
      for (const r of d.related) expect(anchors.has(r.href), r.href).toBe(true);
  });

  it("frames decision 03 around shared contracts, not chronology", () => {
    const d03 = decisions.find((d) => d.id === "d03")!;
    expect(d03.title).toBe("Why shared API contracts mattered");
    const body = d03.body.join(" ");
    expect(body).toContain("mock");
    expect(body).not.toMatch(/wrote the contract first|before the endpoint existed|first artifact/);
  });
});

describe("projects", () => {
  it("has unique slugs and per-project facet ids", () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
    for (const p of projects) expect(new Set(p.facets.map((f) => f.id)).size).toBe(p.facets.length);
  });

  it("keeps the editorial order of featured projects", () => {
    expect(featuredProjects.map((p) => p.slug)).toEqual([
      "armsoa",
      "midpoint-fuzzer",
      "quant-ai",
      "wheat-segmentation",
      "tributary",
    ]);
    expect(workbenchProjects.map((p) => p.slug)).toEqual(
      expect.arrayContaining(["insurance-fraud"]),
    );
  });

  it("only uses provenance labels that are known", () => {
    const ctx = Object.fromEntries(projects.map((p) => [p.slug, p.context]));
    expect(ctx).toMatchObject({
      armsoa: "professional",
      "quant-ai": "personal",
      "midpoint-fuzzer": "project",
      tributary: "project",
      "wheat-segmentation": "project",
    });
    expect(allContent).not.toMatch(/"independent"/);
  });

  it("only references decisions that exist", () => {
    for (const p of featuredProjects)
      for (const id of p.decisionIds) expect(decisions.some((d) => d.id === id)).toBe(true);
  });

  it("has valid https repository links when present, all on GitHub", () => {
    for (const p of projects) {
      if (p.repoUrl)
        expect(p.repoUrl, p.slug).toMatch(/^https:\/\/github\.com\/priyanshumishra25\/[\w.-]+$/);
      if (p.demoUrl) expect(p.demoUrl).toMatch(/^https?:\/\//);
    }
    if (research.relatedRepo) expect(research.relatedRepo.url).toMatch(/^https:\/\/github\.com\//);
  });

  it("marks ArmsOA as private client work with illustrative demo data", () => {
    const armsoa = projects.find((p) => p.slug === "armsoa")!;
    expect(armsoa.repoUrl).toBeUndefined();
    expect(armsoa.sourceNote).toBe("Client work · source private");
    expect(armsoa.featured && armsoa.demoNote).toBe(
      "Interactive demo uses illustrative data and does not reproduce client data.",
    );
  });

  it("states the known metrics and no invented ones", () => {
    expect(JSON.stringify(projects.find((p) => p.slug === "armsoa"))).toContain("500+");
    expect(research.result.value).toBe("92%");
    const wheat = projects.find((p) => p.slug === "wheat-segmentation")!;
    expect(wheat.metrics?.map((m) => m.value)).toEqual(["0.91"]);
    expect(new Set(JSON.stringify(wheat).match(/\b0\.\d+\b/g))).toEqual(new Set(["0.91"]));
    const fraud = projects.find((p) => p.slug === "insurance-fraud")!;
    expect(fraud.metrics?.map((m) => m.value)).toEqual(["97%", "Top 5"]);
  });
});

describe("assistant content", () => {
  it("cites only real chunks", () => {
    for (const c of curatedAnswers)
      for (const id of c.sources) expect(getChunk(id), `${c.id}: ${id}`).toBeDefined();
    for (const p of interestingPicks)
      for (const id of p.sources) expect(getChunk(id), id).toBeDefined();
  });

  it("points CTAs at real pages", () => {
    const anchors = knownAnchors();
    for (const c of curatedAnswers)
      if (c.cta) expect(anchors.has(c.cta.href), c.cta.href).toBe(true);
    for (const p of interestingPicks) expect(anchors.has(p.cta.href), p.cta.href).toBe(true);
  });

  it("suggested prompts all exist", () => {
    for (const id of assistant.suggestedPromptIds)
      expect(curatedAnswers.some((c) => c.id === id)).toBe(true);
  });
});
