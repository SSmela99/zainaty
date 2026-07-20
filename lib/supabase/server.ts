import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { isInvalidRefreshTokenError } from "@/lib/supabase/auth-errors";

export async function createClient() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Ignored in Server Components where cookies are read-only.
          }
        },
      },
    },
  );

  const { error } = await supabase.auth.getUser();

  if (isInvalidRefreshTokenError(error)) {
    await supabase.auth.signOut();
  }

  return supabase;
}
