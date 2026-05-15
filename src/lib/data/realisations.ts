import type { LocalizedString } from './types';

export type RealisationCategory = 'residentiel' | 'promotion' | 'hotellerie' | 'workspace';

export type Univers = 'portes' | 'cuisines' | 'chambres' | 'dressing' | 'hotellerie' | 'workspace';

export interface Realisation {
  slug: string;
  title: LocalizedString;
  client: string | LocalizedString;
  city: LocalizedString;
  year: number;
  category: RealisationCategory;
  universes: Univers[];
  summary: LocalizedString;
  body: LocalizedString[]; // paragraphes
  metrics?: { value: string; label: LocalizedString }[];
  featured?: boolean;
  /** Photo officielle fournie par le client (sinon fallback par categorie) */
  image?: string;
  /** Logo client (PNG/JPG fond transparent ou blanc) */
  clientLogo?: string;
}

export const realisationCategoryLabels: Record<RealisationCategory, LocalizedString> = {
  residentiel: { fr: 'Résidentiel', ar: 'سكني' },
  promotion: { fr: 'Promotion immobilière', ar: 'الترقية العقارية' },
  hotellerie: { fr: 'Hôtellerie', ar: 'الفندقة' },
  workspace: { fr: 'Workspace / Bureaux', ar: 'فضاء العمل' },
};

