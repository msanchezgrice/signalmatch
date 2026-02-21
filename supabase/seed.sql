insert into users (id, clerk_user_id, role)
values
  ('11111111-1111-1111-1111-111111111111', 'seed_builder_clerk', 'BUILDER'),
  ('22222222-2222-2222-2222-222222222222', 'seed_creator_clerk', 'CREATOR'),
  ('55555555-5555-5555-5555-555555555555', 'seed_creator_clerk_02', 'CREATOR'),
  ('66666666-6666-6666-6666-666666666666', 'seed_creator_clerk_03', 'CREATOR'),
  ('77777777-7777-7777-7777-777777777777', 'seed_creator_clerk_04', 'CREATOR'),
  ('88888888-8888-8888-8888-888888888888', 'seed_creator_clerk_05', 'CREATOR'),
  ('99999999-9999-9999-9999-999999999999', 'seed_creator_clerk_06', 'CREATOR'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'seed_creator_clerk_07', 'CREATOR'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'seed_creator_clerk_08', 'CREATOR')
on conflict (id) do update
set
  clerk_user_id = excluded.clerk_user_id,
  role = excluded.role;

insert into creator_profiles (
  user_id,
  display_name,
  bio,
  avatar_url,
  niches,
  audience_tags,
  channels,
  verification_status
)
values
  (
    '22222222-2222-2222-2222-222222222222',
    'Avery Cole',
    'I break down AI product workflows for startup operators and solo builders.',
    'https://i.pravatar.cc/400?img=12',
    array['ai-productivity','startup-ops','automation'],
    array['founders','operators','solo-builders'],
    '[{"platform":"youtube","handle":"averybuilds","url":"https://youtube.com/@averybuilds","followers":48600,"avg_impressions":23100},{"platform":"x","handle":"averybuilds","url":"https://x.com/averybuilds","followers":33800,"avg_impressions":14900}]'::jsonb,
    'verified'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Nia Park',
    'Hands-on AI tutorials for modern marketing and GTM teams.',
    'https://i.pravatar.cc/400?img=47',
    array['ai-marketing','growth','gtm'],
    array['marketers','growth-leads','saas-teams'],
    '[{"platform":"tiktok","handle":"niaparkai","url":"https://tiktok.com/@niaparkai","followers":92400,"avg_impressions":41200},{"platform":"instagram","handle":"nia.park.ai","url":"https://instagram.com/nia.park.ai","followers":57100,"avg_impressions":23900}]'::jsonb,
    'verified'
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'Mateo Lin',
    'Daily AI coding experiments and devtool reviews for indie hackers.',
    'https://i.pravatar.cc/400?img=55',
    array['agentic-coding','ai-devtools','indie-hacker'],
    array['developers','technical-founders','indie-hackers'],
    '[{"platform":"x","handle":"mateocodes","url":"https://x.com/mateocodes","followers":44100,"avg_impressions":20100},{"platform":"youtube","handle":"mateocodes","url":"https://youtube.com/@mateocodes","followers":18200,"avg_impressions":9100}]'::jsonb,
    'verified'
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'Sloane Rivera',
    'I test AI support and success tools with real operations teams.',
    'https://i.pravatar.cc/400?img=39',
    array['customer-success','support-ai','ops'],
    array['support-leaders','cx-teams','operations-managers'],
    '[{"platform":"linkedin","handle":"sloanerivera","url":"https://linkedin.com/in/sloanerivera","followers":21800,"avg_impressions":8700},{"platform":"youtube","handle":"sloanerivera","url":"https://youtube.com/@sloanerivera","followers":13300,"avg_impressions":6200}]'::jsonb,
    'verified'
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    'Omar Bennett',
    'Creator-focused teardown videos on AI sales workflows and outreach.',
    'https://i.pravatar.cc/400?img=59',
    array['ai-sales','revops','outbound'],
    array['sales-creators','revops','b2b-founders'],
    '[{"platform":"youtube","handle":"omarbennett","url":"https://youtube.com/@omarbennett","followers":26800,"avg_impressions":12700},{"platform":"x","handle":"omarbennettai","url":"https://x.com/omarbennettai","followers":16500,"avg_impressions":7300}]'::jsonb,
    'unverified'
  ),
  (
    '99999999-9999-9999-9999-999999999999',
    'Priya Das',
    'I help product managers ship faster with AI copilots and planning systems.',
    'https://i.pravatar.cc/400?img=32',
    array['product-management','ai-productivity','team-workflows'],
    array['product-managers','startup-teams','operators'],
    '[{"platform":"linkedin","handle":"priyadaspm","url":"https://linkedin.com/in/priyadaspm","followers":35400,"avg_impressions":14200},{"platform":"newsletter","handle":"ship-faster-ai","url":"https://shipfasterai.example.com","followers":12100,"avg_impressions":6700}]'::jsonb,
    'verified'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Jonah Park',
    'No-BS demos of AI tools for creators, editors, and short-form teams.',
    'https://i.pravatar.cc/400?img=66',
    array['content-creation','video-ai','creator-economy'],
    array['content-creators','video-editors','agency-teams'],
    '[{"platform":"tiktok","handle":"jonahpark.ai","url":"https://tiktok.com/@jonahpark.ai","followers":118000,"avg_impressions":50400},{"platform":"youtube","handle":"jonahpark","url":"https://youtube.com/@jonahpark","followers":22600,"avg_impressions":10300}]'::jsonb,
    'verified'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Elena Brooks',
    'Weekly practical breakdowns on AI analytics and experimentation for growth teams.',
    'https://i.pravatar.cc/400?img=24',
    array['analytics','growth-experiments','ai-ops'],
    array['growth-managers','analysts','saas-builders'],
    '[{"platform":"x","handle":"elenabrooksai","url":"https://x.com/elenabrooksai","followers":29600,"avg_impressions":12100},{"platform":"linkedin","handle":"elena-brooks","url":"https://linkedin.com/in/elena-brooks","followers":18400,"avg_impressions":7600}]'::jsonb,
    'unverified'
  )
on conflict (user_id) do update
set
  display_name = excluded.display_name,
  bio = excluded.bio,
  avatar_url = excluded.avatar_url,
  niches = excluded.niches,
  audience_tags = excluded.audience_tags,
  channels = excluded.channels,
  verification_status = excluded.verification_status,
  updated_at = now();

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
