-- Przykładowe dane: 5 autorów, 10 tagów, 10 artykułów
-- Uruchom w Supabase SQL Editor po migracjach 001–004

-- Autorzy
insert into public.authors (id, first_name, last_name, position, description, photo_url)
values
  (
    '11111111-1111-4111-8111-111111111101',
    'Marta',
    'Jabłońska',
    'Ekspertka AI',
    'Pomaga osobom początkującym wejść w świat sztucznej inteligencji bez stresu i technobełkotu.',
    'https://i.pravatar.cc/150?u=marta-jablonska'
  ),
  (
    '11111111-1111-4111-8111-111111111102',
    'Krzysztof',
    'Baran',
    'Trener produktywności',
    'Łączy codzienną pracę z narzędziami cyfrowymi — praktycznie, bez zbędnej teorii.',
    'https://i.pravatar.cc/150?u=krzysztof-baran'
  ),
  (
    '11111111-1111-4111-8111-111111111103',
    'Anna',
    'Kowalska',
    'Edukatorka cyfrowa',
    'Prowadzi warsztaty dla osób, które dopiero zaczynają przygodę z technologią.',
    'https://i.pravatar.cc/150?u=anna-kowalska'
  ),
  (
    '11111111-1111-4111-8111-111111111104',
    'Piotr',
    'Nowak',
    'Specjalista bezpieczeństwa',
    'Tłumaczy zagrożenia w sieci prostym językiem — bez straszenia, z konkretnymi radami.',
    'https://i.pravatar.cc/150?u=piotr-nowak'
  ),
  (
    '11111111-1111-4111-8111-111111111105',
    'Ewa',
    'Wiśniewska',
    'Autorka poradników',
    'Pisze o technologii dla każdego — niezależnie od wieku i doświadczenia.',
    'https://i.pravatar.cc/150?u=ewa-wisniewska'
  )
on conflict (id) do nothing;

-- Tagi
insert into public.tags (id, name, slug)
values
  ('22222222-2222-4222-8222-222222222201', 'AI dla początkujących', 'ai-dla-poczatkujacych'),
  ('22222222-2222-4222-8222-222222222202', 'Produktywność', 'produktywnosc'),
  ('22222222-2222-4222-8222-222222222203', 'Bezpieczeństwo', 'bezpieczenstwo'),
  ('22222222-2222-4222-8222-222222222204', 'Narzędzia', 'narzedzia'),
  ('22222222-2222-4222-8222-222222222205', 'Edukacja', 'edukacja'),
  ('22222222-2222-4222-8222-222222222206', 'ChatGPT', 'chatgpt'),
  ('22222222-2222-4222-8222-222222222207', 'Excel', 'excel'),
  ('22222222-2222-4222-8222-222222222208', 'Prywatność', 'prywatnosc'),
  ('22222222-2222-4222-8222-222222222209', 'Automatyzacja', 'automatyzacja'),
  ('22222222-2222-4222-8222-222222222210', 'Dla seniorów', 'dla-seniorow')
on conflict (slug) do nothing;

