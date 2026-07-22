# agents.md — SignalMatch

## What this product is

SignalMatch (https://www.signalmatch.me) is a builder-first marketplace for CPA-based creator campaigns. Builders (product teams) define a conversion event (signup, activation, or another in-product action), set a CPA rate and budget, and invite creators. Creators share referral codes; conversions are tracked via idempotent events; builders review and approve each conversion before payout is released from the funded budget.

## Key routes

- `/` — landing page (how it works, FAQ, CTAs)
- `/builders`, `/creators` — audience-specific marketing pages
- `/explore/creators`, `/explore/campaigns`, `/explore/products` — public, read-only directories
- `/resources` — editorial guides; `/tools` — free planning tools
- `/builders/sign-up`, `/creators/sign-up` — account creation (Clerk)
- `/app/...` — authenticated dashboard (builders and creators)
- `/privacy`, `/terms`, `/contact` — legal and contact

## Machine-readable interfaces

- MCP server: `https://www.signalmatch.me/mcp` (streamable HTTP, OAuth via Clerk). Read-only directory tools (`search_creators`, campaign queries) plus builder-scoped tools when authenticated.
- Public JSON APIs (GET): `/api/public/creators`, `/api/public/creators/[id]`, `/api/public/campaigns`, `/api/public/campaigns/[id]`
- Conversion ingestion: `POST /api/conversions` (idempotent, builder API key required)
- Agent manifest: `/.well-known/agent-card.json`; guardrails: `/.well-known/ai-agent.json`
- Sitemap: `/sitemap.xml`; LLM index: `/llms.txt`

## How agents should interact

**Safe / allowed without confirmation:**

- Read any public page or directory (`/`, `/explore/*`, `/resources/*`, `/tools`, `/about`, `/privacy`, `/terms`).
- Query the public JSON APIs and MCP read tools.
- Follow links tagged with `data-agent-action` for navigation purposes.

**Requires explicit human confirmation (elements are tagged `data-agent-danger` / `data-agent-confirm`):**

- Submitting sign-up or sign-in forms on behalf of a user.
- Funding a campaign, approving a conversion, or releasing a payout.
- Rotating API keys or any other destructive/irreversible action in the dashboard.

**Never allowed:**

- Creating accounts, campaigns, or conversions without the account owner's explicit instruction.
- Fabricating or replaying conversion events.
- Scraping authenticated (`/app/*`) pages without the user's own session and consent.

## Contact

Questions: msanchezgrice@gmail.com (also listed on `/contact`).
