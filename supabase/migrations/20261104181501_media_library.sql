-- Crystal Stones media library. This migration is prepared locally only; it has not been applied.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create type public.media_team_role as enum ('uploader', 'content_editor', 'administrator');
create type public.media_asset_status as enum ('uploaded', 'processing', 'review_needed', 'approved', 'published', 'failed');

create table public.media_team_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.media_team_role not null default 'uploader',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table public.media_batches (
  id uuid primary key default gen_random_uuid(),
  label text not null default '',
  created_by uuid not null references auth.users(id),
  assigned_to uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references public.media_batches(id) on delete set null,
  original_path text not null unique,
  sha256 text not null unique check (sha256 ~ '^[a-f0-9]{64}$'),
  original_mime text not null check (original_mime in ('image/jpeg','image/png','image/webp','image/avif')),
  original_bytes bigint not null check (original_bytes > 0 and original_bytes <= 15728640),
  width integer,
  height integer,
  status public.media_asset_status not null default 'uploaded',
  title text not null default '',
  alt_text text not null default '',
  caption text not null default '',
  description text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  attribution text not null default '',
  usage_rights text not null default '',
  source_url text not null default '',
  created_by uuid not null references auth.users(id),
  assigned_to uuid references auth.users(id),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  published_at timestamptz
);

create table public.media_variants (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.media_assets(id) on delete cascade,
  variant text not null check (variant in ('thumbnail','card','detail')),
  private_path text not null unique,
  public_path text unique,
  mime_type text not null default 'image/webp',
  byte_size bigint not null check (byte_size > 0),
  width integer not null,
  height integer not null,
  created_at timestamptz not null default now(),
  unique(asset_id, variant)
);

create table public.media_associations (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.media_assets(id) on delete cascade,
  content_type text not null check (content_type in ('material','marble_variety','brand','application','project','editorial')),
  entity_slug text not null,
  placement text not null default 'gallery',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  unique(asset_id, content_type, entity_slug, placement)
);

create table public.media_audit_log (
  id bigint generated always as identity primary key,
  asset_id uuid references public.media_assets(id) on delete set null,
  actor_id uuid references auth.users(id),
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function private.has_media_role(allowed public.media_team_role[])
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.media_team_members m where m.user_id = (select auth.uid()) and m.active and m.role = any(allowed));
$$;
revoke all on function private.has_media_role(public.media_team_role[]) from public, anon;
grant execute on function private.has_media_role(public.media_team_role[]) to authenticated;

create or replace function private.can_access_media_asset(asset uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.media_assets a
    where a.id = asset and (
      private.has_media_role(array['administrator','content_editor']::public.media_team_role[])
      or (private.has_media_role(array['uploader']::public.media_team_role[]) and (a.created_by = (select auth.uid()) or a.assigned_to = (select auth.uid())))
    )
  );
$$;
revoke all on function private.can_access_media_asset(uuid) from public, anon;
grant execute on function private.can_access_media_asset(uuid) to authenticated;

alter table public.media_team_members enable row level security;
alter table public.media_batches enable row level security;
alter table public.media_assets enable row level security;
alter table public.media_variants enable row level security;
alter table public.media_associations enable row level security;
alter table public.media_audit_log enable row level security;

create policy "team can read active team roster" on public.media_team_members for select to authenticated using (private.has_media_role(array['administrator','content_editor','uploader']::public.media_team_role[]));
create policy "admins manage roster" on public.media_team_members for all to authenticated using (private.has_media_role(array['administrator']::public.media_team_role[])) with check (private.has_media_role(array['administrator']::public.media_team_role[]));
create policy "team reads batches" on public.media_batches for select to authenticated using (private.has_media_role(array['administrator','content_editor']::public.media_team_role[]) or created_by = (select auth.uid()) or assigned_to = (select auth.uid()));
create policy "team creates batches" on public.media_batches for insert to authenticated with check (private.has_media_role(array['administrator','content_editor','uploader']::public.media_team_role[]) and created_by = (select auth.uid()));
create policy "editors update batches" on public.media_batches for update to authenticated using (private.has_media_role(array['administrator','content_editor']::public.media_team_role[])) with check (private.has_media_role(array['administrator','content_editor']::public.media_team_role[]));

