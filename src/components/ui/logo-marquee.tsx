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
 * Pause au survol, fondu sur les bords, désactivé si prefers-reduced-motion.
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
            className="flex h-24 w-44 shrink-0 items-center justify-center px-6"
            title={item.name}
            aria-hidden={i >= items.length ? true : undefined}
          >
            {item.logo ? (
              <Image
                src={item.logo}
                alt={item.name}
                width={200}
                height={96}
                className="max-h-16 w-auto max-w-[150px] object-contain opacity-80 transition-opacity hover:opacity-100"
              />
            ) : (
              <span className="font-display text-lg text-ink/70 text-center leading-tight">
                {item.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
