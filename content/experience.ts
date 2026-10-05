import { about } from "./about";
import type { Experience, TimelineEntry } from "./types";

/** Every role and its dates live here. Pages, the resume and PAI read from this. */
export const experience: Experience[] = [
  {
    id: "armsoa",
    role: "Software Engineer",
    org: "ArmsOA",
    period: { start: "2026-06", end: "2026-09" },
    kind: "engineering",
    summary:
      "Started as a UNSW capstone for ArmsOA. After the initial client delivery, development continued and I worked as a Software Engineer on the network resilience platform.",
    href: "/work/armsoa",
  },
  {
    id: "unsw-research",
    role: "AI Researcher",
    org: "UNSW School of Electrical Engineering",
    period: { start: "2025-06", end: "2026-02" },
    kind: "research",
    summary:
      "Detecting silent DNS security downgrades from encrypted traffic. 92% accuracy on real captures.",
    href: "/research",
  },
  {
    id: "resident-advisor",
    role: "Resident Advisor",
    org: "Shalom College, UNSW",
    location: "Sydney",
    period: { start: "2026-02", end: "present" },
    kind: "leadership",
    summary:
      "First point of contact for 130 residents, including on-call duty, welfare checks and confidential incident escalation.",
    href: "/about#other-experience",
  },
];

export function getExperience(id: string): Experience {
  const e = experience.find((x) => x.id === id);
  if (!e) throw new Error(`Unknown experience id: ${id}`);
  return e;
}

/** Order matters: the main track is the story. Dates come from the data above. */
export const timeline: TimelineEntry[] = [
  {
    id: "unsw",
    title: "UNSW",
    detail: "Computer Science, with Distinction.",
    period: about.education.period,
    track: "main",
  },
  {
    id: "capstone",
    title: "Capstone project",
    detail: "A network resilience problem for ArmsOA.",
    track: "main",
  },
  {
    id: "delivery",
    title: "Client delivery",
    detail: "Turned requirements in an unfamiliar domain into working software.",
    track: "main",
  },
  {
    id: "continued",
    title: "Continued development with ArmsOA",
    detail: "The work kept going after the initial delivery.",
    href: "/work/armsoa",
    track: "main",
  },
  {
    id: "engineer",
    title: "Software Engineer",
    detail: "The AI interface, backend services, operator workflows and simulation.",
    href: "/work/armsoa",
    period: getExperience("armsoa").period,
    track: "main",
  },
  {
    id: "research",
    title: "UNSW AI Research",
    detail: "Encrypted DNS downgrade detection.",
    href: "/research",
    period: getExperience("unsw-research").period,
    track: "side",
  },
  {
    id: "resident-advisor",
    title: "Resident Advisor",
    detail: "Shalom College. People first, on call.",
    href: "/about#other-experience",
    period: getExperience("resident-advisor").period,
    track: "side",
  },
  {
    id: "fuzzer",
    title: "Midpoint Fuzzer",
    detail: "C++17 black-box fuzzing.",
    href: "/work/midpoint-fuzzer",
    track: "side",
  },
  {
    id: "quant",
    title: "Quant AI",
    detail: "Honest data for AI systems.",
    href: "/work/quant-ai",
    track: "side",
  },
  {
    id: "wheat",
    title: "Wheat Crop Segmentation",
    detail: "How much model a field needs.",
    href: "/work/wheat-segmentation",
    track: "side",
  },
  {
    id: "tributary",
    title: "Tributary",
    detail: "Java event streaming.",
    href: "/work/tributary",
    track: "side",
  },
];
