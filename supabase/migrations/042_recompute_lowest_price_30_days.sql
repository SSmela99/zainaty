-- Przelicz najniższą cenę z ostatnich 30 dni (z ciągłością historii).
-- Bierze: ceny zmienione w oknie + cenę obowiązującą na początku okna.

update public.courses c
set lowest_price_30_days = sub.lowest
from (
  select
    c2.id as course_id,
    (
      select min(p.effective_price)
      from (
        select h.effective_price
        from public.course_price_history h
        where h.course_id = c2.id
          and h.recorded_at >= now() - interval '30 days'
        union all
        select h2.effective_price
        from public.course_price_history h2
        where h2.id = (
          select h3.id
          from public.course_price_history h3
          where h3.course_id = c2.id
            and h3.recorded_at < now() - interval '30 days'
          order by h3.recorded_at desc
          limit 1
        )
      ) p
    ) as lowest
  from public.courses c2
) sub
where c.id = sub.course_id;
