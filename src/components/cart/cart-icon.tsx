'use client';

import { ShoppingBag } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useCart } from '@/lib/cart/cart-context';
import { cn } from '@/lib/utils';

interface CartIconProps {
  /** Variante d'affichage : "icon" (juste l'icône, header desktop) ou "row" (icône + label, menu mobile). */
  variant?: 'icon' | 'row';
  className?: string;
}

/**
 * Bouton panier : icône + badge count.
 * - Ne montre le badge qu'après hydratation côté client (anti mismatch SSR).
 * - Au clic : ouvre le drawer panier (état dans CartContext).
 */
export function CartIcon({ variant = 'icon', className }: CartIconProps) {
  const { count, hydrated, openDrawer } = useCart();
  const locale = useLocale();
  const label = locale === 'ar' ? 'سلة طلب التسعير' : 'Panier devis';

  if (variant === 'row') {
    return (
      <button
        type="button"
        onClick={openDrawer}
        aria-label={label}
        className={cn(
          'flex items-center justify-between gap-3 text-base text-ink/80 hover:text-copper-500',
          className
        )}
      >
        <span className="flex items-center gap-3">
          <ShoppingBag size={18} strokeWidth={1.8} />
          {label}
        </span>
        {hydrated && count > 0 && (
          <span className="bg-copper-500 text-bone-50 text-[10px] font-medium px-2 py-0.5 min-w-[20px] text-center">
            {count}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={label}
      title={label}
      className={cn(
        'relative inline-flex h-9 w-9 items-center justify-center text-ink/70 hover:text-copper-500 transition-colors',
        className
      )}
    >
      <ShoppingBag size={20} strokeWidth={1.8} />
      {hydrated && count > 0 && (
        <span
          className="absolute -top-1 -end-1 min-w-[18px] h-[18px] px-1 bg-copper-500 text-bone-50 text-[10px] font-medium flex items-center justify-center rounded-full"
          aria-hidden
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}
