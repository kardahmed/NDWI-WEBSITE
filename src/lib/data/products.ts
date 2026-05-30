import type { LocalizedString } from './types';

export type ProductCategory = 'cuisine' | 'dressing' | 'chambre' | 'bureau' | 'salon';

/** Marque commerciale : NDWi = production locale Algérie, NDO = importation. */
export type ProductBrand = 'ndwi' | 'ndo';

export interface Product {
  slug: string;
  name: string;
  category: ProductCategory;
  /** Défaut : 'ndwi' si non précisé (l'existant a été créé avant l'introduction du champ). */
  brand?: ProductBrand;
  collection?: string;
  shortDescription: LocalizedString;
  description?: LocalizedString;
  /** Composition technique (matériaux, construction). Optionnel. */
  composition?: LocalizedString;
  /** Caractéristiques à puces affichées sur la fiche produit. */
  caracteristiques?: LocalizedString[];
  /** Points forts mis en avant (icônes / chips). */
  features?: LocalizedString[];
  /** Dimensions au format texte libre (ex. "L 2,80 × P 0,60 × H 0,90 m"). */
  dimensions?: string;
  /** Origine de fabrication (texte libre, ex. "Fabriqué en Italie par ARAN"). */
  origine?: string;
  /** Texte garantie (ex. "10 ans constructeur"). */
  garantie?: string;
  /** Prix indicatif "à partir de" en DZD. */
  priceFromDZD?: number;
  image: string;
  /** Galerie d'images supplémentaires (URLs résolues). */
  gallery?: string[];
  /** Pastilles couleur — déclinaisons disponibles du produit. */
  colorVariants?: Array<{
    slug: string;
    name: LocalizedString;
    hex: string;
    /** URL résolue de l'image de cette variante. */
    image?: string;
  }>;
  aspectRatio: '1:1' | '4:5';
  tags?: string[];
}

// Catalogue NDWi historique — noms régionaux algériens pour les cuisines.
// Les images sont des packshots Higgsfield générés sur fond blanc à partir des photos officielles.

