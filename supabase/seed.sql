insert into users (id, clerk_user_id, role)
values
  ('11111111-1111-1111-1111-111111111111', 'seed_builder_clerk', 'BUILDER'),
  ('22222222-2222-2222-2222-222222222222', 'seed_creator_clerk', 'CREATOR')
on conflict (clerk_user_id) do nothing;

insert into creator_profiles (
  user_id,
  display_name,
  bio,
  niches,
  audience_tags,
  channels,
  verification_status
)
values (
  '22222222-2222-2222-2222-222222222222',
  'Launch-ready AI Curator',
  'I cover AI devtools and agent workflows for builders.',
  array['ai-devtools','agentic-coding'],
  array['builders','founders'],
  '[{"platform":"x","handle":"launchready","url":"https://x.com/launchready","followers":12000,"avg_impressions":6000}]'::jsonb,
  'verified'
)
on conflict (user_id) do nothing;

insert into products (
  id,
  owner_user_id,
  name,
  url,
  description,
  category_tags,
  pricing_type,
  status
)
values (
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'SignalMatch Demo Product',
  'https://example.com',
  'Demo product for local development.',
  array['ai-devtools'],
  'freemium',
  'active'
)
on conflict (id) do nothing;

insert into campaigns (
  id,
  product_id,
  title,
  brief,
  target_tags,
  conversion_type,
  payout_model,
  cpa_amount_cents,
  approval_mode,
  approval_timeout_days,
  budget_total_cents,
  budget_available_cents,
  status
)
values (
  '44444444-4444-4444-4444-444444444444',
  '33333333-3333-3333-3333-333333333333',
  'Get AI founders to sign up',
  'Looking for creators with builder audiences and proven engagement.',
  array['ai-devtools','founders'],
  'signup',
  'cpa',
  500,
  'auto',
  7,
  100000,
  100000,
  'active'
)
on conflict (id) do nothing;
