import type { LocalizedString } from './types';

export interface WorkspaceCategory {
  slug: string;
  name: LocalizedString;
  shortDesc: LocalizedString;
  longDesc: LocalizedString;
  features: LocalizedString[];
  image: string;
}

export const workspaceCategories: WorkspaceCategory[] = [
  {
    slug: 'direction',
    name: { fr: 'Mobilier de direction', ar: 'أثاث المديريات' },
    shortDesc: {
      fr: 'Bureaux exécutifs, fauteuils signature, rangements design.',
      ar: 'مكاتب تنفيذية، كراسي مميزة، وحدات تخزين بتصميم راقٍ.',
    },
    longDesc: {
      fr: "L'expression du leadership. Nos collections de direction signées par les références italiennes — bureaux sculpturaux, fauteuils en cuir pleine fleur, bibliothèques sur-mesure — créent des espaces qui incarnent l'autorité avec élégance.",
      ar: 'تعبير عن القيادة. مجموعاتنا المخصصة للمدراء، الموقّعة من أهم الدور الإيطالية — مكاتب نحتية، كراسي بجلد فاخر، مكتبات حسب الطلب — تخلق فضاءات تجسّد الهيبة بأناقة.',
    },
    features: [
      { fr: 'Bureaux exécutifs sur-mesure', ar: 'مكاتب تنفيذية حسب الطلب' },
      { fr: 'Fauteuils cuir pleine fleur', ar: 'كراسي جلد طبيعي فاخر' },
      { fr: 'Bibliothèques & rangements coordonnés', ar: 'مكتبات ووحدات تخزين متناسقة' },
    ],
    image: '/images/workspace/direction.jpg',
  },
  {
    slug: 'open-space',
    name: { fr: 'Open space & postes de travail', ar: 'الفضاءات المفتوحة ومحطات العمل' },
    shortDesc: {
      fr: 'Postes individuels et collaboratifs, ergonomie certifiée.',
      ar: 'محطات فردية وجماعية، هندسة بشرية معتمدة.',
    },
    longDesc: {
      fr: "Espaces de travail repensés pour la productivité et le bien-être. Postes individuels modulaires, bench collaboratifs, écrans acoustiques et solutions d'organisation pour des open spaces qui respectent la concentration.",
      ar: 'فضاءات عمل مُعاد تصميمها لتحقيق الإنتاجية والراحة. محطات فردية معيارية، طاولات تعاونية، حواجز عازلة للصوت وحلول تنظيم لفضاءات مفتوحة تحترم التركيز.',
    },
    features: [
      { fr: 'Bureaux réglables en hauteur (sit-stand)', ar: 'مكاتب قابلة لتعديل الارتفاع' },
      { fr: 'Bench 2-6 postes modulables', ar: 'طاولات جماعية قابلة للتعديل من 2 إلى 6 أشخاص' },
      { fr: 'Écrans acoustiques certifiés', ar: 'حواجز عازلة للصوت معتمدة' },
      { fr: 'Sièges ergonomiques BIFMA', ar: 'كراسي مريحة بشهادة BIFMA' },
    ],
    image: '/images/workspace/open-space.jpg',
  },
  {
    slug: 'reunion',
    name: { fr: 'Salles de réunion', ar: 'قاعات الاجتماعات' },
    shortDesc: {
      fr: 'Tables, sièges, intégration AV. Du board à la salle visio.',
      ar: 'طاولات، كراسي، تجهيز سمعي بصري. من قاعة الإدارة إلى قاعة الفيديو.',
    },
    longDesc: {
      fr: "Des salles pour décider, présenter, convaincre. Tables grand format avec passe-câbles intégrés, sièges visiteurs élégants, intégration AV pour la visioconférence — tout pensé pour que vos réunions soient à la hauteur de vos ambitions.",
      ar: 'قاعات لاتخاذ القرارات، التقديم والإقناع. طاولات كبيرة بأنظمة كابلات مدمجة، كراسي ضيوف أنيقة، تجهيز سمعي بصري للاجتماعات عن بعد — كل شيء مصمم ليكون اجتماعك في مستوى طموحاتك.',
    },
    features: [
      { fr: 'Tables 6-20 personnes', ar: 'طاولات لـ 6 إلى 20 شخصاً' },
      { fr: 'Passe-câbles & boitiers AV intégrés', ar: 'تمرير الكابلات وعلب التجهيز السمعي البصري' },
      { fr: 'Sièges visiteurs assortis', ar: 'كراسي ضيوف متناسقة' },
      { fr: 'Tableaux & écrans intégrables', ar: 'لوحات وشاشات قابلة للدمج' },
    ],
    image: '/images/workspace/reunion.jpg',
  },
  {
    slug: 'reception',
    name: { fr: 'Réception & accueil', ar: 'الاستقبال' },
    shortDesc: {
      fr: 'Banques d\'accueil, salons visiteurs, première impression maîtrisée.',
      ar: 'مكاتب استقبال، صالونات للزوار، انطباع أول محكم.',
    },
    longDesc: {
      fr: "L'espace qui parle pour vous avant même que vous n'arriviez. Banques d'accueil sur-mesure intégrant signalétique et éclairage, salons visiteurs aux finitions hôtelières, vestiaires et meubles de courtoisie.",
      ar: 'الفضاء الذي يتحدث عنك قبل وصولك. مكاتب استقبال حسب الطلب تدمج اللوحات الإرشادية والإضاءة، صالونات للزوار بتشطيبات فندقية، خزائن وأثاث مجاملة.',
    },
    features: [
      { fr: 'Banques d\'accueil sur-mesure', ar: 'مكاتب استقبال حسب الطلب' },
      { fr: 'Signalétique & logo intégrés', ar: 'لوحات إرشادية ودمج الشعار' },
      { fr: 'Salons visiteurs design', ar: 'صالونات استقبال بتصميم راقٍ' },
    ],
    image: '/images/workspace/reception.jpg',
  },
  {
    slug: 'cloisons',
    name: { fr: 'Cloisons & agencement', ar: 'الحواجز والتجهيز' },
    shortDesc: {
      fr: 'Modulables, acoustiques, vitrées ou pleines.',
      ar: 'قابلة للتعديل، عازلة للصوت، زجاجية أو مصمتة.',
    },
    longDesc: {
      fr: "Reconfigurer l'espace sans gros œuvre. Cloisons amovibles vitrées toute hauteur, bulles acoustiques pour visios et phone booths, séparations modulables. Vos bureaux évoluent à mesure que votre organisation grandit.",
      ar: 'إعادة تشكيل الفضاء دون أشغال كبرى. حواجز قابلة للنقل بزجاج بكامل الارتفاع، كبائن صوتية للاجتماعات عن بعد، فواصل قابلة للتعديل. مكاتبك تتطور مع نمو مؤسستك.',
    },
    features: [
      { fr: 'Cloisons vitrées toute hauteur', ar: 'حواجز زجاجية بكامل الارتفاع' },
      { fr: 'Phone booth acoustique 40 dB', ar: 'كابينة هاتف عازلة 40 ديسيبل' },
      { fr: 'Démontables & réutilisables', ar: 'قابلة للفك وإعادة الاستخدام' },
    ],
    image: '/images/workspace/cloisons.jpg',
  },
];

