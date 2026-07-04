export type Testimonial = {
  id: string;
  author_name: string;
  author_role: string;
  content: string;
  rating: number;
  avatar_url: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type TestimonialFormInput = {
  author_name: string;
  author_role: string;
  content: string;
  rating: number;
  avatar_url: string | null;
  published: boolean;
};

export type TestimonialActionResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };
