-- Historia cen sprzedaży (Omnibus: najniższa cena z 30 dni przed obniżką).
-- Kolumna courses.lowest_price_30_days jest wyliczana automatycznie przy zmianie ceny.

create table if not exists public.course_price_history (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  effective_price numeric(10, 2) not null check (effective_price >= 0),
  price numeric(10, 2) not null check (price >= 0),
  discount_price numeric(10, 2) check (discount_price is null or discount_price >= 0),
  recorded_at timestamptz not null default now()
);

create index if not exists course_price_history_course_recorded_idx
  on public.course_price_history (course_id, recorded_at desc);

alter table public.course_price_history enable row level security;

-- Tylko serwer (service role / admin) zapisuje; public czyta przez courses.lowest_price_30_days.

-- Backfill: najpierw cena regularna w przeszłości, potem aktualna promocja (jeśli jest).
insert into public.course_price_history (
  course_id,
  effective_price,
  price,
  discount_price,
  recorded_at
)
select
  c.id,
  c.price,
  c.price,
  null,
  coalesce(c.created_at, now()) - interval '31 days'
from public.courses c
where not exists (
  select 1 from public.course_price_history h where h.course_id = c.id
);

insert into public.course_price_history (
  course_id,
  effective_price,
  price,
  discount_price,
  recorded_at
)
select
  c.id,
  c.discount_price,
  c.price,
  c.discount_price,
  coalesce(c.updated_at, now())
from public.courses c
where c.discount_price is not null
  and c.discount_price < c.price
  and not exists (
    select 1
    from public.course_price_history h
    where h.course_id = c.id
      and h.discount_price is not null
      and h.effective_price = c.discount_price
  );

-- Wylicz lowest_price_30_days dla kursów z aktywną promocją.
update public.courses c
set lowest_price_30_days = sub.lowest
from (
  select
    c2.id as course_id,
    (
      select min(h.effective_price)
      from public.course_price_history h
      where h.course_id = c2.id
        and h.recorded_at >= (
          select max(h2.recorded_at)
          from public.course_price_history h2
          where h2.course_id = c2.id
            and h2.effective_price = c2.discount_price
        ) - interval '30 days'
        and h.recorded_at < (
          select max(h2.recorded_at)
          from public.course_price_history h2
          where h2.course_id = c2.id
            and h2.effective_price = c2.discount_price
        )
    ) as lowest
  from public.courses c2
  where c2.discount_price is not null
    and c2.discount_price < c2.price
) sub
where c.id = sub.course_id;

update public.courses
set lowest_price_30_days = price
where discount_price is not null
  and discount_price < price
  and lowest_price_30_days is null;

update public.courses
set lowest_price_30_days = null
where discount_price is null
  or discount_price >= price;
