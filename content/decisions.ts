import type { Decision } from "./types";

export const decisions: Decision[] = [
  {
    id: "d01",
    number: "01",
    slug: "agents-recommend",
    title: "Why agents recommend instead of execute",
    context: "ArmsOA: AI recovery agents for a network that operators are responsible for.",
    body: [
      "The recovery agents at ArmsOA were genuinely useful. They read live network state, reasoned about which links were degraded and suggested recovery paths faster than a person scanning a map. The obvious temptation with a tool like that is to let it act.",
      "The workflow was built around a strict boundary instead: agents recommend, operators approve. I implemented the AI interface around that boundary so no recovery action runs solely because a model recommends it.",
      "The reason is authority, not capability. An operator is accountable for the network. If an agent could execute a recovery action directly, accountability and authority would quietly separate: the person who answers for the outcome would no longer be the one who made the call. That is a poor design even when the model is right most of the time.",
      "So every agent output is a recommendation. It carries a confidence score and the live context it was based on, and it waits for an operator to approve or reject it.",
      "This costs some speed. In return, the approval step becomes a natural audit point, operators can build calibrated trust instead of blind trust, and a confident but wrong recommendation is caught by a person who can see why it was made. Each rejection also creates a useful review point for understanding where a recommendation did not match operator judgement.",
    ],
    takeaway: "Let the model be fast. Keep the decision with the person who is accountable for it.",
    related: [
      { label: "ArmsOA / Operator Approval", href: "/work/armsoa#human-in-the-loop" },
      { label: "ArmsOA / AI Interface", href: "/work/armsoa#ai-interface" },
    ],
    tags: ["ai", "agents", "human-in-the-loop", "approval", "safety", "armsoa"],
  },
  {
    id: "d02",
    number: "02",
    slug: "failure-vs-restored",
    title: "Why physical failure and restored state are different",
    context: "ArmsOA: what the system shows after a workaround brings service back.",
    body: [
      "When a microwave link fails and traffic is rerouted over a temporary SATCOM path, there is a tempting shortcut in the data model: mark the link as healthy again. Service is restored, the map turns green, everyone relaxes.",
      "That shortcut is a lie. The microwave link is still down. The SATCOM path has different capacity, latency and availability, and it was set up as a temporary measure. If the system overwrites the failure with the recovery, it loses the one fact operators most need: the underlying network is still broken.",
      "So the model keeps two separate pieces of state. Physical failure state records what is actually wrong with the network. Restored state records which temporary measures are currently compensating for it. The UI can show both: this link is failed, and service is being carried by this workaround.",
      "That made several things simpler. Recovery can be removed without having to reconstruct what was broken underneath. Simulations across multiple runs can compare recovery strategies against the same failure. And nobody can accidentally present a workaround as a repair, because the data model does not allow it.",
    ],
    takeaway: "A workaround restores service. It does not change the truth about what failed.",
    related: [
      { label: "ArmsOA / Recovery Simulation", href: "/work/armsoa#recovery-simulation" },
      { label: "Try the network demo", href: "/work/armsoa#demo" },
    ],
    tags: ["state", "data model", "recovery", "simulation", "reliability", "armsoa"],
  },
  {
    id: "d03",
    number: "03",
    slug: "shared-contracts",
    title: "Why shared API contracts mattered",
    context:
      "ArmsOA: a React frontend, FastAPI services and an AI interface depending on the same structures.",
    body: [
      "At ArmsOA, three consumers depended on the same shapes: the operator frontend, the backend services and the AI interface that read network state and returned recommendations. When three parts of a system share data, the most expensive bugs are the quiet ones: a renamed field, an optional value that became required, a payload that drifted.",
      "I wrote the contract layer that made those shapes explicit. An OpenAPI specification described the endpoints. Versioned JSON schemas described the payloads, including the structures passed to and returned from the AI interface.",
      "That gave every layer the same reference. Payloads could be validated against a schema instead of trusted. A breaking change became a visible, versioned change rather than a side effect discovered in production. The AI interface, which is the least forgiving consumer, had a defined structure to produce and be checked against.",
      "One small rule mattered more than expected: mock endpoints were explicitly labelled as mock. A demo-ready interface can look exactly like a finished one, and a contract that says which capabilities are real stops anyone, including the client, from mistaking one for the other.",
      "Contracts also turned requirements into something reviewable. A schema is concrete enough to argue about, which is a good way to check that a requirement was understood before it turns into code.",
    ],
    takeaway: "When several parts of a system share data, the contract is part of the product.",
    related: [
      { label: "ArmsOA / API Contracts", href: "/work/armsoa#api-contracts" },
      { label: "ArmsOA / Backend Services", href: "/work/armsoa#backend-services" },
    ],
    tags: ["api", "openapi", "json schema", "contracts", "full-stack", "armsoa"],
  },
  {
    id: "d04",
    number: "04",
    slug: "missing-data",
    title: "Why missing data should stay missing",
    context: "Quant AI: assembling market context from providers that rate limit and fail.",
    body: [
      "Quant AI pulls price history, news and Reddit discussion for a company. On any given request, one of those sources might be rate limited or down.",
      "There are two common ways to hide that. You can fall back to a stale or synthetic value, or you can let the AI layer fill the gap with something plausible. Both produce an output that looks complete. Both mean some of what the user reads is not grounded in real data, and they have no way to tell which part.",
      "I chose explicit degradation. Each source adapter returns either data with provenance or an explicit failure, such as a rate limit. The response says which sources contributed and which did not. If a provider is unavailable, the output says it is unavailable. Nothing is invented to cover it.",
      "Caching reduces how often this happens by not spending quota on repeated requests, but caching is a performance tool, not a way to disguise outages. Tests also run without live keys, using fixtures and mocked responses, so degraded paths are exercised as deliberately as the happy path.",
      "The result is a system that is sometimes less complete and always more honest, which is the right trade for anything people might make decisions from.",
    ],
    takeaway: "An honest gap is more useful than a confident fabrication.",
    related: [
      { label: "Quant AI / Explicit Degradation", href: "/work/quant-ai#degradation" },
      { label: "Quant AI / Provenance", href: "/work/quant-ai#provenance" },
    ],
    tags: ["data", "reliability", "degradation", "provenance", "ai", "quant-ai"],
  },
  {
    id: "d05",
    number: "05",
    slug: "isolate-executions",
    title: "Why a fuzzer should isolate every execution",
    context: "Midpoint Fuzzer: running programs whose behaviour is, by design, unknown.",
    body: [
      "A fuzzer's job is to make programs misbehave. If the target runs inside the fuzzer's own process, its misbehaviour becomes the fuzzer's misbehaviour. A segfault takes down the harness. Corrupted memory leaks into the next run. A hang freezes a worker forever.",
      "So every input runs in a fresh child process via fork and exec. The parent never shares an address space with the target, and each run starts from a clean state, which also makes results reproducible: the saved input plus the binary is enough to see the crash again.",
      "Isolation alone is not enough, so each child gets limits. A memory cap stops a runaway allocation from starving the machine. poll-based timeouts let the parent wait for output without blocking indefinitely, and kill the child when time runs out. When a child dies, the parent reads its exact status from waitpid, so SIGSEGV, SIGABRT and a timeout are different results rather than one vague failure.",
      "The cost is the overhead of creating a process per execution. For a black-box fuzzer that is worth paying. It turns every possible failure of the target into data the fuzzer can record, and it keeps the multithreaded harness reliable while the program it is testing is anything but.",
    ],
    takeaway: "If the thing you are running is expected to fail, put a process boundary around it.",
    related: [
      {
        label: "Midpoint Fuzzer / Process Isolation",
        href: "/work/midpoint-fuzzer#process-isolation",
      },
      {
        label: "Midpoint Fuzzer / Crash Classification",
        href: "/work/midpoint-fuzzer#crash-classification",
      },
    ],
    tags: ["systems", "isolation", "fork", "exec", "posix", "fuzzing", "midpoint-fuzzer"],
  },
  {
    id: "d06",
    number: "06",
    slug: "confidence",
    title: "Why confidence can be more useful than a hard answer",
    context: "UNSW research and ArmsOA: two systems that both had to admit uncertainty.",
    body: [
      "In the UNSW research, I correlated encrypted DNS traffic with browser sessions to detect when a secure resolver silently fell back to plaintext. Some correlations were clear. Others were ambiguous: overlapping sessions, background requests, timing noise. A classifier will happily output a hard label for both.",
      "Reporting every match as certain would have made the results look cleaner and made them less trustworthy. Instead each correlation carried a confidence score. High-confidence detections could be acted on, and low-confidence ones treated as leads to investigate. Reporting confidence alongside the 92% accuracy on real captures kept the uncertain cases visible instead of hiding them inside one number.",
      "At ArmsOA the same idea showed up in a different place. Recovery agents attach a confidence score to each recommendation, and an operator decides. A low-confidence recommendation is still useful: it tells the operator where to look and how much to trust it.",
      "In both cases a binary answer would have been simpler to build and worse to use. Confidence pushes the final judgement to whoever has the most context, and gives them what they need to make it. It also points at the cases worth studying, because the ones a system is unsure about are usually the interesting ones.",
    ],
    takeaway: "Say how sure you are. It lets the right person make the final call.",
    related: [
      { label: "UNSW Research / Confidence Scoring", href: "/research#confidence" },
      { label: "ArmsOA / Operator Approval", href: "/work/armsoa#human-in-the-loop" },
    ],
    tags: ["confidence", "uncertainty", "ml", "research", "ai", "armsoa", "unsw"],
  },
];

export function getDecision(id: string): Decision | undefined {
  return decisions.find((d) => d.id === id);
}
