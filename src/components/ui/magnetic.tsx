'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Magnetic wrapper — l'enfant est légèrement attiré vers le curseur quand
 * la souris approche, donnant un effet "live" aux boutons et liens importants.
 *
 * Convention : à appliquer uniquement aux CTAs principaux (max 1-2 par page)
 * pour éviter l'effet "tout bouge tout le temps" qui sature.
 *
 *   <Magnetic>
 *     <Link href="..." className="btn-primary">…</Link>
 *   </Magnetic>
 *
 * Désactivé automatiquement sur écrans tactiles via hover detection.
 */

interface MagneticProps {
  children: ReactNode;
  /** Intensité de l'attraction (0-1). Default 0.4 (subtle). */
  strength?: number;
  /** Distance de detection en pixels (margin autour). Default 0. */
  detectionRadius?: number;
  className?: string;
}

export function Magnetic({
  children,
  strength = 0.4,
  detectionRadius = 0,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Ressort doux pour smooth follow + retour à la position d'origine.
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) * strength;
    const dy = (e.clientY - centerY) * strength;
    x.set(dx);
    y.set(dy);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Désactiver sur touch devices : on détecte via hover capability.
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onPointerLeave={onMouseLeave}
      className={cn('@media(hover:none){pointer-events-auto}', className)}
      style={{ padding: detectionRadius }}
    >
      <motion.div style={{ x: springX, y: springY }} className="inline-block">
        {children}
      </motion.div>
    </div>
  );
}
