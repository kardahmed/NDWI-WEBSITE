import type { LocalizedString } from './types';

// Valeurs / piliers — issus de la philosophie du cahier des charges (Italian-Mediterranean premium)
export const groupeValues: { icon: string; title: LocalizedString; body: LocalizedString }[] = [
  {
    icon: 'craft',
    title: { fr: 'Savoir-faire industriel', ar: 'الخبرة الصناعية' },
    body: {
      fr: "Une usine moderne à Oran, des équipes formées aux standards italiens, des partenariats techniques avec les références européennes. La fabrication algérienne au plus haut niveau.",
      ar: 'مصنع حديث في وهران، فرق مدرّبة على المعايير الإيطالية، شراكات تقنية مع المراجع الأوروبية. الصناعة الجزائرية في أعلى المستويات.',
    },
  },
  {
    icon: 'italian',
    title: { fr: "Esprit italien", ar: 'الروح الإيطالية' },
    body: {
      fr: "Le design, les matériaux, le sens du détail : tout l'ADN du Groupe NDWI puise dans la culture italienne de la maison et du meuble. Une exigence permanente.",
      ar: 'التصميم، المواد، الإحساس بالتفاصيل: كل DNA مجموعة NDWI ينبع من الثقافة الإيطالية للمنزل والأثاث. متطلب دائم.',
    },
  },
  {
    icon: 'service',
    title: { fr: 'Service intégré', ar: 'خدمة متكاملة' },
    body: {
      fr: "De la prescription architecturale à la pose, du SAV à la maintenance : un seul interlocuteur, une responsabilité totale sur l'ensemble du parcours client.",
      ar: 'من التوصية المعمارية إلى التركيب، من خدمة ما بعد البيع إلى الصيانة: مُحاور واحد، مسؤولية كاملة على كامل مسار العميل.',
    },
  },
  {
    icon: 'algerian',
    title: { fr: 'Fierté algérienne', ar: 'الفخر الجزائري' },
    body: {
      fr: "Investir dans la production locale, former des talents algériens, équiper les plus beaux projets du pays : notre mission dépasse le commerce, elle nourrit une ambition industrielle nationale.",
      ar: 'الاستثمار في الإنتاج المحلي، تكوين المواهب الجزائرية، تجهيز أجمل مشاريع البلاد: مهمتنا تتجاوز التجارة، إنها تغذّي طموحاً صناعياً وطنياً.',
    },
  },
];

// Chiffres usine — à valider par le client (placeholders prudents)
export const groupeFactoryStats: { value: string; label: LocalizedString; note?: LocalizedString }[] = [
  {
    value: '2',
    label: { fr: 'Pôles d\'activité', ar: 'قطبا نشاط' },
    note: { fr: 'NDWI Habitat + NDO Workspace', ar: 'NDWI للسكن + NDO لفضاء العمل' },
  },
  {
    value: '4',
    label: { fr: 'Showrooms', ar: 'معارض' },
    note: { fr: 'Oran, Alger, Setif, Chlef', ar: 'وهران، الجزائر، سطيف، الشلف' },
  },
  {
    value: '3',
    label: { fr: 'Partenaires italiens', ar: 'شركاء إيطاليون' },
    note: { fr: 'ARAN, PAIL, ICA', ar: 'ARAN، PAIL، ICA' },
  },
];

// Équipe / Direction — uniquement infos confirmées par le cahier
// Mohamed Bahri = PDG mentionné dans le cahier (section 16 Contact)
export interface TeamMember {
  name: string;
  role: LocalizedString;
  bio?: LocalizedString;
  photo?: string;
  linkedin?: string;
}

export const teamMembers: TeamMember[] = [
  {
    name: 'Mohamed Bahri',
    role: { fr: 'Président — Groupe NDWI', ar: 'الرئيس — مجموعة NDWI' },
    // Bio à fournir par le client
  },
];

/** Fondateur / dirigeant principal — section dédiée sur /groupe. */
export const founder: TeamMember & { vision?: LocalizedString } = {
  name: 'Mohamed Bahri',
  role: { fr: 'Fondateur & Président du Groupe NDWI', ar: 'مؤسس ورئيس مجموعة NDWI' },
  bio: {
    fr: "Industriel algérien, Mohamed Bahri fonde le Groupe NDWI à Oran avec une conviction : la fabrication algérienne peut rivaliser avec les meilleures références internationales. Vingt années d'investissement dans la formation, l'outil industriel et les partenariats italiens premium pour bâtir un acteur unique du secteur habitat & workspace en Algérie.",
    ar: 'صناعي جزائري، أسس محمد بحري مجموعة NDWI في وهران بقناعة راسخة: الصناعة الجزائرية قادرة على منافسة أفضل المراجع الدولية. عشرون سنة من الاستثمار في التكوين والأدوات الصناعية والشراكات الإيطالية الفاخرة لبناء فاعل فريد في قطاع السكن وفضاء العمل في الجزائر.',
  },
  vision: {
    fr: "« Notre ambition n'est pas de copier l'Italie, c'est de bâtir un savoir-faire algérien qui s'inscrit dans cette tradition d'exigence — avec nos talents, nos matériaux, notre fierté. »",
    ar: '"طموحنا ليس تقليد إيطاليا، بل بناء معرفة جزائرية تنخرط في هذا التقليد من المتطلبات — بمواهبنا ومواردنا وفخرنا."',
  },
};

