import type { FaqItem } from "@/lib/faq/types";

export function reorderFaqItemList(
  items: FaqItem[],
  draggedId: string,
  targetId: string,
): FaqItem[] {
  if (draggedId === targetId) return items;

  const draggedIndex = items.findIndex((item) => item.id === draggedId);
  const targetIndex = items.findIndex((item) => item.id === targetId);

  if (draggedIndex === -1 || targetIndex === -1) return items;

  const next = [...items];
  const [moved] = next.splice(draggedIndex, 1);
  next.splice(targetIndex, 0, moved);
  return next;
}
