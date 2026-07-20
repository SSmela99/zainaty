-- Przypisanie prawdziwych plików wideo (R2) do programów kursów + losowe PDF do szkoleń

create temporary table _video_library (
  ord integer primary key,
  r2_object_key text not null unique
);

insert into _video_library (ord, r2_object_key)
values
  (1, 'videos/test-odtwarzacza/15442091_1920_1080_25fps.mp4'),
  (2, 'videos/test-odtwarzacza/18354883-hd_1920_1080_30fps.mp4'),
  (3, 'videos/test-odtwarzacza/4972699-hd_1920_1080_30fps.mp4'),
  (4, 'videos/test-odtwarzacza/5912600-uhd_3840_2160_25fps.mp4'),
  (5, 'videos/test-odtwarzacza/6580030-uhd_4096_2160_25fps.mp4'),
  (6, 'videos/test-odtwarzacza/Blue-Bolt.mp4'),
  (7, 'videos/testowy-kurs-wideo/16220036_1920_1080_50fps.mp4')
on conflict (r2_object_key) do nothing;

-- Uzupełnij bibliotekę o inne wideo już zapisane w course_files
insert into _video_library (ord, r2_object_key)
select
  100 + row_number() over (order by cf.created_at)::integer,
  cf.r2_object_key
from public.course_files cf
where cf.file_type = 'video'
  and btrim(cf.r2_object_key) <> ''
  and lower(cf.r2_object_key) not in (select lower(r2_object_key) from _video_library)
on conflict (r2_object_key) do nothing;

create temporary table _pdf_library (
  ord integer primary key,
  r2_object_key text not null unique
);

insert into _pdf_library (ord, r2_object_key)
select
  row_number() over (order by cf.created_at)::integer,
  cf.r2_object_key
from public.course_files cf
where cf.file_type = 'pdf'
  and btrim(cf.r2_object_key) <> ''
on conflict (r2_object_key) do nothing;

create or replace function public._pick_library_key(
  p_library text,
  p_course_id uuid,
  p_slot integer
)
returns text
language plpgsql
as $$
declare
  v_count integer;
  v_index integer;
  v_offset integer;
  v_key text;
begin
  if p_library = 'video' then
    select count(*)::integer into v_count from _video_library;
    if v_count = 0 then
      raise exception 'Brak plików wideo w bibliotece seed.';
    end if;

    -- Każdy slot (1–5) w kursie dostaje inny film; kursy startują z innym offsetem.
    v_offset := abs(hashtext(p_course_id::text)) % v_count;
    v_index := 1 + ((p_slot - 1 + v_offset) % v_count);

    select r2_object_key into v_key
    from (
      select r2_object_key, row_number() over (order by ord) as rn
      from _video_library
    ) ranked
    where rn = v_index;

    return v_key;
  end if;

  select count(*)::integer into v_count from _pdf_library;
  if v_count = 0 then
    return null;
  end if;

  v_index := 1 + (abs(hashtext(p_course_id::text || ':p:' || p_slot::text)) % v_count);

  select r2_object_key into v_key
  from (
    select r2_object_key, row_number() over (order by ord) as rn
    from _pdf_library
  ) ranked
  where rn = v_index;

  return v_key;
end;
$$;

create or replace function public._seed_video_course_curriculum(
  p_course_id uuid,
  p_slug text,
  p_prefix text
)
returns void
language plpgsql
as $$
declare
  v_chapter_1_id uuid;
  v_chapter_2_id uuid;
  v_sub_1_id uuid;
  v_sub_sub_1_id uuid;