export const products: Product[] = [
  // ───────────────────────── CUISINES — Collection CIRTA ─────────────────────────
  {
    slug: 'cuisine-cirta',
    name: 'Cuisine Cirta',
    category: 'cuisine',
    collection: 'Cirta',
    shortDescription: {
      fr: 'La signature Cirta — un mélange de matériaux nobles et de textures.',
      ar: 'توقيع سيرتا — مزيج من المواد النبيلة والملمس.',
    },
    image: '/images/products/cuisines/cirta.jpg',
    aspectRatio: '1:1',
  },
  {
    slug: 'cuisine-cirta-moderne',
    name: 'Cirta Moderne',
    category: 'cuisine',
    collection: 'Cirta',
    shortDescription: {
      fr: 'Distinguée et moderne, façades laquées terracotta sur noyer.',
      ar: 'مميزة وعصرية، واجهات مطلية بلون التراكوتا على الجوز.',
    },
    image: '/images/products/cuisines/cirta-moderne.jpg',
    aspectRatio: '1:1',
    tags: ['best-seller'],
  },
  {
    slug: 'cuisine-cirta-bleu-nuit',
    name: 'Cirta Bleu Nuit',
    category: 'cuisine',
    collection: 'Cirta',
    shortDescription: {
      fr: 'Profonde et élégante, façades laquées bleu nuit.',
      ar: 'عميقة وأنيقة، واجهات مطلية بالأزرق الليلي.',
    },
    image: '/images/products/cuisines/cirta-bleu-nuit.jpg',
    aspectRatio: '1:1',
  },
  {
    slug: 'cuisine-cirta-mineral-grey',
    name: 'Cirta Mineral Grey',
    category: 'cuisine',
    collection: 'Cirta',
    shortDescription: {
      fr: 'Sobre et contemporaine, finition grey effet pierre.',
      ar: 'هادئة ومعاصرة، تشطيب رمادي بتأثير الحجر.',
    },
    image: '/images/products/cuisines/cirta-mineral-grey.jpg',
    aspectRatio: '1:1',
  },
  {
    slug: 'cuisine-cirta-2',
    name: 'Cirta Édition',
    category: 'cuisine',
    collection: 'Cirta',
    shortDescription: {
      fr: 'Variante édition limitée, finition exclusive.',
      ar: 'إصدار محدود، تشطيب حصري.',
    },
    image: '/images/products/cuisines/cirta-2.jpg',
    aspectRatio: '1:1',
  },

  // ─────────────────────── CUISINES — Collection HOGGAR ────────────────────────
  {
    slug: 'cuisine-hoggar',
    name: 'Cuisine Hoggar',
    category: 'cuisine',
    collection: 'Hoggar',
    shortDescription: {
      fr: 'Robuste et chaleureuse, en chêne massif.',
      ar: 'قوية ودافئة، من السنديان المصمت.',
    },
    image: '/images/products/cuisines/hoggar.jpg',
    aspectRatio: '1:1',
  },
  {
    slug: 'cuisine-hoggar-en-chene',
    name: 'Hoggar en Chêne',
    category: 'cuisine',
    collection: 'Hoggar',
    shortDescription: {
      fr: 'Tout chêne massif, esprit montagnard contemporain.',
      ar: 'سنديان مصمت بالكامل، روح جبلية معاصرة.',
    },
    image: '/images/products/cuisines/hoggar-en-chene.jpg',
    aspectRatio: '1:1',
  },
  {
    slug: 'cuisine-hoggar-en-chene-2',
    name: 'Hoggar Chêne Foncé',
    category: 'cuisine',
    collection: 'Hoggar',
    shortDescription: {
      fr: 'Variante chêne teinté foncé, tons profonds.',
      ar: 'متغير من السنديان المصبوغ الداكن، ألوان عميقة.',
    },
    image: '/images/products/cuisines/hoggar-en-chene-2.jpg',
    aspectRatio: '1:1',
  },

  // ─────────────────────── CUISINES — Collection SAHARA ────────────────────────
  {
    slug: 'cuisine-sahara-bleu-clair',
    name: 'Sahara Bleu Clair',
    category: 'cuisine',
    collection: 'Sahara',
    shortDescription: {
      fr: 'Lumineuse et tendance, marbre + inox + bleu clair.',
      ar: 'مضيئة وعصرية، رخام + ستانلس + أزرق فاتح.',
    },
    image: '/images/products/cuisines/sahara-bleu-clair.jpg',
    aspectRatio: '1:1',
  },
  {
    slug: 'cuisine-sahara-mineral-grey',
    name: 'Sahara Mineral Grey',
    category: 'cuisine',
    collection: 'Sahara',
    shortDescription: {
      fr: 'Minimaliste, effet béton mineral grey.',
      ar: 'بسيطة، تأثير الإسمنت رمادي.',
    },
    image: '/images/products/cuisines/sahara-mineral-grey.jpg',
    aspectRatio: '1:1',
  },
  {
    slug: 'cuisine-sahara-noir-brillant',
    name: 'Sahara Noir Brillant',
    category: 'cuisine',
    collection: 'Sahara',
    shortDescription: {
      fr: 'Audacieuse, façades laquées noir brillant.',
      ar: 'جريئة، واجهات مطلية بالأسود اللامع.',
    },
    image: '/images/products/cuisines/sahara-noir-brillant.jpg',
    aspectRatio: '1:1',
  },
  {
    slug: 'cuisine-sahara-gola-inox',
    name: 'Sahara Gola Inox',
    category: 'cuisine',
    collection: 'Sahara',
    shortDescription: {
      fr: 'Sans poignées, gola en inox, finition épurée.',
      ar: 'بدون مقابض، Gola من الستانلس، تشطيب راقي.',
    },
    image: '/images/products/cuisines/sahara-gola-inox.jpg',
    aspectRatio: '1:1',
  },

  // ────────────────────── CUISINES — Collections uniques ───────────────────────
  {
    slug: 'cuisine-djanet',
    name: 'Cuisine Djanet',
    category: 'cuisine',
    collection: 'Djanet',
    shortDescription: {
      fr: 'En chêne massif, lignes pures et chaleureuses.',
      ar: 'سنديان مصمت، خطوط نقية ودافئة.',
    },
    image: '/images/products/cuisines/djanet.jpg',
    aspectRatio: '1:1',
  },
  {
    slug: 'cuisine-sefar',
    name: 'Cuisine Sefar',
    category: 'cuisine',
    collection: 'Sefar',
    shortDescription: {
      fr: 'Façades chêne massif coloris bleu obscur patiné.',
      ar: 'واجهات السنديان المصمت بلون الأزرق الداكن المعتق.',
    },
    image: '/images/products/cuisines/sefar.jpg',
    aspectRatio: '1:1',
  },
  {
    slug: 'cuisine-tassili',
    name: 'Cuisine Tassili',
    category: 'cuisine',
    collection: 'Tassili',
    shortDescription: {
      fr: 'En bois massif, pilastres et corniches décoratives.',
      ar: 'من الخشب المصمت، أعمدة وحواف زخرفية.',
    },
    image: '/images/products/cuisines/tassili.jpg',
    aspectRatio: '1:1',
    tags: ['signature'],
  },

  // ──────────────────────────── BUREAUX (NDO) ──────────────────────────────────
  {
    slug: 'bureau-tower',
    name: 'Gamme Tower',
    category: 'bureau',
    collection: 'Tower',
    shortDescription: {
      fr: 'Bureau directionnel en L avec bibliothèque intégrée, noyer foncé.',
      ar: 'مكتب تنفيذي على شكل L مع مكتبة مدمجة، جوز داكن.',
    },
    image: '/images/products/bureaux/tower.jpg',
    aspectRatio: '1:1',
    tags: ['signature'],
  },
  {
    slug: 'bureau-president',
    name: 'Gamme President',
    category: 'bureau',
    collection: 'President',
    shortDescription: {
      fr: 'Bureau exécutif premium, prestance et autorité.',
      ar: 'مكتب تنفيذي راقٍ، حضور وسلطة.',
    },
    image: '/images/products/bureaux/president.jpg',
    aspectRatio: '1:1',
  },
  {
    slug: 'bureau-vintage',
    name: 'Gamme Vintage',
    category: 'bureau',
    collection: 'Vintage',
    shortDescription: {
      fr: 'Concept moderne avec touches vintage, caractère.',
      ar: 'مفهوم عصري بلمسات قديمة، طابع مميز.',
    },
    image: '/images/products/bureaux/vintage.jpg',
    aspectRatio: '1:1',
  },
  {
    slug: 'bureau-vista',
    name: 'Gamme Vista',
    category: 'bureau',
    collection: 'Vista',
    shortDescription: {
      fr: 'Bureau panoramique, lignes contemporaines épurées.',
      ar: 'مكتب بانورامي، خطوط معاصرة نقية.',
    },
    image: '/images/products/bureaux/vista.jpg',
    aspectRatio: '1:1',
  },
  {
    slug: 'bureau-kamos',
    name: 'Gamme Kamos',
    category: 'bureau',
    collection: 'Kamos',
    shortDescription: {
      fr: 'Open space modulaire, ergonomie professionnelle.',
      ar: 'فضاء مفتوح معياري، إرغونوميا احترافية.',
    },
    image: '/images/products/bureaux/kamos.jpg',
    aspectRatio: '1:1',
  },
  {
    slug: 'bureau-miro',
    name: 'Gamme Miro',
    category: 'bureau',
    collection: 'Miro',
    shortDescription: {
      fr: 'Postes individuels modernes, design fonctionnel.',
      ar: 'مكاتب فردية عصرية، تصميم وظيفي.',
    },
    image: '/images/products/bureaux/miro.jpg',
    aspectRatio: '1:1',
  },
  {
    slug: 'bureau-toscana',
    name: 'Bureaux Toscana',
    category: 'bureau',
    collection: 'Toscana',
    shortDescription: {
      fr: 'Inspiration toscane, finition bois chaleureuse.',
      ar: 'إلهام توسكاني، تشطيب خشبي دافئ.',
    },
    image: '/images/products/bureaux/toscana.jpg',
    aspectRatio: '1:1',
  },
  {
    slug: 'bureau-moderne-milano',
    name: 'Bureau Moderne Milano',
    category: 'bureau',
    collection: 'Milano',
    shortDescription: {
      fr: 'Concept directionnel italien, lignes pures contemporaines.',
      ar: 'مفهوم تنفيذي إيطالي، خطوط معاصرة نقية.',
    },
    image: '/images/products/bureaux/moderne-milano.jpg',
    aspectRatio: '1:1',
  },
];

