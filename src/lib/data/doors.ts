import type { DoorProduct, DoorBrand } from './types';

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
  // ──────────────── Série 4D Quercia Calderone ────────────────
  {
    slug: 'tolga',
    name: 'TOLGA',
    serie: '4D',
    category: 'interieur',
    description: {
      fr: "Notre signature contemporaine. La série TOLGA, en finition Quercia Calderone 4D, offre la chaleur du bois véritable avec une résistance à l'usure supérieure. Disponible en versions plain, INF, RFX, MS et vitrée.",
      ar: 'توقيعنا المعاصر. سلسلة TOLGA بتشطيب Quercia Calderone 4D، تقدم دفء الخشب الحقيقي مع مقاومة عالية للتآكل.',
    },
    shortDescription: {
      fr: 'Signature contemporaine, finition 4D, technologie magnétique',
      ar: 'توقيع معاصر، تشطيب رباعي الأبعاد',
    },
    finishes: ['placage-chene', 'placage-noyer', 'laque-mat', 'placage-bois', 'vernis-naturel'],
    thicknesses: ['44mm'],
    features: [
      { fr: 'Composition 4D — relief tactile optionnel', ar: 'تركيبة رباعية الأبعاد — نقش ملموس اختياري' },
      { fr: 'Cadre Fromager 5 couches anti-rotation', ar: 'إطار من 5 طبقات مقاوم للدوران' },
      { fr: 'Poignée magnétique en série', ar: 'مقبض مغناطيسي قياسي' },
      { fr: 'Versions : Plain · INF · RFX · MS · Vitrée', ar: 'إصدارات: عادي، INF، RFX، MS، زجاجي' },
    ],
    gallery: [],
    badges: ['best-seller'],
  },
  {
    slug: 'djado',
    name: 'DJADO',
    serie: '4D',
    category: 'interieur',
    description: {
      fr: "DJADO INF affirme un caractère architectural fort avec ses inserts métalliques verticaux décalés. La série 4D apporte la chaleur du bois et la durabilité d'un revêtement haute performance.",
      ar: 'تُظهر DJADO INF طابعاً معمارياً قوياً بإدراجاتها المعدنية العمودية. سلسلة 4D تجلب دفء الخشب ومتانة التغليف عالي الأداء.',
    },
    shortDescription: { fr: 'Caractère architectural, inserts métalliques', ar: 'طابع معماري، إدراجات معدنية' },
    finishes: ['placage-noyer', 'placage-chene', 'laque-mat'],
    thicknesses: ['44mm'],
    features: [
      { fr: 'Inserts INF métalliques verticaux décalés', ar: 'إدراجات INF معدنية عمودية متباعدة' },
      { fr: 'Hauteur jusqu\'à 2,70 m', ar: 'ارتفاع حتى 2.70 م' },
      { fr: 'Composition 4D anti-usure', ar: 'تركيبة 4D مقاومة للتآكل' },
    ],
    panelClip: 'polygon(37% 12%, 78% 12%, 78% 90%, 37% 90%)',
    gallery: [],
  },
  {
    slug: 'phoenix',
    name: 'PHOENIX',
    serie: '4D',
    category: 'interieur',
    description: {
      fr: "PHOENIX réinvente la porte minimaliste avec une épaisseur premium de 51 mm+. Disponible en versions INF, RFX et MS, elle accepte les inserts vitrés verticaux pour un effet lumineux.",
      ar: 'تعيد PHOENIX ابتكار الباب المينمالي بسماكة فاخرة من 51 مم. متوفرة في إصدارات INF وRFX وMS، تقبل الإدراجات الزجاجية العمودية.',
    },
    shortDescription: { fr: 'Minimaliste premium 51 mm+, inserts vitrés', ar: 'مينمالي فاخر 51 مم+، إدراجات زجاجية' },
    finishes: ['laque-mat', 'placage-bois', 'placage-chene'],
    thicknesses: ['50mm', '55mm'],
    features: [
      { fr: 'Épaisseur premium 51 mm et plus', ar: 'سماكة فاخرة 51 مم وأكثر' },
      { fr: 'Inserts vitrés INF / RFX / MS', ar: 'إدراجات زجاجية INF/RFX/MS' },
      { fr: 'Charnières POLIGLASS invisibles compatibles', ar: 'متوافق مع مفصلات POLIGLASS الخفية' },
      { fr: 'Effet mur-porte affleurant', ar: 'أثر جدار-باب مستوٍ' },
    ],
    gallery: [],
    badges: ['nouveau'],
  },
  {
    slug: 'aures',
    name: 'AURÈS',
    serie: '4D',
    category: 'interieur',
    description: {
      fr: 'AURÈS — signature locale NDWi inspirée des reliefs algériens. Porte intérieure 4D personnalisable : choix du revêtement, de la poignée, du sens d’ouverture et des dimensions, fabriquée à l’usine d’Oran.',
      ar: 'AURÈS — توقيع محلي من NDWi مستوحى من تضاريس الأوراس. باب داخلي رباعي الأبعاد قابل للتخصيص: اختيار الكسوة، المقبض، اتجاه الفتح والأبعاد، يُصنَّع في مصنع وهران.',
    },
    shortDescription: {
      fr: 'Signature locale 4D, entièrement personnalisable',
      ar: 'توقيع محلي رباعي الأبعاد، قابل للتخصيص بالكامل',
    },
    finishes: ['placage-chene', 'placage-bois', 'laque-mat', 'vernis-naturel'],
    thicknesses: ['44mm', '50mm'],
    features: [
      { fr: 'Production locale Oran — délais maîtrisés', ar: 'إنتاج محلي بوهران — آجال مدروسة' },
      { fr: 'Configurable : revêtement, poignée, sens, dimensions', ar: 'قابل للتخصيص: كسوة، مقبض، اتجاه، أبعاد' },
      { fr: 'Composition 4D anti-usure', ar: 'تركيبة رباعية الأبعاد مقاومة للتآكل' },
      { fr: 'Poignée magnétique en série', ar: 'مقبض مغناطيسي كمعيار' },
    ],
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
