import { IMAGES } from '../data/spaData';
import { motion } from 'framer-motion';

interface ProductsSectionProps {
  language: 'en' | 'ru';
  onLearnMore: () => void;
  onExplore: () => void;
}

export default function ProductsSection({
  language,
  onLearnMore,
  onExplore,
}: ProductsSectionProps) {
  const content = {
    en: {
      scriptTitle: 'Products',
      serifTitle: 'Products',
      description:
        '“Formulated exclusively from wild-harvested botanicals, pure essential distillations, and cold-pressed cold-climate oils. Each elixir is hand-blended in small micro-batches to nourish your epidermis and extend the restorative benefits of your sanctuary rituals into your home.”',
      learnMoreBtn: 'Learn more',
      catalogBtn: 'Apothecary Collection',
      badge: '100% Organic Botanical Extracts',
    },
    ru: {
      scriptTitle: 'Косметика',
      serifTitle: 'Косметика',
      description:
        '“Создана на основе дикорастущих трав, чистейших эфирных дистиллятов и масел холодного отжима. Каждый продукт разработан для деликатного ухода за кожей, продлевая целительное действие салонных ритуалов у вас дома.”',
      learnMoreBtn: 'Подробнее',
      catalogBtn: 'Коллекция ухода',
      badge: '100% Органические экстракты',
    },
  }[language];

  return (
    <section
      id="products"
      className="relative py-24 md:py-36 overflow-hidden bg-gradient-to-b from-[#0d1615] via-[#0b1213] to-[#0c1514]"
    >
      {/* Background ambient radial glow */}
      <div
        className="absolute bottom-1/4 left-1/3 w-[550px] h-[550px] bg-[#d6b77c]/[0.025] rounded-full blur-[150px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          
          {/* Left Column: Organic Fluid Pebble Image Mask */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 xl:col-span-7 flex justify-center lg:justify-start order-2 lg:order-1"
          >
            <div className="relative w-full max-w-[540px] aspect-[4/3.5] sm:aspect-[4/3]">
              
              {/* Outer soft ambient backlight rim */}
              <div
                className="absolute -inset-4 bg-gradient-to-tl from-[#d6b77c]/20 via-[#1f3a34]/30 to-transparent blur-2xl rounded-[45%_55%_40%_60%/50%_45%_55%_50%] opacity-60"
                aria-hidden="true"
              />

              {/* Pebble masked container */}
              <div className="relative w-full h-full overflow-hidden pebble-product shadow-2xl shadow-black/80 border border-white/10 group">
                <img
                  src={IMAGES.productsCandles}
                  alt="Lit spa candles, warm river stones, rolled towels, and botanical essential oils"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
                
                {/* Subtle dark vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

                {/* Floating badge */}
                <div className="absolute bottom-6 right-8 bg-[#090f10]/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full hidden sm:flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d6b77c]" />
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#e8ded0]">
                    {content.badge}
                  </span>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Right Column: Layered Typography & Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.95, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 xl:col-span-5 space-y-8 order-1 lg:order-2 pl-0 lg:pl-6"
          >
            
            {/* Layered Title: Script behind Serif */}
            <div className="relative pt-6">
              <span
                className="absolute -top-8 -left-4 sm:-left-6 text-7xl sm:text-8xl md:text-9xl font-script text-white/[0.08] select-none pointer-events-none italic tracking-wider whitespace-nowrap"
                aria-hidden="true"
              >
                {content.scriptTitle}
              </span>
              <h2 className="relative font-serif-luxury text-4xl sm:text-5xl md:text-6xl font-light text-[#f7f3eb] tracking-wide leading-tight">
                {content.serifTitle}
              </h2>
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
                onClick={onExplore}
                className="px-6 py-3.5 text-xs uppercase tracking-[0.25em] text-[#d6b77c] hover:text-white transition-colors duration-200"
              >
                {content.catalogBtn} &rarr;
              </button>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
