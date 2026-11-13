-- Crystal Stones catalogue products dashboard. Run this in the project's Supabase SQL editor
-- (Database → SQL) after the media library migration has been applied.
-- It adds team-managed products and lets media images be associated with them.

create table public.catalogue_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 1 and 120),
  name text not null check (char_length(name) between 1 and 180),
  category text not null check (category in ('marble','granite','quartzite','onyx','sandstone','travertine-limestone','porcelain','quartz','composite','ceramic')),
  summary text not null default '' check (char_length(summary) <= 500),
  description text not null default '' check (char_length(description) <= 8000),
  tags text not null default '{}'::text[] check (coalesce(array_length(tags, 1), 0) <= 24),
  origin_country text not null default '' check (char_length(origin_country) <= 120),
  origin_region text not null default '' check (char_length(origin_region) <= 120),
  colours text not null default '{}'::text[] check (coalesce(array_length(colours, 1), 0) <= 24),
  patterns text not null default '{}'::text[] check (coalesce(array_length(patterns, 1), 0) <= 24),
  finishes text not null default '{}'::text[] check (coalesce(array_length(finishes, 1), 0) <= 24),
  applications text not null default '{}'::text[] check (coalesce(array_length(applications, 1), 0) <= 24),
  attributes_verified boolean not null default false,
  care_notes text not null default '' check (char_length(care_notes) <= 2000),
  seo_title text not null default '' check (char_length(seo_title) <= 180),
  seo_description text not null default '' check (char_length(seo_description) <= 320),
  status text not null default 'draft' check (status in ('draft','published')),
  created_by uuid not null references auth.users(id) on delete cascade,
  published_by uuid references auth.users(id),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.catalogue_products enable row level security;

-- Visitors: only published products.
create policy "public reads published products" on public.catalogue_products
  for select to anon, authenticated using (status = 'published');

-- Team: every active member can read the full list.
create policy "team reads catalogue products" on public.catalogue_products
  for select to authenticated using (private.has_media_role(array['administrator','content_editor','uploader']::public.media_team_role[]));

-- Only editors and administrators create, change or remove products.
create policy "editors manage catalogue products" on public.catalogue_products
  for all to authenticated
  using (private.has_media_role(array['administrator','content_editor']::public.media_team_role[]))
  with check (private.has_media_role(array['administrator','content_editor']::public.media_team_role[]));

grant select on public.catalogue_products to anon, authenticated;
grant insert, update, delete on public.catalogue_products to authenticated;

create or replace function private.touch_row_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;

create trigger catalogue_products_updated_at
  before update on public.catalogue_products
  for each row execute function private.touch_row_updated_at();

-- Allow media images to be associated with catalogue products, so the existing
-- upload → review → publish pipeline feeds product page galleries.
alter table public.media_associations drop constraint media_associations_content_type_check;
alter table public.media_associations
  add constraint media_associations_content_type_check
  check (content_type in ('material','marble_variety','brand','application','project','editorial','product'));
