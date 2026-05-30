/**
 * Types du panier devis.
 *
 * Le panier accepte plusieurs produits hétérogènes (portes NDWi configurées,
 * cuisines NDO, dressings, etc.) que le client envoie en une seule demande
 * de devis. Persisté en localStorage côté client uniquement.
 */

import type { DoorBrand } from '@/lib/data/types';

/** Catégorie produit utilisée pour grouper visuellement et router le lead. */
export type CartProductType =
  | 'porte'
  | 'cuisine'
  | 'chambre'
  | 'dressing'
  | 'bureau'
  | 'salon'
  | 'hotellerie'
  | 'autre';

/** Configuration d'une porte NDWi : tout est optionnel — on garde ce que le
 *  client a déjà choisi quand il ajoute au panier depuis le configurateur. */
export interface CartItemConfiguration {
  revetement?: { slug: string; label: string };
  poignee?: { slug: string; label: string };
  sensOuverture?: 'gauche' | 'droite' | 'va-et-vient' | 'coulissant';
  dimensions?: {
    largeur: number;
    hauteur: number;
    unit: 'cm' | 'mm';
  };
  accessoires?: Array<{ slug: string; label: string }>;
}

/** Variante NDO (par ex. une couleur de cuisine). */
export interface CartItemVariant {
  slug: string;
  /** Label affiché (déjà localisé). */
  label: string;
}

export interface CartItem {
  /** Identifiant unique de la ligne (généré au moment de l'ajout). */
  id: string;
  productType: CartProductType;
  productSlug: string;
  /** Nom affiché tel quel, déjà localisé au moment de l'ajout. */
  productName: string;
  brand?: DoorBrand;
  /** URL absolue de l'image hero/variant (peut être vide → placeholder typographique côté UI). */
  image?: string;
  /** Lien vers la fiche produit (utile pour revenir modifier). */
  productHref: string;
  quantity: number;
  /** Configuration NDWi si applicable. */
  configuration?: CartItemConfiguration;
  /** Variante NDO si applicable. */
  variant?: CartItemVariant;
  /** Notes libres du client sur cette ligne. */
  notes?: string;
  /** Prix unitaire indicatif "à partir de" en DZD (snapshot au moment de l'ajout).
   *  Undefined = "prix sur demande". */
  priceFromDZD?: number;
  /** Timestamp d'ajout (pour tri / debug). */
  addedAt: number;
}

/** État du panier persisté. Le `version` permet de migrer le schéma plus tard. */
export interface CartState {
  version: 1;
  items: CartItem[];
  /** True quand on a chargé l'état depuis localStorage (utile pour éviter le mismatch d'hydratation). */
  hydrated: boolean;
}

/** Payload d'ajout : on omet ce que le store calcule (id, addedAt). */
export type AddCartItemPayload = Omit<CartItem, 'id' | 'addedAt'>;

export type CartAction =
  | { type: 'HYDRATE'; payload: CartItem[] }
  | { type: 'ADD'; payload: CartItem }
  | { type: 'UPDATE_QUANTITY'; id: string; quantity: number }
  | { type: 'UPDATE_NOTES'; id: string; notes: string }
  | { type: 'REMOVE'; id: string }
  | { type: 'CLEAR' };
