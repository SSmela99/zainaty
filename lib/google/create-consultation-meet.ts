import { randomUUID } from "crypto";
import { google } from "googleapis";
import type { calendar_v3 } from "googleapis";

const CONSULTATION_DURATION_MINUTES = 30;
const TIME_ZONE = "Europe/Warsaw";
const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar";

export type ConsultationMeetEventInput = {
  bookingId: string;
  name: string;
  email: string;
  scheduledDate: string;
  scheduledTime: string;
  message?: string | null;
};

export type ConsultationMeetEventResult = {
  meetUrl: string;
  eventId: string;
};

function getPrivateKey(): string {
  let key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.trim();
  if (!key) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is not configured.");
  }

  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  key = key.replace(/\\n/g, "\n").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  if (!key.includes("BEGIN") || !key.includes("PRIVATE KEY")) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY nie wygląda na PEM (brak BEGIN PRIVATE KEY).",
    );
  }

  return key;
}

function getCalendarId(): string {
  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim();
  if (!calendarId) {
    throw new Error("GOOGLE_CALENDAR_ID is not configured.");
  }
  return calendarId;
}

/**
 * Na zwykłym Gmailu Meet działa tylko przez OAuth użytkownika.
 * Service account może tworzyć wydarzenia, ale Google odrzuca hangoutsMeet
 * ("Invalid conference type value").
 */
function getCalendarClient(): {
  calendar: calendar_v3.Calendar;
  calendarId: string;
  canInviteAttendees: boolean;
} {
  const calendarId = getCalendarId();

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN?.trim();

  if (clientId && clientSecret && refreshToken) {
    const auth = new google.auth.OAuth2(clientId, clientSecret);
    auth.setCredentials({ refresh_token: refreshToken });
    return {
      calendar: google.calendar({ version: "v3", auth }),
      calendarId,
      canInviteAttendees: true,
    };
  }

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  if (clientEmail && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.trim()) {
    console.warn(
      "[google] Brak GOOGLE_REFRESH_TOKEN - używam service account. Na Gmail Meet zwykle nie zadziała (Invalid conference type).",
    );
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: getPrivateKey(),
      scopes: [CALENDAR_SCOPE],
    });
    return {
      calendar: google.calendar({ version: "v3", auth }),
      calendarId,
      canInviteAttendees: false,
    };
  }

  throw new Error(
    "Skonfiguruj OAuth: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN (oraz GOOGLE_CALENDAR_ID).",
  );
}

function buildDateTime(date: string, time: string): string {
  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  return `${date}T${normalizedTime}`;
}

function buildEndDateTime(date: string, time: string, minutes: number): string {
  const [hours, mins] = time.split(":").map(Number);
  const total = hours * 60 + mins + minutes;
  const endH = String(Math.floor(total / 60)).padStart(2, "0");
  const endM = String(total % 60).padStart(2, "0");
  return `${date}T${endH}:${endM}:00`;
}

export async function createConsultationMeetEvent(
  input: ConsultationMeetEventInput,
): Promise<ConsultationMeetEventResult> {
  const { calendar, calendarId, canInviteAttendees } = getCalendarClient();

  const startDateTime = buildDateTime(input.scheduledDate, input.scheduledTime);
  const endDateTime = buildEndDateTime(
    input.scheduledDate,
    input.scheduledTime,
    CONSULTATION_DURATION_MINUTES,
  );

  const descriptionParts = [
    `Rezerwacja ze strony Z AI na Ty`,
    `Klient: ${input.name}`,
    `E-mail: ${input.email}`,
    `ID: ${input.bookingId}`,
  ];

  if (input.message?.trim()) {
    descriptionParts.push("", `Wiadomość:`, input.message.trim());
  }

  const response = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    sendUpdates: canInviteAttendees ? "all" : "none",
    requestBody: {
      summary: `Konsultacja - ${input.name}`,
      description: descriptionParts.join("\n"),
      start: {
        dateTime: startDateTime,
        timeZone: TIME_ZONE,
      },
      end: {
        dateTime: endDateTime,
        timeZone: TIME_ZONE,
      },
      ...(canInviteAttendees
        ? {
            attendees: [{ email: input.email, displayName: input.name }],
          }
        : {}),
      conferenceData: {
        createRequest: {
          requestId: randomUUID(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    },
  });

  const eventId = response.data.id;
  const meetUrl =
    response.data.hangoutLink ??
    response.data.conferenceData?.entryPoints?.find(
      (entry) => entry.entryPointType === "video",
    )?.uri;

  if (!eventId || !meetUrl) {
    throw new Error("Google Calendar nie zwróciło linku Meet.");
  }

  return { meetUrl, eventId };
}
