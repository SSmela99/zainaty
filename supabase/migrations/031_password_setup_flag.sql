-- Flaga: konto utworzone przy zakupie gościa wymaga ustawienia hasła przy pierwszym logowaniu.

alter table public.profiles
  add column if not exists needs_password_setup boolean not null default false;

comment on column public.profiles.needs_password_setup is
  'True gdy konto powstało przy zakupie bez logowania — użytkownik musi ustawić hasło przed dostępem do /konto.';
