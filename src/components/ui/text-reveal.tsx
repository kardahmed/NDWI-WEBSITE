'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextRevealProps {
  /** Le texte à révéler. Sera splitté par mot. */
  text: string;
  /** Délai global avant le début (s). Default 0. */
  delay?: number;
  /** Décalage entre chaque mot (s). Default 0.07. */
  stagger?: number;
  /** Durée d'apparition d'un mot (s). Default 0.7. */
  duration?: number;
  /** Tag HTML rendu. Default 'span'. */
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
}

/**
 * Révélation mot-par-mot avec blur-to-clear + slide-up subtil.
 * Effet théâtre premium, à doser : à utiliser sur 1-2 H1 majeurs uniquement
 * (HeroStory titre principal, par exemple) — sinon ça sature.
 *
 *   <TextReveal as="h1" text="Bâtir l'habitat algérien de demain." />
 */
export function TextReveal({
  text,
  delay = 0,
  stagger = 0.07,
  duration = 0.7,
  as = 'span',
  className,
}: TextRevealProps) {
  const words = text.split(/(\s+)/); // garde les espaces dans le split
  const MotionTag = motion[as] as typeof motion.span;

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { delayChildren: delay, staggerChildren: stagger } },
      }}
      aria-label={text}
    >
      {words.map((word, i) => {
        // Les espaces purs : on les rend tels quels sans animation (sinon ils prennent l'easing)
        if (/^\s+$/.test(word)) {
          return <span key={i}>{word}</span>;
        }
        return (
          <motion.span
            key={i}
            className="inline-block"
            variants={{
              hidden: { opacity: 0, y: 12, filter: 'blur(8px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
            }}
            transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
          >
            {word}
          </motion.span>
        );
      })}
    </MotionTag>
  );
}
