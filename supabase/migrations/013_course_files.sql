-- Pliki kursów (PDF, wideo) — klucze obiektów w Cloudflare R2

create table if not exists public.course_files (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  file_type text not null check (file_type in ('pdf', 'video')),
  title text not null default '',
  r2_object_key text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint course_files_r2_object_key_unique unique (r2_object_key)
);

create index if not exists course_files_course_id_sort_idx
  on public.course_files (course_id, sort_order);

alter table public.course_files enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'course_files'
      and policyname = 'course_files_admin_all'
  ) then
    create policy "course_files_admin_all"
      on public.course_files for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- Użytkownik ma stały dostęp (course_purchases); link R2 jest krótkotrwały i generowany na żądanie.
