import type { LocalizedString } from './types';

export interface Partner {
  slug: string;
  name: string;
  country: { fr: string; ar: string };
  founded?: number;
  speciality: LocalizedString;
  description: LocalizedString;
  website?: string;
  image?: string;
  /** Logo officiel du partenaire (SVG, PNG ou WebP) */
  logo?: string;
}

// Partenaires mentionnés dans le cahier des charges.
// NE PAS ajouter sans validation client.
export const partners: Partner[] = [
  {
    slug: 'aran',
    name: 'ARAN',
    country: { fr: 'Italie', ar: 'إيطاليا' },
    founded: 1962,
    speciality: { fr: 'Cuisines & solutions habitat', ar: 'مطابخ وحلول السكن' },
    description: {
      fr: "Référence italienne du mobilier de cuisine et des solutions d'habitat sur mesure. ARAN équipe les projets résidentiels et hôteliers haut de gamme dans plus de 80 pays.",
      ar: 'مرجع إيطالي لأثاث المطابخ وحلول السكن حسب الطلب. تُجهّز ARAN المشاريع السكنية والفندقية الراقية في أكثر من 80 بلداً.',
    },
    website: 'https://arancucine.it',
    image: '/images/partners/aran-modern.jpg',
    logo: '/images/partners/logos/aran.webp',
  },
  {
    slug: 'pail',
    name: 'PAIL',
    country: { fr: 'Italie', ar: 'إيطاليا' },
    founded: 1948,
    speciality: { fr: 'Portes & menuiseries', ar: 'أبواب ونجارة' },
    description: {
      fr: "Fabricant italien historique de portes d'intérieur et de menuiseries premium. PAIL conjugue savoir-faire artisanal et innovation industrielle depuis plus de 75 ans.",
      ar: 'مصنّع إيطالي تاريخي للأبواب الداخلية والنجارة الراقية. تجمع PAIL بين الحرفية والابتكار الصناعي منذ أكثر من 75 عاماً.',
    },
    website: 'https://pailporte.com',
    image: '/images/partners/pail/antea-multinoce.jpg',
    logo: '/images/partners/logos/pail.png',
  },
  {
    slug: 'ica',
    name: 'ICA',
    country: { fr: 'Italie', ar: 'إيطاليا' },
    founded: 1971,
    speciality: { fr: 'Finitions & vernis bois', ar: 'تشطيبات وطلاءات الخشب' },
    description: {
      fr: "Leader européen des revêtements et vernis pour le bois. Les finitions ICA équipent les portes, cuisines et mobiliers NDWI — garantissant durabilité et tenue dans le temps.",
      ar: 'رائد أوروبي في طلاءات وورنيشات الخشب. تشطيبات ICA تُجهّز أبواب ومطابخ وأثاث NDWI — مع ضمان المتانة والبقاء عبر الزمن.',
    },
    website: 'https://icaspa.com',
    image: '/images/catalogue/finitions/swatches/rovere-castagno-cera.jpg',
    logo: '/images/partners/logos/ica.svg',
  },
];
