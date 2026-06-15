export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type FaqItemFormInput = {
  question: string;
  answer: string;
  published: boolean;
};

export type FaqItemInput = FaqItemFormInput & {
  sort_order: number;
};

export type FaqActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string };
