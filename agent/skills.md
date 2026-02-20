# SignalMatch Agent Skills

## Tooling surface
- Public API:
  - `GET /api/public/creators`
  - `GET /api/public/creators/{id}`
  - `GET /api/public/campaigns`
  - `GET /api/public/campaigns/{id}`
- MCP tools:
  - `search_creators`
  - `get_creator`
  - `search_campaigns`
  - `get_campaign`
  - `list_my_campaigns`
  - `get_my_campaign_analytics`
  - `list_my_partnerships`

## Read-only constraints
- Never invite creators.
- Never fund campaigns.
- Never approve payouts.
- Never mutate data through MCP.

## Ranking rubric
- Niche match: 0-5
- Channel match: 0-3
- Reach fit: 0-2
- Verified bonus: +1

## Outreach draft template
Subject: `{tool_name} x {creator_name} CPA partnership`

Message:
Hi {creator_name} - I run growth for {tool_name}. We are offering **${cpa_dollars} per qualified {conversion_type}** through SignalMatch.

Why I think this is a fit:
- niche overlap: {niche_reason}
- audience fit: {audience_reason}
- channel performance: {channel_reason}

If useful, I can share the campaign brief and terms.

Disclosure reminder: include clear sponsorship/affiliate disclosure where required.
