import { getExperience } from "./experience";
import type { FeaturedProject, Project, WorkbenchProject } from "./types";

/**
 * Every project on the site. Order is editorial, not chronological.
 * Adding an entry here feeds the Work page, project pages, the resume,
 * the sitemap and PAI. Repository URLs are copied exactly from GitHub,
 * never guessed.
 */
export const projects: Project[] = [
  {
    slug: "armsoa",
    title: "ArmsOA Network Resilience Platform",
    shortTitle: "ArmsOA",
    question: "What happens when the network starts failing?",
    context: "professional",
    featured: true,
    interactive: true,
    role: "Software Engineer at ArmsOA",
    period: getExperience("armsoa").period,
    categories: ["Full Stack", "Backend", "AI"],
    sourceNote: "Client work · source private",
    demoNote: "Interactive demo uses illustrative data and does not reproduce client data.",
    oneLiner:
      "A real-time platform that simulates communications networks under failure and helps operators recover them. Agents recommend, operators approve.",
    stack: [
      "Python",
      "FastAPI",
      "React",
      "TypeScript",
      "Docker",
      "OpenAPI",
      "JSON Schema",
      "Claude Opus / Sonnet",
    ],
    problem: [
      "Resilient communications networks mix very different links: 4G/5G, microwave, SATCOM and UHF/VHF. Each one fails differently, and environmental stress can take several down at once.",
      "Operators need to see what is failing, understand what that does to the rest of the network, and choose a recovery path quickly. Getting that wrong is expensive, so the software has to be honest about what it knows.",
      "I came in without a background in tactical communications. Part of the job was learning the domain fast enough to turn client requirements into software that behaved the way operators expected.",
    ],
    owned: [
      "Owned the AI interface: Claude Opus and Sonnet integration, live-state context injection, persistent AI sessions, confidence scoring and the operator approval workflow",
      "Built Python and FastAPI backend services and production APIs",
      "Wrote the contract layer: an OpenAPI specification and versioned JSON schemas shared by the frontend, backend and AI interfaces",
      "Implemented real-time simulation and multi-run recovery logic",
      "Built operator-facing workflows in React and TypeScript",
      "Added observability and JSON and GeoJSON exports, and wrote backend regression tests in a suite of 500+",
    ],
    architecture: {
      intro:
        "Four layers that talk through explicit, versioned contracts rather than undocumented payload shapes.",
      layers: [
        {
          name: "Operator UI",
          detail:
            "React and TypeScript workflows for watching network state, reviewing recommendations and approving or rejecting recovery actions.",
        },
        {
          name: "API contract",
          detail:
            "OpenAPI plus versioned JSON schemas used by the frontend, backend and AI interfaces. Mock capability is labelled as mock.",
        },
        {
          name: "Services and simulation",
          detail:
            "FastAPI services for network state, failure injection, multi-run recovery simulation, exports and observability.",
        },
        {
          name: "AI interface",
          detail:
            "Claude-backed agents receive live network state as context, keep persistent sessions, score their confidence and return recommendations. They never execute actions directly.",
        },
      ],
    },
    decisionIds: ["d01", "d02", "d03", "d06"],
    interesting: [
      {
        title: "Agents recommend. Operators approve.",
        body: "Recovery agents produce recommendations with a confidence score. An operator approves or rejects each one. No recovery action runs solely because a model recommended it.",
      },
      {
        title: "Failure state is not overwritten by recovery",
        body: "Physical failure state is stored separately from temporary restored state. A workaround can restore service, but the system never presents it as if the original failure had gone away.",
      },
      {
        title: "Shared contracts across the stack",
        body: "The frontend, backend and AI interfaces depend on the same structures, so they share an OpenAPI specification and versioned JSON schemas. Breaking changes are visible, and mock endpoints say they are mock.",
      },
    ],
    failureModes: [
      {
        failure: "An agent recommends something based on an outdated view of the network.",
        response:
          "Live-state context injection gives the agent current network state when it reasons, rather than whatever it saw earlier in the session.",
      },
      {
        failure: "A recommendation sounds confident but is wrong.",
        response:
          "Every recommendation carries a confidence score and goes through operator approval. The model's tone is never the authority.",
      },
      {
        failure: "A temporary recovery path hides a real outage.",
        response:
          "Restored state lives alongside physical failure state instead of replacing it, so the underlying fault stays visible until it is actually fixed.",
      },
      {
        failure: "Frontend, backend and AI interfaces drift apart on payload shape.",
        response:
          "Versioned JSON schemas and an OpenAPI contract make breaking changes explicit instead of discovered in production.",
      },
      {
        failure: "A mocked capability is mistaken for a real one.",
        response: "Mock endpoints are explicitly labelled as mock in the contract.",
      },
      {
        failure: "Simulation logic changes quietly break existing behaviour.",
        response:
          "Backend regression tests, in a suite of 500+, check changes against what already worked.",
      },
    ],
    shipped: [
      "The AI interface: recommendation agents with live-state context, persistent sessions, confidence scoring and operator approval",
      "Production APIs and backend services for a real-time network resilience platform",
      "Multi-run recovery simulation across 4G/5G, microwave, SATCOM and UHF/VHF links",
      "Operator workflows for reviewing state and approving recovery",
      "JSON and GeoJSON exports and observability",
      "Backend regression tests in a suite of 500+",
    ],
    learned: [
      "Learning an unfamiliar domain quickly is mostly about asking precise questions and then encoding the answers in tests, schemas and names, so the knowledge does not live only in my head.",
      "With AI in the loop, the most important design work is deciding who has authority. The model can be very useful without being allowed to act alone.",
      "Being honest in the data model, for example keeping failure and recovery separate, saves the UI from having to lie later.",
    ],
    facets: [
      {
        id: "ai-interface",
        label: "AI Interface",
        summary:
          "Owned the AI interface: Claude Opus and Sonnet recovery agents with live-state context injection, persistent sessions and confidence scoring, plus AI-assisted tactical analytics.",
        tags: ["ai", "llm", "claude", "agents", "analytics", "context", "ownership"],
      },
      {
        id: "human-in-the-loop",
        label: "Operator Approval",
        summary:
          "Built the approval workflow around a strict boundary: agents recommend, operators approve. No recovery action runs solely because a model recommended it.",
        tags: ["ai", "human-in-the-loop", "approval", "confidence", "safety", "agents"],
      },
      {
        id: "backend-services",
        label: "Backend Services",
        summary: "Built Python and FastAPI backend services and production APIs.",
        tags: ["backend", "python", "fastapi", "api", "services", "production"],
      },
      {
        id: "api-contracts",
        label: "API Contracts",
        summary:
          "Wrote the contract layer: an OpenAPI specification and versioned JSON schemas shared by the frontend, backend and AI interfaces, with mock capability labelled as mock.",
        tags: ["api", "openapi", "json schema", "contracts", "versioning", "backend"],
      },
      {
        id: "recovery-simulation",
        label: "Recovery Simulation",
        summary:
          "Implemented real-time simulation and multi-run recovery logic across 4G/5G, microwave, SATCOM and UHF/VHF links.",
        tags: ["simulation", "network", "resilience", "recovery", "backend", "systems"],
      },
      {
        id: "frontend-workflows",
        label: "Operator Frontend",
        summary:
          "Built operator-facing workflows in React and TypeScript for monitoring state and approving recovery.",
        tags: ["frontend", "react", "typescript", "full-stack", "ux"],
      },
      {
        id: "observability",
        label: "Observability and Exports",
        summary: "Added observability plus JSON and GeoJSON exports.",
        tags: ["observability", "reliability", "geojson", "exports", "backend"],
      },
      {
        id: "testing",
        label: "Regression Testing",
        summary: "Wrote backend regression tests in a suite of 500+.",
        tags: ["testing", "regression", "reliability", "quality"],
      },
      {
        id: "domain-learning",
        label: "From Capstone to Client Work",
        summary:
          "Started as a UNSW capstone for ArmsOA. After the initial delivery, development continued and he worked on it as a Software Engineer, learning resilient communications fast enough to turn client requirements into working software.",
        tags: ["learning", "client", "domain", "ownership", "forward deployed", "capstone"],
      },
    ],
    tags: [
      "professional",
      "backend",
      "full-stack",
      "ai",
      "api",
      "simulation",
      "network",
      "reliability",
      "shipped",
    ],
  },
  {
    slug: "midpoint-fuzzer",
    title: "Midpoint Fuzzer",
    shortTitle: "Midpoint Fuzzer",
    question: "Can I make an unknown program crash?",
    context: "project",
    featured: true,
    interactive: true,
    categories: ["Systems", "Developer Tooling"],
    repoUrl: "https://github.com/priyanshumishra25/Midpoint-Fuzzer",
    oneLiner:
      "A multithreaded, format-aware black-box fuzzer in C++17 that runs unknown programs in isolated child processes, classifies how they fail and saves each distinct crashing input once.",
    stack: ["C++17", "POSIX", "AddressSanitizer", "UBSan"],
    problem: [
      "You have a binary that reads stdin and no source. Somewhere there is an input that makes it fall over, and you want to find it automatically within a time budget.",
      "The hard part is not generating random bytes. It is surviving the program you are testing: it can crash, hang forever, eat memory, or fail the same way over and over.",
    ],
    owned: [
      "The fork/exec execution harness with pipes, poll-based timeouts and per-child memory limits",
      "Byte, CSV-aware, recursive JSON AST and splice (cross-over) mutators",
      "A weighted seed corpus shared by a pool of worker threads, plus a stats thread",
      "Crash classification from waitpid status, exit codes, timeouts and sanitizer output, with SHA-256 deduplication of crashing inputs",
    ],
    architecture: {
      intro:
        "A pool of worker threads, each driving its own child process through a fork/exec harness.",
      layers: [
        {
          name: "Corpus",
          detail: "Seeds load into a weighted queue. New crashing inputs are added back to it.",
        },
        {
          name: "Mutation engines",
          detail:
            "Byte-level mutation, CSV-aware field mutation, recursive JSON AST mutation that falls back to bytes on parse failure, and splice cross-over between corpus entries.",
        },
        {
          name: "Execution harness",
          detail:
            "fork/exec per input with a pipe for stdin, poll-based timeouts that kill hung children, and a per-child memory limit.",
        },
        {
          name: "Crash triage",
          detail:
            "waitpid status macros give the exact signal. Non-zero exits, timeouts and sanitizer keywords in stderr are classified too. Each crashing input is hashed with SHA-256 and saved once with a JSON record.",
        },
      ],
    },
    decisionIds: ["d05"],
    interesting: [
      {
        title: "Structure-aware beats random",
        body: "Random bytes rarely get past a JSON parser. Mutating a parsed AST keeps inputs valid enough to reach the code behind the parser, and falls back to byte mutation when parsing fails.",
      },
      {
        title: "A hang is a result, not a stall",
        body: "poll-based timeouts mean a target that never returns gets killed and recorded as a timeout, instead of quietly taking a worker thread out of the pool.",
      },
      {
        title: "Signals, not error messages",
        body: "Classification uses waitpid status rather than parsing output text, so SIGSEGV, SIGABRT and SIGFPE are exact. Sanitizer keywords in stderr still count as crashes even on exit 0.",
      },
    ],
    failureModes: [
      {
        failure: "The target crashes.",
        response:
          "That is the point. The parent reads the exact signal, records it and saves the input if it has not been seen before.",
      },
      {
        failure: "The target hangs forever.",
        response: "poll-based timeouts kill the child and record a TIMEOUT.",
      },
      {
        failure: "The target allocates until the machine suffers.",
        response: "Each child runs under a memory limit.",
      },
      {
        failure: "The same crashing input is generated again.",
        response: "Inputs are hashed with SHA-256, so an identical crashing input is stored once.",
      },
      {
        failure: "A memory bug corrupts state without crashing.",
        response:
          "An AddressSanitizer build target and sanitizer-aware classification turn silent corruption into a visible failure.",
      },
    ],
    shipped: [
      "A multithreaded black-box fuzzer with byte, CSV, JSON AST and splice mutators",
      "Process isolation, timeouts and memory limits for every execution",
      "Signal-level crash classification and SHA-256 deduplication of crashing inputs",
    ],
    learned: [
      "Most of systems programming is designing for the failure you did not expect. The harness spends more code handling bad outcomes than good ones.",
      "Concurrency bugs and target bugs look similar from the outside. Isolating every execution made it much easier to tell them apart.",
    ],
    facets: [
      {
        id: "process-isolation",
        label: "Process Isolation",
        summary:
          "Runs every input in a fresh child via fork/exec, with a per-child memory limit and poll-based timeouts.",
        tags: ["systems", "posix", "fork", "exec", "isolation", "process", "reliability"],
      },
      {
        id: "crash-classification",
        label: "Crash Classification",
        summary:
          "Classifies failures from waitpid status (SIGSEGV, SIGABRT, SIGFPE and others), non-zero exits, timeouts and sanitizer keywords in stderr.",
        tags: ["debugging", "signals", "sigsegv", "asan", "ubsan", "systems", "c++"],
      },
      {
        id: "deduplication",
        label: "Input Deduplication",
        summary:
          "Hashes each crashing input with SHA-256 and saves it once, with a JSON record of signal, exit code, input size and a stderr excerpt.",
        tags: ["deduplication", "sha-256", "hashing", "debugging"],
      },
      {
        id: "mutation",
        label: "Format-aware Mutation",
        summary:
          "Mutates inputs with byte-level, CSV-aware, recursive JSON AST and splice cross-over strategies.",
        tags: ["mutation", "json", "csv", "fuzzing", "parsing"],
      },
      {
        id: "concurrency",
        label: "Concurrency",
        summary:
          "Runs a pool of worker threads over a shared weighted corpus, each driving its own isolated target process.",
        tags: ["concurrency", "threads", "multithreaded", "c++", "systems"],
      },
    ],
    tags: [
      "systems",
      "c++",
      "debugging",
      "security",
      "concurrency",
      "low-level",
      "posix",
      "developer tooling",
    ],
  },
  {
    slug: "quant-ai",
    title: "Quant AI Live Intelligence",
    shortTitle: "Quant AI",
    question: "What happens when an AI system depends on data sources that fail?",
    context: "personal",
    featured: true,
    interactive: true,
    categories: ["Full Stack", "Backend", "AI", "Machine Learning"],
    repoUrl: "https://github.com/priyanshumishra25/quant-ai-live-intelligence",
    oneLiner:
      "Turns a company name into an auditable, experimental market forecast from price history, news and Reddit, keeps provenance on every input, and says plainly when a source is unavailable.",
    stack: ["Python", "FastAPI", "TypeScript", "Redis", "Docker"],
    problem: [
      "An AI system that summarises market context is only as good as the data it is given. Data providers rate limit, time out and change shape.",
      "The tempting fix is to quietly fill gaps with something plausible. That produces output that looks complete and is partly made up. I wanted the opposite: degrade visibly and keep the provenance.",
      "It is experimental research software, not investment advice. The interesting part is the engineering around the model.",
    ],
    owned: [
      "Provider adapters with explicit degradation and rate-limit handling",
      "A FastAPI backend with auth, caching (Redis, or in-memory locally) and a Docker setup",
      "An on-demand ridge model on price and news features with chronological holdout validation",
      "A strict TypeScript frontend that shows evidence, provenance and degraded sources",
      "CI and tests that run on fixtures, without live API keys",
    ],
    architecture: {
      intro:
        "A company name goes in. Each source is fetched independently and reported independently.",
      layers: [
        {
          name: "Input",
          detail: "A company name or ticker, resolved to a symbol.",
        },
        {
          name: "Source adapters",
          detail:
            "Documented APIs for price history and market news, and authenticated Reddit Data API access. Each adapter returns data or an explicit failure such as a rate limit.",
        },
        {
          name: "Model",
          detail:
            "A ridge model on price and news features, validated on a chronological holdout. Reddit only adds a small, bounded overlay at inference time and never enters fitted weights.",
        },
        {
          name: "Assembly",
          detail:
            "Forecast, interval, contributions and source-attributed evidence, with missing sources reported as missing rather than replaced with fabricated data.",
        },
      ],
    },
    decisionIds: ["d04"],
    interesting: [
      {
        title: "Unavailable data remains unavailable",
        body: "If a provider is rate limited, the response says so. There is no fallback that invents a number to keep the page looking full.",
      },
      {
        title: "Reddit never trains the model",
        body: "Reddit content is used only at inference time as a small, bounded overlay. It does not enter the training matrix or fitted coefficients.",
      },
      {
        title: "Tests that do not need secrets",
        body: "A deterministic fixture path runs without live API keys, so CI is reproducible and does not spend provider quota.",
      },
    ],
    failureModes: [
      {
        failure: "A provider rate limits the request.",
        response:
          "The API reports an explicit rate-limit degradation. Cached and offline results stay usable, with the gap visible.",
      },
      {
        failure: "The same company is requested repeatedly.",
        response: "Responses are cached, so provider quota is not spent on identical calls.",
      },
      {
        failure: "A model looks good on data it has already seen.",
        response: "Validation uses a chronological holdout rather than random splits.",
      },
      {
        failure: "CI depends on a third-party API being up.",
        response:
          "Tests use fixtures and mocked responses, so a provider outage cannot break the build.",
      },
    ],
    shipped: [
      "A FastAPI service with adapters for price history, news and Reddit",
      "Explicit provider degradation and rate-limit handling",
      "A ridge forecast with chronological validation and source attribution",
      "Caching, Docker, CI and tests that run without live API keys",
    ],
    learned: [
      "Reliability in AI products is often a data problem before it is a model problem.",
      "Making degradation explicit is more work up front and much less work later, because nobody has to reverse-engineer which numbers were real.",
    ],
    facets: [
      {
        id: "provenance",
        label: "Provenance",
        summary:
          "Attaches source attribution and provenance to returned evidence and model inputs.",
        tags: ["provenance", "data", "validation", "trust", "ai"],
      },
      {
        id: "degradation",
        label: "Explicit Degradation",
        summary:
          "Reports provider failures and rate limits explicitly and never fabricates fallback data.",
        tags: ["reliability", "degradation", "rate limit", "error handling", "ai", "missing data"],
      },
      {
        id: "forecasting",
        label: "Forecasting Model",
        summary:
          "Fits a ridge model on price and news features with chronological holdout validation, and reports a forecast with an interval. Experimental, not investment advice.",
        tags: [
          "ml",
          "machine learning",
          "model",
          "ridge",
          "validation",
          "model evaluation",
          "forecast",
        ],
      },
      {
        id: "caching",
        label: "Caching",
        summary:
          "Caches provider results and responses in Redis, with an in-memory fallback locally.",
        tags: ["redis", "caching", "backend", "performance"],
      },
      {
        id: "testing",
        label: "Testing without Keys",
        summary: "Runs CI and tests on fixtures and mocked responses, without live API keys.",
        tags: ["testing", "ci", "reliability", "quality"],
      },
      {
        id: "data-sources",
        label: "Data Sources",
        summary:
          "Combines market price history, market news and Reddit through documented APIs in a Python and FastAPI backend with a TypeScript frontend.",
        tags: ["python", "fastapi", "typescript", "api", "data", "backend", "full-stack"],
      },
    ],
    tags: [
      "ai",
      "backend",
      "full-stack",
      "reliability",
      "data",
      "api",
      "redis",
      "machine learning",
    ],
  },
  {
    slug: "wheat-segmentation",
    title: "Wheat Crop Segmentation Benchmark",
    shortTitle: "Wheat Segmentation",
    question: "How much model do you actually need to segment a field?",
    context: "project",
    featured: true,
    interactive: true,
    categories: ["Machine Learning", "Computer Vision"],
    demoNote:
      "Nothing here runs the original models. The overlays show how each approach works, not how well it scored.",
    oneLiner:
      "A benchmark of four ways to segment wheat in field imagery, from classical superpixels to a transformer, compared on segmentation quality, latency and compute.",
    stack: ["Python", "PyTorch", "OpenCV", "scikit-learn"],
    metrics: [{ value: "0.91", label: "IoU on held-out test data, best result in the benchmark" }],
    problem: [
      "Crop segmentation sounds like one problem, but different approaches trade accuracy, latency and compute very differently.",
      "It is easy to assume the newest architecture wins. The useful question is which approach gives the best practical trade-off, so the project benchmarks four families instead of picking one.",
    ],
    owned: [
      "A SLIC superpixel approach",
      "A Random Forest on engineered features",
      "A U-Net with a ResNet50 backbone and a SegFormer-B0, in PyTorch",
      "An evaluation comparing segmentation accuracy, IoU, latency and compute cost on held-out test data",
    ],
    architecture: {
      heading: "Approaches",
      style: "steps",
      intro: "Four approach families, one set of evaluation questions.",
      layers: [
        { name: "SLIC", detail: "Traditional superpixel segmentation." },
        { name: "Random Forest", detail: "Classical supervised ML using engineered features." },
        { name: "U-Net / ResNet50", detail: "CNN-based semantic segmentation." },
        { name: "SegFormer-B0", detail: "Transformer-based semantic segmentation." },
        { name: "Evaluation", detail: "Segmentation accuracy, IoU, latency and compute cost." },
      ],
    },
    decisionIds: [],
    interesting: [
      {
        title: "The newest model is a hypothesis",
        body: "Comparing classical computer vision, classical ML, a CNN and a transformer on the same questions makes the trade-off visible instead of assumed.",
      },
      {
        title: "Speed and cost are part of the result",
        body: "A segmentation that is slightly better but much slower or heavier can be the wrong choice, so latency and compute were measured alongside IoU.",
      },
    ],
    failureModes: [
      {
        failure: "A model looks good on images it has already seen.",
        response: "Results are reported on held-out test data.",
      },
      {
        failure: "The newest architecture gets picked by default.",
        response:
          "Four approach families are evaluated on quality, latency and compute before choosing.",
      },
    ],
    shipped: [
      "A benchmark of SLIC, Random Forest, U-Net (ResNet50) and SegFormer-B0",
      "Evaluation across segmentation accuracy, IoU, latency and compute cost",
      "Best result: 0.91 IoU on held-out test data",
    ],
    learned: [
      "Benchmarking beats assuming. The newest model is where the question starts, not where it ends.",
      "Classical computer vision, classical ML, CNNs and transformers each earn their place under different constraints.",
      "Model evaluation is pipeline design: what you measure decides what you end up choosing.",
    ],
    facets: [
      {
        id: "approaches",
        label: "Approaches",
        summary:
          "Compares SLIC superpixels, a Random Forest on engineered features, a U-Net with a ResNet50 backbone and SegFormer-B0.",
        tags: [
          "computer vision",
          "segmentation",
          "pytorch",
          "opencv",
          "cnn",
          "transformer",
          "unet",
          "segformer",
          "slic",
          "random forest",
        ],
      },
      {
        id: "evaluation",
        label: "Evaluation",
        summary:
          "Evaluates segmentation accuracy, IoU, latency and compute cost on held-out test data.",
        tags: ["model evaluation", "benchmark", "iou", "latency", "compute", "machine learning"],
      },
      {
        id: "result",
        label: "Result",
        summary: "The best result in the benchmark reached 0.91 IoU on held-out test data.",
        tags: ["result", "iou", "metric", "computer vision"],
      },
    ],
    tags: [
      "computer vision",
      "machine learning",
      "ml",
      "pytorch",
      "benchmark",
      "segmentation",
      "model evaluation",
    ],
  },
  {
    slug: "tributary",
    title: "Tributary",
    shortTitle: "Tributary",
    question: "Where does a message go when thousands arrive?",
    context: "project",
    featured: true,
    interactive: true,
    categories: ["Backend", "Distributed Systems"],
    repoUrl: "https://github.com/priyanshumishra25/TributaryAPI",
    oneLiner:
      "A lightweight event streaming system in Java with typed topics, partitions, consumer groups, rebalancing strategies and offset replay.",
    stack: ["Java", "Concurrency (ExecutorService)", "Event-driven architecture"],
    problem: [
      "When many producers publish at once, you need rules for where each message lands, who reads it, what happens when consumers join or leave, and how to read history again.",
      "Tributary answers those questions in a system small enough to reason about end to end.",
    ],
    owned: [
      "A core model of topics, partitions, producers, consumers and consumer groups",
      "Manual and Random partition allocation for producers",
      "Range and RoundRobin rebalancing for consumer groups",
      "Offset-based replay, thread-safe partitions and an interactive CLI",
    ],
    architecture: {
      intro:
        "Three layers: a core model, a public API over it, and a CLI for driving it end to end.",
      layers: [
        {
          name: "CLI",
          detail:
            "An interactive command line for creating topics, producing, consuming and replaying events.",
        },
        {
          name: "API",
          detail: "A typed Java API for cluster operations, kept separate from the internals.",
        },
        {
          name: "Core",
          detail:
            "Topics, partitions with offset tracking, producers, consumers and consumer groups. Partitions synchronise appends and reads for concurrent use.",
        },
      ],
    },
    decisionIds: [],
    interesting: [
      {
        title: "Rebalancing is a strategy, not a constant",
        body: "Consumer groups can use Range or RoundRobin assignment and rebalance when membership or strategy changes.",
      },
      {
        title: "Logs, not queues",
        body: "Messages stay in the partition with an offset, so a consumer can replay from any point instead of losing what it has read.",
      },
    ],
    failureModes: [
      {
        failure: "One consumer cannot keep up.",
        response: "Add consumers to the group and the partitions are rebalanced across them.",
      },
      {
        failure: "A consumer needs to reprocess history.",
        response: "Replay from an earlier offset. Messages are not removed when read.",
      },
      {
        failure: "Producers and consumers touch a partition at the same time.",
        response: "Partition appends and reads are synchronised.",
      },
    ],
    shipped: [
      "A Java event streaming core with partitions, producers and consumer groups",
      "Range and RoundRobin rebalancing and offset replay",
      "A typed API and an interactive CLI",
    ],
    learned: [
      "Distributed systems vocabulary such as partitions, groups, offsets and rebalancing made much more sense once I had to implement them.",
    ],
    facets: [
      {
        id: "partitioning",
        label: "Partitions and Allocation",
        summary:
          "Producers place messages on partitions by Manual or Random allocation, and each partition tracks offsets.",
        tags: ["distributed", "partitioning", "streaming", "events", "java"],
      },
      {
        id: "consumer-groups",
        label: "Consumer Groups",
        summary: "Consumer groups share partitions using Range or RoundRobin rebalancing.",
        tags: ["distributed", "consumer groups", "rebalancing", "streaming", "scaling"],
      },
      {
        id: "replay",
        label: "Offset Replay",
        summary: "Consumers can replay messages from any offset.",
        tags: ["replay", "offset", "streaming", "events"],
      },
      {
        id: "api-design",
        label: "API and CLI",
        summary: "Separates a core model, a typed Java API and an interactive CLI.",
        tags: ["api", "java", "backend", "design", "oop", "cli"],
      },
      {
        id: "concurrency",
        label: "Concurrency",
        summary:
          "Supports parallel production and consumption with ExecutorService and synchronised partitions.",
        tags: ["concurrency", "threads", "java"],
      },
    ],
    tags: ["distributed", "java", "backend", "events", "streaming", "concurrency"],
  },
  {
    slug: "insurance-fraud",
    title: "Insurance Claims Fraud Detection",
    shortTitle: "Fraud Detection",
    question: "Accuracy is not enough when a false positive affects a real customer.",
    context: "project",
    featured: false,
    interactive: false,
    event: "Atlassian × Allianz Datathon 2024",
    categories: ["Machine Learning"],
    repoUrl: "https://github.com/priyanshumishra25/AtlassianDatathon2024",
    oneLiner:
      "Ensemble classification for insurance claims fraud, built for the Atlassian × Allianz Datathon 2024.",
    stack: ["Python", "scikit-learn", "XGBoost", "LightGBM", "SMOTE"],
    metrics: [
      { value: "97%", label: "accuracy" },
      { value: "Top 5", label: "Atlassian × Allianz Datathon" },
    ],
    details: [
      "Fraud labels are imbalanced, so training data was rebalanced with SMOTE. Gradient-boosted ensembles (scikit-learn GradientBoosting, XGBoost and LightGBM) were compared, then GradientBoosting was tuned with grid search on AUC-ROC.",
      "Designed with false-positive cost in mind: wrongly flagging a genuine customer has a real cost, so that trade-off was part of the design rather than an afterthought.",
      "Presented the rationale and risk trade-offs to Atlassian and Allianz engineers.",
    ],
    facets: [
      {
        id: "overview",
        label: "Overview",
        summary:
          "Ensemble fraud classification on an imbalanced claims dataset, with SMOTE rebalancing and a comparison of GradientBoosting, XGBoost and LightGBM.",
        tags: [
          "machine learning",
          "ml",
          "imbalanced",
          "classification",
          "ensemble",
          "scikit-learn",
          "fraud",
        ],
      },
      {
        id: "results",
        label: "Results",
        summary:
          "97% accuracy and a top five finish at the Atlassian × Allianz Datathon 2024, with the false-positive trade-off presented to Atlassian and Allianz engineers.",
        tags: ["result", "datathon", "communication", "false positive", "presentation"],
      },
    ],
    tags: ["machine learning", "imbalanced data", "classification", "datathon"],
  },
  {
    slug: "bittrickle",
    title: "BitTrickle",
    shortTitle: "BitTrickle",
    question: "How do peers find each other's files without a central file store?",
    context: "project",
    featured: false,
    interactive: false,
    categories: ["Networking", "Distributed Systems"],
    repoUrl: "https://github.com/priyanshumishra25/BitTrickle-A-Peer-to-Peer-File-Sharing-System",
    oneLiner:
      "A peer-to-peer file sharing system in Python with authenticated users, server-assisted peer discovery and heartbeat-based presence over UDP and TCP.",
    stack: ["Python", "Sockets", "UDP", "TCP", "Multithreading"],
    details: [
      "Authenticated peers publish, search for and download files from each other. A server tracks who is online and which peer has which file, but the files move directly between peers.",
      "A heartbeat mechanism keeps presence accurate and disconnects inactive users automatically.",
    ],
    facets: [
      {
        id: "overview",
        label: "Overview",
        summary:
          "Peer-to-peer file sharing in Python over UDP and TCP, with authentication, server-assisted peer discovery and heartbeat-based presence.",
        tags: [
          "networking",
          "sockets",
          "udp",
          "tcp",
          "p2p",
          "distributed",
          "python",
          "multithreading",
        ],
      },
    ],
    tags: ["networking", "distributed", "python", "sockets"],
  },
];

export const featuredProjects = projects.filter((p): p is FeaturedProject => p.featured);
export const workbenchProjects = projects.filter((p): p is WorkbenchProject => !p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProject(slug: string): FeaturedProject | undefined {
  return featuredProjects.find((p) => p.slug === slug);
}

/** Featured projects have pages; workbench projects live as anchors on /work. */
export function projectHref(project: Project, facetId?: string): string {
  if (!project.featured) return `/work#${project.slug}`;
  return facetId ? `/work/${project.slug}#${facetId}` : `/work/${project.slug}`;
}

export const contextLabels: Record<Project["context"], string> = {
  professional: "Professional work",
  research: "Research",
  personal: "Personal project",
  project: "Project",
};
