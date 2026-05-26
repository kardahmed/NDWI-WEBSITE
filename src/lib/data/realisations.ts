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
  { slug: 'ministere-justice', name: 'Ministère de la Justice', nameAr: 'وزارة العدل', category: 'institution', logo: '/images/references/ministere-justice.png' },
  { slug: 'ministere-interieur', name: "Ministère de l'Intérieur", nameAr: 'وزارة الداخلية والجماعات المحلية والنقل', category: 'institution', logo: '/images/references/ministere-interieur.png' },
  { slug: 'ministere-tourisme', name: 'Ministère du Tourisme', nameAr: 'وزارة السياحة والصناعة التقليدية', category: 'institution', logo: '/images/references/ministere-tourisme.png' },
  { slug: 'trust-bank-algeria', name: 'Trust Bank Algeria', category: 'institution', logo: '/images/references/trust-bank-algeria.png' },
  // ─── Promoteurs & entreprises ───
  { slug: 'benamar-promotion', name: 'Benammar Promotion', category: 'promotion', logo: '/images/references/benammar-promotion.png' },
  { slug: 'chili-promotion', name: 'Chiali Immobilier', category: 'promotion', logo: '/images/references/chiali-immobilier.png' },
  { slug: 'provico-promotion', name: 'Proveco Promotion', category: 'promotion', logo: '/images/references/proveco-promotion.png' },
  { slug: 'hntp', name: 'HNTP Immobilière', category: 'promotion', logo: '/images/references/hntp.png' },
  { slug: 'spil', name: 'SPIL Promotion', category: 'promotion', logo: '/images/references/spil-promotion.png' },
  { slug: 'sidi-attallah', name: 'Sidi Attallah Promotion Immobilière', category: 'promotion', logo: '/images/references/sidi-attallah.png' },
  { slug: 'benzamia-promotion', name: 'Benzamia Promotion', category: 'promotion', logo: '/images/references/benzamia-promotion.png' },
  // ─── Hôtellerie (clients réels) ───
  { slug: 'marriott-bab-ezzouar', name: 'Marriott Bab Ezzouar', category: 'hotellerie', city: { fr: 'Alger', ar: 'الجزائر' }, logo: '/images/references/marriott-bab-ezzouar.png' },
  { slug: 'hotel-rodina-oran', name: 'Hôtel Rodina', category: 'hotellerie', city: { fr: 'Oran', ar: 'وهران' }, logo: '/images/references/hotel-rodina.png' },
  { slug: 'hotel-maraval-oran', name: 'Hôtel Maraval', category: 'hotellerie', city: { fr: 'Oran', ar: 'وهران' }, logo: '/images/references/hotel-maraval.png' },
];

export function getRealisationBySlug(slug: string): Realisation | undefined {
  return realisations.find((r) => r.slug === slug);
}
