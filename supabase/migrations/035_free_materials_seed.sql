-- 10 mockowych darmowych materiałów (7 plików z istniejących PDF w R2 + 3 wideo YouTube)
-- Pliki: klucze z course_files (file_type = pdf) — te same obiekty co w kursach.
-- Zależy od migracji 032–034 oraz od kursów z PDF w course_files.

do $$
begin
  if not exists (
    select 1
    from public.course_files
    where file_type = 'pdf'
      and btrim(r2_object_key) <> ''
  ) then
    raise exception
      'Migracja 035: brak PDF w course_files. Najpierw dodaj kurs z plikiem PDF w R2.';
  end if;
end $$;

insert into public.free_material_tags (id, name, slug)
values
  (
    '66666666-6666-4666-8666-666666666601'::uuid,
    'E-booki',
    'e-booki'
  ),
  (
    '66666666-6666-4666-8666-666666666602'::uuid,
    'Checklisty',
    'checklisty'
  ),
  (
    '66666666-6666-4666-8666-666666666603'::uuid,
    'Template''ki',
    'templateki'
  ),
  (
    '66666666-6666-4666-8666-666666666604'::uuid,
    'Kolorowanki',
    'kolorowanki'
  ),
  (
    '66666666-6666-4666-8666-666666666605'::uuid,
    'Wideo',
    'wideo'
  )
on conflict (id) do update
set name = excluded.name,
    slug = excluded.slug;

create temporary table _fm_pdf_library (
  ord integer primary key,
  r2_object_key text not null unique,
  file_name text not null
) on commit drop;

-- Najpierw DISTINCT ON (r2_object_key), potem row_number — inaczej
-- ON CONFLICT DO NOTHING zostawia dziury w ord (ten sam PDF w wielu kursach).
insert into _fm_pdf_library (ord, r2_object_key, file_name)
select
  row_number() over (order by src.first_seen, src.r2_object_key)::integer,
  src.r2_object_key,
  src.file_name
from (
  select distinct on (cf.r2_object_key)
    cf.r2_object_key,
    coalesce(
      nullif(regexp_replace(cf.r2_object_key, '^.*/', ''), ''),
      nullif(btrim(cf.title), '') || '.pdf',
      'material.pdf'
    ) as file_name,
    cf.created_at as first_seen
  from public.course_files cf
  where cf.file_type = 'pdf'
    and btrim(cf.r2_object_key) <> ''
  order by cf.r2_object_key, cf.created_at
) src;

create temporary table _fm_seed_meta (
  id uuid primary key,
  title text not null,
  description text not null,
  tag_id uuid not null,
  cover_image_url text not null,
  is_video boolean not null,
  youtube_url text,
  sort_order integer not null,
  file_slot integer
) on commit drop;

