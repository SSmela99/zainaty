-- Użytkownik z zakupem może odczytać metadane plików kursu (bez bezpośredniego dostępu do R2).

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'course_files'
      and policyname = 'course_files_select_purchased'
  ) then
    create policy "course_files_select_purchased"
      on public.course_files for select to authenticated
      using (
        public.is_admin()
        or exists (
          select 1
          from public.course_purchases cp
          where cp.user_id = auth.uid()
            and cp.course_id = course_files.course_id
        )
      );
  end if;
end $$;
