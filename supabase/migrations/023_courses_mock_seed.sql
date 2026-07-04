-- 20 mockowych kursów — pliki skopiowane z kursu „test kurs”
-- Wymaga istniejącego kursu „test kurs” z co najmniej jednym wpisem w course_files.

do $$
begin
  if not exists (
    select 1
    from public.courses c
    inner join public.course_files cf on cf.course_id = c.id
    where lower(trim(c.title)) = 'test kurs'
       or c.slug in ('test-kurs', 'test-kursa')
  ) then
    raise exception
      'Migracja 023: nie znaleziono kursu „test kurs” z plikiem w course_files.';
  end if;
end $$;

alter table public.course_files
  drop constraint if exists course_files_r2_object_key_unique;

create temporary table _mock_courses_seed (
  id uuid primary key,
  title text not null,
  slug text not null unique,
  kind text not null,
  price numeric(10, 2) not null,
  discount_price numeric(10, 2),
  published boolean not null,
  is_featured boolean not null,
  sort_order integer not null,
  cover_image_url text not null,
  description text not null,
  target_audience text not null,
  learning_points text[] not null,
  outcomes text[] not null,
  duration_label text not null,
  format_label text not null
) on commit drop;

insert into _mock_courses_seed (
  id,
  title,
  slug,
  kind,
  price,
  discount_price,
  published,
  is_featured,
  sort_order,
  cover_image_url,
  description,
  target_audience,
  learning_points,
  outcomes,
  duration_label,
  format_label
)
values
  (
    '44444444-4444-4444-8444-444444444401'::uuid,
    'AI bez tajemnic',
    'mock-ai-bez-tajemnic',
    'training',
    49.00,
    39.00,
    true,
    true,
    100,
    'https://picsum.photos/seed/zainaty-course-ai-basics/1000/1250',
    E'Sztuczna inteligencja nie musi być skomplikowana. Ten kurs to spokojne, przystępne wprowadzenie do świata AI — bez żargonu, bez presji i bez wymogu wcześniejszej wiedzy technicznej.\n\nKrok po kroku wyjaśnimy, czym naprawdę jest AI, jak działają modele językowe i dlaczego narzędzia takie jak ChatGPT stały się tak popularne. Zamiast teorii dla inżynierów dostaniesz konkretne przykłady z życia codziennego: praca, nauka, planowanie i komunikacja.\n\nPo przejściu materiału będziesz wiedzieć, od czego zacząć, jakich błędów unikać i jak świadomie korzystać z AI jako wsparcia — nie zamiennika własnego myślenia.',
    'Dla osób, które słyszały o AI w mediach, ale nie wiedzą, od czego zacząć. Idealny dla początkujących, studentów, nauczycieli i każdego, kto chce zrozumieć temat bez technicznego żargonu.',
    array[
      'Czym jest sztuczna inteligencja i czym różni się od zwykłych programów',
      'Jak działają modele językowe — prosto i na przykładach',
      'Najpopularniejsze narzędzia AI i kiedy z nich korzystać',
      'Bezpieczne pierwsze kroki: co wpisywać, a czego unikać',
      'Typowe mity o AI i jak je rozwiać',
      'Jak oceniać odpowiedzi modelu i weryfikować informacje'
    ]::text[],
    array[
      'Swobodnie poruszasz się w podstawowych pojęciach AI',
      'Wiesz, które narzędzie wybrać do konkretnego zadania',
      'Potrafisz zadać pierwsze sensowne pytanie modelowi językowemu',
      'Rozpoznajesz ograniczenia AI i nie ufasz jej ślepo',
      'Masz plan dalszej nauki dopasowany do swoich potrzeb'
    ]::text[],
    '2 godziny',
    'E-book'
  ),
  (
    '44444444-4444-4444-8444-444444444402'::uuid,
    'Twój pierwszy asystent AI',
    'mock-pierwszy-asystent-ai',
    'training',
    59.00,
    null,
    true,
    true,
    101,
    'https://picsum.photos/seed/zainaty-course-ai-assistant/1000/1250',
    E'Wyobraź sobie asystenta, który zna Twoje priorytety, styl pisania i codzienne zadania — i jest dostępny 24 godziny na dobę. Ten kurs pokazuje, jak takiego asystenta zbudować od zera, krok po kroku.\n\nNie chodzi o skomplikowaną konfigurację, lecz o przemyślane ustawienia, dobre prompty startowe i proste reguły, które sprawiają, że AI naprawdę Ci pomaga. Pracujemy na realnych scenariuszach: plan dnia, maile, notatki ze spotkań i przygotowanie do prezentacji.\n\nNa końcu kursu masz gotowy „szablon asystenta”, który możesz dostosować do pracy, nauki lub życia prywatnego — i od razu zacząć z niego korzystać.',
    'Dla osób, które już próbowały ChatGPT, ale czują, że wyniki są przypadkowe. Dla freelancerów, managerów i studentów szukających stałego wsparcia w codziennych zadaniach.',
    array[
      'Jak zdefiniować rolę asystenta i jego styl odpowiedzi',
      'Tworzenie instrukcji systemowych, które naprawdę działają',
      'Biblioteka gotowych promptów na start: mail, plan, podsumowanie',
      'Jak „uczyć” asystenta na przykładach z Twojej branży',
      'Organizacja rozmów w wątki i szablony do powtarzalnych zadań',
      'Zasady prywatności — czego nie wrzucać do modelu'
    ]::text[],
    array[
      'Masz skonfigurowanego asystenta dopasowanego do Twoich potrzeb',
      'Oszczędzasz czas na powtarzalnych zadaniach każdego dnia',
      'Piszesz lepsze prompty i szybciej dostajesz użyteczne odpowiedzi',
      'Wiesz, jak rozwijać asystenta wraz z rosnącymi wymaganiami',
      'Korzystasz z AI świadomie i bezpiecznie'
    ]::text[],
    '3 godziny',
    'E-book'
  ),
  (
    '44444444-4444-4444-8444-444444444403'::uuid,
    'ChatGPT w pracy',
    'mock-chatgpt-w-pracy',
    'training',
    79.00,
    69.00,
    true,
    true,
    102,
    'https://picsum.photos/seed/zainaty-course-chatgpt-work/1000/1250',
    E'ChatGPT to dziś jedno z najpotężniejszych narzędzi biurowych — pod warunkiem, że wiesz, jak z niego korzystać. Ten kurs skupia się wyłącznie na praktyce w środowisku zawodowym: mniej teorii, więcej gotowych workflow.\n\nNauczysz się pisać maile, które brzmią profesjonalnie, przygotowywać notatki ze spotkań w kilka minut, streszczać długie dokumenty i planować tygodniowe priorytety. Każdy moduł kończy się szablonem promptu, który możesz wkleić od razu.\n\nTo materiał dla osób, które chcą realnie odzyskać godziny w tygodniu — bez rezygnacji z jakości i bez ryzyka, że AI zastąpi Twoje kompetencje.',
    'Dla pracowników biurowych, specjalistów, managerów i każdego, kto spędza dużo czasu na mailach, dokumentach i spotkaniach. Wystarczy podstawowa znajomość komputera.',
    array[
      'Profesjonalne maile: od szkicu po wersję finalną w trzech krokach',
      'Notatki ze spotkań, protokoły i lista zadań follow-up',
      'Streszczanie raportów, umów i długich wątków mailowych',
      'Planowanie tygodnia, priorytetyzacja i przygotowanie agendy',
      'Praca z szablonami firmowymi i zachowanie spójnego tonu',
      'Kiedy edytować odpowiedź AI, a kiedy pisać od nowa'
    ]::text[],
    array[
      'Codziennie oszczędzasz czas na rutynowej komunikacji',
      'Twoje maile i dokumenty są bardziej przejrzyste i profesjonalne',
      'Szybciej wracasz do głębokiej pracy po spotkaniach',
      'Masz bibliotekę promptów dopasowanych do Twojej roli',
      'Wiesz, jak unikać typowych błędów przy pracy z danymi firmowymi'
    ]::text[],
    '4 godziny',
    'E-book'
  ),
  (
    '44444444-4444-4444-8444-444444444404'::uuid,
    'AI dla nauczycieli',
    'mock-ai-dla-nauczycieli',
    'training',
    89.00,
    null,
    true,
    true,
    103,
    'https://picsum.photos/seed/zainaty-course-ai-teachers/1000/1250',
    E'Szkolna rzeczywistość to ciągły pościg za czasem: przygotowanie lekcji, sprawdzanie prac, indywidualizacja i dokumentacja. AI nie zastąpi nauczyciela — ale może odciążyć go w zadaniach, które zabierają godziny.\n\nW tym kursie pokażemy, jak tworzyć materiały dydaktyczne, quizy, ćwiczenia o różnym poziomie trudności i konstruktywny feedback dla uczniów. Wszystko z myślą o bezpieczeństwie, etyce i realnych potrzebach polskiej szkoły.\n\nTo praktyczny przewodnik dla pedagogów, którzy chcą nowoczesnie pracować, nie tracąc kontroli nad jakością i merytoryką lekcji.',
    'Dla nauczycieli szkół podstawowych i średnich, edukatorów, tutorów oraz osób prowadzących zajęcia dodatkowe. Nie wymaga znajomości programowania.',
    array[
      'Tworzenie planów lekcji i scenariuszy zajęć z wykorzystaniem AI',
      'Generowanie quizów, kart pracy i zadań o zróżnicowanym poziomie',
      'Personalizacja materiałów dla uczniów o różnych potrzebach',
      'Konstruktywny feedback do prac pisemnych i projektów',
      'Przygotowanie komunikatów dla rodziców i dokumentacji szkolnej',
      'Etyka i bezpieczeństwo: czego nie wolno robić z danymi uczniów'
    ]::text[],
    array[
      'Przygotowujesz lekcje znacznie szybciej, zachowując wysoką jakość',
      'Tworzysz zróżnicowane materiały dopasowane do poziomu klasy',
      'Masz gotowe szablony na quizy, ćwiczenia i podsumowania',
      'Wiesz, jak włączyć AI w proces nauczania odpowiedzialnie',
      'Więcej czasu zostaje na pracę z uczniem, nie z papierologią'
    ]::text[],
    '5 godzin',
    'E-book'
  ),
  (
    '44444444-4444-4444-8444-444444444405'::uuid,
    'Prompt engineering od podstaw',
    'mock-prompt-engineering',
    'training',
    99.00,
    79.00,
    true,
    true,
    104,
    'https://picsum.photos/seed/zainaty-course-prompt-eng/1000/1250',
    E'Dobra odpowiedź AI zaczyna się od dobrego pytania. Prompt engineering to umiejętność formułowania instrukcji tak, by model rozumiał kontekst, ton, format i oczekiwany rezultat — za pierwszym razem.\n\nW kursie przejdziemy od prostych zasad przez techniki few-shot, chain-of-thought i iteracyjne doskonalenie promptów. Każda lekcja zawiera przykłady „przed i po”, żebyś od razu widział różnicę w jakości wyników.\n\nTo fundament pod każdą dalszą pracę z AI — niezależnie od tego, czy używasz ChatGPT, Claude, Gemini czy innego modelu.',
    'Dla osób, które korzystają z AI regularnie, ale chcą przewidywalnych, wysokiej jakości wyników. Dla marketerów, analityków, programistów i twórców treści.',
    array[
      'Anatomia skutecznego promptu: rola, kontekst, zadanie, format',
      'Technika few-shot — uczenie modelu na przykładach',
      'Chain-of-thought: jak poprosić o rozumowanie krok po kroku',
      'Iteracja promptów: testowanie, porównywanie i ulepszanie',
      'Kontrola tonu, długości i struktury odpowiedzi',
      'Typowe pułapki i jak ich unikać w codziennej pracy'
    ]::text[],
    array[
      'Piszesz prompty, które dają przewidywalne, użyteczne wyniki',
      'Szybciej osiągasz jakość bez wielokrotnego poprawiania',
      'Rozumiesz, dlaczego jeden prompt działa, a inny zawodzi',
      'Potrafisz dostosować techniki do różnych modeli i zadań',
      'Budujesz własną bibliotekę sprawdzonych szablonów'
    ]::text[],
    '6 godzin',
    'E-book'
  ),
  (
    '44444444-4444-4444-8444-444444444406'::uuid,
    'Automatyzacja z AI',
    'mock-automatyzacja-z-ai',
    'training',
    119.00,
    null,
    true,
    true,
    105,
    'https://picsum.photos/seed/zainaty-course-automation/1000/1250',
    E'Powtarzalne zadania pochłaniają energię, której możesz użyć na rzeczy naprawdę ważne. Połączenie AI z prostymi automatyzacjami pozwala zbudować „cyfrowego pomocnika”, który działa w tle — sortuje maile, przygotowuje szkice, aktualizuje notatki i przypomina o terminach.\n\nTen kurs nie wymaga bycia programistą. Skupiamy się na praktycznych workflow z narzędziami dostępnymi dla każdego: od integracji no-code po inteligentne szablony z AI w środku procesu.\n\nZamiast teorii o automatyzacji dostajesz gotowe schematy, które możesz wdrożyć w ciągu jednego popołudnia.',
    'Dla profesjonalistów, freelancerów i właścicieli małych firm, którzy mają dość ręcznego kopiowania, przepisywania i powtarzania tych samych czynności.',
    array[
      'Mapowanie zadań do automatyzacji — co się opłaca, a co nie',
      'Łączenie AI z prostymi narzędziami no-code i arkuszami',
      'Automatyczne szkice maili, podsumowań i raportów',
      'Szablony workflow dla obsługi klienta i administracji',
      'Monitorowanie i poprawianie automatyzacji w czasie',
      'Bezpieczeństwo danych w zautomatyzowanych procesach'
    ]::text[],
    array[
      'Identyfikujesz zadania, które można zautomatyzować już dziś',
      'Budujesz proste workflow oszczędzające godziny tygodniowo',
      'Łączysz AI z narzędziami, z których już korzystasz',
      'Masz checklistę wdrożenia i utrzymania automatyzacji',
      'Mniej ręcznej pracy — więcej czasu na rozwój i klientów'
    ]::text[],
    '4 godziny',
    'E-book'
  ),
  (
    '44444444-4444-4444-8444-444444444407'::uuid,
    'AI w marketingu',
    'mock-ai-w-marketingu',
    'training',
    129.00,
    99.00,
    true,
    true,
    106,
    'https://picsum.photos/seed/zainaty-course-marketing/1000/1250',
    E'Marketing w erze AI to nie kolejny buzzword — to realna przewaga, jeśli wiesz, jak łączyć kreatywność człowieka z szybkością maszyny. Ten kurs pokazuje, jak tworzyć treści, planować kampanie i analizować wyniki z wykorzystaniem nowoczesnych narzędzi AI.\n\nOd postów na social media, przez landing page’e i newslettery, po analizę konkurencji i persony klienta — każdy moduł kończy się gotowymi szablonami promptów dopasowanymi do polskiego rynku.\n\nNie zastępujemy strategii marketingowej — pomagamy ją wykonywać szybciej, spójniej i z lepszym wyczuciem odbiorcy.',
    'Dla marketerów, social media managerów, właścicieli marek osobistych i osób odpowiedzialnych za komunikację w małych zespołach.',
    array[
      'Copywriting z AI: posty, nagłówki, CTA i warianty A/B',
      'Planowanie kalendarza contentowego i serii publikacji',
      'Tworzenie person, map podróży klienta i propozycji wartości',
      'Analiza konkurencji i inspiracji bez kopiowania',
      'Newslettery, opisy produktów i treści SEO-friendly',
      'Jak zachować autentyczny głos marki przy wsparciu AI'
    ]::text[],
    array[
      'Tworzysz kampanie i treści znacznie szybciej niż wcześniej',
      'Masz spójny ton komunikacji we wszystkich kanałach',
      'Testujesz więcej wariantów bez proporcjonalnego wzrostu pracy',
      'Lepiej rozumiesz odbiorcę dzięki analizom wspieranym przez AI',
      'Wiesz, gdzie AI pomaga, a gdzie potrzebna jest ludzka kreatywność'
    ]::text[],
    '5 godzin',
    'E-book'
  ),
  (
    '44444444-4444-4444-8444-444444444408'::uuid,
    'Bezpieczne korzystanie z AI',
    'mock-bezpieczne-ai',
    'training',
    49.00,
    null,
    true,
    true,
    107,
    'https://picsum.photos/seed/zainaty-course-ai-security/1000/1250',
    E'Im bardziej korzystamy z AI, tym ważniejsze staje się bezpieczeństwo — własne, firmowe i naszych klientów. Ten kurs to praktyczny przewodnik po ryzykach, dobrych praktykach i świadomym używaniu modeli językowych bez strachu i bez paranoi.\n\nOmawiamy, jakie dane można wprowadzać do AI, a jakich nigdy nie wolno, jak czytać polityki prywatności narzędzi i jak budować proste zasady dla zespołu. Bez prawniczego żargonu, za to z konkretnymi przykładami z życia.\n\nTo obowiązkowa lektura dla każdego, kto używa AI w pracy — niezależnie od branży i poziomu zaawansowania.',
    'Dla wszystkich użytkowników AI — od freelancerów po managerów i właścicieli firm. Szczególnie polecany zespołom, które dopiero wdrażają narzędzia AI.',
    array[
      'Jakie dane są wrażliwe i czego nie wrzucać do modelu',
      'Polityki prywatności narzędzi AI — na co zwracać uwagę',
      'Ryzyka halucynacji, błędów merytorycznych i deepfake’ów',
      'Proste zasady AI dla zespołu i firmy',
      'RODO i dane klientów w kontekście narzędzi chmurowych',
      'Jak bezpiecznie weryfikować odpowiedzi modelu'
    ]::text[],
    array[
      'Wiesz, co możesz, a czego nie powinieneś udostępniać AI',
      'Chronisz siebie, firmę i klientów przed typowymi błędami',
      'Potrafisz ocenić ryzyko konkretnego narzędzia lub scenariusza',
      'Masz gotowy zestaw zasad do wdrożenia w zespole',
      'Korzystasz z AI pewnie — ze świadomością ograniczeń'
    ]::text[],
    '2 godziny',
    'E-book'
  ),
  (
    '44444444-4444-4444-8444-444444444409'::uuid,
    'Wideo: Wprowadzenie do AI',
    'mock-wideo-wprowadzenie-ai',
    'video',
    69.00,
    59.00,
    true,
    false,
    108,
    'https://picsum.photos/seed/zainaty-course-video-intro/1000/1250',
    E'Krótkie, dynamiczne wideo, które w mniej niż godzinę wprowadzi Cię w świat sztucznej inteligencji. Bez slajdów pełnych definicji — za to z konkretnymi przykładami, które od razu możesz wypróbować.\n\nZobaczysz, skąd wzięła się obecna fala AI, jak działają modele językowe w praktyce i gdzie szukać narzędzi dopasowanych do Twoich potrzeb. Każda sekcja kończy się mini-zadaniem do wykonania samodzielnie.\n\nIdealny start przed głębszymi kursami lub jako szybki przegląd dla zespołu, który dopiero poznaje temat.',
    'Dla początkujących, którzy wolą uczyć się z wideo niż z e-booka. Dla managerów chcących szybko zrozumieć temat przed wdrożeniem w firmie.',
    array[
      'Historia AI — od pierwszych badań do ChatGPT',
      'Jak działa model językowy wytłumaczony na palcach',
      'Przegląd najpopularniejszych narzędzi i ich zastosowań',
      'Pierwsze ćwiczenie: trzy prompty, które musisz znać',
      'Trendy na najbliższe lata i co to znaczy dla Ciebie',
      'Gdzie szukać dalszej wiedzy i jak nie zgubić się w hype’ie'
    ]::text[],
    array[
      'Masz klarowny obraz tego, czym jest współczesna AI',
      'Wiesz, od którego narzędzia zacząć swoją przygodę',
      'Potrafisz wytłumaczyć podstawy AI innym osobom',
      'Rozpoznajesz realne zastosowania vs. marketingowe obietnice',
      'Masz plan kolejnych kroków w nauce'
    ]::text[],
    '45 min',
    'Wideo'
  ),
  (
    '44444444-4444-4444-8444-444444444410'::uuid,
    'Wideo: ChatGPT w 30 minut',
    'mock-wideo-chatgpt-30min',
    'video',
    79.00,
    null,
    true,
    false,
    109,
    'https://picsum.photos/seed/zainaty-course-video-chatgpt/1000/1250',
    E'Nie masz czasu na długi kurs? To wideo to intensywny sprint przez ChatGPT — od pierwszego logowania do gotowych workflow, które od razu wdrożysz w pracy.\n\nPokażemy interfejs, sposób prowadzenia rozmów, eksport wyników i trzy scenariusze, które przynoszą największą wartość: mail, podsumowanie dokumentu i plan zadań. Wszystko na żywo, bez cięć do slajdów z teorii.\n\nPo 30 minutach będziesz wiedzieć więcej niż większość osób, które „tylko czasem zaglądają” do ChatGPT.',
    'Dla zabieganych początkujących i osób, które chcą szybko przejść od ciekawości do codziennego użytkowania ChatGPT.',
    array[
      'Konfiguracja konta i pierwsze kroki w interfejsie',
      'Jak prowadzić rozmowę, żeby dostawać lepsze odpowiedzi',
      'Eksport, kopiowanie i zapisywanie przydatnych wyników',
      'Workflow: profesjonalny mail w 2 minuty',
      'Workflow: streszczenie długiego tekstu',
      'Workflow: plan dnia i lista priorytetów'
    ]::text[],
    array[
      'Swobodnie poruszasz się po interfejsie ChatGPT',
      'Masz trzy gotowe scenariusze do codziennego użytku',
      'Wiesz, jak formułować pytania, by nie tracić czasu',
      'Potrafisz ocenić, kiedy odpowiedź wymaga poprawy',
      'Zaczynasz korzystać z ChatGPT regularnie, nie od czasu do czasu'
    ]::text[],
    '30 min',
    'Wideo'
  ),
  (
    '44444444-4444-4444-8444-444444444411'::uuid,
    'Wideo: AI dla freelancerów',
    'mock-wideo-ai-freelancer',
    'video',
    89.00,
    79.00,
    true,
    false,
    110,
    'https://picsum.photos/seed/zainaty-course-video-freelance/1000/1250',
    E'Jako freelancer jesteś jednoosobową firmą — sprzedaż, realizacja, księgowość i marketing spoczywają na Tobie. AI może stać się Twoim cichym partnerem, który przejmuje część administracji i przyspiesza pracę kreatywną.\n\nW tym wideo pokazujemy konkretne zastosowania: oferty dla klientów, follow-upy, faktury, briefy projektowe i komunikacja w trudnych sytuacjach. Każdy przykład oparty jest na realnych sytuacjach freelancerów z różnych branż.\n\nWięcej czasu na projekty, mniej na papierologię — o to w tym kursie chodzi.',
    'Dla freelancerów, konsultantów, projektantów, copywriterów i każdego, kto pracuje na własny rachunek i chce rosnąć bez zatrudniania asystenta.',
    array[
      'Pisanie ofert i wycen, które brzmią profesjonalnie',
      'Follow-upy, negocjacje i trudne rozmowy z klientami',
      'Faktury, przypomnienia o płatnościach i dokumentacja',
      'Briefy projektowe i planowanie realizacji',
      'Portfolio, case study i treści promocyjne z AI',
      'Jak nie oddać AI kontroli nad Twoim unikalnym stylem'
    ]::text[],
    array[
      'Szybciej przygotowujesz oferty i dokumenty dla klientów',
      'Masz szablony na najczęstsze sytuacje freelancerskie',
      'Lepsza komunikacja bez godzin spędzonych nad każdym mailem',
      'Więcej czasu na płatne projekty i rozwój kompetencji',
      'Profesjonalny wizerunek bez zatrudniania zespołu wsparcia'
    ]::text[],
    '1 godzina',
    'Wideo'
  ),
  (
    '44444444-4444-4444-8444-444444444412'::uuid,
    'Wideo: Tworzenie obrazów z AI',
    'mock-wideo-obrazy-ai',
    'video',
    99.00,
    null,
    true,
    false,
    111,
    'https://picsum.photos/seed/zainaty-course-video-images/1000/1250',
    E'Grafiki, ilustracje, mockupy i koncepcje wizualne — generatory obrazów AI otwierają zupełnie nowe możliwości dla twórców, marketerów i przedsiębiorców. Ten kurs wideo pokazuje, jak z nich korzystać mądrze i legalnie.\n\nPrzejdziemy przez wybór narzędzia, pisanie promptów wizualnych, style, kompozycję i podstawy praw autorskich. Na końcu stworzysz własny zestaw grafik dopasowanych do Twojej marki lub projektu.\n\nNie musisz być grafikiem — wystarczy ciekawość i chęć eksperymentowania.',
    'Dla twórców treści, marketerów, właścicieli małych firm i osób kreatywnych, które chcą tworzyć własne materiały wizualne bez drogiego studia graficznego.',
    array[
      'Przegląd popularnych generatorów obrazów i ich mocnych stron',
      'Pisanie promptów wizualnych: styl, kompozycja, światło',
      'Iteracja i poprawianie wyników krok po kroku',
      'Grafiki do social media, bloga i prezentacji',
      'Podstawy praw autorskich i licencji przy obrazach AI',
      'Jak zachować spójny styl wizualny marki'
    ]::text[],
    array[
      'Samodzielnie tworzysz atrakcyjne grafiki do swoich projektów',
      'Wiesz, które narzędzie wybrać do danego typu obrazu',
      'Rozumiesz ograniczenia prawne i etyczne generowania obrazów',
      'Masz zestaw promptów na najczęstsze potrzeby wizualne',
      'Oszczędzasz na stockach i zleceniach graficznych'
    ]::text[],
    '1,5 godziny',
    'Wideo'
  ),
  (
    '44444444-4444-4444-8444-444444444413'::uuid,
    'AI w małej firmie',
    'mock-ai-mala-firma',
    'training',
    139.00,
    119.00,
    true,
    false,
    112,
    'https://picsum.photos/seed/zainaty-course-small-business/1000/1250',
    E'Mała firma nie ma luksusu marnowania czasu — każda godzina ma znaczenie. AI pozwala zespołowi pięciu osób pracować jak dziesięcioosobowy, bez zatrudniania kolejnych specjalistów.\n\nTen kurs pokazuje, jak wdrożyć AI w procesach sprzedaży, obsługi klienta, dokumentacji i komunikacji wewnętrznej. Konkretne scenariusze, gotowe szablony i plan wdrożenia krok po kroku — od pierwszego pilotażu po pełne wykorzystanie w zespole.\n\nTo praktyczny przewodnik dla przedsiębiorców, którzy chcą rosnąć mądrze, a nie tylko szybko.',
    'Dla właścicieli małych firm, managerów zespołów do 20 osób i osób odpowiedzialnych za operacje i rozwój biznesu.',
    array[
      'Mapowanie procesów firmy pod kątem oszczędności z AI',
      'Obsługa klienta: odpowiedzi, FAQ i eskalacje',
      'Dokumentacja, procedury i onboarding pracowników',
      'Sprzedaż: oferty, follow-upy i propozycje wartości',
      'Komunikacja wewnętrzna i podsumowania spotkań zespołu',
      'Plan wdrożenia AI w firmie bez chaosu i oporu zespołu'
    ]::text[],
    array[
      'Wiesz, gdzie AI przyniesie największy zwrot w Twojej firmie',
      'Masz gotowe szablony na kluczowe procesy biznesowe',
      'Potrafisz wdrożyć pilotaż AI w kilka dni, nie miesięcy',
      'Zespół rozumie zasady i korzyści — bez strachu przed technologią',
      'Skalujesz firmę bez proporcjonalnego wzrostu kosztów administracji'
    ]::text[],
    '6 godzin',
    'E-book'
  ),
  (
    '44444444-4444-4444-8444-444444444414'::uuid,
    'Notatki i podsumowania z AI',
    'mock-notatki-ai',
    'training',
    59.00,
    null,
    true,
    false,
    113,
    'https://picsum.photos/seed/zainaty-course-notes/1000/1250',
    E'Spotkania, wykłady, podcasty, długie artykuły — informacji jest więcej, niż zdążymy przetworzyć. Ten kurs uczy, jak zamieniać chaos notatek w przejrzyste podsumowania, listy zadań i uporządkowaną wiedzę.\n\nPokażemy techniki pracy z transkrypcjami, nagraniami i tekstami źródłowymi. Nauczysz się wyciągać esencję, wyróżniać decyzje i action items — bez gubienia kontekstu.\n\nIdealny dla osób, które dużo słuchają, czytają i uczestniczą w spotkaniach, a chcą więcej z tego wyciągnąć w krótszym czasie.',
    'Dla managerów, studentów, badaczy, dziennikarzy i każdego, kto codziennie przetwarza duże ilości informacji tekstowej lub audio.',
    array[
      'Podsumowania spotkań: decyzje, zadania, odpowiedzialni',
      'Praca z transkrypcjami nagrań i nagrań wideo',
      'Streszczanie artykułów, raportów i długich dokumentów',
      'Tworzenie notatek studyjnych i map myśli z AI',
      'Wyróżnianie action items i terminów z luźnych notatek',
      'Organizacja wiedzy w powtarzalny system'
    ]::text[],
    array[
      'W kilka minut zamieniasz godzinne spotkanie w przejrzyste notatki',
      'Nie gubisz ustaleń ani zadań follow-up',
      'Szybciej uczysz się z materiałów i publikacji',
      'Masz system przechowywania i przeszukiwania wiedzy',
      'Mniej stresu po intensywnym dniu pełnym informacji'
    ]::text[],
    '3 godziny',
    'E-book'
  ),
  (
    '44444444-4444-4444-8444-444444444415'::uuid,
    'AI w HR i rekrutacji',
    'mock-ai-hr',
    'training',
    149.00,
    null,
    true,
    false,
    114,
    'https://picsum.photos/seed/zainaty-course-hr/1000/1250',
    E'Rekrutacja to jeden z najbardziej czasochłonnych procesów w firmie — a jednocześnie ten, w którym jakość komunikacji decyduje o tym, czy zatrzymasz najlepszych kandydatów. AI może przyspieszyć screening, pisanie ogłoszeń i onboarding bez utraty ludzkiego podejścia.\n\nKurs obejmuje cały cykl: od atrakcyjnego ogłoszenia o pracę, przez analizę CV i pytania rekrutacyjne, po materiały powitalne dla nowych pracowników. Z naciskiem na etykę, równość szans i zgodność z prawem pracy.\n\nDla HR-owców, rekruterów i managerów, którzy sami prowadzą nabór w mniejszych zespołach.',
    'Dla specjalistów HR, rekruterów, managerów zatrudniających i właścicieli firm budujących zespół od podstaw.',
    array[
      'Pisanie ogłoszeń o pracę, które przyciągają właściwych kandydatów',
      'Screening CV i wstępna selekcja z zachowaniem bezstronności',
      'Przygotowanie pytań rekrutacyjnych i scenariuszy rozmów',
      'Feedback dla kandydatów — konstruktywny i profesjonalny',
      'Onboarding: materiały powitalne, checklisty i pierwsze dni',
      'Etyka AI w rekrutacji i unikanie dyskryminacji algorytmicznej'
    ]::text[],
    array[
      'Skracasz czas rekrutacji bez obniżania jakości procesu',
      'Piszesz lepsze ogłoszenia i komunikaty do kandydatów',
      'Masz sprawdzone szablony na każdy etap hiringu',
      'Nowi pracownicy szybciej się wdrażają dzięki lepszym materiałom',
      'Działasz zgodnie z zasadami etyki i prawa pracy'
    ]::text[],
    '5 godzin',
    'E-book'
  ),
  (
    '44444444-4444-4444-8444-444444444416'::uuid,
    'Wideo: Prezentacje z AI',
    'mock-wideo-prezentacje-ai',
    'video',
    109.00,
    89.00,
    true,
    false,
    115,
    'https://picsum.photos/seed/zainaty-course-video-presentations/1000/1250',
    E'Prezentacja, która zachwyca, nie musi zajmować całego weekendu. To wideo pokazuje, jak z AI przygotować slajdy, narrację i strukturę wystąpienia — od pierwszego pomysłu do gotowego decka.\n\nOmawiamy dobór narzędzi, pisanie outline’u, treść slajdów, notatki dla prelegenta i design, który nie wygląda jak „wygenerowany przez robot”. Pracujemy na przykładzie realnej prezentacji biznesowej.\n\nPo obejrzeniu będziesz szybciej przygotowywać wystąpienia na spotkania, konferencje i pitchu inwestorskiego.',
    'Dla managerów, sprzedawców, prelegentów i studentów, którzy regularnie przygotowują prezentacje i chcą robić to szybciej bez utraty jakości.',
    array[
      'Struktura prezentacji: hook, rozwinięcie, wezwanie do działania',
      'Generowanie outline’u i treści slajdów z AI',
      'Notatki prelegenta i narracja między slajdami',
      'Design i spójność wizualna bez bycia grafikiem',
      'Ćwiczenie pitcha i skracanie prezentacji pod limit czasu',
      'Typowe błędy prezentacji „z AI” i jak ich unikać'
    ]::text[],
    array[
      'Przygotowujesz profesjonalne prezentacje w ułamku dotychczasowego czasu',
      'Masz sprawdzoną strukturę na każdy typ wystąpienia',
      'Twoje slajdy są czytelne, spójne i angażujące',
      'Lepiej opanowujesz narrację dzięki notatkom wspartym przez AI',
      'Mniej stresu przed ważnymi spotkaniami i wystąpieniami'
    ]::text[],
    '50 min',
    'Wideo'
  ),
  (
    '44444444-4444-4444-8444-444444444417'::uuid,
    'Kodowanie z asystentem AI',
    'mock-kodowanie-ai',
    'training',
    169.00,
    149.00,
    true,
    false,
    116,
    'https://picsum.photos/seed/zainaty-course-coding/1000/1250',
    E'Asystenci AI zmieniają sposób, w jaki programiści pracują — od pisania boilerplate’u po debugowanie i refaktoryzację. Ten kurs to praktyczny przewodnik pair programmingu z modelem językowym dla developerów na każdym poziomie.\n\nNie uczymy programowania od zera — pokazujemy, jak włączyć AI w istniejący workflow: code review, testy, dokumentację, migracje i rozwiązywanie błędów. Z naciskiem na jakość kodu i odpowiedzialność za to, co akceptujesz.\n\nTo must-have dla każdego, kto pisze kod w 2025 roku i nie chce zostać w tyle.',
    'Dla programistów junior, mid i senior, którzy chcą realnie przyspieszyć pracę z AI bez obniżania standardów jakości kodu.',
    array[
      'Pair programming z AI: kiedy ufać, a kiedy weryfikować',
      'Debugowanie błędów z kontekstem stack trace i logów',
      'Refaktoryzacja i migracje z kontrolą regresji',
      'Generowanie testów jednostkowych i integracyjnych',
      'Dokumentacja kodu, README i komentarze',
      'Bezpieczeństwo: sekrety, zależności i code review AI-generowanego kodu'
    ]::text[],
    array[
      'Szybciej rozwiązujesz problemy i piszesz boilerplate',
      'Lepsze testy i dokumentacja bez dodatkowych godzin',
      'Wiesz, jak oceniać kod wygenerowany przez model',
      'Masz workflow pair programmingu dopasowany do Twojego stacku',
      'Rozwijasz się jako developer, a nie tylko „akceptujesz sugestie”'
    ]::text[],
    '8 godzin',
    'E-book'
  ),
  (
    '44444444-4444-4444-8444-444444444418'::uuid,
    'Wideo: AI w edukacji online',
    'mock-wideo-edukacja-online',
    'video',
    119.00,
    null,
    true,
    false,
    117,
    'https://picsum.photos/seed/zainaty-course-video-edu/1000/1250',
    E'Twórcy kursów online stoją przed wyzwaniem: produkować jakościowe materiały szybciej, taniej i bez wypalenia. AI może pomóc w scenariuszach, slajdach, quizach i promocji — pod warunkiem, że wiesz, jak zachować swój autentyczny głos.\n\nTo wideo prowadzi przez cały proces tworzenia lekcji: od pomysłu i outline’u, przez nagranie i montaż, po materiały uzupełniające i marketing kursu. Konkretne narzędzia, realne przykłady, zero pustych obietnic.\n\nDla edukatorów, coachów i ekspertów, którzy chcą skalować swoją wiedzę w formie kursów online.',
    'Dla twórców kursów, coachów, trenerów i ekspertów branżowych planujących lub rozwijających ofertę edukacyjną online.',
    array[
      'Od pomysłu do outline’u kursu z wykorzystaniem AI',
      'Scenariusze lekcji, slajdy i materiały do pobrania',
      'Quizy, zadania i testy wiedzy dla uczestników',
      'Opisy modułów, landing page i treści promocyjne',
      'Montaż i napisy — gdzie AI realnie pomaga',
      'Jak nie stracić autentyczności przy masowej produkcji treści'
    ]::text[],
    array[
      'Szybciej produkujesz moduły i materiały kursowe',
      'Masz spójny plan całego kursu od pierwszego dnia',
      'Lepsze materiały marketingowe przyciągające uczestników',
      'Wiesz, które etapy produkcji warto wspierać AI',
      'Skalujesz edukację online bez utraty jakości merytorycznej'
    ]::text[],
    '1 godzina',
    'Wideo'
  ),
  (
    '44444444-4444-4444-8444-444444444419'::uuid,
    'Analiza danych z AI',
    'mock-analiza-danych-ai',
    'training',
    179.00,
    null,
    true,
    false,
    118,
    'https://picsum.photos/seed/zainaty-course-data/1000/1250',
    E'Dane są wszędzie — w arkuszach, raportach, ankietach i eksportach z systemów. Problem w tym, że ich analiza często wymaga SQL, Pythona lub drogich narzędzi BI. AI zmienia tę regułę gry dla osób nietechnicznych.\n\nTen kurs uczy, jak zadawać właściwe pytania danym, interpretować wyniki i tworzyć czytelne podsumowania bez pisania kodu. Pracujemy na realnych zestawach: sprzedaż, ankiety, KPI zespołu.\n\nDla analityków biznesowych, managerów i każdego, kto regularnie podejmuje decyzje na podstawie liczb.',
    'Dla analityków biznesowych, managerów, właścicieli firm i osób pracujących z Excel, CSV i raportami — bez wymogu znajomości programowania.',
    array[
      'Import i przygotowanie danych z CSV, Excel i eksportów',
      'Zadawanie pytań danym w języku naturalnym',
      'Tworzenie wykresów i wizualizacji z interpretacją',
      'Wykrywanie trendów, anomalii i korelacji',
      'Raporty dla zarządu: struktura, język i wnioski',
      'Ograniczenia analizy AI i kiedy potrzebujesz eksperta'
    ]::text[],
    array[
      'Szybciej wyciągasz wnioski z tabel i raportów',
      'Tworzysz czytelne podsumowania dla zespołu i przełożonych',
      'Wiesz, jak weryfikować wyniki analizy AI',
      'Oszczędzasz czas na ręcznym przetwarzaniu danych',
      'Podejmujesz lepsze decyzje oparte na faktach, nie intuicji'
    ]::text[],
    '6 godzin',
    'E-book'
  ),
  (
    '44444444-4444-4444-8444-444444444420'::uuid,
    'Wideo: Przyszłość pracy z AI',
    'mock-wideo-przyszlosc-pracy',
    'video',
    129.00,
    99.00,
    true,
    false,
    119,
    'https://picsum.photos/seed/zainaty-course-video-future/1000/1250',
    E'Rynek pracy zmienia się szybciej niż kiedykolwiek — a AI jest głównym katalizatorem tej transformacji. To wideo to przegląd trendów, kompetencji przyszłości i praktycznych strategii adaptacji, które możesz wdrożyć już dziś.\n\nNie straszymy robotami zabierającymi pracę. Zamiast tego pokazujemy, jak budować przewagę konkurencyjną, uczyć się w nowym tempie i wykorzystywać AI jako partnera w rozwoju kariery.\n\nInspirujące i konkretne — idealne na start rozmów o strategii zespołu lub własnej ścieżce zawodowej.',
    'Dla wszystkich, którzy zastanawiają się nad wpływem AI na swoją karierę — od studentów po doświadczonych managerów i przedsiębiorców.',
    array[
      'Kluczowe trendy AI na rynku pracy w najbliższych latach',
      'Kompetencje, które rosną w wartości — i te, które warto rozwijać',
      'Jak uczyć się szybciej z wykorzystaniem narzędzi AI',
      'Budowanie marki osobistej w erze automatyzacji',
      'Strategie adaptacji dla zespołów i organizacji',
      'Realistyczny obraz szans i zagrożeń — bez hype’u i paniki'
    ]::text[],
    array[
      'Rozumiesz, jak AI zmienia Twój sektor i rolę zawodową',
      'Masz plan rozwoju kompetencji na najbliższe 12–24 miesiące',
      'Wiesz, jak wykorzystać AI do nauki i budowania przewagi',
      'Lepiej przygotowujesz zespół lub siebie na nadchodzące zmiany',
      'Patrzysz na przyszłość pracy z optymizmem i konkretnym planem działania'
    ]::text[],
    '40 min',
    'Wideo'
  );

