import { useState } from 'react';
import { BookingConfirmation } from '../types';
import LotusLogo from './LotusLogo';
import { CheckCircle2, Calendar, Clock, MapPin, X, Download, Share2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createGoogleCalendarEvent, generateGoogleCalendarWebUrl } from '../services/googleCalendarService';

interface BookingConfirmationModalProps {
  confirmation: BookingConfirmation | null;
  onClose: () => void;
  language: 'en' | 'ru';
}

export default function BookingConfirmationModal({
  confirmation,
  onClose,
  language,
}: BookingConfirmationModalProps) {
  const { accessToken } = useAuth();
  const [calendarSyncing, setCalendarSyncing] = useState(false);
  const [calendarSuccess, setCalendarSuccess] = useState(false);

  if (!confirmation) return null;

  const handleAddToCalendar = async () => {
    setCalendarSyncing(true);
    const startIso = '2026-03-10T13:30:00-08:00';
    const endIso = '2026-03-10T16:30:00-08:00';

    if (accessToken) {
      try {
        await createGoogleCalendarEvent(accessToken, {
          title: `REYA Spa: ${confirmation.serviceTitle}`,
          description: `Sanctuary Reservation at REYA Luxury Spa.\nGuest: ${confirmation.guestName}\nRoom: ${confirmation.roomName}\nRef: ${confirmation.id}`,
          location: 'REYA Luxury Sanctuary, 14 Zen Pavilion Ave',
          startDateTime: startIso,
          endDateTime: endIso,
        });
        setCalendarSuccess(true);
      } catch (err) {
        console.warn('Direct Calendar API call failed, falling back to web intent:', err);
        openWebIntent();
      }
    } else {
      openWebIntent();
    }
    setCalendarSyncing(false);
  };

  const openWebIntent = () => {
    const url = generateGoogleCalendarWebUrl({
      title: `REYA Spa: ${confirmation.serviceTitle}`,
      details: `Your appointment at REYA Sanctuary.\nRef ID: ${confirmation.id}\nRoom: ${confirmation.roomName}`,
      location: 'REYA Sanctuary, 14 Zen Pavilion Ave',
      startDate: '20260310T213000Z',
      endDate: '20260311T003000Z',
    });
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
    setCalendarSuccess(true);
  };

  const t = {
    en: {
      confirmed: 'Reservation Confirmed',
      sub: 'Your sanctuary session has been reserved. A confirmation SMS has been dispatched.',
      refNumber: 'Reference ID',
      guest: 'Guest',
      ritual: 'Selected Ritual',
      date: 'Date',
      time: 'Time Window',
      location: 'Location & Suite',
      investment: 'Investment',
      locationVal: 'REYA Sanctuary, 14 Zen Pavilion Ave',
      downloadPass: 'Download Pass',
      close: 'Return to Sanctuary',
      note: 'Please arrive 15 minutes before your scheduled appointment for herbal tea and custom scent consultation.',
    },
    ru: {
      confirmed: 'Бронирование подтверждено',
      sub: 'Ваш визит забронирован. Детали записи отправлены по SMS.',
      refNumber: 'Номер брони',
      guest: 'Гость',
      ritual: 'Программа',
      date: 'Дата',
      time: 'Время',
      location: 'Локация и зал',
      investment: 'Стоимость',
      locationVal: 'Спа-салон REYA, пр. Независимости 14',
      downloadPass: 'Сохранить талон',
      close: 'Вернуться на сайт',
      note: 'Рекомендуем приехать за 15 минут до начала сеанса для дегустации чая и выбора ароматических масел.',
    },
  }[language];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#0d1617] border border-[#d6b77c]/30 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-full bg-[#d6b77c]/10 text-[#d6b77c] mb-1">
            <LotusLogo size={36} />
          </div>
          <h3 className="font-cinzel text-2xl text-[#f7f3eb] tracking-wider font-light">
            {t.confirmed}
          </h3>
          <p className="font-serif-luxury text-sm text-[#b0aba0] leading-relaxed">
            {t.sub}
          </p>
        </div>

        {/* Ticket Body */}
        <div className="mt-8 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
            <span className="text-xs uppercase tracking-widest text-[#a8a398]">
              {t.refNumber}
            </span>
            <span className="font-mono text-sm font-semibold text-[#d6b77c]">
              {confirmation.id}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="uppercase tracking-widest text-[#8e897e] block">
                {t.guest}
              </span>
              <span className="text-[#f7f3eb] font-medium mt-1 block">
                {confirmation.guestName}
              </span>
            </div>

            <div>
              <span className="uppercase tracking-widest text-[#8e897e] block">
                {t.investment}
              </span>
              <span className="text-[#d6b77c] font-mono font-medium mt-1 block">
                {confirmation.price}
              </span>
            </div>

            <div>
              <span className="uppercase tracking-widest text-[#8e897e] block">
                {t.date}
              </span>
              <span className="text-[#f7f3eb] mt-1 block flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#d6b77c]" />
                {confirmation.date}
              </span>
            </div>

            <div>
              <span className="uppercase tracking-widest text-[#8e897e] block">
                {t.time}
              </span>
              <span className="text-[#f7f3eb] mt-1 block flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-[#d6b77c]" />
                {confirmation.timeSlot}
              </span>
            </div>
          </div>

          <div className="border-t border-white/[0.06] pt-3">
            <span className="text-xs uppercase tracking-widest text-[#8e897e] block">
              {t.ritual}
            </span>
            <span className="text-sm font-serif-luxury text-[#f7f3eb] mt-1 block">
              {confirmation.serviceTitle}
            </span>
          </div>

          <div className="border-t border-white/[0.06] pt-3">
            <span className="text-xs uppercase tracking-widest text-[#8e897e] block">
              {t.location}
            </span>
            <span className="text-xs text-[#b0aba0] mt-1 block flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#d6b77c]" />
              {confirmation.roomName} — {t.locationVal}
            </span>
          </div>
        </div>

        {/* Note */}
        <p className="mt-4 text-[11px] text-[#8e897e] text-center italic">
          {t.note}
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAddToCalendar}
            disabled={calendarSyncing}
            className="flex-1 py-3 bg-[#d6b77c]/15 hover:bg-[#d6b77c]/25 border border-[#d6b77c] text-[#d6b77c] text-xs uppercase tracking-[0.2em] rounded-full transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {calendarSuccess
                ? 'Added to Calendar ✓'
                : calendarSyncing
                ? 'Syncing...'
                : 'Add to Google Calendar'}
            </span>
          </button>
          <button
            onClick={() => {
              window.print();
            }}
            className="flex-1 py-3 border border-white/20 hover:border-white text-xs uppercase tracking-[0.2em] rounded-full text-white/80 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.downloadPass}</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-[#d6b77c] hover:bg-[#c5a367] text-[#090f10] text-xs uppercase tracking-[0.2em] font-semibold rounded-full transition-colors"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
}
