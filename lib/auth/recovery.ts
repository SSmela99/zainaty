import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

export const PASSWORD_RECOVERY_COOKIE = "password_recovery_pending";

export const PASSWORD_RECOVERY_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60,
  path: "/",
};

export function isPasswordRecoveryFlow(
  flow: string | null,
  type: string | null,
): boolean {
  return flow === "password_recovery" || type === "recovery";
}

export async function hasPasswordRecoveryPending(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(PASSWORD_RECOVERY_COOKIE)?.value === "1";
}

export function setPasswordRecoveryPendingOnResponse(
  response: NextResponse,
): void {
  response.cookies.set(
    PASSWORD_RECOVERY_COOKIE,
    "1",
    PASSWORD_RECOVERY_COOKIE_OPTIONS,
  );
}

export async function setPasswordRecoveryPending(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(
    PASSWORD_RECOVERY_COOKIE,
    "1",
    PASSWORD_RECOVERY_COOKIE_OPTIONS,
  );
}

export async function clearPasswordRecoveryPending(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(PASSWORD_RECOVERY_COOKIE);
}
