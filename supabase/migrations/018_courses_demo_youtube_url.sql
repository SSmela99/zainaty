-- Opcjonalny link do podglądu wideo na YouTube (sekcja „Zobacz demo”)

alter table public.courses
  add column if not exists demo_youtube_url text;
