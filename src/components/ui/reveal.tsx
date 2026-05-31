'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Wrapper pour révéler du contenu au scroll (fade + translate).
 *
 * Exemples :
 *   <Reveal>...</Reveal>                   → fade-up classique
 *   <Reveal direction="left">...</Reveal>  → entre depuis la gauche
 *   <Reveal delay={0.2}>...</Reveal>       → décalé de 200 ms
 *   <Reveal as="section">...</Reveal>      → utilise <section> au lieu de <div>
 *
 *   Pour staggerer N enfants :
 *   <RevealStagger>
 *     <Reveal>...</Reveal>
 *     <Reveal>...</Reveal>
 *   </RevealStagger>
 */

interface RevealProps {
  children: ReactNode;
  /** Direction de l'animation d'entrée. */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Délai en secondes avant l'animation. */
  delay?: number;
  /** Durée en secondes. Default 0.7. */
  duration?: number;
  /** Distance de translate en pixels. Default 24. */
  distance?: number;
  /** Garde l'animation jouée une seule fois (default true). */
  once?: boolean;
  /** Marge du viewport observer (px ou %) avant déclenchement. */
  margin?: string;
  className?: string;
  /** Tag HTML wrapper. Default 'div'. */
  as?: 'div' | 'section' | 'article' | 'header' | 'footer';
}

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  distance = 24,
  once = true,
  margin = '-80px',
  className,
  as = 'div',
}: RevealProps) {
  const offset = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  }[direction];

  const variants: Variants = {
    hidden: { opacity: 0, ...offset },
    visible: { opacity: 1, x: 0, y: 0 },
  };

  const MotionTag = (motion as unknown as Record<string, typeof motion.div>)[as] ?? motion.div;

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: margin as unknown as undefined }}
      variants={variants}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Wrapper qui stagger automatiquement les <Reveal> enfants.
 * Chaque enfant reçoit un delay incrémental (par défaut +0.08 s).
 */
export function RevealStagger({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}
