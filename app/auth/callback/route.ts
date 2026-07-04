import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { PATHS } from "@/lib/paths";

function getSafeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/")) {
    return PATHS.HOME;
  }

  return next;
}

function redirectWithAuthStatus(
  request: NextRequest,
  nextPath: string,
  status: "success" | "error",
) {
  const redirectUrl = new URL(nextPath, request.url);
  redirectUrl.searchParams.set("auth", status);
  return NextResponse.redirect(redirectUrl);
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const safeNext = getSafeNextPath(searchParams.get("next"));

  const response = redirectWithAuthStatus(request, safeNext, "success");

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

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return response;
    }
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (!error) {
      return response;
    }
  }

  return redirectWithAuthStatus(request, PATHS.HOME, "error");
}