insert into public.courses (
  id,
  title,
  slug,
  description,
  cover_image_url,
  kind,
  price,
  discount_price,
  target_audience,
  learning_points,
  outcomes,
  duration_label,
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
  s.cover_image_url,
  s.kind,
  s.price,
  s.discount_price,
  s.target_audience,
  s.learning_points,
  s.outcomes,
  s.duration_label,
  s.format_label,
  s.published,
  s.is_featured,
  s.sort_order
from _mock_courses_seed s
on conflict (slug) do nothing;

update public.courses c
set
  title = s.title,
  description = s.description,
  cover_image_url = s.cover_image_url,
  kind = s.kind,
  price = s.price,
  discount_price = s.discount_price,
  target_audience = s.target_audience,
  learning_points = s.learning_points,
  outcomes = s.outcomes,
  duration_label = s.duration_label,
  format_label = s.format_label,
  published = s.published,
  is_featured = s.is_featured,
  sort_order = s.sort_order
from _mock_courses_seed s
where c.slug = s.slug;

update public.courses c
set demo_youtube_url = v.demo_youtube_url
from (
  values
    (
      'mock-wideo-wprowadzenie-ai',
      'https://www.youtube.com/watch?v=aircAruvnKk'
    ),
    (
      'mock-wideo-chatgpt-30min',
      'https://www.youtube.com/watch?v=JMUxmLyrhSk'
    ),
    (
      'mock-wideo-ai-freelancer',
      'https://www.youtube.com/watch?v=T6iMHtEL9FU'
    ),
    (
      'mock-wideo-obrazy-ai',
      'https://www.youtube.com/watch?v=SVcsDDABEkM'
    ),
    (
      'mock-wideo-prezentacje-ai',
      'https://www.youtube.com/watch?v=Ks-_Mh1QhMc'
    ),
    (
      'mock-wideo-edukacja-online',
      'https://www.youtube.com/watch?v=rvwFyJkqWyQ'
    ),
    (
      'mock-wideo-przyszlosc-pracy',
      'https://www.youtube.com/watch?v=5dZ_lvDgevk'
    )
) as v(slug, demo_youtube_url)
where c.slug = v.slug;

with test_template as (
  select
    cf.file_type,
    cf.title as file_title,
    cf.r2_object_key
  from public.courses c
  inner join public.course_files cf on cf.course_id = c.id
  where lower(trim(c.title)) = 'test kurs'
     or c.slug in ('test-kurs', 'test-kursa')
  order by cf.sort_order, cf.created_at
  limit 1
)
insert into public.course_files (
  course_id,
  file_type,
  title,
  r2_object_key,
  sort_order
)
select
  c.id,
  tt.file_type,
  tt.file_title,
  tt.r2_object_key,
  0
from public.courses c
inner join _mock_courses_seed s on s.slug = c.slug
cross join test_template tt
where not exists (
  select 1
  from public.course_files cf
  where cf.course_id = c.id
);
