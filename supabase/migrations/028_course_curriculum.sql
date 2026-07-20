-- Hierarchia programu kursu wideo: rozdział → podrozdział → podpodrozdział → lekcje (pliki R2)

create table if not exists public.course_curriculum_nodes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  parent_id uuid references public.course_curriculum_nodes (id) on delete cascade,
  kind text not null check (kind in ('section', 'lesson')),
  title text not null default '',
  sort_order integer not null default 0,
  r2_object_key text,
  created_at timestamptz not null default now(),
  constraint course_curriculum_lesson_requires_r2 check (
    kind = 'section'
    or (
      kind = 'lesson'
      and r2_object_key is not null
      and btrim(r2_object_key) <> ''
    )
  ),
  constraint course_curriculum_section_no_r2 check (
    kind = 'lesson'
    or r2_object_key is null
    or btrim(r2_object_key) = ''
  )
);

create index if not exists course_curriculum_nodes_course_parent_sort_idx
  on public.course_curriculum_nodes (course_id, parent_id, sort_order);

alter table public.course_curriculum_nodes enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'course_curriculum_nodes'
      and policyname = 'course_curriculum_nodes_admin_all'
  ) then
    create policy "course_curriculum_nodes_admin_all"
      on public.course_curriculum_nodes for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'course_curriculum_nodes'
      and policyname = 'course_curriculum_nodes_select_purchased'
  ) then
    create policy "course_curriculum_nodes_select_purchased"
      on public.course_curriculum_nodes for select to authenticated
      using (
        exists (
          select 1
          from public.course_purchases cp
          where cp.user_id = auth.uid()
            and cp.course_id = course_curriculum_nodes.course_id
        )
      );
  end if;
end $$;
