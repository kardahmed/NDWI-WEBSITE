import type { DoorProduct, DoorBrand } from './types';
import {
  REVETEMENTS_COMMUNS,
  REVETEMENTS_DJADO_EXCLUSIFS,
} from './door-options';

// Labels finitions — utilisés par l'ancien code (compat). Les vraies finitions
// PAIL sont dans door-finishes.ts (35+ options).
export const doorFinishLabels = {
  'laque-mat': { fr: 'Laqué mat', ar: 'مطلي مطفي' },
  'laque-brillant': { fr: 'Laqué brillant', ar: 'مطلي لامع' },
  'placage-bois': { fr: 'Placage bois', ar: 'تكسية خشبية' },
  'placage-noyer': { fr: 'Placage noyer', ar: 'تكسية جوز' },
  'placage-chene': { fr: 'Placage chêne', ar: 'تكسية سنديان' },
  stratifie: { fr: 'Stratifié', ar: 'صفائحي' },
  'vernis-naturel': { fr: 'Vernis naturel', ar: 'طلاء طبيعي' },
} as const;

export const doorCategoryLabels = {
  interieur: { fr: 'Portes intérieures', ar: 'أبواب داخلية' },
  entree: { fr: 'Portes d’entrée', ar: 'أبواب المدخل' },
} as const;

/** Modèles NDWi qui sont VRAIMENT configurables (production locale Oran).
 *  Source de vérité : toute porte dont le slug n'est pas dans cette liste
 *  est considérée comme NDO (importée, non personnalisable). */
export const NDWI_CONFIGURABLE_SLUGS = ['tolga', 'djado', 'phoenix', 'aures'] as const;

const NDWI_SET: ReadonlySet<string> = new Set<string>(NDWI_CONFIGURABLE_SLUGS);

/** True si la porte est NDWi configurable (whitelist stricte). */
export function isNdwiConfigurable(slug: string): boolean {
  return NDWI_SET.has(slug);
}

/**
 * Catalogue officiel NDWi PORTE — 20+ modèles.
 * Source : Catalogue PDF officiel, pages 6-52.
 *
 * Construction commune (sauf indication contraire) :
 * - BLOC PORTE A CHANT DROIT
 * - Composition 4D : Effet relief optionnel + Décors MDF + Panneaux MDF + Nid d'abeilles + Massif Finger-Jointed Fromager 5 couches
 * - Cadre Fromager 5 couches avec double noyau Épicéa, Revêtu CPL
 * - Structure Finger-Jointed Anti-Rotation
 * - Encollage polyuréthane
 * - Ouvrant Bois avec Remplissage tubulaire ou Nid d'abeille
 * - Poignée Magnétique en série
 */
