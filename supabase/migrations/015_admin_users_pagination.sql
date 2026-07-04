-- Paginacja i wyszukiwanie użytkowników w panelu admina

drop function if exists public.list_users_for_admin();

create or replace function public.list_users_for_admin(
  p_search text default '',
  p_page integer default 1,
  p_page_size integer default 10
)
returns table (
  id uuid,
  email text,
  role text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  total_count bigint
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_page integer := greatest(coalesce(p_page, 1), 1);
  v_page_size integer := least(greatest(coalesce(p_page_size, 10), 1), 100);
  v_offset integer;
  v_search text := trim(coalesce(p_search, ''));
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  v_offset := (v_page - 1) * v_page_size;

  return query
  select
    p.id,
    u.email::text,
    p.role,
    p.created_at,
    u.last_sign_in_at,
    count(*) over() as total_count
  from public.profiles p
  join auth.users u on u.id = p.id
  where
    v_search = ''
    or u.email ilike '%' || v_search || '%'
  order by p.created_at desc
  limit v_page_size
  offset v_offset;
end;
$$;

revoke all on function public.list_users_for_admin(text, integer, integer) from public;
grant execute on function public.list_users_for_admin(text, integer, integer) to authenticated;
