import { X, Sparkles, Check, Gift } from 'lucide-react';
import LotusLogo from './LotusLogo';

interface AbonnementModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'ru';
  onSelectAbonnement: (title: string, price: string) => void;
}

export default function AbonnementModal({
  isOpen,
  onClose,
  language,
  onSelectAbonnement,
}: AbonnementModalProps) {
  if (!isOpen) return null;

  const t = {
    en: {
      title: 'SANCTUARY ABONNEMENTS & GIFT CERTIFICATES',
      subtitle:
        'Indulge in seasonal prepaid club rituals or gift an unforgettable journey of rejuvenation to someone special.',
      selectBtn: 'Acquire Pass',
      plans: [
        {
          id: 'harmony-3',
          name: 'Harmony Trio Pass',
          visits: '3 Sessions',
          price: '$340',
          perks: ['Choice of any 90-min massage', 'Complimentary herbal tea lounge access', 'Priority date booking windows', 'Valid for 6 months'],
        },
        {
          id: 'serenity-5',
          name: 'Serenity Journey Pass',
          visits: '5 Sessions',
          price: '$520',
          popular: true,
          perks: ['Includes Meditation Spa Day package', 'Thermal bathing grotto admission for 2', 'Apothecary welcome oil elixir set', 'Valid for 12 months'],
        },
        {
          id: 'sovereign-vip',
          name: 'Sovereign VIP Club',
          visits: '10 Sessions',
          price: '$980',
          perks: ['Unlimited cedar sauna and salt cave access', 'Dedicated private therapist reservation', 'Personalized custom oil formulations', 'VIP private lounge access'],
        },
      ],
    },
    ru: {
      title: 'АБОНЕМЕНТЫ И ПОДАРОЧНЫЕ СЕРТИФИКАТЫ',
      subtitle:
        'Оформите абонемент на курс восстанавливающих процедур или подарите сертификат в стильной подарочной упаковке.',
      selectBtn: 'Оформить абонемент',
      plans: [
        {
          id: 'harmony-3',
          name: 'Абонемент «Гармония»',
          visits: '3 сеанса',
          price: '9 500 ₽',
          perks: ['Любой 90-минутный массаж на выбор', 'Посещение чайной комнаты с мастером', 'Приоритетное бронирование времени', 'Срок действия 6 месяцев'],
        },
        {
          id: 'serenity-5',
          name: 'Абонемент «Безмятежность»',
          visits: '5 сеансов',
          price: '15 000 ₽',
          popular: true,
          perks: ['Включает программу Meditation Spa Day', 'Посещение купального зала для двоих', 'Подарочный набор эфирных масел', 'Срок действия 12 месяцев'],
        },
        {
          id: 'sovereign-vip',
          name: 'Клубная карта «VIP Премиум»',
          visits: '10 сеансов',
          price: '28 000 ₽',
          perks: ['Безлимитный доступ в кедровую сауну', 'Индивидуальный топ-мастер ритуалов', 'Персональный купаж ароматических масел', 'Отдельный VIP-павильон отдыха'],
        },
      ],
    },
  }[language];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-[#0d1617] border border-[#d6b77c]/30 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex p-3 rounded-full bg-[#d6b77c]/10 text-[#d6b77c] mb-1">
            <LotusLogo size={36} />
          </div>
          <h3 className="font-cinzel text-2xl sm:text-3xl text-[#f7f3eb] tracking-wider font-light">
            {t.title}
          </h3>
          <p className="font-serif-luxury text-sm text-[#b0aba0] max-w-xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 flex flex-col justify-between border transition-all duration-300 ${
                plan.popular
                  ? 'bg-gradient-to-b from-[#162725] to-[#0c1617] border-[#d6b77c] shadow-xl shadow-[#d6b77c]/10'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#d6b77c] text-[#090f10] text-[10px] uppercase font-bold tracking-widest">
                  Most Cherished
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#d6b77c] font-mono">
                    {plan.visits}
                  </span>
                  <h4 className="font-serif-luxury text-xl text-[#f7f3eb] mt-1 font-light">
                    {plan.name}
                  </h4>
                </div>

                <div className="pt-2">
                  <span className="font-mono text-3xl font-light text-[#f7f3eb]">
                    {plan.price}
                  </span>
                </div>

                <div className="pt-4 border-t border-white/[0.06] space-y-2.5">
                  {plan.perks.map((perk, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#a8a398]">
                      <Check className="w-3.5 h-3.5 text-[#d6b77c] shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => {
                    onSelectAbonnement(plan.name, plan.price);
                    onClose();
                  }}
                  className={`w-full py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-[#d6b77c] text-[#090f10] hover:bg-[#c5a367]'
                      : 'border border-white/20 text-white/90 hover:border-[#d6b77c] hover:text-[#d6b77c]'
                  }`}
                >
                  {t.selectBtn}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
