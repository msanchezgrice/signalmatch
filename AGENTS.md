# AGENTS.md — SignalMatch repo

## What this product is

SignalMatch (https://www.signalmatch.me) is a builder-first marketplace for CPA-based creator campaigns. Builders define a conversion event (signup, activation, or other in-product action), set a CPA rate and budget, and invite creators. Creators share referral codes; conversions are tracked via idempotent API events; builders approve each conversion before payout releases from the funded budget.

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS 4 + Radix UI; Clerk for auth; Stripe for payments/payouts
- Postgres (`pg`) + Supabase migrations in `supabase/migrations/`
- MCP server via `mcp-handler` + `@vercel/mcp-adapter` (see `src/app/[transport]/route.ts`, `src/server/mcp/`)
- Remotion for video (`remotion/`), Playwright e2e, Vitest unit tests
- pnpm as package manager

## Common commands

- `pnpm dev` — dev server
- `pnpm build` — production build
- `pnpm lint` — ESLint
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm test` — Vitest unit tests
- `pnpm test:e2e` — Playwright e2e tests
- `pnpm format` — Prettier

## Project structure

- `src/app/(marketing)/` — public marketing pages (`/`, `/builders`, `/creators`, `/explore/*`, `/resources`, `/tools`, legal pages)
- `src/app/(app)/app/` — authenticated dashboard (builder + creator)
- `src/app/api/` — REST routes; `src/app/api/public/*` are unauthenticated read APIs
- `src/app/[transport]/route.ts` + `src/server/mcp/` — MCP server (OAuth via Clerk)
- `src/components/` — UI components; `src/lib/` — shared libs; `src/server/` — server-only code
- `public/` — static assets, including agent protocol files: `llms.txt`, `agents.md`, `.well-known/agent-card.json`, `.well-known/ai-agent.json`
- `supabase/` — DB migrations and seed; `tests/` — unit + e2e; `remotion/` — video
- `src/app/robots.ts`, `src/app/sitemap.ts` — generated robots.txt and sitemap.xml

## Conventions for agents editing this repo

- TypeScript strict; follow existing ESLint/Prettier config (`.prettierrc`).
- Marketing pages must stay visually stable: do not rewrite above-the-fold copy, CTAs, pricing, or checkout/signup flows without explicit instruction.
- Server-only code lives under `src/server/`; keep secrets in env vars (see `.env.example`), never hardcode.
- Run `pnpm typecheck` and `pnpm lint` after changes; run `pnpm test` if logic changes.

## Machine-readable site files (served from `public/`)

- `/llms.txt` — LLM-oriented site index
- `/agents.md` — browser-agent guidance and safe-action policy
- `/.well-known/agent-card.json` — A2A agent manifest
- `/.well-known/ai-agent.json` — guardrails (allowed/disallowed actions, contact)

If you change routes, APIs, or the MCP surface, update those files to match.

## Contact

msanchezgrice@gmail.com
