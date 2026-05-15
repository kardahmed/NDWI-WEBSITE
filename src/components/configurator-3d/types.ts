// Types partagés pour le configurateur 3D paramétrique.
// La porte est composée de meshes nommés : Door_Main, Frame, Handle, Glass, Lock, Hinges.
//
// Les COULEURS et TEXTURES sont gérées dans Sanity (schema "finition") — pas hardcodées.

export type FinishSlug = 'mat' | 'satine' | 'brillant';
export type MaterialSlug = 'bois' | 'laque' | 'metal' | 'verre';
export type HandleSlug = 'moderne' | 'luxe' | 'minimaliste' | 'classique';
export type OpeningSide = 'gauche' | 'droite';
export type OpeningDirection = 'interieur' | 'exterieur';

export interface HandleVariant {
  slug: HandleSlug;
  name: string;
  nameAr: string;
  /** Surcoût €DZ par rapport au handle "moderne" (référence à 0). */
  priceDelta: number;
}

export const handleVariants: HandleVariant[] = [
  { slug: 'moderne', name: 'Moderne', nameAr: 'عصري', priceDelta: 0 },
  { slug: 'luxe', name: 'Luxe', nameAr: 'فاخر', priceDelta: 8000 },
  { slug: 'minimaliste', name: 'Minimaliste', nameAr: 'بسيط', priceDelta: 3000 },
  { slug: 'classique', name: 'Classique', nameAr: 'كلاسيكي', priceDelta: 1500 },
];

export interface DoorConfig3D {
  /** Slug de la finition Sanity sélectionnée (vide tant que pas chargé). */
  finitionSlug: string;
  /** Hex appliqué — vient de la finition Sanity ou choix custom. */
  colorHex: string;
  /** URL de la texture bois (Sanity) à appliquer comme map sur le panneau. Vide = couleur unie. */
  textureUrl?: string;
  material: MaterialSlug;
  finish: FinishSlug;
  handle: HandleSlug;
  /** Côté charnière : la poignée est à l'opposé. */
  hingeSide: OpeningSide;
  /** Sens de poussée. */
  openingDirection: OpeningDirection;
  hasGlass: boolean;
  hasLock: boolean;
  /** Dimensions en cm. */
  widthCm: number;
  heightCm: number;
  /** État animation 0 = fermée, 1 = pleinement ouverte. */
  openAmount: number;
}

export const defaultDoorConfig: DoorConfig3D = {
  finitionSlug: '',
  colorHex: '#c69c6d',
  textureUrl: undefined,
  material: 'bois',
  finish: 'satine',
  handle: 'moderne',
  hingeSide: 'gauche',
  openingDirection: 'interieur',
  hasGlass: false,
  hasLock: true,
  widthCm: 90,
  heightCm: 205,
  openAmount: 0,
};

/** Coefficients pour le mapping finish → roughness PBR. */
export const finishRoughness: Record<FinishSlug, number> = {
  mat: 0.85,
  satine: 0.45,
  brillant: 0.08,
};

/** Prix de base de la porte (DA). */
export const BASE_PRICE_DA = 65000;

/** Calcul du prix selon la configuration. */
export function computePrice(config: DoorConfig3D): number {
  let price = BASE_PRICE_DA;

  // Surcoût matériau
  if (config.material === 'bois') price += 12000;
  if (config.material === 'metal') price += 18000;

  // Surcoût finition
  if (config.finish === 'brillant') price += 4500;
  if (config.finish === 'satine') price += 2000;

  // Surcoût poignée
  const h = handleVariants.find((h) => h.slug === config.handle);
  if (h) price += h.priceDelta;

  // Surcoût dimensions hors standard
  const stdArea = 90 * 205; // cm²
  const area = config.widthCm * config.heightCm;
  if (area > stdArea) price += Math.round(((area - stdArea) / stdArea) * 15000);

  // Options
  if (config.hasGlass) price += 9000;
  if (config.hasLock) price += 3500;

  return price;
}

export function formatPrice(da: number): string {
  return new Intl.NumberFormat('fr-DZ').format(da) + ' DA';
}

// ───────── Estimation de stock + délai de livraison ─────────

export type StockStatus = 'in-stock' | 'on-order' | 'long-lead';

export interface LeadEstimate {
  weeksMin: number;
  weeksMax: number;
  stock: StockStatus;
}

/** Heuristique basée sur les choix : dimensions hors standard / vitrage / finition premium → délai allongé. */
export function computeLeadEstimate(config: DoorConfig3D): LeadEstimate {
  let min = 2;
  let max = 3;
  let stock: StockStatus = 'in-stock';

  // Dimensions custom hors standard 90×205
  const isCustomDim =
    Math.abs(config.widthCm - 90) > 2 || Math.abs(config.heightCm - 205) > 2;
  if (isCustomDim) {
    min += 1;
    max += 1;
    stock = 'on-order';
  }

  // Vitrage
  if (config.hasGlass) {
    min += 1;
    max += 1;
  }

  // Finition brillante (laquage complexe)
  if (config.finish === 'brillant') {
    min += 1;
    max += 1;
    stock = 'on-order';
  }

  // Métal = très long
  if (config.material === 'metal') {
    min += 2;
    max += 2;
    stock = 'long-lead';
  }

  // Pas de finition Sanity reconnue = couleur custom → forcément sur commande
  if (!config.finitionSlug) {
    stock = 'on-order';
  }

  return { weeksMin: min, weeksMax: max, stock };
}
