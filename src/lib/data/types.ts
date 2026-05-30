export type Locale = 'fr' | 'ar';

export type LocalizedString = Record<Locale, string>;

/** 2 catégories nettes côté offre :
 *  - 'interieur' : porte intérieure (chambre, couloir, blindée d'appartement, palière d'hôtel…)
 *  - 'entree'    : porte d'entrée principale (logement, villa, local)
 *  Les anciennes valeurs 'interieure' / 'blindee' / 'technique' sont mappées
 *  vers 'interieur' dans l'adapter Sanity pour rétro-compat. */
export type DoorCategory = 'interieur' | 'entree';

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
    /** Épaisseur exacte du panneau (ex. "36 mm", "43 mm"). Diffère de
     *  `thicknesses[]` qui peut lister plusieurs options. */
    thicknessExact?: string;
  };
  /** Composition / structure du panneau (texte libre, déjà localisé). */
  composition?: LocalizedString;
  /** Certifications visibles sur la fiche (texte court). */
  certifications?: LocalizedString[];
  /** Configurateur — listes de slugs compatibles. Vide = pas configurable. */
  compatibleRevetements?: string[];
  compatiblePoignees?: string[];
  compatibleSerrures?: string[];
  compatibleVitrages?: string[];
  compatibleRemplissages?: string[];
  /** Sens d'ouverture proposés pour ce modèle. */
  compatibleSens?: Array<'gauche' | 'droite' | 'va-et-vient' | 'coulissant'>;
  /** Bornes dimensions sur-mesure (en cm). */
  dimensionsRange?: {
    largeurMin: number;
    largeurMax: number;
    hauteurMin: number;
    hauteurMax: number;
  };
  /** Prix public indicatif "à partir de" en Dinars Algériens.
   *  Pour les NDWi configurables, c'est le prix de base — les options ajoutent
   *  au tarif final. Pour les NDO, peut rester undefined → "Sur demande". */
  priceFromDZD?: number;
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
