import { useState } from 'react';
import { motion } from 'framer-motion';
import { AVAILABLE_DATES, TIME_SLOTS } from '../data/spaData';
import { BookingFormData, BookingConfirmation } from '../types';
import { createAppointment } from '../services/appointmentService';
import { Check, Calendar as CalendarIcon, Clock, Sparkles, AlertCircle } from 'lucide-react';

interface BookingSectionProps {
  language: 'en' | 'ru';
  onBookingSuccess: (confirmation: BookingConfirmation) => void;
}

export default function BookingSection({
  language,
  onBookingSuccess,
}: BookingSectionProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    selectedDate: '10',
    selectedTime: '13:30 - 16:30',
    agreeToTerms: true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const t = {
    en: {
      sectionTitle: 'RESERVE YOUR APPOINTMENT',
      subtitle: 'Select your preferred date, time window, and guest details',
      firstNamePlaceholder: 'First Name',
      lastNamePlaceholder: 'Last Name',
      phonePlaceholder: '+1 (555) 000-0000',
      chooseDate: 'Select Date:',
      chooseTime: 'Select Time Window:',
      agreement: 'I agree to the privacy policy & personal data processing',
      bookBtn: 'CONFIRM RESERVATION',
      errorName: 'Please enter your name',
      errorPhone: 'Please enter a valid phone number',
      errorTerms: 'Please agree to terms to proceed',
      meditationDayBadge: 'Includes Meditation Spa Day package or custom ritual',
    },
    ru: {
      sectionTitle: 'БРОНИРОВАНИЕ ДАТЫ',
      subtitle: 'Выберите удобную дату, время и укажите ваши контактные данные',
      firstNamePlaceholder: 'Имя',
      lastNamePlaceholder: 'Фамилия',
      phonePlaceholder: '+7 (___) ___-__-__',
      chooseDate: 'Выберите дату:',
      chooseTime: 'Выберите время:',
      agreement: 'Я согласен на обработку персональных данных',
      bookBtn: 'ЗАБРОНИРОВАТЬ',
      errorName: 'Пожалуйста, введите ваше имя',
      errorPhone: 'Пожалуйста, укажите контактный телефон',
      errorTerms: 'Необходимо подтвердить согласие на обработку данных',
      meditationDayBadge: 'Включает программу Meditation Spa Day или выбранный ритуал',
    },
  }[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t.errorName;
    }
    if (!formData.phone.trim() || formData.phone.length < 7) {
      newErrors.phone = t.errorPhone;
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = t.errorTerms;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const newId = `REYA-${Math.floor(100000 + Math.random() * 900000)}`;
    const guestFullName = `${formData.firstName} ${formData.lastName}`.trim();
    const serviceTitle = language === 'en' ? 'Meditation Spa Day (3-hour Ritual)' : 'Meditation Spa Day (3-часовая программа)';
    const room = language === 'en' ? 'Royal Thermal Bathing Hall' : 'Купальный зал & SPA Люкс';
    const price = language === 'en' ? '$120' : '3 500 ₽';
    const dateFormatted = `March ${formData.selectedDate}, 2026`;

    try {
      // Persist appointment to Firestore with double-booking prevention check
      await createAppointment({
        id: newId,
        guestName: guestFullName,
        guestEmail: `${formData.firstName.toLowerCase()}@guest.reya.spa`,
        guestPhone: formData.phone,
        serviceTitle: serviceTitle,
        serviceId: 'meditation-day',
        date: dateFormatted,
        timeSlot: formData.selectedTime,
        status: 'CONFIRMED',
        price: price,
        roomName: room,
        providerName: 'Master Therapist Somchai',
      });

      const confirmation: BookingConfirmation = {
        id: newId,
        guestName: guestFullName,
        phone: formData.phone,
        date: dateFormatted,
        timeSlot: formData.selectedTime,
        serviceTitle: serviceTitle,
        price: price,
        roomName: room,
      };

      onBookingSuccess(confirmation);
    } catch (err: any) {
      setErrors({ form: err.message || 'Booking failed. Please try a different slot.' });
    }
  };

  return (
    <section
      id="booking"
      className="relative py-24 md:py-36 overflow-hidden bg-gradient-to-b from-[#090f10] via-[#0b1213] to-[#0a1112]"
    >
      {/* Background ambient radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-[#d6b77c]/[0.025] rounded-full blur-[170px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-light text-[#f7f3eb] tracking-[0.2em]">
            {t.sectionTitle}
          </h2>
          <p className="mt-3 text-xs uppercase tracking-[0.25em] text-[#d6b77c]/80">
            {t.subtitle}
          </p>
          <div className="w-16 h-[1px] bg-[#d6b77c]/40 mx-auto mt-4" />
        </motion.div>

        {/* Booking Form Card (Matching Image 2 clean dark style) */}
        <motion.form
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit}
          className="p-8 sm:p-12 rounded-3xl bg-white/[0.015] border border-white/[0.06] backdrop-blur-sm shadow-2xl shadow-black/80 space-y-10"
        >
          {errors.form && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Top Row: Name Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-[#a8a398]">
                {t.firstNamePlaceholder} *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Elena / Michael"
                className="w-full bg-transparent border-b border-white/20 focus:border-[#d6b77c] py-3 text-sm text-[#f7f3eb] focus:outline-none transition-colors placeholder:text-white/20"
              />
              {errors.firstName && (
                <p className="text-xs text-rose-400 mt-1">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-[#a8a398]">
                {t.lastNamePlaceholder}
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Ivanova / Smith"
                className="w-full bg-transparent border-b border-white/20 focus:border-[#d6b77c] py-3 text-sm text-[#f7f3eb] focus:outline-none transition-colors placeholder:text-white/20"
              />
            </div>
          </div>

          {/* Middle Row: Phone Input */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-[#a8a398]">
              {language === 'en' ? 'Phone Number *' : 'Номер телефона *'}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder={t.phonePlaceholder}
              className="w-full bg-transparent border-b border-white/20 focus:border-[#d6b77c] py-3 text-sm text-[#f7f3eb] focus:outline-none transition-colors placeholder:text-white/20 font-mono"
            />
            {errors.phone && (
              <p className="text-xs text-rose-400 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Date Selector (Circular buttons matching Image 2) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#d6b77c]" />
              <label className="text-xs uppercase tracking-[0.2em] text-[#d1cbc0] font-medium">
                {t.chooseDate}
              </label>
            </div>

            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {AVAILABLE_DATES.map((dateObj) => {
                const isSelected = formData.selectedDate === dateObj.day;
                return (
                  <button
                    key={dateObj.day}
                    type="button"
                    onClick={() => setFormData({ ...formData, selectedDate: dateObj.day })}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex flex-col items-center justify-center font-mono text-sm transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#d6b77c] text-[#090f10] font-bold shadow-lg shadow-[#d6b77c]/20 scale-105'
                        : 'border border-white/15 text-[#d1cbc0] hover:border-[#d6b77c]/60 hover:text-white bg-white/[0.02]'
                    }`}
                  >
                    <span>{dateObj.day}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selector (Pill buttons matching Image 2) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#d6b77c]" />
              <label className="text-xs uppercase tracking-[0.2em] text-[#d1cbc0] font-medium">
                {t.chooseTime}
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TIME_SLOTS.slice(0, 3).map((slot) => {
                const isSelected = formData.selectedTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setFormData({ ...formData, selectedTime: slot })}
                    className={`py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-200 text-center ${
                      isSelected
                        ? 'bg-white/[0.08] text-[#d6b77c] border border-[#d6b77c] font-semibold shadow-md shadow-[#d6b77c]/10'
                        : 'border border-white/10 text-[#a8a398] hover:border-white/30 hover:text-white bg-white/[0.015]'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="mt-0.5 rounded border-white/20 text-[#d6b77c] focus:ring-[#d6b77c] bg-transparent"
              />
              <span className="text-xs text-[#a8a398] group-hover:text-[#d1cbc0] transition-colors leading-relaxed">
                {t.agreement}
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="text-xs text-rose-400 mt-1">{errors.agreeToTerms}</p>
            )}
          </div>

          {/* Bottom CTA Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-10 py-4 rounded-full border border-[#d6b77c] text-[#f7f3eb] hover:text-[#090f10] bg-transparent hover:bg-[#d6b77c] text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 shadow-xl shadow-[#d6b77c]/10 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.bookBtn}</span>
            </button>
          </div>

        </motion.form>

      </div>
    </section>
  );
}
