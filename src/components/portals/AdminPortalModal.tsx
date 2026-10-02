import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  updateAppointment,
  deleteAppointment,
  getAuditLogs,
  PersistentAppointment,
  AuditLogEntry,
} from '../../services/appointmentService';
import {
  syncAppointmentToGoogle,
  batchSyncAppointments,
  BatchSyncReport,
} from '../../services/calendarSyncEngine';
import LotusLogo from '../LotusLogo';
import {
  BarChart3,
  Calendar,
  Users,
  ShieldCheck,
  Settings,
  DollarSign,
  TrendingUp,
  X,
  FileText,
  Clock,
  Check,
  Filter,
  RefreshCw,
  Search,
  Plus,
  Trash2,
  Edit2,
  Stethoscope,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  UserCheck,
} from 'lucide-react';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'ru';
}

interface PatientRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalVisits: number;
  totalSpent: string;
  preferredPractitioner: string;
  intakeNotes: string;
  vipTier: 'Gold' | 'Platinum' | 'Diamond';
}

const INITIAL_PATIENTS: PatientRecord[] = [
  {
    id: 'PAT-101',
    name: 'Elena Rostova',
    phone: '+375 29 345-44-55',
    email: 'elena.rostova@example.com',
    totalVisits: 8,
    totalSpent: '$1,240',
    preferredPractitioner: 'Master Somchai',
    intakeNotes: 'Prefers warm jasmine oil; sensitive neck muscles; enjoys herbal tea after treatment.',
    vipTier: 'Diamond',
  },
  {
    id: 'PAT-102',
    name: 'Sophia Montgomery',
    phone: '+1 (555) 234-8921',
    email: 'sophia.m@example.com',
    totalVisits: 5,
    totalSpent: '$980',
    preferredPractitioner: 'Senior Practitioner Anong',
    intakeNotes: 'Allergic to lavender; loves rose petal thermal baths; anniversary guest.',
    vipTier: 'Platinum',
  },
  {
    id: 'PAT-103',
    name: 'Alexander Vance',
    phone: '+41 79 555 1209',
    email: 'avance@example.com',
    totalVisits: 4,
    totalSpent: '$620',
    preferredPractitioner: 'Master Somchai',
    intakeNotes: 'Requests deep tissue lumbar focus and traditional Finnish cedarwood sauna protocol.',
    vipTier: 'Gold',
  },
  {
    id: 'PAT-104',
    name: 'Charlotte Dubois',
    phone: '+33 6 12 34 56 78',
    email: 'c.dubois@paris-lux.fr',
    totalVisits: 6,
    totalSpent: '$1,450',
    preferredPractitioner: 'Elena Rostova (Aesthetician)',
    intakeNotes: 'Biologique Recherche organic facial peel regular; prefers afternoon appointments.',
    vipTier: 'Diamond',
  },
];

interface ProviderStaff {
  id: string;
  name: string;
  role: string;
  specialty: string;
  room: string;
  status: 'On Duty' | 'In Treatment' | 'Available';
  rating: string;
}

const INITIAL_PROVIDERS: ProviderStaff[] = [
  {
    id: 'PROV-1',
    name: 'Master Somchai',
    role: 'Lead Holistic Bodyworker',
    specialty: 'Deep Tissue & Thermal Stone Rituals',
    room: 'Thermal Bathing Hall',
    status: 'On Duty',
    rating: '5.0 (142 reviews)',
  },
  {
    id: 'PROV-2',
    name: 'Senior Practitioner Anong',
    role: 'Herbal Specialist',
    specialty: 'Aromatherapy & Thai Herbal Compresses',
    room: 'Royal Couples Sanctuary',
    status: 'In Treatment',
    rating: '4.9 (98 reviews)',
  },
  {
    id: 'PROV-3',
    name: 'Elena Rostova',
    role: 'Master Aesthetician',
    specialty: 'Lymphatic Contouring & Botanical Facials',
    room: 'Facial Atelier Suite',
    status: 'Available',
    rating: '5.0 (115 reviews)',
  },
  {
    id: 'PROV-4',
    name: 'Maya Lin',
    role: 'Sound Therapy Guide',
    specialty: 'Tibetan Singing Bowls & Meditation',
    room: 'Zen Tea Sanctuary',
    status: 'On Duty',
    rating: '4.9 (76 reviews)',
  },
];

