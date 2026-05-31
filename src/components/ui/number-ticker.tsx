'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NumberTickerProps {
  /** Valeur cible. */
  value: number;
  /** Durée du count-up en ms. Default 1800. */
  duration?: number;
  /** Texte affiché avant le nombre (ex. "+"). */
  prefix?: string;
  /** Texte affiché après le nombre (ex. " ans", "+", "k"). */
  suffix?: string;
  /** Locale pour formatage milliers. Default 'fr-FR' (espace insécable). */
  locale?: string;
  /** Nombre de décimales. Default 0. */
  decimals?: number;
  /** Une fois lancé, ne refait pas l'animation (default true). */
  once?: boolean;
  className?: string;
}

/**
 * Compteur qui s'anime de 0 à `value` quand le composant entre dans le viewport.
 * Utilise IntersectionObserver via Framer Motion useInView, RequestAnimationFrame
 * pour fluidité, easing ease-out cubic.
 *
 * Exemples :
 *   <NumberTicker value={20} suffix=" ans" />
 *   <NumberTicker value={1200} suffix="+" />
 *   <NumberTicker value={35} suffix=" dB" />
 */
export function NumberTicker({
  value,
  duration = 1800,
  prefix = '',
  suffix = '',
  locale = 'fr-FR',
  decimals = 0,
  once = true,
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, margin: '-80px' });
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!isInView || (once && started.current)) return;
    started.current = true;

    const startTime = performance.now();
    const startValue = 0;
    const delta = value - startValue;

    let rafId = 0;
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(startValue + delta * eased);
      if (t < 1) rafId = requestAnimationFrame(animate);
      else setDisplay(value);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, value, duration, once]);

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(display);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
