-- Opinie / testimonials na stronie głównej

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text not null,
  content text not null,
  rating integer not null default 5 check (rating >= 1 and rating <= 5),
  avatar_url text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'testimonials_set_updated_at'
  ) then
    create trigger testimonials_set_updated_at
      before update on public.testimonials
      for each row execute function public.set_updated_at();
  end if;
end $$;

alter table public.testimonials enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'testimonials'
      and policyname = 'testimonials_admin_all'
  ) then
    create policy "testimonials_admin_all"
      on public.testimonials for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'testimonials'
      and policyname = 'testimonials_public_read'
  ) then
    create policy "testimonials_public_read"
      on public.testimonials for select to anon
      using (published = true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'testimonials'
      and policyname = 'testimonials_public_read_authenticated'
  ) then
    create policy "testimonials_public_read_authenticated"
      on public.testimonials for select to authenticated
      using (published = true);
  end if;
end $$;

insert into storage.buckets (id, name, public)
values ('testimonial-avatars', 'testimonial-avatars', true)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'testimonial_avatars_public_read'
  ) then
    create policy "testimonial_avatars_public_read"
      on storage.objects for select to anon
      using (bucket_id = 'testimonial-avatars');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'testimonial_avatars_admin_insert'
  ) then
    create policy "testimonial_avatars_admin_insert"
      on storage.objects for insert to authenticated
      with check (bucket_id = 'testimonial-avatars' and public.is_admin());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'testimonial_avatars_admin_update'
  ) then
    create policy "testimonial_avatars_admin_update"
      on storage.objects for update to authenticated
      using (bucket_id = 'testimonial-avatars' and public.is_admin());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'testimonial_avatars_admin_delete'
  ) then
    create policy "testimonial_avatars_admin_delete"
      on storage.objects for delete to authenticated
      using (bucket_id = 'testimonial-avatars' and public.is_admin());
  end if;
end $$;
