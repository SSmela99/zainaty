-- Najniższa cena z 30 dni przed obniżką (dyrektywa Omnibus).
-- Wypełniane ręcznie w panelu admina przy ustawianiu promocji.

alter table public.courses
  add column if not exists lowest_price_30_days numeric(10, 2)
  check (
    lowest_price_30_days is null
    or lowest_price_30_days >= 0
  );

comment on column public.courses.lowest_price_30_days is
  'Najniższa cena z 30 dni przed obniżką (Omnibus). Pokazywana przy promocji.';
