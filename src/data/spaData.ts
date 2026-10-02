import { ServiceItem, RitualProgram, GalleryRoom, TestimonialItem } from '../types';

import heroMassage from '../assets/images/hero_spa_massage_1790829277810.jpg';
import productsCandles from '../assets/images/spa_products_candles_1790829298132.jpg';
import serviceFacials from '../assets/images/spa_service_facials_1790829312118.jpg';
import serviceSauna from '../assets/images/spa_service_sauna_1790829324502.jpg';
import bathingHall from '../assets/images/spa_bathing_hall_1790829337604.jpg';

// Real generated high-resolution spa photography (ES Module bundled for Netlify & Production)
export const IMAGES = {
  heroMassage,
  productsCandles,
  serviceFacials,
  serviceSauna,
  bathingHall,
};

export const SERVICES_DATA: Record<'en' | 'ru', ServiceItem[]> = {
  en: [
    {
      id: 'massage',
      category: 'massage',
      title: 'Massage',
      subtitle: 'Full Body & Deep Tissue Holistic Massage',
      description: 'Specially blended warm essential oils are applied to enhance therapeutic and relaxing properties, releasing tension, nourishing skin cells, and restoring vital body harmony.',
      duration: '60 - 90 min',
      price: '$130',
      image: IMAGES.heroMassage,
      highlights: ['Warm virgin coconut & jasmine oil', 'Acupressure energy meridian alignment', 'Hot volcanic stone finish']
    },
    {
      id: 'facials',
      category: 'facials',
      title: 'Facials',
      subtitle: 'Purification & Rejuvenating Facial Ritual',
      description: 'A preventive therapeutic technique targeting facial skin and delicate musculature. Enhances skin microcirculation, sculpts facial contours, diminishes inflammation, and stimulates biological rejuvenation.',
      duration: '45 - 60 min',
      price: '$110',
      image: IMAGES.serviceFacials,
      highlights: ['Enzyme micro-exfoliation', 'Herbal steam & lymphatic drainage', 'Cooling jade roller infusion']
    },
    {
      id: 'aroma',
      category: 'aroma',
      title: 'Aroma',
      subtitle: 'Botanical Aromatherapy & Body Wrapping',
      description: 'Awakens micro-lymphatic flow and delivers deep silhouette remodeling. Cocoa extract, caffeine, and grape allantoin nourish cellular tone, while rare botanical essences provide prolonged antioxidant protection.',
      duration: '50 - 75 min',
      price: '$120',
      image: IMAGES.productsCandles,
      highlights: ['Organic cacao & shea butter mask', 'Thermal wrap cocoon infusion', 'Bergamot & lemongrass scent therapy']
    },
    {
      id: 'sauna',
      category: 'sauna',
      title: 'Sauna',
      subtitle: 'Herbal Steam & Cedarwood Thermal Ceremony',
      description: 'Ancient bathing mastery in handcrafted Finnish cedar suites. Eucalyptus-infused steam whisks promote deep respiratory detoxification, soothing aching muscles and grounding mind and spirit.',
      duration: '60 - 120 min',
      price: '$95',
      image: IMAGES.serviceSauna,
      highlights: ['Oak & birch venik steam ritual', 'Natural Himalayan salt wall infusion', 'Contrast plunge & thermal grotto pool']
    }
  ],
  ru: [
    {
      id: 'massage',
      category: 'massage',
      title: 'Массаж',
      subtitle: 'Массаж всего тела и глубокая релаксация',
      description: 'Масла применяются для усиления полезных свойств процедуры, а также обеспечения дополнительных оздоравливающих эффектов на организм. Эфирные масла быстро распространяются по клеткам, воздействуют на весь организм в целом.',
      duration: '60 - 90 мин',
      price: '3 500 ₽',
      image: IMAGES.heroMassage,
      highlights: ['Теплое кокосовое и жасминовое масло', 'Акупрессура и снятие мышечных зажимов', 'Горячие базальтовые камни']
    },
    {
      id: 'facials',
      category: 'facials',
      title: 'Уход за лицом',
      subtitle: 'Очищение и восстанавливающий массаж лица',
      description: 'Массаж лица – профилактический и лечебный метод воздействия на кожу и мышцы лица. В результате массажа кожа приобретает здоровый и ухоженный вид, подтягивается овал лица, уменьшаются воспаления, происходит стимуляция биологических точек.',
      duration: '45 - 60 мин',
      price: '2 900 ₽',
      image: IMAGES.serviceFacials,
      highlights: ['Ферментный пилинг', 'Травяной пар и лимфодренаж', 'Охлаждающий массаж нефритовыми сферами']
    },
    {
      id: 'aroma',
      category: 'aroma',
      title: 'Ароматерапия',
      subtitle: 'Шоколадное и растительное обертывание',
      description: 'Активизирует липолиз, оказывает моделирующее действие, выравнивает рельеф и питает кожу. Теобромин и кофеин в составе какао порошка возвращают коже упругость. Аллантоин успокаивает, а фруктоген винограда обеспечивает антиоксидантную защиту коже.',
      duration: '50 - 75 мин',
      price: '3 200 ₽',
      image: IMAGES.productsCandles,
      highlights: ['Маска из натурального какао и масла ши', 'Термоодеяло для максимального усвоения', 'Аромакомпозиция лемонграсса и бергамота']
    },
    {
      id: 'sauna',
      category: 'sauna',
      title: 'Сауна и парение',
      subtitle: 'Кедровая сауна и банные ритуалы',
      description: 'Традиционное банное парение с эвкалиптовыми и березовыми вениками в отделке из векового кедра. Способствует глубокому очищению пор, снятию усталости и гармонизации нервной системы.',
      duration: '60 - 120 мин',
      price: '2 500 ₽',
      image: IMAGES.serviceSauna,
      highlights: ['Парение с вениками из дуба и эвкалипта', 'Ионизация воздуха гималайской солью', 'Контрастный бассейн и ледяная купель']
    }
  ]
};