-- Artykuły
insert into public.blog_posts (
  id, title, slug, excerpt, content_html, cover_image_url,
  author_id, published, published_at, is_featured, reading_time_minutes
)
values
  (
    '33333333-3333-4333-8333-333333333301',
    'Jak zacząć z ChatGPT — poradnik krok po kroku',
    'jak-zaczac-z-chatgpt',
    'ChatGPT to jedno z najpotężniejszych narzędzi AI, z których możesz korzystać już dziś — za darmo. Sprawdź, jak zrobić pierwszy krok bez stresu.',
    '<blockquote>ChatGPT nie wymaga technicznej wiedzy — wymaga tylko ciekawości i kilku prostych nawyków.</blockquote><p>Załóż darmowe konto, napisz pierwsze pytanie po ludzku i sprawdź, jak AI odpowiada. Nie musisz znać skrótów ani angielskiego.</p><h2>Pierwsze kroki</h2><ul><li>Wejdź na stronę ChatGPT i załóż konto.</li><li>Napisz konkretne pytanie — im więcej kontekstu, tym lepsza odpowiedź.</li><li>Dopytuj i poprawiaj — rozmowa z AI to dialog, nie jednorazowe pytanie.</li></ul>',
    'https://picsum.photos/seed/zainaty-blog-1/1200/675',
    '11111111-1111-4111-8111-111111111101',
    true, '2025-05-12 10:00:00+00', false, 5
  ),
  (
    '33333333-3333-4333-8333-333333333302',
    '5 sposobów, by AI naprawdę pomogło Ci w pracy',
    '5-sposobow-by-ai-pomoglo-w-pracy',
    'Sztuczna inteligencja nie zastąpi Cię w pracy — ale może zdjąć z barków powtarzalne zadania. Oto pięć sprawdzonych sposobów.',
    '<blockquote>AI najlepiej sprawdza się tam, gdzie liczy się szybkość i powtarzalność — nie tam, gdzie potrzebujesz ludzkiego osądu.</blockquote><p>Zacznij od maili, notatek ze spotkań i streszczeń długich dokumentów. To najszybsze zwycięstwa.</p><h2>Pięć pomysłów na start</h2><ol><li>Streszczanie długich wiadomości e-mail.</li><li>Przygotowanie szkicu odpowiedzi klientowi.</li><li>Uporządkowanie notatek po spotkaniu.</li><li>Tłumaczenie krótkich tekstów.</li><li>Tworzenie checklist przed ważnymi zadaniami.</li></ol>',
    'https://picsum.photos/seed/zainaty-blog-2/1200/675',
    '11111111-1111-4111-8111-111111111102',
    true, '2025-05-05 10:00:00+00', false, 7
  ),
  (
    '33333333-3333-4333-8333-333333333303',
    'Bezpieczeństwo w internecie w 2025 roku — co naprawdę musisz wiedzieć',
    'bezpieczenstwo-w-internecie-2025',
    'Phishing, fałszywe SMS-y i podszywanie się pod znane marki — zagrożenia ewoluują, ale podstawowe zasady ochrony pozostają proste.',
    '<blockquote>Najskuteczniejsza ochrona to sceptycyzm i dwie minuty na sprawdzenie, zanim klikniesz.</blockquote><p>Nie otwieraj linków z podejrzanych wiadomości. Sprawdzaj nadawcę. Używaj unikalnych haseł.</p><h2>Trzy zasady na co dzień</h2><ul><li>Włącz weryfikację dwuetapową tam, gdzie to możliwe.</li><li>Nie podawaj kodów SMS nikomu — nawet „konsultantowi banku”.</li><li>Aktualizuj system i aplikacje regularnie.</li></ul>',
    'https://picsum.photos/seed/zainaty-blog-3/1200/675',
    '11111111-1111-4111-8111-111111111101',
    true, '2025-04-28 10:00:00+00', false, 8
  ),
  (
    '33333333-3333-4333-8333-333333333304',
    'Excel: 7 trików, które zaoszczędzą Ci godziny w pracy',
    'excel-7-trikow',
    'Filtrowanie, skróty klawiszowe i proste formuły — kilka nawyków, które robią ogromną różnicę w codziennej pracy z arkuszem.',
    '<blockquote>Excel nie musi być straszny — wystarczy kilka trików, by pracować szybciej i spokojniej.</blockquote><p>Zacznij od filtrów, zamrożenia pierwszego wiersza i skrótu Ctrl+Shift+L. Reszta przyjdzie naturalnie.</p><h2>Triki warte zapamiętania</h2><ol><li>Filtry — szybkie sortowanie danych.</li><li>Ctrl+D — kopiowanie komórki w dół.</li><li>Ctrl+Spacja — zaznaczenie całej kolumny.</li><li>Formatowanie warunkowe — kolorowe sygnały w tabeli.</li></ol>',
    'https://picsum.photos/seed/zainaty-blog-4/1200/675',
    '11111111-1111-4111-8111-111111111102',
    true, '2025-04-20 10:00:00+00', false, 6
  ),
  (
    '33333333-3333-4333-8333-333333333305',
    'Jak rozmawiać z AI, żeby dostawać lepsze odpowiedzi',
    'jak-rozmawiac-z-ai',
    'Kluczem do dobrych odpowiedzi nie jest magiczna formułka — to jasne pytanie, kontekst i chęć dopytywania.',
    '<blockquote>Im lepiej opiszesz sytuację, tym mniej poprawek będziesz musiał(a) robić później.</blockquote><p>Podaj cel, odbiorcę i format odpowiedzi. Poproś o wersję krótszą albo prostszą językowo.</p><h2>Co warto dopisać do pytania</h2><ul><li>Dla kogo jest odpowiedź?</li><li>Jaki ma być ton — formalny czy swobodny?</li><li>Ile ma mieć akapitów lub punktów?</li></ul>',
    'https://picsum.photos/seed/zainaty-blog-5/1200/675',
    '11111111-1111-4111-8111-111111111101',
    true, '2025-04-15 10:00:00+00', false, 5
  ),
  (
    '33333333-3333-4333-8333-333333333306',
    'Sztuczna inteligencja dla osób 60+ — bez strachu i bez presji',
    'ai-dla-seniorow',
    'Technologia nie jest „dla młodych”. AI może pomóc w codziennych sprawach — od planowania po przypomnienia i tłumaczenia.',
    '<blockquote>Nie musisz wiedzieć wszystkiego — wystarczy, że zaczniesz od jednej rzeczy, która Ci realnie pomaga.</blockquote><p>Poproś kogoś bliskiego o 15 minut wspólnej praktyki albo zapisz się na spokojne warsztaty bez presji tempa.</p><h2>Od czego zacząć</h2><ul><li>Proste pytania do asystenta głosowego lub ChatGPT.</li><li>Tłumaczenie wiadomości od rodziny zagranicą.</li><li>Listy zakupów i przypomnienia.</li></ul>',
    'https://picsum.photos/seed/zainaty-blog-6/1200/675',
    '11111111-1111-4111-8111-111111111103',
    true, '2025-04-10 10:00:00+00', false, 6
  ),
  (
    '33333333-3333-4333-8333-333333333307',
    'Najlepsze darmowe narzędzia AI na co dzień',
    'darmowe-narzedzia-ai',
    'Nie musisz płacić, żeby korzystać z AI. Zebraliśmy narzędzia, które sprawdzają się w praktyce — bez ukrytych pułapek.',
    '<blockquote>Darmowe nie znaczy gorsze — często w zupełności wystarczy na start.</blockquote><p>ChatGPT, Gemini, Claude — każde ma darmowy poziom. Wybierz jedno i używaj regularnie przez tydzień.</p><h2>Na co uważać</h2><ul><li>Limit wiadomości dziennie w darmowych planach.</li><li>Co wklejasz — unikaj danych wrażliwych.</li><li>Regulamin i polityka prywatności — warto rzucić okiem.</li></ul>',
    'https://picsum.photos/seed/zainaty-blog-7/1200/675',
    '11111111-1111-4111-8111-111111111105',
    true, '2025-04-05 10:00:00+00', false, 7
  ),
  (
    '33333333-3333-4333-8333-333333333308',
    'Jak chronić swoje dane przed phishingiem',
    'ochrona-przed-phishingiem',
    'Fałszywe maile wyglądają coraz wiarygodniej. Naucz się rozpoznawać sygnały alarmowe, zanim będzie za późno.',
    '<blockquote>Phishing liczy na pośpiech — zwolnij, zanim klikniesz.</blockquote><p>Sprawdź adres nadawcy, najedź na link bez klikania i porównaj z oficjalną stroną firmy.</p><h2>Czerwone flagi</h2><ul><li>Presja czasu — „konto zostanie zablokowane za godzinę”.</li><li>Błędy językowe i dziwne formy grzecznościowe.</li><li>Link prowadzący gdzie indziej niż sugeruje tekst.</li></ul>',
    'https://picsum.photos/seed/zainaty-blog-8/1200/675',
    '11111111-1111-4111-8111-111111111104',
    true, '2025-03-28 10:00:00+00', false, 5
  ),
  (
    '33333333-3333-4333-8333-333333333309',
    'Automatyzacja prostych zadań w biurze — od czego zacząć',
    'automatyzacja-w-biurze',
    'Powtarzalne zadania można częściowo zautomatyzować bez programowania — wystarczą proste narzędzia i dobra kolejność kroków.',
    '<blockquote>Automatyzuj to, co robisz co tydzień w ten sam sposób — reszta może poczekać.</blockquote><p>Zacznij od jednego procesu: np. przenoszenie załączników z maila do folderu albo cotygodniowy raport.</p><h2>Prosty plan</h2><ol><li>Wypisz powtarzalne zadania z ostatniego miesiąca.</li><li>Wybierz jedno najprostsze.</li><li>Sprawdź, czy Excel, Forms albo darmowe integracje wystarczą.</li></ol>',
    'https://picsum.photos/seed/zainaty-blog-9/1200/675',
    '11111111-1111-4111-8111-111111111102',
    true, '2025-03-20 10:00:00+00', false, 8
  ),
  (
    '33333333-3333-4333-8333-333333333310',
    'Dlaczego warto uczyć się technologii w każdym wieku',
    'technologia-w-kazdym-wieku',
    'Nauka nigdy się nie kończy — a technologia to dziś język, którym opisujemy codzienność. Bez presji i bez porównywania się z innymi.',
    '<blockquote>Tempo jest Twoje — liczy się regularność, nie szybkość.</blockquote><p>15 minut dziennie przez miesiąc daje więcej niż jednorazowy maraton na cały dzień.</p><h2>Co możesz zyskać</h2><ul><li>Większą samodzielność w urzędach i bankowości online.</li><li>Łatwiejszy kontakt z rodziną przez komunikatory.</li><li>Spokój — bo wiesz, jak reagować na podejrzane wiadomości.</li></ul>',
    'https://picsum.photos/seed/zainaty-blog-10/1200/675',
    '11111111-1111-4111-8111-111111111103',
    true, '2025-03-12 10:00:00+00', false, 4
  )
