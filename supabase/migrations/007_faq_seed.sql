-- Przykładowe pytania FAQ o AI (10 szt.)
-- Uruchom w Supabase SQL Editor po migracji 006_faq.sql

insert into public.faq_items (id, question, answer, sort_order, published)
values
  (
    '22222222-2222-4222-8222-222222222201',
    'Czym w ogóle jest sztuczna inteligencja (AI)?',
    'AI to po prostu programy, które potrafią wykonywać zadania wymagające „myślenia” — na przykład odpowiadać na pytania, pisać teksty, tłumaczyć albo podpowiadać pomysły. Nie musisz rozumieć technologii od środka, żeby z niej korzystać — wystarczy wiedzieć, do czego Ci służy i jak zadawać dobre pytania.',
    0,
    true
  ),
  (
    '22222222-2222-4222-8222-222222222202',
    'Czy muszę być „techniczny”, żeby korzystać z ChatGPT?',
    'Absolutnie nie. ChatGPT działa jak rozmowa — piszesz po polsku, normalnym językiem, a on odpowiada. Nie trzeba znać programowania ani skomplikowanych poleceń. Im dokładniej opiszesz, czego potrzebujesz, tym lepsza będzie odpowiedź.',
    1,
    true
  ),
  (
    '22222222-2222-4222-8222-222222222203',
    'Czy ChatGPT i inne narzędzia AI są bezpieczne?',
    'Są bezpieczne, jeśli korzystasz z nich rozsądnie. Nie wpisuj haseł, numerów PESEL, danych bankowych ani poufnych informacji z pracy. Traktuj AI jak rozmowę z kimś obcym — pomaga, ale nie powierzasz mu wszystkiego. Oficjalne aplikacje (ChatGPT, Gemini, Copilot) są zwykle bezpieczniejsze niż nieznane strony.',
    2,
    true
  ),
  (
    '22222222-2222-4222-8222-222222222204',
    'Czy korzystanie z AI jest płatne?',
    'Wiele narzędzi ma darmową wersję w zupełności wystarczającą na start — np. ChatGPT, Gemini czy Claude. Płatne plany dają szybsze odpowiedzi, więcej funkcji albo lepsze modele, ale do nauki i codziennych zadań darmowa wersja zwykle w zupełności wystarczy.',
    3,
    true
  ),
  (
    '22222222-2222-4222-8222-222222222205',
    'Czy AI zastąpi moją pracę?',
    'AI raczej zmienia sposób pracy niż ją eliminuje — automatyzuje powtarzalne zadania (pisanie maili, streszczenia, tłumaczenia), a Ty możesz skupić się na tym, co wymaga ludzkiego osądu, relacji i kreatywności. Osoby, które nauczą się współpracować z AI, często zyskują przewagę, a nie tracą pracę.',
    4,
    true
  ),
  (
    '22222222-2222-4222-8222-222222222206',
    'Skąd wiem, czy odpowiedź AI jest prawdziwa?',
    'Zawsze weryfikuj ważne informacje — AI potrafi brzmieć pewnie, a jednak się mylić („halucynuje”). Przy faktach, zdrowiu, prawie czy finansach sprawdź odpowiedź w wiarygodnym źródle. AI to dobry punkt wyjścia i asystent, ale nie ostateczna prawda.',
    5,
    true
  ),
  (
    '22222222-2222-4222-8222-222222222207',
    'Jak zacząć naukę AI od zera?',
    'Zacznij od jednego narzędzia — najlepiej ChatGPT lub Gemini. Codziennie zadaj 2–3 konkretne pytania z Twojego życia: napisz maila, streść artykuł, wymyśl pomysł na obiad. Nie musisz od razu wszystkiego ogarniać — małe kroki przez tydzień dają więcej niż teoria przez miesiąc.',
    6,
    true
  ),
  (
    '22222222-2222-4222-8222-222222222208',
    'Czym różni się ChatGPT od Gemini i Claude?',
    'To trzy popularne „asystenty AI” od różnych firm (OpenAI, Google, Anthropic). Wszystkie odpowiadają na pytania i pomagają pisać teksty, ale różnią się stylem odpowiedzi, integracją z innymi usługami i limitami darmowych wersji. Warto wypróbować każde z nich i zostać przy tym, który najlepiej pasuje do Twoich potrzeb.',
    7,
    true
  ),
  (
    '22222222-2222-4222-8222-222222222209',
    'Czy mogę używać AI do pracy i nauki?',
    'Tak — do planowania, pisania szkiców, tłumaczeń, burzy mózgów czy nauki nowych tematów. W pracy i na studiach sprawdź jednak regulamin: niektóre firmy i uczelnie mają zasady co do korzystania z AI. Zawsze podawaj źródła i nie wysyłaj poufnych danych firmy do publicznych narzędzi.',
    8,
    true
  ),
  (
    '22222222-2222-4222-8222-222222222210',
    'Jak napisać dobre pytanie do AI?',
    'Im więcej kontekstu, tym lepiej. Zamiast „Napisz maila” spróbuj: „Napisz krótkiego maila do klienta z przeprosinami za opóźnienie dostawy — ton uprzejmy, po polsku, max 5 zdań”. Możesz też poprosić o kilka wersji albo o poprawienie swojego tekstu. AI lubi konkret — tak samo jak człowiek.',
    9,
    true
  )
on conflict (id) do nothing;