export const MEDITATION_SPA_DAY: Record<'en' | 'ru', RitualProgram> = {
  en: {
    title: 'MEDITATION SPA DAY',
    dates: 'March 8 – 14 Seasonal Journey',
    tagline: 'The ideal gift for you and your cherished ones',
    description: 'A 3-hour signature holistic sanctuary program crafted to guide you into profound peace and beauty, feeling vitality, restorative calm, and renewed inner balance through ancient Eastern wellness rituals.',
    durationMinutes: 180,
    price: '$120 / 3,500 ₽',
    phases: [
      {
        step: 1,
        title: 'Full Body Massage',
        shortDesc: 'Warm therapeutic oils & acupressure',
        fullDesc: 'Warm organic essential botanical oils are systematically applied to activate cellular vitality and soothe deep muscular knots across the entire body.',
        image: IMAGES.heroMassage
      },
      {
        step: 2,
        title: 'Facial Cleansing & Massage',
        shortDesc: 'Revitalizing skin contouring & pressure points',
        fullDesc: 'Gentle exfoliation followed by targeted facial muscle lifting, stimulating vital biological energy points and restoring a glowing porcelain complexion.',
        image: IMAGES.serviceFacials
      },
      {
        step: 3,
        title: 'Chocolate Body Wrap',
        shortDesc: 'Antioxidant cocoa & shea rejuvenation',
        fullDesc: 'Nourishing cocoa theobromine promotes natural microcirculation and skin firmness, wrapping the body in a soothing, aromatic antioxidant sanctuary.',
        image: IMAGES.productsCandles
      },
      {
        step: 4,
        title: 'Traditional Tea Ceremony',
        shortDesc: 'Exotic herbal infusion with tea master',
        fullDesc: 'Mindful tasting of premium high-mountain teas prepared table-side by our tea master, answering any questions and completing the sensory transition.',
        image: IMAGES.serviceSauna
      }
    ]
  },
  ru: {
    title: 'MEDITATION SPA DAY',
    dates: '8–14 марта',
    tagline: 'Идеальный подарок для вас и ваших любимых!',
    description: 'Программа Meditation Spa Day позволит Вам окунуться в атмосферу гармонии и красоты, почувствовать энергию и прилив сил. Это 3-х часовая СПА программа по уходу за кожей лица и тела, а также включающая в себя традиционные тайские и восточные ритуалы.',
    durationMinutes: 180,
    price: '3 500 ₽',
    phases: [
      {
        step: 1,
        title: 'Массаж всего тела',
        shortDesc: 'Теплые эфирные масла и релаксация',
        fullDesc: 'Масла применяются для усиления полезных свойств процедуры, а также обеспечения дополнительных оздоравливающих эффектов. Эфирные масла быстро распространяются по клеткам, воздействуют на весь организм в целом.',
        image: IMAGES.heroMassage
      },
      {
        step: 2,
        title: 'Очищение и массаж лица',
        shortDesc: 'Снятие отечности и тонус мышц',
        fullDesc: 'Массаж лица – профилактический и лечебный метод воздействия. В результате массажа кожа приобретает здоровый вид, подтягивается овал лица, стимулируются биологически активные точки.',
        image: IMAGES.serviceFacials
      },
      {
        step: 3,
        title: 'Шоколадное обертывание',
        shortDesc: 'Антиоксидантное моделирование тела',
        fullDesc: 'Активизирует липолиз, моделирует рельеф и питает кожу. Теобромин и кофеин возвращают коже упругость, а аллантоин глубоко успокаивает и защищает.',
        image: IMAGES.productsCandles
      },
      {
        step: 4,
        title: 'Традиционное чаепитие',
        shortDesc: 'Чайная церемония с чайным мастером',
        fullDesc: 'Традиционная чайная церемония, мастерство приготовления редких сортов чая. Чайный мастер от начала до конца проведет ритуал и ответит на все вопросы.',
        image: IMAGES.serviceSauna
      }
    ]
  }
};

