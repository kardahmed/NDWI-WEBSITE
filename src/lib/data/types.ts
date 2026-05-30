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
  /** Variantes couleur (NDO surtout) — pastilles type Apple qui swap le visuel hero.
   *  Vide ou undefined = pas de pastilles. À renseigner dans Sanity quand les visuels arriveront. */
  colorVariants?: Array<{
    /** Identifiant stable (slug) */
    slug: string;
    /** Libellé localisé affiché au survol / dans le DOM */
    name: LocalizedString;
    /** URL absolue de l'image hero pour cette variante */
    image: string;
    /** Code hex de la pastille (#RRGGBB). Optionnel — sinon on dérive de l'image. */
    hex?: string;
  }>;
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