/** Références emblématiques — projets livrés majeurs. */
export interface Reference {
  client: string;
  type: LocalizedString;
  scope: LocalizedString;
  year?: string;
}

/**
 * Références clients officielles, groupées par nature.
 * Liste validée par le client (promoteurs + institutions publiques).
 *
 * Chaque entrée prévoit un emplacement `logo` (chemin sous /public/images/references/).
 * Tant que le logo n'est pas fourni, le composant affiche le nom dans un cadre.
 */
export interface ClientReferenceItem {
  name: string;
  logo?: string;
}

export interface ClientReferenceGroup {
  category: LocalizedString;
  clients: ClientReferenceItem[];
}

export const clientReferences: ClientReferenceGroup[] = [
  {
    category: { fr: 'Promoteurs & entreprises', ar: 'المرقّون والشركات' },
    clients: [
      { name: 'Benamar Promotion' },
      { name: 'Chili Promotion' },
      { name: 'Provico Promotion' },
      { name: 'HNTP' },
      { name: 'SPIL' },
    ],
  },
  {
    category: { fr: 'Institutions & organismes publics', ar: 'المؤسسات والهيئات العمومية' },
    clients: [
      { name: "Grande Mosquée d'Alger", logo: '/images/references/grande-mosquee-alger.png' },
      { name: "Ministère de l'Habitat", logo: '/images/references/ministere-habitat.png' },
      { name: 'Ministère de la Défense Nationale', logo: '/images/references/ministere-defense.png' },
      { name: 'Ministère de la Justice', logo: '/images/references/ministere-justice.png' },
      { name: "Ministère de l'Intérieur", logo: '/images/references/ministere-interieur.png' },
      { name: 'Ministère du Tourisme', logo: '/images/references/ministere-tourisme.png' },
    ],
  },
  {
    category: { fr: 'Hôtellerie', ar: 'الفندقة' },
    clients: [
      { name: 'Marriott Bab Ezzouar' },
      { name: 'Hôtel Rodina' },
      { name: 'Hôtel Maraval' },
    ],
  },
];

/**
 * Projets détaillés avec chiffres (scope, année).
 * VIDE pour l'instant : les anciennes entrées hôtelières étaient des exemples
 * non confirmés et ont été retirées (risque crédibilité). À remplir avec de
 * vrais projets validés par le client. Les références officielles (promoteurs +
 * institutions) restent affichées via `clientReferences` ci-dessus.
 */
export const references: Reference[] = [];

/** Prochain projet stratégique du groupe — annonce/teaser. */
export const nextProject: {
  status: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  highlights: LocalizedString[];
  date?: LocalizedString;
} = {
  status: { fr: 'En cours · 2026', ar: 'قيد التنفيذ · 2026' },
  title: {
    fr: "Extension de l'usine d'Oran",
    ar: 'توسعة مصنع وهران',
  },
  description: {
    fr: "Doublement de la capacité de production : nouvelle ligne dédiée aux cuisines équipées, atelier sur-mesure dimensionné pour la commande hôtelière grande série, plate-forme logistique. Objectif 2026 : 100 emplois supplémentaires créés et passage à l'export régional (Maghreb).",
    ar: 'مضاعفة الطاقة الإنتاجية: خط إنتاج جديد مخصص للمطابخ المجهزة، ورشة حسب الطلب مصممة لطلبات الفندقة الكبرى، منصة لوجستية. الهدف 2026: خلق 100 وظيفة إضافية والانتقال إلى التصدير الإقليمي (المغرب العربي).',
  },
  highlights: [
    { fr: 'Doublement de la surface usine', ar: 'مضاعفة مساحة المصنع' },
    { fr: '100 emplois directs créés', ar: '100 وظيفة مباشرة جديدة' },
    { fr: 'Ligne dédiée cuisines série', ar: 'خط إنتاج مخصص للمطابخ الكبرى' },
    { fr: 'Ouverture export Maghreb', ar: 'فتح التصدير نحو المغرب العربي' },
  ],
};
