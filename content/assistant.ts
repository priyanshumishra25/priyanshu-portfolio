/**
 * PAI's curated answers. Each one cites knowledge chunk ids (see
 * lib/assistant/knowledge.ts). Tests fail if a cited id does not exist.
 *
 * Templates are filled from content at runtime so answers cannot drift:
 *   {{period:<experience id>}} or {{period:education}}  e.g. "June 2026 to September 2026"
 *   {{decisions}}       list of decision titles
 *   {{other-projects}}  every project except professional work
 *   {{email}}           contact email
 */

export interface CuratedAnswer {
  id: string;
  /** Shown as a suggested prompt. */
  prompt: string;
  /** Matches when every word in any one group appears in the question. Order of answers matters. */
  match: string[][];
  answer: string;
  sources: string[];
  cta?: { label: string; href: string };
}

export const greeting =
  "Hey. I know everything Priyanshu has chosen to put on this site.\nAsk me something.";

/** How PAI works. Rendered in the assistant panel and on /about, and used as PAI's own knowledge. */
export const paiArchitecture = {
  summary:
    "PAI answers only from this portfolio's published content, and links every factual answer back to the evidence.",
  flow: {
    content: "Structured portfolio content",
    knowledge: "Citable knowledge",
    local: "Local retrieval",
    model: "Claude (optional)",
    answer: "Answer + evidence links",
  },
  points: [
    "Portfolio facts live in structured content files, not inside UI components.",
    "That content becomes citable knowledge: projects, project details, decisions, research and experience, each with a link to where it lives.",
    "Suggested questions have deterministic, grounded answers.",
    "Local retrieval over the same knowledge is always available, so PAI works without any external service.",
    "When configured, a server-side Claude path answers broader questions. It is given the portfolio knowledge, must cite source ids, and any citation that does not exist is discarded.",
    "If the model path fails, times out or hits the rate limit, PAI falls back to local retrieval.",
    "The API key stays on the server and never reaches the browser.",
  ],
};

