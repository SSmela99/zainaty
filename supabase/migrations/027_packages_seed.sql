-- 6 mockowych pakietów szkoleń + przypisane kursy składowe.
-- Zależy od kursów z migracji 023 (slugi mock-*) oraz od migracji 026 (pakiety).

create temporary table _mock_packages_seed (
  id uuid primary key,
  title text not null,
  slug text not null unique,
  price numeric(10, 2) not null,
  discount_price numeric(10, 2),
  published boolean not null,
  sort_order integer not null,
  cover_image_url text not null,
  description text not null,
  description_secondary text not null
) on commit drop;

insert into _mock_packages_seed (
  id,
  title,
  slug,
  price,
  discount_price,
  published,
  sort_order,
  cover_image_url,
  description,
  description_secondary
)
values
  (
    '55555555-5555-4555-8555-555555555501'::uuid,
    'Pakiet Startowy: AI od zera',
    'pakiet-startowy-ai-od-zera',
    129.00,
    99.00,
    true,
    200,
    'https://picsum.photos/seed/zainaty-pkg-starter/1000/1250',
    E'Wszystko, czego potrzebujesz, by pewnie wystartować z AI — w jednym pakiecie. Trzy uzupełniające się kursy prowadzą Cię od pierwszych pojęć, przez zbudowanie własnego asystenta, po bezpieczne korzystanie z narzędzi.\n\nZamiast kupować kursy osobno, dostajesz spójną ścieżkę nauki w niższej cenie.',
    E'W pakiecie: „AI bez tajemnic”, „Twój pierwszy asystent AI” oraz „Bezpieczne korzystanie z AI”. Idealny dla osób, które dopiero zaczynają przygodę ze sztuczną inteligencją.'
  ),
  (
    '55555555-5555-4555-8555-555555555502'::uuid,
    'Pakiet Produktywność w pracy',
    'pakiet-produktywnosc-w-pracy',
    169.00,
    139.00,
    true,
    201,
    'https://picsum.photos/seed/zainaty-pkg-work/1000/1250',
    E'Odzyskaj godziny każdego tygodnia. Ten pakiet łączy praktyczne kursy o codziennej pracy z ChatGPT, tworzeniu notatek i podsumowań oraz szybki kurs wideo na start.\n\nKonkretne workflow, gotowe szablony i mniej rutynowych zadań.',
    E'W pakiecie: „ChatGPT w pracy”, „Notatki i podsumowania z AI” oraz „Wideo: ChatGPT w 30 minut”. Dla pracowników biurowych, specjalistów i managerów.'
  ),
  (
    '55555555-5555-4555-8555-555555555503'::uuid,
    'Pakiet dla Nauczycieli',
    'pakiet-dla-nauczycieli',
    189.00,
    149.00,
    true,
    202,
    'https://picsum.photos/seed/zainaty-pkg-teachers/1000/1250',
    E'Kompletny zestaw dla edukatorów, którzy chcą nowocześnie i odpowiedzialnie wykorzystywać AI w nauczaniu. Od tworzenia materiałów dydaktycznych, przez prezentacje, po produkcję kursów online.\n\nWięcej czasu dla ucznia, mniej papierologii.',
    E'W pakiecie: „AI dla nauczycieli”, „Wideo: AI w edukacji online” oraz „Wideo: Prezentacje z AI”. Dla nauczycieli, tutorów i twórców kursów.'
  ),
  (
    '55555555-5555-4555-8555-555555555504'::uuid,
    'Pakiet Marketing i Treści',
    'pakiet-marketing-i-tresci',
    239.00,
    189.00,
    true,
    203,
    'https://picsum.photos/seed/zainaty-pkg-marketing/1000/1250',
    E'Twórz treści szybciej i spójniej. Ten pakiet łączy marketing wspierany przez AI, tworzenie grafik oraz fundament dobrego promptowania — czyli wszystko, co robi różnicę w komunikacji marki.',
    E'W pakiecie: „AI w marketingu”, „Prompt engineering od podstaw” oraz „Wideo: Tworzenie obrazów z AI”. Dla marketerów i twórców treści.'
  ),
  (
    '55555555-5555-4555-8555-555555555505'::uuid,
    'Pakiet dla Firm i MŚP',
    'pakiet-dla-firm-msp',
    399.00,
    299.00,
    true,
    204,
    'https://picsum.photos/seed/zainaty-pkg-business/1000/1250',
    E'Wdróż AI w firmie mądrze i bez chaosu. Cztery kursy pokrywają operacje, HR, automatyzację i analizę danych — czyli obszary, w których AI przynosi największy zwrot w małej i średniej firmie.',
    E'W pakiecie: „AI w małej firmie”, „AI w HR i rekrutacji”, „Automatyzacja z AI” oraz „Analiza danych z AI”. Dla właścicieli firm i managerów zespołów.'
  ),
  (
    '55555555-5555-4555-8555-555555555506'::uuid,
    'Pakiet Pro: zaawansowane AI',
    'pakiet-pro-zaawansowane-ai',
    449.00,
    349.00,
    true,
    205,
    'https://picsum.photos/seed/zainaty-pkg-pro/1000/1250',
    E'Dla tych, którzy chcą iść dalej niż podstawy. Pakiet łączy pracę z kodem, zaawansowane promptowanie, analizę danych i strategiczne spojrzenie na przyszłość pracy z AI.',
    E'W pakiecie: „Kodowanie z asystentem AI”, „Prompt engineering od podstaw”, „Analiza danych z AI” oraz „Wideo: Przyszłość pracy z AI”. Dla zaawansowanych użytkowników i profesjonalistów.'
  );

