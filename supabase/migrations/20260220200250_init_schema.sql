create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  role text,
  created_at timestamptz not null default now(),
  check (role in ('CREATOR', 'BUILDER', 'ADMIN') or role is null)
);

create table if not exists creator_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references users(id) on delete cascade,
  display_name text not null,
  bio text,
  avatar_url text,
  niches text[] not null default '{}'::text[],
  audience_tags text[] not null default '{}'::text[],
  channels jsonb not null default '[]'::jsonb,
  verification_status text not null default 'unverified',
  stripe_account_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (verification_status in ('unverified', 'verified'))
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references users(id) on delete cascade,
  name text not null,
  url text not null,
  description text,
  category_tags text[] not null default '{}'::text[],
  pricing_type text not null default 'freemium',
  status text not null default 'active',
  conversion_api_key_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (pricing_type in ('free', 'freemium', 'paid')),
  check (status in ('active', 'paused'))
);

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  title text not null,
  brief text,
  target_tags text[] not null default '{}'::text[],
  conversion_type text not null default 'signup',
  payout_model text not null default 'cpa',
  cpa_amount_cents int not null default 0,
  approval_mode text not null default 'auto',
  approval_timeout_days int not null default 7,
  budget_total_cents int not null default 0,
  budget_available_cents int not null default 0,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (conversion_type in ('signup', 'activation')),
  check (payout_model in ('cpa', 'revshare')),
  check (approval_mode in ('auto', 'manual')),
  check (status in ('draft', 'active', 'paused', 'ended'))
);

create table if not exists partnerships (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  creator_user_id uuid not null references users(id) on delete cascade,
  status text not null default 'invited',
  ref_code text unique not null,
  terms_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status in ('invited', 'accepted', 'active', 'ended', 'disputed')),
  unique (campaign_id, creator_user_id)
);

create table if not exists click_events (
  id uuid primary key default gen_random_uuid(),
  ref_code text not null,
  user_agent_hash text,
  ip_hash text,
  created_at timestamptz not null default now()
);

create table if not exists conversions (
  id uuid primary key default gen_random_uuid(),
  partnership_id uuid not null references partnerships(id) on delete cascade,
  event_type text not null,
  external_user_id text,
  idempotency_key text,
  status text not null default 'pending',
  payout_amount_cents int not null default 0,
  created_at timestamptz not null default now(),
  check (event_type in ('signup', 'activation')),
  check (status in ('pending', 'approved', 'rejected'))
);

create unique index if not exists conversions_unique_idempotency
  on conversions(partnership_id, idempotency_key)
  where idempotency_key is not null;

create unique index if not exists conversions_unique_external
  on conversions(partnership_id, external_user_id, event_type)
  where external_user_id is not null;

create table if not exists funding_events (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  stripe_checkout_session_id text unique not null,
  amount_cents int not null,
  status text not null,
  created_at timestamptz not null default now(),
  check (status in ('pending', 'succeeded', 'failed'))
);

create table if not exists payouts (
  id uuid primary key default gen_random_uuid(),
  creator_user_id uuid not null references users(id) on delete cascade,
  campaign_id uuid not null references campaigns(id) on delete cascade,
  conversion_id uuid references conversions(id) on delete set null,
  amount_cents int not null,
  status text not null,
  stripe_transfer_id text,
  created_at timestamptz not null default now(),
  check (status in ('due', 'paid', 'failed'))
);

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_creator_profiles_niches on creator_profiles using gin (niches);
create index if not exists idx_campaigns_target_tags on campaigns using gin (target_tags);
create index if not exists idx_campaigns_status on campaigns(status);
create index if not exists idx_partnerships_campaign on partnerships(campaign_id);
create index if not exists idx_click_events_ref_code on click_events(ref_code);
create index if not exists idx_conversions_partnership on conversions(partnership_id);
create index if not exists idx_payouts_creator on payouts(creator_user_id);

alter table users disable row level security;
alter table creator_profiles disable row level security;
alter table products disable row level security;
alter table campaigns disable row level security;
alter table partnerships disable row level security;
alter table click_events disable row level security;
alter table conversions disable row level security;
alter table funding_events disable row level security;
alter table payouts disable row level security;
alter table audit_log disable row level security;