export const curatedAnswers: CuratedAnswer[] = [
  {
    id: "how-pai",
    prompt: "How do you work?",
    match: [
      ["how", "you", "work"],
      ["how", "pai"],
      ["grounded"],
      ["hallucinat"],
      ["your", "source"],
    ],
    answer:
      "My answers come from structured content on this portfolio. Common questions have fixed, grounded answers, and local retrieval over the same knowledge handles the rest, so I work without any external service.\n\nWhen it is configured, an optional Claude path on the server answers broader questions using only that published knowledge. Every factual answer links back to evidence on the site. If the model path fails, I fall back to local retrieval.",
    sources: ["pai"],
    cta: { label: "How PAI works", href: "/about#how-pai-works" },
  },
  {
    id: "armsoa-current",
    prompt: "Does he currently work at ArmsOA?",
    match: [
      ["currently", "armsoa"],
      ["current", "armsoa"],
      ["still", "armsoa"],
      ["now", "armsoa"],
    ],
    answer: "No. His ArmsOA Software Engineer role ran from {{period:armsoa}}.",
    sources: ["experience:armsoa"],
    cta: { label: "Explore ArmsOA", href: "/work/armsoa" },
  },
  {
    id: "armsoa-when",
    prompt: "When did he work at ArmsOA?",
    match: [
      ["when", "armsoa"],
      ["date", "armsoa"],
      ["long", "armsoa"],
    ],
    answer:
      "{{period:armsoa}}, as a Software Engineer. It followed a UNSW capstone for ArmsOA and the initial client delivery.",
    sources: ["experience:armsoa", "facet:armsoa/domain-learning"],
    cta: { label: "Explore ArmsOA", href: "/work/armsoa" },
  },
  {
    id: "current-role",
    prompt: "What is he doing now?",
    match: [["current"], ["currently"], ["now"], ["these", "days"]],
    answer:
      "Based on this site, his current role is Resident Advisor at Shalom College, UNSW ({{period:resident-advisor}}). That is a leadership role, not a software engineering one.\n\nHis most recent software engineering role was at ArmsOA, {{period:armsoa}}. He studied Computer Science at UNSW from {{period:education}}.",
    sources: ["experience:resident-advisor", "experience:armsoa", "about"],
    cta: { label: "About Priyanshu", href: "/about" },
  },
  {
    id: "armsoa-owned",
    prompt: "What did Priyanshu own at ArmsOA?",
    match: [
      ["own", "armsoa"],
      ["responsib", "armsoa"],
      ["armsoa", "do"],
      ["armsoa", "role"],
    ],
    answer:
      "He owned the AI interface: Claude Opus and Sonnet integration, live-state context, persistent sessions, confidence scoring and the operator approval workflow.\n\nHe also directly built or implemented work across Python and FastAPI services, the OpenAPI and versioned JSON schema contracts, simulation and recovery logic, and React and TypeScript operator workflows, plus observability, JSON and GeoJSON exports and backend regression tests in a 500+ test suite.",
    sources: [
      "facet:armsoa/ai-interface",
      "facet:armsoa/human-in-the-loop",
      "facet:armsoa/backend-services",
      "facet:armsoa/api-contracts",
      "facet:armsoa/recovery-simulation",
    ],
    cta: { label: "Explore ArmsOA", href: "/work/armsoa" },
  },
  {
    id: "armsoa-built",
    prompt: "What did Priyanshu build at ArmsOA?",
    match: [
      ["build", "armsoa"],
      ["built", "armsoa"],
      ["armsoa", "work"],
      ["armsoa", "make"],
    ],
    answer:
      "Across the stack of a real-time network resilience platform:\n\n- The AI interface, which he owned: recovery agents with live-state context, persistent sessions, confidence scoring and operator approval\n- Python and FastAPI services and production APIs\n- The contract layer: OpenAPI plus versioned JSON schemas\n- Simulation and multi-run recovery logic\n- React and TypeScript operator workflows\n- Observability, JSON and GeoJSON exports, and backend regression tests",
    sources: [
      "facet:armsoa/ai-interface",
      "facet:armsoa/backend-services",
      "facet:armsoa/api-contracts",
      "facet:armsoa/recovery-simulation",
      "facet:armsoa/frontend-workflows",
    ],
    cta: { label: "Explore ArmsOA", href: "/work/armsoa" },
  },
  {
    id: "capstone",
    prompt: "How did the capstone become professional work?",
    match: [["capstone"], ["client", "delivery"], ["become", "professional"]],
    answer:
      "It started as a UNSW capstone for ArmsOA. After the initial client delivery, development continued, and he worked on the network resilience platform as a Software Engineer from {{period:armsoa}}. A big part of it was learning an unfamiliar domain fast enough to turn client requirements into working software.",
    sources: ["experience:armsoa", "facet:armsoa/domain-learning"],
    cta: { label: "See the timeline", href: "/about" },
  },
  {
    id: "communication",
    prompt: "What experience does he have communicating with people?",
    match: [
      ["communicat"],
      ["people"],
      ["leadership"],
      ["leader"],
      ["stakeholder"],
      ["soft", "skill"],
      ["non", "technical"],
      ["responsibilit"],
    ],
    answer:
      "A few places on this site:\n\n- Resident Advisor at Shalom College, UNSW ({{period:resident-advisor}}): first point of contact for 130 residents, including on-call duty, welfare checks and confidential incident escalation. A leadership role, not an engineering one.\n- UNSW research: presented findings to technical engineers and to non-technical infrastructure stakeholders.\n- ArmsOA: turned client requirements in an unfamiliar domain into working software.\n- Datathon: presented model trade-offs to Atlassian and Allianz engineers.",
    sources: [
      "experience:resident-advisor",
      "facet:research/ownership",
      "facet:armsoa/domain-learning",
      "facet:insurance-fraud/results",
    ],
    cta: { label: "Other experience", href: "/about#other-experience" },
  },
  {
    id: "shipped",
    prompt: "What has he shipped professionally?",
    match: [["shipped"], ["professional"], ["production"], ["job"], ["employ"], ["experience"]],
    answer:
      "His most recent software engineering role was at ArmsOA ({{period:armsoa}}), where he worked on a real-time network resilience platform. He owned the AI interface and shipped work across production APIs and backend services, multi-run recovery simulation, operator workflows, JSON and GeoJSON exports, and backend regression tests.\n\nBefore that he was an AI Researcher at the UNSW School of Electrical Engineering ({{period:unsw-research}}).",
    sources: [
      "experience:armsoa",
      "facet:armsoa/ai-interface",
      "project:armsoa",
      "experience:unsw-research",
    ],
    cta: { label: "Explore ArmsOA", href: "/work/armsoa" },
  },
  {
    id: "strongest-backend",
    prompt: "Show me his strongest backend work.",
    match: [["backend"], ["server"]],
    answer:
      "Probably ArmsOA. He built Python and FastAPI services and production APIs, wrote the OpenAPI and versioned JSON schema contracts, and implemented the recovery simulation logic for a real-time network resilience platform.\n\nQuant AI is a good second look: a FastAPI service with caching, auth and explicit handling for providers that fail or rate limit.",
    sources: [
      "facet:armsoa/backend-services",
      "facet:armsoa/api-contracts",
      "facet:armsoa/recovery-simulation",
      "facet:quant-ai/degradation",
    ],
    cta: { label: "Explore ArmsOA", href: "/work/armsoa" },
  },
  {
    id: "full-stack",
    prompt: "Can he work across the stack?",
    match: [["full", "stack"], ["fullstack"], ["across", "stack"], ["frontend"], ["end", "end"]],
    answer:
      "Yes. At ArmsOA he worked on React and TypeScript operator workflows, Python and FastAPI services, the contracts between them, simulation logic and the AI interface. The shared-contracts approach is written up as a decision.\n\nQuant AI covers a similar spread on a smaller scale: TypeScript frontend, FastAPI backend, caching, Docker and CI.",
    sources: [
      "facet:armsoa/frontend-workflows",
      "facet:armsoa/backend-services",
      "decision:d03",
      "facet:quant-ai/data-sources",
    ],
    cta: { label: "Explore ArmsOA", href: "/work/armsoa" },
  },
  {
    id: "ai-built",
    prompt: "What has he built with AI?",
    match: [["ai"], ["llm"], ["agent"]],
    answer:
      "A few things, at different layers:\n\n- ArmsOA: he owned the AI interface for recovery agents on Claude Opus and Sonnet, with live-state context, persistent sessions and confidence scoring. Agents recommend, operators approve.\n- Quant AI: the data side of AI systems. Inputs carry provenance, and unavailable sources stay unavailable.\n- UNSW research: a classifier that detects silent DNS downgrades from encrypted traffic, 92% accuracy on real captures.\n- This site: I am PAI, and I only answer from published content.",
    sources: [
      "facet:armsoa/ai-interface",
      "facet:armsoa/human-in-the-loop",
      "facet:quant-ai/provenance",
      "facet:research/classification",
      "pai",
    ],
    cta: { label: "See the ArmsOA AI interface", href: "/work/armsoa#ai-interface" },
  },
  {
    id: "computer-vision",
    prompt: "What computer vision work has he done?",
    match: [["computer", "vision"], ["vision"], ["segment"], ["image"]],
    answer:
      "The Wheat Crop Segmentation Benchmark. It compares four approaches to segmenting wheat in field imagery: SLIC superpixels, a Random Forest on engineered features, a U-Net with a ResNet50 backbone and SegFormer-B0, on segmentation quality, latency and compute. The best result reached 0.91 IoU on held-out test data.",
    sources: [
      "project:wheat-segmentation",
      "facet:wheat-segmentation/approaches",
      "facet:wheat-segmentation/result",
    ],
    cta: { label: "Explore the benchmark", href: "/work/wheat-segmentation" },
  },
  {
    id: "imbalanced",
    prompt: "Has he worked with imbalanced datasets?",
    match: [["imbalanc"], ["fraud"], ["smote"], ["false", "positive"]],
    answer:
      "Yes, in Insurance Claims Fraud Detection for the Atlassian × Allianz Datathon 2024. Fraud labels were imbalanced, so training data was rebalanced with SMOTE and gradient-boosted ensembles were compared. The model was designed with false-positive cost in mind, reached 97% accuracy and finished in the top five.",
    sources: ["facet:insurance-fraud/overview", "facet:insurance-fraud/results"],
    cta: { label: "See the project", href: "/work#insurance-fraud" },
  },
  {
    id: "machine-learning",
    prompt: "What machine learning projects has he built?",
    match: [["machine", "learning"], ["ml"], ["classif"], ["model", "evaluation"]],
    answer:
      "Several:\n\n- Wheat Crop Segmentation: classical CV, a Random Forest, U-Net and SegFormer benchmarked on quality, latency and compute. Best result 0.91 IoU on held-out test data.\n- UNSW research: ML classification of encrypted DNS downgrades, 92% accuracy on real captures.\n- Insurance Claims Fraud Detection: ensemble classification on imbalanced data, 97% accuracy, top five at a datathon.\n- Quant AI: a ridge forecast with chronological holdout validation.",
    sources: [
      "project:wheat-segmentation",
      "facet:research/classification",
      "facet:insurance-fraud/overview",
      "facet:quant-ai/forecasting",
    ],
    cta: { label: "See all work", href: "/work" },
  },
  {
    id: "systems",
    prompt: "Does he have systems programming experience?",
    match: [["systems", "programming"], ["low", "level"], ["posix"], ["fuzz"]],
    answer:
      "Yes. The clearest example is Midpoint Fuzzer, a multithreaded black-box fuzzer in C++17. It runs every input in an isolated child via fork/exec, kills hung executions with poll-based timeouts, limits child memory, classifies failures from waitpid status and saves each distinct crashing input once using SHA-256. It also has an AddressSanitizer build.",
    sources: [
      "facet:midpoint-fuzzer/process-isolation",
      "facet:midpoint-fuzzer/crash-classification",
      "facet:midpoint-fuzzer/concurrency",
      "decision:d05",
    ],
    cta: { label: "Explore Midpoint Fuzzer", href: "/work/midpoint-fuzzer" },
  },
  {
    id: "distributed",
    prompt: "What has he done with distributed systems?",
    match: [["distributed"], ["stream"], ["partition"], ["queue"], ["event"], ["peer"], ["p2p"]],
    answer:
      "Tributary is the clearest example: an event streaming system in Java with partitions, Manual or Random producer allocation, consumer groups with Range or RoundRobin rebalancing, and offset replay.\n\nBitTrickle is the networking side: peer-to-peer file sharing in Python over UDP and TCP, with server-assisted peer discovery and heartbeats.",
    sources: [
      "facet:tributary/partitioning",
      "facet:tributary/consumer-groups",
      "facet:bittrickle/overview",
    ],
    cta: { label: "Explore Tributary", href: "/work/tributary" },
  },
  {
    id: "decisions",
    prompt: "What engineering decisions has he made?",
    match: [["decision"], ["trade", "off"], ["tradeoff"], ["why", "design"]],
    answer: "He has written up six, each short enough to read in a minute or two:\n\n{{decisions}}",
    sources: [
      "decision:d01",
      "decision:d02",
      "decision:d03",
      "decision:d04",
      "decision:d05",
      "decision:d06",
    ],
    cta: { label: "Read the decisions", href: "/decisions" },
  },
  {
    id: "other-projects",
    prompt: "What other projects has he built?",
    match: [
      ["other", "project"],
      ["side", "project"],
      ["more", "project"],
      ["outside"],
      ["personal"],
      ["workbench"],
    ],
    answer: "Beyond ArmsOA, the site shows:\n\n{{other-projects}}",
    sources: [
      "project:midpoint-fuzzer",
      "project:quant-ai",
      "project:wheat-segmentation",
      "project:tributary",
      "project:insurance-fraud",
      "project:bittrickle",
    ],
    cta: { label: "See all work", href: "/work" },
  },
  {
    id: "research",
    prompt: "Tell me about his research.",
    match: [["research"], ["dns"]],
    answer:
      "He was an AI Researcher at the UNSW School of Electrical Engineering ({{period:unsw-research}}), asking whether encrypted network traffic can reveal when DNS security silently downgrades to plaintext.\n\nHe built a pipeline over real pcapng captures with Python, Scapy, Selenium and a Firefox WebExtension, engineered features, trained a classifier that reached 92% accuracy on real captures, and reported correlations with confidence scores. He owned it end to end, from scoping to presenting.",
    sources: [
      "research",
      "facet:research/pipeline",
      "facet:research/classification",
      "facet:research/confidence",
    ],
    cta: { label: "Open the research", href: "/research" },
  },
  {
    id: "went-wrong",
    prompt: "What went wrong in one of his projects?",
    match: [["wrong"], ["fail"], ["mistake"], ["broke"], ["bug"], ["debug"]],
    answer:
      "The site does not describe a specific incident or postmortem, so I will not invent one. What it does show is how projects were designed around failure:\n\n- ArmsOA: a temporary recovery path could hide a real outage, so physical failure state is kept separate from restored state.\n- Quant AI: data providers rate limit, so missing sources are reported as missing rather than filled in.\n- Midpoint Fuzzer: targets crash, hang and eat memory, so every execution is isolated, time-limited and memory-capped.",
    sources: ["decision:d02", "decision:d04", "decision:d05"],
    cta: { label: "Read the decisions", href: "/decisions" },
  },
  {
    id: "contact",
    prompt: "How do I get in touch?",
    match: [["contact"], ["email"], ["hire"], ["reach"], ["touch"]],
    answer:
      "Email is quickest: {{email}}. GitHub and LinkedIn are linked in the contact section too.",
    sources: ["contact"],
    cta: { label: "Say hello", href: "/about#contact" },
  },
  {
    id: "education",
    prompt: "Where did he study?",
    match: [["study"], ["degree"], ["education"], ["university"], ["unsw"], ["graduat"]],
    answer:
      "UNSW, a Bachelor of Science in Computer Science with Distinction ({{period:education}}). He was also an AI Researcher at the UNSW School of Electrical Engineering.",
    sources: ["about", "research"],
    cta: { label: "About Priyanshu", href: "/about" },
  },
];

