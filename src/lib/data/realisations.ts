import type { LocalizedString } from './types';

export type RealisationCategory = 'institution' | 'promotion' | 'hotellerie';

export interface Realisation {
  slug: string;
  /** Nom du client / projet (nom propre — souvent identique FR/AR). */
  name: string;
  nameAr?: string;
  category: RealisationCategory;
  city?: LocalizedString;
  /** Emplacement logo client (sous /public/images/references/). Sinon : nom affiché. */
  logo?: string;
}

export const realisationCategoryLabels: Record<RealisationCategory, LocalizedString> = {
  institution: { fr: 'Institutions & organismes publics', ar: 'المؤسسات والهيئات العمومية' },
  promotion: { fr: 'Promoteurs & entreprises', ar: 'المرقّون والشركات' },
  hotellerie: { fr: 'Hôtellerie', ar: 'الفندقة' },
};

/**
 * Références / réalisations CONFIRMÉES par le client.
 * Cartes simples (nom + catégorie + emplacement logo) — aucune spec inventée.
 * Pour ajouter un logo : déposer le fichier sous /public/images/references/
 * puis renseigner `logo: '/images/references/xxx.svg'`.
 */
export const realisations: Realisation[] = [
  // ─── Institutions & organismes publics ───
  { slug: 'grande-mosquee-alger', name: "Grande Mosquée d'Alger", nameAr: 'الجامع الكبير بالجزائر', category: 'institution', city: { fr: 'Alger', ar: 'الجزائر' }, logo: '/images/references/grande-mosquee-alger.png' },
  { slug: 'ministere-habitat', name: "Ministère de l'Habitat", nameAr: 'وزارة السكن والعمران والمدينة', category: 'institution', logo: '/images/references/ministere-habitat.png' },
  { slug: 'ministere-defense', name: 'Ministère de la Défense Nationale', nameAr: 'وزارة الدفاع الوطني', category: 'institution', logo: '/images/references/ministere-defense.png' },
  { slug: 'ministere-justice', name: 'Ministère de la Justice', nameAr: 'وزارة العدل', category: 'institution' },
  { slug: 'ministere-interieur', name: "Ministère de l'Intérieur", nameAr: 'وزارة الداخلية', category: 'institution' },
  { slug: 'ministere-tourisme', name: 'Ministère du Tourisme', nameAr: 'وزارة السياحة', category: 'institution' },
  // ─── Promoteurs & entreprises ───
  { slug: 'benamar-promotion', name: 'Benamar Promotion', category: 'promotion' },
  { slug: 'chili-promotion', name: 'Chili Promotion', category: 'promotion' },
  { slug: 'provico-promotion', name: 'Provico Promotion', category: 'promotion' },
  { slug: 'hntp', name: 'HNTP', category: 'promotion' },
  { slug: 'spil', name: 'SPIL', category: 'promotion' },
  // ─── Hôtellerie (clients réels) ───
  { slug: 'marriott-bab-ezzouar', name: 'Marriott Bab Ezzouar', category: 'hotellerie', city: { fr: 'Alger', ar: 'الجزائر' } },
  { slug: 'hotel-rodina-oran', name: 'Hôtel Rodina', category: 'hotellerie', city: { fr: 'Oran', ar: 'وهران' } },
  { slug: 'hotel-maraval-oran', name: 'Hôtel Maraval', category: 'hotellerie', city: { fr: 'Oran', ar: 'وهران' } },
];

export function getRealisationBySlug(slug: string): Realisation | undefined {
  return realisations.find((r) => r.slug === slug);
}
