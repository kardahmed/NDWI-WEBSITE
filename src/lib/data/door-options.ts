/**
 * Options globales du configurateur NDWi.
 *
 * Source : catalogue papier NDWi (transcription IMG_4959-4962 validée par le client).
 * Chaque modèle NDWi (Tolga/Djado/Phoenix/Aurès) référence un sous-ensemble
 * de ces options dans son champ `compatibleXxx`.
 *
 * Plus tard (Phase 4) : chaque option deviendra un document Sanity standalone.
 * Pour l'instant on garde en code → simple à itérer, prêt à migrer vers Sanity.
 */

import type { LocalizedString } from './types';

// ─── REVÊTEMENTS / FINITIONS ─────────────────────────────────────────────

export interface DoorRevetement {
  /** Code officiel du catalogue (ex. '0118'). */
  code: string;
  /** Slug stable utilisé en URL / panier. */
  slug: string;
  /** Nom commercial (le même en FR & AR car nom italien). */
  name: string;
  /** Famille : aide à grouper visuellement dans le configurateur. */
  family: 'blanc' | 'gris' | 'bois-clair' | 'bois-fonce' | 'wenge';
  /** Code hex approximatif pour la pastille (à affiner avec photos). */
  hex: string;
  /** URL d'une texture/photo si disponible (placeholder pour l'instant). */
  image?: string;
}

export const revetements: DoorRevetement[] = [
  { code: '0118', slug: 'bianco-niveo',     name: 'BIANCO NIVEO',     family: 'blanc',       hex: '#F4F2EB' },
  { code: '8765', slug: 'patinato-ghiaccio', name: 'PATINATO GHIACCIO', family: 'gris',        hex: '#C9C6BE' },
  { code: '1509', slug: 'frassino-cenere',  name: 'FRASSINO CENERE',  family: 'gris',        hex: '#7A7368' },
  { code: '1125', slug: 'noce-ardenne',     name: 'NOCE ARDENNE',     family: 'bois-fonce',  hex: '#5C3E2A' },
  { code: '8872', slug: 'palazzo-wenge',    name: 'PALAZZO WENGE',    family: 'wenge',       hex: '#2E1F18' },
  // Spécifiques DJADO uniquement :
  { code: '6312', slug: 'noce-mirco',       name: 'NOCE MIRCO',       family: 'bois-fonce',  hex: '#7B4A2F' },
  { code: '8849', slug: 'rovere-delave',    name: 'ROVERE DELAVE',    family: 'bois-clair',  hex: '#9E978A' },
  { code: '1338', slug: 'rovere-azteco',    name: 'ROVERE AZTECO',    family: 'bois-clair',  hex: '#B69A78' },
  { code: '1341', slug: 'rovere-arena',     name: 'ROVERE ARENA',     family: 'bois-clair',  hex: '#CBB694' },
];

/** Slugs des finitions disponibles sur TOUS les modèles. */
export const REVETEMENTS_COMMUNS = [
  'bianco-niveo',
  'patinato-ghiaccio',
  'frassino-cenere',
  'noce-ardenne',
  'palazzo-wenge',
] as const;

/** Finitions exclusives à DJADO (en plus des communes). */
export const REVETEMENTS_DJADO_EXCLUSIFS = [
  'noce-mirco',
  'rovere-delave',
  'rovere-azteco',
  'rovere-arena',
] as const;

// ─── POIGNÉES ────────────────────────────────────────────────────────────

export interface DoorPoignee {
  slug: string;
  name: string;
  type: 'porte-interieure' | 'porte-entree' | 'porte-blindee';
  /** Forme générale, utile pour les filtres visuels. */
  shape: 'carree' | 'courbe' | 'tubulaire' | 'barre' | 'bouton';
  /** Finition de la poignée elle-même. */
  finition: 'chrome' | 'inox' | 'inox-brosse' | 'aluminium-brosse' | 'noir-mat';
  image?: string;
}

export const poignees: DoorPoignee[] = [
  { slug: 'ndwi-chromee',          name: 'NDWI Chromée',         type: 'porte-interieure', shape: 'carree',     finition: 'chrome' },
  { slug: 'ndwi-noire',            name: 'NDWI Noire',           type: 'porte-interieure', shape: 'courbe',     finition: 'noir-mat' },
  { slug: 'basica-01',             name: 'BASICA 01',            type: 'porte-interieure', shape: 'courbe',     finition: 'inox' },
  { slug: 'basica-02',             name: 'BASICA 02',            type: 'porte-interieure', shape: 'tubulaire',  finition: 'inox' },
  { slug: 'poignee-porte-entree',  name: 'Poignée porte d’entrée', type: 'porte-entree',  shape: 'barre',      finition: 'inox-brosse' },
  { slug: 'poignee-porte-blindee', name: 'Poignée porte blindée + bouton', type: 'porte-blindee', shape: 'bouton', finition: 'aluminium-brosse' },
];

// ─── SERRURES ────────────────────────────────────────────────────────────