/** Prompts shown as chips, in order. */
export const suggestedPromptIds = [
  "armsoa-owned",
  "shipped",
  "strongest-backend",
  "full-stack",
  "ai-built",
  "systems",
  "computer-vision",
  "other-projects",
  "decisions",
  "communication",
  "research",
  "capstone",
  "went-wrong",
  "how-pai",
];

export interface InterestingPick {
  intro: string;
  why: string;
  sources: string[];
  cta: { label: string; href: string };
}

export const interestingPicks: InterestingPick[] = [
  {
    intro: "You might like the Midpoint Fuzzer.",
    why: "It executes unknown programs in isolated child processes, kills hung executions, classifies failures by signal and saves each distinct crashing input once. There is a small simulation on the page you can run.",
    sources: ["project:midpoint-fuzzer", "decision:d05"],
    cta: { label: "Explore project", href: "/work/midpoint-fuzzer" },
  },
  {
    intro: "Try Decision 02.",
    why: "It is about why a temporary network workaround should never overwrite the record of what actually failed. A small data model choice that keeps an operator UI honest.",
    sources: ["decision:d02", "facet:armsoa/recovery-simulation"],
    cta: { label: "Read it", href: "/decisions#failure-vs-restored" },
  },
  {
    intro: "Have a look at the wheat segmentation benchmark.",
    why: "Instead of assuming the newest model wins, it puts superpixels, a Random Forest, a CNN and a transformer side by side on quality, latency and compute.",
    sources: ["project:wheat-segmentation", "facet:wheat-segmentation/evaluation"],
    cta: { label: "Explore project", href: "/work/wheat-segmentation" },
  },
  {
    intro: "Have a look at how Quant AI handles failing data sources.",
    why: "When a provider is rate limited, the system says so instead of inventing data. It is a reliability story more than a finance one.",
    sources: ["facet:quant-ai/degradation", "decision:d04"],
    cta: { label: "Explore project", href: "/work/quant-ai" },
  },
  {
    intro: "The UNSW research is worth a look.",
    why: "It detects when encrypted DNS silently falls back to plaintext, using network captures, and reports confidence rather than pretending to be certain.",
    sources: ["research", "facet:research/confidence"],
    cta: { label: "Open the research", href: "/research" },
  },
  {
    intro: "Break the network on the ArmsOA page.",
    why: "The demo lets you fail links, see an AI-style recommendation and approve the recovery yourself. It mirrors the real rule: agents recommend, operators approve.",
    sources: ["facet:armsoa/human-in-the-loop", "decision:d01"],
    cta: { label: "Try it", href: "/work/armsoa#demo" },
  },
];
