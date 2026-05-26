export const siteConfig = {
  name: 'Groupe NDWI',
  /** Raison sociale légale — utilisée dans les mentions légales, le footer et le JSON-LD. */
  legalName: 'New Design Wood Industrie',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ndwi-dz.com',
  description:
    "Groupe NDWI — fabrication algérienne haut de gamme de portes, cuisines, dressing, mobilier hôtelier et workspace en partenariat avec les références italiennes.",
  email: 'contact@ndwi-dz.com',
  phone: '+213 555 535 106',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '213000000000',
  address: {
    line1: "Zone d'activités Nedjma, Lot N°395, Ilot N°2",
    city: 'El Karma',
    postalCode: '31000',
    region: 'Oran',
    country: 'Algérie',
  },
  showrooms: ['oran', 'alger', 'setif'] as const,
  partners: ['ARAN', 'PAIL', 'ICA'] as const,
};

export type ShowroomSlug = (typeof siteConfig.showrooms)[number];
