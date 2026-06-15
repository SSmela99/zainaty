-- FAQ: pytania i odpowiedzi
-- Uruchom w Supabase SQL Editor (Dashboard → SQL → New query)
-- Bezpieczne: tylko CREATE (bez DROP). Można uruchomić raz na świeżej bazie.

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
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
    where tgname = 'faq_items_set_updated_at'
  ) then
    create trigger faq_items_set_updated_at
      before update on public.faq_items
      for each row execute function public.set_updated_at();
  end if;
end $$;

alter table public.faq_items enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'faq_items'
      and policyname = 'faq_items_authenticated_all'
  ) then
    create policy "faq_items_authenticated_all"
      on public.faq_items for all to authenticated
      using (true) with check (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'faq_items'
      and policyname = 'faq_items_public_read'
  ) then
    create policy "faq_items_public_read"
      on public.faq_items for select to anon
      using (published = true);
  end if;
end $$;
