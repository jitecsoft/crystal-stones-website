-- Allow media images to be associated with a whole stone category (e.g. a
-- granite photo tagged simply "Granite"), so category pages can show real
-- team photography instead of only illustrative imagery.

alter table public.media_associations drop constraint media_associations_content_type_check;
alter table public.media_associations
  add constraint media_associations_content_type_check
  check (content_type in ('material','marble_variety','brand','application','project','editorial','product','family'));
