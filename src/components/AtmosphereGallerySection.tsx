import { useState } from 'react';
import { motion } from 'framer-motion';
import { GALLERY_ROOMS } from '../data/spaData';
import { ChevronLeft, ChevronRight, Maximize2, X, Sparkles } from 'lucide-react';

interface AtmosphereGallerySectionProps {
  language: 'en' | 'ru';
  onBookRoom: (roomName: string) => void;
}

export default function AtmosphereGallerySection({
  language,
  onBookRoom,
}: AtmosphereGallerySectionProps) {
  const rooms = GALLERY_ROOMS[language];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeRoom = rooms[currentIndex];

  const t = {
    en: {
      title: 'ENCHANTING ATMOSPHERE',
      subtitle:
        'You no longer need to journey across continents to find sanctuary. The handcrafted interiors, ambient candlelight, and exotic scents of REYA invite you into authentic Eastern serenity.',
      reserveSuite: 'Reserve this Suite',
      fullscreen: 'View Fullscreen',
    },
    ru: {
      title: 'ЧАРУЮЩАЯ АТМОСФЕРА',
      subtitle:
        'Теперь для того, чтоб оказаться в Азии совсем не обязательно покупать путёвки и лететь на край света. Стилизованные интерьеры REYA заставят погрузиться в целую культуру Востока.',
      reserveSuite: 'Забронировать этот зал',
      fullscreen: 'На весь экран',
    },
  }[language];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? rooms.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === rooms.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      id="atmosphere"
      className="relative py-24 md:py-36 overflow-hidden bg-gradient-to-b from-[#0a1112] via-[#090f10] to-[#080d0e]"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-16"
        >
          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-light text-[#f7f3eb] tracking-[0.2em] leading-tight">
            {t.title}
          </h2>
          <p className="mt-4 font-serif-luxury text-base sm:text-lg text-[#b0aba0] font-light leading-relaxed">
            {t.subtitle}
          </p>
          <div className="w-16 h-[1px] bg-[#d6b77c]/40 mt-6" />
        </motion.div>

        {/* Gallery Interactive Showcase (Matching Image 2 Layout) */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          
          {/* Main Featured Photo (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative w-full aspect-[16/11] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/80 group">
              <img
                src={activeRoom.image}
                alt={activeRoom.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-all duration-700 ease-out"
              />

              {/* Bottom vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Index & Title in bottom left (Matching "1/7 КУПАЛЬНЫЙ ЗАЛ") */}
              <div className="absolute bottom-6 left-8 right-24 space-y-1">
                <span className="font-mono text-xl sm:text-2xl text-[#d6b77c] font-light tracking-widest block">
                  {currentIndex + 1}/{rooms.length}
                </span>
                <h3 className="font-cinzel text-base sm:text-lg tracking-[0.25em] text-[#f7f3eb] uppercase font-light">
                  {activeRoom.name}
                </h3>
              </div>

              {/* Arrow navigation buttons in right corner */}
              <div className="absolute bottom-6 right-6 flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full border border-white/20 bg-black/40 hover:bg-[#d6b77c] text-white hover:text-[#090f10] backdrop-blur-sm flex items-center justify-center transition-all duration-200"
                  aria-label="Previous room"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full border border-white/20 bg-black/40 hover:bg-[#d6b77c] text-white hover:text-[#090f10] backdrop-blur-sm flex items-center justify-center transition-all duration-200"
                  aria-label="Next room"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Fullscreen button */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute top-6 right-6 p-2.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-white/80 hover:text-white transition-colors"
                title={t.fullscreen}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Room description & features */}
            <div className="p-6 rounded-2xl bg-white/[0.015] border border-white/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-serif-luxury text-sm text-[#b0aba0] leading-relaxed">
                  {activeRoom.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {activeRoom.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] text-[#d6b77c] tracking-wide"
                    >
                      • {feature}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => onBookRoom(activeRoom.name)}
                className="shrink-0 px-5 py-2.5 rounded-full border border-[#d6b77c]/40 text-[#d6b77c] hover:bg-[#d6b77c] hover:text-[#090f10] text-xs uppercase tracking-[0.2em] transition-all"
              >
                {t.reserveSuite}
              </button>
            </div>
          </div>

          {/* 6 Room Thumbnails Grid (lg:col-span-5) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {rooms.slice(1).map((room, idx) => {
              const actualIndex = idx + 1;
              const isSelected = currentIndex === actualIndex;
              return (
                <button
                  key={room.id}
                  onClick={() => setCurrentIndex(actualIndex)}
                  className={`group relative aspect-[4/3] rounded-2xl overflow-hidden border transition-all duration-300 text-left ${
                    isSelected
                      ? 'border-[#d6b77c] shadow-lg shadow-[#d6b77c]/20 scale-[1.02]'
                      : 'border-white/10 opacity-75 hover:opacity-100 hover:border-white/30'
                  }`}
                >
                  <img
                    src={room.image}
                    alt={room.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] font-mono text-[#d6b77c] block">
                      {actualIndex + 1}/{rooms.length}
                    </span>
                    <span className="text-xs font-serif-luxury text-white line-clamp-1">
                      {room.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </motion.div>

      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl w-full aspect-[16/10] max-h-[80vh] rounded-2xl overflow-hidden border border-white/10">
            <img
              src={activeRoom.image}
              alt={activeRoom.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain bg-black"
            />
          </div>

          <div className="mt-6 text-center space-y-2">
            <h4 className="font-cinzel text-xl text-[#f7f3eb] tracking-widest">
              {activeRoom.name} ({currentIndex + 1}/{rooms.length})
            </h4>
            <p className="font-serif-luxury text-sm text-[#b0aba0] max-w-xl mx-auto">
              {activeRoom.description}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
