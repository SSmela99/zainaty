export function formatBlogDate(iso: string | null): string {
  if (!iso) return "";

  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min czytania`;
}

export function sortTagsByName<T extends { name: string }>(tags: T[]): T[] {
  return [...tags].sort((a, b) => a.name.localeCompare(b.name, "pl"));
}

export function getPrimaryTagName(tags: { name: string }[]): string | null {
  if (tags.length === 0) return null;

  return sortTagsByName(tags)[0]?.name ?? null;
}
