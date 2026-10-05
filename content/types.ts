/**
 * Shared content types. Everything the site (and PAI) knows about Priyanshu
 * is expressed with these shapes so UI and retrieval never drift apart.
 */

type Month = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12";

/** Year and month, e.g. "2026-06". */
export type YearMonth = `${number}-${Month}`;

export interface Period {
  start: YearMonth;
  end: YearMonth | "present";
}

export type DecisionId = "d01" | "d02" | "d03" | "d04" | "d05" | "d06";

/**
 * Where a project came from. Only use "personal", "research" or
 * "professional" when that provenance is actually known; otherwise "project".
 */
export type ProjectContext = "professional" | "research" | "personal" | "project";

export type ProjectCategory =
  | "Full Stack"
  | "Backend"
  | "Systems"
  | "Developer Tooling"
  | "AI"
  | "Machine Learning"
  | "Computer Vision"
  | "Distributed Systems"
  | "Networking";

/** A named, linkable part of a project. PAI cites these. */
export interface Facet {
  /** Anchor id on the page, e.g. "recovery-simulation". */
  id: string;
  /** Human label, e.g. "Recovery Simulation". */
  label: string;
  /** One or two plain sentences. Used by PAI when citing. */
  summary: string;
  tags: string[];
}

export interface FailureMode {
  failure: string;
  response: string;
}

export interface ArchitectureLayer {
  name: string;
  detail: string;
}

export interface ProjectMetric {
  value: string;
  label: string;
}

interface ProjectBase {
  slug: string;
  title: string;
  /** Used in citations, e.g. "ArmsOA / API Contracts". */
  shortTitle: string;
  /** The question or line the project is framed around. */
  question: string;
  oneLiner: string;
  context: ProjectContext;
  categories: ProjectCategory[];
  stack: string[];
  /** e.g. "Software Engineer at ArmsOA". Omit when there is nothing useful to say. */
  role?: string;
  /** e.g. "Atlassian × Allianz Datathon 2024". */
  event?: string;
  period?: Period;
  /** Exact public repository URL. Never guessed from the title. */
  repoUrl?: string;
  demoUrl?: string;
  /** Shown instead of a source link, e.g. "Client work · source private". */
  sourceNote?: string;
  metrics?: ProjectMetric[];
  facets: Facet[];
  tags: string[];
}

/** Gets its own page at /work/[slug]. */
export interface FeaturedProject extends ProjectBase {
  featured: true;
  /** True when components/projects/ProjectDemo.tsx has a demo for this slug. */
  interactive: boolean;
  /** Shown under the demo, e.g. to make clear the data is illustrative. */
  demoNote?: string;
  problem: string[];
  owned: string[];
  architecture: {
    /** Defaults to "Architecture". */
    heading?: string;
    /** "layers" numbers from the top of the stack down; "steps" counts up. */
    style?: "layers" | "steps";
    intro: string;
    layers: ArchitectureLayer[];
  };
  /** Decisions written up in the Decisions section. */
  decisionIds: DecisionId[];
  interesting: { title: string; body: string }[];
  failureModes: FailureMode[];
  shipped: string[];
  learned: string[];
}

/** A compact entry in "The Rest of the Workbench" on /work. */
export interface WorkbenchProject extends ProjectBase {
  featured: false;
  interactive: false;
  details: string[];
}

export type Project = FeaturedProject | WorkbenchProject;

export interface Decision {
  id: DecisionId;
  number: string;
  slug: string;
  title: string;
  /** One-line setup shown above the body. */
  context: string;
  body: string[];
  /** The sentence worth remembering. */
  takeaway: string;
  related: { label: string; href: string }[];
  tags: string[];
}

export interface Research {
  title: string;
  question: string;
  role: string;
  org: string;
  period: Period;
  abstract: string[];
  stack: string[];
  pipeline: ArchitectureLayer[];
  result: { value: string; label: string; caveat: string };
  philosophy: string;
  ownership: string[];
  audiences: string[];
  /** A related public repository, with a note on what it does and does not contain. */
  relatedRepo?: { url: string; note: string };
  facets: Facet[];
  tags: string[];
}

export type ExperienceKind = "engineering" | "research" | "leadership";

export interface Experience {
  id: string;
  role: string;
  org: string;
  location?: string;
  period: Period;
  kind: ExperienceKind;
  summary: string;
  href?: string;
}

export interface TimelineEntry {
  id: string;
  title: string;
  detail: string;
  href?: string;
  /** Shown small. Taken from experience or education data, never typed twice. */
  period?: Period;
  track: "main" | "side";
}