export interface DoorSerrure {
  slug: string;
  name: LocalizedString;
  /** Permet de filtrer ce qui est compatible avec quel type de porte. */
  appliesTo: Array<'porte-interieure' | 'porte-entree' | 'porte-blindee'>;
  /** Description courte (optionnelle). */
  description?: LocalizedString;
}

export const serrures: DoorSerrure[] = [
  {
    slug: 'serrure-normale',
    name: { fr: 'Serrure normale', ar: 'قفل عادي' },
    appliesTo: ['porte-interieure'],
  },
  {
    slug: 'serrure-magnetique',
    name: { fr: 'Serrure magnétique', ar: 'قفل مغناطيسي' },
    appliesTo: ['porte-interieure'],
    description: {
      fr: 'Fermeture silencieuse magnétique — confort premium.',
      ar: 'إغلاق صامت مغناطيسي — راحة فاخرة.',
    },
  },
  {
    slug: 'serrure-multipoint',
    name: { fr: 'Serrure multi-point', ar: 'قفل متعدد النقاط' },
    appliesTo: ['porte-entree'],
    description: {
      fr: 'Plusieurs points de verrouillage répartis — sécurité accrue pour la porte d’entrée.',
      ar: 'عدة نقاط قفل موزعة — أمان معزز لباب المدخل.',
    },
  },
  {
    slug: 'serrure-blindee-classe-3',
    name: { fr: 'Serrure blindée Classe 3', ar: 'قفل مصفّح فئة 3' },
    appliesTo: ['porte-blindee'],
    description: {
      fr: 'Contre-châssis acier galvanisé, 8 supports antidérapants, résistance à l’effraction certifiée Classe 3.',
      ar: 'هيكل مضاد من الفولاذ المجلفن، 8 دعامات مضادة للانزلاق، مقاومة معتمدة للاقتحام من الفئة 3.',
    },
  },
];

// ─── REMPLISSAGES (intérieur du panneau) ──────────────────────────────────

export interface DoorRemplissage {
  slug: string;
  name: LocalizedString;
}

export const remplissages: DoorRemplissage[] = [
  { slug: 'nid-d-abeille', name: { fr: 'Nid d’abeille', ar: 'خلية نحل' } },
  { slug: 'tubulaire',     name: { fr: 'Tubulaire',      ar: 'أنبوبي' } },
  { slug: 'acier-galvanise', name: { fr: 'Acier galvanisé blindé', ar: 'فولاذ مجلفن مصفّح' } },
];

// ─── VITRAGES / VARIANTES DE PANNEAU ─────────────────────────────────────

export interface DoorVitrage {
  slug: string;
  name: string;
  category: 'plein' | 'vitre-standard' | 'insert-metal' | 'vitre-sur-commande';
}

export const vitrages: DoorVitrage[] = [
  { slug: 'porte-pleine',        name: 'Porte pleine',        category: 'plein' },
  { slug: 'vitre-pleine',        name: 'Vitre pleine',        category: 'vitre-standard' },
  { slug: 'vitre-laterale',      name: 'Vitre latérale',      category: 'vitre-standard' },
  { slug: 'mod-dmt',             name: 'mod. DMT',            category: 'insert-metal' },
  { slug: 'mod-ms',              name: 'mod. MS',             category: 'insert-metal' },
  { slug: 'mod-rpy',             name: 'mod. RPY',            category: 'insert-metal' },
  { slug: 'mod-inf',             name: 'mod. INF',            category: 'insert-metal' },
  { slug: 'mod-autunno',         name: 'mod. AUTUNNO',        category: 'vitre-sur-commande' },
  { slug: 'mod-estate',          name: 'mod. ESTATE',         category: 'vitre-sur-commande' },
  { slug: 'mod-vetro-small',     name: 'mod. VETRO SMALL',    category: 'vitre-sur-commande' },
  { slug: 'mod-vetro-asimmetrico', name: 'mod. VETRO ASIMMETRICO', category: 'vitre-sur-commande' },
  { slug: 'mod-vetro-simmetrico',  name: 'mod. VETRO SIMMETRICO',  category: 'vitre-sur-commande' },
];

// ─── SENS D'OUVERTURE ─────────────────────────────────────────────────────

export type SensOuverture = 'gauche' | 'droite' | 'va-et-vient' | 'coulissant';

export const sensOuvertureLabels: Record<SensOuverture, LocalizedString> = {
  gauche:        { fr: 'Gauche',        ar: 'يسار' },
  droite:        { fr: 'Droite',        ar: 'يمين' },
  'va-et-vient': { fr: 'Va-et-vient',   ar: 'ذهاب وإياب' },
  coulissant:    { fr: 'Coulissant',    ar: 'منزلق' },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────

export function getRevetementBySlug(slug: string): DoorRevetement | undefined {
  return revetements.find((r) => r.slug === slug);
}

export function getPoigneeBySlug(slug: string): DoorPoignee | undefined {
  return poignees.find((p) => p.slug === slug);
}

export function getSerrureBySlug(slug: string): DoorSerrure | undefined {
  return serrures.find((s) => s.slug === slug);
}
