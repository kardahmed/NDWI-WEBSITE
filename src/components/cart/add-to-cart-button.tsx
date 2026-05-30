'use client';

import { useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useCart } from '@/lib/cart/cart-context';
import type { AddCartItemPayload } from '@/lib/cart/types';
import { cn } from '@/lib/utils';

interface Props {
  /** Tout sauf id/addedAt (calculés par le store). */
  payload: AddCartItemPayload;
  /** "primary" (style btn-primary copper plein) ou "secondary" (style btn-secondary outline). */
  variant?: 'primary' | 'secondary';
  className?: string;
  /** Label personnalisé. Sinon : "Ajouter au devis" / "Ajouté ✓". */
  label?: string;
  /** Si true, ouvre le drawer après ajout. Default false. */
  openOnAdd?: boolean;
}

/**
 * Bouton "Ajouter au devis" : ajoute l'item au panier (avec sa config NDWi ou
 * sa variante NDO), montre brièvement un état "Ajouté ✓" puis revient.
 */
export function AddToCartButton({
  payload,
  variant = 'secondary',
  className,
  label,
  openOnAdd = false,
}: Props) {
  const { addItem, openDrawer } = useCart();
  const locale = useLocale() as 'fr' | 'ar';
  const [added, setAdded] = useState(false);

  const baseLabel = label ?? (locale === 'ar' ? 'إضافة إلى السلة' : 'Ajouter au devis');
  const doneLabel = locale === 'ar' ? 'تمت الإضافة' : 'Ajouté';

  const handleClick = () => {
    addItem(payload);
    setAdded(true);
    if (openOnAdd) openDrawer();
    window.setTimeout(() => setAdded(false), 1800);
  };

  const baseCls =
    variant === 'primary'
      ? 'btn-primary !bg-copper-500 !border-copper-500 hover:!bg-copper-600 hover:!border-copper-600'
      : 'btn-secondary';

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(baseCls, 'inline-flex items-center justify-center gap-2', className)}
      aria-live="polite"
    >
      {added ? <Check size={16} /> : <ShoppingBag size={16} />}
      {added ? doneLabel : baseLabel}
    </button>
  );
}
