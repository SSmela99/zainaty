-- Zdjęcie autora (jeśli 001_blog.sql był już uruchomiony wcześniej)

alter table public.authors
  add column if not exists photo_url text;

insert into storage.buckets (id, name, public)
values ('author-photos', 'author-photos', true)
on conflict (id) do nothing;

create policy "author_photos_public_read"
  on storage.objects for select to anon
  using (bucket_id = 'author-photos');

create policy "author_photos_authenticated_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'author-photos');

create policy "author_photos_authenticated_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'author-photos');

create policy "author_photos_authenticated_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'author-photos');
