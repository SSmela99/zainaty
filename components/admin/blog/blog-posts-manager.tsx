"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, useTransition } from "react";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { deleteBlogPost, listBlogPosts, setFeaturedBlogPost } from "@/app/admin/actions/blog";
import { AdminSelect } from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import type { BlogPostWithRelations } from "@/lib/blog/types";

import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminLoading } from "@/components/admin/admin-loading";
import { useScrollAdminPanelWhen } from "@/components/admin/use-scroll-admin-panel";
import { AdminMessage, AdminPanelCard } from "./blog-admin.shared";
import { BlogPostForm } from "./blog-post-form";

export function BlogPostsManager() {
  const [posts, setPosts] = useState<BlogPostWithRelations[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPostWithRelations | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [postToDelete, setPostToDelete] = useState<BlogPostWithRelations | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const [isFeaturedPending, startFeaturedTransition] = useTransition();

  const featuredPost = posts.find((post) => post.is_featured) ?? null;

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    const result = await listBlogPosts();
    if (result.ok) {
      setPosts(result.data);
    } else {
      setError(result.error ?? "Nie udało się wczytać artykułów.");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  function closeForm() {
    setEditingPost(null);
    setIsCreating(false);
  }

  function handleSaved() {
    toast.success(editingPost ? "Artykuł zaktualizowany." : "Artykuł dodany.");
    setError(null);
    closeForm();
    void loadPosts();
  }

  function requestDelete(post: BlogPostWithRelations) {
    setPostToDelete(post);
  }

  function handleFeaturedChange(postId: string) {
    setError(null);

    startFeaturedTransition(async () => {
      const nextId = postId || null;
      const result = await setFeaturedBlogPost(nextId);

      if (!result.ok) {
        setError(result.error ?? "Nie udało się ustawić wyróżnionego artykułu.");
        return;
      }

      toast.success(
        nextId ? "Wyróżniony artykuł zaktualizowany." : "Usunięto wyróżnienie artykułu.",
      );
      await loadPosts();
    });
  }

  function confirmDelete() {
    if (!postToDelete) return;

    const id = postToDelete.id;
    setError(null);

    startTransition(async () => {
      const result = await deleteBlogPost(id);
      if (!result.ok) {
        setError(result.error ?? "Nie udało się usunąć artykułu.");
        return;
      }

      setPostToDelete(null);
      if (editingPost?.id === id) closeForm();
      toast.success("Artykuł usunięty.");
      await loadPosts();
    });
  }

  const showForm = isCreating || editingPost != null;

  useScrollAdminPanelWhen(showForm);

  return (
    <div className="space-y-6">
      {!showForm ? (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => {
              setIsCreating(true);
              setError(null);
            }}
            className="h-10 bg-[#f24a00] px-5 text-white hover:bg-[#d94200] dark:bg-[#daff02] dark:text-black dark:hover:bg-[#9bec00]"
          >
            <PlusIcon />
            Nowy artykuł
          </Button>
        </div>
      ) : null}

      {showForm ? (
        <AdminPanelCard>
          <h2 className="text-lg font-black tracking-[0.02em]">
            {editingPost ? "Edytuj artykuł" : "Nowy artykuł"}
          </h2>
          <div className="mt-6">
            <BlogPostForm
              post={editingPost}
              onSaved={handleSaved}
              onCancel={closeForm}
            />
          </div>
        </AdminPanelCard>
      ) : null}

      {error ? <AdminMessage error={error} /> : null}

      {!showForm && !isLoading && posts.length > 0 ? (
        <AdminPanelCard>
          <h2 className="text-lg font-black tracking-[0.02em]">Wyróżniony artykuł</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Jeden artykuł może być wyróżniony na stronie bloga.
          </p>
          <div className="mt-4 max-w-xl">
            <AdminSelect
              id="featured-post"
              value={featuredPost?.id ?? ""}
              onChange={(event) => handleFeaturedChange(event.target.value)}
              disabled={isFeaturedPending}
            >
              <option value="">- brak wyróżnionego -</option>
              {posts.map((post) => (
                <option key={post.id} value={post.id}>
                  {post.title}
                  {!post.published ? " (szkic)" : ""}
                </option>
              ))}
            </AdminSelect>
          </div>
        </AdminPanelCard>
      ) : null}

      <AdminPanelCard>
        <h2 className="text-lg font-black tracking-[0.02em]">Lista artykułów</h2>

        {isLoading ? (
          <AdminLoading label="Wczytywanie artykułów..." />
        ) : posts.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">Brak artykułów.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {posts.map((post) => (
              <li
                key={post.id}
                className="flex flex-col gap-4 rounded-2xl border border-zinc-100 p-4 dark:border-zinc-800 md:flex-row md:items-start"
              >
                {post.cover_image_url ? (
                  <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl md:w-40">
                    <Image
                      src={post.cover_image_url}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : null}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-zinc-950 dark:text-white">
                      {post.title}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase ${
                        post.published
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {post.published ? "Opublikowany" : "Szkic"}
                    </span>
                    {post.is_featured ? (
                      <span className="rounded-full bg-[#dfe5ff] px-2 py-0.5 text-[11px] font-bold tracking-wide text-[#0033ff] uppercase dark:bg-[#1a2a5e] dark:text-[#6688ff]">
                        Wyróżniony
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1 text-xs text-zinc-500">
                    /{post.slug} · {post.reading_time_minutes} min czytania
                  </p>

                  {post.author ? (
                    <p className="mt-2 text-sm text-[#0033ff]">
                      {post.author.first_name} {post.author.last_name}
                    </p>
                  ) : null}

                  {post.tags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {post.related_posts.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {post.related_posts.map((related) => (
                        <span
                          key={related.id}
                          className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs dark:border-zinc-700"
                        >
                          ↗ {related.title}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => {
                      setEditingPost(post);
                      setIsCreating(false);
                      setError(null);
                    }}
                  >
                    <PencilIcon />
                    Edytuj
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={isPending}
                    onClick={() => requestDelete(post)}
                  >
                    <Trash2Icon />
                    Usuń
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminPanelCard>

      <AdminConfirmDialog
        open={postToDelete != null}
        onOpenChange={(open) => {
          if (!open && !isPending) setPostToDelete(null);
        }}
        title="Usunąć artykuł?"
        description={
          postToDelete
            ? `Czy na pewno chcesz usunąć artykuł „${postToDelete.title}"? Tej operacji nie można cofnąć.`
            : ""
        }
        onConfirm={confirmDelete}
        isPending={isPending}
      />
    </div>
  );
}
