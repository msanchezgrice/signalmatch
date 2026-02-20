# Deployment Runbook

## 1) GitHub
```bash
git remote add signalmatch https://github.com/msanchezgrice/signalmatch.git
git push -u signalmatch main
```

## 2) Supabase
```bash
supabase login
supabase projects create signalmatch --org-id <ORG_ID> --region us-east-1 --db-password <DB_PASSWORD>
supabase link --project-ref <PROJECT_REF>
supabase db push
```
Use the resulting Postgres URL as `SUPABASE_DATABASE_URL`.

## 3) Clerk
- Create app in Clerk dashboard or CLI.
- Configure redirect URLs for localhost + production.
- Set env vars:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `CLERK_WEBHOOK_SIGNING_SECRET`

## 4) Stripe
```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
- Copy `whsec_...` into `STRIPE_WEBHOOK_SECRET`
- Ensure Connect Express is enabled.

## 5) Vercel
```bash
vercel login
vercel link
vercel env add NEXT_PUBLIC_APP_URL
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY
vercel env add CLERK_WEBHOOK_SIGNING_SECRET
vercel env add SUPABASE_DATABASE_URL
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add STRIPE_CONNECT_RETURN_URL
vercel env add STRIPE_CONNECT_REFRESH_URL
vercel env add POSTHOG_API_KEY
```
Then deploy via GitHub integration by pushing to `main`.

## 6) Validation
```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
bash scripts/agent-smoke.sh
```
