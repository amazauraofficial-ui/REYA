import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import LotusLogo from './LotusLogo';
import {
  Volume2,
  VolumeX,
  Menu,
  X,
  Calendar,
  User,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Check,
  Globe,
  Sparkles,
  Clock,
  MoreHorizontal,
} from 'lucide-react';
import { isAmbientPlaying, toggleAmbientSound } from '../utils/audio';

interface NavbarProps {
  language: 'en' | 'ru';
  onLanguageChange: (lang: 'en' | 'ru') => void;
  onOpenBooking: () => void;
  onOpenAbonnements: () => void;
  onOpenPortal: () => void;
  onOpenAdmin?: () => void;
  showDemoBar?: boolean;
  onToggleDemoBar?: () => void;
}

export default function Navbar({
  language,
  onLanguageChange,
  onOpenBooking,
  onOpenAbonnements,
  onOpenPortal,
  onOpenAdmin,
  showDemoBar,
  onToggleDemoBar,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(isAmbientPlaying());
  const [scrolled, setScrolled] = useState(false);

  // Dropdown states
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [mobileServicesAccordionOpen, setMobileServicesAccordionOpen] = useState(false);

  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(event.target as Node)
      ) {
        setServicesDropdownOpen(false);
      }
      if (
        moreDropdownRef.current &&
        !moreDropdownRef.current.contains(event.target as Node)
      ) {
        setMoreDropdownOpen(false);
      }
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setLanguageDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle ESC key to close all dropdowns & mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setServicesDropdownOpen(false);
        setMoreDropdownOpen(false);
        setLanguageDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSoundToggle = () => {
    const newState = toggleAmbientSound();
    setSoundActive(newState);
  };

  const navLabels = {
    en: {
      about: 'About',
      services: 'Services',
      program: 'Meditation Day',
      abonnements: 'Aboniments',
      gallery: 'Atmosphere',
      contacts: 'Contacts',
      reviews: 'Reviews',
      faq: 'FAQ',
      more: 'More',
      portal: 'Guest Portal',
      portalShort: 'Portal',
      admin: 'Admin Console',
      adminShortcut: 'Ctrl+S',
      book: 'Book Ritual',
      bookShort: 'Book',
      soundOn: 'Spa Sound: On',
      soundOff: 'Spa Sound: Off',
      demoToggle: 'Toggle Demo Bar',
      viewAllServices: 'View All Rituals & Chambers →',
    },
    ru: {
      about: 'О нас',
      services: 'Услуги',
      program: 'Программа',
      abonnements: 'Абонементы',
      gallery: 'Атмосфера',
      contacts: 'Контакты',
      reviews: 'Отзывы',
      faq: 'Вопросы',
      more: 'Еще',
      portal: 'Кабинет гостя',
      portalShort: 'Кабинет',
      admin: 'Панель управления',
      adminShortcut: 'Ctrl+S',
      book: 'Забронировать',
      bookShort: 'Запись',
      soundOn: 'Звуки СПА: Вкл',
      soundOff: 'Звуки СПА: Выкл',
      demoToggle: 'Панель демо-ролей',
      viewAllServices: 'Все услуги и спа-комнаты →',
    },
  }[language];

  const servicesCatalog = {
    en: [
      {
        id: 'massage',
        title: 'Full Body & Deep Tissue Massage',
        desc: 'Warm coconut and jasmine meridian therapy',
        duration: '60 - 90 min',
        price: '$130',
        href: '#services',
      },
      {
        id: 'facials',
        title: 'Purification & Facial Contouring',
        desc: 'Enzyme exfoliation with cooling jade rollers',
        duration: '45 - 60 min',
        price: '$110',
        href: '#services',
      },
      {
        id: 'aroma',
        title: 'Botanical Wrap & Body Therapy',
        desc: 'Organic cacao cocoon with citrus scent therapy',
        duration: '50 - 75 min',
        price: '$120',
        href: '#services',
      },
      {
        id: 'sauna',
        title: 'Finnish Cedarwood Sauna Ceremony',
        desc: 'Handcrafted venik steam with Himalayan salt',
        duration: '60 - 120 min',
        price: '$95',
        href: '#services',
      },
      {
        id: 'meditation-day',
        title: 'Meditation Spa Day (3-hour Ritual)',
        desc: 'Complete sanctuary immersion & sound bathing',
        duration: '180 min',
        price: '$130',
        href: '#program',
      },
    ],
    ru: [
      {
        id: 'massage',
        title: 'Традиционный тайский массаж тела',
        desc: 'Теплые кокосовые и жасминовые масла с камнями',
        duration: '60 - 90 мин',
        price: '3 200 ₽',
        href: '#services',
      },
      {
        id: 'facials',
        title: 'Очищающий уход за кожей лица',
        desc: 'Лимфодренажный массаж и нефритовый роллер',
        duration: '45 - 60 мин',
        price: '2 600 ₽',
        href: '#services',
      },
      {
        id: 'aroma',
        title: 'Арома-обертывание и скраб',
        desc: 'Шоколадное питательное обертывание-кокон',
        duration: '50 - 75 мин',
        price: '2 900 ₽',
        href: '#services',
      },
      {
        id: 'sauna',
        title: 'Кедровая финская сауна с вениками',
        desc: 'Парение дубовыми вениками и соляная комната',
        duration: '60 - 120 мин',
        price: '2 200 ₽',
        href: '#services',
      },
      {
        id: 'meditation-day',
        title: 'Медитативный день в СПА (3 часа)',
        desc: 'Полный комплекс релаксации и чайная церемония',
        duration: '180 мин',
        price: '3 500 ₽',
        href: '#program',
      },
    ],
  }[language];

  return (
    <>
      <nav
        className={`w-full transition-all duration-300 relative ${
          scrolled
            ? 'bg-[#070e10]/95 backdrop-blur-md shadow-xl shadow-black/50 border-b border-[#d6b77c]/20'
            : 'bg-[#090f10]/85 backdrop-blur-sm border-b border-white/[0.05]'
        }`}
        aria-label="Main Navigation"
      >
        <div className="max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20 gap-3 xl:gap-6">
            
            {/* ========================================================
                ZONE 1: BRAND IDENTITY (Lotus Logo + REYA Typography)
                Anchored to the left with shrink-0 protection
            ======================================================== */}
            <a
              href="#"
              className="flex items-center gap-2 sm:gap-2.5 group py-1 shrink-0"
              aria-label="REYA Luxury Sanctuary Home"
            >
              <LotusLogo
                size={24}
                className="text-[#d6b77c] transition-transform duration-500 group-hover:scale-110 sm:w-6 sm:h-6 lg:w-7 lg:h-7 shrink-0"
              />
              <span className="font-cinzel text-lg sm:text-xl lg:text-2xl font-light tracking-[0.25em] text-[#f4efe6] group-hover:text-[#d6b77c] transition-colors duration-300 select-none">
                REYA
              </span>
            </a>

            {/* ========================================================
                ZONE 2: ADAPTIVE DESKTOP LINKS (Visible on lg: 1024px+)
                Fluid, non-wrapping layout with overflow "More" dropdown
            ======================================================== */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4.5 2xl:gap-6 justify-center flex-1 min-w-0">
              <a
                href="#about"
                className="text-[11px] uppercase tracking-[0.15em] xl:tracking-[0.18em] text-[#d1cbc0] hover:text-[#d6b77c] transition-colors duration-200 whitespace-nowrap shrink-0"
              >
                {navLabels.about}
              </a>

              {/* SERVICES DROPDOWN (Hover & Click support with chevron) */}
              <div
                ref={servicesDropdownRef}
                className="relative shrink-0"
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className={`text-[11px] uppercase tracking-[0.15em] xl:tracking-[0.18em] flex items-center gap-1 transition-colors duration-200 whitespace-nowrap ${
                    servicesDropdownOpen ? 'text-[#d6b77c]' : 'text-[#d1cbc0] hover:text-[#d6b77c]'
                  }`}
                  aria-expanded={servicesDropdownOpen}
                >
                  <span>{navLabels.services}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      servicesDropdownOpen ? 'rotate-180 text-[#d6b77c]' : 'text-white/40'
                    }`}
                  />
                </button>

                {/* Dropdown Menu Panel */}
                {servicesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-[#091113]/98 backdrop-blur-xl border border-[#d6b77c]/30 rounded-2xl p-3.5 shadow-2xl shadow-black z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-[10px] uppercase font-mono tracking-widest text-[#d6b77c]/80 px-2 py-1 border-b border-white/[0.06] mb-2 flex justify-between items-center">
                      <span>Ritual Menu</span>
                      <span>Investment</span>
                    </div>

                    <div className="space-y-1">
                      {servicesCatalog.map((service) => (
                        <a
                          key={service.id}
                          href={service.href}
                          onClick={() => setServicesDropdownOpen(false)}
                          className="p-2.5 rounded-xl hover:bg-[#d6b77c]/10 hover:border-[#d6b77c]/30 border border-transparent block transition-colors group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-serif-luxury text-white group-hover:text-[#d6b77c] transition-colors">
                              {service.title}
                            </span>
                            <span className="text-[11px] font-mono text-[#d6b77c] font-semibold shrink-0 ml-2">
                              {service.price}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-[#8e897e] mt-0.5">
                            <span className="truncate max-w-[180px]">{service.desc}</span>
                            <span className="shrink-0">{service.duration}</span>
                          </div>
                        </a>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-white/[0.06] mt-2">
                      <a
                        href="#services"
                        onClick={() => setServicesDropdownOpen(false)}
                        className="text-[10px] uppercase tracking-wider text-[#d6b77c] hover:underline flex items-center justify-center gap-1 py-1 font-mono"
                      >
                        <span>{navLabels.viewAllServices}</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <a
                href="#program"
                className="text-[11px] uppercase tracking-[0.15em] xl:tracking-[0.18em] text-[#d1cbc0] hover:text-[#d6b77c] transition-colors duration-200 whitespace-nowrap shrink-0"
              >
                {navLabels.program}
              </a>

              <button
                type="button"
                onClick={onOpenAbonnements}
                className="text-[11px] uppercase tracking-[0.15em] xl:tracking-[0.18em] text-[#d1cbc0] hover:text-[#d6b77c] transition-colors duration-200 whitespace-nowrap shrink-0"
              >
                {navLabels.abonnements}
              </button>

              {/* Atmosphere Link (Visible on xl: 1240px+) */}
              <a
                href="#atmosphere"
                className="hidden xl:inline-block text-[11px] uppercase tracking-[0.15em] xl:tracking-[0.18em] text-[#d1cbc0] hover:text-[#d6b77c] transition-colors duration-200 whitespace-nowrap shrink-0"
              >
                {navLabels.gallery}
              </a>

              {/* Reviews Link (Visible on 2xl: 1440px+) */}
              <a
                href="#testimonials"
                className="hidden 2xl:inline-block text-[11px] uppercase tracking-[0.15em] xl:tracking-[0.18em] text-[#d1cbc0] hover:text-[#d6b77c] transition-colors duration-200 whitespace-nowrap shrink-0"
              >
                {navLabels.reviews}
              </a>

              {/* Contacts Link (Visible on xl: 1240px+) */}
              <a
                href="#contacts"
                className="hidden xl:inline-block text-[11px] uppercase tracking-[0.15em] xl:tracking-[0.18em] text-[#d1cbc0] hover:text-[#d6b77c] transition-colors duration-200 whitespace-nowrap shrink-0"
              >
                {navLabels.contacts}
              </a>

              {/* SMART OVERFLOW "MORE ▾" DROPDOWN (Visible on lg to xl: 1024px - 1239px) */}
              <div
                ref={moreDropdownRef}
                className="relative xl:hidden shrink-0"
                onMouseEnter={() => setMoreDropdownOpen(true)}
                onMouseLeave={() => setMoreDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className={`text-[11px] uppercase tracking-wider flex items-center gap-1 transition-colors ${
                    moreDropdownOpen ? 'text-[#d6b77c]' : 'text-[#d1cbc0] hover:text-[#d6b77c]'
                  }`}
                  aria-expanded={moreDropdownOpen}
                >
                  <span>{navLabels.more}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      moreDropdownOpen ? 'rotate-180 text-[#d6b77c]' : 'text-white/40'
                    }`}
                  />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-[#091113]/98 backdrop-blur-xl border border-[#d6b77c]/30 rounded-xl p-1.5 shadow-2xl z-50 animate-in fade-in duration-100">
                    <a
                      href="#atmosphere"
                      onClick={() => setMoreDropdownOpen(false)}
                      className="block px-3 py-2 text-xs text-[#d1cbc0] hover:text-white hover:bg-[#d6b77c]/15 rounded-lg transition-colors"
                    >
                      {navLabels.gallery}
                    </a>
                    <a
                      href="#testimonials"
                      onClick={() => setMoreDropdownOpen(false)}
                      className="block px-3 py-2 text-xs text-[#d1cbc0] hover:text-white hover:bg-[#d6b77c]/15 rounded-lg transition-colors"
                    >
                      {navLabels.reviews}
                    </a>
                    <a
                      href="#contacts"
                      onClick={() => setMoreDropdownOpen(false)}
                      className="block px-3 py-2 text-xs text-[#d1cbc0] hover:text-white hover:bg-[#d6b77c]/15 rounded-lg transition-colors"
                    >
                      {navLabels.contacts}
                    </a>
                    <a
                      href="#faq"
                      onClick={() => setMoreDropdownOpen(false)}
                      className="block px-3 py-2 text-xs text-[#d1cbc0] hover:text-white hover:bg-[#d6b77c]/15 rounded-lg transition-colors"
                    >
                      {navLabels.faq}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* ========================================================
                ZONE 3: RIGHT UTILITIES (Desktop 1024px+)
                Sound, Language, Portals, Admin & Booking
            ======================================================== */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 2xl:gap-3 shrink-0">
              {/* Spa Sound Toggle */}
              <button
                onClick={handleSoundToggle}
                className={`p-2 rounded-full border transition-all duration-300 shrink-0 ${
                  soundActive
                    ? 'border-[#d6b77c] text-[#d6b77c] bg-[#d6b77c]/10'
                    : 'border-white/10 text-white/50 hover:text-white hover:border-white/30'
                }`}
                title={soundActive ? navLabels.soundOn : navLabels.soundOff}
                aria-label="Toggle ambient spa sound"
              >
                {soundActive ? (
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Language Selector Dropdown */}
              <div ref={languageDropdownRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  className="text-[10px] xl:text-[11px] tracking-wider font-mono px-2 py-1.5 border border-white/15 hover:border-[#d6b77c] rounded-lg text-[#d6b77c] transition-colors flex items-center gap-1"
                  aria-label="Select Language"
                >
                  <Globe className="w-3 h-3 text-[#d6b77c]" />
                  <span>{language.toUpperCase()}</span>
                  <ChevronDown className="w-3 h-3 text-white/40" />
                </button>

                {languageDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-36 bg-[#091113]/98 backdrop-blur-xl border border-[#d6b77c]/30 rounded-xl p-1.5 shadow-2xl z-50 animate-in fade-in duration-100">
                    <button
                      type="button"
                      onClick={() => {
                        onLanguageChange('en');
                        setLanguageDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between text-white hover:bg-[#d6b77c]/15"
                    >
                      <span>English (EN)</span>
                      {language === 'en' && <Check className="w-3.5 h-3.5 text-[#d6b77c]" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onLanguageChange('ru');
                        setLanguageDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between text-white hover:bg-[#d6b77c]/15"
                    >
                      <span>Русский (RU)</span>
                      {language === 'ru' && <Check className="w-3.5 h-3.5 text-[#d6b77c]" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Guest Portal Button */}
              <button
                onClick={onOpenPortal}
                className="text-[10px] xl:text-[11px] uppercase tracking-wider px-2.5 py-1.5 border border-white/15 hover:border-[#d6b77c] text-[#f7f3eb] hover:text-[#d6b77c] rounded-full transition-colors flex items-center gap-1.5 shrink-0"
                title="Open Guest Sanctuary Portal"
              >
                <User className="w-3 h-3 text-[#d6b77c]" />
                <span className="hidden xl:inline">{navLabels.portal}</span>
                <span className="xl:hidden">{navLabels.portalShort}</span>
              </button>

              {/* Admin Console Shortcut Button with Ctrl+S */}
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="text-[10px] uppercase tracking-wider px-2 xl:px-2.5 py-1.5 rounded-full bg-[#d6b77c]/10 border border-[#d6b77c]/30 hover:border-[#d6b77c] text-[#d6b77c] transition-all flex items-center gap-1 font-mono shadow-sm group shrink-0"
                  title="Open Clinic Admin Console (Shortcut: Ctrl + S)"
                >
                  <ShieldCheck className="w-3 h-3 text-[#d6b77c]" />
                  <span className="hidden 2xl:inline font-sans font-medium">Admin</span>
                  <span className="bg-black/60 px-1 py-0.2 rounded text-[9px] text-[#f4efe6] font-mono border border-white/10 group-hover:border-[#d6b77c]">
                    Ctrl+S
                  </span>
                </button>
              )}

              {/* Primary Call to Action Button */}
              <button
                onClick={onOpenBooking}
                className="text-[10px] xl:text-[11px] uppercase tracking-wider px-3.5 xl:px-4 py-2 bg-gradient-to-r from-[#b59357] to-[#d6b77c] hover:from-[#c5a367] hover:to-[#e6c78c] text-[#090f10] font-semibold rounded-full transition-all duration-200 shadow-md shadow-[#d6b77c]/15 flex items-center gap-1.5 shrink-0"
              >
                <Calendar className="w-3 h-3" />
                <span className="whitespace-nowrap">{navLabels.book}</span>
              </button>
            </div>

            {/* ========================================================
                MOBILE & TABLET COMPACT CONTROLS (< 1024px)
            ======================================================== */}
            <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
              {/* Quick Sound Toggle on Mobile */}
              <button
                onClick={handleSoundToggle}
                className={`p-1.5 rounded-full border text-xs ${
                  soundActive ? 'border-[#d6b77c] text-[#d6b77c] bg-[#d6b77c]/10' : 'border-white/15 text-white/50'
                }`}
                title={soundActive ? navLabels.soundOn : navLabels.soundOff}
                aria-label="Toggle sound"
              >
                {soundActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Quick Language Toggle on Mobile */}
              <button
                onClick={() => onLanguageChange(language === 'en' ? 'ru' : 'en')}
                className="text-[10px] font-mono px-2 py-1 border border-white/20 rounded text-[#d6b77c] hover:border-[#d6b77c]"
                aria-label="Switch language"
              >
                {language.toUpperCase()}
              </button>

              {/* Mobile Booking CTA button */}
              <button
                onClick={onOpenBooking}
                className="text-[10px] uppercase tracking-wider px-2.5 py-1.5 bg-gradient-to-r from-[#b59357] to-[#d6b77c] text-[#090f10] font-semibold rounded-full flex items-center gap-1 shadow-sm"
              >
                <Calendar className="w-2.5 h-2.5" />
                <span>{navLabels.bookShort}</span>
              </button>

              {/* Mobile Hamburger Toggle Button (Accessible touch target) */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-lg text-white/90 hover:text-white border border-white/10 hover:border-white/30 focus:outline-none ml-0.5"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5 text-[#d6b77c]" />
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ========================================================
          PORTAL-MOUNTED MOBILE & TABLET FULL NAVIGATION DRAWER
          Rendered directly to document.body via createPortal
          so it is NEVER clipped by parent backdrop-filters or transforms!
      ======================================================== */}
      {mobileMenuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] bg-[#070e10]/98 backdrop-blur-2xl flex flex-col justify-between p-5 sm:p-7 overflow-y-auto animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="space-y-5 max-w-lg mx-auto w-full">
              
              {/* Top Brand Banner inside Drawer */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2.5">
                  <LotusLogo size={24} className="text-[#d6b77c]" />
                  <span className="font-cinzel text-base uppercase tracking-[0.25em] text-[#d6b77c]">
                    REYA Sanctuary
                  </span>
                </div>
                
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-[#d6b77c]" />
                </button>
              </div>

              {/* Navigation Links with Services Accordion */}
              <nav className="space-y-1">
                <a
                  href="#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 sm:py-3 text-sm uppercase tracking-[0.2em] text-[#d1cbc0] hover:text-[#d6b77c] border-b border-white/[0.03] transition-colors"
                >
                  <span>{navLabels.about}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#d6b77c]/40" />
                </a>

                {/* Services Accordion inside Drawer */}
                <div className="border-b border-white/[0.03]">
                  <button
                    type="button"
                    onClick={() => setMobileServicesAccordionOpen(!mobileServicesAccordionOpen)}
                    className="flex items-center justify-between w-full py-2.5 sm:py-3 text-sm uppercase tracking-[0.2em] text-[#d6b77c] hover:text-[#e6c78c] transition-colors text-left"
                  >
                    <span>{navLabels.services}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 text-[#d6b77c] ${
                        mobileServicesAccordionOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {mobileServicesAccordionOpen && (
                    <div className="pl-3 pb-2 space-y-1.5">
                      {servicesCatalog.map((service) => (
                        <a
                          key={service.id}
                          href={service.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="p-2 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs text-[#d1cbc0] hover:text-white hover:border-[#d6b77c]/30"
                        >
                          <div>
                            <span className="font-serif-luxury block text-white">{service.title}</span>
                            <span className="text-[10px] text-[#8e897e]">{service.duration}</span>
                          </div>
                          <span className="text-[11px] font-mono text-[#d6b77c] font-semibold">{service.price}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <a
                  href="#program"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 sm:py-3 text-sm uppercase tracking-[0.2em] text-[#d1cbc0] hover:text-[#d6b77c] border-b border-white/[0.03] transition-colors"
                >
                  <span>{navLabels.program}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#d6b77c]/40" />
                </a>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAbonnements();
                  }}
                  className="flex items-center justify-between w-full py-2.5 sm:py-3 text-sm uppercase tracking-[0.2em] text-[#d1cbc0] hover:text-[#d6b77c] border-b border-white/[0.03] transition-colors text-left"
                >
                  <span>{navLabels.abonnements}</span>
                  <span className="text-xs text-[#d6b77c]/60">★ Passes</span>
                </button>

                <a
                  href="#atmosphere"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 sm:py-3 text-sm uppercase tracking-[0.2em] text-[#d1cbc0] hover:text-[#d6b77c] border-b border-white/[0.03] transition-colors"
                >
                  <span>{navLabels.gallery}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#d6b77c]/40" />
                </a>

                <a
                  href="#testimonials"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 sm:py-3 text-sm uppercase tracking-[0.2em] text-[#d1cbc0] hover:text-[#d6b77c] border-b border-white/[0.03] transition-colors"
                >
                  <span>{navLabels.reviews}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#d6b77c]/40" />
                </a>

                <a
                  href="#contacts"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 sm:py-3 text-sm uppercase tracking-[0.2em] text-[#d1cbc0] hover:text-[#d6b77c] border-b border-white/[0.03] transition-colors"
                >
                  <span>{navLabels.contacts}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#d6b77c]/40" />
                </a>

                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 sm:py-3 text-sm uppercase tracking-[0.2em] text-[#d1cbc0] hover:text-[#d6b77c] border-b border-white/[0.03] transition-colors"
                >
                  <span>{navLabels.faq}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#d6b77c]/40" />
                </a>
              </nav>

              {/* Portal & Management Cards */}
              <div className="space-y-2.5 pt-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPortal();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#d6b77c] text-left flex items-center justify-between text-xs tracking-wider transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#d6b77c]/10 text-[#d6b77c]">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-white font-medium block uppercase tracking-wider text-[11px]">
                        {navLabels.portal}
                      </span>
                      <span className="text-[10px] text-[#8e897e]">
                        Personal rituals, aftercare & receipts
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#d6b77c]">Open →</span>
                </button>

                {onOpenAdmin && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[#d6b77c]/10 border border-[#d6b77c]/30 hover:bg-[#d6b77c]/15 text-left flex items-center justify-between text-xs tracking-wider transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-[#d6b77c]/20 text-[#d6b77c]">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#f7f3eb] font-medium block uppercase tracking-wider text-[11px]">
                            {navLabels.admin}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-black/60 text-[#d6b77c] border border-[#d6b77c]/40">
                            {navLabels.adminShortcut}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#b0aba0]">
                          Manage appointments, calendar sync & clinic
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-[#d6b77c]">Manage →</span>
                  </button>
                )}

                {onToggleDemoBar && (
                  <button
                    onClick={() => {
                      onToggleDemoBar();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-black/40 border border-white/10 text-left flex items-center justify-between text-[11px] text-white/70 hover:text-white"
                  >
                    <span>{navLabels.demoToggle}</span>
                    <span className="text-[10px] font-mono text-[#d6b77c]">
                      {showDemoBar ? 'Visible (Tap to hide)' : 'Hidden (Tap to show)'}
                    </span>
                  </button>
                )}
              </div>

              {/* Quick Soundscape & Language Controls */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleSoundToggle}
                  className="py-2.5 px-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs flex items-center justify-center gap-2 text-white/80"
                >
                  {soundActive ? (
                    <>
                      <Volume2 className="w-4 h-4 text-[#d6b77c] animate-pulse" />
                      <span className="text-[11px] text-[#d6b77c]">Sound: On</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4 text-white/40" />
                      <span className="text-[11px]">Sound: Off</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/10">
                  <button
                    onClick={() => onLanguageChange('en')}
                    className={`py-1.5 text-center text-xs font-mono rounded-lg transition-colors ${
                      language === 'en'
                        ? 'bg-[#d6b77c] text-black font-semibold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => onLanguageChange('ru')}
                    className={`py-1.5 text-center text-xs font-mono rounded-lg transition-colors ${
                      language === 'ru'
                        ? 'bg-[#d6b77c] text-black font-semibold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    RU
                  </button>
                </div>
              </div>

              {/* Primary Action Button in Drawer */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBooking();
                  }}
                  className="w-full text-center py-3.5 bg-gradient-to-r from-[#b59357] to-[#d6b77c] text-[#090f10] text-xs uppercase tracking-[0.2em] font-semibold rounded-full shadow-lg shadow-[#d6b77c]/20 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{navLabels.book}</span>
                </button>
              </div>

            </div>

            {/* Bottom Info inside Drawer */}
            <div className="pt-5 border-t border-white/[0.06] text-center text-[10px] text-[#8e897e] max-w-lg mx-auto w-full">
              <span>Beverly Hills Sanctuary · 14 Zen Pavilion Ave · </span>
              <span className="font-mono text-[#d6b77c]">Press Ctrl+S for Admin Console</span>
            </div>

          </div>,
          document.body
        )}
    </>
  );
}