export const doors: DoorProduct[] = [
  // ──────────────── Portes intérieures NDWi ────────────────
  {
    slug: 'tolga',
    name: 'TOLGA',
    serie: 'Porte intérieure',
    category: 'interieur',
    description: {
      fr: "Notre signature contemporaine. TOLGA est une porte intérieure NDWi de 36 mm d'épaisseur, à remplissage en nid d'abeille, cadre bois fromager 5 couches et chant ABS sur trois côtés. Au choix : serrure normale ou magnétique, poignées NDWI Chromée, NDWI Noire, BASICA 01 ou BASICA 02. Inserts en aluminium en option.",
      ar: 'توقيعنا المعاصر. TOLGA باب داخلي NDWi بسماكة 36 مم، حشو خلية نحل، إطار خشب فروماجير 5 طبقات وحرف ABS على الجوانب الثلاثة. الاختيار: قفل عادي أو مغناطيسي، مقابض NDWI كروم، NDWI أسود، BASICA 01 أو BASICA 02. إدراجات ألمنيوم اختيارية.',
    },
    shortDescription: {
      fr: 'Porte intérieure 36 mm · nid d’abeille · serrure normale/magnétique',
      ar: 'باب داخلي 36 مم · خلية نحل · قفل عادي/مغناطيسي',
    },
    composition: {
      fr: 'Cadre bois fromager 5 couches + double noyau épicéa · structure finger jointed anti-rotation · encollage polyuréthane · revêtement CPL hydrofuge anti-rayures · chant ABS 3 côtés · MDF 4 mm',
      ar: 'إطار خشب فروماجير 5 طبقات + نواة مزدوجة من أبيس · هيكل finger jointed مضاد للدوران · لصق بولي يوريثان · كسوة CPL مقاومة للرطوبة والخدش · حرف ABS على 3 جوانب · MDF 4 مم',
    },
    finishes: ['placage-chene', 'placage-noyer', 'laque-mat', 'placage-bois', 'vernis-naturel'],
    thicknesses: ['44mm'],
    technicalSpecs: { thicknessExact: '36 mm' },
    features: [
      { fr: 'Épaisseur 36 mm · remplissage en nid d’abeille', ar: 'سماكة 36 مم · حشو خلية نحل' },
      { fr: 'Cadre bois fromager 5 couches anti-rotation', ar: 'إطار خشب فروماجير 5 طبقات مقاوم للدوران' },
      { fr: 'Revêtement CPL hydrofuge et anti-rayures', ar: 'كسوة CPL مقاومة للرطوبة والخدش' },
      { fr: 'Au choix : serrure normale ou magnétique', ar: 'حسب الاختيار: قفل عادي أو مغناطيسي' },
      { fr: 'Inserts aluminium optionnels', ar: 'إدراجات ألمنيوم اختيارية' },
    ],
    compatibleRevetements: [...REVETEMENTS_COMMUNS],
    compatiblePoignees: ['ndwi-chromee', 'ndwi-noire', 'basica-01', 'basica-02'],
    compatibleSerrures: ['serrure-normale', 'serrure-magnetique'],
    compatibleRemplissages: ['nid-d-abeille'],
    compatibleVitrages: ['porte-pleine', 'vitre-pleine', 'vitre-laterale', 'mod-dmt', 'mod-ms', 'mod-rpy', 'mod-inf'],
    compatibleSens: ['gauche', 'droite'],
    dimensionsRange: { largeurMin: 60, largeurMax: 120, hauteurMin: 200, hauteurMax: 240 },
    // priceFromDZD: renseigné depuis Sanity (TOLGA) — affiche « sur devis » tant qu'absent
    gallery: [],
    badges: ['best-seller'],
  },
  {
    slug: 'djado',
    name: 'DJADO',
    serie: 'Porte intérieure',
    category: 'interieur',
    description: {
      fr: "DJADO est notre porte intérieure premium de 43 mm d'épaisseur, avec remplissage au choix entre nid d'abeille et tubulaire. Même construction que TOLGA mais plus épaisse, et avec 4 finitions exclusives en plus (NOCE MIRCO, ROVERE DELAVE, AZTECO et ARENA).",
      ar: 'DJADO هو بابنا الداخلي الفاخر بسماكة 43 مم، مع حشو بالاختيار بين خلية النحل والأنبوبي. نفس البناء مثل TOLGA لكن أكثر سماكة، مع 4 تشطيبات حصرية إضافية (NOCE MIRCO، ROVERE DELAVE، AZTECO و ARENA).',
    },
    shortDescription: { fr: 'Porte intérieure 43 mm · nid d’abeille ou tubulaire · 9 finitions', ar: 'باب داخلي 43 مم · خلية نحل أو أنبوبي · 9 تشطيبات' },
    composition: {
      fr: 'Identique à TOLGA — cadre bois fromager 5 couches, finger jointed anti-rotation, CPL hydrofuge, chant ABS 3 côtés. Choix du remplissage : nid d’abeille ou tubulaire.',
      ar: 'مماثل لـ TOLGA — إطار خشب فروماجير 5 طبقات، finger jointed مضاد للدوران، CPL مقاوم للرطوبة، حرف ABS على 3 جوانب. اختيار الحشو: خلية نحل أو أنبوبي.',
    },
    finishes: ['placage-noyer', 'placage-chene', 'laque-mat'],
    thicknesses: ['44mm'],
    technicalSpecs: { thicknessExact: '43 mm' },
    features: [
      { fr: 'Épaisseur 43 mm · remplissage nid d’abeille OU tubulaire', ar: 'سماكة 43 مم · حشو خلية نحل أو أنبوبي' },
      { fr: '9 finitions au total (4 exclusives à DJADO)', ar: '9 تشطيبات إجمالاً (4 حصرية لـ DJADO)' },
      { fr: 'Cadre bois fromager 5 couches anti-rotation', ar: 'إطار خشب فروماجير 5 طبقات' },
      { fr: 'Au choix : serrure normale ou magnétique', ar: 'حسب الاختيار: قفل عادي أو مغناطيسي' },
    ],
    compatibleRevetements: [...REVETEMENTS_COMMUNS, ...REVETEMENTS_DJADO_EXCLUSIFS],
    compatiblePoignees: ['ndwi-chromee', 'ndwi-noire', 'basica-01', 'basica-02'],
    compatibleSerrures: ['serrure-normale', 'serrure-magnetique'],
    compatibleRemplissages: ['nid-d-abeille', 'tubulaire'],
    compatibleVitrages: ['porte-pleine', 'vitre-pleine', 'vitre-laterale', 'mod-dmt', 'mod-ms', 'mod-rpy', 'mod-inf'],
    compatibleSens: ['gauche', 'droite'],
    dimensionsRange: { largeurMin: 60, largeurMax: 120, hauteurMin: 200, hauteurMax: 270 },
    // priceFromDZD: renseigné depuis Sanity (DJADO) — affiche « sur devis » tant qu'absent
    gallery: [],
    badges: ['best-seller'],
  },
  {
    slug: 'phoenix',
    name: 'PHOENIX',
    serie: 'Porte d’entrée',
    category: 'entree',
    description: {
      fr: "PHOENIX est notre porte d'entrée NDWi de 43 mm d'épaisseur, à serrure multi-point et œil de bœuf chromé. Dormant à chambranle télescopique Plywood recouvert CPL, joint PVC pour isolation phonique et thermique. Remplissage tubulaire, cadre bois fromager 5 couches.",
      ar: 'PHOENIX هو باب المدخل NDWi بسماكة 43 مم، قفل متعدد النقاط وعين بوب مطلية بالكروم. إطار تلسكوبي من Plywood مغطى بـ CPL، حشية PVC للعزل الصوتي والحراري. حشو أنبوبي، إطار خشب فروماجير 5 طبقات.',
    },
    shortDescription: { fr: 'Porte d’entrée 43 mm · serrure multipoint · œil de bœuf', ar: 'باب مدخل 43 مم · قفل متعدد النقاط · عين بوب' },
    composition: {
      fr: 'Cadre bois fromager 5 couches · dormant chambranle télescopique Plywood + CPL · joint PVC anti-bruit · remplissage tubulaire · revêtement CPL hautes performances anti-humidité',
      ar: 'إطار خشب فروماجير 5 طبقات · إطار تلسكوبي من Plywood + CPL · حشية PVC مضادة للضوضاء · حشو أنبوبي · كسوة CPL عالية الأداء مقاومة للرطوبة',
    },
    finishes: ['laque-mat', 'placage-bois', 'placage-chene'],
    thicknesses: ['50mm', '55mm'],
    technicalSpecs: { thicknessExact: '43 mm' },
    features: [
      { fr: 'Porte d’entrée 43 mm · remplissage tubulaire', ar: 'باب مدخل 43 مم · حشو أنبوبي' },
      { fr: 'Serrure multi-point en série', ar: 'قفل متعدد النقاط كمعيار' },
      { fr: 'Œil de bœuf chromé inclus', ar: 'عين بوب مكرومة مدرجة' },
      { fr: 'Dormant télescopique Plywood + joint PVC anti-bruit', ar: 'إطار تلسكوبي Plywood + حشية PVC مضادة للضوضاء' },
      { fr: 'Inserts aluminium optionnels', ar: 'إدراجات ألمنيوم اختيارية' },
    ],
    compatibleRevetements: [...REVETEMENTS_COMMUNS],
    compatiblePoignees: ['poignee-porte-entree'],
    compatibleSerrures: ['serrure-multipoint'],
    compatibleRemplissages: ['tubulaire'],
    compatibleVitrages: ['porte-pleine', 'vitre-pleine'],
    compatibleSens: ['gauche', 'droite'],
    dimensionsRange: { largeurMin: 80, largeurMax: 110, hauteurMin: 210, hauteurMax: 240 },
    // priceFromDZD: renseigné depuis Sanity (PHOENIX) — affiche « sur devis » tant qu'absent
    gallery: [],
    badges: ['nouveau'],
  },
  {
    slug: 'aures',
    name: 'AURÈS',
    serie: 'Porte d’entrée blindée',
    category: 'entree',
    description: {
      fr: "AURÈS est notre porte d'entrée blindée anti-effraction Classe 3, structure Made in Italy. Contre-châssis acier galvanisé avec 8 supports antidérapants, cadre acier époxy, structure périmétrique aluminium. Bouton extérieur + poignée intérieure aluminium brossé, lame de paraffine pour étanchéité bas de porte, œil de bœuf vision élargie.",
      ar: 'AURÈS هو باب المدخل المصفّح المضاد للاقتحام من الفئة 3، هيكل صنع في إيطاليا. هيكل مضاد من الفولاذ المجلفن مع 8 دعامات مضادة للانزلاق، إطار فولاذ إيبوكسي، هيكل محيطي من الألمنيوم. زر خارجي + مقبض داخلي من الألمنيوم المصقول، شفرة بارافين لإحكام أسفل الباب، عين بوب برؤية موسعة.',
    },
    shortDescription: { fr: 'Porte d’entrée blindée Classe 3 · structure Made in Italy', ar: 'باب مدخل مصفّح فئة 3 · هيكل إيطالي' },
    composition: {
      fr: 'Contre-châssis acier galvanisé · 8 supports antidérapants ancrage mur · cadre acier galvanisé peint époxy noir réglable · structure périmétrique aluminium époxy · lame de paraffine progressive · loquet en acier · œil de bœuf vision élargie',
      ar: 'هيكل مضاد من الفولاذ المجلفن · 8 دعامات مضادة للانزلاق · إطار فولاذ مجلفن مطلي إيبوكسي قابل للتعديل · هيكل محيطي من الألمنيوم إيبوكسي · شفرة بارافين تدريجية · مزلاج فولاذي · عين بوب برؤية موسعة',
    },
    finishes: ['placage-chene', 'placage-bois', 'laque-mat', 'vernis-naturel'],
    thicknesses: ['70mm'],
    technicalSpecs: { thicknessExact: '70 mm', securityClass: 'RC3', acousticDb: 35 },
    certifications: [
      { fr: 'Tenue à la charge du vent', ar: 'مقاومة حمل الرياح' },
      { fr: 'Structure étanche à l’eau', ar: 'هيكل مضاد للماء' },
      { fr: 'Étanchéité à l’air', ar: 'إحكام ضد الهواء' },
      { fr: 'Isolation thermique', ar: 'عزل حراري' },
      { fr: 'Isolation acoustique 35 dB', ar: 'عزل صوتي 35 ديسيبل' },
      { fr: 'Résistance à l’effraction Classe 3 (RC3)', ar: 'مقاومة الاقتحام الفئة 3 (RC3)' },
      { fr: 'Structure Made in Italie', ar: 'هيكل صنع في إيطاليا' },
    ],
    features: [
      { fr: 'Anti-effraction Classe 3 (RC3) certifiée', ar: 'مضاد للاقتحام معتمد فئة 3' },
      { fr: 'Contre-châssis acier galvanisé · 8 ancrages mur', ar: 'هيكل مضاد من الفولاذ المجلفن · 8 نقاط تثبيت' },
      { fr: 'Lame de paraffine étanchéité bas de porte', ar: 'شفرة بارافين لإحكام أسفل الباب' },
      { fr: 'Œil de bœuf vision élargie', ar: 'عين بوب برؤية موسعة' },
      { fr: 'Isolation acoustique 35 dB', ar: 'عزل صوتي 35 ديسيبل' },
    ],
    compatibleRevetements: [...REVETEMENTS_COMMUNS],
    compatiblePoignees: ['poignee-porte-blindee'],
    compatibleSerrures: ['serrure-blindee-classe-3'],
    compatibleRemplissages: ['acier-galvanise'],
    compatibleVitrages: ['porte-pleine'],
    compatibleSens: ['gauche', 'droite'],
    dimensionsRange: { largeurMin: 80, largeurMax: 110, hauteurMin: 210, hauteurMax: 230 },
    // priceFromDZD: renseigné depuis Sanity (AURÈS) — affiche « sur devis » tant qu'absent
    gallery: [],
    badges: ['nouveau'],
  },
  // ──────────────── Série GEO ────────────────
  {
    slug: 'geo-napoli',
    name: 'GEO NAPOLI',
    serie: 'GEO',
    category: 'interieur',
    description: {
      fr: "GEO NAPOLI (référence GEO 01) propose un cadre ERA avec panneau rectangulaire décalé. Finition Olmo Deserto, style contemporain épuré.",
      ar: 'تقدم GEO NAPOLI إطاراً ERA بلوح مستطيل متباعد. تشطيب Olmo Deserto، أسلوب معاصر راقٍ.',
    },
    shortDescription: { fr: 'Cadre ERA, panneau rectangulaire décalé', ar: 'إطار ERA، لوح مستطيل متباعد' },
    finishes: ['placage-chene', 'laque-mat'],
    thicknesses: ['44mm'],
    features: [
      { fr: 'Cadre ERA signature GEO', ar: 'إطار ERA توقيع GEO' },
      { fr: 'Finition Olmo Deserto', ar: 'تشطيب Olmo Deserto' },
    ],
    gallery: [],
  },
  {
    slug: 'geo-isernia',
    name: 'GEO ISERNIA',
    serie: 'GEO',
    category: 'interieur',
    description: {
      fr: "GEO ISERNIA (référence GEO 09) avec rainures horizontales sculptées. Finition Olmo Baltico pour un caractère scandinave.",
      ar: 'GEO ISERNIA بأخاديد أفقية محفورة. تشطيب Olmo Baltico بطابع إسكندنافي.',
    },
    shortDescription: { fr: 'Rainures horizontales, finition Olmo Baltico', ar: 'أخاديد أفقية، تشطيب Olmo Baltico' },
    finishes: ['placage-chene', 'stratifie'],
    thicknesses: ['44mm'],
    features: [{ fr: 'Rainures horizontales gravées', ar: 'أخاديد أفقية محفورة' }],
    gallery: [],
  },
  {
    slug: 'geo-cosenza',
    name: 'GEO COSENZA',
    serie: 'GEO',
    category: 'interieur',
    description: {
      fr: "GEO COSENZA (référence GEO 08) — vantail lisse avec cadre ERA, finition Olmo Deserto. La sobriété parfaite.",
      ar: 'GEO COSENZA — مصراع أملس مع إطار ERA، تشطيب Olmo Deserto. البساطة المثالية.',
    },
    shortDescription: { fr: 'Vantail lisse, cadre ERA', ar: 'مصراع أملس، إطار ERA' },
    finishes: ['placage-chene', 'laque-mat'],
    thicknesses: ['44mm'],
    features: [{ fr: 'Vantail lisse premium', ar: 'مصراع أملس فاخر' }],
    gallery: [],
  },
  // ──────────────── Série MARSIA (MS) ────────────────
  {
    slug: 'marsia',
    name: 'MARSIA',
    serie: 'MARSIA MS',
    category: 'interieur',
    description: {
      fr: "MARSIA conjugue tradition et modernité — disponible en versions Lisse, Vitrage Piega (pliante), Scorrevole (coulissante), Vitrage Symétrique et avec inserts. La série la plus polyvalente du catalogue.",
      ar: 'تجمع MARSIA بين التراث والحداثة — متوفرة بإصدارات أملس، Vitrage Piega، Scorrevole، Vitrage Symétrique.',
    },
    shortDescription: { fr: 'Polyvalente, multiples variantes (pliante, coulissante, vitrée)', ar: 'متعددة الاستخدامات' },
    finishes: ['placage-chene', 'laque-mat', 'placage-noyer', 'vernis-naturel'],
    thicknesses: ['44mm'],
    features: [
      { fr: 'Vantail Lisse, Cadre Line', ar: 'مصراع أملس، إطار Line' },
      { fr: 'Version Scorrevole (coulissante)', ar: 'إصدار Scorrevole (منزلق)' },
      { fr: 'Version Vitrage Piega (pliante)', ar: 'إصدار Vitrage Piega (قابل للطي)' },
      { fr: 'Symétrique double-vantail avec couvre-joints semifilo', ar: 'مزدوج المصراع متماثل' },
    ],
    panelClip: 'polygon(30% 3%, 78% 3%, 78% 88%, 30% 88%)',
    gallery: [],
    badges: ['best-seller'],
  },
  // ──────────────── Série ANTEA ────────────────
  {
    slug: 'antea',
    name: 'ANTEA',
    serie: 'ANTEA',
    category: 'interieur',
    description: {
      fr: "ANTEA Vetro Asimmetrico — finition Rovere Castagno Cera avec vitrage vertical asymétrique. Signature hôtelière haut de gamme, idéale pour suites et lobbies.",
      ar: 'ANTEA Vetro Asimmetrico — تشطيب Rovere Castagno Cera مع زجاج عمودي غير متماثل. توقيع فندقي راقٍ.',
    },
    shortDescription: { fr: 'Vitrage vertical asymétrique, finition Rovere', ar: 'زجاج عمودي غير متماثل' },
    finishes: ['placage-bois', 'placage-noyer', 'placage-chene', 'stratifie'],
    thicknesses: ['50mm', '55mm'],
    features: [
      { fr: 'Vitrage asymétrique signature', ar: 'زجاج غير متماثل مميز' },
      { fr: 'Renforts haute résistance', ar: 'تعزيزات عالية المقاومة' },
      { fr: 'Acoustique renforcée 32 dB', ar: 'عزل صوتي 32 ديسيبل' },
    ],
    technicalSpecs: { acousticDb: 32 },
    panelClip: 'polygon(12% 9%, 50% 9%, 50% 89%, 12% 89%)',
    gallery: [],
    badges: ['sur-mesure'],
  },
  // ──────────────── STELLA ────────────────
  {
    slug: 'stella',
    name: 'STELLA',
    serie: 'STELLA',
    category: 'interieur',
    description: {
      fr: "STELLA réinterprète la porte classique italienne avec ses panneaux à moulures surélevées. Idéale pour les intérieurs néo-classiques en laqué blanc.",
      ar: 'تعيد STELLA تفسير الباب الكلاسيكي الإيطالي بألواحها ذات القوالب البارزة. مثالية للديكورات الكلاسيكية الجديدة.',
    },
    shortDescription: { fr: 'Panneaux à moulures, classique italien', ar: 'ألواح بقوالب، كلاسيكي إيطالي' },
    finishes: ['laque-mat', 'laque-brillant', 'placage-chene'],
    thicknesses: ['44mm'],
    features: [
      { fr: 'Moulures classiques 3 panneaux', ar: 'قوالب كلاسيكية 3 ألواح' },
      { fr: 'Laqué blanc premium', ar: 'مطلي أبيض فاخر' },
    ],
    panelClip: 'polygon(45% 10%, 88% 10%, 88% 95%, 45% 95%)',
    gallery: [],
  },
  // ──────────────── Série PREMIUM ────────────────
  {
    slug: 'precious',
    name: 'PRECIOUS',
    serie: 'PREMIUM',
    category: 'interieur',
    description: {
      fr: "PRECIOUS — Bande de dentelle digitale en relief sur fond laqué blanc brillant. Œuvre d'art sculptée numériquement pour les intérieurs de prestige.",
      ar: 'PRECIOUS — شريط دانتيل رقمي ناتئ على خلفية لامعة بيضاء. عمل فني منحوت رقمياً للديكورات الراقية.',
    },
    shortDescription: { fr: 'Dentelle digitale relief, laqué blanc brillant', ar: 'دانتيل رقمي ناتئ، أبيض لامع' },
    finishes: ['laque-brillant', 'laque-mat'],
    thicknesses: ['44mm'],
    features: [
      { fr: 'Relief sculpté numériquement', ar: 'نقش منحوت رقمياً' },
      { fr: 'Pièce signature pour intérieurs de prestige', ar: 'قطعة مميزة للديكورات الفخمة' },
    ],
    gallery: [],
    badges: ['sur-mesure'],
  },
  {
    slug: 'appeal',
    name: 'APPEAL',
    serie: 'PREMIUM',
    category: 'interieur',
    description: {
      fr: "APPEAL — Bois open-pore teinté Tabacco/Moro Cera avec impression digitale de dentelle laissant transparaître les pores du bois. Effet noir-doré spectaculaire.",
      ar: 'APPEAL — خشب مفتوح المسام بطباعة رقمية تكشف عن مسام الخشب. تأثير أسود-ذهبي مذهل.',
    },
    shortDescription: { fr: 'Bois open-pore + dentelle digitale', ar: 'خشب مفتوح المسام + دانتيل رقمي' },
    finishes: ['placage-noyer', 'placage-bois'],
    thicknesses: ['44mm'],
    features: [{ fr: 'Open-pore Rovere Tabacco/Moro Cera', ar: 'مفتوح المسام Rovere Tabacco/Moro Cera' }],
    gallery: [],
    badges: ['nouveau'],
  },
  {
    slug: 'prima-one',
    name: 'PRIMA ONE',
    serie: 'PREMIUM',
    category: 'interieur',
    description: {
      fr: "PRIMA ONE — Porte linéaire minimaliste avec bord en acier inoxydable visible même fermée. Disponible en finitions laquées brillantes haute brillance.",
      ar: 'PRIMA ONE — باب خطي مينمالي بحافة فولاذية مرئية حتى عند الإغلاق. متوفر بتشطيبات لامعة عالية اللمعان.',
    },
    shortDescription: { fr: 'Bord acier visible, laqué brillant', ar: 'حافة فولاذية مرئية، لامعة' },
    finishes: ['laque-brillant', 'laque-mat'],
    thicknesses: ['44mm'],
    features: [
      { fr: 'Profilé inox visible toute hauteur', ar: 'مقطع فولاذي مرئي بكامل الارتفاع' },
      { fr: 'Laqué Bordeaux Shiny / Carbone Shiny', ar: 'لامع بوردو/كربون' },
    ],
    gallery: [],
  },
  {
    slug: 'prima-taylor',
    name: 'PRIMA TAYLOR',
    serie: 'PREMIUM',
    category: 'interieur',
    description: {
      fr: "PRIMA TAYLOR — Composition multi-panneaux en bois précieux Olive avec inserts brillants. Charnière de section apparente comme élément décoratif.",
      ar: 'PRIMA TAYLOR — تكوين متعدد الألواح من خشب الزيتون الفاخر مع إدراجات لامعة.',
    },
    shortDescription: { fr: 'Bois Olive multi-panneaux, charnière apparente', ar: 'خشب زيتون متعدد الألواح' },
    finishes: ['placage-bois', 'placage-noyer'],
    thicknesses: ['44mm'],
    features: [
      { fr: 'Bois précieux Olive', ar: 'خشب الزيتون الفاخر' },
      { fr: 'Section hinge décorative', ar: 'مفصل قطاع زخرفي' },
    ],
    gallery: [],
    badges: ['sur-mesure'],
  },
  {
    slug: 'eterea-laquee',
    name: 'ETEREA LAQUÉE',
    serie: 'PREMIUM',
    category: 'interieur',
    description: {
      fr: "ETEREA LAQUÉE — Bande métallique brevetée intégrant poignée et serrure dans un seul profilé vertical. Innovation technique signature NDWi.",
      ar: 'ETEREA LAQUÉE — شريط معدني ببراءة اختراع يدمج المقبض والقفل في ملف واحد. ابتكار تقني مميز.',
    },
    shortDescription: { fr: 'Bande métallique intégrée (poignée+serrure)', ar: 'شريط معدني مدمج' },
    finishes: ['laque-mat', 'laque-brillant'],
    thicknesses: ['44mm'],
    features: [
      { fr: 'Brevet bande métallique intégrée', ar: 'براءة اختراع الشريط المعدني المدمج' },
      { fr: 'Poignée + serrure unifiées', ar: 'مقبض + قفل موحدان' },
    ],
    gallery: [],
    badges: ['nouveau'],
  },
  {
    slug: 'animalier-guepard',
    name: 'ANIMALIER GUEPARD',
    serie: 'PREMIUM',
    category: 'interieur',
    description: {
      fr: "ANIMALIER GUEPARD — Porte laquée rouge avec relief sculpté motif léopard. Pièce unique pour boudoirs et chambres d'exception.",
      ar: 'ANIMALIER GUEPARD — باب لامع أحمر بنقش منحوت بنقش الفهد. قطعة فريدة للغرف الاستثنائية.',
    },
    shortDescription: { fr: 'Laqué rouge, motif léopard sculpté', ar: 'لامع أحمر، نقش فهد منحوت' },
    finishes: ['laque-brillant'],
    thicknesses: ['44mm'],
    features: [
      { fr: 'Relief léopard sculpté en bas-relief', ar: 'نقش فهد منحوت بارز' },
      { fr: 'Laqué Bordeaux Shiny haute brillance', ar: 'لامع بوردو عالي اللمعان' },
    ],
    gallery: [],
    badges: ['sur-mesure'],
  },
  // ──────────────── Portes BLINDÉES ────────────────
  {
    slug: 'stopper-forza-4',
    name: 'Stopper Forza 4',
    serie: 'Stopper',
    category: 'interieur',
    brand: 'ndo',
    description: {
      fr: "Porte blindée classe 4 anti-effraction CE — 18 points de verrouillage, sous-châssis acier galvanisé 10/20, peinture epoxy noire. Réduction phonique 30 dB de série (35/38 dB en option). Panneaux disponibles : lisse, pantographié, élite, aluminium, PVC, pierre, verre.",
      ar: 'باب مصفّح فئة 4 ضد السرقة CE — 18 نقطة قفل، إطار فولاذي مجلفن 10/20، طلاء إيبوكسي أسود. عزل صوتي 30 ديسيبل (35/38 خياري).',
    },
    shortDescription: { fr: 'Classe 4 CE · 18 points · 30 dB · U=1.97', ar: 'فئة 4 CE · 18 نقطة قفل' },
    finishes: ['placage-chene', 'placage-noyer', 'laque-mat'],
    thicknesses: ['70mm'],
    features: [
      { fr: 'Anti-effraction classe 4 (CE)', ar: 'ضد السرقة فئة 4 (CE)' },
      { fr: '18 points de verrouillage', ar: '18 نقطة قفل' },
      { fr: 'Renforts oméga acier', ar: 'تعزيزات أوميغا فولاذية' },
      { fr: 'Réduction phonique 30 dB (kits 35/38)', ar: 'عزل صوتي 30 ديسيبل (طقم 35/38)' },
      { fr: 'Transmission thermique U=1.97 W/m²K', ar: 'ناقلية حرارية U=1.97' },
      { fr: 'Panneaux : lisse, pantographié, élite, alu, PVC, pierre, verre', ar: 'ألواح: أملس، محفور، صفوة، ألومنيوم، PVC، حجر، زجاج' },
    ],
    technicalSpecs: { securityClass: 'RC4', acousticDb: 30 },
    gallery: [],
    badges: ['best-seller'],
  },
  {
    slug: 'blocker-plain',
    name: 'Blocker Plain',
    serie: 'Blocker',
    category: 'interieur',
    brand: 'ndo',
    description: {
      fr: 'Porte blindée RC3 au design contemporain, parfaite pour appartements et villas urbaines.',
      ar: 'باب مصفّح RC3 بتصميم معاصر، مثالي للشقق والفلل الحضرية.',
    },
    shortDescription: { fr: 'Classe RC3, design urbain', ar: 'فئة RC3، تصميم حضري' },
    finishes: ['laque-mat', 'placage-chene'],
    thicknesses: ['60mm'],
    features: [
      { fr: 'Classe de sécurité RC3', ar: 'فئة أمان RC3' },
      { fr: 'Serrure 5 points', ar: 'قفل 5 نقاط' },
    ],
    technicalSpecs: { securityClass: 'RC3', acousticDb: 38 },
    gallery: [],
  },
  // ──────────────── Portes TECHNIQUES ────────────────
  {
    slug: 'coupe-feu-ei60',
    name: 'Coupe-feu EI60',
    serie: 'Tecnica',
    category: 'interieur',
    brand: 'ndo',
    description: {
      fr: "Porte coupe-feu certifiée EI60. Joints intumescents périphériques, ferme-porte intégré. Conforme aux normes ERP (hôtellerie, tertiaire, santé, enseignement).",
      ar: 'باب مقاوم للحريق معتمد EI60. مفصلات منتفخة محيطية، مغلق باب مدمج.',
    },
    shortDescription: { fr: 'EI60 certifié, joints intumescents', ar: 'EI60 معتمد، مفصلات منتفخة' },
    finishes: ['placage-chene', 'placage-noyer', 'stratifie'],
    thicknesses: ['55mm', '60mm'],
    features: [
      { fr: 'Certification EI60', ar: 'شهادة EI60' },
      { fr: 'Joints intumescents périphériques', ar: 'مفصلات منتفخة محيطية' },
      { fr: 'Ferme-porte intégré KIT LIBRA', ar: 'مغلق باب مدمج KIT LIBRA' },
    ],
    technicalSpecs: { fireRating: 'EI60' },
    gallery: [],
  },
  {
    slug: 'hotel-paliere',
    name: 'Hôtel Palière',
    serie: 'Antea Hotel',
    category: 'interieur',
    brand: 'ndo',
    description: {
      fr: 'Porte palière hôtelière combinant coupe-feu EI30, acoustique 32 dB, anti-pince-doigt, et compatibilité RFID. Conforme normes Marriott, Accor, Hilton.',
      ar: 'باب طابق فندقي يجمع EI30، عزل صوتي 32 ديسيبل، مانع لانحشار الأصابع، توافق RFID.',
    },
    shortDescription: { fr: 'EI30 + acoustique + anti-pince + RFID', ar: 'EI30 + عزل صوتي + مانع انحشار + RFID' },
    finishes: ['placage-chene', 'placage-noyer'],
    thicknesses: ['55mm'],
    features: [
      { fr: 'Coupe-feu EI30', ar: 'مقاوم للحريق EI30' },
      { fr: 'Acoustique 32 dB', ar: 'عزل صوتي 32 ديسيبل' },
      { fr: 'Anti-pince-doigt', ar: 'مانع لانحشار الأصابع' },
      { fr: 'Compatibilité serrure RFID (Yale / multi-points)', ar: 'متوافق مع قفل RFID' },
    ],
    technicalSpecs: { fireRating: 'EI30', acousticDb: 32 },
    gallery: [],
    badges: ['sur-mesure'],
  },
];

