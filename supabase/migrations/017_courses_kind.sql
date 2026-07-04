-- Rodzaj produktu: szkolenie (PDF), wideo, pakiet

alter table public.courses
  add column if not exists kind text not null default 'training'
  check (kind in ('training', 'video', 'package'));

create index if not exists courses_kind_sort_idx
  on public.courses (kind, sort_order);
