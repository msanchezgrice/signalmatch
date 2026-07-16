create unique index if not exists payouts_unique_conversion
  on payouts(conversion_id)
  where conversion_id is not null;
