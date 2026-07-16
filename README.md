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

## Production launch requirements

- Vercel production must use Clerk `pk_live_` / `sk_live_` keys and a verified Clerk webhook at `/api/webhooks/clerk`.
- Stripe must use an `sk_live_` key, a live webhook at `/api/webhooks/stripe`, and Connect must be enabled for creator payouts.
- Preview and local development may use Clerk and Stripe test keys.
- Apply every migration in `supabase/migrations` before promoting a deployment.
- Analytics and ad tags are optional at build time and activate only when their public IDs are configured. Keep them consent-gated.

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
