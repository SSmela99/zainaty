-- Powiązane artykuły (jeśli 001_blog.sql był już uruchomiony wcześniej)

create table if not exists public.blog_post_related (
  post_id uuid not null references public.blog_posts (id) on delete cascade,
  related_post_id uuid not null references public.blog_posts (id) on delete cascade,
  primary key (post_id, related_post_id),
  constraint blog_post_related_no_self check (post_id <> related_post_id)
);

alter table public.blog_post_related enable row level security;

create policy "blog_post_related_authenticated_all"
  on public.blog_post_related for all to authenticated
  using (true) with check (true);

create policy "blog_post_related_public_read"
  on public.blog_post_related for select to anon
  using (
    exists (
      select 1 from public.blog_posts p
      where p.id = blog_post_related.post_id and p.published = true
    )
  );