export default function AdminPortalModal({
  isOpen,
  onClose,
  language,
}: AdminPortalModalProps) {
  const { profile, accessToken, loginWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'appointments' | 'patients' | 'providers' | 'treatments' | 'analytics' | 'settings' | 'audit' | 'hipaa'
  >('appointments');

  const [appointments, setAppointments] = useState<PersistentAppointment[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [patients] = useState<PatientRecord[]>(INITIAL_PATIENTS);
  const [providers] = useState<ProviderStaff[]>(INITIAL_PROVIDERS);

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '12m'>('30d');
  const [syncingAll, setSyncingAll] = useState(false);
  const [batchReport, setBatchReport] = useState<BatchSyncReport | null>(null);
  const [singleSyncStatus, setSingleSyncStatus] = useState<{ [id: string]: string }>({});

  // Modals for creating and editing appointments
  const [isCreating, setIsCreating] = useState(false);
  const [editingApt, setEditingApt] = useState<PersistentAppointment | null>(null);
  const [createFormError, setCreateFormError] = useState<string | null>(null);

  const [formState, setFormState] = useState({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    serviceTitle: 'Meditation Spa Day (3-hour Ritual)',
    providerName: 'Master Somchai',
    roomName: 'Thermal Bathing Hall',
    date: 'March 15, 2026',
    timeSlot: '13:30 - 16:30',
    price: '$130',
    notes: '',
  });

  useEffect(() => {
    if (!isOpen) return;
    async function load() {
      const [apts, logs] = await Promise.all([getAppointments(), getAuditLogs()]);
      setAppointments(apts);
      setAuditLogs(logs);
    }
    load();
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Real-time batch sync for all clinic appointments to Google Calendar
  const handleSyncAllToGoogle = async () => {
    if (!accessToken) {
      await loginWithGoogle();
      return;
    }
    setSyncingAll(true);
    setBatchReport(null);
    try {
      const report = await batchSyncAppointments(
        appointments,
        accessToken,
        undefined,
        profile?.email || 'admin@reya.spa'
      );
      setBatchReport(report);
      const updated = await getAppointments();
      setAppointments(updated);
    } catch (err) {
      console.error('Batch sync error:', err);
    } finally {
      setSyncingAll(false);
    }
  };

  // Sync single appointment from Admin table
  const handleSyncSingleToGoogle = async (apt: PersistentAppointment) => {
    if (!accessToken) {
      await loginWithGoogle();
      return;
    }
    setSingleSyncStatus((prev) => ({ ...prev, [apt.id]: 'syncing' }));
    try {
      const res = await syncAppointmentToGoogle(apt, accessToken, profile?.email || 'admin@reya.spa');
      setSingleSyncStatus((prev) => ({ ...prev, [apt.id]: 'synced' }));
      setAppointments((prev) =>
        prev.map((a) => (a.id === apt.id ? { ...a, googleCalendarEventId: res.eventId } : a))
      );
    } catch (err) {
      setSingleSyncStatus((prev) => ({ ...prev, [apt.id]: 'error' }));
    }
  };

  const handleStatusChange = async (id: string, status: PersistentAppointment['status']) => {
    await updateAppointmentStatus(id, status, profile?.email || 'admin@reya.spa');
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const handleDeleteApt = async (id: string) => {
    if (!confirm('Are you sure you want to permanently remove this appointment?')) return;
    await deleteAppointment(id, profile?.email || 'admin@reya.spa');
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  // Submit new appointment
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateFormError(null);
    try {
      const newId = `REYA-${Math.floor(100000 + Math.random() * 900000)}`;
      const created = await createAppointment({
        id: newId,
        guestName: formState.guestName,
        guestPhone: formState.guestPhone,
        guestEmail: formState.guestEmail || 'walkin@reya.spa',
        serviceTitle: formState.serviceTitle,
        serviceId: 'custom-admin',
        date: formState.date,
        timeSlot: formState.timeSlot,
        status: 'CONFIRMED',
        price: formState.price,
        roomName: formState.roomName,
        providerName: formState.providerName,
        notes: formState.notes,
      });

      setAppointments((prev) => [created, ...prev]);
      setIsCreating(false);
      setFormState({
        guestName: '',
        guestPhone: '',
        guestEmail: '',
        serviceTitle: 'Meditation Spa Day (3-hour Ritual)',
        providerName: 'Master Somchai',
        roomName: 'Thermal Bathing Hall',
        date: 'March 15, 2026',
        timeSlot: '13:30 - 16:30',
        price: '$130',
        notes: '',
      });
    } catch (err: any) {
      setCreateFormError(err.message || 'Could not schedule appointment.');
    }
  };

  // Submit edit appointment
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApt) return;
    try {
      await updateAppointment(
        editingApt.id,
        {
          date: editingApt.date,
          timeSlot: editingApt.timeSlot,
          roomName: editingApt.roomName,
          providerName: editingApt.providerName,
          notes: editingApt.notes,
          status: editingApt.status,
        },
        profile?.email || 'admin@reya.spa'
      );

      setAppointments((prev) =>
        prev.map((a) => (a.id === editingApt.id ? editingApt : a))
      );
      setEditingApt(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered appointments by status and search query
  const filteredAppointments = appointments.filter((apt) => {
    if (statusFilter !== 'ALL' && apt.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        apt.id.toLowerCase().includes(q) ||
        apt.guestName.toLowerCase().includes(q) ||
        apt.guestPhone.toLowerCase().includes(q) ||
        apt.serviceTitle.toLowerCase().includes(q) ||
        apt.providerName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Operational metrics
  const totalRevenue = appointments.length * 130;
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED' || a.status === 'CONFIRMED').length;
  const utilizationRate = Math.round((completedCount / (appointments.length || 1)) * 92);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[#0b1213] border border-[#d6b77c]/40 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-black flex flex-col max-h-[94vh]">
        
        {/* ========================================================
            MODAL HEADER with Key Shortcut Indicator
        ======================================================== */}
        <div className="p-4 sm:p-6 lg:p-7 border-b border-white/[0.08] flex items-center justify-between bg-[#0e1718] shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#d6b77c]/15 text-[#d6b77c] border border-[#d6b77c]/30">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#d6b77c] font-semibold">
                  CLINIC EXECUTIVE MANAGEMENT
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-black/60 text-[#f4efe6] border border-[#d6b77c]/40 flex items-center gap-1">
                  <span>Shortcut:</span>
                  <strong className="text-[#d6b77c]">Ctrl + S</strong>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                  LIVE SYSTEM
                </span>
              </div>
              <h2 className="font-serif-luxury text-xl sm:text-2xl text-[#f7f3eb] font-light mt-0.5">
                {profile?.displayName || 'Clinic Director Console'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              title="Close (or press Esc / Ctrl+S)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================
            NAVIGATION TABS
        ======================================================== */}
        <div className="flex border-b border-white/[0.06] bg-[#080d0e] overflow-x-auto scrollbar-none px-4 sm:px-6 shrink-0">
          {(
            [
              { id: 'appointments', label: 'Appointments & Engine', count: appointments.length },
              { id: 'patients', label: 'Patient Directory', count: patients.length },
              { id: 'providers', label: 'Practitioners & Staff', count: providers.length },
              { id: 'treatments', label: 'Treatment Catalog' },
              { id: 'analytics', label: 'Revenue & Metrics' },
              { id: 'settings', label: 'Clinic Configuration' },
              { id: 'audit', label: 'Audit Trail' },
              { id: 'hipaa', label: 'HIPAA Architecture' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 px-3 sm:px-4 text-[11px] sm:text-xs uppercase tracking-[0.16em] font-medium whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-[#d6b77c] text-[#d6b77c]'
                  : 'border-transparent text-[#a8a398] hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {'count' in tab && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    activeTab === tab.id
                      ? 'bg-[#d6b77c]/20 text-[#d6b77c]'
                      : 'bg-white/5 text-white/40'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ========================================================
            TAB BODY CONTENT
        ======================================================== */}
        <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: APPOINTMENTS & SCHEDULING ENGINE */}
          {activeTab === 'appointments' && (
            <div className="space-y-5">
              {/* Controls bar: Search, Filter, Batch Sync, New Appointment */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5 flex-1 max-w-xl">
                  {/* Search box */}
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search guest, phone, ref, or practitioner..."
                      className="w-full bg-[#0e1718] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#d6b77c]"
                    />
                  </div>

                  {/* Status filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#0e1718] border border-white/10 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-[#d6b77c]"
                  >
                    <option value="ALL">All Statuses ({appointments.length})</option>
                    <option value="REQUESTED">Requested</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CHECKED_IN">Checked In</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleSyncAllToGoogle}
                    disabled={syncingAll}
                    className="px-3 py-2 rounded-xl bg-[#d6b77c]/15 hover:bg-[#d6b77c]/25 border border-[#d6b77c]/40 text-[#d6b77c] text-xs font-mono flex items-center gap-1.5 transition-colors shadow-sm"
                    title="Real-time synchronize all sanctuary appointments to Google Calendar API v3"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingAll ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">
                      {syncingAll ? 'Syncing...' : 'Sync All to Google Calendar'}
                    </span>
                    <span className="sm:hidden">Google Sync</span>
                  </button>

                  <button
                    onClick={() => setIsCreating(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#b59357] to-[#d6b77c] hover:from-[#c5a367] hover:to-[#e6c78c] text-[#090f10] text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 shadow-md shadow-[#d6b77c]/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ New Appointment</span>
                  </button>
                </div>
              </div>

              {/* Batch Report Banner */}
              {batchReport && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between">
                  <span>
                    ✓ Google Calendar Batch Sync Complete: {batchReport.synced} events updated ({batchReport.failed} failed)
                  </span>
                  <span className="text-[10px] text-emerald-400/70">Timezone: America/Los_Angeles</span>
                </div>
              )}

              {/* Appointments Table */}
              <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#070d0e]">
                <table className="w-full text-left text-xs text-[#b0aba0]">
                  <thead className="bg-[#0e1718] text-[#d6b77c] font-mono uppercase tracking-wider border-b border-white/[0.06]">
                    <tr>
                      <th className="p-3.5 sm:p-4">Ref ID</th>
                      <th className="p-3.5 sm:p-4">Guest Info</th>
                      <th className="p-3.5 sm:p-4">Ritual & Suite</th>
                      <th className="p-3.5 sm:p-4">Date & Slot</th>
                      <th className="p-3.5 sm:p-4">Practitioner</th>
                      <th className="p-3.5 sm:p-4">Google Calendar</th>
                      <th className="p-3.5 sm:p-4">Status</th>
                      <th className="p-3.5 sm:p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-[#8e897e]">
                          No appointments match the criteria. Click "+ New Appointment" to schedule one.
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map((apt) => {
                        const syncStatus = singleSyncStatus[apt.id];
                        return (
                          <tr key={apt.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-3.5 sm:p-4 font-mono text-[#d6b77c] font-semibold whitespace-nowrap">
                              {apt.id}
                            </td>
                            <td className="p-3.5 sm:p-4">
                              <span className="text-white font-medium block whitespace-nowrap">{apt.guestName}</span>
                              <span className="text-[10px] text-[#8e897e] font-mono block">{apt.guestPhone}</span>
                            </td>
                            <td className="p-3.5 sm:p-4">
                              <span className="text-white font-serif-luxury font-medium block">{apt.serviceTitle}</span>
                              <span className="text-[10px] text-[#8e897e]">{apt.roomName}</span>
                            </td>
                            <td className="p-3.5 sm:p-4 font-mono whitespace-nowrap">
                              <div>{apt.date}</div>
                              <div className="text-[10px] text-[#8e897e]">{apt.timeSlot}</div>
                            </td>
                            <td className="p-3.5 sm:p-4 text-white/90 whitespace-nowrap">
                              {apt.providerName}
                            </td>
                            <td className="p-3.5 sm:p-4 whitespace-nowrap">
                              {apt.googleCalendarEventId ? (
                                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                  <span>Synced</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleSyncSingleToGoogle(apt)}
                                  disabled={syncStatus === 'syncing'}
                                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-[#d6b77c]/20 border border-white/10 text-[#d6b77c] text-[10px] font-mono flex items-center gap-1"
                                >
                                  <Calendar className="w-2.5 h-2.5" />
                                  <span>{syncStatus === 'syncing' ? 'Syncing...' : 'Sync'}</span>
                                </button>
                              )}
                            </td>
                            <td className="p-3.5 sm:p-4 whitespace-nowrap">
                              <select
                                value={apt.status}
                                onChange={(e) => handleStatusChange(apt.id, e.target.value as PersistentAppointment['status'])}
                                className={`text-[10px] font-mono px-2 py-1 rounded border focus:outline-none ${
                                  apt.status === 'CONFIRMED'
                                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                                    : apt.status === 'COMPLETED'
                                    ? 'bg-[#d6b77c]/15 border-[#d6b77c]/30 text-[#d6b77c]'
                                    : apt.status === 'CANCELLED'
                                    ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                                    : 'bg-white/5 border-white/15 text-white/80'
                                }`}
                              >
                                <option value="REQUESTED">REQUESTED</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="CHECKED_IN">CHECKED_IN</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELLED">CANCELLED</option>
                              </select>
                            </td>
                            <td className="p-3.5 sm:p-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => setEditingApt(apt)}
                                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                                  title="Edit Appointment Details"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteApt(apt.id)}
                                  className="p-1.5 rounded bg-rose-950/40 hover:bg-rose-950 border border-rose-500/20 text-rose-400 transition-colors"
                                  title="Delete Appointment"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: PATIENT DIRECTORY */}
          {activeTab === 'patients' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-luxury text-xl text-[#f7f3eb]">
                    Sanctuary Guest Directory & Clinical History
                  </h3>
                  <span className="text-xs text-[#a8a398]">
                    {patients.length} VIP sanctuary profiles registered
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patients.map((pat) => (
                  <div
                    key={pat.id}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-[#d6b77c]/30 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                      <div>
                        <span className="font-mono text-[10px] text-[#d6b77c] block">{pat.id}</span>
                        <h4 className="font-serif-luxury text-lg text-white font-medium">{pat.name}</h4>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#d6b77c]/15 text-[#d6b77c] border border-[#d6b77c]/30">
                        {pat.vipTier} Member
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-[#b0aba0]">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-[#d6b77c]" />
                        <span className="font-mono text-[11px]">{pat.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-[#d6b77c]" />
                        <span className="text-[11px] truncate">{pat.email}</span>
                      </div>
                      <div>
                        <span className="text-[#8e897e] block text-[10px]">Total Visits:</span>
                        <span className="font-mono text-white font-semibold">{pat.totalVisits} sessions</span>
                      </div>
                      <div>
                        <span className="text-[#8e897e] block text-[10px]">Total Spend:</span>
                        <span className="font-mono text-[#d6b77c] font-semibold">{pat.totalSpent}</span>
                      </div>
                    </div>

                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 text-[11px] text-[#a8a398]">
                      <strong className="text-white/80 block text-[10px] uppercase tracking-wider mb-0.5">Clinical Intake / Note:</strong>
                      {pat.intakeNotes}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PRACTITIONERS & STAFF */}
          {activeTab === 'providers' && (
            <div className="space-y-4">
              <h3 className="font-serif-luxury text-xl text-[#f7f3eb]">
                Practitioners, Lead Therapists & Chamber Allocation
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providers.map((prov) => (
                  <div
                    key={prov.id}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-[#d6b77c]/30 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                      <div>
                        <h4 className="font-serif-luxury text-lg text-white font-medium">{prov.name}</h4>
                        <span className="text-xs text-[#d6b77c]">{prov.role}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                        {prov.status}
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5 text-[#b0aba0]">
                      <div>
                        <span className="text-[#8e897e] text-[10px] uppercase tracking-wider block">Specialty:</span>
                        <span className="text-white">{prov.specialty}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#a8a398]">
                        <MapPin className="w-3 h-3 text-[#d6b77c]" />
                        <span>Chamber: <strong>{prov.room}</strong></span>
                      </div>
                      <div className="text-[10px] text-[#d6b77c] font-mono">
                        Guest Rating: {prov.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TREATMENT CATALOG */}
          {activeTab === 'treatments' && (
            <div className="space-y-4">
              <h3 className="font-serif-luxury text-xl text-[#f7f3eb]">
                Sanctuary Rituals & Service Catalog
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'Meditation Spa Day (3-hr Program)', duration: '180 min', price: '$130 / 3 500 ₽', room: 'Thermal Bathing Hall', status: 'Active' },
                  { title: 'Royal Herbal Body Massage', duration: '90 min', price: '$120 / 3 200 ₽', room: 'VIP Sanctuary Suite', status: 'Active' },
                  { title: 'Botanical Radiance Facial & Cleanse', duration: '60 min', price: '$95 / 2 600 ₽', room: 'Facial Atelier Suite', status: 'Active' },
                  { title: 'Finnish Cedarwood Sauna & Venik', duration: '75 min', price: '$85 / 2 200 ₽', room: 'Finnish Cedarwood Sauna', status: 'Active' },
                  { title: 'Signature Warm Chocolate Wrap', duration: '60 min', price: '$110 / 2 900 ₽', room: 'Himalayan Salt Grotto', status: 'Active' },
                  { title: 'Couples Sensory Bathing Ceremony', duration: '120 min', price: '$260 / 6 900 ₽', room: 'Royal Couples Sanctuary', status: 'Active' },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-serif-luxury text-base text-white">{item.title}</h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        {item.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-[#a8a398] border-t border-white/[0.04] pt-2">
                      <span>{item.duration}</span>
                      <span className="font-mono text-[#d6b77c] font-semibold">{item.price}</span>
                    </div>
                    <p className="text-[10px] text-[#8e897e]">{item.room}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: OPERATIONAL ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Date Filter */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-[#a8a398]">
                  Reporting Period
                </span>
                <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
                  {(['7d', '30d', '90d', '12m'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setDateRange(r)}
                      className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                        dateRange === r ? 'bg-[#d6b77c] text-black font-semibold' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {r.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] uppercase tracking-wider text-[#a8a398] block">
                    Total Revenue (Portfolio Demo)
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-mono text-2xl text-[#d6b77c] font-semibold">
                      ${totalRevenue}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">+14.2%</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] uppercase tracking-wider text-[#a8a398] block">
                    Sanctuary Reservations
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-mono text-2xl text-white font-semibold">
                      {appointments.length}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">100% On Time</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] uppercase tracking-wider text-[#a8a398] block">
                    Therapist Utilization
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-mono text-2xl text-white font-semibold">
                      {utilizationRate}%
                    </span>
                    <span className="text-[10px] font-mono text-[#d6b77c]">Optimal</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] uppercase tracking-wider text-[#a8a398] block">
                    Returning Guest Rate
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-mono text-2xl text-white font-semibold">
                      68.4%
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">High Loyalty</span>
                  </div>
                </div>
              </div>

              {/* Treatment Mix Breakdown */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                <h4 className="font-serif-luxury text-lg text-[#f7f3eb]">
                  Ritual Category Demand Distribution
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-[#b0aba0] mb-1">
                      <span>Meditation Spa Day (3-hour Package)</span>
                      <span className="font-mono text-[#d6b77c]">48%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-[#d6b77c] w-[48%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-[#b0aba0] mb-1">
                      <span>Body Massage & Deep Tissue</span>
                      <span className="font-mono text-[#d6b77c]">28%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[28%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-[#b0aba0] mb-1">
                      <span>Facial Cleansing & Contouring</span>
                      <span className="font-mono text-[#d6b77c]">14%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-amber-400 w-[14%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CLINIC CONFIGURATION */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="font-serif-luxury text-xl text-[#f7f3eb]">
                Sanctuary Operational Settings
              </h3>
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                  <span className="text-white font-medium block">Clinic Location & Timezone</span>
                  <p className="text-[#a8a398]">14 Zen Pavilion Ave, Beverly Hills, CA 90210</p>
                  <p className="font-mono text-[#d6b77c]">Timezone: America/Los_Angeles</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                  <span className="text-white font-medium block">Appointment Scheduling Engine</span>
                  <p className="text-[#a8a398]">
                    Buffer Time: 30 minutes between sessions · Advance Booking Window: 30 days
                  </p>
                  <p className="font-mono text-emerald-400">Double Booking Prevention: Active</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                  <span className="text-white font-medium block">Deposit & Cancellation Policy</span>
                  <p className="text-[#a8a398]">
                    Standard Deposit: $50 / 1 500 ₽ (Deposit Lock Active)
                  </p>
                  <p className="text-[#a8a398]">Cancellation window: 24 hours prior to ritual start</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-serif-luxury text-xl text-[#f7f3eb]">
                  Immutable Security Audit Trail
                </h3>
                <span className="text-xs font-mono text-[#a8a398]">
                  {auditLogs.length} events logged
                </span>
              </div>

              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl bg-white/[0.015] border border-white/5 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <span className="text-[#d6b77c] font-semibold mr-2">[{log.action}]</span>
                      <span className="text-white/80">{log.details}</span>
                      <span className="text-white/40 block text-[10px]">Target: {log.resource}</span>
                    </div>
                    <div className="text-right shrink-0 text-[10px] text-[#8e897e]">
                      <div>{log.actor} ({log.role})</div>
                      <div>{new Date(log.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: HIPAA ARCHITECTURE */}
          {activeTab === 'hipaa' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-serif-luxury text-2xl text-[#f7f3eb]">
                  HIPAA-Ready Architecture & Safeguards
                </h3>
                <p className="text-xs text-[#a8a398] mt-1">
                  Technical, administrative, and data minimization controls implemented for medical aesthetics and spa wellness.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 leading-relaxed">
                <strong>HIPAA Compliance Disclaimer:</strong> Implementation of encryption and role-based access control does not alone constitute legal HIPAA compliance. A production deployment requires executing Business Associate Agreements (BAAs) with Google Cloud, Firestore, and payment processors, formal workforce training, periodic risk assessments, and adherence to documented policies and procedures.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <h4 className="font-semibold text-[#d6b77c]">Technical Safeguards</h4>
                  <ul className="space-y-1 text-[#b0aba0]">
                    <li>• Role-Based Access Control (RBAC)</li>
                    <li>• In-memory token storage (no localStorage)</li>
                    <li>• End-to-end TLS 1.3 transit encryption</li>
                    <li>• Immutable audit trail logging</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <h4 className="font-semibold text-[#d6b77c]">Data Minimization</h4>
                  <ul className="space-y-1 text-[#b0aba0]">
                    <li>• Isolated clinical observations</li>
                    <li>• No raw payment card data stored</li>
                    <li>• Fictional demo records in DEMO_MODE</li>
                    <li>• Granular notification consent</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ========================================================
            SUB-MODAL: CREATE NEW APPOINTMENT DIRECTLY
        ======================================================== */}
        {isCreating && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-[#0e1718] border border-[#d6b77c]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-serif-luxury text-xl text-white">Create New Appointment</h3>
                <button onClick={() => setIsCreating(false)} className="text-white/50 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {createFormError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                  {createFormError}
                </div>
              )}

              <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase text-[#a8a398] block mb-1">Guest Name *</label>
                    <input
                      type="text"
                      required
                      value={formState.guestName}
                      onChange={(e) => setFormState({ ...formState, guestName: e.target.value })}
                      placeholder="e.g. Marcus Thorne"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#d6b77c]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-[#a8a398] block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formState.guestPhone}
                      onChange={(e) => setFormState({ ...formState, guestPhone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#d6b77c]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase text-[#a8a398] block mb-1">Ritual / Service</label>
                    <select
                      value={formState.serviceTitle}
                      onChange={(e) => setFormState({ ...formState, serviceTitle: e.target.value })}
                      className="w-full bg-[#0a1112] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#d6b77c]"
                    >
                      <option value="Meditation Spa Day (3-hour Ritual)">Meditation Spa Day (3-hour)</option>
                      <option value="Royal Herbal Body Massage">Royal Herbal Body Massage</option>
                      <option value="Botanical Radiance Facial & Cleanse">Botanical Radiance Facial</option>
                      <option value="Finnish Cedarwood Sauna & Venik">Finnish Cedarwood Sauna</option>
                      <option value="Signature Warm Chocolate Wrap">Signature Chocolate Wrap</option>
                      <option value="Couples Sensory Bathing Ceremony">Couples Bathing Ceremony</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-[#a8a398] block mb-1">Lead Practitioner</label>
                    <select
                      value={formState.providerName}
                      onChange={(e) => setFormState({ ...formState, providerName: e.target.value })}
                      className="w-full bg-[#0a1112] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#d6b77c]"
                    >
                      <option value="Master Somchai">Master Somchai</option>
                      <option value="Senior Practitioner Anong">Senior Practitioner Anong</option>
                      <option value="Elena Rostova (Aesthetician)">Elena Rostova</option>
                      <option value="Maya Lin">Maya Lin</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase text-[#a8a398] block mb-1">Suite / Chamber</label>
                    <select
                      value={formState.roomName}
                      onChange={(e) => setFormState({ ...formState, roomName: e.target.value })}
                      className="w-full bg-[#0a1112] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#d6b77c]"
                    >
                      <option value="Thermal Bathing Hall">Thermal Bathing Hall</option>
                      <option value="VIP Sanctuary Suite">VIP Sanctuary Suite</option>
                      <option value="Facial Atelier Suite">Facial Atelier Suite</option>
                      <option value="Finnish Cedarwood Sauna">Finnish Cedarwood Sauna</option>
                      <option value="Himalayan Salt Grotto">Himalayan Salt Grotto</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-[#a8a398] block mb-1">Fee / Investment</label>
                    <input
                      type="text"
                      value={formState.price}
                      onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#d6b77c] font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase text-[#a8a398] block mb-1">Date</label>
                    <input
                      type="text"
                      value={formState.date}
                      onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#d6b77c]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-[#a8a398] block mb-1">Time Slot</label>
                    <select
                      value={formState.timeSlot}
                      onChange={(e) => setFormState({ ...formState, timeSlot: e.target.value })}
                      className="w-full bg-[#0a1112] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#d6b77c] font-mono"
                    >
                      <option value="10:00 - 13:00">10:00 - 13:00</option>
                      <option value="13:30 - 16:30">13:30 - 16:30</option>
                      <option value="17:00 - 20:00">17:00 - 20:00</option>
                      <option value="20:30 - 23:30">20:30 - 23:30</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-[#a8a398] block mb-1">Intake Note / Preferences</label>
                  <textarea
                    rows={2}
                    value={formState.notes}
                    onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                    placeholder="Guest preference or physical condition..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#d6b77c]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 rounded-xl text-white/60 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#d6b77c] text-black font-semibold uppercase tracking-wider text-xs rounded-xl shadow-lg"
                  >
                    Save & Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            SUB-MODAL: EDIT APPOINTMENT DETAILS
        ======================================================== */}
        {editingApt && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-[#0e1718] border border-[#d6b77c]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-serif-luxury text-xl text-white">Edit Appointment {editingApt.id}</h3>
                <button onClick={() => setEditingApt(null)} className="text-white/50 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] uppercase text-[#a8a398] block mb-1">Date</label>
                  <input
                    type="text"
                    value={editingApt.date}
                    onChange={(e) => setEditingApt({ ...editingApt, date: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#d6b77c]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase text-[#a8a398] block mb-1">Time Slot</label>
                  <select
                    value={editingApt.timeSlot}
                    onChange={(e) => setEditingApt({ ...editingApt, timeSlot: e.target.value })}
                    className="w-full bg-[#0a1112] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#d6b77c] font-mono"
                  >
                    <option value="10:00 - 13:00">10:00 - 13:00</option>
                    <option value="13:30 - 16:30">13:30 - 16:30</option>
                    <option value="17:00 - 20:00">17:00 - 20:00</option>
                    <option value="20:30 - 23:30">20:30 - 23:30</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-[#a8a398] block mb-1">Practitioner</label>
                  <select
                    value={editingApt.providerName}
                    onChange={(e) => setEditingApt({ ...editingApt, providerName: e.target.value })}
                    className="w-full bg-[#0a1112] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#d6b77c]"
                  >
                    <option value="Master Somchai">Master Somchai</option>
                    <option value="Senior Practitioner Anong">Senior Practitioner Anong</option>
                    <option value="Elena Rostova (Aesthetician)">Elena Rostova</option>
                    <option value="Maya Lin">Maya Lin</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-[#a8a398] block mb-1">Special Notes</label>
                  <textarea
                    rows={2}
                    value={editingApt.notes || ''}
                    onChange={(e) => setEditingApt({ ...editingApt, notes: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#d6b77c]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingApt(null)}
                    className="px-4 py-2 rounded-xl text-white/60 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#d6b77c] text-black font-semibold uppercase tracking-wider text-xs rounded-xl shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
