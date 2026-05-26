import type { LocalizedString } from './types';

export interface Showroom {
  slug: string;
  city: LocalizedString;
  status: 'open' | 'soon';
  address: LocalizedString;
  phone?: string;
  email?: string;
  lat: number;
  lng: number;
  mapsUrl: string;
  hours?: { label: LocalizedString; value: LocalizedString }[];
  image?: string;
  universes?: ('habitat' | 'workspace')[];
}

const stdHours = [
  {
    label: { fr: 'Dimanche – Jeudi', ar: 'الأحد – الخميس' },
    value: { fr: '8h30 – 17h30', ar: '8:30 – 17:30' },
  },
  {
    label: { fr: 'Samedi', ar: 'السبت' },
    value: { fr: '9h00 – 14h00', ar: '9:00 – 14:00' },
  },
  {
    label: { fr: 'Vendredi', ar: 'الجمعة' },
    value: { fr: 'Fermé', ar: 'مغلق' },
  },
];

export const showrooms: Showroom[] = [
  {
    slug: 'oran',
    city: { fr: 'Oran', ar: 'وهران' },
    status: 'open',
    address: {
      fr: "Zone d'activités Nedjma, Lot N°395, Ilot N°2 — El Karma, 31000 Oran",
      ar: 'المنطقة الصناعية النجمة، رقم 395، الجزيرة 2 — الكرمة، 31000 وهران',
    },
    phone: '+213 555 535 106',
    email: 'oran@ndwi-dz.com',
    lat: 35.6911,
    lng: -0.6417,
    mapsUrl: 'https://maps.app.goo.gl/MmW7BZd1wqjWRDmX7',
    hours: stdHours,
    universes: ['habitat', 'workspace'],
    image: '/images/showrooms/oran.jpg',
  },
  {
    slug: 'alger',
    city: { fr: 'Alger', ar: 'الجزائر' },
    status: 'open',
    address: {
      fr: 'Showroom Alger Centre — à préciser',
      ar: 'معرض الجزائر العاصمة — يُحدَّد',
    },
    phone: '+213 561 634 634',
    email: 'alger@ndwi-dz.com',
    lat: 36.7538,
    lng: 3.0588,
    mapsUrl: 'https://maps.app.goo.gl/zhqEJbGnohRYpnh87',
    hours: stdHours,
    universes: ['habitat', 'workspace'],
    image: '/images/showrooms/alger.jpg',
  },
  {
    slug: 'setif',
    city: { fr: 'Setif', ar: 'سطيف' },
    status: 'open',
    address: {
      fr: 'Showroom Setif — à préciser',
      ar: 'معرض سطيف — يُحدَّد',
    },
    phone: '+213 561 634 634',
    email: 'setif@ndwi-dz.com',
    lat: 36.1898,
    lng: 5.4108,
    mapsUrl: 'https://maps.google.com/?q=36.1898,5.4108',
    hours: stdHours,
    universes: ['habitat'],
    image: '/images/showrooms/setif.jpg',
  },
];

export function getShowroomBySlug(slug: string): Showroom | undefined {
  return showrooms.find((s) => s.slug === slug);
}