insert into public.courses (
  id,
  title,
  slug,
  description,
  description_secondary,
  cover_image_url,
  kind,
  price,
  discount_price,
  format_label,
  published,
  is_featured,
  sort_order
)
select
  s.id,
  s.title,
  s.slug,
  s.description,
  s.description_secondary,
  s.cover_image_url,
  'package',
  s.price,
  s.discount_price,
  'Pakiet szkoleń',
  s.published,
  false,
  s.sort_order
from _mock_packages_seed s
on conflict (slug) do nothing;

update public.courses c
set
  title = s.title,
  description = s.description,
  description_secondary = s.description_secondary,
  cover_image_url = s.cover_image_url,
  kind = 'package',
  price = s.price,
  discount_price = s.discount_price,
  format_label = 'Pakiet szkoleń',
  published = s.published,
  sort_order = s.sort_order
from _mock_packages_seed s
where c.slug = s.slug;

-- Przypisanie kursów składowych do pakietów (po slugach kursów z migracji 023).
insert into public.course_package_items (package_id, course_id, sort_order)
select p.package_id, c.id, p.sort_order
from (
  values
    ('55555555-5555-4555-8555-555555555501'::uuid, 'mock-ai-bez-tajemnic', 0),
    ('55555555-5555-4555-8555-555555555501'::uuid, 'mock-pierwszy-asystent-ai', 1),
    ('55555555-5555-4555-8555-555555555501'::uuid, 'mock-bezpieczne-ai', 2),

    ('55555555-5555-4555-8555-555555555502'::uuid, 'mock-chatgpt-w-pracy', 0),
    ('55555555-5555-4555-8555-555555555502'::uuid, 'mock-notatki-ai', 1),
    ('55555555-5555-4555-8555-555555555502'::uuid, 'mock-wideo-chatgpt-30min', 2),

    ('55555555-5555-4555-8555-555555555503'::uuid, 'mock-ai-dla-nauczycieli', 0),
    ('55555555-5555-4555-8555-555555555503'::uuid, 'mock-wideo-edukacja-online', 1),
    ('55555555-5555-4555-8555-555555555503'::uuid, 'mock-wideo-prezentacje-ai', 2),

    ('55555555-5555-4555-8555-555555555504'::uuid, 'mock-ai-w-marketingu', 0),
    ('55555555-5555-4555-8555-555555555504'::uuid, 'mock-prompt-engineering', 1),
    ('55555555-5555-4555-8555-555555555504'::uuid, 'mock-wideo-obrazy-ai', 2),

    ('55555555-5555-4555-8555-555555555505'::uuid, 'mock-ai-mala-firma', 0),
    ('55555555-5555-4555-8555-555555555505'::uuid, 'mock-ai-hr', 1),
    ('55555555-5555-4555-8555-555555555505'::uuid, 'mock-automatyzacja-z-ai', 2),
    ('55555555-5555-4555-8555-555555555505'::uuid, 'mock-analiza-danych-ai', 3),

    ('55555555-5555-4555-8555-555555555506'::uuid, 'mock-kodowanie-ai', 0),
    ('55555555-5555-4555-8555-555555555506'::uuid, 'mock-prompt-engineering', 1),
    ('55555555-5555-4555-8555-555555555506'::uuid, 'mock-analiza-danych-ai', 2),
    ('55555555-5555-4555-8555-555555555506'::uuid, 'mock-wideo-przyszlosc-pracy', 3)
) as p(package_id, slug, sort_order)
join public.courses c on c.slug = p.slug
where exists (
  select 1 from public.courses pkg where pkg.id = p.package_id
)
on conflict (package_id, course_id) do nothing;
