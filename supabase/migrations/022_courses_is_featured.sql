alter table public.courses
  add column if not exists is_featured boolean not null default false;

create index if not exists courses_featured_published_idx
  on public.courses (is_featured, sort_order)
  where is_featured = true and published = true;
