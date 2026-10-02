import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BookingConfirmation } from '../types';

export interface PersistentAppointment {
  id: string;
  userId?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  serviceTitle: string;
  serviceId: string;
  date: string;
  timeSlot: string;
  status: 'REQUESTED' | 'PENDING_PAYMENT' | 'CONFIRMED' | 'RESCHEDULED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED';
  price: string;
  roomName: string;
  providerName: string;
  googleCalendarEventId?: string;
  createdAt: string;
  notes?: string;
  aftercareSent?: boolean;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  role: string;
  action: string;
  resource: string;
  timestamp: string;
  details: string;
}

// Initial realistic demo appointments to bootstrap the database
const INITIAL_DEMO_APPOINTMENTS: PersistentAppointment[] = [
  {
    id: 'REYA-782104',
    userId: 'demo-patient-1',
    guestName: 'Elena Rostova',
    guestEmail: 'elena.rostova@example.com',
    guestPhone: '+375 29 345-44-55',
    serviceTitle: 'Meditation Spa Day (3-hour Ritual)',
    serviceId: 'meditation-day',
    date: 'March 10, 2026',
    timeSlot: '13:30 - 16:30',
    status: 'CONFIRMED',
    price: '3 500 ₽ / $120',
    roomName: 'Thermal Bathing Hall',
    providerName: 'Master Therapist Somchai',
    createdAt: '2026-03-01T10:00:00Z',
    notes: 'Prefers warm jasmine oil and light pressure around shoulder joints.',
    aftercareSent: true,
  },
  {
    id: 'REYA-651923',
    userId: 'demo-patient-2',
    guestName: 'Sophia Montgomery',
    guestEmail: 'sophia.m@example.com',
    guestPhone: '+1 (555) 234-8921',
    serviceTitle: 'Royal Couples Sanctuary & Bathing Hall',
    serviceId: 'massage',
    date: 'March 12, 2026',
    timeSlot: '17:00 - 20:00',
    status: 'CONFIRMED',
    price: '$260',
    roomName: 'Royal Couples Sanctuary',
    providerName: 'Senior Practitioner Anong',
    createdAt: '2026-03-02T14:30:00Z',
    notes: 'Anniversary celebration. Rose petal bath preparation requested.',
    aftercareSent: false,
  },
  {
    id: 'REYA-912384',
    userId: 'demo-patient-3',
    guestName: 'Alexander Vance',
    guestEmail: 'avance@example.com',
    guestPhone: '+41 79 555 1209',
    serviceTitle: 'Finnish Cedar Sauna & Deep Tissue',
    serviceId: 'sauna',
    date: 'March 14, 2026',
    timeSlot: '10:00 - 13:00',
    status: 'REQUESTED',
    price: '$130',
    roomName: 'Finnish Cedarwood Sauna',
    providerName: 'Master Somchai',
    createdAt: '2026-03-03T09:15:00Z',
    notes: 'Focus on lumbar release and eucalyptus steam venik ceremony.',
    aftercareSent: false,
  },
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    actor: 'system',
    role: 'SYSTEM',
    action: 'INIT_BOOTSTRAP',
    resource: 'appointments',
    timestamp: '2026-03-01T10:00:00Z',
    details: 'Initial clinic availability and schedules seeded in demo mode',
  },
  {
    id: 'log-2',
    actor: 'elena.rostova@example.com',
    role: 'PATIENT',
    action: 'APPOINTMENT_CREATE',
    resource: 'appointments/REYA-782104',
    timestamp: '2026-03-01T10:05:00Z',
    details: 'Reserved Meditation Spa Day session',
  },
  {
    id: 'log-3',
    actor: 'staff.admin@reya.spa',
    role: 'STAFF',
    action: 'STATUS_UPDATE',
    resource: 'appointments/REYA-782104',
    timestamp: '2026-03-01T10:30:00Z',
    details: 'Status transitioned from REQUESTED to CONFIRMED',
  },
];

/**
 * Fetch all appointments from Firestore with fallback seed
 */
export async function getAppointments(): Promise<PersistentAppointment[]> {
  try {
    const colRef = collection(db, 'appointments');
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      // Seed initial demo data into Firestore
      for (const apt of INITIAL_DEMO_APPOINTMENTS) {
        await setDoc(doc(db, 'appointments', apt.id), apt);
      }
      return INITIAL_DEMO_APPOINTMENTS;
    }

    return snapshot.docs.map((docSnap) => docSnap.data() as PersistentAppointment);
  } catch (err) {
    console.warn('Firestore fetch failed, returning in-memory demo appointments:', err);
    return INITIAL_DEMO_APPOINTMENTS;
  }
}