create policy "team reads scoped assets" on public.media_assets for select to authenticated using (private.can_access_media_asset(id));
create policy "team creates own assets" on public.media_assets for insert to authenticated with check (private.has_media_role(array['administrator','content_editor','uploader']::public.media_team_role[]) and created_by = (select auth.uid()));
create policy "editors update asset metadata" on public.media_assets for update to authenticated using (private.has_media_role(array['administrator','content_editor']::public.media_team_role[])) with check (private.has_media_role(array['administrator','content_editor']::public.media_team_role[]));
create policy "team reads scoped variants" on public.media_variants for select to authenticated using (private.can_access_media_asset(asset_id));
create policy "team add scoped variants" on public.media_variants for insert to authenticated with check (private.has_media_role(array['administrator','content_editor','uploader']::public.media_team_role[]) and private.can_access_media_asset(asset_id));
create policy "editors update variants" on public.media_variants for update to authenticated using (private.has_media_role(array['administrator','content_editor']::public.media_team_role[]) and private.can_access_media_asset(asset_id)) with check (private.has_media_role(array['administrator','content_editor']::public.media_team_role[]) and private.can_access_media_asset(asset_id));
create policy "editors delete variants" on public.media_variants for delete to authenticated using (private.has_media_role(array['administrator','content_editor']::public.media_team_role[]) and private.can_access_media_asset(asset_id));
create policy "uploaders delete own variants" on public.media_variants for delete to authenticated using (private.has_media_role(array['uploader']::public.media_team_role[]) and exists (select 1 from public.media_assets a where a.id = asset_id and (a.created_by = (select auth.uid()) or a.assigned_to = (select auth.uid()))));
create policy "team reads scoped associations" on public.media_associations for select to authenticated using (private.can_access_media_asset(asset_id));
create policy "team add scoped associations" on public.media_associations for insert to authenticated with check (private.has_media_role(array['administrator','content_editor','uploader']::public.media_team_role[]) and private.can_access_media_asset(asset_id));
create policy "editors update associations" on public.media_associations for update to authenticated using (private.has_media_role(array['administrator','content_editor']::public.media_team_role[]) and private.can_access_media_asset(asset_id)) with check (private.has_media_role(array['administrator','content_editor']::public.media_team_role[]) and private.can_access_media_asset(asset_id));
create policy "editors delete associations" on public.media_associations for delete to authenticated using (private.has_media_role(array['administrator','content_editor']::public.media_team_role[]) and private.can_access_media_asset(asset_id));
create policy "editors read audit" on public.media_audit_log for select to authenticated using (private.has_media_role(array['administrator','content_editor']::public.media_team_role[]));

grant select on public.media_team_members, public.media_batches, public.media_assets, public.media_variants, public.media_associations, public.media_audit_log to authenticated;
grant insert on public.media_batches, public.media_assets to authenticated;
grant update (title, alt_text, caption, description, seo_title, seo_description, attribution, usage_rights, source_url, assigned_to) on public.media_assets to authenticated;
grant insert, update, delete on public.media_associations, public.media_variants to authenticated;
grant usage, select on sequence public.media_audit_log_id_seq to authenticated;
grant usage on schema public to anon, authenticated;

create view public.published_media with (security_invoker = false) as
  select a.id, a.title, a.alt_text, a.caption, a.attribution, a.seo_title,
         v.variant, v.public_path, v.mime_type, v.width, v.height,
         assoc.content_type, assoc.entity_slug, assoc.placement, assoc.position
  from public.media_assets a
  join public.media_variants v on v.asset_id = a.id and v.public_path is not null
  join public.media_associations assoc on assoc.asset_id = a.id
  where a.status = 'published';
alter table public.media_assets force row level security;
create policy "public reads published media" on public.media_assets for select to anon, authenticated using (status = 'published');
create policy "public reads published variants" on public.media_variants for select to anon, authenticated using (exists (select 1 from public.media_assets a where a.id = asset_id and a.status = 'published' and public_path is not null));
create policy "public reads published associations" on public.media_associations for select to anon, authenticated using (exists (select 1 from public.media_assets a where a.id = asset_id and a.status = 'published'));
grant select on public.published_media to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('crystal-stones-private', 'crystal-stones-private', false, 15728640, array['image/jpeg','image/png','image/webp','image/avif']),
       ('crystal-stones-published', 'crystal-stones-published', true, 15728640, array['image/webp'])
on conflict (id) do nothing;

