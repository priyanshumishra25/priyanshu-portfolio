import { getExperience } from "./experience";
import type { Research } from "./types";

export const research: Research = {
  title: "Detecting silent DNS security downgrades from encrypted traffic",
  question: "Can encrypted network traffic reveal when DNS security silently downgrades?",
  role: "AI Researcher",
  org: "UNSW School of Electrical Engineering",
  period: getExperience("unsw-research").period,
  abstract: [
    "Encrypted DNS protocols such as DNS over HTTPS (DoH), DNS over TLS (DoT) and DNS over QUIC (DoQ) protect lookups from observers. When they fail, many clients quietly fall back to plaintext DNS, and the user is never told.",
    "This project asked whether that fallback can be detected from network captures alone. I built a pipeline that ingests real pcapng captures, engineers features from encrypted and plaintext DNS traffic, classifies it with machine learning, and correlates traffic with browser sessions to say when and where a downgrade happened.",
    "On real captures the classifier reached 92% accuracy. Correlations are reported with a confidence score rather than as certainties.",
  ],
  stack: ["Python", "Scapy", "Selenium", "Firefox WebExtension", "Machine learning"],
  pipeline: [
    { name: "Capture", detail: "Real network traffic recorded as pcapng." },
    { name: "Ingest", detail: "pcapng parsing in Python with Scapy." },
    {
      name: "Ground truth",
      detail:
        "Selenium-driven browsing and a Firefox WebExtension record what the browser actually did.",
    },
    {
      name: "Features",
      detail: "Feature engineering over DoH, DoT, DoQ and plaintext DNS flows.",
    },
    { name: "Classify", detail: "Machine learning classification of plaintext fallback." },
    {
      name: "Correlate",
      detail: "Traffic matched to browser sessions, each match carrying a confidence score.",
    },
  ],
  result: {
    value: "92%",
    label: "accuracy on real captures",
    caveat: "Measured on real traffic captures, not synthetic data.",
  },
  philosophy:
    "Use confidence rather than pretending uncertain correlations are certain. A detection that says how sure it is can be acted on responsibly. One that hides its uncertainty cannot.",
  ownership: [
    "Scoping the question",
    "Data collection",
    "Pipeline design and architecture",
    "Model evaluation and iteration",
    "Presenting findings to stakeholders",
  ],
  audiences: [
    "Technical engineers, who wanted the pipeline, features and evaluation",
    "Non-technical infrastructure stakeholders, who wanted to know what it meant for their networks",
  ],
  relatedRepo: {
    url: "https://github.com/priyanshumishra25/DNS-Downgrade-Detection",
    note: "A rule-based fallback detector for pcapng captures and a DNS traffic simulator. The ML classification pipeline described here is not in that repository.",
  },
  facets: [
    {
      id: "pipeline",
      label: "Capture Pipeline",
      summary:
        "Built a Python pipeline that ingests pcapng captures with Scapy and records browser ground truth with Selenium and a Firefox WebExtension.",
      tags: ["python", "scapy", "selenium", "pcapng", "pipeline", "data", "networking"],
    },
    {
      id: "classification",
      label: "ML Classification",
      summary:
        "Engineered features from DoH, DoT, DoQ and plaintext DNS traffic and trained a classifier that reached 92% accuracy on real captures.",
      tags: ["ml", "machine learning", "classification", "features", "dns", "ai", "security"],
    },
    {
      id: "confidence",
      label: "Confidence Scoring",
      summary:
        "Correlated traffic with browser sessions and reported each correlation with a confidence score rather than as a certainty.",
      tags: ["confidence", "uncertainty", "correlation", "ml"],
    },
    {
      id: "ownership",
      label: "End-to-end Ownership",
      summary:
        "Owned the work end to end, from scoping and data collection to evaluation and presenting to technical and non-technical stakeholders.",
      tags: ["ownership", "communication", "stakeholders", "research"],
    },
  ],
  tags: ["research", "security", "networking", "ml", "ai", "dns", "python"],
};
