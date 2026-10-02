/**
 * Google Calendar Integration Service
 * Interacts directly with Google Calendar v3 API using client-side OAuth Bearer token
 */

export interface CalendarEventPayload {
  title: string;
  description: string;
  location: string;
  startDateTime: string; // ISO 8601
  endDateTime: string;   // ISO 8601
}

export interface GoogleCalendarEventResult {
  id: string;
  htmlLink: string;
  summary: string;
  status: string;
}

/**
 * Creates an event in the user's Primary Google Calendar
 */
export async function createGoogleCalendarEvent(
  accessToken: string,
  payload: CalendarEventPayload
): Promise<GoogleCalendarEventResult> {
  const eventBody = {
    summary: payload.title,
    description: payload.description,
    location: payload.location,
    start: {
      dateTime: payload.startDateTime,
      timeZone: 'America/Los_Angeles',
    },
    end: {
      dateTime: payload.endDateTime,
      timeZone: 'America/Los_Angeles',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 120 },
      ],
    },
  };

  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventBody),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `Google Calendar API error: ${response.statusText}`
    );
  }

  const result = await response.json();
  return {
    id: result.id,
    htmlLink: result.htmlLink,
    summary: result.summary,
    status: result.status,
  };
}

/**
 * Generates a direct Google Calendar Web intent URL for fallback or instant 1-click addition
 */
export function generateGoogleCalendarWebUrl(payload: {
  title: string;
  details: string;
  location: string;
  startDate: string; // YYYYMMDDTHHMMSSZ or YYYYMMDD
  endDate: string;
}): string {
  const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const params = new URLSearchParams({
    text: payload.title,
    details: payload.details,
    location: payload.location,
    dates: `${payload.startDate}/${payload.endDate}`,
  });
  return `${base}&${params.toString()}`;
}
