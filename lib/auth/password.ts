export const PASSWORD_MIN_LENGTH = 8;

export type PasswordValidationResult =
  | { ok: true }
  | { ok: false; error: string };

export function validatePassword(password: string): PasswordValidationResult {
  if (!password) {
    return { ok: false, error: "Podaj hasło." };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      ok: false,
      error: `Hasło musi mieć co najmniej ${PASSWORD_MIN_LENGTH} znaków.`,
    };
  }

  return { ok: true };
}

export function validatePasswordConfirmation(
  password: string,
  confirmation: string,
): PasswordValidationResult {
  const passwordResult = validatePassword(password);

  if (!passwordResult.ok) {
    return passwordResult;
  }

  if (password !== confirmation) {
    return { ok: false, error: "Hasła nie są identyczne." };
  }

  return { ok: true };
}
