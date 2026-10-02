import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { recordAuditLog } from './appointmentService';

export interface ClinicalNoteRecord {
  id: string;
  appointmentId: string;
  patientName: string;
  patientEmail: string;
  providerName: string;
  treatmentName: string;
  procedureSummary: string;
  vitalObservations: string;
  oilFormulation: string;
  aftercareInstructions: string[];
  restrictedToStaff: boolean;
  createdAt: string;
}

const INITIAL_CLINICAL_NOTES: ClinicalNoteRecord[] = [
  {
    id: 'note-1',
    appointmentId: 'REYA-782104',
    patientName: 'Elena Rostova',
    patientEmail: 'elena.rostova@example.com',
    providerName: 'Master Therapist Somchai',
    treatmentName: 'Meditation Spa Day (3-hour Ritual)',
    procedureSummary: 'Completed 90-min acupressure massage targeting upper trapezius and cervical tension. Followed with natural enzymatic papaya facial peel and antioxidant chocolate body wrap in heated cocoon.',
    vitalObservations: 'Guest reported significant reduction in tension. Skin hydration visibly replenished.',
    oilFormulation: 'Warm virgin coconut infused with natural bergamot, lemongrass, and frangipani extract.',
    aftercareInstructions: [
      'Drink at least 2 liters of warm mineral water or herbal tea over the next 24 hours to support lymphatic flush.',
      'Refrain from heavy exercise or high-temperature showers for 6 hours to allow essential oils to absorb deeply.',
      'Apply light botanical moisturizing serum before bedtime.',
    ],
    restrictedToStaff: false,
    createdAt: '2026-03-10T16:45:00Z',
  },
  {
    id: 'note-2',
    appointmentId: 'REYA-651923',
    patientName: 'Sophia Montgomery',
    patientEmail: 'sophia.m@example.com',
    providerName: 'Senior Practitioner Anong',
    treatmentName: 'Royal Couples Sanctuary & Bathing Hall',
    procedureSummary: 'Private grotto hydrotherapy ritual followed by synchronised Swedish-Eastern blend massage.',
    vitalObservations: 'Zero muscular discomfort noted. Full range of motion in shoulders restored.',
    oilFormulation: 'Damask rose attar in cold-pressed sweet almond base.',
    aftercareInstructions: [
      'Gentle stretching recommended tomorrow morning.',
      'Avoid dehydrating beverages for 12 hours.',
    ],
    restrictedToStaff: false,
    createdAt: '2026-03-12T20:15:00Z',
  },
];

export async function getClinicalNotes(): Promise<ClinicalNoteRecord[]> {
  try {
    const colRef = collection(db, 'clinicalNotes');
    const snap = await getDocs(colRef);
    if (snap.empty) {
      for (const n of INITIAL_CLINICAL_NOTES) {
        await setDoc(doc(db, 'clinicalNotes', n.id), n);
      }
      return INITIAL_CLINICAL_NOTES;
    }
    return snap.docs.map((d) => d.data() as ClinicalNoteRecord);
  } catch {
    return INITIAL_CLINICAL_NOTES;
  }
}

export async function createClinicalNote(
  note: Omit<ClinicalNoteRecord, 'id' | 'createdAt'>,
  providerEmail: string
): Promise<ClinicalNoteRecord> {
  const id = `note-${Date.now()}`;
  const fullNote: ClinicalNoteRecord = {
    ...note,
    id,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'clinicalNotes', id), fullNote);
    await recordAuditLog({
      actor: providerEmail,
      role: 'PROVIDER',
      action: 'CLINICAL_NOTE_CREATE',
      resource: `clinicalNotes/${id}`,
      details: `Created clinical procedure record for appointment ${note.appointmentId}`,
    });
    return fullNote;
  } catch (err) {
    console.warn('Failed to save clinical note to Firestore:', err);
    return fullNote;
  }
}
