import type { AuthError } from "@supabase/supabase-js";

export function isInvalidRefreshTokenError(error: AuthError | null | undefined) {
  if (!error) {
    return false;
  }

  return (
    error.code === "refresh_token_not_found" ||
    error.message.includes("Refresh Token Not Found")
  );
}
