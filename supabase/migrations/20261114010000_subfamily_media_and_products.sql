-- Two-level stone hierarchy: category → colour-family sub-category.
-- 1) Allows media images to be associated with a colour family
--    (e.g. a photo tagged "White marble" / "Black granite").
-- 2) Adds an optional sub-family to catalogue products.

alter table public.media_associations drop constraint media_associations_content_type_check;
alter table public.media_associations
  add constraint media_associations_content_type_check
  check (content_type in ('material','marble_variety','brand','application','project','editorial','product','family','subfamily'));

alter table public.catalogue_products add column if not exists subfamily text not null default '' check (char_length(subfamily) <= 60);
