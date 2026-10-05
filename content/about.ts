import type { Period } from "./types";

export const about = {
  intro: [
    "Software Engineer based in Sydney.",
    "I like projects where I have to understand more than one layer of the system. Backend services, APIs, frontend behaviour, infrastructure, AI, data and the messy boundaries between them.",
    "The fastest way for me to learn something is usually to build it.",
  ],
  education: {
    school: "UNSW",
    degree: "Bachelor of Science in Computer Science",
    honours: "Distinction",
    period: { start: "2023-09", end: "2026-08" } satisfies Period as Period,
  },
  interests: [
    "Backend systems",
    "Distributed systems",
    "Full-stack engineering",
    "AI-native products",
    "Developer tooling",
    "Difficult debugging problems",
  ],
};