export const GALLERY_ROOMS: Record<'en' | 'ru', GalleryRoom[]> = {
  en: [
    {
      id: 'bathing-hall',
      name: 'Thermal Bathing Hall',
      indexLabel: '1/7 BATHING HALL',
      description: 'Sunken stone hydrotherapy grotto gently illuminated by dozens of flickering candles, surrounded by natural clay amphoras and heated basalt stones.',
      image: IMAGES.bathingHall,
      features: ['Heated thermal pool', 'Floating candlelight', 'Mineral water jets']
    },
    {
      id: 'cedar-sauna',
      name: 'Finnish Cedarwood Sauna',
      indexLabel: '2/7 CEDARWOOD SAUNA',
      description: 'Warm timber chamber crafted from aged Northern cedarwood with gentle amber backlighting and volcanic stone steam infusion.',
      image: IMAGES.serviceSauna,
      features: ['Aromatic eucalyptus steam', '100% aged cedar', 'Dry heat & wet steam']
    },
    {
      id: 'couples-suite',
      name: 'Royal Couples Sanctuary',
      indexLabel: '3/7 COUPLES SUITE',
      description: 'Private candlelit sanctuary with dual custom teak massage beds, soft linen drapery, and private en-suite copper soaking bath.',
      image: IMAGES.heroMassage,
      features: ['Dual massage tables', 'Private soaking tub', 'Rose petal aromatherapy']
    },
    {
      id: 'apothecary-lounge',
      name: 'Herbal Apothecary & Tea Lounge',
      indexLabel: '4/7 TEA LOUNGE',
      description: 'Tranquil sanctuary where handcrafted organic body oils, scrubs, and rare harvested teas are prepared specifically for each guest.',
      image: IMAGES.productsCandles,
      features: ['Rare mountain teas', 'Custom oil blending', 'Fresh fruit & honey']
    },
    {
      id: 'facial-atelier',
      name: 'Botanical Facial Atelier',
      indexLabel: '5/7 FACIAL ATELIER',
      description: 'Peaceful treatment suite dedicated to dermatological wellness, jade roller lymphatic sculpting, and organic botanical serums.',
      image: IMAGES.serviceFacials,
      features: ['Adjustable heated lounger', 'Micro-diffusers', 'Soft acoustic insulation']
    },
    {
      id: 'himalayan-salt',
      name: 'Himalayan Salt Relaxation Grotto',
      indexLabel: '6/7 SALT GROTTO',
      description: 'Ionized salt wall suite providing deep respiratory clarity while resting on warmed ergonomic loungers enveloped in ambient serenity.',
      image: IMAGES.bathingHall,
      features: ['Negative ion generator', 'Subtle color therapy', 'Ergonomic heated beds']
    },
    {
      id: 'zen-vip-suite',
      name: 'VIP Private Water Pavilion',
      indexLabel: '7/7 VIP PAVILION',
      description: 'Exclusive private wing with dedicated plunge pool, private sauna, rain showers, and personal wellness butler service.',
      image: IMAGES.serviceSauna,
      features: ['Private plunge pool', 'Rainfall shower suite', 'Butler service']
    }
  ],
  ru: [
    {
      id: 'bathing-hall',
      name: 'Купальный зал',
      indexLabel: '1/7 КУПАЛЬНЫЙ ЗАЛ',
      description: 'Каменный гидротермальный грот, озаренный десятками мерцающих свечей, с древними глиняными амфорами и теплой минеральной водой.',
      image: IMAGES.bathingHall,
      features: ['Термальный бассейн', 'Мерцающие свечи', 'Гидромассажные форсунки']
    },
    {
      id: 'cedar-sauna',
      name: 'Кедровая финская сауна',
      indexLabel: '2/7 КЕДРОВАЯ САУНА',
      description: 'Уютная парильня из векового кедра с мягкой янтарной подсветкой и паром на вулканических камнях.',
      image: IMAGES.serviceSauna,
      features: ['Эвкалиптовый пар', '100% северный кедр', 'Мягкий температурный режим']
    },
    {
      id: 'couples-suite',
      name: 'Королевский люкс для двоих',
      indexLabel: '3/7 ЛЮКС ДЛЯ ДВОИХ',
      description: 'Приватное пространство с двумя массажными столами, шелковыми драпировками и уединенной медной ванной.',
      image: IMAGES.heroMassage,
      features: ['Два массажных ложа', 'Медная ванна с лепестками', 'Персональный мастер']
    },
    {
      id: 'apothecary-lounge',
      name: 'Чайная комната и аптека масел',
      indexLabel: '4/7 ЧАЙНАЯ ГОСТИНАЯ',
      description: 'Зона отдыха, где для каждого гостя вручную смешиваются эфирные масла и подаются редкие высокогорные чаи.',
      image: IMAGES.productsCandles,
      features: ['Редкие сорта чая', 'Смешивание масел', 'Сухофрукты и дикий мед']
    },
    {
      id: 'facial-atelier',
      name: 'Кабинет эстетики лица',
      indexLabel: '5/7 КАБИНЕТ ЭСТЕТИКИ',
      description: 'Кабинет для деликатных уходовых процедур, моделирования овала лица и нанесения органических сывороток.',
      image: IMAGES.serviceFacials,
      features: ['Анатомическое кресло', 'Аромадиффузоры', 'Полная звукоизоляция']
    },
    {
      id: 'himalayan-salt',
      name: 'Соляная пещера',
      indexLabel: '6/7 СОЛЯНАЯ КОМНАТА',
      description: 'Комната со стенами из розовой гималайской соли для глубокого очищения дыхания и медитации на шезлонгах.',
      image: IMAGES.bathingHall,
      features: ['Ионизация воздуха', 'Хромотерапия', 'Анатомические шезлонги']
    },
    {
      id: 'zen-vip-suite',
      name: 'VIP Апартаменты',
      indexLabel: '7/7 VIP ПАВИЛЬОН',
      description: 'Закрытый приватный комплекс с персональным джакузи, парной, тропическим душем и обслуживанием.',
      image: IMAGES.serviceSauna,
      features: ['Личный бассейн-джакузи', 'Тропический душ', 'Индивидуальный сервис']
    }
  ]
};

