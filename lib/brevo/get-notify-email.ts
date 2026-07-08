export function getNotifyEmail(): string | null {
  const email =
    process.env.CONTACT_NOTIFY_EMAIL?.trim() ||
    process.env.CONSULTATION_NOTIFY_EMAIL?.trim();

  return email || null;
}
