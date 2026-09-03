-- Unikalny link Google Meet per rezerwacja konsultacji

alter table public.consultation_bookings
  add column if not exists meet_url text,
  add column if not exists google_calendar_event_id text;
