-- Opis lekcji wideo + mock programu dla wszystkich kursów kind = video
-- Pliki wideo: istniejące klucze R2 z course_files (np. z kursu „test kurs”)

alter table public.course_curriculum_nodes
  add column if not exists description text not null default '';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'course_curriculum_section_no_description'
  ) then
    alter table public.course_curriculum_nodes
      add constraint course_curriculum_section_no_description check (
        kind = 'lesson'
        or btrim(description) = ''
      );
  end if;
end $$;

-- Zbierz istniejące pliki wideo zanim usuniemy wpisy mockowych kursów wideo
create temporary table _existing_video_keys (
  ord integer primary key,
  r2_object_key text not null
);

insert into _existing_video_keys (ord, r2_object_key)
select
  row_number() over (order by priority, sort_order, created_at)::integer,
  r2_object_key
from (
  select
    cf.r2_object_key,
    min(
      case
        when lower(trim(c.title)) = 'test kurs'
          or c.slug in ('test-kurs', 'test-kursa') then 0
        else 1
      end
    ) as priority,
    min(cf.sort_order) as sort_order,
    min(cf.created_at) as created_at
  from public.course_files cf
  inner join public.courses c on c.id = cf.course_id
  where cf.file_type = 'video'
    and btrim(cf.r2_object_key) <> ''
  group by cf.r2_object_key
) ranked;

do $$
begin
  if not exists (select 1 from _existing_video_keys) then
    raise exception
      'Migracja 029: brak plików wideo w course_files. Dodaj co najmniej jeden plik video (np. w kursie „test kurs”).';
  end if;
end $$;

-- Usuń stary program i pliki mockowych kursów wideo (jeśli były)
delete from public.course_curriculum_nodes
where course_id in (
  select id from public.courses where kind = 'video'
);

delete from public.course_files
where course_id in (
  select id from public.courses where kind = 'video'
);

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
  v_key_count integer;
  v_key_1 text;
  v_key_2 text;
  v_key_3 text;
  v_key_4 text;
  v_key_5 text;
begin
  select count(*)::integer into v_key_count from _existing_video_keys;

  select r2_object_key into v_key_1
  from _existing_video_keys
  where ord = ((0 % v_key_count) + 1);

  select r2_object_key into v_key_2
  from _existing_video_keys
  where ord = ((1 % v_key_count) + 1);

  select r2_object_key into v_key_3
  from _existing_video_keys
  where ord = ((2 % v_key_count) + 1);

  select r2_object_key into v_key_4
  from _existing_video_keys
  where ord = ((3 % v_key_count) + 1);

  select r2_object_key into v_key_5
  from _existing_video_keys
  where ord = ((4 % v_key_count) + 1);

  -- Rozdział 1
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
    v_key_1
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
    v_key_2
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
    v_key_3
  );

  -- Rozdział 2
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
    v_key_4
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
    v_key_5
  );

  -- Spłaszczone pliki course_files (kompatybilność z API pobierania / odtwarzacza)
  insert into public.course_files (course_id, file_type, title, r2_object_key, sort_order)
  select
    n.course_id,
    'video',
    n.title,
    n.r2_object_key,
    (row_number() over (order by n.r2_object_key, n.title))::integer - 1
  from public.course_curriculum_nodes n
  where n.course_id = p_course_id
    and n.kind = 'lesson';
end;
$$;

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
    perform public._seed_video_course_curriculum(
      r.id,
      r.slug,
      r.title
    );
  end loop;
end $$;

drop function if exists public._seed_video_course_curriculum(uuid, text, text);
