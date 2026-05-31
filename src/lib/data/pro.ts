import type { LocalizedString } from './types';

export type ProAudience = 'architectes' | 'promoteurs' | 'hoteliers' | 'distributeurs';

export interface ProBenefit {
  title: LocalizedString;
  description: LocalizedString;
}

export interface ProAudienceContent {
  slug: ProAudience;
  eyebrow: LocalizedString;
  title: LocalizedString;
  subtitle: LocalizedString;
  promise: LocalizedString;
  benefits: ProBenefit[];
  // Field overrides for the lead form
  leadType: 'pro';
  univers?: 'portes' | 'cuisines' | 'chambres' | 'dressing' | 'hotellerie' | 'bureaux' | 'autre';
  ctaPrimary: LocalizedString;
  ctaSecondary?: LocalizedString;
  /** Image éditoriale de la cible (hero pro/[slug] + carte home) */
  image?: string;
}

export const proAudiences: ProAudienceContent[] = [
  {
    slug: 'architectes',
    eyebrow: { fr: 'Architectes & Bureaux d\'études', ar: 'المهندسون المعماريون ومكاتب الدراسات' },
    title: {
      fr: 'Vos prescriptions méritent un partenaire à la hauteur.',
      ar: 'تستحق توصياتك شريكاً في المستوى.',
    },
    subtitle: {
      fr: "Catalogues techniques, fiches CCTP, échantillons, accompagnement projet — l'Architects Club du Groupe NDWI vous donne accès à tout ce dont vous avez besoin pour spécifier nos produits sur vos chantiers.",
      ar: 'كتالوجات تقنية، بطاقات CCTP، عينات، مرافقة المشاريع — Architects Club مجموعة NDWI يمنحك الوصول إلى كل ما تحتاجه لتوصية منتجاتنا في مشاريعك.',
    },
    promise: {
      fr: 'Membre Architects Club',
      ar: 'عضو Architects Club',
    },
    benefits: [
      {
        title: { fr: 'Catalogues techniques', ar: 'كتالوجات تقنية' },
        description: {
          fr: 'PDF haute qualité par univers (portes, cuisines, hôtellerie). Plans, coupes, dimensions, finitions.',
          ar: 'ملفات PDF عالية الجودة حسب كل عالم (أبواب، مطابخ، فندقة). مخططات، مقاطع، أبعاد، تشطيبات.',
        },
      },
      {
        title: { fr: 'Fiches CCTP', ar: 'بطاقات CCTP' },
        description: {
          fr: 'Cahier des clauses techniques particulières prêt à intégrer dans vos dossiers d\'appel d\'offres.',
          ar: 'دفتر الشروط التقنية الخاصة جاهز للدمج في ملفات المناقصات.',
        },
      },
      {
        title: { fr: 'Échantillons matériaux', ar: 'عينات مواد' },
        description: {
          fr: 'Demande d\'échantillons (finitions, placages, poignées) envoyés sous 48 h à votre cabinet.',
          ar: 'طلب عينات (تشطيبات، تكسيات، مقابض) ترسل خلال 48 ساعة إلى مكتبك.',
        },
      },
      {
        title: { fr: 'Visites usine privées', ar: 'زيارات خاصة للمصنع' },
        description: {
          fr: 'Visite guidée de notre site de production à Oran. Idéal pour comprendre nos process.',
          ar: 'زيارة مرشدة لموقع الإنتاج في وهران. مثالية لفهم عملياتنا.',
        },
      },
      {
        title: { fr: 'Accompagnement projet', ar: 'مرافقة المشاريع' },
        description: {
          fr: 'Un référent NDWI dédié sur chacun de vos projets. Réponse technique sous 24 h.',
          ar: 'مرافق NDWI مخصص لكل مشروع. إجابة تقنية خلال 24 ساعة.',
        },
      },
      {
        title: { fr: 'Conditions préférentielles', ar: 'شروط تفضيلية' },
        description: {
          fr: 'Tarifs négociés pour les projets prescrits par votre cabinet.',
          ar: 'أسعار تفضيلية للمشاريع التي يوصي بها مكتبك.',
        },
      },
    ],
    leadType: 'pro',
    univers: 'autre',
    ctaPrimary: { fr: 'Rejoindre l\'Architects Club', ar: 'الانضمام إلى Architects Club' },
    ctaSecondary: { fr: 'Télécharger le catalogue', ar: 'تحميل الكتالوج' },
    image: '/images/pro/architectes.jpg',
  },
  {
    slug: 'promoteurs',
    eyebrow: { fr: 'Promoteurs immobiliers', ar: 'المرقّون العقاريون' },
    title: {
      fr: 'Du studio au lot de 200 logements, une seule équipe.',
      ar: 'من الاستوديو إلى 200 سكن، فريق واحد.',
    },
    subtitle: {
      fr: "Le Groupe NDWI accompagne les promoteurs sur des programmes de toutes tailles. Portes, cuisines, dressings cohérents, livraisons phasées selon votre planning, équipe dédiée et garanties constructeur.",
      ar: 'تواكب مجموعة NDWI المرقّين العقاريين في برامج من جميع الأحجام. أبواب ومطابخ وخزائن متناسقة، تسليمات على مراحل حسب جدولكم، فريق مخصص وضمانات صناعية.',
    },
    promise: {
      fr: 'Volume + délais maîtrisés',
      ar: 'حجم + آجال محكمة',
    },
    benefits: [
      {
        title: { fr: 'Capacité industrielle', ar: 'طاقة صناعية' },
        description: {
          fr: 'Notre usine d\'Oran absorbe jusqu\'à 500 portes/mois en production continue, sans sacrifier la qualité.',
          ar: 'يستوعب مصنعنا في وهران إنتاج حتى 500 باب شهرياً بإنتاج متواصل، دون التضحية بالجودة.',
        },
      },
      {
        title: { fr: 'Livraisons phasées', ar: 'تسليمات على مراحل' },
        description: {
          fr: 'Synchronisation avec votre planning chantier (gros œuvre → second œuvre → livraison). Pas de stockage inutile.',
          ar: 'تزامن مع جدول الورشة (الأشغال الكبرى → الأشغال الثانوية → التسليم). دون تخزين عديم الجدوى.',
        },
      },
      {
        title: { fr: 'Packs cohérents', ar: 'حزم متناسقة' },
        description: {
          fr: 'Portes intérieures, blindées, cuisines, dressings : 1 fournisseur, 1 facture, 1 garantie.',
          ar: 'أبواب داخلية، مصفّحة، مطابخ، خزائن: مورّد واحد، فاتورة واحدة، ضمان واحد.',
        },
      },
      {
        title: { fr: 'Référent commercial dédié', ar: 'مرافق تجاري مخصص' },
        description: {
          fr: 'Un seul interlocuteur du devis à la levée des réserves, pour fluidifier les échanges.',
          ar: 'مُحاور واحد من العرض إلى رفع التحفظات، لتسهيل المراسلات.',
        },
      },
      {
        title: { fr: 'Conditions volume', ar: 'شروط الحجم' },
        description: {
          fr: 'Grille tarifaire dégressive dès 30 logements. Étude personnalisée au-delà de 100 logements.',
          ar: 'جدول أسعار تنازلي ابتداءً من 30 سكناً. دراسة مخصصة ابتداءً من 100 سكن.',
        },
      },
      {
        title: { fr: 'Service après-vente', ar: 'خدمة ما بعد البيع' },
        description: {
          fr: 'Intervention sous 72 h en garantie pour les acquéreurs, dans toute la wilaya où le programme est livré.',
          ar: 'التدخل خلال 72 ساعة في إطار الضمان لصالح المشترين، في الولاية التي سُلّم فيها البرنامج.',
        },
      },
    ],
    leadType: 'pro',
    univers: 'autre',
    ctaPrimary: { fr: 'Étudier mon programme', ar: 'دراسة برنامجي' },
    image: '/images/pro/promoteurs.jpg',
  },
  {
    slug: 'hoteliers',
    eyebrow: { fr: 'Hôteliers & Tertiaire', ar: 'الفندقة والقطاع الثالث' },
    title: {
      fr: 'Les standards Marriott, depuis Oran.',
      ar: 'معايير ماريوت، من وهران.',
    },
    subtitle: {
      fr: "Coupe-feu EI30/EI60, acoustique 32 dB, anti-pince-doigt, RFID compatible, finitions hôtelières. Notre série Antea Hotel a déjà équipé des hôtels Marriott, Rodina, Maraval — pourquoi pas le vôtre ?",
      ar: 'مقاومة الحريق EI30/EI60، عزل صوتي 32 ديسيبل، مانع لانحشار الأصابع، متوافق مع RFID، تشطيبات فندقية. سلسلتنا Antea Hotel جهّزت بالفعل فنادق ماريوت، رودينا، مارافال — لمَ لا فندقكم؟',
    },
    promise: {
      fr: 'Normes hôtelières internationales',
      ar: 'معايير فندقية دولية',
    },
    benefits: [
      {
        title: { fr: 'Conformité normes', ar: 'الالتزام بالمعايير' },
        description: {
          fr: 'Coupe-feu EI30 et EI60 certifiés. Acoustique 32 dB testée. Conforme aux exigences Marriott, Accor, Hilton.',
          ar: 'مقاومة حريق EI30 وEI60 معتمدة. عزل صوتي 32 ديسيبل مختبَر. متوافق مع متطلبات ماريوت وأكور وهيلتون.',
        },
      },
      {
        title: { fr: 'Anti-pince-doigt', ar: 'مانع لانحشار الأصابع' },
        description: {
          fr: 'Système de protection charnière côté chambre. Norme exigée par les chaînes internationales.',
          ar: 'نظام حماية المفصل من جهة الغرفة. معيار تشترطه السلاسل الدولية.',
        },
      },
      {
        title: { fr: 'Compatibilité RFID', ar: 'توافق RFID' },
        description: {
          fr: 'Serrures RFID compatibles avec tous les systèmes PMS hôteliers du marché.',
          ar: 'أقفال RFID متوافقة مع جميع أنظمة PMS الفندقية في السوق.',
        },
      },
      {
        title: { fr: 'Mobilier hôtelier complet', ar: 'أثاث فندقي كامل' },
        description: {
          fr: 'Au-delà des portes : têtes de lit, dressings, banques d\'accueil, mobilier de séminaires.',
          ar: 'إلى جانب الأبواب: رؤوس سرير، خزائن، مكاتب استقبال، أثاث الندوات.',
        },
      },
      {
        title: { fr: 'Coordination chantier', ar: 'تنسيق الورشة' },
        description: {
          fr: 'Synchronisation avec architectes, ensembliers, designers internationaux selon le standard de la marque.',
          ar: 'تزامن مع المهندسين، المنسّقين، المصممين الدوليين حسب معيار العلامة.',
        },
      },
      {
        title: { fr: 'Maintenance opérationnelle', ar: 'صيانة تشغيلية' },
        description: {
          fr: 'Contrats d\'entretien pluriannuels pour les éléments à forte sollicitation (portes palières, charnières).',
          ar: 'عقود صيانة متعددة السنوات للعناصر ذات الاستعمال الكثيف (أبواب الطوابق، المفصلات).',
        },
      },
    ],
    leadType: 'pro',
    univers: 'hotellerie',
    ctaPrimary: { fr: 'Étudier mon projet hôtelier', ar: 'دراسة مشروعي الفندقي' },
    ctaSecondary: { fr: 'Voir nos références', ar: 'عرض مراجعنا' },
    image: '/images/pro/hoteliers.jpg',
  },
  {
    slug: 'distributeurs',
    eyebrow: { fr: 'Devenir distributeur partenaire', ar: 'كن موزعاً شريكاً' },
    title: {
      fr: 'Représenter NDWI dans votre wilaya.',
      ar: 'تمثيل NDWI في ولايتكم.',
    },
    subtitle: {
      fr: "Le Groupe NDWI ouvre son réseau à des partenaires distributeurs sélectionnés. Exclusivité territoriale, support marketing, formation produit et conditions commerciales attractives.",
      ar: 'تفتح مجموعة NDWI شبكتها أمام شركاء موزعين مختارين. حصرية إقليمية، دعم تسويقي، تكوين على المنتجات وشروط تجارية جذابة.',
    },
    promise: {
      fr: 'Programme partenaire',
      ar: 'برنامج الشراكة',
    },
    benefits: [
      {
        title: { fr: 'Exclusivité territoriale', ar: 'حصرية إقليمية' },
        description: {
          fr: 'Un seul distributeur par wilaya cible. Pas de concurrence interne sur votre zone.',
          ar: 'موزّع واحد لكل ولاية مستهدفة. لا منافسة داخلية على منطقتكم.',
        },
      },
      {
        title: { fr: 'Marges attractives', ar: 'هوامش جذابة' },
        description: {
          fr: 'Grille tarifaire distributeur avec marges progressives selon volume annuel atteint.',
          ar: 'جدول أسعار الموزع بهوامش تصاعدية حسب الحجم السنوي المحقق.',
        },
      },
      {
        title: { fr: 'Formation produit', ar: 'تكوين على المنتجات' },
        description: {
          fr: 'Formation initiale + recyclage annuel à Oran pour vos équipes commerciales et techniques.',
          ar: 'تكوين أولي + تحديث سنوي في وهران لفرقكم التجارية والتقنية.',
        },
      },
      {
        title: { fr: 'Support marketing', ar: 'دعم تسويقي' },
        description: {
          fr: 'PLV, échantillons, présentoirs, contenu digital co-brandé fourni par notre équipe marketing.',
          ar: 'مواد ترويجية في نقاط البيع، عينات، عوارض، محتوى رقمي مشترك العلامة من فريقنا التسويقي.',
        },
      },
      {
        title: { fr: 'Showroom de marque', ar: 'معرض العلامة' },
        description: {
          fr: 'Accompagnement à l\'aménagement d\'un showroom NDWI dans vos locaux, prise en charge partielle.',
          ar: 'مرافقة في تجهيز معرض NDWI في مقركم، مع تكفل جزئي.',
        },
      },
      {
        title: { fr: 'Référencement digital', ar: 'الإدراج الرقمي' },
        description: {
          fr: 'Votre point de vente listé sur ndwi-dz.com et Google Business. Trafic qualifié dirigé vers vous.',
          ar: 'نقطة بيعكم مدرجة على ndwi-dz.com وغوغل أعمالي. حركة مؤهلة موجهة إليكم.',
        },
      },
    ],
    leadType: 'pro',
    univers: 'autre',
    ctaPrimary: { fr: 'Candidater au programme', ar: 'الترشح للبرنامج' },
    image: '/images/pro/distributeurs.jpg',
  },
];

export function getProAudience(slug: ProAudience): ProAudienceContent | undefined {
  return proAudiences.find((p) => p.slug === slug);
}
