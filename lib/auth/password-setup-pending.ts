import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

export const PASSWORD_SETUP_COOKIE = "password_setup_pending";

export const PASSWORD_SETUP_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60,
  path: "/",
};

export async function hasPasswordSetupPending(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(PASSWORD_SETUP_COOKIE)?.value === "1";
}

export function setPasswordSetupPendingOnResponse(
  response: NextResponse,
): void {
  response.cookies.set(
    PASSWORD_SETUP_COOKIE,
    "1",
    PASSWORD_SETUP_COOKIE_OPTIONS,
  );
}

export async function clearPasswordSetupPending(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(PASSWORD_SETUP_COOKIE);
}
