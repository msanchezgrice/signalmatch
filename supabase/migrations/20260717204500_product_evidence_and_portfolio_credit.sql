alter table products
  add column if not exists website_title text,
  add column if not exists website_description text,
  add column if not exists screenshot_url text,
  add column if not exists verified_at timestamptz,
  add column if not exists is_portfolio_owned boolean not null default false;

update products
set
  website_title = case lower(trim(trailing '/' from url))
    when 'https://myforeversongs.com' then 'Custom Personalized Songs From $29.99 | My Forever Songs'
    when 'https://clonesentry.com' then 'CloneSentry'
    when 'https://toastbuddy.com' then 'ToastBuddy | Talk it out. Say it better.'
    when 'https://leakcheckme.com' then 'Leak Check Me - Find the leak. Scrub the link.'
    else website_title
  end,
  website_description = case lower(trim(trailing '/' from url))
    when 'https://myforeversongs.com' then 'Create a personalized custom song from your story and hear the preview before you pay.'
    when 'https://clonesentry.com' then 'Find AI copycats before your customers do with lookalike domain scans, evidence, and enforcement routing.'
    when 'https://toastbuddy.com' then 'A voice-first coach that turns real memories into a toast, speech, love letter, or song brief.'
    when 'https://leakcheckme.com' then 'Run a verified Leak Link Check, then deploy MyPrivacyAgent for eligible public-record opt-out actions.'
    else website_description
  end,
  screenshot_url = case lower(trim(trailing '/' from url))
    when 'https://myforeversongs.com' then 'https://myforeversongs.com/opengraph.jpg'
    when 'https://clonesentry.com' then 'https://clonesentry.com/brand/clonesentry-og.png'
    when 'https://toastbuddy.com' then 'https://toastbuddy.com/opengraph-image?42c764f1e8287ab7'
    when 'https://leakcheckme.com' then 'https://leakcheckme.com/brand/og-image.png'
    else screenshot_url
  end,
  verified_at = now(),
  is_portfolio_owned = true
where lower(trim(trailing '/' from url)) in (
  'https://myforeversongs.com',
  'https://clonesentry.com',
  'https://toastbuddy.com',
  'https://leakcheckme.com'
);

create index if not exists idx_products_portfolio_owned
  on products(is_portfolio_owned)
  where is_portfolio_owned = true;
