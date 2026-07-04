-- Kursy / e-booki

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  description text not null default '',
  cover_image_url text,
  price numeric(10, 2) not null default 0 check (price >= 0),
  discount_price numeric(10, 2) check (discount_price is null or discount_price >= 0),
  target_audience text not null default '',
  learning_points text[] not null default '{}',
  outcomes text[] not null default '{}',
  duration_label text not null default '',
  format_label text not null default 'E-book',
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint courses_slug_unique unique (slug),
  constraint courses_discount_not_higher_than_price check (
    discount_price is null or discount_price <= price
  )
);

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'courses_set_updated_at'
  ) then
    create trigger courses_set_updated_at
      before update on public.courses
      for each row execute function public.set_updated_at();
  end if;
end $$;

alter table public.courses enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'courses'
      and policyname = 'courses_admin_all'
  ) then
    create policy "courses_admin_all"
      on public.courses for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'courses'
      and policyname = 'courses_public_read'
  ) then
    create policy "courses_public_read"
      on public.courses for select to anon
      using (published = true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'courses'
      and policyname = 'courses_public_read_authenticated'
  ) then
    create policy "courses_public_read_authenticated"
      on public.courses for select to authenticated
      using (published = true);
  end if;
end $$;

insert into storage.buckets (id, name, public)
values ('course-covers', 'course-covers', true)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'course_covers_public_read'
  ) then
    create policy "course_covers_public_read"
      on storage.objects for select to anon
      using (bucket_id = 'course-covers');
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'course_covers_admin_insert'
  ) then
    create policy "course_covers_admin_insert"
      on storage.objects for insert to authenticated
      with check (bucket_id = 'course-covers' and public.is_admin());
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'course_covers_admin_update'
  ) then
    create policy "course_covers_admin_update"
      on storage.objects for update to authenticated
      using (bucket_id = 'course-covers' and public.is_admin());
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'course_covers_admin_delete'
  ) then
    create policy "course_covers_admin_delete"
      on storage.objects for delete to authenticated
      using (bucket_id = 'course-covers' and public.is_admin());
  end if;
end $$;
