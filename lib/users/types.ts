export type UserPurchasedCourse = {
  course_id: string;
  title: string;
  slug: string;
  purchased_at: string;
};

export type CourseOption = {
  id: string;
  title: string;
  slug: string;
};

export type AdminUser = {
  id: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
  last_sign_in_at: string | null;
};

export type UsersListParams = {
  search?: string;
  page?: number;
  pageSize?: number;
};

export type UsersListResult = {
  items: AdminUser[];
  total: number;
  page: number;
  pageSize: number;
};

export type UsersActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
