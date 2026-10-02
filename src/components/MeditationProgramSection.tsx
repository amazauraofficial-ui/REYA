import { useState } from 'react';
import { motion } from 'framer-motion';
import { MEDITATION_SPA_DAY } from '../data/spaData';

interface MeditationProgramSectionProps {
  language: 'en' | 'ru';
  onBookProgram: () => void;
}

export default function MeditationProgramSection({
  language,
  onBookProgram,
}: MeditationProgramSectionProps) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const data = MEDITATION_SPA_DAY[language];

  const labels = {
    en: {
      programTitle: 'RITUAL PROGRAM',
      durationLabel: 'Duration',
      priceLabel: 'Investment',
      durationValue: '180 min.',
      bookBtn: 'Reserve Meditation Day',
      phasePrefix: 'Phase',
    },
    ru: {
      programTitle: 'ПРОГРАММА',
      durationLabel: 'Продолжительность',
      priceLabel: 'Стоимость',
      durationValue: '180 мин.',
      bookBtn: 'Забронировать программу',
      phasePrefix: 'Этап',
    },
  }[language];

  return (
    <section
      id="program"
      className="relative py-24 md:py-36 overflow-hidden bg-gradient-to-b from-[#0a1112] via-[#0c1415] to-[#090f10]"
    >
      {/* Subtle background radial amber glow */}
      <div
        className="absolute top-1/3 right-1/4 w-[550px] h-[550px] bg-[#d6b77c]/[0.025] rounded-full blur-[160px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        
        {/* Top Feature Hero Banner (Meditation Spa Day) */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-20 md:mb-28"
        >
          
          {/* Left: Artistic Collage with Organic Masks */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full max-w-[460px] aspect-[4/4]">
              {/* Primary organic circle */}
              <div className="absolute top-0 left-0 w-3/4 h-3/4 rounded-[40%_60%_50%_50%/50%_40%_60%_50%] overflow-hidden border border-white/10 shadow-2xl shadow-black/80">
                <img
                  src={data.phases[2].image}
                  alt="Spa botanical oils and organic elements"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Secondary overlapping organic circle */}
              <div className="absolute bottom-0 right-0 w-3/5 h-3/5 rounded-full overflow-hidden border-2 border-[#d6b77c]/40 shadow-2xl shadow-black/90">
                <img
                  src={data.phases[0].image}
                  alt="Meditation massage guest"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* Ambient accent halo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#d6b77c]/15 rounded-full blur-2xl pointer-events-none" />
            </div>
          </div>

          {/* Right: Narrative Description */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-[#d6b77c] font-medium">
              {data.tagline}
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-light text-[#f7f3eb] tracking-wider leading-tight">
              {data.title}
            </h2>
            <p className="font-script text-3xl sm:text-4xl text-[#d6b77c] italic tracking-wide">
              {data.dates}
            </p>
            <p className="font-serif-luxury text-base sm:text-lg text-[#b0aba0] font-light leading-relaxed">
              {data.description}
            </p>
            <div className="pt-2">
              <button
                onClick={onBookProgram}
                className="px-8 py-3.5 bg-gradient-to-r from-[#b59357] to-[#d6b77c] hover:from-[#c5a367] hover:to-[#e6c78c] text-[#090f10] text-xs uppercase tracking-[0.25em] font-semibold rounded-full transition-all duration-300 shadow-lg shadow-[#d6b77c]/10"
              >
                {labels.bookBtn}
              </button>
            </div>
          </div>

        </motion.div>

        {/* Section Title: PROGRAMMA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h3 className="font-cinzel text-2xl sm:text-3xl tracking-[0.3em] text-[#f7f3eb] font-light">
            {labels.programTitle}
          </h3>
          <div className="w-16 h-[1px] bg-[#d6b77c]/40 mx-auto mt-4" />
        </motion.div>

        {/* Step Circles Header Row (1, 2, 3, 4 with connected line) */}
        <div className="relative max-w-4xl mx-auto mb-16 px-4">
          {/* Delicate connector line */}
          <div
            className="hidden md:block absolute top-12 left-16 right-16 h-[1px] bg-gradient-to-r from-transparent via-[#d6b77c]/30 to-transparent"
            aria-hidden="true"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 relative z-10">
            {data.phases.map((phase) => {
              const isSelected = activeStep === phase.step;
              return (
                <button
                  key={phase.step}
                  onClick={() => setActiveStep(phase.step)}
                  className="group flex flex-col items-center text-center focus:outline-none"
                >
                  {/* Circular step photo with number badge */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3">
                    <div
                      className={`absolute -inset-1 rounded-full transition-all duration-300 ${
                        isSelected
                          ? 'border border-[#d6b77c] shadow-[0_0_15px_rgba(214,183,124,0.3)]'
                          : 'border border-white/10 group-hover:border-white/30'
                      }`}
                    />
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <img
                        src={phase.image}
                        alt={phase.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    {/* Number Badge */}
                    <span
                      className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold transition-colors ${
                        isSelected
                          ? 'bg-[#d6b77c] text-[#090f10]'
                          : 'bg-[#152220] text-[#d6b77c] border border-[#d6b77c]/40'
                      }`}
                    >
                      {phase.step}
                    </span>
                  </div>

                  {/* Step short title */}
                  <span className="font-serif-luxury text-sm sm:text-base font-light text-[#e8e2d5] group-hover:text-[#d6b77c] transition-colors leading-tight max-w-[140px]">
                    {phase.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Detailed Step Breakdown Cards (With faint background numerals) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto mb-16">
          {data.phases.map((phase) => {
            const isHighlighted = activeStep === phase.step;
            return (
              <div
                key={phase.step}
                onClick={() => setActiveStep(phase.step)}
                className={`relative p-8 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden border ${
                  isHighlighted
                    ? 'bg-white/[0.03] border-[#d6b77c]/40 shadow-xl shadow-black/40'
                    : 'bg-white/[0.015] border-white/[0.04] hover:border-white/10 hover:bg-white/[0.02]'
                }`}
              >
                {/* Large faint background numeral matching Image 2 */}
                <span
                  className="absolute -bottom-4 -right-2 text-8xl md:text-9xl font-cinzel font-bold text-white/[0.03] select-none pointer-events-none"
                  aria-hidden="true"
                >
                  {phase.step}
                </span>

                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border border-[#d6b77c]/50 text-[#d6b77c] text-xs flex items-center justify-center font-mono">
                      {phase.step}
                    </span>
                    <h4 className="font-serif-luxury text-xl sm:text-2xl font-light text-[#f7f3eb]">
                      {phase.title}
                    </h4>
                  </div>
                  <p className="font-serif-luxury text-sm sm:text-base text-[#b0aba0] font-light leading-relaxed">
                    {phase.fullDesc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Duration & Price Summary (Matching Image 2 Pill Style) */}
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4">
          
          {/* Duration Pill */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4 px-8 py-3.5 rounded-full border border-white/15 bg-white/[0.02]">
            <span className="text-xs uppercase tracking-[0.2em] text-[#b0aba0]">
              {labels.durationLabel}
            </span>
            <span className="text-xs text-white/30 hidden sm:inline">———</span>
            <span className="text-sm font-mono text-[#f7f3eb] font-medium">
              {labels.durationValue}
            </span>
          </div>

          {/* Price Pill */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4 px-8 py-3.5 rounded-full border border-[#d6b77c]/40 bg-[#d6b77c]/[0.04]">
            <span className="text-xs uppercase tracking-[0.2em] text-[#d6b77c]">
              {labels.priceLabel}
            </span>
            <span className="text-xs text-[#d6b77c]/30 hidden sm:inline">———</span>
            <span className="text-sm font-mono text-[#f7f3eb] font-semibold">
              {data.price}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
