'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Slider de comparaison avant/après — drag-to-reveal classique.
 *
 * Une image "avant" en background, une "après" en overlay clippé par
 * clip-path: inset() qui suit la position du handle. Le handle se
 * déplace via mousedown/touchstart + mousemove/touchmove.
 *
 * Utilisation pour Réalisations (état chantier brut → après pose finie),
 * ou pour comparer 2 finitions sur une même porte.
 *
 *   <BeforeAfterSlider
 *     beforeSrc="/images/realisations/chantier-brut.jpg"
 *     afterSrc="/images/realisations/apres-pose.jpg"
 *     beforeLabel="Avant"
 *     afterLabel="Après"
 *   />
 */

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  /** Label badge sur l'image avant. */
  beforeLabel?: string;
  /** Label badge sur l'image après. */
  afterLabel?: string;
  /** Position initiale du handle 0..100 (pourcentage). Default 50. */
  initial?: number;
  className?: string;
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = 'Avant',
  afterAlt = 'Après',
  beforeLabel = 'Avant',
  afterLabel = 'Après',
  initial = 50,
  className,
}: BeforeAfterSliderProps) {
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(initial); // 0..100
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPos(pct);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0]?.clientX : (e as MouseEvent).clientX;
      if (clientX != null) updateFromClientX(clientX);
    };
    const onEnd = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchend', onEnd);
    };
  }, [dragging, updateFromClientX]);

  // Permet aussi le clic direct n'importe où sur l'image pour repositionner.
  const onContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging) return;
    updateFromClientX(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      onClick={onContainerClick}
      className={cn(
        'relative aspect-[16/10] w-full overflow-hidden bg-bone-200 select-none cursor-ew-resize',
        className
      )}
    >
      {/* Image AVANT (fond complet) */}
      <Image
        src={beforeSrc}
        alt={beforeAlt}
        fill
        className="object-cover pointer-events-none"
        sizes="100vw"
        priority
      />
      <span className="absolute top-4 start-4 z-10 px-2.5 py-1 bg-ink/85 text-bone-50 text-[10px] uppercase tracking-[0.16em] font-medium pointer-events-none">
        {beforeLabel}
      </span>

      {/* Image APRÈS clippée à pos% depuis la gauche */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image
          src={afterSrc}
          alt={afterAlt}
          fill
          className="object-cover pointer-events-none"
          sizes="100vw"
          priority
        />
        <span className="absolute top-4 end-4 z-10 px-2.5 py-1 bg-copper-500 text-bone-50 text-[10px] uppercase tracking-[0.16em] font-medium pointer-events-none">
          {afterLabel}
        </span>
      </div>

      {/* Handle (ligne verticale + cercle au centre) */}
      <div
        className="absolute top-0 bottom-0 -translate-x-1/2 z-20 pointer-events-none"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-0 bottom-0 w-0.5 bg-bone-50 shadow-[0_0_12px_rgba(0,0,0,0.4)]" />
        {/* Cercle drag handle au centre vertical */}
        <button
          type="button"
          aria-label={locale === 'ar' ? 'اسحب للمقارنة' : 'Glisser pour comparer'}
          onMouseDown={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          className="pointer-events-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-bone-50 shadow-card-hover border border-ink/15 flex items-center justify-center cursor-ew-resize active:scale-95 transition-transform"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
            <path
              d="M7 5L3 10l4 5M13 5l4 5-4 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className="text-ink"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