create policy "team reads permitted originals" on storage.objects for select to authenticated using (bucket_id = 'crystal-stones-private' and exists (select 1 from public.media_assets a where a.original_path = name and private.can_access_media_asset(a.id)));
create policy "team uploads own originals" on storage.objects for insert to authenticated with check (bucket_id = 'crystal-stones-private' and private.has_media_role(array['administrator','content_editor','uploader']::public.media_team_role[]) and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "team upload private derivatives" on storage.objects for insert to authenticated with check (bucket_id = 'crystal-stones-private' and private.has_media_role(array['administrator','content_editor','uploader']::public.media_team_role[]) and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "editors delete private derivatives" on storage.objects for delete to authenticated using (bucket_id = 'crystal-stones-private' and private.has_media_role(array['administrator','content_editor']::public.media_team_role[]));
create policy "uploaders delete own private files" on storage.objects for delete to authenticated using (bucket_id = 'crystal-stones-private' and private.has_media_role(array['uploader']::public.media_team_role[]) and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "uploaders delete assigned private files" on storage.objects for delete to authenticated using (bucket_id = 'crystal-stones-private' and private.has_media_role(array['uploader']::public.media_team_role[]) and (
  exists (select 1 from public.media_assets a where a.original_path = name and private.can_access_media_asset(a.id))
  or exists (select 1 from public.media_variants v where v.private_path = name and private.can_access_media_asset(v.asset_id))
));
create policy "editors publish derivatives" on storage.objects for insert to authenticated with check (bucket_id = 'crystal-stones-published' and private.has_media_role(array['administrator','content_editor']::public.media_team_role[]));
create policy "editors read published derivatives" on storage.objects for select to authenticated using (bucket_id = 'crystal-stones-published' and private.has_media_role(array['administrator','content_editor']::public.media_team_role[]));
create policy "editors update published derivatives" on storage.objects for update to authenticated using (bucket_id = 'crystal-stones-published' and private.has_media_role(array['administrator','content_editor']::public.media_team_role[])) with check (bucket_id = 'crystal-stones-published' and private.has_media_role(array['administrator','content_editor']::public.media_team_role[]));
create policy "editors remove published derivatives" on storage.objects for delete to authenticated using (bucket_id = 'crystal-stones-published' and private.has_media_role(array['administrator','content_editor']::public.media_team_role[]));
create policy "team inserts media audit" on public.media_audit_log for insert to authenticated with check (actor_id = (select auth.uid()) and private.has_media_role(array['administrator','content_editor','uploader']::public.media_team_role[]));

create or replace function public.transition_media_asset(p_asset_id uuid, p_status public.media_asset_status, p_error text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare current_status public.media_asset_status; current_user_role public.media_team_role;
begin
  select role into current_user_role from public.media_team_members where user_id = (select auth.uid()) and active;
  if current_user_role is null then raise exception 'Active media team membership required'; end if;
  select status into current_status from public.media_assets where id = p_asset_id and private.can_access_media_asset(id) for update;
  if current_status is null then raise exception 'Media asset not found'; end if;
  if not (
    (current_user_role in ('administrator','content_editor') and (current_status, p_status) in (('uploaded','processing'),('failed','processing'),('processing','review_needed'),('processing','failed'),('review_needed','approved'),('approved','published')))
    or (current_user_role = 'uploader' and (current_status, p_status) in (('uploaded','processing'),('failed','processing'),('processing','review_needed'),('processing','failed')))
  ) then raise exception 'Media status transition is not permitted'; end if;
  update public.media_assets set status = p_status, error_message = p_error,
    reviewed_by = case when p_status = 'approved' then (select auth.uid()) else reviewed_by end,
    reviewed_at = case when p_status = 'approved' then now() else reviewed_at end,
    published_at = case when p_status = 'published' then now() when p_status = 'approved' then null else published_at end,
    updated_at = now() where id = p_asset_id;
  insert into public.media_audit_log(asset_id, actor_id, action, details)
    values (p_asset_id, (select auth.uid()), 'status:' || p_status::text, jsonb_build_object('from', current_status, 'to', p_status, 'error', p_error));
end;
$$;
revoke all on function public.transition_media_asset(uuid, public.media_asset_status, text) from public, anon;
grant execute on function public.transition_media_asset(uuid, public.media_asset_status, text) to authenticated;
