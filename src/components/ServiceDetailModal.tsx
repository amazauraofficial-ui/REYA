import { ServiceItem } from '../types';
import { X, Clock, DollarSign, Check, Calendar } from 'lucide-react';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBook: (service: ServiceItem) => void;
  language: 'en' | 'ru';
}

export default function ServiceDetailModal({
  service,
  onClose,
  onBook,
  language,
}: ServiceDetailModalProps) {
  if (!service) return null;

  const t = {
    en: {
      highlights: 'Ceremony Highlights & Techniques',
      bookRitual: 'Reserve This Ritual',
      duration: 'Session Length',
      investment: 'Investment',
    },
    ru: {
      highlights: 'Особенности и этапы процедуры',
      bookRitual: 'Записаться на процедуру',
      duration: 'Длительность',
      investment: 'Стоимость',
    },
  }[language];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#0d1617] border border-[#d6b77c]/30 rounded-3xl overflow-hidden shadow-2xl shadow-black animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-black/60 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Image Banner */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1617] via-[#0d1617]/30 to-transparent" />
          <div className="absolute bottom-6 left-8 right-8">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#d6b77c] font-medium block">
              {service.category.toUpperCase()} RITUAL
            </span>
            <h3 className="font-serif-luxury text-3xl sm:text-4xl text-[#f7f3eb] font-light mt-1">
              {service.title}
            </h3>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-8 sm:p-10 space-y-6">
          <p className="font-serif-luxury text-base text-[#b0aba0] leading-relaxed">
            {service.description}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/[0.06]">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-[#d6b77c]" />
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#8e897e] block">
                  {t.duration}
                </span>
                <span className="text-sm font-mono text-[#f7f3eb]">{service.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full border border-[#d6b77c] text-[#d6b77c] flex items-center justify-center text-[10px] font-mono">
                $
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#8e897e] block">
                  {t.investment}
                </span>
                <span className="text-sm font-mono text-[#d6b77c] font-semibold">
                  {service.price}
                </span>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#d1cbc0]">
              {t.highlights}
            </h4>
            <div className="space-y-2">
              {service.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-[#a8a398]">
                  <Check className="w-3.5 h-3.5 text-[#d6b77c] shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action button */}
          <div className="pt-4">
            <button
              onClick={() => {
                onClose();
                onBook(service);
              }}
              className="w-full py-4 bg-gradient-to-r from-[#b59357] to-[#d6b77c] hover:from-[#c5a367] hover:to-[#e6c78c] text-[#090f10] text-xs uppercase tracking-[0.25em] font-semibold rounded-full transition-all duration-300 shadow-xl shadow-[#d6b77c]/10 flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.bookRitual}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
