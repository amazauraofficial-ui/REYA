import { useAuth, UserRole } from '../context/AuthContext';
import { User, Stethoscope, Calendar, LogIn, LogOut, ShieldCheck, X } from 'lucide-react';

interface DemoRoleBarProps {
  onOpenPatientPortal: () => void;
  onOpenProviderPortal: () => void;
  onOpenAdminPortal: () => void;
  onOpenAuth: () => void;
  onClose?: () => void;
}

export default function DemoRoleBar({
  onOpenPatientPortal,
  onOpenProviderPortal,
  onOpenAdminPortal,
  onOpenAuth,
  onClose,
}: DemoRoleBarProps) {
  const { user, profile, role, accessToken, switchDemoRole, loginWithGoogle, logoutUser } = useAuth();

  return (
    <div className="bg-[#05090a]/95 border-b border-[#d6b77c]/25 px-2.5 sm:px-4 py-1.5 text-xs text-[#a8a398] backdrop-blur-md overflow-x-auto scrollbar-none transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 min-w-max md:min-w-0">
        
        {/* Left: Role Switcher & Persona Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#d6b77c]/15 text-[#d6b77c] font-semibold border border-[#d6b77c]/30">
            DEMO
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] sm:text-[11px] text-white/70">Persona:</span>
            <select
              value={role}
              onChange={(e) => switchDemoRole(e.target.value as UserRole)}
              className="bg-[#0b1213] border border-white/25 text-[#d6b77c] text-[11px] rounded-lg px-2 py-1 focus:outline-none focus:border-[#d6b77c] cursor-pointer"
            >
              <option value="PATIENT" className="bg-[#0b1213] text-[#d6b77c]">Guest (Elena Rostova)</option>
              <option value="PROVIDER" className="bg-[#0b1213] text-[#d6b77c]">Provider (Master Somchai)</option>
              <option value="STAFF" className="bg-[#0b1213] text-[#d6b77c]">Staff Concierge</option>
              <option value="ADMIN" className="bg-[#0b1213] text-[#d6b77c]">Medical Director (Admin)</option>
            </select>
          </div>
        </div>

        {/* Center: Portal Quick Triggers */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onOpenPatientPortal}
            className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors text-[10px] sm:text-[11px] flex items-center gap-1"
            title="Open Guest Sanctuary Portal"
          >
            <User className="w-3 h-3 text-[#d6b77c]" />
            <span>Guest Portal</span>
          </button>

          <button
            onClick={onOpenProviderPortal}
            className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors text-[10px] sm:text-[11px] flex items-center gap-1"
            title="Open Practitioner Console"
          >
            <Stethoscope className="w-3 h-3 text-[#d6b77c]" />
            <span className="hidden sm:inline">Provider Console</span>
            <span className="sm:hidden">Provider</span>
          </button>

          <button
            onClick={onOpenAdminPortal}
            className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-[#d6b77c]/15 border border-[#d6b77c]/40 hover:bg-[#d6b77c]/25 text-[#d6b77c] transition-colors text-[10px] sm:text-[11px] flex items-center gap-1.5 font-medium shadow-sm"
            title="Open Clinic Admin Console (Shortcut: Ctrl + S)"
          >
            <ShieldCheck className="w-3 h-3 text-[#d6b77c]" />
            <span>Admin Portal</span>
            <span className="px-1 py-0.2 rounded bg-black/60 text-[#f4efe6] font-mono text-[9px] border border-[#d6b77c]/40">
              Ctrl+S
            </span>
          </button>
        </div>

        {/* Right: Auth, Google Sync Status & Dismiss Button */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] text-white/90 font-mono truncate max-w-[100px] sm:max-w-[140px]" title={user.email || ''}>
                {user.email || profile?.displayName}
              </span>
              <button
                onClick={logoutUser}
                className="p-1 rounded text-white/40 hover:text-white"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-2 py-0.5 sm:px-2 sm:py-1 rounded bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 text-[10px] sm:text-[11px] font-mono flex items-center gap-1 transition-colors"
            >
              <LogIn className="w-3 h-3 text-[#d6b77c]" />
              <span>Sign In</span>
            </button>
          )}

          {accessToken ? (
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/30" title="Google Calendar Real-Time Sync Active">
              <Calendar className="w-3 h-3" />
              <span className="hidden lg:inline">Calendar Live</span>
            </span>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="px-2 py-0.5 sm:px-2 sm:py-1 rounded bg-[#d6b77c]/10 hover:bg-[#d6b77c]/20 border border-[#d6b77c]/30 text-[#d6b77c] text-[10px] font-mono flex items-center gap-1 transition-colors"
              title="Authenticate with Google to enable real-time 2-way Calendar sync"
            >
              <Calendar className="w-3 h-3" />
              <span className="hidden sm:inline">Connect Google</span>
              <span className="sm:hidden">Google</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded text-white/30 hover:text-white hover:bg-white/10 transition-colors ml-1"
              title="Hide Demo Bar (Click Demo button in menu to restore)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
