import type { LocalizedString } from './types';

/**
 * Poignées officielles NDWi PORTE — catalogue page 33.
 * 15 modèles avec leurs finitions par défaut.
 */

export type HandleFinish =
  | 'cromato'
  | 'cromato-opaco'
  | 'cromo-lucido'
  | 'laccato-nero-mat'
  | 'laccato-bianco-spazzolato'
  | 'ottone-satinato'
  | 'ottone-lucido';

export interface DoorHandle {
  slug: string;
  code?: string;
  name: string;
  style: LocalizedString;
  finishes: HandleFinish[];
  imageUrl?: string;
}

export const doorHandles: DoorHandle[] = [
  {
    slug: 'ndwi-p01',
    code: 'NDWI P01',
    name: 'NDWI P01',
    style: { fr: 'Levier moderne, rosace ronde', ar: 'مقبض رافعة عصري، قاعدة دائرية' },
    finishes: ['cromato', 'cromo-lucido', 'laccato-nero-mat'],
  },
  {
    slug: 'ndwi-p02',
    code: 'NDWI P02',
    name: 'NDWI P02',
    style: { fr: 'Levier courbé, rosace ronde noire', ar: 'مقبض منحني، قاعدة سوداء' },
    finishes: ['laccato-nero-mat', 'cromato'],
  },
  {
    slug: 'ndwi-p03',
    code: 'NDWI P03',
    name: 'NDWI P03',
    style: { fr: 'Levier carré, rosace carrée chromée', ar: 'مقبض مربع، قاعدة كرومية' },
    finishes: ['cromo-lucido', 'cromato'],
  },
  {
    slug: 'adamant',
    name: 'ADAMANT',
    style: { fr: 'Levier sculpté, rosace ronde laiton', ar: 'مقبض منحوت، قاعدة نحاسية' },
    finishes: ['ottone-satinato', 'cromato', 'cromo-lucido'],
  },
  {
    slug: 'total',
    name: 'TOTAL',
    style: { fr: 'Levier rectangulaire massif', ar: 'مقبض مستطيل ضخم' },
    finishes: ['cromato-opaco', 'cromo-lucido'],
  },
  {
    slug: 'blade',
    name: 'BLADE',
    style: { fr: 'Lame carrée minimaliste', ar: 'شفرة مربعة مينمالية' },
    finishes: ['laccato-bianco-spazzolato', 'cromato-opaco'],
  },
  {
    slug: 'onda',
    name: 'ONDA',
    style: { fr: "Levier en forme d'onde, élégant", ar: 'مقبض بشكل موجة، أنيق' },
    finishes: ['laccato-bianco-spazzolato', 'cromo-lucido', 'cromato'],
  },
  {
    slug: 'siena',
    name: 'SIENA',
    style: { fr: 'Levier classique italien', ar: 'مقبض كلاسيكي إيطالي' },
    finishes: ['laccato-bianco-spazzolato', 'ottone-lucido', 'cromato'],
  },
  {
    slug: 'quadra',
    name: 'QUADRA',
    style: { fr: 'Levier rectiligne, rosace carrée', ar: 'مقبض مستقيم، قاعدة مربعة' },
    finishes: ['cromo-lucido', 'cromato-opaco'],
  },
  {
    slug: 'sketch',
    name: 'SKETCH',
    style: { fr: 'Levier épuré, rosace ronde', ar: 'مقبض راقٍ، قاعدة دائرية' },
    finishes: ['cromo-lucido', 'cromato'],
  },
  {
    slug: 'los-angeles',
    name: 'LOS ANGELES',
    style: { fr: 'Lame plate moderne, rosace carrée', ar: 'شفرة مسطحة عصرية' },
    finishes: ['cromo-lucido', 'cromato-opaco'],
  },
  {
    slug: 'stilo',
    name: 'STILO',
    style: { fr: 'Levier en goutte, rosace ronde', ar: 'مقبض بشكل قطرة' },
    finishes: ['laccato-bianco-spazzolato', 'cromato'],
  },
  {
    slug: 'moribord',
    name: 'MORIBORD',
    style: { fr: 'Levier classique épuré', ar: 'مقبض كلاسيكي راقٍ' },
    finishes: ['cromo-lucido', 'cromato'],
  },
  {
    slug: 'valencia',
    name: 'VALENCIA',
    style: { fr: 'Levier baroque, finition laiton brillant', ar: 'مقبض باروكي، نحاس لامع' },
    finishes: ['ottone-lucido', 'cromato'],
  },
  {
    slug: 'sinuosa',
    name: 'SINUOSA',
    style: { fr: 'Levier sinueux, rosace ronde', ar: 'مقبض متعرج، قاعدة دائرية' },
    finishes: ['cromo-lucido', 'cromato'],
  },
];

export const handleFinishLabels: Record<HandleFinish, LocalizedString> = {
  cromato: { fr: 'Cromato (Chrome)', ar: 'كروم' },
  'cromato-opaco': { fr: 'Cromato opaco', ar: 'كروم مطفأ' },
  'cromo-lucido': { fr: 'Cromo Lucido', ar: 'كروم لامع' },
  'laccato-nero-mat': { fr: 'Laccato Nero Mat', ar: 'أسود مطفأ' },
  'laccato-bianco-spazzolato': { fr: 'Laccato Bianco Spazzolato', ar: 'أبيض مفروش' },
  'ottone-satinato': { fr: 'Ottone Satinato', ar: 'نحاس ساتيني' },
  'ottone-lucido': { fr: 'Ottone Lucido', ar: 'نحاس لامع' },
};

export function getHandleBySlug(slug: string): DoorHandle | undefined {
  return doorHandles.find((h) => h.slug === slug);
}

/** URL de la vignette officielle extraite du catalogue page 33. */
export function getHandleImageUrl(handle: DoorHandle | string): string {
  const slug = typeof handle === 'string' ? handle : handle.slug;
  return `/images/catalogue/poignees/models/${slug}.jpg`;
}

export function handleFinishToColor(finish?: HandleFinish | string): string {
  switch (finish) {
    case 'cromo-lucido':
      return '#E8E8E8';
    case 'cromato':
      return '#C8C8C8';
    case 'cromato-opaco':
      return '#A0A0A0';
    case 'laccato-nero-mat':
      return '#1A1A1A';
    case 'laccato-bianco-spazzolato':
      return '#F0EBE0';
    case 'ottone-satinato':
      return '#B89B6B';
    case 'ottone-lucido':
      return '#D4AF37';
    default:
      return '#888888';
  }
}
