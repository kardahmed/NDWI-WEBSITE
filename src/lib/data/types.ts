export type Locale = 'fr' | 'ar';

export type LocalizedString = Record<Locale, string>;

export type DoorCategory = 'interieure' | 'blindee' | 'technique';

export type DoorFinish =
  | 'laque-mat'
  | 'laque-brillant'
  | 'placage-bois'
  | 'placage-noyer'
  | 'placage-chene'
  | 'stratifie'
  | 'vernis-naturel';

export type Thickness = '44mm' | '50mm' | '55mm' | '60mm' | '70mm';

/** Marque commerciale d'une porte. */
export type DoorBrand = 'ndwi' | 'ndo';

export interface DoorProduct {
  slug: string;
  name: string;
  serie: string;
  category: DoorCategory;
  /** Marque (NDWi = prod Algérie, NDO = import). Défaut 'ndwi' si non précisé. */
  brand?: DoorBrand;
  description: LocalizedString;
  shortDescription: LocalizedString;
  finishes: DoorFinish[];
  thicknesses: Thickness[];
  features: LocalizedString[];
  technicalSpecs?: {
    fireRating?: 'EI30' | 'EI60';
    acousticDb?: number;
    securityClass?: 'RC2' | 'RC3' | 'RC4';
  };
  heroImage?: string;
  /** URL résolue de l'image utilisée par le configurateur (fond transparent). */
  configuratorImageUrl?: string;
  /** Polygone CSS clip-path (en %) délimitant le panneau de la porte dans `heroImage`.
   * Permet à l'overlay de finition de ne teinter QUE le panneau, pas le décor. */
  panelClip?: string;
  gallery: string[];
  badges?: ('nouveau' | 'best-seller' | 'sur-mesure')[];
}

export interface HabitatCategory {
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  image: string;
  count?: number;
}
