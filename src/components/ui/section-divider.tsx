import { cn } from '@/lib/utils';

/**
 * Diviseurs visuels élégants entre 2 sections.
 *
 * À utiliser entre deux <section> au lieu d'un border-y nu, pour ajouter
 * du rythme + une identité visuelle. 4 variantes :
 *
 * - line       : ligne ultra-fine au centre, espacée (luxe minimal)
 * - ornement   : ligne + étoile zellige copper centrée (signature algérienne)
 * - wave       : vague SVG très douce (transitions plus organiques)
 * - curve      : courbe ascendante (utile entre sections dark/light)
 */

interface SectionDividerProps {
  variant?: 'line' | 'ornement' | 'wave' | 'curve';
  /** Couleur du fond à respecter pour les SVG (wave/curve). Défaut bone-50. */
  fillTopColor?: string;
  fillBottomColor?: string;
  className?: string;
}

export function SectionDivider({
  variant = 'ornement',
  fillTopColor = '#FAF8F5',
  fillBottomColor = '#F5F2EE',
  className,
}: SectionDividerProps) {
  if (variant === 'line') {
    return (
      <div className={cn('container-page py-6', className)}>
        <hr className="border-0 h-px bg-gradient-to-r from-transparent via-ink/15 to-transparent" />
      </div>
    );
  }

  if (variant === 'ornement') {
    return (
      <div className={cn('container-page py-8 flex items-center justify-center gap-4', className)}>
        <span className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-ink/15" />
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          aria-hidden
          className="flex-shrink-0 text-copper-500/60"
        >
          {/* Étoile zellige 8 branches */}
          <path
            fill="currentColor"
            d="M10 0l2.89 7.11L20 10l-7.11 2.89L10 20l-2.89-7.11L0 10l7.11-2.89z"
          />
        </svg>
        <span className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-ink/15" />
      </div>
    );
  }

  if (variant === 'wave') {
    return (
      <div
        className={cn('relative w-full h-12 overflow-hidden', className)}
        style={{ backgroundColor: fillTopColor }}
        aria-hidden
      >
        <svg
          className="absolute inset-x-0 bottom-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1200 60"
          fill={fillBottomColor}
        >
          <path d="M0,30 C300,60 600,0 900,30 C1050,45 1100,30 1200,30 L1200,60 L0,60 Z" />
        </svg>
      </div>
    );
  }

  // curve
  return (
    <div
      className={cn('relative w-full h-16 overflow-hidden', className)}
      style={{ backgroundColor: fillTopColor }}
      aria-hidden
    >
      <svg
        className="absolute inset-x-0 bottom-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1200 80"
        fill={fillBottomColor}
      >
        <path d="M0,80 L0,40 Q600,0 1200,40 L1200,80 Z" />
      </svg>
    </div>
  );
}
