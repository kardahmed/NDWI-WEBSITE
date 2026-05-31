import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface MarqueeItem {
  name: string;
  logo?: string;
}

interface LogoMarqueeProps {
  items: MarqueeItem[];
  /** Sens de défilement. */
  direction?: 'ltr' | 'rtl';
  /** Durée d'un cycle complet (plus grand = plus lent). */
  durationSec?: number;
  className?: string;
}

/**
 * Bande de logos défilant horizontalement en continu (boucle infinie CSS).
 * Le contenu est dupliqué pour un défilement sans couture.
 *
 * Améliorations Phase Design :
 *   - Items plus aérés (w-48 + flex-shrink-0 + padding interne uniforme)
 *   - Hauteur image stricte 56 px pour cohérence visuelle
 *   - Hover : opacity 100% + scale 1.05 spring
 *   - Fondu sur 16% de chaque côté (via globals.css marquee-mask) →
 *     les logos en bord se dissolvent au lieu d'être coupés
 *   - Pause au survol, désactivé prefers-reduced-motion
 */
export function LogoMarquee({ items, direction = 'ltr', durationSec = 42, className }: LogoMarqueeProps) {
  if (items.length === 0) return null;
  // Duplication pour la boucle (le track fait 200% de large, anime sur -50%).
  const loop = [...items, ...items];

  return (
    <div className={cn('marquee-mask overflow-hidden', className)}>
      <div
        className={cn('marquee-track', direction === 'rtl' ? 'marquee-rtl' : 'marquee-ltr')}
        style={{ ['--marquee-duration' as string]: `${durationSec}s` }}
      >
        {loop.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            className="group flex h-20 w-48 shrink-0 items-center justify-center px-4 lg:px-6"
            title={item.name}
            aria-hidden={i >= items.length ? true : undefined}
          >
            {item.logo ? (
              <Image
                src={item.logo}
                alt={item.name}
                width={200}
                height={88}
                className="max-h-14 w-auto max-w-[140px] object-contain opacity-70 transition-all duration-500 ease-out-soft group-hover:opacity-100 group-hover:scale-105"
              />
            ) : (
              <span className="font-display text-base text-ink/60 text-center leading-tight transition-colors duration-300 group-hover:text-ink">
                {item.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