export const workspaceProcess = [
  {
    step: '01',
    title: { fr: 'Étude & visite', ar: 'الدراسة والزيارة' },
    desc: {
      fr: 'Nous visitons vos locaux et analysons vos besoins : équipes, flux, identité, ambiance souhaitée.',
      ar: 'نزور مكاتبك ونحلّل احتياجاتك: الفرق، التدفقات، الهوية، الأجواء المطلوبة.',
    },
  },
  {
    step: '02',
    title: { fr: 'Plans & sélection', ar: 'المخططات والاختيار' },
    desc: {
      fr: 'Plans 2D/3D, planches d\'ambiance, sélection produits dans nos catalogues européens.',
      ar: 'مخططات ثنائية وثلاثية الأبعاد، لوحات أجواء، اختيار المنتجات من كتالوجاتنا الأوروبية.',
    },
  },
  {
    step: '03',
    title: { fr: 'Devis & validation', ar: 'عرض السعر والتحقق' },
    desc: {
      fr: 'Devis détaillé, échantillons matériaux et finitions, validation avec vos décideurs.',
      ar: 'عرض سعر مفصل، عينات المواد والتشطيبات، التحقق مع صانعي القرار لديكم.',
    },
  },
  {
    step: '04',
    title: { fr: 'Importation & livraison', ar: 'الاستيراد والتوصيل' },
    desc: {
      fr: 'Commande aux ateliers européens, suivi logistique, livraison Algérie avec dédouanement.',
      ar: 'الطلب من الورش الأوروبية، متابعة لوجستية، توصيل إلى الجزائر مع التخليص الجمركي.',
    },
  },
  {
    step: '05',
    title: { fr: 'Installation', ar: 'التركيب' },
    desc: {
      fr: 'Pose par nos équipes Oran, mise en service, formation à l\'usage si nécessaire.',
      ar: 'التركيب من قبل فرقنا في وهران، التشغيل، التدريب على الاستخدام عند الحاجة.',
    },
  },
];

// À remplir avec les références NDO confirmées + logos officiels.
// Ne PAS inventer de noms — laisser vide tant que le client n'a pas validé.
export const workspaceReferences: { name: string; sector: { fr: string; ar: string } }[] = [];
