import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAppointments, PersistentAppointment } from '../../services/appointmentService';
import { getClinicalNotes, ClinicalNoteRecord } from '../../services/clinicalService';
import {
  createGoogleCalendarEvent,
  generateGoogleCalendarWebUrl,
} from '../../services/googleCalendarService';
import LotusLogo from '../LotusLogo';
import {
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  CreditCard,
  Bell,
  Shield,
  X,
  ExternalLink,
  Download,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface PatientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
  language: 'en' | 'ru';
}

export default function PatientPortalModal({
  isOpen,
  onClose,
  onOpenBooking,
  language,
}: PatientPortalModalProps) {
  const { profile, accessToken, loginWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<'appointments' | 'history' | 'aftercare' | 'invoices' | 'settings'>('appointments');
  const [appointments, setAppointments] = useState<PersistentAppointment[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNoteRecord[]>([]);
  const [calendarSyncStatus, setCalendarSyncStatus] = useState<{ [id: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    async function loadData() {
      setLoading(true);
      try {
        const [apts, notes] = await Promise.all([getAppointments(), getClinicalNotes()]);
        setAppointments(apts);
        setClinicalNotes(notes);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isOpen]);

  if (!isOpen) return null;

  const t = {
    en: {
      portalTitle: 'GUEST SANCTUARY PORTAL',
      welcome: 'Welcome,',
      tabs: {
        appointments: 'Appointments',
        history: 'Treatment Records',
        aftercare: 'Clinical Aftercare',
        invoices: 'Invoices & Receipts',
        settings: 'Preferences & Security',
      },
      upcomingTitle: 'Your Scheduled Ceremonies',
      bookNew: 'Reserve New Ceremony',
      calendarSyncBtn: 'Sync to Google Calendar',
      syncSuccess: 'Synced to Google Calendar',
      downloadReceipt: 'Download Receipt',
      aftercareTitle: 'Post-Treatment Guidance & Aftercare',
      googleConnected: 'Google Calendar Connected',
      connectGoogle: 'Connect Google Calendar',
    },
    ru: {
      portalTitle: 'ЛИЧНЫЙ КАБИНЕТ ГОСТЯ',
      welcome: 'Добро пожаловать,',
      tabs: {
        appointments: 'Мои визиты',
        history: 'История процедур',
        aftercare: 'Рекомендации и уход',
        invoices: 'Счета и чеки',
        settings: 'Настройки и профиль',
      },
      upcomingTitle: 'Ваши забронированные визиты',
      bookNew: 'Забронировать процедуру',
      calendarSyncBtn: 'Добавить в Google Календарь',
      syncSuccess: 'Синхронизировано с Google',
      downloadReceipt: 'Скачать чек',
      aftercareTitle: 'Индивидуальные рекомендации после сеанса',
      googleConnected: 'Google Календарь подключен',
      connectGoogle: 'Подключить Google Календарь',
    },
  }[language];

  // Handle Google Calendar sync for an appointment
  const handleSyncToGoogleCalendar = async (apt: PersistentAppointment) => {
    setCalendarSyncStatus((prev) => ({ ...prev, [apt.id]: 'syncing' }));

    // Extract start and end time (default to 2026-03-10T13:30:00-08:00)
    const startIso = '2026-03-10T13:30:00-08:00';
    const endIso = '2026-03-10T16:30:00-08:00';

    if (accessToken) {
      try {
        const result = await createGoogleCalendarEvent(accessToken, {
          title: `REYA Spa: ${apt.serviceTitle}`,
          description: `Appointment at REYA Luxury Spa & Wellness Sanctuary.\nRoom: ${apt.roomName}\nPractitioner: ${apt.providerName}\nRef: ${apt.id}`,
          location: 'REYA Sanctuary, 14 Zen Pavilion Ave',
          startDateTime: startIso,
          endDateTime: endIso,
        });
        setCalendarSyncStatus((prev) => ({ ...prev, [apt.id]: 'success' }));
      } catch (err) {
        console.warn('Direct Calendar API call failed, opening web calendar intent:', err);
        // Fallback to web link
        openWebCalendarIntent(apt);
      }
    } else {
      // If not authenticated with Google token, open direct web URL
      openWebCalendarIntent(apt);
    }
  };

  const openWebCalendarIntent = (apt: PersistentAppointment) => {
    const url = generateGoogleCalendarWebUrl({
      title: `REYA Spa: ${apt.serviceTitle}`,
      details: `Your luxury spa reservation at REYA Sanctuary.\nRoom: ${apt.roomName}\nRef: ${apt.id}`,
      location: 'REYA Luxury Sanctuary, 14 Zen Pavilion Ave',
      startDate: '20260310T213000Z',
      endDate: '20260311T003000Z',
    });
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
    setCalendarSyncStatus((prev) => ({ ...prev, [apt.id]: 'success' }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-5xl bg-[#0b1213] border border-[#d6b77c]/30 rounded-3xl overflow-hidden shadow-2xl shadow-black flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-6 sm:p-8 border-b border-white/[0.08] flex items-center justify-between bg-[#0e1718]">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-full bg-[#d6b77c]/10 text-[#d6b77c]">
              <LotusLogo size={28} />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#d6b77c] font-medium block">
                {t.portalTitle}
              </span>
              <h2 className="font-serif-luxury text-2xl text-[#f7f3eb] font-light">
                {t.welcome} {profile?.displayName || 'Cherished Guest'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Google Calendar Connection Status Badge */}
            {accessToken ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-600/40 text-emerald-400 text-xs font-mono">
                <CheckCircle className="w-3.5 h-3.5" />
                {t.googleConnected}
              </span>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/20 text-[#f7f3eb] hover:border-[#d6b77c] text-xs transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-[#d6b77c]" />
                {t.connectGoogle}
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/[0.06] bg-[#090f10] overflow-x-auto scrollbar-none px-6">
          {(['appointments', 'history', 'aftercare', 'invoices', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-4 sm:px-6 text-xs uppercase tracking-[0.2em] font-medium whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-[#d6b77c] text-[#d6b77c]'
                  : 'border-transparent text-[#a8a398] hover:text-white'
              }`}
            >
              {t.tabs[tab]}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-serif-luxury text-xl text-[#f7f3eb]">
                  {t.upcomingTitle}
                </h3>
                <button
                  onClick={() => {
                    onClose();
                    onOpenBooking();
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#d6b77c] text-[#090f10] text-xs uppercase tracking-widest font-semibold hover:bg-[#c5a367] transition-colors self-start sm:self-auto"
                >
                  + {t.bookNew}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-[#d6b77c]/30 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                      <div>
                        <span className="font-mono text-xs text-[#d6b77c]">{apt.id}</span>
                        <h4 className="font-serif-luxury text-xl text-[#f7f3eb]">
                          {apt.serviceTitle}
                        </h4>
                      </div>
                      <span className="self-start sm:self-auto px-3 py-1 rounded-full text-[11px] font-mono tracking-wider bg-[#d6b77c]/10 text-[#d6b77c] border border-[#d6b77c]/30">
                        {apt.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#b0aba0]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#d6b77c]" />
                        <span>{apt.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#d6b77c]" />
                        <span className="font-mono">{apt.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <LotusLogo size={16} className="text-[#d6b77c]" />
                        <span>{apt.roomName}</span>
                      </div>
                    </div>

                    {apt.notes && (
                      <p className="text-xs text-[#8e897e] italic bg-black/30 p-3 rounded-xl border border-white/5">
                        Preference note: {apt.notes}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <span className="text-xs font-mono text-[#d6b77c] font-semibold">
                        Fee: {apt.price}
                      </span>

                      {/* Google Calendar Sync Button */}
                      <button
                        onClick={() => handleSyncToGoogleCalendar(apt)}
                        className={`px-4 py-2 rounded-full text-xs font-mono flex items-center gap-2 transition-all ${
                          calendarSyncStatus[apt.id] === 'success'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                            : 'bg-white/5 border border-white/20 text-[#f7f3eb] hover:border-[#d6b77c]'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#d6b77c]" />
                        <span>
                          {calendarSyncStatus[apt.id] === 'success'
                            ? t.syncSuccess
                            : t.calendarSyncBtn}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: TREATMENT HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <h3 className="font-serif-luxury text-xl text-[#f7f3eb]">
                Completed Sanctuary Rituals
              </h3>
              <div className="space-y-4">
                {clinicalNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-serif-luxury text-lg text-[#f7f3eb]">
                        {note.treatmentName}
                      </h4>
                      <span className="text-xs font-mono text-[#a8a398]">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-[#d6b77c] font-mono">
                      Master Practitioner: {note.providerName}
                    </p>
                    <p className="font-serif-luxury text-sm text-[#b0aba0] leading-relaxed">
                      {note.procedureSummary}
                    </p>
                    <div className="pt-2 text-xs text-[#8e897e] bg-black/20 p-3 rounded-xl border border-white/5">
                      <span className="font-medium text-white/70 block mb-1">
                        Custom Botanical Blend Used:
                      </span>
                      {note.oilFormulation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CLINICAL AFTERCARE */}
          {activeTab === 'aftercare' && (
            <div className="space-y-6">
              <h3 className="font-serif-luxury text-xl text-[#f7f3eb]">
                {t.aftercareTitle}
              </h3>
              {clinicalNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-[#d6b77c]/30 space-y-4"
                >
                  <div className="flex items-center gap-2 text-[#d6b77c]">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest font-semibold">
                      Ritual: {note.treatmentName}
                    </span>
                  </div>
                  <ul className="space-y-2.5">
                    {note.aftercareInstructions.map((instruction, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-[#b0aba0]">
                        <CheckCircle className="w-4 h-4 text-[#d6b77c] shrink-0 mt-0.5" />
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: INVOICES & RECEIPTS */}
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <h3 className="font-serif-luxury text-xl text-[#f7f3eb]">
                Payment Receipts & Invoices
              </h3>
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="font-mono text-xs text-[#d6b77c]">INV-{apt.id}</span>
                    <h5 className="font-serif-luxury text-base text-[#f7f3eb]">
                      {apt.serviceTitle}
                    </h5>
                    <span className="text-xs text-[#8e897e]">{apt.date}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-[#f7f3eb] font-semibold">
                      {apt.price}
                    </span>
                    <button
                      onClick={() => window.print()}
                      className="p-2 rounded-full border border-white/10 hover:border-white text-white/70 hover:text-white"
                      title={t.downloadReceipt}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: PREFERENCES & SECURITY */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-xl">
              <h3 className="font-serif-luxury text-xl text-[#f7f3eb]">
                Communication Preferences & Security
              </h3>
              <div className="space-y-4 text-xs text-[#b0aba0]">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-white font-medium block">Email Reminders</span>
                    <span>24 hours prior to appointment</span>
                  </div>
                  <input type="checkbox" defaultChecked className="text-[#d6b77c] rounded" />
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-white font-medium block">SMS Notifications</span>
                    <span>Direct text reminders and calendar updates</span>
                  </div>
                  <input type="checkbox" defaultChecked className="text-[#d6b77c] rounded" />
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-white font-medium block">Google Calendar Automatic Sync</span>
                    <span>Automatically create calendar events on booking</span>
                  </div>
                  <input type="checkbox" defaultChecked className="text-[#d6b77c] rounded" />
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
