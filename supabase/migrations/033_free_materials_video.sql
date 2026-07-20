-- Video + link YouTube dla darmowych materiałów

alter table public.free_materials
  add column if not exists is_video boolean not null default false;

alter table public.free_materials
  add column if not exists youtube_url text;

alter table public.free_materials
  alter column r2_object_key drop not null;
