-- show_in_news dla darmowych materiałów + mock 2 artykuły / 2 materiały / 2 kursy

alter table public.free_materials
  add column if not exists show_in_news boolean not null default false;

create index if not exists free_materials_show_in_news_idx
  on public.free_materials (show_in_news, sort_order)
  where show_in_news = true and published = true;

-- 2 artykuły
update public.blog_posts
set show_in_news = true
where id in (
  '33333333-3333-4333-8333-333333333301'::uuid,
  '33333333-3333-4333-8333-333333333302'::uuid
);

-- 2 darmowe materiały
update public.free_materials
set show_in_news = true
where id in (
  '77777777-7777-4777-8777-777777777701'::uuid,
  '77777777-7777-4777-8777-777777777703'::uuid
);

-- 2 kursy (szkolenie + wideo)
update public.courses
set show_in_news = true
where id in (
  '44444444-4444-4444-8444-444444444401'::uuid,
  '44444444-4444-4444-8444-444444444410'::uuid
);
