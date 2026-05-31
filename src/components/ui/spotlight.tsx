'use client';

import { useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightProps {
  children: ReactNode;
  /** Couleur du spotlight (rgba ou hex). Default copper translucide. */
  color?: string;
  /** Rayon du gradient en pixels. Default 220. */
  radius?: number;
  className?: string;
}

/**
 * Wrapper qui ajoute un radial-gradient suiveur de curseur à l'intérieur
 * de l'élément. Quand on entre avec la souris, un glow copper subtil
 * apparait et suit le curseur. Disparait quand on sort.
 *
 *   <Spotlight>
 *     <Card>...</Card>
 *   </Spotlight>
 *
 * Désactivé sur touch (hover:none). Pas de JS de tracking sur mobile.
 */
export function Spotlight({
  children,
  color = 'rgba(184, 101, 26, 0.18)',
  radius = 220,
  className,
}: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const onMouseLeave = () => setPos(null);

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn('relative isolate', className)}
    >
      {children}
      {/* Layer spotlight au-dessus, pointer-events:none pour pas bloquer le contenu */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: pos ? 1 : 0,
          background: pos
            ? `radial-gradient(${radius}px circle at ${pos.x}px ${pos.y}px, ${color}, transparent 70%)`
            : undefined,
        }}
      />
    </div>
  );
}