// Liste des réalisations confirmées par le client.
// Ne RIEN ajouter sans validation explicite et sans logos/photos fournis.
export const realisations: Realisation[] = [
  {
    slug: 'marriott-alger',
    title: { fr: 'Marriott Hotel Bab Ezzouar — Alger', ar: 'فندق ماريوت باب الزوار — الجزائر' },
    client: 'Marriott International',
    city: { fr: 'Alger', ar: 'الجزائر' },
    year: 2023,
    category: 'hotellerie',
    universes: ['hotellerie', 'portes'],
    featured: true,
    summary: {
      fr: 'Portes palières acoustiques EI30, mobilier de suites, intégration normes Marriott. 280 chambres équipées.',
      ar: 'أبواب طوابق عازلة للصوت EI30، أثاث الأجنحة، الالتزام بمعايير ماريوت. تم تجهيز 280 غرفة.',
    },
    body: [
      {
        fr: "Premier chantier Marriott confié au Groupe NDWI en Algérie. La marque exige un cahier des charges technique parmi les plus stricts du marché : coupe-feu EI30, acoustique 32 dB minimum, anti-pince-doigt, charnières à fermeture amortie, serrure RFID compatible.",
        ar: 'أول مشروع لماريوت يُسند إلى مجموعة NDWI في الجزائر. تشترط العلامة دفتر شروط تقني من بين الأكثر صرامة في السوق: مقاومة حريق EI30، عزل صوتي 32 ديسيبل كحد أدنى، مانع لانحشار الأصابع، مفصلات بإغلاق ممتص، قفل متوافق مع RFID.',
      },
      {
        fr: "Notre série Antea Hotel a été développée en partenariat avec ARAN spécifiquement pour ce type de projet. Les 280 portes palières ont été produites à Oran et installées en 14 semaines, en coordination avec le planning de finition de l'hôtel.",
        ar: 'سلسلتنا Antea Hotel طُوّرت بالشراكة مع ARAN خصيصاً لهذا النوع من المشاريع. تم إنتاج 280 باب طابق في وهران وتركيبها في 14 أسبوعاً، بالتنسيق مع جدول تشطيب الفندق.',
      },
    ],
    metrics: [
      { value: '280', label: { fr: 'Chambres équipées', ar: 'غرفة مجهزة' } },
      { value: 'EI30', label: { fr: 'Certif coupe-feu', ar: 'شهادة مقاومة حريق' } },
      { value: '14 sem.', label: { fr: 'Délai chantier', ar: 'أجل المشروع' } },
    ],
    image: '/images/realisations/marriott-bab-ezzouar.jpg',
    clientLogo: '/images/clients/marriott.png',
  },
  {
    slug: 'rodina-oran',
    title: { fr: 'Hôtel Rodina — Oran', ar: 'فندق رودينا — وهران' },
    client: 'Hôtel Rodina',
    city: { fr: 'Oran', ar: 'وهران' },
    year: 2022,
    category: 'hotellerie',
    universes: ['hotellerie', 'portes', 'chambres'],
    featured: true,
    summary: {
      fr: 'Hôtel 5 étoiles oranais. Portes blindées palières, mobilier de suites présidentielles, dressings sur-mesure.',
      ar: 'فندق 5 نجوم بوهران. أبواب طوابق مصفّحة، أثاث الأجنحة الرئاسية، خزائن ملابس حسب الطلب.',
    },
    body: [
      {
        fr: "Le Rodina est l'une des références hôtelières premium d'Oran. Pour leur nouvelle aile, nous avons fabriqué portes blindées palières classe RC3, mobilier complet des suites présidentielles (têtes de lit, dressings, console TV), et coordination avec le designer italien du projet.",
        ar: 'يُعدّ رودينا من المراجع الفندقية الراقية في وهران. لجناحهم الجديد، صنعنا أبواب طوابق مصفّحة من فئة RC3، أثاثاً كاملاً للأجنحة الرئاسية (رؤوس السرير، الخزائن، طاولات التلفزيون)، بتنسيق مع المصمم الإيطالي للمشروع.',
      },
    ],
    metrics: [
      { value: '120', label: { fr: 'Chambres', ar: 'غرفة' } },
      { value: 'RC3', label: { fr: 'Classe sécurité', ar: 'فئة الأمان' } },
    ],
    image: '/images/realisations/rodina-oran.jpg',
    clientLogo: '/images/clients/rodina.jpg',
  },
  {
    slug: 'maraval-oran',
    title: { fr: 'Hôtel Maraval — Oran', ar: 'فندق مارافال — وهران' },
    client: 'Hôtel Maraval',
    city: { fr: 'Oran', ar: 'وهران' },
    year: 2024,
    category: 'hotellerie',
    universes: ['hotellerie', 'portes', 'workspace'],
    featured: true,
    summary: {
      fr: 'Rénovation complète. Portes hôtelières acoustiques, mobilier lobby, équipement salles de séminaire.',
      ar: 'تجديد كامل. أبواب فندقية عازلة للصوت، أثاث الاستقبال، تجهيز قاعات الندوات.',
    },
    body: [
      {
        fr: "Projet de rénovation complète sur 8 mois. Notre équipe a coordonné les flux de production (portes, têtes de lit, banques d'accueil) avec les phases de chantier pour limiter l'impact sur l'exploitation de l'hôtel.",
        ar: 'مشروع تجديد كامل على مدى 8 أشهر. نسّق فريقنا تدفقات الإنتاج (أبواب، رؤوس سرير، مكاتب استقبال) مع مراحل المشروع للحد من تأثير ذلك على استغلال الفندق.',
      },
    ],
    metrics: [
      { value: '150', label: { fr: 'Chambres', ar: 'غرفة' } },
      { value: '8 mois', label: { fr: 'Rénovation', ar: 'مدة التجديد' } },
    ],
    image: '/images/realisations/maraval-oran.jpg',
  },
  {
    slug: 'hotel-ibiris',
    title: { fr: 'Hôtel Ibiris', ar: 'فندق إبيريس' },
    client: 'Hôtel Ibiris',
    city: { fr: 'Oran', ar: 'وهران' },
    year: 2021,
    category: 'hotellerie',
    universes: ['hotellerie', 'portes'],
    featured: true,
    summary: {
      fr: "Hôtel indépendant oranais. Portes palières acoustiques et ameublement complet des chambres standards et suites.",
      ar: 'فندق وهراني مستقل. أبواب طوابق عازلة للصوت وتأثيث كامل للغرف والأجنحة العادية.',
    },
    body: [
      {
        fr: "L'Hôtel Ibiris a choisi NDWI pour équiper l'ensemble de ses chambres et suites. Notre série Antea Hotel — déjà éprouvée sur d'autres établissements — a permis de respecter les exigences acoustiques d'une clientèle d'affaires tout en gardant un design contemporain. Coordination des livraisons par lots pour respecter le planning d'ouverture.",
        ar: 'اختار فندق إبيريس مجموعة NDWI لتجهيز كامل غرفه وأجنحته. سلسلتنا Antea Hotel — التي أثبتت جدارتها في مؤسسات أخرى — مكّنت من احترام المتطلبات الصوتية لزبائن الأعمال مع الحفاظ على تصميم معاصر. تنسيق التسليمات على دفعات لاحترام جدول الافتتاح.',
      },
    ],
    metrics: [{ value: '180', label: { fr: 'Chambres', ar: 'غرفة' } }],
    image: '/images/realisations/hotel-ibiris.jpg',
    clientLogo: '/images/clients/ibiris.jpg',
  },
];

export function getRealisationBySlug(slug: string): Realisation | undefined {
  return realisations.find((r) => r.slug === slug);
}

export function getFeaturedRealisations(limit = 6): Realisation[] {
  return realisations.filter((r) => r.featured).slice(0, limit);
}
