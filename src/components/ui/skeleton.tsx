import { cn } from '@/lib/utils';

/**
 * Skeleton loader brandé — fond bone-200 avec pulse subtil.
 *
 * Utiliser pour les états de chargement async :
 *   - cards en attente de fetch Sanity
 *   - photos avant load
 *   - listes en attente
 *
 * Exemples :
 *   <Skeleton className="h-6 w-32" />
 *   <Skeleton className="aspect-square w-full" />
 *   <SkeletonText lines={3} />
 */

interface SkeletonProps {
  className?: string;
  /** Variante d'animation. 'pulse' (default) ou 'shimmer'. */
  variant?: 'pulse' | 'shimmer';
}

export function Skeleton({ className, variant = 'pulse' }: SkeletonProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label="Chargement"
      className={cn(
        'block bg-bone-200',
        variant === 'pulse' && 'animate-pulse',
        variant === 'shimmer' &&
          'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:animate-[shimmer_1.5s_infinite]',
        className
      )}
    />
  );
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

/** Bloc de N lignes de texte placeholder, derniere ligne plus courte. */
export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  );
}

/** Skeleton card produit — pour grilles en attente de fetch. */
export function SkeletonProductCard() {
  return (
    <div className="border border-ink/10 bg-bone-50">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-7 w-32" />
        <SkeletonText lines={2} />
      </div>
    </div>
  );
}
