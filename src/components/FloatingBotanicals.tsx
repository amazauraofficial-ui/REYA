import { motion, useReducedMotion } from 'framer-motion';

interface FloatingBotanicalItem {
  id: string;
  type: 'lotus-petal' | 'eucalyptus-leaf' | 'jasmine-bud' | 'tea-leaf';
  top: string;
  left?: string;
  right?: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  rotateRange: [number, number];
  color: string;
}

const BOTANICAL_ELEMENTS: FloatingBotanicalItem[] = [
  // Hero section ambient petal
  {
    id: 'bot-1',
    type: 'lotus-petal',
    top: '18%',
    right: '12%',
    size: 42,
    duration: 16,
    delay: 0,
    opacity: 0.18,
    rotateRange: [-12, 14],
    color: '#d6b77c',
  },
  // Products section floating leaf
  {
    id: 'bot-2',
    type: 'eucalyptus-leaf',
    top: '32%',
    left: '8%',
    size: 48,
    duration: 19,
    delay: 2,
    opacity: 0.22,
    rotateRange: [8, -16],
    color: '#2a443e',
  },
  // Services section floating jasmine
  {
    id: 'bot-3',
    type: 'jasmine-bud',
    top: '46%',
    right: '8%',
    size: 34,
    duration: 15,
    delay: 4,
    opacity: 0.2,
    rotateRange: [-18, 12],
    color: '#d6b77c',
  },
  // Meditation Program section gentle petal
  {
    id: 'bot-4',
    type: 'tea-leaf',
    top: '59%',
    left: '12%',
    size: 38,
    duration: 18,
    delay: 1,
    opacity: 0.22,
    rotateRange: [14, -10],
    color: '#325046',
  },
  // Reservation section floating lotus petal
  {
    id: 'bot-5',
    type: 'lotus-petal',
    top: '72%',
    right: '14%',
    size: 46,
    duration: 21,
    delay: 3,
    opacity: 0.16,
    rotateRange: [-10, 16],
    color: '#d6b77c',
  },
  // Atmosphere gallery floating botanical
  {
    id: 'bot-6',
    type: 'eucalyptus-leaf',
    top: '84%',
    left: '6%',
    size: 52,
    duration: 17,
    delay: 5,
    opacity: 0.2,
    rotateRange: [12, -14],
    color: '#243e37',
  },
  // FAQ section gentle petal
  {
    id: 'bot-7',
    type: 'tea-leaf',
    top: '93%',
    right: '10%',
    size: 36,
    duration: 20,
    delay: 2.5,
    opacity: 0.18,
    rotateRange: [-15, 12],
    color: '#d6b77c',
  },
];

export default function FloatingBotanicals() {
  const shouldReduceMotion = useReducedMotion();

  const renderShape = (type: FloatingBotanicalItem['type'], color: string) => {
    switch (type) {
      case 'lotus-petal':
        return (
          <svg viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Delicate curved lotus petal */}
            <path
              d="M20 0C32 18 38 38 20 60C2 38 8 18 20 0Z"
              fill={color}
              fillOpacity="0.8"
            />
            <path
              d="M20 4C22 22 23 42 20 56"
              stroke="#ffffff"
              strokeOpacity="0.25"
              strokeWidth="0.75"
              strokeLinecap="round"
            />
          </svg>
        );

      case 'eucalyptus-leaf':
        return (
          <svg viewBox="0 0 50 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Slender willow / eucalyptus leaf with gentle curve */}
            <path
              d="M25 0C40 20 45 48 25 70C12 50 10 25 25 0Z"
              fill={color}
              fillOpacity="0.85"
            />
            <path
              d="M25 5Q26 35 25 65"
              stroke="#ffffff"
              strokeOpacity="0.2"
              strokeWidth="1"
              strokeLinecap="round"
            />
            {/* Delicate side veins */}
            <path d="M25 25Q32 20 36 22" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="0.6" />
            <path d="M25 38Q17 33 13 36" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="0.6" />
            <path d="M25 48Q33 44 37 47" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="0.6" />
          </svg>
        );

      case 'jasmine-bud':
        return (
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Ethereal 5-lobed blossom silhouette */}
            <circle cx="20" cy="20" r="4" fill={color} fillOpacity="0.9" />
            <ellipse cx="20" cy="9" rx="4" ry="7" fill={color} fillOpacity="0.7" />
            <ellipse cx="20" cy="31" rx="4" ry="7" fill={color} fillOpacity="0.7" />
            <ellipse cx="9" cy="20" rx="7" ry="4" fill={color} fillOpacity="0.7" />
            <ellipse cx="31" cy="20" rx="7" ry="4" fill={color} fillOpacity="0.7" />
          </svg>
        );

      case 'tea-leaf':
      default:
        return (
          <svg viewBox="0 0 35 55" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Eastern herbal tea leaf */}
            <path
              d="M17 0C28 15 32 35 17 55C3 36 6 16 17 0Z"
              fill={color}
              fillOpacity="0.8"
            />
            <path
              d="M17 3C18 20 18 38 17 50"
              stroke="#ffffff"
              strokeOpacity="0.2"
              strokeWidth="0.7"
            />
          </svg>
        );
    }
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {BOTANICAL_ELEMENTS.map((elem) => {
        return (
          <motion.div
            key={elem.id}
            style={{
              position: 'absolute',
              top: elem.top,
              left: elem.left,
              right: elem.right,
              width: elem.size,
              height: elem.size,
              opacity: elem.opacity,
            }}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [0, -32, 0],
                    x: [0, 18, -12, 0],
                    rotate: [0, elem.rotateRange[0], elem.rotateRange[1], 0],
                  }
            }
            transition={{
              duration: elem.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: elem.delay,
            }}
          >
            {renderShape(elem.type, elem.color)}
          </motion.div>
        );
      })}
    </div>
  );
}
