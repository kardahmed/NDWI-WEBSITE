'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Custom cursor trail — petit point copper qui suit la souris avec spring lag,
 * grossit en cercle vide quand on survole un lien/bouton.
 *
 * Désactivé automatiquement :
 *   - sur écran tactile (matchMedia hover:none)
 *   - en mode prefers-reduced-motion
 *
 * À monter UNE fois au root layout. Le curseur natif n'est PAS masqué
 * (le trail vient en accent par-dessus, non en remplacement).
 */

export function CursorTrail() {
  const [enabled, setEnabled] = useState(false);
  const [hoveringLink, setHoveringLink] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 350, damping: 30, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 350, damping: 30, mass: 0.4 });
  const lastMove = useRef(0);

  useEffect(() => {
    // Conditions d'activation
    if (typeof window === 'undefined') return;
    const hasHover = window.matchMedia('(hover: hover)').matches;
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!hasHover || noMotion) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      lastMove.current = Date.now();
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const link = target.closest('a, button, [role="button"]');
      setHoveringLink(!!link);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[200] mix-blend-difference"
      style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
    >
      <motion.div
        className="rounded-full border bg-copper-500"
        animate={{
          width: hoveringLink ? 28 : 10,
          height: hoveringLink ? 28 : 10,
          backgroundColor: hoveringLink ? 'rgba(184,101,26,0)' : '#B8651A',
          borderColor: hoveringLink ? '#B8651A' : 'rgba(184,101,26,0)',
          borderWidth: hoveringLink ? 1.5 : 0,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      />
    </motion.div>
  );
}
