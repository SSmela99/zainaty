-- Linki zewnętrzne w darmowych treściach (zakładka „Linki”)

create table if not exists public.free_material_links (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  description text not null default '',
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
    where tgname = 'free_material_links_set_updated_at'
  ) then
    create trigger free_material_links_set_updated_at
      before update on public.free_material_links
      for each row execute function public.set_updated_at();
  end if;
end $$;

alter table public.free_material_links enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'free_material_links'
      and policyname = 'free_material_links_admin_all'
  ) then
    create policy "free_material_links_admin_all"
      on public.free_material_links for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'free_material_links'
      and policyname = 'free_material_links_public_read'
  ) then
    create policy "free_material_links_public_read"
      on public.free_material_links for select to anon
      using (published = true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'free_material_links'
      and policyname = 'free_material_links_public_read_authenticated'
  ) then
    create policy "free_material_links_public_read_authenticated"
      on public.free_material_links for select to authenticated
      using (published = true);
  end if;
end $$;