export function getProductsByCategory(cat: ProductCategory): Product[] {
  return products.filter((p) => p.category === cat);
}

/** Retourne la marque d'un produit (default 'ndwi' si non précisée — héritage avant introduction du champ). */
export function getProductBrand(p: Pick<Product, 'brand'>): ProductBrand {
  return p.brand ?? 'ndwi';
}

/** Labels FR/AR pour les marques. */
export const productBrandLabels: Record<ProductBrand, { fr: string; ar: string; tagline: { fr: string; ar: string } }> = {
  ndwi: {
    fr: 'NDWi',
    ar: 'NDWi',
    tagline: { fr: 'Production locale Algérie', ar: 'إنتاج محلي الجزائر' },
  },
  ndo: {
    fr: 'NDO',
    ar: 'NDO',
    tagline: { fr: 'Importation', ar: 'استيراد' },
  },
};

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export const productCollections: Record<string, LocalizedString> = {
  Cirta: { fr: 'Cirta', ar: 'سيرتا' },
  Hoggar: { fr: 'Hoggar', ar: 'الهقار' },
  Sahara: { fr: 'Sahara', ar: 'الصحراء' },
  Djanet: { fr: 'Djanet', ar: 'جانت' },
  Sefar: { fr: 'Sefar', ar: 'سفار' },
  Tassili: { fr: 'Tassili', ar: 'الطاسيلي' },
};