on conflict (slug) do nothing;

-- Tagi artykułów
insert into public.blog_post_tags (post_id, tag_id)
values
  ('33333333-3333-4333-8333-333333333301', '22222222-2222-4222-8222-222222222201'),
  ('33333333-3333-4333-8333-333333333301', '22222222-2222-4222-8222-222222222206'),
  ('33333333-3333-4333-8333-333333333302', '22222222-2222-4222-8222-222222222202'),
  ('33333333-3333-4333-8333-333333333302', '22222222-2222-4222-8222-222222222201'),
  ('33333333-3333-4333-8333-333333333303', '22222222-2222-4222-8222-222222222203'),
  ('33333333-3333-4333-8333-333333333303', '22222222-2222-4222-8222-222222222208'),
  ('33333333-3333-4333-8333-333333333304', '22222222-2222-4222-8222-222222222204'),
  ('33333333-3333-4333-8333-333333333304', '22222222-2222-4222-8222-222222222207'),
  ('33333333-3333-4333-8333-333333333305', '22222222-2222-4222-8222-222222222201'),
  ('33333333-3333-4333-8333-333333333305', '22222222-2222-4222-8222-222222222206'),
  ('33333333-3333-4333-8333-333333333306', '22222222-2222-4222-8222-222222222210'),
  ('33333333-3333-4333-8333-333333333306', '22222222-2222-4222-8222-222222222205'),
  ('33333333-3333-4333-8333-333333333307', '22222222-2222-4222-8222-222222222204'),
  ('33333333-3333-4333-8333-333333333307', '22222222-2222-4222-8222-222222222201'),
  ('33333333-3333-4333-8333-333333333308', '22222222-2222-4222-8222-222222222203'),
  ('33333333-3333-4333-8333-333333333308', '22222222-2222-4222-8222-222222222208'),
  ('33333333-3333-4333-8333-333333333309', '22222222-2222-4222-8222-222222222209'),
  ('33333333-3333-4333-8333-333333333309', '22222222-2222-4222-8222-222222222202'),
  ('33333333-3333-4333-8333-333333333310', '22222222-2222-4222-8222-222222222205'),
  ('33333333-3333-4333-8333-333333333310', '22222222-2222-4222-8222-222222222210')
on conflict do nothing;

-- Powiązane artykuły
insert into public.blog_post_related (post_id, related_post_id)
values
  ('33333333-3333-4333-8333-333333333301', '33333333-3333-4333-8333-333333333305'),
  ('33333333-3333-4333-8333-333333333301', '33333333-3333-4333-8333-333333333307'),
  ('33333333-3333-4333-8333-333333333302', '33333333-3333-4333-8333-333333333309'),
  ('33333333-3333-4333-8333-333333333303', '33333333-3333-4333-8333-333333333308'),
  ('33333333-3333-4333-8333-333333333305', '33333333-3333-4333-8333-333333333301'),
  ('33333333-3333-4333-8333-333333333306', '33333333-3333-4333-8333-333333333310'),
  ('33333333-3333-4333-8333-333333333307', '33333333-3333-4333-8333-333333333301'),
  ('33333333-3333-4333-8333-333333333308', '33333333-3333-4333-8333-333333333303')
on conflict do nothing;

-- Wyróżniony artykuł (indeks dopuszcza tylko jeden wpis z is_featured = true)
update public.blog_posts
set is_featured = false
where is_featured = true;

update public.blog_posts
set is_featured = true
where id = '33333333-3333-4333-8333-333333333301';
