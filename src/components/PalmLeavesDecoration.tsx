import { motion, useReducedMotion } from 'framer-motion';

interface PalmLeavesProps {
  position?: 'left' | 'right' | 'bottom-right';
  className?: string;
  swayDuration?: number;
}

export default function PalmLeavesDecoration({
  position = 'left',
  className = '',
  swayDuration = 12,
}: PalmLeavesProps) {
  const shouldReduceMotion = useReducedMotion();

  if (position === 'left') {
    return (
      <div
        className={`pointer-events-none select-none absolute left-0 -translate-x-12 md:-translate-x-4 z-0 opacity-40 mix-blend-screen overflow-visible ${className}`}
        aria-hidden="true"
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  rotate: [-2, 2.5, -2],
                  y: [-4, 6, -4],
                  x: [-2, 3, -2],
                }
          }
          transition={{
            duration: swayDuration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: 'bottom left' }}
        >
          <svg
            width="440"
            height="720"
            viewBox="0 0 420 700"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#1f3a34] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            {/* Main stem with subtle curvature */}
            <path
              d="M-20 680C50 560 140 380 180 120"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Organic Frond leaves */}
            <path d="M60 560C140 540 260 550 320 590C230 520 120 525 60 560Z" fill="currentColor" fillOpacity="0.45" />
            <path d="M90 490C180 460 310 470 380 500C280 440 160 450 90 490Z" fill="currentColor" fillOpacity="0.55" />
            <path d="M120 410C220 370 350 380 410 400C300 350 180 370 120 410Z" fill="currentColor" fillOpacity="0.65" />
            <path d="M140 320C240 270 360 270 410 280C300 250 190 270 140 320Z" fill="currentColor" fillOpacity="0.75" />
            <path d="M160 230C250 170 350 160 390 160C280 150 190 190 160 230Z" fill="currentColor" fillOpacity="0.65" />
            <path d="M170 150C240 90 320 70 350 60C260 70 190 110 170 150Z" fill="currentColor" fillOpacity="0.55" />
          </svg>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`pointer-events-none select-none absolute right-0 translate-x-10 z-0 opacity-40 mix-blend-screen overflow-visible ${className}`}
      aria-hidden="true"
    >
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                rotate: [2, -2.5, 2],
                y: [4, -6, 4],
                x: [3, -2, 3],
              }
        }
        transition={{
          duration: swayDuration + 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ transformOrigin: 'bottom right' }}
      >
        <svg
          width="480"
          height="660"
          viewBox="0 0 460 640"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#19322c] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        >
          <path
            d="M440 620C360 500 260 320 220 80"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path d="M370 510C290 490 170 510 110 560C200 480 310 480 370 510Z" fill="currentColor" fillOpacity="0.45" />
          <path d="M330 430C240 390 120 410 60 450C160 380 270 390 330 430Z" fill="currentColor" fillOpacity="0.55" />
          <path d="M290 340C190 290 80 300 30 330C130 270 240 290 290 340Z" fill="currentColor" fillOpacity="0.65" />
          <path d="M260 250C170 190 70 190 20 210C120 170 220 200 260 250Z" fill="currentColor" fillOpacity="0.55" />
          <path d="M240 160C160 100 80 90 40 90C130 90 200 130 240 160Z" fill="currentColor" fillOpacity="0.45" />
        </svg>
      </motion.div>
    </div>
  );
}
