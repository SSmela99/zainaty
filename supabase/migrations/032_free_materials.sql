-- Darmowe materiały do pobrania (okładka + plik w R2)

create table if not exists public.free_materials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  tag text not null default '',
  cover_image_url text,
  is_video boolean not null default false,
  youtube_url text,
  r2_object_key text,
  file_name text not null default '',
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
    where tgname = 'free_materials_set_updated_at'
  ) then
    create trigger free_materials_set_updated_at
      before update on public.free_materials
      for each row execute function public.set_updated_at();
  end if;
end $$;

alter table public.free_materials enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'free_materials'
      and policyname = 'free_materials_admin_all'
  ) then
    create policy "free_materials_admin_all"
      on public.free_materials for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'free_materials'
      and policyname = 'free_materials_public_read'
  ) then
    create policy "free_materials_public_read"
      on public.free_materials for select to anon
      using (published = true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'free_materials'
      and policyname = 'free_materials_public_read_authenticated'
  ) then
    create policy "free_materials_public_read_authenticated"
      on public.free_materials for select to authenticated
      using (published = true);
  end if;
end $$;

insert into storage.buckets (id, name, public)
values ('free-material-covers', 'free-material-covers', true)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'free_material_covers_public_read'
  ) then
    create policy "free_material_covers_public_read"
      on storage.objects for select to anon
      using (bucket_id = 'free-material-covers');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'free_material_covers_admin_insert'
  ) then
    create policy "free_material_covers_admin_insert"
      on storage.objects for insert to authenticated
      with check (bucket_id = 'free-material-covers' and public.is_admin());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'free_material_covers_admin_update'
  ) then
    create policy "free_material_covers_admin_update"
      on storage.objects for update to authenticated
      using (bucket_id = 'free-material-covers' and public.is_admin());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'free_material_covers_admin_delete'
  ) then
    create policy "free_material_covers_admin_delete"
      on storage.objects for delete to authenticated
      using (bucket_id = 'free-material-covers' and public.is_admin());
  end if;
end $$;
