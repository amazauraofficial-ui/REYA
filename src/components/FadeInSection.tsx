import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Luxury subtle fade-in entrance wrapper using framer-motion.
 * Features serene easing [0.16, 1, 0.3, 1] and once-only viewport triggers.
 */
export default function FadeInSection({
  children,
  className = '',
  delay = 0,
}: FadeInSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.85,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