begin
  insert into public.course_curriculum_nodes (
    course_id, parent_id, kind, title, description, sort_order, r2_object_key
  )
  values (p_course_id, null, 'section', 'Rozdział 1 — Start', '', 0, null)
  returning id into v_chapter_1_id;

  insert into public.course_curriculum_nodes (
    course_id, parent_id, kind, title, description, sort_order, r2_object_key
  )
  values (
    p_course_id,
    v_chapter_1_id,
    'lesson',
    p_prefix || ' — wprowadzenie',
    'Krótkie wprowadzenie do tematu kursu, cele lekcji i to, co będzie potrzebne na start.',
    0,
    public._pick_library_key('video', p_course_id, 1)
  );

  insert into public.course_curriculum_nodes (
    course_id, parent_id, kind, title, description, sort_order, r2_object_key
  )
  values (p_course_id, v_chapter_1_id, 'section', 'Podrozdział — podstawy', '', 1, null)
  returning id into v_sub_1_id;

  insert into public.course_curriculum_nodes (
    course_id, parent_id, kind, title, description, sort_order, r2_object_key
  )
  values (
    p_course_id,
    v_sub_1_id,
    'lesson',
    p_prefix || ' — pierwsze kroki',
    'Przechodzimy przez pierwsze ćwiczenie krok po kroku. Możesz zatrzymywać wideo i powtarzać fragmenty.',
    0,
    public._pick_library_key('video', p_course_id, 2)
  );

  insert into public.course_curriculum_nodes (
    course_id, parent_id, kind, title, description, sort_order, r2_object_key
  )
  values (
    p_course_id,
    v_sub_1_id,
    'section',
    'Podpodrozdział — ćwiczenia',
    '',
    1,
    null
  )
  returning id into v_sub_sub_1_id;

  insert into public.course_curriculum_nodes (
    course_id, parent_id, kind, title, description, sort_order, r2_object_key
  )
  values (
    p_course_id,
    v_sub_sub_1_id,
    'lesson',
    p_prefix || ' — ćwiczenie praktyczne',
    'Ćwiczenie utrwalające materiał z podrozdziału. Przygotuj notatnik lub otwórz ulubione narzędzie AI obok playera.',
    0,
    public._pick_library_key('video', p_course_id, 3)
  );

  insert into public.course_curriculum_nodes (
    course_id, parent_id, kind, title, description, sort_order, r2_object_key
  )
  values (p_course_id, null, 'section', 'Rozdział 2 — Praktyka', '', 1, null)
  returning id into v_chapter_2_id;

  insert into public.course_curriculum_nodes (
    course_id, parent_id, kind, title, description, sort_order, r2_object_key
  )
  values (
    p_course_id,
    v_chapter_2_id,
    'lesson',
    p_prefix || ' — workflow na co dzień',
    'Gotowy scenariusz do wdrożenia od razu po kursie. Pokazujemy cały proces bez pomijania kroków.',
    0,
    public._pick_library_key('video', p_course_id, 4)
  );

  insert into public.course_curriculum_nodes (
    course_id, parent_id, kind, title, description, sort_order, r2_object_key
  )
  values (
    p_course_id,
    v_chapter_2_id,
    'lesson',
    p_prefix || ' — podsumowanie i kolejne kroki',
    'Podsumowanie kursu, lista rekomendowanych narzędzi i wskazówki, jak utrzymać regularną praktykę.',
    1,
    public._pick_library_key('video', p_course_id, 5)
  );

  insert into public.course_files (course_id, file_type, title, r2_object_key, sort_order)
  select
    n.course_id,
    'video',
    n.title,
    n.r2_object_key,
    (row_number() over (order by n.created_at))::integer - 1
  from public.course_curriculum_nodes n
  where n.course_id = p_course_id
    and n.kind = 'lesson';
end;
$$;

-- Kursy wideo: przebuduj program z prawdziwymi plikami
delete from public.course_curriculum_nodes
where course_id in (select id from public.courses where kind = 'video');

delete from public.course_files
where course_id in (select id from public.courses where kind = 'video');

do $$
declare
  r record;
begin
  for r in
    select id, slug, title
    from public.courses
    where kind = 'video'
    order by sort_order, title
  loop
    perform public._seed_video_course_curriculum(r.id, r.slug, r.title);
  end loop;
end $$;

-- Szkolenia (PDF): losowe przypisanie istniejących PDF-ów
delete from public.course_files
where course_id in (select id from public.courses where kind = 'training');

do $$
declare
  r record;
  v_pdf_key text;
begin
  if not exists (select 1 from _pdf_library) then
    return;
  end if;

  for r in
    select id, title
    from public.courses
    where kind = 'training'
    order by sort_order, title
  loop
    v_pdf_key := public._pick_library_key('pdf', r.id, 1);

    if v_pdf_key is not null then
      insert into public.course_files (course_id, file_type, title, r2_object_key, sort_order)
      values (r.id, 'pdf', r.title || ' — materiały', v_pdf_key, 0);
    end if;
  end loop;
end $$;

drop function if exists public._seed_video_course_curriculum(uuid, text, text);
drop function if exists public._pick_library_key(text, uuid, integer);
