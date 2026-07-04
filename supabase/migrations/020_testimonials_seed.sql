-- Przykładowe opinie na stronę główną

insert into public.testimonials (
  id,
  author_name,
  author_role,
  content,
  rating,
  sort_order,
  published
)
values
  (
    '33333333-3333-4333-8333-333333333301',
    'Anna Kowalska',
    'Nauczycielka',
    'Dzięki kursowi „AI dla nauczycieli” w końcu rozumiem, jak wykorzystać sztuczną inteligencję w mojej pracy. Wszystko wyjaśnione prostym językiem!',
    5,
    0,
    true
  ),
  (
    '33333333-3333-4333-8333-333333333302',
    'Marek Wiśniewski',
    'Właściciel małej firmy',
    '„ChatGPT w Twojej firmie” to była najlepsza inwestycja. Oszczędzam kilka godzin tygodniowo na pisaniu maili i tworzeniu treści.',
    5,
    1,
    true
  ),
  (
    '33333333-3333-4333-8333-333333333303',
    'Ewa Nowak',
    'Freelancerka',
    'Jako osoba, która bała się technologii, byłam zaskoczona jak przystępnie wszystko jest wytłumaczone. Polecam każdemu początkującemu!',
    5,
    2,
    true
  ),
  (
    '33333333-3333-4333-8333-333333333304',
    'Tomasz Zieliński',
    'Senior, 67 lat',
    'Nigdy nie myślałem, że nauczę się AI w moim wieku. Teraz tworzę projekty z wnukami i czuję się na bieżąco!',
    5,
    3,
    true
  ),
  (
    '33333333-3333-4333-8333-333333333305',
    'Katarzyna Dąbrowska',
    'HR Manager',
    'Kurs o CV z AI pomógł mi przebrnąć przez setki aplikacji. W końcu mam pracę, o której marzyłam!',
    5,
    4,
    true
  ),
  (
    '33333333-3333-4333-8333-333333333306',
    'Piotr Lewandowski',
    'Student',
    '„Cyfrowy start” to idealny kurs na początek. Teraz wiem, jak korzystać z AI do nauki i organizacji życia.',
    5,
    5,
    true
  )
on conflict (id) do nothing;
