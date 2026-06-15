-- Blog: autorzy, tagi, artykuły + storage na okładki
-- Uruchom w Supabase SQL Editor (Dashboard → SQL → New query)

-- Autorzy
create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  position text not null default '',
  description text not null default '',
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tagi
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  constraint tags_name_unique unique (name),
  constraint tags_slug_unique unique (slug)
);

-- Artykuły
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  excerpt text not null default '',
  content_html text not null default '',
  cover_image_url text,
  author_id uuid references public.authors (id) on delete set null,
  published boolean not null default false,
  published_at timestamptz,
  is_featured boolean not null default false,
  reading_time_minutes integer not null default 5 check (reading_time_minutes >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_slug_unique unique (slug)
);

create unique index if not exists blog_posts_single_featured_idx
  on public.blog_posts (is_featured)
  where is_featured;

-- Powiązanie artykuł ↔ tagi
create table if not exists public.blog_post_tags (
  post_id uuid not null references public.blog_posts (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (post_id, tag_id)
);

-- Powiązane artykuły
create table if not exists public.blog_post_related (
  post_id uuid not null references public.blog_posts (id) on delete cascade,
  related_post_id uuid not null references public.blog_posts (id) on delete cascade,
  primary key (post_id, related_post_id),
  constraint blog_post_related_no_self check (post_id <> related_post_id)
);

-- updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists authors_set_updated_at on public.authors;
create trigger authors_set_updated_at
  before update on public.authors
  for each row execute function public.set_updated_at();

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- RLS
alter table public.authors enable row level security;
alter table public.tags enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_post_tags enable row level security;
alter table public.blog_post_related enable row level security;

-- Admin (zalogowany): pełny dostęp
create policy "authors_authenticated_all"
  on public.authors for all to authenticated
  using (true) with check (true);

create policy "tags_authenticated_all"
  on public.tags for all to authenticated
  using (true) with check (true);

create policy "blog_posts_authenticated_all"
  on public.blog_posts for all to authenticated
  using (true) with check (true);

create policy "blog_post_tags_authenticated_all"
  on public.blog_post_tags for all to authenticated
  using (true) with check (true);

create policy "blog_post_related_authenticated_all"
  on public.blog_post_related for all to authenticated
  using (true) with check (true);

-- Publiczny odczyt opublikowanych artykułów (strona bloga)
create policy "blog_posts_public_read"
  on public.blog_posts for select to anon
  using (published = true);

create policy "authors_public_read"
  on public.authors for select to anon
  using (true);

create policy "tags_public_read"
  on public.tags for select to anon
  using (true);

create policy "blog_post_tags_public_read"
  on public.blog_post_tags for select to anon
  using (
    exists (
      select 1 from public.blog_posts p
      where p.id = blog_post_tags.post_id and p.published = true
    )
  );

create policy "blog_post_related_public_read"
  on public.blog_post_related for select to anon
  using (
    exists (
      select 1 from public.blog_posts p
      where p.id = blog_post_related.post_id and p.published = true
    )
  );

-- Storage: okładki artykułów
insert into storage.buckets (id, name, public)
values ('blog-covers', 'blog-covers', true)
on conflict (id) do nothing;

create policy "blog_covers_public_read"
  on storage.objects for select to anon
  using (bucket_id = 'blog-covers');

create policy "blog_covers_authenticated_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'blog-covers');

create policy "blog_covers_authenticated_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'blog-covers');

create policy "blog_covers_authenticated_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'blog-covers');

-- Storage: zdjęcia autorów
insert into storage.buckets (id, name, public)
values ('author-photos', 'author-photos', true)
on conflict (id) do nothing;

create policy "author_photos_public_read"
  on storage.objects for select to anon
  using (bucket_id = 'author-photos');

create policy "author_photos_authenticated_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'author-photos');

create policy "author_photos_authenticated_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'author-photos');

create policy "author_photos_authenticated_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'author-photos');
