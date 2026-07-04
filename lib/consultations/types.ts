export type ConsultationSlotRef = {
  date: string;
  time: string;
};

export type ConsultationExclusionRef = {
  date: string;
  time: string | null;
};

export type ConsultationAvailability = {
  bookedSlots: ConsultationSlotRef[];
  exclusions: ConsultationExclusionRef[];
};

export type ConsultationBooking = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  scheduled_date: string;
  scheduled_time: string;
  created_at: string;
  updated_at: string;
};

export type ConsultationExclusion = {
  id: string;
  exclusion_date: string;
  excluded_time: string | null;
  created_at: string;
};

export type ConsultationBookingFormInput = {
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  scheduledDate: string;
  scheduledTime: string;
};

export type ConsultationExclusionFormInput = {
  exclusionDate: string;
  wholeDay: boolean;
  times: string[];
};

export type ConsultationActionResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };
