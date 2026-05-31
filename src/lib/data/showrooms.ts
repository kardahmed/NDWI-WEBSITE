import type { LocalizedString } from './types';

/** Un numéro de contact du show-room — affiché T (tél) / F (fax) / M (mobile). */
export interface ShowroomPhone {
  kind: 'tel' | 'fax' | 'mobile';
  value: string;
}

export interface Showroom {
  slug: string;
  city: LocalizedString;
  status: 'open' | 'soon';
  address: LocalizedString;
  /** Numéro principal (JSON-LD + fallback si `phones` absent). */
  phone?: string;
  /** Liste complète des numéros (fixe / fax / mobile). */
  phones?: ShowroomPhone[];
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
      fr: 'N°34, Cité Hachemi Ghzali, Bir El Djir, Oran',
      ar: 'رقم 34، حي هاشمي غزالي، بئر الجير، وهران',
    },
    phone: '+213 41 420 101',
    phones: [
      { kind: 'tel', value: '+213 41 420 101' },
      { kind: 'tel', value: '+213 41 420 183' },
      { kind: 'mobile', value: '+213 554 513 735' },
    ],
    email: 'oran@ndwi-dz.com',
    // Coordonnées approximatives (localité) — à affiner avec le GPS exact du show-room.
    lat: 35.7256,
    lng: -0.5494,
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cit%C3%A9+Hachemi+Ghzali+Bir+El+Djir+Oran',
    hours: stdHours,
    universes: ['habitat', 'workspace'],
    image: '/images/showrooms/oran.jpg',
  },
  {
    slug: 'alger',
    city: { fr: 'Alger', ar: 'الجزائر' },
    status: 'open',
    address: {
      fr: '21, Lot Aissat Idir, Chéraga, Alger',
      ar: '21، حصة عيسات إيدير، الشراقة، الجزائر',
    },
    phone: '+213 23 301 002',
    phones: [
      { kind: 'tel', value: '+213 23 301 002' },
      { kind: 'fax', value: '+213 21 374 814' },
      { kind: 'mobile', value: '+213 770 879 209' },
      { kind: 'mobile', value: '+213 555 026 141' },
    ],
    email: 'alger@ndwi-dz.com',
    // Coordonnées approximatives (localité) — à affiner avec le GPS exact du show-room.
    lat: 36.7672,
    lng: 2.9477,
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Lot+Aissat+Idir+Ch%C3%A9raga+Alger',
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

/** Abréviation d'affichage par type de numéro (T = tél, F = fax, M = mobile). */
export const PHONE_KIND_ABBR: Record<ShowroomPhone['kind'], string> = {
  tel: 'T',
  fax: 'F',
  mobile: 'M',
};

/** Liste normalisée des numéros d'un show-room (utilise `phones`, sinon `phone`). */
export function showroomPhones(s: Showroom): ShowroomPhone[] {
  if (s.phones?.length) return s.phones;
  return s.phone ? [{ kind: 'tel', value: s.phone }] : [];
}

export function getShowroomBySlug(slug: string): Showroom | undefined {
  return showrooms.find((s) => s.slug === slug);
}
