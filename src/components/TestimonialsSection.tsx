import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIALS_DATA } from '../data/spaData';
import { TestimonialItem } from '../types';
import { ChevronLeft, ChevronRight, Star, ShieldCheck, Quote, MessageSquareQuote } from 'lucide-react';

interface TestimonialsSectionProps {
  language: 'en' | 'ru';
  onBookExperience: () => void;
}

export default function TestimonialsSection({
  language,
  onBookExperience,
}: TestimonialsSectionProps) {
  const testimonials = TESTIMONIALS_DATA[language];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const t = {
    en: {
      scriptTitle: 'Reviews',
      serifTitle: 'Client Testimonials',
      subtitle: 'Reflections from our cherished guests following their sensory journey at REYA',
      verified: 'Verified Sanctuary Visit',
      readMore: 'Read full reflection',
      showLess: 'Show less',
      experiencePrompt: 'Ready to immerse in your own restorative journey?',
      bookBtn: 'Reserve Sanctuary Visit',
    },
    ru: {
      scriptTitle: 'Отзывы',
      serifTitle: 'Отзывы Гостей',
      subtitle: 'Впечатления наших гостей после восстанавливающих ритуалов и программ в REYA',
      verified: 'Подтвержденный визит',
      readMore: 'Читать отзыв полностью',
      showLess: 'Свернуть',
      experiencePrompt: 'Готовы погрузиться в атмосферу покоя и восстановления?',
      bookBtn: 'Забронировать визит',
    },
  }[language];

  // Auto-advance every 7 seconds unless paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused, testimonials.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section
      id="testimonials"
      className="relative py-24 md:py-36 overflow-hidden bg-gradient-to-b from-[#080d0e] via-[#090f10] to-[#070b0c]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background ambient radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#d6b77c]/[0.025] rounded-full blur-[170px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        
        {/* Section Header: Script behind Serif (matching the design system) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="text-center relative mb-16 md:mb-20"
        >
          <span
            className="absolute left-1/2 -translate-x-1/2 -top-10 sm:-top-14 text-7xl sm:text-8xl md:text-9xl font-script text-white/[0.06] select-none pointer-events-none italic tracking-wider whitespace-nowrap"
            aria-hidden="true"
          >
            {t.scriptTitle}
          </span>
          <h2 className="relative font-serif-luxury text-4xl sm:text-5xl md:text-6xl font-light text-[#f7f3eb] tracking-wider">
            {t.serifTitle}
          </h2>
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-[#d6b77c]/80 max-w-lg mx-auto">
            {t.subtitle}
          </p>
          <div className="w-16 h-[1px] bg-[#d6b77c]/40 mx-auto mt-4" />
        </motion.div>

        {/* Carousel Container */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl mx-auto"
        >
          
          {/* Main Active Testimonial Card */}
          <div className="relative rounded-3xl p-8 sm:p-12 md:p-16 bg-white/[0.015] border border-white/[0.06] backdrop-blur-sm shadow-2xl shadow-black/80 overflow-hidden">
            
            {/* Subtle decorative quote watermark in corner */}
            <div className="absolute top-6 right-8 text-[#d6b77c]/10 select-none pointer-events-none">
              <Quote size={88} strokeWidth={1} />
            </div>

            <div className="relative z-10 space-y-6">
              
              {/* Star Rating & Ritual Tag */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-[#d6b77c]">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="text-xs font-mono text-white/50 ml-2">
                    5.0 / 5.0
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#a8a398]">
                  <span className="text-[#d6b77c] font-serif-luxury text-sm">
                    {testimonials[currentIndex].ritualExperienced}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-white/40">
                    {testimonials[currentIndex].date}
                  </span>
                </div>
              </div>

              {/* Primary Quote */}
              <blockquote className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl text-[#f7f3eb] font-light leading-snug italic pt-2">
                “{testimonials[currentIndex].quote}”
              </blockquote>

              {/* Extended narrative review */}
              <div className="font-serif-luxury text-sm sm:text-base text-[#b0aba0] font-light leading-relaxed max-w-3xl pt-2">
                <p>
                  {expandedId === testimonials[currentIndex].id
                    ? testimonials[currentIndex].fullReview
                    : `${testimonials[currentIndex].fullReview.slice(0, 180)}...`}
                </p>
                <button
                  onClick={() =>
                    setExpandedId(
                      expandedId === testimonials[currentIndex].id
                        ? null
                        : testimonials[currentIndex].id
                    )
                  }
                  className="mt-2 text-xs uppercase tracking-widest text-[#d6b77c] hover:underline"
                >
                  {expandedId === testimonials[currentIndex].id ? t.showLess : t.readMore} &rarr;
                </button>
              </div>

              {/* Guest Author Profile */}
              <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-serif-luxury text-xl sm:text-2xl text-[#f7f3eb] font-light">
                    {testimonials[currentIndex].author}
                  </h4>
                  <p className="text-xs text-[#8e897e] uppercase tracking-wider">
                    {testimonials[currentIndex].titleOrLocation}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d6b77c]/10 border border-[#d6b77c]/20 text-[11px] text-[#d6b77c] uppercase tracking-widest">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.verified}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Carousel Navigation Bar (Arrows + Indicators) */}
          <div className="mt-8 flex items-center justify-between px-2">
            
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-white/15 bg-white/[0.02] hover:bg-[#d6b77c] hover:border-[#d6b77c] text-white/80 hover:text-[#090f10] flex items-center justify-center transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Pagination Dots & Counter */}
            <div className="flex items-center gap-3">
              {testimonials.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    currentIndex === idx
                      ? 'w-8 h-2 bg-[#d6b77c]'
                      : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
              <span className="font-mono text-xs text-white/40 ml-2">
                0{currentIndex + 1} / 0{testimonials.length}
              </span>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-white/15 bg-white/[0.02] hover:bg-[#d6b77c] hover:border-[#d6b77c] text-white/80 hover:text-[#090f10] flex items-center justify-center transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>

          {/* Preview cards of adjacent reviews for desktop horizontal flow */}
          <div className="hidden lg:grid grid-cols-3 gap-4 mt-8 pt-4">
            {testimonials.map((item, idx) => {
              const isCurrent = currentIndex === idx;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`p-4 rounded-2xl text-left border transition-all duration-300 ${
                    isCurrent
                      ? 'bg-white/[0.04] border-[#d6b77c]/50 shadow-md shadow-[#d6b77c]/10'
                      : 'bg-white/[0.01] border-white/[0.04] opacity-50 hover:opacity-80 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-serif-luxury text-[#f7f3eb] font-medium">
                      {item.author}
                    </span>
                    <span className="text-[10px] font-mono text-[#d6b77c]">
                      {item.date}
                    </span>
                  </div>
                  <p className="text-xs text-[#a8a398] line-clamp-2 italic font-serif-luxury">
                    “{item.quote}”
                  </p>
                </button>
              );
            })}
          </div>

          {/* Bottom Trust Action Kicker */}
          <div className="mt-14 p-6 rounded-2xl bg-[#0e1718] border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-0.5">
              <span className="text-xs uppercase tracking-[0.25em] text-[#d6b77c] font-medium block">
                REYA Sanctuary Sanctuary Promise
              </span>
              <p className="font-serif-luxury text-sm text-[#b0aba0]">
                {t.experiencePrompt}
              </p>
            </div>
            <button
              onClick={onBookExperience}
              className="px-6 py-3 rounded-full bg-transparent hover:bg-[#d6b77c] border border-[#d6b77c] text-[#f7f3eb] hover:text-[#090f10] text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 whitespace-nowrap"
            >
              {t.bookBtn} &rarr;
            </button>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
