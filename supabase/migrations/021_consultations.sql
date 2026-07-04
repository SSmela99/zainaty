-- Rezerwacje konsultacji i wykluczenia terminów

create table if not exists public.consultation_bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text,
  scheduled_date date not null,
  scheduled_time text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (scheduled_date, scheduled_time)
);

create table if not exists public.consultation_exclusions (
  id uuid primary key default gen_random_uuid(),
  exclusion_date date not null,
  excluded_time text,
  created_at timestamptz not null default now()
);

create unique index if not exists consultation_exclusions_full_day_unique
  on public.consultation_exclusions (exclusion_date)
  where excluded_time is null;

create unique index if not exists consultation_exclusions_slot_unique
  on public.consultation_exclusions (exclusion_date, excluded_time)
  where excluded_time is not null;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'consultation_bookings_set_updated_at'
  ) then
    create trigger consultation_bookings_set_updated_at
      before update on public.consultation_bookings
      for each row execute function public.set_updated_at();
  end if;
end $$;

alter table public.consultation_bookings enable row level security;
alter table public.consultation_exclusions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'consultation_bookings'
      and policyname = 'consultation_bookings_public_insert'
  ) then
    create policy "consultation_bookings_public_insert"
      on public.consultation_bookings for insert to anon, authenticated
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'consultation_bookings'
      and policyname = 'consultation_bookings_admin_all'
  ) then
    create policy "consultation_bookings_admin_all"
      on public.consultation_bookings for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'consultation_exclusions'
      and policyname = 'consultation_exclusions_public_read'
  ) then
    create policy "consultation_exclusions_public_read"
      on public.consultation_exclusions for select to anon, authenticated
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'consultation_exclusions'
      and policyname = 'consultation_exclusions_admin_all'
  ) then
    create policy "consultation_exclusions_admin_all"
      on public.consultation_exclusions for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

create or replace function public.get_consultation_availability()
returns json
language sql
security definer
set search_path = public
stable
as $$
  select json_build_object(
    'booked_slots',
    coalesce(
      (
        select json_agg(
          json_build_object(
            'date', scheduled_date,
            'time', scheduled_time
          )
        )
        from public.consultation_bookings
      ),
      '[]'::json
    ),
    'exclusions',
    coalesce(
      (
        select json_agg(
          json_build_object(
            'date', exclusion_date,
            'time', excluded_time
          )
        )
        from public.consultation_exclusions
      ),
      '[]'::json
    )
  );
$$;

grant execute on function public.get_consultation_availability() to anon, authenticated;
