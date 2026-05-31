import type { LocalizedString } from './types';

/**
 * Nuancier visuel des finitions NDWi PORTE (catalogue) — partenariat PAIL Italie.
 * Référence des codes PAIL officiels : `revetements` dans door-options.ts (source de vérité,
 * utilisée par le configurateur). On n'attribue PAS ici de code PAIL déjà porté par un
 * revêtement, pour éviter qu'un même code désigne deux finitions différentes.
 */

export type FinishCategory = 'frene' | 'laque' | 'rovere' | 'bois' | 'pelle' | 'metal' | 'shiny' | 'special';

export interface Finish {
  /** Slug technique pour URL et code base de données */
  slug: string;
  /** Code PAIL officiel (ex. 0118, 8765, 6312) si applicable */
  code?: string;
  /** Nom localisé */
  name: LocalizedString;
  /** Catégorie pour regroupement UI */
  category: FinishCategory;
  /** Couleur de représentation CSS (approximation, à remplacer par photo HD plus tard) */
  cssColor: string;
  /** Opacité de l'overlay teinte multiplyé sur photo réelle bois clair (0-1) */
  overlayOpacity: number;
  /** Description courte */
  description?: LocalizedString;
}

export const finishes: Finish[] = [
  // ───────── Frêne / Chêne / Bois naturels ─────────
  {
    slug: 'blanc-frene',
    name: { fr: 'Blanc Frêne', ar: 'دردار أبيض' },
    category: 'frene',
    cssColor: '#EEE8DA',
    overlayOpacity: 0,
  },
  {
    slug: 'frene-delave',
    name: { fr: 'Frêne Délavé', ar: 'دردار باهت' },
    category: 'frene',
    cssColor: '#D8CFC0',
    overlayOpacity: 0.08,
  },
  {
    slug: 'chene-delave',
    name: { fr: 'Chêne Délavé', ar: 'سنديان باهت' },
    category: 'frene',
    cssColor: '#B5A992',
    overlayOpacity: 0.15,
  },
  {
    slug: 'noyer-doux',
    name: { fr: 'Noyer Doux', ar: 'جوز ناعم' },
    category: 'bois',
    cssColor: '#6B4226',
    overlayOpacity: 0.55,
  },
  {
    slug: 'wenge-authentique',
    code: '8046',
    name: { fr: 'Wengé Authentique', ar: 'ونجي أصيل' },
    category: 'bois',
    cssColor: '#3A2A1E',
    overlayOpacity: 0.78,
  },

  // ───────── Laqués ─────────
  {
    slug: 'laccato-bianco',
    name: { fr: 'Laccato Bianco', ar: 'مطلي أبيض' },
    category: 'laque',
    cssColor: '#FFFFFF',
    overlayOpacity: 0.05,
  },
  {
    slug: 'laccato-ral-9001',
    code: 'RAL9001',
    name: { fr: 'Laccato RAL 9001', ar: 'مطلي RAL 9001' },
    category: 'laque',
    cssColor: '#F2EAD3',
    overlayOpacity: 0.08,
  },
  {
    slug: 'laccato-bianco-spazzolato',
    name: { fr: 'Laccato Bianco Spazzolato', ar: 'مطلي أبيض مفروش' },
    category: 'laque',
    cssColor: '#EBE3D2',
    overlayOpacity: 0.08,
  },
  {
    slug: 'laccato-bianco-grafato',
    name: { fr: 'Laccato Bianco Grafato', ar: 'مطلي أبيض محبب' },
    category: 'laque',
    cssColor: '#E8E0CE',
    overlayOpacity: 0.08,
  },
  {
    slug: 'laccato-bianco-poro-aperto',
    name: { fr: 'Laccato Bianco Poro Aperto', ar: 'مطلي أبيض مسامي' },
    category: 'laque',
    cssColor: '#EDE5D6',
    overlayOpacity: 0.1,
  },

  // ───────── Rovere (chêne italien) ─────────
  {
    slug: 'rovere-bianco-cera',
    name: { fr: 'Rovere Bianco Cera', ar: 'سنديان أبيض شمعي' },
    category: 'rovere',
    cssColor: '#E1D4B7',
    overlayOpacity: 0.1,
  },
  {
    slug: 'rovere-tortora-cera',
    name: { fr: 'Rovere Tortora Cera', ar: 'سنديان بُنّي مائل للرمادي' },
    category: 'rovere',
    cssColor: '#998877',
    overlayOpacity: 0.35,
  },
  {
    slug: 'rovere-castagno-cera',
    name: { fr: 'Rovere Castagno Cera', ar: 'سنديان كستنائي' },
    category: 'rovere',
    cssColor: '#8B5A3C',
    overlayOpacity: 0.42,
  },
  {
    slug: 'rovere-tabacco-cera',
    name: { fr: 'Rovere Tabacco Cera', ar: 'سنديان بلون التبغ' },
    category: 'rovere',
    cssColor: '#6E4D2E',
    overlayOpacity: 0.5,
  },
  {
    slug: 'rovere-fume-cera',
    name: { fr: 'Rovere Fumé Cera', ar: 'سنديان مدخّن' },
    category: 'rovere',
    cssColor: '#4A3C2D',
    overlayOpacity: 0.62,
  },
  {
    slug: 'rovere-moro-cera',
    name: { fr: 'Rovere Moro Cera', ar: 'سنديان داكن' },
    category: 'rovere',
    cssColor: '#3A2A1F',
    overlayOpacity: 0.75,
  },
  {
    slug: 'rovere-cacao-cera',
    name: { fr: 'Rovere Cacao Cera', ar: 'سنديان كاكاو' },
    category: 'rovere',
    cssColor: '#5C3A1F',
    overlayOpacity: 0.6,
  },
  {
    slug: 'rovere',
    name: { fr: 'Rovere Naturel', ar: 'سنديان طبيعي' },
    category: 'rovere',
    cssColor: '#C9A66B',
    overlayOpacity: 0.25,
  },

  // ───────── Bois nobles ─────────
  {
    slug: 'noce-nazionale',
    name: { fr: 'Noce Nazionale', ar: 'جوز وطني' },
    category: 'bois',
    cssColor: '#5E3520',
    overlayOpacity: 0.6,
  },
  {
    slug: 'wenge',
    name: { fr: 'Wengé', ar: 'ونجي' },
    category: 'bois',
    cssColor: '#2E1F18',
    overlayOpacity: 0.82,
  },
  {
    slug: 'ciliegio',
    name: { fr: 'Ciliegio (Cerisier)', ar: 'كرز' },
    category: 'bois',
    cssColor: '#A0522D',
    overlayOpacity: 0.45,
  },
  {
    slug: 'multinoce',
    name: { fr: 'Multinoce', ar: 'متعدد الجوز' },
    category: 'bois',
    cssColor: '#7A4E2C',
    overlayOpacity: 0.5,
  },
  {
    slug: 'multicanaletto',
    name: { fr: 'Multicanaletto', ar: 'مولتيكاناليتو' },
    category: 'bois',
    cssColor: '#4F2F1E',
    overlayOpacity: 0.7,
  },

  // ───────── Pelle (effet cuir) ─────────
  {
    slug: 'pelle-beige',
    name: { fr: 'Pelle Beige', ar: 'جلد بيج' },
    category: 'pelle',
    cssColor: '#C9B492',
    overlayOpacity: 0.2,
  },
  {
    slug: 'pelle-marrone',
    name: { fr: 'Pelle Marrone', ar: 'جلد بني' },
    category: 'pelle',
    cssColor: '#7A4F3A',
    overlayOpacity: 0.55,
  },
  {
    slug: 'pelle-rossa',
    name: { fr: 'Pelle Rossa', ar: 'جلد أحمر' },
    category: 'pelle',
    cssColor: '#8C2F2F',
    overlayOpacity: 0.5,
  },

  // ───────── Métal ─────────
  {
    slug: 'bordo-inox-bond',
    name: { fr: 'Bordo Inox Bond', ar: 'حافة فولاذية' },
    category: 'metal',
    cssColor: '#C8C8CA',
    overlayOpacity: 0.2,
  },
  {
    slug: 'bordo-tungsteno',
    name: { fr: 'Bordo Tungsteno', ar: 'حافة تنغستن' },
    category: 'metal',
    cssColor: '#4A4A4A',
    overlayOpacity: 0.65,
  },

  // ───────── Spéciaux Leguan ─────────
  {
    slug: 'leguan-nero',
    name: { fr: 'Leguan Nero', ar: 'ليغوان أسود' },
    category: 'special',
    cssColor: '#1A1A1A',
    overlayOpacity: 0.85,
  },
  {
    slug: 'leguan-oro',
    name: { fr: 'Leguan Oro', ar: 'ليغوان ذهبي' },
    category: 'special',
    cssColor: '#B89B5A',
    overlayOpacity: 0.3,
  },

  // ───────── Shiny (laqués brillants) ─────────
  {
    slug: 'sabbia-shiny',
    name: { fr: 'Sabbia Shiny', ar: 'رملي لامع' },
    category: 'shiny',
    cssColor: '#D4C5A0',
    overlayOpacity: 0.18,
  },
  {
    slug: 'grigio-shiny',
    name: { fr: 'Grigio Shiny', ar: 'رمادي لامع' },
    category: 'shiny',
    cssColor: '#A8A8A8',
    overlayOpacity: 0.4,
  },
  {
    slug: 'bordeaux-shiny',
    name: { fr: 'Bordeaux Shiny', ar: 'بوردو لامع' },
    category: 'shiny',
    cssColor: '#722038',
    overlayOpacity: 0.7,
  },
  {
    slug: 'carbone-shiny',
    name: { fr: 'Carbone Shiny', ar: 'كربون لامع' },
    category: 'shiny',
    cssColor: '#2A2A2A',
    overlayOpacity: 0.85,
  },
];

