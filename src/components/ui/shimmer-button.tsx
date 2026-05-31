import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Bouton ou lien avec animation shimmer copper qui passe lentement de
 * gauche à droite (toutes les 5 secondes par défaut). Signature visuelle
 * pour les CTAs prioritaires (Demander un devis, etc.).
 *
 * Repose sur ::before en CSS pour la performance — pas de JS, pas de re-render.
 * Animation contrôlée via --shimmer-duration custom property.
 *
 * Usage :
 *   <ShimmerButton href="/devis">Demander un devis</ShimmerButton>
 *   <ShimmerButton as="button" type="submit">Envoyer</ShimmerButton>
 */

type CommonProps = {
  className?: string;
  children: React.ReactNode;
  /** Durée d'un cycle de shimmer en secondes. Default 5. */
  shimmerDuration?: number;
};

type ShimmerButtonProps =
  | (CommonProps & { as?: 'a' } & AnchorHTMLAttributes<HTMLAnchorElement>)
  | (CommonProps & { as: 'button' } & ButtonHTMLAttributes<HTMLButtonElement>);

export const ShimmerButton = forwardRef<HTMLAnchorElement | HTMLButtonElement, ShimmerButtonProps>(
  function ShimmerButton({ as = 'a', className, children, shimmerDuration = 5, ...rest }, ref) {
    const styleVars = { ['--shimmer-duration' as string]: `${shimmerDuration}s` };
    const sharedClass = cn(
      'relative inline-flex items-center justify-center gap-2 overflow-hidden',
      'border border-ink bg-ink px-7 py-4 text-sm uppercase tracking-[0.14em] text-bone-50',
      'transition-colors duration-300 hover:bg-copper-500 hover:border-copper-500',
      // Shimmer pseudo-element
      'before:absolute before:inset-0 before:-translate-x-full',
      'before:bg-gradient-to-r before:from-transparent before:via-copper-400/40 before:to-transparent',
      'before:animate-[shimmer-btn_var(--shimmer-duration)_infinite]',
      'before:pointer-events-none',
      className
    );

    if (as === 'button') {
      const { as: _, ...buttonRest } = rest as { as?: unknown } & ButtonHTMLAttributes<HTMLButtonElement>;
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          className={sharedClass}
          style={styleVars}
          {...buttonRest}
        >
          <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
        </button>
      );
    }

    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={sharedClass}
        style={styleVars}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </a>
    );
  }
);
