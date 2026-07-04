-- Konto pumalol22@gmail.com: rola user (nie admin)
-- Uwaga: użytkownik musi istnieć w auth.users (utwórz w Supabase Auth, jeśli go jeszcze nie ma).

insert into public.profiles (id, role)
select id, 'user'
from auth.users
where lower(email) = lower('pumalol22@gmail.com')
on conflict (id) do update
set role = 'user';
