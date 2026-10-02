import { IMAGES } from '../data/spaData';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  language: 'en' | 'ru';
  onLearnMore: () => void;
  onBook: () => void;
}

export default function HeroSection({
  language,
  onLearnMore,
  onBook,
}: HeroSectionProps) {
  const content = {
    en: {
      scriptTitle: 'About us',
      serifTitle: 'About us',
      description:
        '“An immersive sanctuary of harmony and quietude where ancient Eastern wisdom meets botanical indulgence. Relinquish tension, restore inner equilibrium, and surrender to bespoke sensory ceremonies meticulously curated for your complete renewal.”',
      learnMoreBtn: 'Learn more',
      bookBtn: 'Reserve Session',
      harmonyBadge: 'HARMONY OF BODY & SOUL',
    },
    ru: {
      scriptTitle: 'О нас',
      serifTitle: 'О нас',
      description:
        '“Тайский салон REYA — это оазис гармонии души и тела. Здесь вы сможете почувствовать глубокий покой, вернуть жизненные силы, насладиться традиционными восточными ритуалами и восстанавливающими СПА-программами.”',
      learnMoreBtn: 'Подробнее',
      bookBtn: 'Забронировать',
      harmonyBadge: 'ГАРМОНИЯ ДУШИ И ТЕЛА',
    },
  }[language];

  return (
    <section
      id="about"
      className="relative min-h-[92vh] flex items-center pt-32 sm:pt-36 md:pt-40 pb-16 md:pb-28 overflow-hidden bg-gradient-to-b from-[#0b1314] via-[#0d1717] to-[#0d1615]"
    >
      {/* Ambient background glows */}
      <div
        className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d6b77c]/[0.035] rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 right-10 w-[600px] h-[600px] bg-[#2a443e]/20 rounded-full blur-[160px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Layered Typography & Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 xl:col-span-5 space-y-8 pl-0 lg:pl-4"
          >
            
            {/* Layered Title: Script behind Serif */}
            <div className="relative pt-6">
              <span
                className="absolute -top-8 -left-4 sm:-left-8 text-7xl sm:text-8xl md:text-9xl font-script text-white/[0.08] select-none pointer-events-none italic tracking-wider whitespace-nowrap"
                aria-hidden="true"
              >
                {content.scriptTitle}
              </span>
              <h1 className="relative font-serif-luxury text-4xl sm:text-5xl md:text-6xl font-light text-[#f7f3eb] tracking-wide leading-tight">
                {content.serifTitle}
              </h1>
            </div>

            {/* Editorial Description */}
            <p className="font-serif-luxury text-base sm:text-lg text-[#b8b3a7] font-light leading-relaxed max-w-xl italic">
              {content.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onLearnMore}
                className="group relative px-8 py-3.5 border border-[#d6b77c]/40 hover:border-[#d6b77c] text-[#f0e7d5] hover:text-[#090f10] text-xs uppercase tracking-[0.25em] font-medium transition-all duration-300 bg-white/[0.02] hover:bg-[#d6b77c] overflow-hidden"
              >
                <span className="relative z-10">{content.learnMoreBtn}</span>
              </button>

              <button
                onClick={onBook}
                className="px-6 py-3.5 text-xs uppercase tracking-[0.25em] text-[#d6b77c] hover:text-white transition-colors duration-200"
              >
                {content.bookBtn} &rarr;
              </button>
            </div>

          </motion.div>

          {/* Right Column: Organic Fluid Pebble Image Mask */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.15, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 xl:col-span-7 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[540px] aspect-[4/3.5] sm:aspect-[4/3]">
              
              {/* Outer soft ambient backlight rim */}
              <div
                className="absolute -inset-4 bg-gradient-to-tr from-[#d6b77c]/20 via-[#1f3a34]/30 to-transparent blur-2xl rounded-[60%_40%_55%_45%/45%_55%_45%_55%] opacity-60"
                aria-hidden="true"
              />

              {/* Pebble masked container */}
              <div className="relative w-full h-full overflow-hidden pebble-hero shadow-2xl shadow-black/80 border border-white/10 group">
                <img
                  src={IMAGES.heroMassage}
                  alt="Tranquil luxury spa massage ritual with frangipani flower and candlelit bowls"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                
                {/* Subtle dark vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

                {/* Floating caption detail */}
                <div className="absolute bottom-6 left-8 bg-[#090f10]/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full hidden sm:flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#d6b77c] animate-pulse" />
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#e8ded0]">
                    Bespoke Asian Aromatherapy
                  </span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
