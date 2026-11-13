-- Newsletter subscribers captured by the footer subscription bar.
-- Visitors may add their own row; nobody without team access can read the list.

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (char_length(email) <= 254 and position('@' in email) > 1),
  source text not null default 'footer' check (char_length(source) <= 60),
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

-- Explicit privileges (default grants vary between projects).
grant insert on table public.newsletter_subscribers to anon;
revoke select, update, delete on table public.newsletter_subscribers from anon;

-- Allow anonymous visitors to subscribe (insert only — no read access).
drop policy if exists "Visitors can subscribe" on public.newsletter_subscribers;
create policy "Visitors can subscribe"
  on public.newsletter_subscribers
  for insert
  to anon
  with check (true);
