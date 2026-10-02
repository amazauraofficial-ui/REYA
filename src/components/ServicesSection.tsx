import { useState } from 'react';
import { motion } from 'framer-motion';
import { SERVICES_DATA } from '../data/spaData';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  language: 'en' | 'ru';
  onSelectService: (service: ServiceItem) => void;
  onBookService: (service: ServiceItem) => void;
}

export default function ServicesSection({
  language,
  onSelectService,
  onBookService,
}: ServicesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('massage');
  const services = SERVICES_DATA[language];

  const headers = {
    en: {
      scriptTitle: 'Services',
      serifTitle: 'Services',
      subtitle: 'Our Curated Ceremonies & Treatments',
      viewDetails: 'View Details',
      bookNow: 'Reserve Session',
      duration: 'Duration',
      price: 'Investment',
    },
    ru: {
      scriptTitle: 'Услуги',
      serifTitle: 'Услуги',
      subtitle: 'Наши авторские ритуалы и процедуры',
      viewDetails: 'Подробнее',
      bookNow: 'Записаться',
      duration: 'Длительность',
      price: 'Стоимость',
    },
  }[language];

  return (
    <section
      id="services"
      className="relative py-24 md:py-36 overflow-hidden bg-gradient-to-b from-[#0c1514] via-[#091011] to-[#0a1112]"
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#d6b77c]/[0.02] rounded-full blur-[180px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        
        {/* Section Header: Script behind Serif */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="text-center relative mb-16 md:mb-24"
        >
          <span
            className="absolute left-1/2 -translate-x-1/2 -top-10 sm:-top-14 text-7xl sm:text-8xl md:text-9xl font-script text-white/[0.07] select-none pointer-events-none italic tracking-wider whitespace-nowrap"
            aria-hidden="true"
          >
            {headers.scriptTitle}
          </span>
          <h2 className="relative font-serif-luxury text-4xl sm:text-5xl md:text-6xl font-light text-[#f7f3eb] tracking-wider">
            {headers.serifTitle}
          </h2>
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-[#d6b77c]/80">
            {headers.subtitle}
          </p>
        </motion.div>

        {/* 4 Circular Service Highlights (Matching Image 1) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 max-w-4xl mx-auto mb-20 md:mb-28"
        >
          {services.map((item) => {
            const isActive = activeCategory === item.category;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveCategory(item.category);
                  onSelectService(item);
                }}
                className="group flex flex-col items-center text-center focus:outline-none transition-transform duration-300 hover:-translate-y-1"
              >
                {/* Circular image with outer glowing halo */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 mb-4">
                  {/* Glowing ambient ring */}
                  <div
                    className={`absolute -inset-1.5 rounded-full transition-all duration-500 ${
                      isActive
                        ? 'bg-gradient-to-tr from-[#d6b77c] via-[#ecd5a5] to-[#8fa89b] opacity-80 blur-sm'
                        : 'bg-gradient-to-tr from-white/10 to-[#d6b77c]/30 opacity-40 group-hover:opacity-75 group-hover:blur-sm'
                    }`}
                  />
                  
                  {/* Circular image container */}
                  <div className="relative w-full h-full rounded-full overflow-hidden border border-white/20 bg-[#090f10]">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                </div>

                {/* Circular Item Title */}
                <span
                  className={`font-serif-luxury text-xl sm:text-2xl font-light tracking-wide transition-colors duration-300 ${
                    isActive ? 'text-[#d6b77c]' : 'text-[#f0e7d5] group-hover:text-[#d6b77c]'
                  }`}
                >
                  {item.title}
                </span>
                
                {/* Active indicator dot */}
                <span
                  className={`mt-1.5 w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-[#d6b77c] scale-125' : 'bg-transparent'
                  }`}
                />
              </button>
            );
          })}
        </motion.div>

        {/* 4 Line-Art Icon Feature Blocks (Matching Image 1 bottom) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 max-w-5xl mx-auto pt-6"
        >
          
          {/* Card 1: Massage line-art */}
          <div className="flex gap-5 sm:gap-6 items-start group p-6 rounded-2xl bg-white/[0.015] border border-white/[0.04] hover:border-[#d6b77c]/25 transition-all duration-300 hover:bg-white/[0.025]">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 text-[#d6b77c]/80 group-hover:text-[#d6b77c] transition-colors">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Massage therapist hands on relaxing spine */}
                <circle cx="20" cy="22" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M20 29C15 29 10 33 8 38C12 37 17 38 21 40C26 42 32 44 40 44C48 44 54 41 58 37C52 35 44 33 36 32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M38 18C34 22 32 26 30 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" />
                <path d="M46 16C42 20 40 24 38 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="48" cy="14" r="2.5" fill="currentColor" fillOpacity="0.5" />
                <circle cx="38" cy="14" r="2.5" fill="currentColor" fillOpacity="0.5" />
              </svg>
            </div>
            <div className="space-y-2.5">
              <h3 className="font-serif-luxury text-xl sm:text-2xl font-light text-[#f7f3eb]">
                {services[0].title}
              </h3>
              <p className="font-serif-luxury text-sm sm:text-base text-[#b0aba0] leading-relaxed font-light">
                {services[0].description}
              </p>
              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => onSelectService(services[0])}
                  className="text-xs uppercase tracking-[0.2em] text-[#d6b77c] hover:underline"
                >
                  {headers.viewDetails} &rarr;
                </button>
                <span className="text-white/20">|</span>
                <span className="text-xs font-mono text-white/50">{services[0].price}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Facials line-art */}
          <div className="flex gap-5 sm:gap-6 items-start group p-6 rounded-2xl bg-white/[0.015] border border-white/[0.04] hover:border-[#d6b77c]/25 transition-all duration-300 hover:bg-white/[0.025]">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 text-[#d6b77c]/80 group-hover:text-[#d6b77c] transition-colors">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Delicate facial profile & botanical flower */}
                <path d="M18 48C18 36 24 24 34 18C44 12 50 18 50 24C50 32 46 38 42 42C38 46 30 50 22 50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M42 28C40 32 36 34 32 35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 28C10 20 14 14 20 12C22 18 20 24 12 28Z" stroke="currentColor" strokeWidth="1.2" />
                <path d="M22 18C28 14 34 16 36 22C30 22 26 20 22 18Z" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="28" cy="28" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div className="space-y-2.5">
              <h3 className="font-serif-luxury text-xl sm:text-2xl font-light text-[#f7f3eb]">
                {services[1].title}
              </h3>
              <p className="font-serif-luxury text-sm sm:text-base text-[#b0aba0] leading-relaxed font-light">
                {services[1].description}
              </p>
              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => onSelectService(services[1])}
                  className="text-xs uppercase tracking-[0.2em] text-[#d6b77c] hover:underline"
                >
                  {headers.viewDetails} &rarr;
                </button>
                <span className="text-white/20">|</span>
                <span className="text-xs font-mono text-white/50">{services[1].price}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Aroma diffuser line-art */}
          <div className="flex gap-5 sm:gap-6 items-start group p-6 rounded-2xl bg-white/[0.015] border border-white/[0.04] hover:border-[#d6b77c]/25 transition-all duration-300 hover:bg-white/[0.025]">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 text-[#d6b77c]/80 group-hover:text-[#d6b77c] transition-colors">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Essential oil diffuser & incense reeds */}
                <path d="M26 14L32 30M32 10L32 30M38 12L32 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M22 34H42L44 48C44 51 40 54 32 54C24 54 20 51 20 48L22 34Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="16" cy="46" r="3" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="48" cy="46" r="3" stroke="currentColor" strokeWidth="1.2" />
                <path d="M16 43C16 38 20 36 24 36" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="space-y-2.5">
              <h3 className="font-serif-luxury text-xl sm:text-2xl font-light text-[#f7f3eb]">
                {services[2].title}
              </h3>
              <p className="font-serif-luxury text-sm sm:text-base text-[#b0aba0] leading-relaxed font-light">
                {services[2].description}
              </p>
              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => onSelectService(services[2])}
                  className="text-xs uppercase tracking-[0.2em] text-[#d6b77c] hover:underline"
                >
                  {headers.viewDetails} &rarr;
                </button>
                <span className="text-white/20">|</span>
                <span className="text-xs font-mono text-white/50">{services[2].price}</span>
              </div>
            </div>
          </div>

          {/* Card 4: Sauna & bath line-art */}
          <div className="flex gap-5 sm:gap-6 items-start group p-6 rounded-2xl bg-white/[0.015] border border-white/[0.04] hover:border-[#d6b77c]/25 transition-all duration-300 hover:bg-white/[0.025]">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 text-[#d6b77c]/80 group-hover:text-[#d6b77c] transition-colors">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Herbal steam tub / cedar bath barrel */}
                <path d="M26 12C24 16 28 20 26 24M34 10C32 15 36 19 34 24M42 12C40 16 44 20 42 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 28H52L48 50H16L12 28Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M14 36H50M15 44H49" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
                <path d="M18 50V54M46 50V54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="space-y-2.5">
              <h3 className="font-serif-luxury text-xl sm:text-2xl font-light text-[#f7f3eb]">
                {services[3].title}
              </h3>
              <p className="font-serif-luxury text-sm sm:text-base text-[#b0aba0] leading-relaxed font-light">
                {services[3].description}
              </p>
              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => onSelectService(services[3])}
                  className="text-xs uppercase tracking-[0.2em] text-[#d6b77c] hover:underline"
                >
                  {headers.viewDetails} &rarr;
                </button>
                <span className="text-white/20">|</span>
                <span className="text-xs font-mono text-white/50">{services[3].price}</span>
              </div>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
