-- Flaga „dodaj do nowości” na stronie głównej (slider Nowości)

alter table public.blog_posts
  add column if not exists show_in_news boolean not null default false;

alter table public.courses
  add column if not exists show_in_news boolean not null default false;

create index if not exists blog_posts_show_in_news_idx
  on public.blog_posts (show_in_news, published_at desc)
  where show_in_news = true and published = true;

create index if not exists courses_show_in_news_idx
  on public.courses (show_in_news, sort_order)
  where show_in_news = true and published = true;
