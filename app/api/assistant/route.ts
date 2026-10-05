import { z } from "zod/v4";
import { answerWithLlm, isLlmConfigured } from "@/lib/assistant/llm";
import { answerLocally } from "@/lib/assistant/local";
import { createRateLimiter, llmRequestsPerMinute } from "@/lib/assistant/rate-limit";

const MAX_BODY_BYTES = 8_000;

const RequestSchema = z.object({
  question: z.string().trim().min(1).max(500),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), text: z.string().max(1000) }))
    .max(8)
    .optional(),
});

// Per runtime instance. Requests beyond the limit are answered locally.
const allowLlm = createRateLimiter(llmRequestsPerMinute(), 60_000);

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return Response.json({ error: "Request too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Ask a question between 1 and 500 characters." },
      { status: 400 },
    );
  }
  const { question, history } = parsed.data;

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
  if (!isLlmConfigured() || !allowLlm(ip)) {
    return Response.json(answerLocally(question));
  }

  try {
    return Response.json(await answerWithLlm(question, history));
  } catch (error) {
    console.error(
      "[assistant] LLM path failed, using local fallback:",
      error instanceof Error ? error.message : error,
    );
    return Response.json(answerLocally(question));
  }
}
