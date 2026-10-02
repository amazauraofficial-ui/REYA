import { useState } from 'react';
import { useAuth, UserRole } from '../context/AuthContext';
import { auth } from '../lib/firebase';
import LotusLogo from './LotusLogo';
import { X, Mail, Lock, User, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'ru';
}

export default function AuthModal({
  isOpen,
  onClose,
  language,
}: AuthModalProps) {
  const {
    user,
    profile,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    resetPassword,
    authError,
    clearAuthError,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('PATIENT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  if (!isOpen) return null;

  const t = {
    en: {
      signInTitle: 'Welcome to Sanctuary',
      signUpTitle: 'Create Guest Profile',
      forgotTitle: 'Recover Credentials',
      subtitle: 'Sign in to access your appointments, clinical aftercare records, and Google Calendar sync.',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      nameLabel: 'Full Name',
      roleLabel: 'Account Type',
      signInBtn: 'Sign In to Sanctuary',
      signUpBtn: 'Create Account',
      resetBtn: 'Send Recovery Email',
      googleBtn: 'Sign in with Google (Sync Calendar)',
      noAccount: "Don't have a profile yet?",
      haveAccount: 'Already registered?',
      createOne: 'Create an account',
      signInLink: 'Sign In',
      forgotPass: 'Forgot your password?',
      resetSent: 'A recovery link has been dispatched to your email.',
    },
    ru: {
      signInTitle: 'Вход в личный кабинет',
      signUpTitle: 'Регистрация гостя',
      forgotTitle: 'Восстановление доступа',
      subtitle: 'Войдите для просмотра записей, персональных рекомендаций и синхронизации с Google Календарем.',
      emailLabel: 'Электронная почта',
      passwordLabel: 'Пароль',
      nameLabel: 'Ваше имя',
      roleLabel: 'Тип аккаунта',
      signInBtn: 'Войти в кабинет',
      signUpBtn: 'Зарегистрироваться',
      resetBtn: 'Восстановить пароль',
      googleBtn: 'Войти через Google (Календарь)',
      noAccount: 'Еще нет аккаунта?',
      haveAccount: 'Уже зарегистрированы?',
      createOne: 'Создать аккаунт',
      signInLink: 'Войти',
      forgotPass: 'Забыли пароль?',
      resetSent: 'Ссылка для восстановления отправлена на ваш email.',
    },
  }[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setInfoMessage('');
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password);
        onClose();
      } else if (mode === 'signup') {
        await registerWithEmail(email, password, name || 'Cherished Guest', role);
        onClose();
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setInfoMessage(t.resetSent);
      }
    } catch {
      // Error handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    clearAuthError();
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      if (auth.currentUser) {
        onClose();
      }
    } catch {
      // Handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#0d1617] border border-[#d6b77c]/30 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex p-3 rounded-full bg-[#d6b77c]/10 text-[#d6b77c] mb-1">
            <LotusLogo size={32} />
          </div>
          <h3 className="font-cinzel text-2xl text-[#f7f3eb] tracking-wider font-light">
            {mode === 'signin' ? t.signInTitle : mode === 'signup' ? t.signUpTitle : t.forgotTitle}
          </h3>
          <p className="font-serif-luxury text-xs text-[#a8a398] leading-relaxed max-w-xs mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Alerts */}
        {authError && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{authError}</span>
          </div>
        )}

        {infoMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Google OAuth Login Button */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-full bg-white text-neutral-800 hover:bg-neutral-100 font-medium text-xs flex items-center justify-center gap-3 transition-colors shadow-lg"
          >
            <svg viewBox="0 0 48 48" className="w-4 h-4 shrink-0">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span>{t.googleBtn}</span>
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="h-[1px] bg-white/10 flex-1" />
            <span className="text-[10px] uppercase tracking-widest text-[#8e897e]">or with email</span>
            <div className="h-[1px] bg-white/10 flex-1" />
          </div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-[#a8a398]">
                {t.nameLabel} *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Elena Rostova"
                  className="w-full bg-white/[0.02] border border-white/10 focus:border-[#d6b77c] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider text-[#a8a398]">
              {t.emailLabel} *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="guest@reya.spa"
              className="w-full bg-white/[0.02] border border-white/10 focus:border-[#d6b77c] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
            />
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] uppercase tracking-wider text-[#a8a398]">
                  {t.passwordLabel} *
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[10px] text-[#d6b77c] hover:underline"
                  >
                    {t.forgotPass}
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/[0.02] border border-white/10 focus:border-[#d6b77c] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
              />
            </div>
          )}

          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-[#a8a398]">
                {t.roleLabel}
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-[#0a1112] border border-white/15 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#d6b77c]"
              >
                <option value="PATIENT">Guest / Patient</option>
                <option value="PROVIDER">Practitioner / Therapist</option>
                <option value="STAFF">Sanctuary Staff</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-[#b59357] to-[#d6b77c] hover:from-[#c5a367] hover:to-[#e6c78c] text-[#090f10] text-xs uppercase tracking-[0.2em] font-semibold rounded-full transition-all duration-300 shadow-xl shadow-[#d6b77c]/10 flex items-center justify-center gap-2"
          >
            <span>
              {mode === 'signin' ? t.signInBtn : mode === 'signup' ? t.signUpBtn : t.resetBtn}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer Mode Switcher */}
        <div className="mt-6 text-center text-xs text-[#a8a398]">
          {mode === 'signin' ? (
            <p>
              {t.noAccount}{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-[#d6b77c] hover:underline font-medium"
              >
                {t.createOne}
              </button>
            </p>
          ) : (
            <p>
              {t.haveAccount}{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-[#d6b77c] hover:underline font-medium"
              >
                {t.signInLink}
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
