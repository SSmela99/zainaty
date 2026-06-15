export type FooterSettings = {
  id: string;
  description: string;
  social_facebook: string;
  social_instagram: string;
  social_linkedin: string;
  social_youtube: string;
  contact_line_1: string;
  contact_line_2: string;
  contact_line_3: string;
  contact_line_4: string;
  updated_at: string;
};

export type FooterSettingsFormInput = {
  description: string;
  social_facebook: string;
  social_instagram: string;
  social_linkedin: string;
  social_youtube: string;
  contact_line_1: string;
  contact_line_2: string;
  contact_line_3: string;
  contact_line_4: string;
};

export type FooterActionResult<T = void> = {
  ok: boolean;
  error?: string;
  data?: T;
};
