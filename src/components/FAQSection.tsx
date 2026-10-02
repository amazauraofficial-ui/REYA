import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, HelpCircle, Shield, Shirt, Coffee, Clock } from 'lucide-react';

interface FAQSectionProps {
  language: 'en' | 'ru';
  onBookClick?: () => void;
}

interface FAQItem {
  id: string;
  category: 'policies' | 'attire' | 'amenities' | 'booking';
  question: string;
  answer: string;
}

export default function FAQSection({ language, onBookClick }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const t = {
    en: {
      scriptTitle: 'Questions',
      serifTitle: 'Sanctuary Inquiries & Etiquette',
      subtitle: 'Everything you need to prepare for your mindful journey at REYA',
      all: 'All Questions',
      policies: 'Policies & Safety',
      attire: 'Attire & What to Bring',
      amenities: 'Chambers & Amenities',
      booking: 'Reservations & Groups',
      stillNeedHelp: 'Still have an inquiry prior to your visit?',
      conciergeNote: 'Our sanctuary concierge is available daily from 9:00 AM to 10:00 PM.',
      contactBtn: 'Speak with Concierge',
      reserveBtn: 'Reserve a Ritual',
    },
    ru: {
      scriptTitle: 'Вопросы',
      serifTitle: 'Часто Задаваемые Вопросы',
      subtitle: 'Все, что нужно знать для комфортного и умиротворенного отдыха в REYA',
      all: 'Все вопросы',
      policies: 'Правила и здоровье',
      attire: 'Одежда и гардероб',
      amenities: 'Зоны и удобства',
      booking: 'Запись и гости',
      stillNeedHelp: 'Остались вопросы перед визитом?',
      conciergeNote: 'Служба заботы о гостях на связи ежедневно с 9:00 до 22:00.',
      contactBtn: 'Связаться с администратором',
      reserveBtn: 'Забронировать ритуал',
    },
  }[language];

  const faqsData: Record<'en' | 'ru', FAQItem[]> = {
    en: [
      {
        id: 'faq-1',
        category: 'policies',
        question: 'When should I arrive before my scheduled ceremony?',
        answer:
          'We recommend arriving 20 to 30 minutes prior to your appointment time. This allows you to mindfully transition from the outer world, savor our signature welcome herbal tea, change into an organic Egyptian cotton robe, and unwind in the thermal foot ritual suite before your master therapist greets you.',
      },
      {
        id: 'faq-2',
        category: 'attire',
        question: 'What attire is provided, and what should I bring?',
        answer:
          'You need only bring yourself. Upon arrival, you will receive a private locker containing a plush velour robe, organic bamboo slippers, and disposable treatment undergarments. For treatments involving thermal baths or the cedarwood sauna, luxury Turkish hammam towels and wraps are provided.',
      },
      {
        id: 'faq-3',
        category: 'policies',
        question: 'What is the cancellation and rescheduling policy?',
        answer:
          'To ensure serene scheduling for our dedicated therapists, we kindly request at least 24 hours notice for cancellations or rescheduling. Cancellations made with less than 24 hours notice are subject to a 50% reservation hold, while missed appointments without notice are charged in full.',
      },
      {
        id: 'faq-4',
        category: 'amenities',
        question: 'What amenities are included with my ritual booking?',
        answer:
          'All reservations grant complimentary full access to our Finnish Cedarwood Sauna, Himalayan Salt Restorative Chamber, Rain Experience Showers, and the Silent Meditation Tearoom, where artisanal floral teas, organic dry fruits, and alkaline infused water are served without limitation.',
      },
      {
        id: 'faq-5',
        category: 'attire',
        question: 'Do I need to undress completely during massage and body therapies?',
        answer:
          'Your dignity and supreme comfort are our highest priority. You may undress to your comfort level; our therapists provide disposable organic brief undergarments and employ professional draping techniques throughout the session, exposing only the specific body zone being treated.',
      },
      {
        id: 'faq-6',
        category: 'policies',
        question: 'What if I have allergies, injuries, or medical conditions?',
        answer:
          'Prior to commencing, our practitioners review a brief confidential wellness card. Please inform us during booking or check-in of any sensitivities, nut or citrus allergies, hypertension, cardiovascular conditions, or pregnancy so our master therapists can customize organic essential oils and massage pressure accordingly.',
      },
      {
        id: 'faq-7',
        category: 'amenities',
        question: 'Is REYA a silent digital sanctuary?',
        answer:
          'Yes. To maintain a serene haven away from daily digital noise, we gently ask all guests to set mobile phones to silent or leave them in their secure lockers. Photography is welcome in the private consultation lounge, but forbidden in treatment chambers and thermal bathing suites.',
      },
      {
        id: 'faq-8',
        category: 'booking',
        question: 'Can I book couple rituals or private group sanctuary days?',
        answer:
          'Absolutely. We feature dual massage chambers with synchronized master therapists, private tea ceremonies, and customizable 3-hour Meditation Day sanctuaries. Group bookings and private sanctuary buyouts for anniversaries or wellness retreats can be arranged directly with our concierge.',
      },
    ],
    ru: [
      {
        id: 'faq-1',
        category: 'policies',
        question: 'За сколько времени до начала ритуала мне стоит приехать?',
        answer:
          'Мы рекомендуем прибыть за 20–30 минут до назначенного времени. Это позволит вам не спеша переодеться, насладиться приветственным травяным сбором с медом, пройти предварительное расслабление стоп и настроиться на медитативный лад перед встречей с мастером.',
      },
      {
        id: 'faq-2',
        category: 'attire',
        question: 'Какая одежда предоставляется в СПА и что взять с собой?',
        answer:
          'Вам не нужно брать с собой ничего лишнего. Каждому гостю предоставляется персональный шкафчик с махровым халатом из египетского хлопка, одноразовыми тапочками, банными полотенцами и индивидуальным одноразовым бельем для процедур.',
      },
      {
        id: 'faq-3',
        category: 'policies',
        question: 'Каковы условия отмены или переноса записи?',
        answer:
          'Поскольку наши мастера бронируют ритуальные залы индивидуально, мы просим сообщать об отмене или переносе визита не менее чем за 24 часа. При отмене менее чем за сутки бронь может быть удержана в размере 50%, а при неявке без предупреждения сгорает полностью.',
      },
      {
        id: 'faq-4',
        category: 'amenities',
        question: 'Какие зоны и удобства входят в стоимость визита?',
        answer:
          'Каждый ритуал включает бесплатный доступ к финской кедровой сауне, гималайской соляной комнате, тропическому душу впечатлений и чайной гостиной, где гостям подаются органические восточные чаи, сухофрукты и целебная родниковая вода.',
      },
      {
        id: 'faq-5',
        category: 'attire',
        question: 'Нужно ли полностью раздеваться во время массажа и обертываний?',
        answer:
          'Ваш комфорт и личные границы — наш главный закон. Вы можете раздеться до комфортного вам уровня. Мы предоставляем одноразовое белье, а мастера используют классическую технику деликатного драпирования простынями, открывая только массируемый участок тела.',
      },
      {
        id: 'faq-6',
        category: 'policies',
        question: 'Что делать, если у меня есть аллергия, травмы или особенности здоровья?',
        answer:
          'Перед процедурой вы заполните короткую анкету гостя. Обязательно укажите наличие аллергии на ореховые масла или травы, давление, травмы спины или беременность. Специалист подберет гипоаллергенные составы и безопасную технику массажа.',
      },
      {
        id: 'faq-7',
        category: 'amenities',
        question: 'Действует ли в СПА правило тишины и цифрового детокса?',
        answer:
          'Да. Для сохранения атмосферы глубокого покоя мы просим переводить мобильные телефоны в беззвучный режим и оставлять их в шкафчике. Фотографирование разрешено только в приветственной зоне и запрещено в массажных комнатах и купальных залах.',
      },
      {
        id: 'faq-8',
        category: 'booking',
        question: 'Можно ли организовать визит для двоих или девичник?',
        answer:
          'Да, у нас есть двухместные ритуальные сьюты для пар с синхронным массажем, а также возможность бронирования индивидуальной программы «Медитативный день в СПА» для компании до 6 человек с чайной церемонией.',
      },
    ],
  };

  const faqs = faqsData[language];

  const filteredFaqs =
    activeCategory === 'all'
      ? faqs
      : faqs.filter((item) => item.category === activeCategory);

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'policies':
        return <Shield className="w-4 h-4 text-[#d6b77c]" />;
      case 'attire':
        return <Shirt className="w-4 h-4 text-[#d6b77c]" />;
      case 'amenities':
        return <Coffee className="w-4 h-4 text-[#d6b77c]" />;
      case 'booking':
        return <Clock className="w-4 h-4 text-[#d6b77c]" />;
      default:
        return <HelpCircle className="w-4 h-4 text-[#d6b77c]" />;
    }
  };

  return (
    <section
      id="faq"
      className="relative py-24 md:py-36 overflow-hidden bg-gradient-to-b from-[#070b0c] via-[#081012] to-[#070d0e]"
    >
      {/* Background ambient radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#d6b77c]/[0.02] rounded-full blur-[180px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        
        {/* Section Header: Script behind Serif */}
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
          <h2 className="relative font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-light text-[#f7f3eb] tracking-wider">
            {t.serifTitle}
          </h2>
          <p className="mt-3 text-xs uppercase tracking-[0.25em] text-[#d6b77c]/80 max-w-lg mx-auto">
            {t.subtitle}
          </p>
          <div className="w-16 h-[1px] bg-[#d6b77c]/40 mx-auto mt-4" />
        </motion.div>

        {/* Category Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
        >
          {[
            { id: 'all', label: t.all },
            { id: 'policies', label: t.policies },
            { id: 'attire', label: t.attire },
            { id: 'amenities', label: t.amenities },
            { id: 'booking', label: t.booking },
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-serif-luxury tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'bg-[#d6b77c]/15 text-[#d6b77c] border border-[#d6b77c]/40 shadow-sm'
                    : 'bg-white/[0.02] text-[#b0aba0] border border-white/[0.06] hover:border-white/20 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </motion.div>

        {/* Accordion List */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3.5"
        >
          {filteredFaqs.map((faq, index) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-white/[0.025] border-[#d6b77c]/40 shadow-xl shadow-black/40'
                    : 'bg-white/[0.01] border-white/[0.05] hover:border-white/15 hover:bg-white/[0.018]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none group"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <span className="p-2 rounded-xl bg-white/[0.02] border border-white/5 shrink-0 group-hover:border-[#d6b77c]/30 transition-colors">
                      {getCategoryIcon(faq.category)}
                    </span>
                    <span className="font-serif-luxury text-base sm:text-lg text-[#f7f3eb] group-hover:text-[#d6b77c] transition-colors font-light">
                      {faq.question}
                    </span>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'bg-[#d6b77c] text-[#090f10] border-[#d6b77c] rotate-180'
                        : 'text-white/50 group-hover:text-white group-hover:border-white/30'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-[#b0aba0] font-light font-serif-luxury leading-relaxed border-t border-white/[0.03]">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>

        {/* Bottom Concierge Contact Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-white/[0.015] via-[#d6b77c]/[0.03] to-white/[0.015] border border-[#d6b77c]/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
        >
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-[#d6b77c]" />
              <h4 className="font-serif-luxury text-base sm:text-lg text-[#f7f3eb] font-medium">
                {t.stillNeedHelp}
              </h4>
            </div>
            <p className="text-xs text-[#a8a398] font-serif-luxury">
              {t.conciergeNote}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#contacts"
              className="px-5 py-2.5 rounded-full border border-white/20 hover:border-[#d6b77c] text-white hover:text-[#d6b77c] text-xs uppercase tracking-wider transition-all"
            >
              {t.contactBtn}
            </a>

            {onBookClick && (
              <button
                type="button"
                onClick={onBookClick}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#b59357] to-[#d6b77c] hover:from-[#c5a367] hover:to-[#e6c78c] text-[#090f10] text-xs uppercase tracking-wider font-semibold transition-all shadow-md shadow-[#d6b77c]/15"
              >
                {t.reserveBtn}
              </button>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
