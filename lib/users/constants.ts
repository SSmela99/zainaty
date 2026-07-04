export const USERS_PAGE_SIZE = 10;

export function formatUsersCount(count: number): string {
  if (count === 1) return "1 użytkownik";
  if (count >= 2 && count <= 4) return `${count} użytkownicy`;
  return `${count} użytkowników`;
}

export function getTotalPages(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}
