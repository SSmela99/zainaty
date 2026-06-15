-- Wyróżniony artykuł + czas czytania (minuty)

alter table public.blog_posts
  add column if not exists is_featured boolean not null default false,
  add column if not exists reading_time_minutes integer not null default 5
    check (reading_time_minutes >= 1);

create unique index if not exists blog_posts_single_featured_idx
  on public.blog_posts (is_featured)
  where is_featured;
