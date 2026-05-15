/**
 * Données des deux marques du Groupe (NDWi production locale + NDO importation).
 * Chaque marque a un hero + les mêmes catégories — c'est l'origine qui diffère, pas l'offre.
 */

import type { LocalizedString, DoorBrand } from './types';

export interface BrandData {
  slug: DoorBrand;
  name: LocalizedString;
  tagline: LocalizedString;
  description: LocalizedString;
  /** Origine / promesse de marque (sera affichée en hero). */
  origin: LocalizedString;
  /** Logo path (optionnel). */
  logo?: string;
  /** Image hero pleine largeur. */
  heroImage?: string;
}

export const brands: BrandData[] = [
  {
    slug: 'ndwi',
    name: { fr: 'NDWi', ar: 'NDWi' },
    tagline: {
      fr: 'Production locale Algérie',
      ar: 'إنتاج محلي الجزائر',
    },
    description: {
      fr: 'NDWi conçoit et fabrique à Oran. Production locale, délais maîtrisés, équipes formées aux process italiens. Le sur-mesure algérien haut de gamme, sans intermédiaire.',
      ar: 'تصمم وتُصنّع NDWi في وهران. إنتاج محلي، آجال مدروسة، فرق مدربة على الأساليب الإيطالية. التصميم الجزائري الراقي حسب الطلب، دون وسطاء.',
    },
    origin: {
      fr: 'Fabriqué à Oran · Conception 3D · Livraison & pose équipe NDWi',
      ar: 'صُنع في وهران · تصميم ثلاثي الأبعاد · التسليم والتركيب من فريق NDWi',
    },
    heroImage: '/images/brands/ndwi-hero.jpg',
  },
  {
    slug: 'ndo',
    name: { fr: 'NDO', ar: 'NDO' },
    tagline: {
      fr: 'Importation Italie',
      ar: 'استيراد من إيطاليا',
    },
    description: {
      fr: 'NDO importe les signatures italiennes premium — ARAN Cucine, PAIL, ICA. Le meilleur du design transalpin, sélectionné pour son exigence et sa finition.',
      ar: 'تستورد NDO التوقيعات الإيطالية الفاخرة — ARAN Cucine، PAIL، ICA. أفضل التصاميم الإيطالية، مختارة على أساس متطلباتها وتشطيباتها.',
    },
    origin: {
      fr: 'Importé d\'Italie · Partenaires ARAN · PAIL · ICA · Livraison directe usine',
      ar: 'مستورد من إيطاليا · شركاء ARAN · PAIL · ICA · تسليم مباشر من المصنع',
    },
    heroImage: '/images/brands/ndo-hero.jpg',
  },
];

/** Catégories proposées par les deux marques. */
export interface BrandCategory {
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  image: string;
}

export const brandCategories: BrandCategory[] = [
  {
    slug: 'portes',
    name: { fr: 'Portes', ar: 'الأبواب' },
    description: {
      fr: 'Intérieures, blindées, techniques.',
      ar: 'داخلية، مصفّحة، تقنية.',
    },
    image: '/images/categories/portes.jpg',
  },
  {
    slug: 'cuisines',
    name: { fr: 'Cuisines', ar: 'المطابخ' },
    description: {
      fr: 'Cuisines équipées sur-mesure.',
      ar: 'مطابخ مجهزة حسب الطلب.',
    },
    image: '/images/categories/cuisines.jpg',
  },
  {
    slug: 'chambres',
    name: { fr: 'Chambres', ar: 'غرف النوم' },
    description: {
      fr: 'Chambres complètes, têtes de lit, rangements.',
      ar: 'غرف نوم كاملة، رؤوس سرير، وحدات تخزين.',
    },
    image: '/images/categories/chambres.jpg',
  },
  {
    slug: 'dressing',
    name: { fr: 'Dressing', ar: 'خزائن الملابس' },
    description: {
      fr: 'Dressing sur-mesure, modulaires ou intégrés.',
      ar: 'خزائن ملابس حسب الطلب، معيارية أو مدمجة.',
    },
    image: '/images/categories/dressing.jpg',
  },
  {
    slug: 'bureaux',
    name: { fr: 'Bureaux', ar: 'المكاتب' },
    description: {
      fr: 'Mobilier de bureau : direction, open-space, réunion.',
      ar: 'أثاث المكاتب: إدارة، فضاء مفتوح، اجتماعات.',
    },
    image: '/images/categories/bureaux.jpg',
  },
  {
    slug: 'salons',
    name: { fr: 'Salons', ar: 'الصالونات' },
    description: {
      fr: 'Canapés, tables basses, meubles TV.',
      ar: 'أرائك، طاولات منخفضة، أثاث تلفزيون.',
    },
    image: '/images/categories/salons.jpg',
  },
  {
    slug: 'hotellerie',
    name: { fr: 'Mobilier hôtelier', ar: 'الأثاث الفندقي' },
    description: {
      fr: 'Suites complètes, lobby, restauration.',
      ar: 'أجنحة كاملة، استقبال، مطاعم.',
    },
    image: '/images/categories/hotellerie.jpg',
  },
];

export function getBrand(slug: string): BrandData | undefined {
  return brands.find((b) => b.slug === slug);
}
