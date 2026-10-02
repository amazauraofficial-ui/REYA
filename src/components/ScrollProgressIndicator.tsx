import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ScrollProgressIndicatorProps {
  language?: 'en' | 'ru';
  showMilestones?: boolean;
}

export default function ScrollProgressIndicator({
  language = 'en',
  showMilestones = false,
}: ScrollProgressIndicatorProps) {
  const { scrollYProgress } = useScroll();
  
  // Luxury smooth spring physics for effortless responsiveness
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.0005,
  });

  // Track scroll percentage and current active section name
  const [percent, setPercent] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('');
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setIsScrolling(false);
      }, 1500);

      // Identify active section based on scroll offset
      const sections = [
        { id: 'about', en: 'Sanctuary', ru: 'О салоне' },
        { id: 'products', en: 'Apothecary', ru: 'Косметика' },
        { id: 'services', en: 'Ceremonies', ru: 'Ритуалы' },
        { id: 'program', en: 'Meditation Day', ru: 'Программа' },
        { id: 'booking', en: 'Reservation', ru: 'Запись' },
        { id: 'atmosphere', en: 'Atmosphere', ru: 'Атмосфера' },
        { id: 'testimonials', en: 'Reflections', ru: 'Отзывы' },
        { id: 'faq', en: 'Inquiries', ru: 'Вопросы' },
        { id: 'contacts', en: 'Sanctuary Concierge', ru: 'Контакты' },
      ];

      const scrollPosition = window.scrollY + 200;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i][language]);
          break;
        }
      }
    };

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setPercent(Math.round(latest * 100));
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, [scrollYProgress, language]);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Background Track: Ultra-faint hairline */}
      <div className="w-full h-[2.5px] bg-[#090f10]/60 backdrop-blur-xs relative overflow-hidden">
        
        {/* Animated Golden Progress Fill */}
        <motion.div
          style={{ scaleX, transformOrigin: '0%' }}
          className="h-full w-full bg-gradient-to-r from-[#947641] via-[#d6b77c] via-60% to-[#fff0c8] relative shadow-[0_0_12px_rgba(214,183,124,0.7)]"
        >
          {/* Leading Luminous Sparkle Tip */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#fff6d6] rounded-full blur-[2px] opacity-90 shadow-[0_0_8px_#d6b77c]" />
        </motion.div>
      </div>

      {/* Floating Section & Percentage Ribbon (Discreet, visible while scrolling) */}
      <div
        className={`absolute top-2.5 right-4 sm:right-6 transition-all duration-500 flex items-center gap-2 ${
          isScrolling && percent > 2 && percent < 98
            ? 'opacity-85 translate-y-0'
            : 'opacity-0 -translate-y-1'
        }`}
      >
        {activeSection && (
          <div className="px-2.5 py-1 rounded-full bg-[#081012]/85 backdrop-blur-md border border-[#d6b77c]/25 shadow-lg shadow-black/60 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d6b77c] animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-serif-luxury text-[#e8ded0]">
              {activeSection}
            </span>
            <span className="text-[10px] font-mono text-[#d6b77c]/80 border-l border-white/10 pl-2">
              {percent}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
