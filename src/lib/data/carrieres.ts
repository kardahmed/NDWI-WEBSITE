import type { LocalizedString } from './types';

export interface JobOffer {
  slug: string;
  title: LocalizedString;
  department: LocalizedString;
  location: LocalizedString;
  contractType: 'CDI' | 'CDD' | 'Stage' | 'Alternance';
  experience: LocalizedString;
  summary: LocalizedString;
}

// Liste à remplir par le client (DRH NDWI). Tant que vide → empty state élégant.
export const jobOffers: JobOffer[] = [];

export const careerReasons: { title: LocalizedString; body: LocalizedString }[] = [
  {
    title: { fr: 'Un projet industriel ambitieux', ar: 'مشروع صناعي طموح' },
    body: {
      fr: "Participer à la croissance d'un acteur algérien qui produit localement aux standards européens. Votre travail équipe les plus beaux projets du pays.",
      ar: 'المشاركة في نمو فاعل جزائري ينتج محلياً وفق المعايير الأوروبية. عملك يجهّز أجمل مشاريع البلاد.',
    },
  },
  {
    title: { fr: 'Une culture italienne du métier', ar: 'ثقافة إيطالية للحرفة' },
    body: {
      fr: "Nos partenariats avec ARAN, PAIL, ICA vous donnent accès à l'expertise italienne du design et de la fabrication haut de gamme.",
      ar: 'شراكاتنا مع ARAN وPAIL وICA تمنحك الوصول إلى الخبرة الإيطالية في التصميم والتصنيع الراقي.',
    },
  },
  {
    title: { fr: 'Formation continue', ar: 'تكوين مستمر' },
    body: {
      fr: 'Sessions en Italie chez nos partenaires, formations techniques internes, montée en compétences sur les normes hôtelières internationales.',
      ar: 'دورات في إيطاليا لدى شركائنا، تكوينات تقنية داخلية، تطوير الكفاءات في المعايير الفندقية الدولية.',
    },
  },
  {
    title: { fr: 'Une équipe à taille humaine', ar: 'فريق على المقاس البشري' },
    body: {
      fr: 'Chez NDWI, chaque personne compte. Décisions rapides, autonomie réelle, proximité de la direction et impact direct sur le résultat.',
      ar: 'في NDWI، كل شخص يهم. قرارات سريعة، استقلالية فعلية، قرب من الإدارة وتأثير مباشر على النتيجة.',
    },
  },
  {
    title: { fr: 'Implantation oranaise', ar: 'تموقع وهراني' },
    body: {
      fr: "Notre siège est à Oran (zone d'activités El Karma). Une wilaya dynamique, où la qualité de vie reste compatible avec une carrière industrielle ambitieuse.",
      ar: 'مقرنا في وهران (المنطقة الصناعية الكرمة). ولاية ديناميكية، حيث جودة الحياة تبقى متوافقة مع مهنة صناعية طموحة.',
    },
  },
  {
    title: { fr: 'Rémunération motivante', ar: 'أجر محفّز' },
    body: {
      fr: "Au-delà du salaire, nous proposons participation aux résultats, formations payées, mutuelle santé et perspective d'évolution rapide pour les profils engagés.",
      ar: 'إلى جانب الراتب، نقترح المشاركة في النتائج، تكوينات مدفوعة، تأمين صحي وآفاق ترقي سريعة للملفات الملتزمة.',
    },
  },
];
