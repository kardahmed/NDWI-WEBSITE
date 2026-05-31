import type { HabitatCategory } from './types';

export const habitatCategories: HabitatCategory[] = [
  {
    slug: 'portes',
    name: { fr: 'Portes', ar: 'الأبواب' },
    description: {
      fr: 'Intérieures, blindées, techniques. 7 séries signature, 35 finitions, technologie 4D.',
      ar: 'داخلية، مصفّحة، تقنية. 7 سلاسل مميزة، 35 تشطيباً، تقنية رباعية الأبعاد.',
    },
    image: '/images/categories/portes.jpg',
    count: 20,
  },
  {
    slug: 'cuisines',
    name: { fr: 'Cuisines', ar: 'المطابخ' },
    description: {
      fr: 'Cuisines équipées sur-mesure, alliance du design italien et de la fabrication algérienne.',
      ar: 'مطابخ مجهزة حسب الطلب، تحالف بين التصميم الإيطالي والتصنيع الجزائري.',
    },
    image: '/images/categories/cuisines.jpg',
  },
  {
    slug: 'chambres',
    name: { fr: 'Chambres', ar: 'غرف النوم' },
    description: {
      fr: 'Chambres complètes, têtes de lit, rangements intégrés. Cohérence parfaite avec vos portes.',
      ar: 'غرف نوم كاملة، رؤوس سرير، وحدات تخزين مدمجة. تناغم تام مع أبوابك.',
    },
    image: '/images/categories/chambres.jpg',
  },
  {
    slug: 'dressing',
    name: { fr: 'Dressing', ar: 'خزائن الملابس' },
    description: {
      fr: 'Dressing sur-mesure, modulaires ou intégrés. Aménagements intelligents et finitions raffinées.',
      ar: 'خزائن ملابس حسب الطلب، معيارية أو مدمجة. ترتيبات ذكية وتشطيبات راقية.',
    },
    image: '/images/categories/dressing.jpg',
  },
  {
    slug: 'bureaux',
    name: { fr: 'Bureaux', ar: 'المكاتب' },
    description: {
      fr: 'Mobilier de bureau exécutif et workspace : open-space, direction, salles de réunion. NDWi production locale + NDO importation.',
      ar: 'أثاث المكاتب التنفيذية وفضاءات العمل: مكاتب مفتوحة، إدارة، قاعات اجتماعات. إنتاج محلي NDWi + استيراد NDO.',
    },
    image: '/images/categories/bureaux.jpg',
  },
  {
    slug: 'salons',
    name: { fr: 'Salons', ar: 'الصالونات' },
    description: {
      fr: 'Salons et espaces de réception : canapés, tables basses, meubles TV. NDWi production locale + NDO importation italienne.',
      ar: 'صالونات وفضاءات الاستقبال: أرائك، طاولات منخفضة، أثاث تلفزيون. إنتاج محلي NDWi + استيراد إيطالي NDO.',
    },
    image: '/images/categories/salons.jpg',
  },
  {
    slug: 'hotellerie',
    name: { fr: 'Mobilier hôtelier', ar: 'الأثاث الفندقي' },
    description: {
      fr: 'Suites complètes, lobby, restauration. Notre savoir-faire reconnu par Marriott, Rodina, Maraval.',
      ar: 'أجنحة كاملة، استقبال، مطاعم. خبرتنا معترف بها من ماريوت، رودينا، مارافال.',
    },
    image: '/images/categories/hotellerie.jpg',
  },
  {
    slug: 'finitions',
    name: { fr: 'Gamme de finitions', ar: 'مجموعة التشطيبات' },
    description: {
      fr: '35 nuances pour personnaliser chaque projet. Laqués, placages bois, stratifiés haute densité.',
      ar: '35 لوناً لتخصيص كل مشروع. مطلية، تكسيات خشبية، صفائحية عالية الكثافة.',
    },
    image: '/images/categories/finitions.jpg',
    count: 35,
  },
];