export const finishCategoryLabels: Record<FinishCategory, LocalizedString> = {
  frene: { fr: 'Frêne & Chêne', ar: 'دردار وسنديان' },
  laque: { fr: 'Laqués', ar: 'مطلية' },
  rovere: { fr: 'Rovere (Chêne italien)', ar: 'روفير (سنديان إيطالي)' },
  bois: { fr: 'Bois nobles', ar: 'أخشاب فاخرة' },
  pelle: { fr: 'Effet cuir', ar: 'تأثير جلد' },
  metal: { fr: 'Métal', ar: 'معدن' },
  shiny: { fr: 'Laqués brillants', ar: 'مطلية لامعة' },
  special: { fr: 'Finitions spéciales', ar: 'تشطيبات خاصة' },
};

export function getFinishBySlug(slug: string): Finish | undefined {
  return finishes.find((f) => f.slug === slug);
}

export function getFinishesByCategory(cat: FinishCategory): Finish[] {
  return finishes.filter((f) => f.category === cat);
}

/** URL de la vignette officielle PAIL extraite du catalogue page 32. */
export function getFinishImageUrl(finish: Finish | string): string {
  const slug = typeof finish === 'string' ? finish : finish.slug;
  return `/images/catalogue/finitions/swatches/${slug}.jpg`;
}
