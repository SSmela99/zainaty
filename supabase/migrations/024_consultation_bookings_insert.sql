-- Publiczny zapis rezerwacji konsultacji (obejście problemów z RLS przy direct insert)

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'consultation_bookings'
      and policyname = 'consultation_bookings_public_insert'
  ) then
    create policy "consultation_bookings_public_insert"
      on public.consultation_bookings for insert to anon, authenticated
      with check (true);
  end if;
end $$;

create or replace function public.create_consultation_booking(
  p_name text,
  p_email text,
  p_phone text,
  p_message text,
  p_scheduled_date date,
  p_scheduled_time text
)
returns public.consultation_bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.consultation_bookings;
begin
  insert into public.consultation_bookings (
    name,
    email,
    phone,
    message,
    scheduled_date,
    scheduled_time
  )
  values (
    trim(p_name),
    trim(p_email),
    nullif(trim(coalesce(p_phone, '')), ''),
    nullif(trim(coalesce(p_message, '')), ''),
    p_scheduled_date,
    p_scheduled_time
  )
  returning * into result;

  return result;
exception
  when unique_violation then
    raise exception 'slot_taken';
end;
$$;

revoke all on function public.create_consultation_booking(
  text, text, text, text, date, text
) from public;

grant execute on function public.create_consultation_booking(
  text, text, text, text, date, text
) to anon, authenticated;
