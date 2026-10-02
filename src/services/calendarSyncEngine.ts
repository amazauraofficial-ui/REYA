/**
 * Real-Time Google Calendar Synchronization Engine
 * Maps internal appointment booking engine data to Google Calendar API v3
 * for Provider and Admin real-time calendar synchronization.
 */

import { PersistentAppointment, setAppointmentGoogleCalendarId, recordAuditLog } from './appointmentService';
import { CalendarEventPayload, GoogleCalendarEventResult } from './googleCalendarService';

/**
 * Maps human-readable appointment dates and slots into ISO 8601 strings
 * Default Timezone: America/Los_Angeles (-07:00 / -08:00)
 */
export function mapAppointmentToCalendarPayload(apt: PersistentAppointment): CalendarEventPayload {
  // Parse date: e.g. "March 10, 2026" or "8" or fallback
  let year = 2026;
  let month = 3;
  let day = 10;

  const match = apt.date.match(/([A-Za-z]+)\s+(\d{1,2}),?\s*(\d{4})?/);
  if (match) {
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const mIdx = monthNames.indexOf(match[1].toLowerCase());
    if (mIdx !== -1) month = mIdx + 1;
    day = parseInt(match[2], 10);
    if (match[3]) year = parseInt(match[3], 10);
  } else {
    const dayMatch = apt.date.match(/\d+/);
    if (dayMatch) day = parseInt(dayMatch[0], 10);
  }

  // Parse time slot: e.g. "13:30 - 16:30" or "10:00 - 13:00"
  let startHour = 13;
  let startMin = 30;
  let endHour = 16;
  let endMin = 30;

  const timeMatch = apt.timeSlot.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (timeMatch) {
    startHour = parseInt(timeMatch[1], 10);
    startMin = parseInt(timeMatch[2], 10);
    endHour = parseInt(timeMatch[3], 10);
    endMin = parseInt(timeMatch[4], 10);
  }

  const pad = (n: number) => n.toString().padStart(2, '0');
  const datePrefix = `${year}-${pad(month)}-${pad(day)}`;
  const startDateTime = `${datePrefix}T${pad(startHour)}:${pad(startMin)}:00-07:00`;
  const endDateTime = `${datePrefix}T${pad(endHour)}:${pad(endMin)}:00-07:00`;

  return {
    title: `[REYA] ${apt.serviceTitle} — ${apt.guestName}`,
    description: [
      `REYA LUXURY SPA & WELLNESS RETREAT`,
      `----------------------------------------`,
      `Service: ${apt.serviceTitle}`,
      `Guest Name: ${apt.guestName}`,
      `Contact Phone: ${apt.guestPhone}`,
      `Contact Email: ${apt.guestEmail || 'Not provided'}`,
      `Suite / Chamber: ${apt.roomName}`,
      `Lead Practitioner: ${apt.providerName}`,
      `Reservation Ref: ${apt.id}`,
      `Status: ${apt.status}`,
      apt.notes ? `Guest Note: ${apt.notes}` : '',
      `----------------------------------------`,
      `Beverly Hills Sanctuary: 14 Zen Pavilion Ave`,
    ].filter(Boolean).join('\n'),
    location: `REYA Luxury Sanctuary, 14 Zen Pavilion Ave, Beverly Hills, CA 90210`,
    startDateTime,
    endDateTime,
  };
}

/**
 * Creates or updates an appointment on the user's Google Calendar in real time
 */
export async function syncAppointmentToGoogle(
  apt: PersistentAppointment,
  accessToken: string,
  actorEmail = 'system'
): Promise<{ eventId: string; htmlLink: string }> {
  const payload = mapAppointmentToCalendarPayload(apt);

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
        { method: 'popup', minutes: 60 },
      ],
    },
  };

  // If already mapped to an existing Google Calendar event, update it (PATCH)
  if (apt.googleCalendarEventId) {
    const updateRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${apt.googleCalendarEventId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventBody),
      }
    );

    if (updateRes.ok) {
      const data = await updateRes.json();
      await recordAuditLog({
        actor: actorEmail,
        role: 'STAFF',
        action: 'CALENDAR_EVENT_UPDATE',
        resource: `appointments/${apt.id}`,
        details: `Updated Google Calendar event ${apt.googleCalendarEventId} for ${apt.guestName}`,
      });
      return { eventId: data.id, htmlLink: data.htmlLink };
    }
  }

  // Otherwise, create a new Google Calendar event (POST)
  const createRes = await fetch(
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

  if (!createRes.ok) {
    const errData = await createRes.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Google Calendar sync error: ${createRes.statusText}`);
  }

  const createdData = await createRes.json();
  
  // Persist the Google Calendar Event ID back to Firestore
  await setAppointmentGoogleCalendarId(apt.id, createdData.id);

  await recordAuditLog({
    actor: actorEmail,
    role: 'STAFF',
    action: 'CALENDAR_EVENT_CREATE',
    resource: `appointments/${apt.id}`,
    details: `Created Google Calendar event ${createdData.id} for ${apt.serviceTitle}`,
  });

  return { eventId: createdData.id, htmlLink: createdData.htmlLink };
}

/**
 * Removes an event from Google Calendar when cancelled
 */
export async function removeAppointmentFromGoogle(
  eventId: string,
  accessToken: string
): Promise<boolean> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.ok;
  } catch (err) {
    console.warn('Could not remove event from Google Calendar:', err);
    return false;
  }
}

export interface BatchSyncReport {
  total: number;
  synced: number;
  failed: number;
  results: Array<{
    appointmentId: string;
    guestName: string;
    eventId: string;
    htmlLink: string;
    success: boolean;
    error?: string;
  }>;
}

/**
 * Batch synchronizes all appointments for a Provider or Admin into Google Calendar
 */
export async function batchSyncAppointments(
  appointments: PersistentAppointment[],
  accessToken: string,
  filterProvider?: string,
  actorEmail = 'admin@reya.spa'
): Promise<BatchSyncReport> {
  const eligible = appointments.filter((apt) => {
    if (apt.status === 'CANCELLED') return false;
    if (filterProvider && !apt.providerName.toLowerCase().includes(filterProvider.toLowerCase())) {
      return false;
    }
    return true;
  });

  const report: BatchSyncReport = {
    total: eligible.length,
    synced: 0,
    failed: 0,
    results: [],
  };

  for (const apt of eligible) {
    try {
      const syncResult = await syncAppointmentToGoogle(apt, accessToken, actorEmail);
      report.synced++;
      report.results.push({
        appointmentId: apt.id,
        guestName: apt.guestName,
        eventId: syncResult.eventId,
        htmlLink: syncResult.htmlLink,
        success: true,
      });
    } catch (err: any) {
      report.failed++;
      report.results.push({
        appointmentId: apt.id,
        guestName: apt.guestName,
        eventId: '',
        htmlLink: '',
        success: false,
        error: err.message || 'Sync failed',
      });
    }
  }

  return report;
}