export const AVAILABLE_DATES = [
  { day: '8', label: '8 Mar', weekday: 'Mon' },
  { day: '9', label: '9 Mar', weekday: 'Tue' },
  { day: '10', label: '10 Mar', weekday: 'Wed' },
  { day: '11', label: '11 Mar', weekday: 'Thu' },
  { day: '12', label: '12 Mar', weekday: 'Fri' },
  { day: '13', label: '13 Mar', weekday: 'Sat' },
  { day: '14', label: '14 Mar', weekday: 'Sun' },
  { day: '15', label: '15 Mar', weekday: 'Mon' }
];

export const TIME_SLOTS = [
  '10:00 - 13:00',
  '13:30 - 16:30',
  '17:00 - 20:00',
  '20:30 - 23:30'
];

export const TESTIMONIALS_DATA: Record<'en' | 'ru', TestimonialItem[]> = {
  en: [
    {
      id: 'test-1',
      author: 'Sophia Montgomery',
      titleOrLocation: 'Architectural Director, London',
      ritualExperienced: 'Meditation Spa Day (3-hour Program)',
      rating: 5,
      date: 'March 2026',
      quote: 'The sensation of floating candles reflecting off the thermal water while inhaling custom bergamot oil is pure transcendence.',
      fullReview: 'From the minute you step past the carved wooden doors, external noise completely ceases. The 3-hour Meditation Spa Day was the most thorough sensory reset I have experienced in Europe. The therapist’s touch during the acupressure massage untangled months of travel fatigue, followed by the exquisite tea ceremony table-side.',
      verifiedGuest: true,
    },
    {
      id: 'test-2',
      author: 'Alexander & Elena Vance',
      titleOrLocation: 'Sanctuary Guests, Zurich',
      ritualExperienced: 'Royal Couples Sanctuary & Bathing Hall',
      rating: 5,
      date: 'February 2026',
      quote: 'An intimate architectural masterpiece. Unrivaled discretion, restorative thermal waters, and unmatched attention to detail.',
      fullReview: 'We reserved the Royal Couples Suite for our anniversary. The warmth of the copper soaking tub filled with fresh rose petals and the rhythmic synchrony of both therapists was breathtaking. REYA feels like a hidden monastery devoted entirely to peace and rejuvenation.',
      verifiedGuest: true,
    },
    {
      id: 'test-3',
      author: 'Clara Dubois',
      titleOrLocation: 'Dermatology & Botanical Formulator, Paris',
      ritualExperienced: 'Purification & Facial Contour Ritual',
      rating: 5,
      date: 'January 2026',
      quote: 'The cold-pressed botanical serums and jade stone sculpting gave my skin an unmistakable glow that lasted for weeks.',
      fullReview: 'As someone who studies skincare formulations professionally, I was astounded by the purity of the unadulterated oils and the precision of the facial lymph drainage. My complexion looked completely lifted without a single synthetic product.',
      verifiedGuest: true,
    },
    {
      id: 'test-4',
      author: 'Julian Henderson',
      titleOrLocation: 'Private Equity Principal, Geneva',
      ritualExperienced: 'Finnish Cedar Sauna & Deep Tissue Massage',
      rating: 5,
      date: 'February 2026',
      quote: 'The eucalyptus venik steam followed by the thermal pool completely eliminated chronic back tension.',
      fullReview: 'I came in with severe spinal tightness from intense travel. The sauna master prepared a cedarwood steam session with aged birch and eucalyptus that cleared my breathing instantly. The subsequent deep tissue work with warm volcanic stones restored total mobility.',
      verifiedGuest: true,
    },
    {
      id: 'test-5',
      author: 'Nadia Rostova',
      titleOrLocation: 'Concert Pianist, Vienna',
      ritualExperienced: 'Aroma Silhouette Wrap & Tea Ceremony',
      rating: 5,
      date: 'March 2026',
      quote: 'The chocolate wrap and soothing acoustics allowed my mind to enter the deepest meditative rest I have known.',
      fullReview: 'The antioxidant cocoa and shea butter wrap cocooned me in warmth while delicate ambient chimes resonated in the background. Sipping the high-mountain herbal infusion with the tea master afterwards felt like coming home to myself.',
      verifiedGuest: true,
    },
  ],
  ru: [
    {
      id: 'test-1',
      author: 'София Монтгомери',
      titleOrLocation: 'Архитектор, Лондон',
      ritualExperienced: 'Программа Meditation Spa Day (3 часа)',
      rating: 5,
      date: 'Март 2026',
      quote: 'Мерцание сотен свечей над гладью теплого бассейна и аромат бергамота дарят ощущение абсолютного перерождения.',
      fullReview: 'Как только переступаешь порог REYA, весь шум мегаполиса мгновенно растворяется. Трехчасовая программа Meditation Spa Day — это лучшее чувственное восстановление, которое я проходила. Массаж снял накопившуюся за месяцы усталость от перелетов, а чайная церемония стала прекрасным завершением.',
      verifiedGuest: true,
    },
    {
      id: 'test-2',
      author: 'Александр и Елена К.',
      titleOrLocation: 'Минск',
      ritualExperienced: 'Люкс для двоих и Купальный зал',
      rating: 5,
      date: 'Февраль 2026',
      quote: 'Истинный оазис уединения. Безупречный сервис, чарующая атмосфера восточного спокойствия и забота в каждой детали.',
      fullReview: 'Забронировали спа-люкс для двоих в честь годовщины. Медная купель с лепестками роз, синхронная работа мастеров и тихий звук струящейся воды создают ощущение, будто находишься в древнем тайском храме релаксации.',
      verifiedGuest: true,
    },
    {
      id: 'test-3',
      author: 'Клара Дюбуа',
      titleOrLocation: 'Эксперт по натуральной косметике, Париж',
      ritualExperienced: 'Очищение и лифтинг-массаж лица',
      rating: 5,
      date: 'Январь 2026',
      quote: 'Органические масла и нефритовый массаж вернули коже фарфоровое сияние и подтянутый овал лица.',
      fullReview: 'Я профессионально оцениваю составы косметики и была поражена высочайшей чистотой используемых эфирных эликсиров. Техника лимфодренажного массажа лица безупречна — от отечности не осталось и следа, эффект держался несколько недель.',
      verifiedGuest: true,
    },
    {
      id: 'test-4',
      author: 'Дмитрий Власов',
      titleOrLocation: 'Предприниматель, Минск',
      ritualExperienced: 'Кедровая сауна и глубокий массаж',
      rating: 5,
      date: 'Февраль 2026',
      quote: 'Эвкалиптовый пар и горячие камни полностью сняли спазмы в спине. Вышел абсолютно новым человеком.',
      fullReview: 'После напряженной рабочей недели искал место для полноценной перезагрузки. Парение в кедровой сауне с вениками и последующий глубокий массаж всего тела вернули легкость в плечах и спине. Обязательно вернусь снова.',
      verifiedGuest: true,
    },
    {
      id: 'test-5',
      author: 'Надежда Ростова',
      titleOrLocation: 'Преподаватель йоги, Санкт-Петербург',
      ritualExperienced: 'Шоколадное обертывание и чайная церемония',
      rating: 5,
      date: 'Март 2026',
      quote: 'Аромат теплого какао и заботливые руки мастера подарили глубочайший медитативный покой.',
      fullReview: 'Обертывание согревает каждую клеточку, кожа после процедуры нежнейшая, как шелк. А неспешная чайная церемония с чайным мастером позволила закрепить состояние безмятежности.',
      verifiedGuest: true,
    },
  ],
};

