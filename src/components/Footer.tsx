import LotusLogo from './LotusLogo';
import { Phone, Mail, MapPin, Instagram, Send, MessageCircle } from 'lucide-react';

interface FooterProps {
  language: 'en' | 'ru';
  onOpenBooking: () => void;
  onOpenAbonnements: () => void;
}

export default function Footer({
  language,
  onOpenBooking,
  onOpenAbonnements,
}: FooterProps) {
  const t = {
    en: {
      about: 'About Us',
      services: 'Services',
      pricing: 'Pricing',
      program: 'Meditation Day',
      abonnements: 'Aboniments',
      gallery: 'Atmosphere',
      testimonials: 'Testimonials',
      contacts: 'Contacts',
      phone: '+375 29 345-44-55',
      intlPhone: '+1 (800) 739-7392',
      address: '14 Zen Pavilion Avenue, Luxury Spa Quarter',
      hours: 'Mon - Sun: 10:00 - 23:00',
      privacy: 'Privacy Policy',
      terms: 'Terms of Sanctuary Service',
      rights: 'All rights reserved. REYA Luxury Spa & Wellness Retreat.',
    },
    ru: {
      about: 'Главная',
      services: 'Услуги',
      pricing: 'Цены',
      program: 'Программа',
      abonnements: 'Абонементы',
      gallery: 'Галерея',
      testimonials: 'Отзывы',
      contacts: 'Контакты',
      phone: '+375 29 345-44-55',
      intlPhone: '+7 (495) 739-44-55',
      address: 'Минск, пр. Независимости 14 (или ваш город)',
      hours: 'Ежедневно: 10:00 - 23:00',
      privacy: 'Политика конфиденциальности',
      terms: 'Правила посещения спа',
      rights: 'Все права защищены. REYA / MagiSpa Салон Восточных СПА Ритуалов.',
    },
  }[language];

  return (
    <footer id="contacts" className="relative bg-[#070b0c] border-t border-white/[0.06] pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Logo Lockup */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 mb-10">
          <LotusLogo size={36} className="text-[#d6b77c]" />
          <span className="font-cinzel text-2xl tracking-[0.35em] text-[#f7f3eb]">
            REYA
          </span>
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#a8a398]">
            Luxury Spa & Holistic Wellness
          </span>
        </div>

        {/* Navigation Links (Matching Image 2 footer) */}
        <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs uppercase tracking-[0.2em] text-[#b0aba0] mb-10">
          <a href="#about" className="hover:text-[#d6b77c] transition-colors">
            {t.about}
          </a>
          <a href="#services" className="hover:text-[#d6b77c] transition-colors">
            {t.services}
          </a>
          <a href="#program" className="hover:text-[#d6b77c] transition-colors">
            {t.program}
          </a>
          <button
            onClick={onOpenAbonnements}
            className="hover:text-[#d6b77c] transition-colors uppercase"
          >
            {t.abonnements}
          </button>
          <a href="#atmosphere" className="hover:text-[#d6b77c] transition-colors">
            {t.gallery}
          </a>
          <a href="#testimonials" className="hover:text-[#d6b77c] transition-colors">
            {t.testimonials}
          </a>
          <a href="#faq" className="hover:text-[#d6b77c] transition-colors">
            {language === 'en' ? 'FAQ' : 'Вопросы'}
          </a>
          <button
            onClick={onOpenBooking}
            className="text-[#d6b77c] hover:underline uppercase"
          >
            {language === 'en' ? 'Book Appointment' : 'Запись онлайн'}
          </button>
        </nav>

        {/* Contact Info Row (Matching Image 2: Viber, Telegram +375 29 345-44-55  instagram MagiSpa) */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-[#b8b3a7] font-mono py-4 border-y border-white/[0.04] mb-8">
          <div className="flex items-center gap-2">
            <span className="text-[#d6b77c] font-sans text-xs uppercase tracking-wider">
              Viber, Telegram:
            </span>
            <a
              href="tel:+375293454455"
              className="text-[#f7f3eb] hover:text-[#d6b77c] transition-colors"
            >
              {t.phone}
            </a>
          </div>

          <span className="text-white/20 hidden sm:inline">•</span>

          <div className="flex items-center gap-2">
            <Instagram className="w-4 h-4 text-[#d6b77c]" />
            <span className="text-[#d6b77c] font-sans text-xs uppercase tracking-wider">
              Instagram:
            </span>
            <span className="text-[#f7f3eb] font-sans">
              @reya_spa
            </span>
          </div>

          <span className="text-white/20 hidden sm:inline">•</span>

          <div className="flex items-center gap-1.5 font-sans text-xs">
            <span className="text-[#8e897e]">{t.hours}</span>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#78746b] gap-4">
          <p>{t.rights}</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">
              {t.privacy}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {t.terms}
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
