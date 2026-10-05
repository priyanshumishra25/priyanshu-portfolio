import { afterEach, describe, expect, it, vi } from "vitest";

function post(body: unknown, raw = false) {
  return new Request("http://localhost/api/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: raw ? (body as string) : JSON.stringify(body),
  });
}

describe("POST /api/assistant", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    vi.doUnmock("@/lib/assistant/llm");
  });

  it("answers locally when no API key is configured", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    vi.stubEnv("ANTHROPIC_MODEL", "");
    const { POST } = await import("@/app/api/assistant/route");
    const res = await POST(post({ question: "Does he have systems programming experience?" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.mode).toBe("local");
    expect(data.sources.length).toBeGreaterThan(0);
  });

  it("requires both a key and a model before using the LLM", async () => {
    const { isLlmConfigured } = await import("@/lib/assistant/llm");
    vi.stubEnv("ANTHROPIC_API_KEY", "sk-test");
    vi.stubEnv("ANTHROPIC_MODEL", "");
    expect(isLlmConfigured()).toBe(false);
    vi.stubEnv("ANTHROPIC_MODEL", "some-model");
    expect(isLlmConfigured()).toBe(true);
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    expect(isLlmConfigured()).toBe(false);
  });

  it("rejects invalid JSON, empty, oversized and huge requests with controlled errors", async () => {
    const { POST } = await import("@/app/api/assistant/route");
    expect((await POST(post("{nope", true))).status).toBe(400);
    expect((await POST(post({ question: "" }))).status).toBe(400);
    expect((await POST(post({ question: "x".repeat(501) }))).status).toBe(400);
    expect(
      (await POST(post({ question: "hi", history: [{ role: "system", text: "x" }] }))).status,
    ).toBe(400);
    expect((await POST(post({ question: "hi", padding: "x".repeat(9000) }))).status).toBe(413);
  });

  it("falls back to the local engine when the LLM call fails", async () => {
    vi.doMock("@/lib/assistant/llm", () => ({
      isLlmConfigured: () => true,
      answerWithLlm: () => Promise.reject(new Error("provider down")),
    }));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { POST } = await import("@/app/api/assistant/route");
    const data = await (await POST(post({ question: "What has he built with AI?" }))).json();
    expect(data.mode).toBe("local");
    expect(data.text).toContain("ArmsOA");
    spy.mockRestore();
  });

  it("returns the LLM answer when it succeeds, and answers locally past the rate limit", async () => {
    vi.stubEnv("ASSISTANT_LLM_REQUESTS_PER_MINUTE", "2");
    const llm = vi.fn(async () => ({
      text: "From the LLM",
      sources: [],
      kind: "answer",
      mode: "llm",
    }));
    vi.doMock("@/lib/assistant/llm", () => ({ isLlmConfigured: () => true, answerWithLlm: llm }));
    const { POST } = await import("@/app/api/assistant/route");
    const modes = [];
    for (let i = 0; i < 3; i++)
      modes.push((await (await POST(post({ question: "hi" }))).json()).mode);
    expect(modes).toEqual(["llm", "llm", "local"]);
    expect(llm).toHaveBeenCalledTimes(2);
  });
});
