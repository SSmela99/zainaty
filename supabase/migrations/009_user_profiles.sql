-- Profile użytkowników z rolami: admin | user
-- Istniejące konta z auth.users dostają rolę admin.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_admin() to anon;

insert into public.profiles (id, role)
select id, 'admin'
from auth.users
on conflict (id) do update
set role = 'admin';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'user')
  on conflict (id) do nothing;

  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute function public.handle_new_user();
  end if;
end $$;

alter table public.profiles enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles_select_own'
  ) then
    create policy "profiles_select_own"
      on public.profiles for select to authenticated
      using (auth.uid() = id);
  end if;
end $$;

-- Blog: tylko admin
drop policy if exists "authors_authenticated_all" on public.authors;
create policy "authors_admin_all"
  on public.authors for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "tags_authenticated_all" on public.tags;
create policy "tags_admin_all"
  on public.tags for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "blog_posts_authenticated_all" on public.blog_posts;
create policy "blog_posts_admin_all"
  on public.blog_posts for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "blog_post_tags_authenticated_all" on public.blog_post_tags;
create policy "blog_post_tags_admin_all"
  on public.blog_post_tags for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "blog_post_related_authenticated_all" on public.blog_post_related;
create policy "blog_post_related_admin_all"
  on public.blog_post_related for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- FAQ: tylko admin
drop policy if exists "faq_items_authenticated_all" on public.faq_items;
create policy "faq_items_admin_all"
  on public.faq_items for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Stopka: tylko admin
drop policy if exists "site_footer_settings_authenticated_all" on public.site_footer_settings;
create policy "site_footer_settings_admin_all"
  on public.site_footer_settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Storage: tylko admin
drop policy if exists "blog_covers_authenticated_insert" on storage.objects;
create policy "blog_covers_admin_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'blog-covers' and public.is_admin());

drop policy if exists "blog_covers_authenticated_update" on storage.objects;
create policy "blog_covers_admin_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'blog-covers' and public.is_admin());

drop policy if exists "blog_covers_authenticated_delete" on storage.objects;
create policy "blog_covers_admin_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'blog-covers' and public.is_admin());

drop policy if exists "author_photos_authenticated_insert" on storage.objects;
create policy "author_photos_admin_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'author-photos' and public.is_admin());

drop policy if exists "author_photos_authenticated_update" on storage.objects;
create policy "author_photos_admin_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'author-photos' and public.is_admin());

drop policy if exists "author_photos_authenticated_delete" on storage.objects;
create policy "author_photos_admin_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'author-photos' and public.is_admin());