/**
 * Create a new appointment with double booking prevention
 */
export async function createAppointment(
  appointment: Omit<PersistentAppointment, 'createdAt'>
): Promise<PersistentAppointment> {
  const fullAppointment: PersistentAppointment = {
    ...appointment,
    createdAt: new Date().toISOString(),
  };

  try {
    // Check for double booking
    const existing = await getAppointments();
    const hasConflict = existing.some(
      (a) =>
        a.date === fullAppointment.date &&
        a.timeSlot === fullAppointment.timeSlot &&
        a.roomName === fullAppointment.roomName &&
        a.status !== 'CANCELLED'
    );

    if (hasConflict) {
      throw new Error(
        `This time slot in ${fullAppointment.roomName} is already reserved. Please select another time.`
      );
    }

    await setDoc(doc(db, 'appointments', fullAppointment.id), fullAppointment);

    // Record audit log
    await recordAuditLog({
      actor: fullAppointment.guestEmail || fullAppointment.guestName,
      role: 'PATIENT',
      action: 'APPOINTMENT_CREATE',
      resource: `appointments/${fullAppointment.id}`,
      details: `Booked ${fullAppointment.serviceTitle} for ${fullAppointment.date} (${fullAppointment.timeSlot})`,
    });

    return fullAppointment;
  } catch (err: any) {
    console.error('Error saving appointment:', err);
    throw err;
  }
}

/**
 * Update appointment status (Admin / Staff / Provider)
 */
export async function updateAppointmentStatus(
  id: string,
  status: PersistentAppointment['status'],
  actor = 'staff@reya.spa'
): Promise<void> {
  try {
    const ref = doc(db, 'appointments', id);
    await updateDoc(ref, { status });

    await recordAuditLog({
      actor,
      role: 'STAFF',
      action: 'APPOINTMENT_STATUS_CHANGE',
      resource: `appointments/${id}`,
      details: `Updated status to ${status}`,
    });
  } catch (err) {
    console.error('Failed to update appointment status:', err);
    throw err;
  }
}

/**
 * Save Google Calendar Event ID to appointment
 */
export async function setAppointmentGoogleCalendarId(
  appointmentId: string,
  calendarEventId: string
): Promise<void> {
  try {
    const ref = doc(db, 'appointments', appointmentId);
    await updateDoc(ref, { googleCalendarEventId: calendarEventId });
  } catch (err) {
    console.warn('Could not update calendar id:', err);
  }
}

/**
 * Audit log recording
 */
export async function recordAuditLog(
  log: Omit<AuditLogEntry, 'id' | 'timestamp'>
): Promise<void> {
  try {
    const id = `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const fullLog: AuditLogEntry = {
      ...log,
      id,
      timestamp: new Date().toISOString(),
    };
    await setDoc(doc(db, 'auditLogs', id), fullLog);
  } catch (err) {
    console.warn('Could not save audit log to Firestore:', err);
  }
}

/**
 * Get audit logs for Admin portal
 */
export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  try {
    const colRef = collection(db, 'auditLogs');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      for (const log of INITIAL_AUDIT_LOGS) {
        await setDoc(doc(db, 'auditLogs', log.id), log);
      }
      return INITIAL_AUDIT_LOGS;
    }
    return snapshot.docs.map((d) => d.data() as AuditLogEntry);
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

/**
 * Delete an appointment permanently (Admin only)
 */
export async function deleteAppointment(id: string, actor = 'admin@reya.spa'): Promise<void> {
  try {
    const ref = doc(db, 'appointments', id);
    await deleteDoc(ref);
    await recordAuditLog({
      actor,
      role: 'ADMIN',
      action: 'APPOINTMENT_DELETE',
      resource: `appointments/${id}`,
      details: `Permanently deleted appointment ${id}`,
    });
  } catch (err) {
    console.warn('Could not delete appointment from Firestore:', err);
  }
}

/**
 * Update appointment details (Date, Time, Room, Provider, Notes, etc.)
 */
export async function updateAppointment(
  id: string,
  updates: Partial<PersistentAppointment>,
  actor = 'admin@reya.spa'
): Promise<void> {
  try {
    const ref = doc(db, 'appointments', id);
    await updateDoc(ref, updates as { [x: string]: any });
    await recordAuditLog({
      actor,
      role: 'ADMIN',
      action: 'APPOINTMENT_UPDATE',
      resource: `appointments/${id}`,
      details: `Updated details for ${id}: ${Object.keys(updates).join(', ')}`,
    });
  } catch (err) {
    console.error('Failed to update appointment:', err);
    throw err;
  }
}
