-- Kody rabatowe na checkout (Stripe)

create table if not exists public.discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value numeric(10, 2) not null check (discount_value > 0),
  expires_at timestamptz,
  max_uses integer check (max_uses is null or max_uses > 0),
  used_count integer not null default 0 check (used_count >= 0),
  course_id uuid references public.courses (id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint discount_codes_code_unique unique (code),
  constraint discount_codes_percent_max check (
    discount_type <> 'percent' or discount_value <= 100
  )
);

create index if not exists discount_codes_code_idx
  on public.discount_codes (code);

create index if not exists discount_codes_active_idx
  on public.discount_codes (active);

alter table public.discount_codes enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'discount_codes'
      and policyname = 'discount_codes_admin_all'
  ) then
    create policy "discount_codes_admin_all"
      on public.discount_codes for all to authenticated
      using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

create or replace function public.increment_discount_code_usage(p_code_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_rows integer;
begin
  update public.discount_codes
  set
    used_count = used_count + 1,
    updated_at = now()
  where id = p_code_id
    and active = true
    and (expires_at is null or expires_at > now())
    and (max_uses is null or used_count < max_uses);

  get diagnostics updated_rows = row_count;
  return updated_rows > 0;
end;
$$;

revoke all on function public.increment_discount_code_usage(uuid) from public;
grant execute on function public.increment_discount_code_usage(uuid) to service_role;
