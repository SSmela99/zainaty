-- Stały dostęp użytkownika do kursu po zakupie (entitlement)

create table if not exists public.course_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  purchased_at timestamptz not null default now(),
  constraint course_purchases_user_course_unique unique (user_id, course_id)
);

create index if not exists course_purchases_user_id_idx
  on public.course_purchases (user_id);

create index if not exists course_purchases_course_id_idx
  on public.course_purchases (course_id);

alter table public.course_purchases enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'course_purchases'
      and policyname = 'course_purchases_select_own'
  ) then
    create policy "course_purchases_select_own"
      on public.course_purchases for select to authenticated
      using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'course_purchases'
      and policyname = 'course_purchases_admin_all'
  ) then
    create policy "course_purchases_admin_all"
      on public.course_purchases for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- Zakup rejestrowany przez webhook płatności lub panel admina (requireAdmin).
-- Użytkownik ma stały dostęp; przy każdym pobraniu API generuje nowy krótki link R2.

create or replace function public.get_course_file_download_key(
  p_course_id uuid,
  p_file_id uuid
)
returns table (
  file_type text,
  title text,
  r2_object_key text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authorized';
  end if;

  if not public.is_admin() and not exists (
    select 1
    from public.course_purchases cp
    where cp.user_id = auth.uid()
      and cp.course_id = p_course_id
  ) then
    raise exception 'not authorized';
  end if;

  return query
  select cf.file_type, cf.title, cf.r2_object_key
  from public.course_files cf
  where cf.id = p_file_id
    and cf.course_id = p_course_id;
end;
$$;

revoke all on function public.get_course_file_download_key(uuid, uuid) from public;
grant execute on function public.get_course_file_download_key(uuid, uuid) to authenticated;
