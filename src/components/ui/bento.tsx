import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Système Bento Grid — layout asymétrique Apple/Linear style.
 *
 * Utilise CSS Grid avec col-span/row-span variables. Le composant BentoCard
 * accepte un prop `size` qui mappe vers les bons spans.
 *
 *   <BentoGrid>
 *     <BentoCard size="lg">Hero card grosse</BentoCard>
 *     <BentoCard size="md">Card moyenne</BentoCard>
 *     <BentoCard size="md">Card moyenne</BentoCard>
 *     <BentoCard size="sm">Petite</BentoCard>
 *     <BentoCard size="sm">Petite</BentoCard>
 *     <BentoCard size="sm">Petite</BentoCard>
 *   </BentoGrid>
 *
 * Sur mobile, tout passe en colonne unique. Sur lg, layout 4-col avec
 * spans variables. Gap fin (1px ink/10) pour effet "carrelage premium".
 */

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid gap-px bg-ink/10 border border-ink/10',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        'auto-rows-[minmax(180px,auto)] lg:auto-rows-[minmax(220px,auto)]',
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  children: ReactNode;
  /** Taille de la card dans la grille.
   *  - lg : 2×2 (4 cellules)
   *  - md : 2×1 (2 cellules en largeur)
   *  - tall : 1×2 (2 cellules en hauteur)
   *  - sm : 1×1 (1 cellule, default)
   *  - wide : full width sur lg (4×1)
   */
  size?: 'lg' | 'md' | 'tall' | 'sm' | 'wide';
  /** Couleur de fond. Default bone-50. */
  bg?: string;
  /** Padding. Default p-6 lg:p-8. */
  padding?: string;
  /** Comportement interactif (cursor pointer + hover effect). */
  interactive?: boolean;
  className?: string;
}

const sizeClasses: Record<NonNullable<BentoCardProps['size']>, string> = {
  lg: 'lg:col-span-2 lg:row-span-2',
  md: 'lg:col-span-2 lg:row-span-1',
  tall: 'lg:col-span-1 lg:row-span-2',
  sm: 'lg:col-span-1 lg:row-span-1',
  wide: 'lg:col-span-4 lg:row-span-1',
};

export function BentoCard({
  children,
  size = 'sm',
  bg = 'bg-bone-50',
  padding = 'p-6 lg:p-8',
  interactive = false,
  className,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden transition-all duration-500 ease-out-soft',
        bg,
        padding,
        sizeClasses[size],
        interactive && 'cursor-pointer hover:bg-bone-100 group',
        className
      )}
    >
      {children}
    </div>
  );
}
