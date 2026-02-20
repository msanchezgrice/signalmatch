# SignalMatch

SignalMatch is a CPA-first marketplace connecting AI curators and AI tool builders.

## Stack
- Next.js App Router + TypeScript + Tailwind + shadcn/ui
- Clerk auth
- Supabase Postgres via SQL migrations
- Stripe Checkout + Connect Express + Transfers
- MCP read-only tools for agent workflows

## Quickstart
1. Install deps:
```bash
pnpm install
```
2. Copy env template:
```bash
cp .env.example .env.local
```
3. Start Supabase local services:
```bash
supabase start
supabase db reset
```
4. Start dev server:
```bash
pnpm dev
```

## Scripts
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:e2e`
- `pnpm build`
- `pnpm format`

## Core routes
- Marketing: `/`, `/builders`, `/creators`, `/explore/creators`, `/explore/campaigns`
- App: `/app/*`
- Tracking: `/r/{refCode}`
- Conversions API: `POST /api/conversions`
- Stripe webhook: `POST /api/webhooks/stripe`
- Clerk webhook: `POST /api/webhooks/clerk`
- MCP transport: `/mcp`

## Agent package
- `agent/skills.md`
- `agent/rubric.md`
- `agent/examples.md`
- smoke script: `scripts/agent-smoke.sh`
