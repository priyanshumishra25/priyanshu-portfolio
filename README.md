# Priyanshu Mishra · Portfolio

An illustrated, explorable workspace that doubles as a portfolio. The desk is the fun layer; the top navigation and the "in thirty seconds" summary are the practical layer. Featured projects open with a small interactive model of the problem, followed by the real system behind it.

Next.js 16 (App Router), React 19, strict TypeScript, Tailwind CSS 4, Framer Motion. All illustrations are hand-written SVG; there are no image assets and no 3D.

## Quick start

```bash
npm ci
cp .env.example .env.local   # optional
npm run dev                  # http://localhost:3000
```

| Script                 | What it does                                                       |
| ---------------------- | ------------------------------------------------------------------ |
| `npm run dev`          | Dev server                                                         |
| `npm run build`        | Production build. Every page is static except `/api/assistant`     |
| `npm test`             | Vitest: content rules, PAI behaviour, simulations, components, API |
| `npm run lint`         | ESLint (Next core-web-vitals + TypeScript)                         |
| `npm run typecheck`    | `tsc --noEmit`                                                     |
| `npm run format:check` | Prettier                                                           |

## Personal configuration

Everything lives in `/content`. UI components never hardcode facts, links or dates.

| What                          | Where                                                                                                                                                             |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name, email, GitHub, LinkedIn | `content/site.ts`                                                                                                                                                 |
| Resume PDFs                   | Put each PDF in `public/` and list it in `resumePdfs` (`{ label, href }`) in `content/site.ts`. The first is the default on `/resume`; the rest are a click away. |
| Roles and dates               | `content/experience.ts` (`period: { start: "2026-06", end: "2026-09" \| "present" }`). Pages and PAI read from here.                                              |
| Education                     | `content/about.ts`                                                                                                                                                |
| Projects                      | `content/projects.ts`                                                                                                                                             |
| Production URL                | `NEXT_PUBLIC_SITE_URL`                                                                                                                                            |

### Projects

One entry in `content/projects.ts` feeds the Work page, project pages, category filter, sitemap and PAI.

- `featured: true` gets a full page at `/work/[slug]`. `featured: false` becomes a card in "The Rest of the Workbench" at `/work#slug`.
- `interactive: true` needs a demo registered in `components/projects/ProjectDemo.tsx` (a test checks this).
- `context` is `professional`, `research`, `personal` or `project`. Use `project` unless the provenance is actually known.
- `repoUrl` must be the exact GitHub URL. When it is missing, no source button renders. `sourceNote` (for example "Client work · source private") renders instead.
- `demoNote` appears under the demo, for example to say the data is illustrative.

## PAI, the portfolio assistant

PAI only knows what is in `/content`. A "How PAI works" disclosure in the assistant panel and a section on `/about` explain it to visitors.

```
Structured portfolio content (content/*)
        ↓
Citable knowledge (lib/assistant/knowledge.ts)
      ↙               ↘
Local retrieval      Claude (optional, server only)
      ↘               ↙
   Answer + evidence links
```

**Local mode, always on.** Curated answers for common questions (dates are filled in from `content/experience.ts`), a technology finder driven by project stacks ("Which projects use Python?"), keyword and tag retrieval for everything else, and an explicit "not mentioned anywhere on this site" for common technologies that never appear (Kubernetes, PostgreSQL, Rust and so on, always shown by their real names).

**Claude mode, optional.** With `ANTHROPIC_API_KEY` and `ANTHROPIC_MODEL` both set, `/api/assistant` sends the whole knowledge base as a cached system prompt (it is small, so this is not retrieval-augmented) and asks for structured output: `{ answer, source_ids, primary_source_id, found }`. The server discards any citation that does not exist and rejects a "grounded" answer that cites nothing valid. Refusals, timeouts, errors, truncated output and rate-limit overflow all fall back to the local engine. If the API is unreachable entirely, the browser runs the local engine itself.

| Variable                            | Required           | Notes                                                                                                                                             |
| ----------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY`                 | No                 | Server only. Never prefix with `NEXT_PUBLIC_`.                                                                                                    |
| `ANTHROPIC_MODEL`                   | With key           | No default on purpose. Use a fast, inexpensive model; `claude-haiku-4-5` is a good fit.                                                           |
| `ASSISTANT_LLM_REQUESTS_PER_MINUTE` | No                 | Default 8 per IP. Counted per runtime instance, so on serverless it is a guard, not a global quota. Requests over the limit are answered locally. |
| `NEXT_PUBLIC_SITE_URL`              | Yes, in production | Used for OpenGraph, sitemap and robots.                                                                                                           |

Output is capped at 500 tokens (answers are asked to stay under 120 words), and only the last four conversation turns are sent, each truncated to 400 characters. Request bodies over 8 KB are rejected. To use another provider, implement `answerWithLlm` in `lib/assistant/llm.ts` with the same return type.

## Deploying to Vercel

1. Import the repository. The framework is detected; no `vercel.json` is needed.
2. Set `NEXT_PUBLIC_SITE_URL`. Optionally set `ANTHROPIC_API_KEY` and `ANTHROPIC_MODEL` as server environment variables.
3. Deploy.

## Engineering notes

- **Accessibility.** Real links and buttons for every desk object, skip link, visible focus, a focus-trapped assistant dialog, native `<dialog>` for contact, `aria-live` updates in demos, and nothing conveyed by colour alone.
- **Motion.** Only on hover, focus or intent. `prefers-reduced-motion` collapses CSS animation, and Framer Motion uses `reducedMotion="user"`.
- **Performance.** Self-hosted fonts, no images, and the assistant panel and each demo are separate lazy-loaded chunks.
- **Copy rules are tests.** `tests/content.test.ts` fails on em dashes, banned buzzwords, placeholder contact details, present-tense ArmsOA employment, dates typed into UI components, invented metrics, unverified provenance labels, broken anchors and invalid repository URLs.

## Easter eggs

Open the browser console. Click the coffee more than once. Poke the broken chip on the Midpoint Fuzzer page. Try the Konami code.
