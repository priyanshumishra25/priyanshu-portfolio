import { projects } from "@/content/projects";
import { research } from "@/content/research";
import { corpusText } from "./knowledge";

export interface Technology {
  /** Shown to visitors exactly as written. */
  label: string;
  /** Lowercase spellings matched as whole words. Never shown. */
  aliases: string[];
}

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Whole-word match that treats "c++", "c#" and ".net" as words. */
export function mentions(text: string, alias: string): boolean {
  return new RegExp(`(^|[^a-z0-9+#.])${escape(alias)}(?![a-z0-9+#])`, "i").test(text);
}

function mentionsAny(text: string, t: Technology): boolean {
  return t.aliases.some((a) => mentions(text, a));
}

/**
 * Technologies people commonly ask about. If one is named and appears nowhere
 * in the portfolio, PAI says so instead of guessing.
 */
const COMMON_TECH: Technology[] = [
  { label: "Kubernetes", aliases: ["kubernetes", "k8s"] },
  { label: "AWS", aliases: ["aws", "amazon web services"] },
  { label: "Google Cloud", aliases: ["gcp", "google cloud"] },
  { label: "Azure", aliases: ["azure"] },
  { label: "Terraform", aliases: ["terraform"] },
  { label: "Kafka", aliases: ["kafka"] },
  { label: "RabbitMQ", aliases: ["rabbitmq"] },
  { label: "GraphQL", aliases: ["graphql"] },
  { label: "PostgreSQL", aliases: ["postgresql", "postgres"] },
  { label: "MySQL", aliases: ["mysql"] },
  { label: "MongoDB", aliases: ["mongodb", "mongo"] },
  { label: "DynamoDB", aliases: ["dynamodb"] },
  { label: "Elasticsearch", aliases: ["elasticsearch"] },
  { label: "Spark", aliases: ["spark", "pyspark"] },
  { label: "Hadoop", aliases: ["hadoop"] },
  { label: "Rust", aliases: ["rust"] },
  { label: "Go", aliases: ["golang"] },
  { label: "Kotlin", aliases: ["kotlin"] },
  { label: "Swift", aliases: ["swift"] },
  { label: "Scala", aliases: ["scala"] },
  { label: "Ruby", aliases: ["ruby"] },
  { label: "Ruby on Rails", aliases: ["rails", "ruby on rails"] },
  { label: "PHP", aliases: ["php"] },
  { label: "C#", aliases: ["c#", "csharp"] },
  { label: ".NET", aliases: [".net", "dotnet"] },
  { label: "Angular", aliases: ["angular"] },
  { label: "Vue", aliases: ["vue", "vue.js", "vuejs"] },
  { label: "Svelte", aliases: ["svelte"] },
  { label: "Django", aliases: ["django"] },
  { label: "Flask", aliases: ["flask"] },
  { label: "Spring Boot", aliases: ["spring boot"] },
  { label: "Node.js", aliases: ["node.js", "nodejs"] },
  { label: "Express", aliases: ["express.js", "expressjs"] },
  { label: "TensorFlow", aliases: ["tensorflow"] },
  { label: "LangChain", aliases: ["langchain"] },
  { label: "OpenAI", aliases: ["openai", "chatgpt"] },
  { label: "iOS", aliases: ["ios"] },
  { label: "Android", aliases: ["android"] },
  { label: "Flutter", aliases: ["flutter"] },
  { label: "Solidity", aliases: ["solidity"] },
  { label: "Unity", aliases: ["unity"] },
  { label: "Snowflake", aliases: ["snowflake"] },
  { label: "Tableau", aliases: ["tableau"] },
];

/** Canonical labels of technologies the question names that the portfolio never mentions. */
export function unknownTechnologies(question: string): string[] {
  return COMMON_TECH.filter((t) => mentionsAny(question, t) && !mentionsAny(corpusText, t)).map(
    (t) => t.label,
  );
}

/** Aliases for technologies that do appear in project stacks. Labels must match stack text. */
const KNOWN_TECH: Technology[] = [
  { label: "Python", aliases: ["python"] },
  { label: "Java", aliases: ["java"] },
  { label: "C++", aliases: ["c++", "cpp", "c++17"] },
  { label: "TypeScript", aliases: ["typescript"] },
  { label: "React", aliases: ["react"] },
  { label: "FastAPI", aliases: ["fastapi"] },
  { label: "Docker", aliases: ["docker"] },
  { label: "Redis", aliases: ["redis"] },
  { label: "PyTorch", aliases: ["pytorch", "torch"] },
  { label: "OpenCV", aliases: ["opencv"] },
  { label: "scikit-learn", aliases: ["scikit-learn", "sklearn", "scikit"] },
  { label: "XGBoost", aliases: ["xgboost"] },
  { label: "LightGBM", aliases: ["lightgbm"] },
  { label: "OpenAPI", aliases: ["openapi"] },
  { label: "Claude", aliases: ["claude", "anthropic"] },
  { label: "Scapy", aliases: ["scapy"] },
  { label: "Selenium", aliases: ["selenium"] },
  { label: "POSIX", aliases: ["posix"] },
  { label: "UDP", aliases: ["udp"] },
  { label: "TCP", aliases: ["tcp"] },
];

export interface TechHit {
  label: string;
  /** Knowledge chunk ids of the projects (and research) that use it. */
  sourceIds: string[];
  names: string[];
}

/** Which projects use the technologies named in the question, read from project stacks. */
export function technologyHits(question: string): TechHit[] {
  const hits: TechHit[] = [];
  for (const t of KNOWN_TECH) {
    if (!mentionsAny(question, t)) continue;
    const sourceIds: string[] = [];
    const names: string[] = [];
    for (const p of projects) {
      if (p.stack.some((s) => mentionsAny(s, t))) {
        sourceIds.push(`project:${p.slug}`);
        names.push(p.shortTitle);
      }
    }
    if (research.stack.some((s) => mentionsAny(s, t))) {
      sourceIds.push("research");
      names.push("UNSW research");
    }
    if (sourceIds.length) hits.push({ label: t.label, sourceIds, names });
  }
  return hits;
}
