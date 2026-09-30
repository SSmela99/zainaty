import { cookies } from "next/headers";

export const PASSWORD_CONFIRMED_COOKIE = "password_confirmed";

const PASSWORD_CONFIRMED_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 30,
  path: "/",
};

export async function markPasswordConfirmed(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(
    PASSWORD_CONFIRMED_COOKIE,
    "1",
    PASSWORD_CONFIRMED_COOKIE_OPTIONS,
  );
}

export async function hasPasswordConfirmed(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(PASSWORD_CONFIRMED_COOKIE)?.value === "1";
}