export function getDoorBySlug(slug: string): DoorProduct | undefined {
  return doors.find((d) => d.slug === slug);
}

export function getDoorsByCategory(category?: string): DoorProduct[] {
  if (!category) return doors;
  return doors.filter((d) => d.category === category);
}

/** Retourne la marque effective d'une porte.
 *  La whitelist NDWI_CONFIGURABLE_SLUGS est la source de vérité absolue :
 *  - slug ∈ whitelist  → 'ndwi' (production locale, configurable)
 *  - sinon             → 'ndo'  (importation, produit fini)
 *  Le champ `d.brand` du document est ignoré pour éviter toute incohérence
 *  entre les seeds, Sanity, et la logique métier réelle de NDWi/NDO. */
export function getDoorBrand(d: Pick<DoorProduct, 'slug'>): DoorBrand {
  return isNdwiConfigurable(d.slug) ? 'ndwi' : 'ndo';
}

/** Labels marque cohérents avec products.ts (réutilise les mêmes valeurs). */
export const doorBrandLabels: Record<DoorBrand, { fr: string; ar: string; tagline: { fr: string; ar: string } }> = {
  ndwi: {
    fr: 'NDWi',
    ar: 'NDWi',
    tagline: { fr: 'Production locale Algérie', ar: 'إنتاج محلي الجزائر' },
  },
  ndo: {
    fr: 'NDO',
    ar: 'NDO',
    tagline: { fr: 'Importation', ar: 'استيراد' },
  },
};
