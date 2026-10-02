import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getAppointments,
  updateAppointmentStatus,
  PersistentAppointment,
} from '../../services/appointmentService';
import {
  getClinicalNotes,
  createClinicalNote,
  ClinicalNoteRecord,
} from '../../services/clinicalService';
import {
  syncAppointmentToGoogle,
  batchSyncAppointments,
  BatchSyncReport,
} from '../../services/calendarSyncEngine';
import LotusLogo from '../LotusLogo';
import {
  Calendar,
  Clock,
  User,
  FileEdit,
  CheckCircle,
  Plus,
  X,
  Sparkles,
  Stethoscope,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface ProviderPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'ru';
}

export default function ProviderPortalModal({
  isOpen,
  onClose,
  language,
}: ProviderPortalModalProps) {
  const { profile, accessToken, loginWithGoogle } = useAuth();
  const [appointments, setAppointments] = useState<PersistentAppointment[]>([]);
  const [selectedApt, setSelectedApt] = useState<PersistentAppointment | null>(null);
  const [noteForm, setNoteForm] = useState({
    procedureSummary: '',
    vitalObservations: '',
    oilFormulation: '',
    aftercare1: '',
    aftercare2: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [syncingCalendar, setSyncingCalendar] = useState(false);
  const [syncReport, setSyncReport] = useState<BatchSyncReport | null>(null);
  const [individualSync, setIndividualSync] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    if (!isOpen) return;
    async function load() {
      const apts = await getAppointments();
      setAppointments(apts);
      if (apts.length > 0) setSelectedApt(apts[0]);
    }
    load();
  }, [isOpen]);

  if (!isOpen) return null;

  // Real-time sync for single appointment
  const handleSyncSingleToGoogle = async (apt: PersistentAppointment) => {
    if (!accessToken) {
      await loginWithGoogle();
      return;
    }
    setIndividualSync((prev) => ({ ...prev, [apt.id]: 'syncing' }));
    try {
      const res = await syncAppointmentToGoogle(apt, accessToken, profile?.email || 'provider@reya.spa');
      setIndividualSync((prev) => ({ ...prev, [apt.id]: 'synced' }));
      setAppointments((prev) =>
        prev.map((a) => (a.id === apt.id ? { ...a, googleCalendarEventId: res.eventId } : a))
      );
    } catch (err: any) {
      setIndividualSync((prev) => ({ ...prev, [apt.id]: 'error' }));
      console.error(err);
    }
  };

  // Batch sync all provider's appointments into Google Calendar
  const handleBatchSyncCalendar = async () => {
    if (!accessToken) {
      await loginWithGoogle();
      return;
    }
    setSyncingCalendar(true);
    setSyncReport(null);
    try {
      const report = await batchSyncAppointments(
        appointments,
        accessToken,
        undefined,
        profile?.email || 'provider@reya.spa'
      );
      setSyncReport(report);
      // Reload appointments to reflect new event IDs
      const updated = await getAppointments();
      setAppointments(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSyncingCalendar(false);
    }
  };

  const handleStatusChange = async (aptId: string, status: PersistentAppointment['status']) => {
    await updateAppointmentStatus(aptId, status, profile?.email || 'provider@reya.spa');
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status } : a))
    );
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApt) return;
    setIsSubmitting(true);
    try {
      await createClinicalNote(
        {
          appointmentId: selectedApt.id,
          patientName: selectedApt.guestName,
          patientEmail: selectedApt.guestEmail,
          providerName: profile?.displayName || 'Master Practitioner',
          treatmentName: selectedApt.serviceTitle,
          procedureSummary: noteForm.procedureSummary || 'Full treatment completed according to holistic sanctuary protocols.',
          vitalObservations: noteForm.vitalObservations || 'Patient relaxed, muscular tension released.',
          oilFormulation: noteForm.oilFormulation || 'Cold-pressed coconut, bergamot & jasmine.',
          aftercareInstructions: [
            noteForm.aftercare1 || 'Hydrate with warm herbal infusion.',
            noteForm.aftercare2 || 'Avoid strenuous workouts for 12 hours.',
          ].filter(Boolean),
          restrictedToStaff: false,
        },
        profile?.email || 'provider@reya.spa'
      );
      setSuccessMsg('Clinical record & aftercare successfully published to patient portal!');
      setTimeout(() => setSuccessMsg(''), 4000);
      setNoteForm({
        procedureSummary: '',
        vitalObservations: '',
        oilFormulation: '',
        aftercare1: '',
        aftercare2: '',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-5xl bg-[#0b1213] border border-[#d6b77c]/40 rounded-3xl overflow-hidden shadow-2xl shadow-black flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-white/[0.08] flex items-center justify-between bg-[#0e1718]">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-full bg-[#d6b77c]/10 text-[#d6b77c]">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#d6b77c] font-medium block">
                PRACTITIONER & CLINICAL CONSOLE
              </span>
              <h2 className="font-serif-luxury text-2xl text-[#f7f3eb] font-light">
                {profile?.displayName || 'Master Practitioner'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body (Split view: Appointments on left, Clinical Charting on right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* Left: Today's Assigned Appointments */}
          <div className="lg:col-span-5 p-6 border-r border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#d6b77c] font-semibold">
                Today's Treatment Schedule
              </h3>
              <button
                onClick={handleBatchSyncCalendar}
                disabled={syncingCalendar}
                className="px-2.5 py-1 rounded-full bg-[#d6b77c]/15 hover:bg-[#d6b77c]/25 border border-[#d6b77c] text-[#d6b77c] text-[10px] font-mono flex items-center gap-1.5 transition-colors"
                title="Sync all appointments to Google Calendar"
              >
                <RefreshCw className={`w-3 h-3 ${syncingCalendar ? 'animate-spin' : ''}`} />
                <span>{syncingCalendar ? 'Syncing...' : 'Sync Calendar'}</span>
              </button>
            </div>

            {syncReport && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono">
                ✓ Synced {syncReport.synced}/{syncReport.total} appointments with Google Calendar
              </div>
            )}

            <div className="space-y-3">
              {appointments.map((apt) => {
                const isSelected = selectedApt?.id === apt.id;
                const syncState = individualSync[apt.id] || (apt.googleCalendarEventId ? 'synced' : 'idle');
                return (
                  <div
                    key={apt.id}
                    onClick={() => setSelectedApt(apt)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-white/[0.06] border-[#d6b77c]'
                        : 'bg-white/[0.015] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[11px] text-[#d6b77c]">{apt.id}</span>
                      <div className="flex items-center gap-2">
                        {apt.googleCalendarEventId && (
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-600/30">
                            Calendar Synced ✓
                          </span>
                        )}
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white">
                          {apt.status}
                        </span>
                      </div>
                    </div>

                    <h4 className="font-serif-luxury text-base text-[#f7f3eb]">
                      {apt.guestName}
                    </h4>

                    <div className="text-xs text-[#a8a398] space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#d6b77c]" />
                        <span>{apt.timeSlot} ({apt.date})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <LotusLogo size={14} className="text-[#d6b77c]" />
                        <span>{apt.roomName}</span>
                      </div>
                    </div>

                    {/* Quick status transitions & Google Calendar individual sync */}
                    <div className="pt-2 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleStatusChange(apt.id, 'CHECKED_IN')}
                          className="px-2 py-1 text-[10px] uppercase font-mono rounded bg-white/5 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30"
                        >
                          Check-in
                        </button>
                        <button
                          onClick={() => handleStatusChange(apt.id, 'COMPLETED')}
                          className="px-2 py-1 text-[10px] uppercase font-mono rounded bg-white/5 hover:bg-[#d6b77c] text-[#d6b77c] hover:text-black border border-[#d6b77c]/30"
                        >
                          Complete
                        </button>
                      </div>

                      <button
                        onClick={() => handleSyncSingleToGoogle(apt)}
                        disabled={syncState === 'syncing'}
                        className="px-2 py-1 text-[10px] font-mono rounded bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 flex items-center gap-1"
                        title="Sync this slot to Google Calendar"
                      >
                        <Calendar className="w-3 h-3 text-[#d6b77c]" />
                        <span>{syncState === 'syncing' ? '...' : syncState === 'synced' ? 'Synced' : 'To Cal'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Clinical Documentation Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            {selectedApt ? (
              <form onSubmit={handleSaveNote} className="space-y-5">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#d6b77c] block">
                    Recording Clinical Notes & Aftercare
                  </span>
                  <h3 className="font-serif-luxury text-2xl text-[#f7f3eb]">
                    {selectedApt.guestName} — {selectedApt.serviceTitle}
                  </h3>
                </div>

                {successMsg && (
                  <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs">
                    {successMsg}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#a8a398]">
                    Procedure Notes & Observations *
                  </label>
                  <textarea
                    rows={3}
                    value={noteForm.procedureSummary}
                    onChange={(e) => setNoteForm({ ...noteForm, procedureSummary: e.target.value })}
                    placeholder="Document techniques applied, areas of tension, guest responses..."
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#d6b77c]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#a8a398]">
                    Custom Botanical Formulation Blended
                  </label>
                  <input
                    type="text"
                    value={noteForm.oilFormulation}
                    onChange={(e) => setNoteForm({ ...noteForm, oilFormulation: e.target.value })}
                    placeholder="e.g. Organic Jasmine & Cold-Pressed Bergamot in Virgin Coconut Base"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#d6b77c]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-[#d6b77c]">
                    Post-Procedure Aftercare Guidelines (Visible in Patient Portal)
                  </label>
                  <input
                    type="text"
                    value={noteForm.aftercare1}
                    onChange={(e) => setNoteForm({ ...noteForm, aftercare1: e.target.value })}
                    placeholder="Guideline 1: Hydrate with 2L mineral water over next 24 hours"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#d6b77c]"
                  />
                  <input
                    type="text"
                    value={noteForm.aftercare2}
                    onChange={(e) => setNoteForm({ ...noteForm, aftercare2: e.target.value })}
                    placeholder="Guideline 2: Rest and avoid extreme heat/sauna for 6 hours"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#d6b77c]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#d6b77c] hover:bg-[#c5a367] text-[#090f10] text-xs uppercase tracking-widest font-semibold rounded-full transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Publish Clinical Record & Aftercare</span>
                </button>
              </form>
            ) : (
              <p className="text-xs text-[#8e897e]">Select an appointment to record chart.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
