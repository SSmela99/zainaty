-- Pakiety szkoleń: drugi opis + lista kursów wchodzących w skład pakietu

alter table public.courses
  add column if not exists description_secondary text not null default '';

-- Kursy wchodzące w skład pakietu (many-to-many na tej samej tabeli courses)
create table if not exists public.course_package_items (
  package_id uuid not null references public.courses (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (package_id, course_id),
  constraint course_package_items_no_self check (package_id <> course_id)
);

create index if not exists course_package_items_package_idx
  on public.course_package_items (package_id, sort_order);

alter table public.course_package_items enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'course_package_items'
      and policyname = 'course_package_items_admin_all'
  ) then
    create policy "course_package_items_admin_all"
      on public.course_package_items for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'course_package_items'
      and policyname = 'course_package_items_public_read'
  ) then
    create policy "course_package_items_public_read"
      on public.course_package_items for select to anon
      using (
        exists (
          select 1 from public.courses c
          where c.id = course_package_items.package_id and c.published = true
        )
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'course_package_items'
      and policyname = 'course_package_items_public_read_authenticated'
  ) then
    create policy "course_package_items_public_read_authenticated"
      on public.course_package_items for select to authenticated
      using (
        exists (
          select 1 from public.courses c
          where c.id = course_package_items.package_id and c.published = true
        )
      );
  end if;
end $$;
