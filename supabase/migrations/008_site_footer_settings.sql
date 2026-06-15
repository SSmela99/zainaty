-- Ustawienia stopki (singleton: jeden wiersz id = 'default')
-- Uruchom w Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists public.site_footer_settings (
  id text primary key default 'default' check (id = 'default'),
  description text not null,
  social_facebook text not null default '',
  social_instagram text not null default '',
  social_linkedin text not null default '',
  social_youtube text not null default '',
  contact_line_1 text not null default '',
  contact_line_2 text not null default '',
  contact_line_3 text not null default '',
  contact_line_4 text not null default '',
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'site_footer_settings_set_updated_at'
  ) then
    create trigger site_footer_settings_set_updated_at
      before update on public.site_footer_settings
      for each row execute function public.set_updated_at();
  end if;
end $$;

alter table public.site_footer_settings enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'site_footer_settings'
      and policyname = 'site_footer_settings_authenticated_all'
  ) then
    create policy "site_footer_settings_authenticated_all"
      on public.site_footer_settings for all to authenticated
      using (true) with check (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'site_footer_settings'
      and policyname = 'site_footer_settings_public_read'
  ) then
    create policy "site_footer_settings_public_read"
      on public.site_footer_settings for select to anon
      using (true);
  end if;
end $$;

insert into public.site_footer_settings (
  id,
  description,
  social_facebook,
  social_instagram,
  social_linkedin,
  social_youtube,
  contact_line_1,
  contact_line_2,
  contact_line_3,
  contact_line_4
)
values (
  'default',
  'Uczymy, jak korzystać z technologii i AI bez stresu. Dla każdego — niezależnie od wieku i doświadczenia.',
  '',
  '',
  '',
  '',
  'ul. Przykładowa 123',
  '00-001 Warszawa',
  '+48 123 456 789',
  'kontakt@zainaty.pl'
)
on conflict (id) do nothing;
