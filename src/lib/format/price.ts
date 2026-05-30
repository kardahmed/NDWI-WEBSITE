/**
 * Formatage des prix en Dinars Algériens.
 *
 * Convention NDWi : tous les prix sont affichés "à partir de" car ils dépendent
 * de la configuration finale (revêtement, poignée, serrure, dimensions sur-mesure).
 */

import type { Locale } from '@/i18n/routing';

/** Sépare les milliers par un espace insécable, format FR. */
export function formatDZD(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(Math.round(amount));
}

/** Variante avec suffixe localisé : "1 250 000 DZD" / "1 250 000 د.ج". */
export function formatPriceLocalized(amount: number, locale: Locale): string {
  const formatted = formatDZD(amount);
  return locale === 'ar' ? `${formatted} د.ج` : `${formatted} DZD`;
}

/** "À partir de X DZD" / "ابتداءً من X د.ج". Renvoie null si pas de prix. */
export function formatPriceFrom(amount: number | undefined, locale: Locale): string | null {
  if (typeof amount !== 'number' || amount <= 0) return null;
  const price = formatPriceLocalized(amount, locale);
  return locale === 'ar' ? `ابتداءً من ${price}` : `À partir de ${price}`;
}

/** "Sur demande" / "السعر عند الطلب" — pour les produits sans prix public. */
export function priceOnRequestLabel(locale: Locale): string {
  return locale === 'ar' ? 'السعر عند الطلب' : 'Prix sur demande';
}
