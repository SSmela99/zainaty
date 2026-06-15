const MAILERLITE_API_URL = "https://connect.mailerlite.com/api/subscribers";

type SubscribeToMailerLiteInput = {
  email: string;
  source?: string;
};

type MailerLiteErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

function getMailerLiteGroupId(): number | undefined {
  const raw = process.env.MAILERLITE_GROUP_ID?.trim();

  if (!raw) {
    return undefined;
  }

  if (!/^\d+$/.test(raw)) {
    console.warn(
      "[mailerlite] MAILERLITE_GROUP_ID musi byc liczba. Pomijam przypisanie do grupy.",
    );
    return undefined;
  }

  return Number(raw);
}

export async function subscribeToMailerLite({
  email,
  source,
}: SubscribeToMailerLiteInput) {
  const apiKey = process.env.MAILERLITE_API_KEY;

  if (!apiKey) {
    throw new Error("Brak konfiguracji MailerLite API.");
  }

  const body: {
    email: string;
    fields?: Record<string, string>;
    groups?: number[];
  } = { email };

  const groupId = getMailerLiteGroupId();
  if (groupId) {
    body.groups = [groupId];
  }

  const sourceField = process.env.MAILERLITE_SOURCE_FIELD;
  if (sourceField && source) {
    body.fields = { [sourceField]: source };
  }

  const response = await fetch(MAILERLITE_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as
      | MailerLiteErrorResponse
      | null;

    const fieldErrors = error?.errors
      ? Object.values(error.errors).flat().join(" ")
      : "";

    throw new Error(
      fieldErrors || error?.message || "Nie udało się zapisać do newslettera.",
    );
  }

  return response.json();
}
