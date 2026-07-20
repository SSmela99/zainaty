import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import {
  isPasswordSetupLinkType,
} from "@/lib/auth/password-setup";
import {
  setPasswordRecoveryPendingOnResponse,
} from "@/lib/auth/recovery";
import { PATHS } from "@/lib/paths";
import { updateSession } from "@/lib/supabase/middleware";

async function handlePasswordSetupLink(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (!code && !(tokenHash && isPasswordSetupLinkType(type))) {
    return null;
  }

  const redirectUrl = new URL(PATHS.SET_PASSWORD, request.url);
  redirectUrl.searchParams.set("info", "setup");
  const response = NextResponse.redirect(redirectUrl);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : await supabase.auth.verifyOtp({
        token_hash: tokenHash!,
        type: type as EmailOtpType,
      });

  if (error) {
    const errorUrl = new URL(PATHS.SET_PASSWORD, request.url);
    errorUrl.searchParams.set("auth", "setup_error");
    return NextResponse.redirect(errorUrl);
  }

  return response;
}

async function handlePasswordRecoveryLink(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (!code && !(tokenHash && type === "recovery")) {
    return null;
  }

  const redirectUrl = new URL(PATHS.RESET_PASSWORD, request.url);
  redirectUrl.searchParams.set("info", "recovery");
  const response = NextResponse.redirect(redirectUrl);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : await supabase.auth.verifyOtp({
        token_hash: tokenHash!,
        type: "recovery" as EmailOtpType,
      });

  if (error) {
    const errorUrl = new URL(PATHS.FORGOT_PASSWORD, request.url);
    errorUrl.searchParams.set("auth", "recovery_error");
    return NextResponse.redirect(errorUrl);
  }

  setPasswordRecoveryPendingOnResponse(response);
  return response;
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === PATHS.SET_PASSWORD) {
    const setupResponse = await handlePasswordSetupLink(request);

    if (setupResponse) {
      return setupResponse;
    }
  }

  if (request.nextUrl.pathname === PATHS.RESET_PASSWORD) {
    const recoveryResponse = await handlePasswordRecoveryLink(request);

    if (recoveryResponse) {
      return recoveryResponse;
    }
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/admin", "/auth/callback", "/nowe-haslo", "/ustaw-haslo"],
};
