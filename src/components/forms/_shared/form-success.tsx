'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';

interface FormSuccessProps {
  title?: string;
  body?: string;
}

const DEFAULTS: Record<Locale, { title: string; body: string }> = {
  fr: {
    title: 'Demande reçue.',
    body: 'Un conseiller NDWI vous contactera sous 24 à 48 h ouvrées avec une réponse personnalisée.',
  },
  ar: {
    title: 'تم استلام طلبكم.',
    body: 'سيتواصل معكم مستشار NDWI خلال 24 إلى 48 ساعة عمل بإجابة شخصية.',
  },
};

/**
 * Success state célébré :
 *  - Disque copper avec halo qui pulse (3 ondes concentriques infinies)
 *  - Check SVG dessiné en path (draw animation 0.45s)
 *  - 4 mini confettis copper qui sautent autour
 *  - Texte fade-up en cascade après le check
 */
export function FormSuccess({ title, body }: FormSuccessProps) {
  const locale = useLocale() as Locale;
  const d = DEFAULTS[locale] ?? DEFAULTS.fr;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-bone-50 border border-ink/10 p-10 lg:p-14 text-center"
    >
      {/* Disque + halo + check + confetti */}
      <div className="relative mx-auto h-16 w-16">
        {/* 3 ondes concentriques */}
        {[0, 0.3, 0.6].map((delay, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute inset-0 rounded-full bg-copper-500/30"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 1.8, delay, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}

        {/* Disque plein qui pop */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 0.1 }}
          className="relative h-full w-full rounded-full bg-copper-500 flex items-center justify-center"
        >
          {/* Check dessiné en SVG path */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <motion.path
              d="M8 16.5L13 21.5L24 10.5"
              stroke="#FAF8F5"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, delay: 0.4, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>

        {/* 4 mini confettis */}
        {[
          { dx: -22, dy: -14, delay: 0.5 },
          { dx: 24, dy: -16, delay: 0.55 },
          { dx: -18, dy: 18, delay: 0.6 },
          { dx: 20, dy: 16, delay: 0.62 },
        ].map((c, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-full bg-copper-500"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ x: c.dx, y: c.dy, opacity: [0, 1, 0] }}
            transition={{ duration: 0.7, delay: c.delay, ease: 'easeOut' }}
          />
        ))}
      </div>

      {/* Texte */}
      <motion.h3
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="heading-display mt-8 text-3xl"
      >
        {title ?? d.title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 text-ink/70 max-w-md mx-auto leading-relaxed"
      >
        {body ?? d.body}
      </motion.p>
    </motion.div>
  );
}