insert into _fm_seed_meta (
  id,
  title,
  description,
  tag_id,
  cover_image_url,
  is_video,
  youtube_url,
  sort_order,
  file_slot
)
values
  (
    '77777777-7777-4777-8777-777777777701'::uuid,
    'Promptownik ChatGPT — 50 gotowych poleceń',
    'Gotowe prompty do pracy, nauki i codziennych zadań. Skopiuj, wklej, działaj.',
    '66666666-6666-4666-8666-666666666601'::uuid,
    'https://picsum.photos/seed/zainaty-fm-promptownik/800/1000',
    false,
    null,
    100,
    1
  ),
  (
    '77777777-7777-4777-8777-777777777702'::uuid,
    'AI dla początkujących — krótki przewodnik',
    'Prosty e-book o tym, czym jest AI, jak zacząć i czego unikać na starcie.',
    '66666666-6666-4666-8666-666666666601'::uuid,
    'https://picsum.photos/seed/zainaty-fm-przewodnik/800/1000',
    false,
    null,
    90,
    2
  ),
  (
    '77777777-7777-4777-8777-777777777703'::uuid,
    'Audyt cyfrowego bałaganu',
    'Posprzątaj pulpit, maile, hasła i subskrypcje w 30 minut. Jedna strona A4.',
    '66666666-6666-4666-8666-666666666602'::uuid,
    'https://picsum.photos/seed/zainaty-fm-audyt/800/1000',
    false,
    null,
    80,
    3
  ),
  (
    '77777777-7777-4777-8777-777777777704'::uuid,
    'Przygotowanie do rozmowy o pracę',
    'Trzy etapy przygotowań: dzień przed, w dniu rozmowy i po rozmowie. Nic Ci nie umknie.',
    '66666666-6666-4666-8666-666666666602'::uuid,
    'https://picsum.photos/seed/zainaty-fm-rozmowa/800/1000',
    false,
    null,
    70,
    4
  ),
  (
    '77777777-7777-4777-8777-777777777705'::uuid,
    'Szablon CV — nowoczesny',
    'Czysty, profesjonalny układ. Podzielony na sekcje, gotowy do wypełnienia w Wordzie.',
    '66666666-6666-4666-8666-666666666603'::uuid,
    'https://picsum.photos/seed/zainaty-fm-cv/800/1000',
    false,
    null,
    60,
    5
  ),
  (
    '77777777-7777-4777-8777-777777777706'::uuid,
    'Planer tygodniowy — priorytety i cele',
    'Zaplanuj tydzień w 15 minut. Miejsce na 3 główne cele, zadania i notatki.',
    '66666666-6666-4666-8666-666666666603'::uuid,
    'https://picsum.photos/seed/zainaty-fm-planer/800/1000',
    false,
    null,
    50,
    6
  ),
  (
    '77777777-7777-4777-8777-777777777707'::uuid,
    'Kolorowanka: przyjazny robot AI',
    'Linia artystyczna do wydruku — idealna przerwa od ekranu dla dzieci i dorosłych.',
    '66666666-6666-4666-8666-666666666604'::uuid,
    'https://picsum.photos/seed/zainaty-fm-kolorowanka/800/1000',
    false,
    null,
    40,
    7
  ),
  (
    '77777777-7777-4777-8777-777777777708'::uuid,
    'Jak działają sieci neuronowe?',
    'Krótki, wizualny wstęp do sieci neuronowych — idealny na start.',
    '66666666-6666-4666-8666-666666666605'::uuid,
    'https://picsum.photos/seed/zainaty-fm-yt-nn/800/1000',
    true,
    'https://www.youtube.com/watch?v=aircAruvnKk',
    30,
    null
  ),
  (
    '77777777-7777-4777-8777-777777777709'::uuid,
    'Budujemy GPT od zera (wstęp)',
    'Andrej Karpathy pokazuje, jak krok po kroku zbudować prosty model językowy.',
    '66666666-6666-4666-8666-666666666605'::uuid,
    'https://picsum.photos/seed/zainaty-fm-yt-gpt/800/1000',
    true,
    'https://www.youtube.com/watch?v=kCc8FmEb1nY',
    20,
    null
  ),
  (
    '77777777-7777-4777-8777-777777777710'::uuid,
    'Czym jest ChatGPT? Wyjaśnienie dla każdego',
    'Przystępne wideo o tym, czym jest ChatGPT i do czego naprawdę się nadaje.',
    '66666666-6666-4666-8666-666666666605'::uuid,
    'https://picsum.photos/seed/zainaty-fm-yt-chatgpt/800/1000',
    true,
    'https://www.youtube.com/watch?v=JTxsNm9IdYU',
    10,
    null
  );

insert into public.free_materials (
  id,
  title,
  description,
  tag_id,
  cover_image_url,
  is_video,
  youtube_url,
  r2_object_key,
  file_name,
  sort_order,
  published
)
select
  m.id,
  m.title,
  m.description,
  m.tag_id,
  m.cover_image_url,
  m.is_video,
  m.youtube_url,
  case
    when m.is_video then null
    else (
      select p.r2_object_key
      from _fm_pdf_library p
      where p.ord = 1 + ((m.file_slot - 1) % (select count(*)::integer from _fm_pdf_library))
    )
  end,
  case
    when m.is_video then ''
    else coalesce(
      (
        select p.file_name
        from _fm_pdf_library p
        where p.ord = 1 + ((m.file_slot - 1) % (select count(*)::integer from _fm_pdf_library))
      ),
      'material.pdf'
    )
  end,
  m.sort_order,
  true
from _fm_seed_meta m
on conflict (id) do update
set title = excluded.title,
    description = excluded.description,
    tag_id = excluded.tag_id,
    cover_image_url = excluded.cover_image_url,
    is_video = excluded.is_video,
    youtube_url = excluded.youtube_url,
    r2_object_key = excluded.r2_object_key,
    file_name = excluded.file_name,
    sort_order = excluded.sort_order,
    published = excluded.published;
