'use client';

import Image from 'next/image';
import { Minus, Plus, X } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { CartItem } from '@/lib/cart/types';
import { useCart } from '@/lib/cart/cart-context';
import { cn } from '@/lib/utils';

interface Props {
  item: CartItem;
  /** Si fourni, exécuté au clic sur le lien produit (fermer le drawer p.ex.). */
  onNavigate?: () => void;
}

const sensLabels: Record<NonNullable<CartItem['configuration']>['sensOuverture'] & string, { fr: string; ar: string }> = {
  gauche: { fr: 'Gauche', ar: 'يسار' },
  droite: { fr: 'Droite', ar: 'يمين' },
  'va-et-vient': { fr: 'Va-et-vient', ar: 'ذهاب وإياب' },
  coulissant: { fr: 'Coulissant', ar: 'منزلق' },
};

export function CartItemRow({ item, onNavigate }: Props) {
  const locale = useLocale() as 'fr' | 'ar';
  const { updateQuantity, removeItem, updateNotes } = useCart();
  const cfg = item.configuration;

  return (
    <article className="grid grid-cols-[80px_1fr_auto] gap-4 border-b border-ink/10 py-5 last:border-b-0">
      {/* Vignette */}
      <Link
        href={item.productHref}
        onClick={onNavigate}
        className="relative aspect-square overflow-hidden bg-gradient-to-br from-bone-200 to-bone-100"
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.productName}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-center font-display text-[11px] leading-tight text-ink/40 px-1">
            {item.productName}
          </div>
        )}
      </Link>

      {/* Bloc texte */}
      <div className="min-w-0">
        <div className="flex items-start gap-2">
          {item.brand && (
            <span
              className={cn(
                'flex-shrink-0 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] font-medium',
                item.brand === 'ndwi' ? 'bg-copper-500 text-bone-50' : 'bg-ink text-bone-50'
              )}
            >
              {item.brand === 'ndwi' ? 'NDWi' : 'NDO'}
            </span>
          )}
          <Link
            href={item.productHref}
            onClick={onNavigate}
            className="font-display text-base text-ink hover:text-copper-500 transition-colors truncate"
          >
            {item.productName}
          </Link>
        </div>

        {/* Détails config / variante */}
        <dl className="mt-1.5 space-y-0.5 text-[11px] text-ink/55 leading-snug">
          {cfg?.revetement && (
            <Detail label={locale === 'ar' ? 'الكسوة' : 'Revêtement'} value={cfg.revetement.label} />
          )}
          {cfg?.poignee && (
            <Detail label={locale === 'ar' ? 'المقبض' : 'Poignée'} value={cfg.poignee.label} />
          )}
          {cfg?.sensOuverture && (
            <Detail
              label={locale === 'ar' ? 'الفتح' : 'Sens'}
              value={sensLabels[cfg.sensOuverture][locale]}
            />
          )}
          {cfg?.dimensions && (
            <Detail
              label={locale === 'ar' ? 'الأبعاد' : 'Dimensions'}
              value={`${cfg.dimensions.largeur} × ${cfg.dimensions.hauteur} ${cfg.dimensions.unit}`}
            />
          )}
          {cfg?.accessoires && cfg.accessoires.length > 0 && (
            <Detail
              label={locale === 'ar' ? 'إكسسوارات' : 'Accessoires'}
              value={cfg.accessoires.map((a) => a.label).join(', ')}
            />
          )}
          {item.variant && (
            <Detail
              label={locale === 'ar' ? 'الخيار' : 'Variante'}
              value={item.variant.label}
            />
          )}
        </dl>

        {/* Quantité */}
        <div className="mt-3 inline-flex items-center border border-ink/20">
          <button
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label={locale === 'ar' ? 'إنقاص' : 'Diminuer'}
            className="h-7 w-7 flex items-center justify-center text-ink/60 hover:text-ink hover:bg-bone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Minus size={12} />
          </button>
          <span className="w-8 text-center text-xs font-medium tabular-nums">{item.quantity}</span>
          <button
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            aria-label={locale === 'ar' ? 'زيادة' : 'Augmenter'}
            className="h-7 w-7 flex items-center justify-center text-ink/60 hover:text-ink hover:bg-bone-100 transition-colors"
          >
            <Plus size={12} />
          </button>
        </div>

        {/* Notes facultatives */}
        <details className="mt-2 group">
          <summary className="text-[10px] uppercase tracking-[0.14em] text-ink/40 cursor-pointer hover:text-ink/70 list-none group-open:text-ink/70">
            {item.notes
              ? (locale === 'ar' ? 'الملاحظات' : 'Notes')
              : (locale === 'ar' ? '+ إضافة ملاحظة' : '+ Ajouter une note')}
          </summary>
          <textarea
            rows={2}
            defaultValue={item.notes ?? ''}
            onBlur={(e) => updateNotes(item.id, e.target.value.trim())}
            placeholder={locale === 'ar' ? 'تفاصيل أو متطلبات خاصة…' : 'Détails ou exigences spécifiques…'}
            className="mt-1.5 w-full bg-transparent border border-ink/20 px-2 py-1.5 text-[11px] text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink/50 resize-none"
          />
        </details>
      </div>

      {/* Bouton suppression */}
      <button
        type="button"
        onClick={() => removeItem(item.id)}
        aria-label={locale === 'ar' ? 'إزالة' : 'Retirer'}
        className="self-start h-7 w-7 flex items-center justify-center text-ink/35 hover:text-red-600 transition-colors"
      >
        <X size={14} />
      </button>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1.5">
      <dt className="text-ink/40">{label} :</dt>
      <dd className="text-ink/70 truncate">{value}</dd>
    </div>
  );
}
