-- Tagi darmowych materiałów (osobna tabela + FK, jeden tag na materiał)

create table if not exists public.free_material_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  constraint free_material_tags_name_key unique (name),
  constraint free_material_tags_slug_key unique (slug)
);

alter table public.free_material_tags enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'free_material_tags'
      and policyname = 'free_material_tags_admin_all'
  ) then
    create policy "free_material_tags_admin_all"
      on public.free_material_tags for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'free_material_tags'
      and policyname = 'free_material_tags_public_read'
  ) then
    create policy "free_material_tags_public_read"
      on public.free_material_tags for select to anon
      using (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'free_material_tags'
      and policyname = 'free_material_tags_public_read_authenticated'
  ) then
    create policy "free_material_tags_public_read_authenticated"
      on public.free_material_tags for select to authenticated
      using (true);
  end if;
end $$;

alter table public.free_materials
  add column if not exists tag_id uuid references public.free_material_tags (id) on delete set null;

-- Migracja starych wartości text -> tagi (jeśli kolumna tag jeszcze istnieje)
do $$
declare
  row_record record;
  new_tag_id uuid;
  tag_slug text;
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'free_materials'
      and column_name = 'tag'
  ) then
    for row_record in
      select id, nullif(trim(tag), '') as tag_name
      from public.free_materials
      where nullif(trim(tag), '') is not null
        and tag_id is null
    loop
      tag_slug := lower(regexp_replace(
        translate(
          row_record.tag_name,
          'ĄĆĘŁŃÓŚŹŻąćęłńóśźż',
          'ACELNOSZZacelnoszz'
        ),
        '[^a-z0-9]+',
        '-',
        'g'
      ));
      tag_slug := trim(both '-' from tag_slug);

      if tag_slug = '' then
        continue;
      end if;

      select id into new_tag_id
      from public.free_material_tags
      where slug = tag_slug
      limit 1;

      if new_tag_id is null then
        insert into public.free_material_tags (name, slug)
        values (row_record.tag_name, tag_slug)
        returning id into new_tag_id;
      end if;

      update public.free_materials
      set tag_id = new_tag_id
      where id = row_record.id;
    end loop;

    alter table public.free_materials drop column tag;
  end if;
end $$;
