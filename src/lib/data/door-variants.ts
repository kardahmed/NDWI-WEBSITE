import type { LocalizedString } from './types';

// ============================================================================
// Type d'ouverture
// ============================================================================
export type OpeningType = 'battant' | 'coulissant' | 'pivot' | 'pliant';

export const openingTypes: { slug: OpeningType; name: LocalizedString; description: LocalizedString }[] = [
  {
    slug: 'battant',
    name: { fr: 'Battante', ar: 'مفصلية' },
    description: { fr: "L'ouverture classique sur paumelles", ar: 'الفتح الكلاسيكي على مفصلات' },
  },
  {
    slug: 'coulissant',
    name: { fr: 'Coulissante (Scorrevole)', ar: 'منزلقة' },
    description: { fr: 'Glisse sur rail (Marsia Scorrevole)', ar: 'تنزلق على قضيب (Marsia Scorrevole)' },
  },
  {
    slug: 'pivot',
    name: { fr: 'Pivot', ar: 'محورية' },
    description: { fr: 'Pivote sur axe central (effet spectaculaire)', ar: 'تدور على محور مركزي' },
  },
  {
    slug: 'pliant',
    name: { fr: 'Pliante (Piega)', ar: 'قابلة للطي' },
    description: { fr: "Se plie en accordéon (Marsia Vitrage Piega)", ar: 'تطوى مثل الأكورديون' },
  },
];

// ============================================================================
// Sens d'ouverture
// ============================================================================
export type Handedness = 'left-push' | 'left-pull' | 'right-push' | 'right-pull';

export const handednessOptions: { slug: Handedness; name: LocalizedString; icon: string }[] = [
  { slug: 'left-push', name: { fr: 'Gauche · poussant', ar: 'يسار · دافع' }, icon: '↰' },
  { slug: 'left-pull', name: { fr: 'Gauche · tirant', ar: 'يسار · ساحب' }, icon: '↲' },
  { slug: 'right-push', name: { fr: 'Droite · poussant', ar: 'يمين · دافع' }, icon: '↱' },
  { slug: 'right-pull', name: { fr: 'Droite · tirant', ar: 'يمين · ساحب' }, icon: '↳' },
];

// ============================================================================
// Charnières / Paumelles — NUBEL ANUBA & POLIGLASS (catalogue p.36)
// ============================================================================
export type HingeType = 'nubel-anuba' | 'poliglass-visible' | 'poliglass-invisible';
export type HingeFinish = 'inox' | 'cromato' | 'ottone' | 'noir-mat';

export const hingeTypes: { slug: HingeType; name: string; description: LocalizedString }[] = [
  {
    slug: 'nubel-anuba',
    name: 'NUBEL ANUBA',
    description: {
      fr: 'Charnières traditionnelles visibles, robustes, finition inox',
      ar: 'مفصلات تقليدية مرئية، متينة، تشطيب فولاذي',
    },
  },
  {
    slug: 'poliglass-visible',
    name: 'POLIGLASS Visible',
    description: {
      fr: 'Charnières POLIGLASS réglables 3D (hauteur, profondeur, latéral)',
      ar: 'مفصلات POLIGLASS قابلة للتعديل ثلاثياً',
    },
  },
  {
    slug: 'poliglass-invisible',
    name: 'POLIGLASS Invisible',
    description: {
      fr: 'Charnières POLIGLASS cachées dans le bâti (look minimaliste)',
      ar: 'مفصلات POLIGLASS مخفية في الإطار (مظهر مينمالي)',
    },
  },
];

export const hingeFinishLabels: Record<HingeFinish, LocalizedString> = {
  inox: { fr: 'Inox brossé', ar: 'فولاذ مصقول' },
  cromato: { fr: 'Cromato (Chrome)', ar: 'كروم' },
  ottone: { fr: 'Ottone (Laiton)', ar: 'نحاس' },
  'noir-mat': { fr: 'Noir mat', ar: 'أسود مطفأ' },
};

export function hingeFinishToColor(finish?: HingeFinish): string {
  switch (finish) {
    case 'cromato':
      return '#D8D8D8';
    case 'inox':
      return '#B8B8B8';
    case 'ottone':
      return '#C9A55C';
    case 'noir-mat':
      return '#1A1A1A';
    default:
      return '#888888';
  }
}

// ============================================================================
// Serrures (catalogue p.36-37) — Yale, Magnétique, Multi-points, KIT LIBRA
// ============================================================================
export type LockType =
  | 'magnetique'
  | 'condamnation'
  | 'yale-brevet'
  | 'multi-points'
  | 'kit-libra';

export const lockTypes: { slug: LockType; name: string; description: LocalizedString }[] = [
  {
    slug: 'magnetique',
    name: 'Serrure magnétique',
    description: {
      fr: "Fermeture silencieuse par aimant (poignée magnétique sur portes série 4D)",
      ar: 'إغلاق صامت بمغناطيس (مقبض مغناطيسي على أبواب سلسلة 4D)',
    },
  },
  {
    slug: 'condamnation',
    name: 'Serrure à condamnation',
    description: {
      fr: 'Verrou intérieur libre/occupé (WC, salle de bain)',
      ar: 'قفل داخلي حر/مشغول (الحمام، المرحاض)',
    },
  },
  {
    slug: 'yale-brevet',
    name: 'BREVET YALE LOCK',
    description: {
      fr: 'Serrure cylindre Yale brevetée avec clés (chambres, bureaux)',
      ar: 'قفل أسطوانة Yale ببراءة اختراع (الغرف، المكاتب)',
    },
  },
  {
    slug: 'multi-points',
    name: 'Serrure Multi-points',
    description: {
      fr: "Serrure multi-points pour porte d'entrée (3 boucles minimum)",
      ar: 'قفل متعدد النقاط لباب المدخل (3 نقاط على الأقل)',
    },
  },
  {
    slug: 'kit-libra',
    name: 'KIT LIBRA',
    description: {
      fr: 'Kit ferme-porte amorti pour portes hôtelières et tertiaires',
      ar: 'مغلق باب ممتص للفنادق والمكاتب',
    },
  },
];

// ============================================================================
// Texture / Décor de surface
// ============================================================================
export type SurfaceTexture = 'lisse' | 'rainures-v' | 'rainures-h' | 'moulures' | 'geometrique' | 'matrice';

export const surfaceTextures: { slug: SurfaceTexture; name: LocalizedString; pattern: string }[] = [
  { slug: 'lisse', name: { fr: 'Lisse (plain)', ar: 'أملس' }, pattern: 'none' },
  { slug: 'rainures-v', name: { fr: 'Rainures verticales', ar: 'أخاديد عمودية' }, pattern: 'vertical' },
  { slug: 'rainures-h', name: { fr: 'Rainures horizontales', ar: 'أخاديد أفقية' }, pattern: 'horizontal' },
  { slug: 'moulures', name: { fr: 'Moulures classiques (Stella)', ar: 'قوالب كلاسيكية' }, pattern: 'panel' },
  { slug: 'geometrique', name: { fr: 'Motif géométrique (Geo)', ar: 'نقش هندسي' }, pattern: 'geometric' },
  { slug: 'matrice', name: { fr: 'Matricée / Gravée', ar: 'محفور' }, pattern: 'engraved' },
];

// ============================================================================
// Vitrages (catalogue p.38) — 15 décors satinés + 4 couleurs
// ============================================================================
export type GlazingDecor =
  | 'modena' | 'pisa' | 'roma' | 'torino' | 'ancona' | 'chieti'
  | 'milano' | 'palermo' | 'firenze' | 'napoli' | 'genova' | 'pescara'
  | 'venezia-murrine' | 'transparente' | 'depoli-uni';

export type GlazingColor = 'transparente' | 'bianco-satinato' | 'blu-satinato' | 'bronzo-satinato';

export const glazingDecors: { slug: GlazingDecor; name: string }[] = [
  { slug: 'transparente', name: 'Transparent (clair)' },
  { slug: 'depoli-uni', name: 'Dépoli uniforme' },
  { slug: 'modena', name: 'Modena' },
  { slug: 'pisa', name: 'Pisa' },
  { slug: 'roma', name: 'Roma' },
  { slug: 'torino', name: 'Torino' },
  { slug: 'ancona', name: 'Ancona' },
  { slug: 'chieti', name: 'Chieti' },
  { slug: 'milano', name: 'Milano' },
  { slug: 'palermo', name: 'Palermo' },
  { slug: 'firenze', name: 'Firenze' },
  { slug: 'napoli', name: 'Napoli' },
  { slug: 'genova', name: 'Genova' },
  { slug: 'pescara', name: 'Pescara' },
  { slug: 'venezia-murrine', name: 'Venezia con Murrine' },
];

export const glazingColors: { slug: GlazingColor; name: LocalizedString; cssColor: string }[] = [
  { slug: 'transparente', name: { fr: 'Transparent', ar: 'شفاف' }, cssColor: 'rgba(220,230,240,0.55)' },
  { slug: 'bianco-satinato', name: { fr: 'Bianco Satinato', ar: 'أبيض ساتيني' }, cssColor: 'rgba(245,242,238,0.75)' },
  { slug: 'blu-satinato', name: { fr: 'Blu Satinato', ar: 'أزرق ساتيني' }, cssColor: 'rgba(100,140,180,0.65)' },
  { slug: 'bronzo-satinato', name: { fr: 'Bronzo Satinato', ar: 'برونزي ساتيني' }, cssColor: 'rgba(140,100,60,0.6)' },
];

// ============================================================================
// Type d'âme de porte (catalogue p.34) — 8 options
// ============================================================================
export type AmeType =
  | 'alveolaire'
  | 'pleine-tubulaire'
  | 'pleine-ei30'
  | 'isolante'
  | 'ei60'
  | 'blindee'
  | 'bois-massif'
  | 'verre';

export const ameTypes: { slug: AmeType; name: LocalizedString; description: LocalizedString }[] = [
  {
    slug: 'alveolaire',
    name: { fr: 'Alvéolaire', ar: 'خلوي' },
    description: { fr: 'Économique, légère et stable', ar: 'اقتصادي، خفيف ومستقر' },
  },
  {
    slug: 'pleine-tubulaire',
    name: { fr: 'Pleine tubulaire', ar: 'مصمت أنبوبي' },
    description: {
      fr: 'Mécanique accrue et confort acoustique réellement supérieurs à l\'âme alvéolaire',
      ar: 'متانة وعزل صوتي أعلى من الأبواب الخلوية',
    },
  },
  {
    slug: 'pleine-ei30',
    name: { fr: 'Pleine confort EI30', ar: 'مصمت EI30' },
    description: {
      fr: 'Coupe-feu EI30, acoustique renforcée',
      ar: 'مقاوم للحريق EI30، عزل صوتي معزز',
    },
  },
  {
    slug: 'isolante',
    name: { fr: 'Isolante', ar: 'عازل' },
    description: {
      fr: "Âme composée d'un isolant répondant aux exigences thermiques",
      ar: 'قلب مكوّن من عازل يلبي المتطلبات الحرارية',
    },
  },
  {
    slug: 'ei60',
    name: { fr: 'EI60 coupe-feu', ar: 'EI60 مقاوم للحريق' },
    description: {
      fr: 'Porte spécifique avec joints intumescents sur le cadre',
      ar: 'باب خاص مع مفصلات منتفخة على الإطار',
    },
  },
  {
    slug: 'blindee',
    name: { fr: 'Blindée', ar: 'مصفّحة' },
    description: {
      fr: '2 tôles garantissant une stabilité face aux écarts de température',
      ar: 'صفحتان فولاذيتان لاستقرار في التغيرات الحرارية',
    },
  },
  {
    slug: 'bois-massif',
    name: { fr: 'Bois massif', ar: 'خشب صلب' },
    description: {
      fr: "Âme composée d'un panneau et cadre en bois véritable",
      ar: 'قلب مكوّن من لوح وإطار خشب حقيقي',
    },
  },
  {
    slug: 'verre',
    name: { fr: 'Verre', ar: 'زجاج' },
    description: {
      fr: 'Utilisable essentiellement comme porte de communication',
      ar: 'تُستخدم أساساً كأبواب اتصال',
    },
  },
];

// ============================================================================
// Type de construction (catalogue p.34) — 4 options
// ============================================================================
export type ConstructionType = 'porte-nue' | 'porte-ferree' | 'porte-coulissante' | 'bloc-porte';

export const constructionTypes: { slug: ConstructionType; name: LocalizedString; description: LocalizedString }[] = [
  {
    slug: 'porte-nue',
    name: { fr: 'Porte nue', ar: 'باب عاري' },
    description: {
      fr: 'Vantail sans entaillage (chant droit dégrasié ou à recouvrement)',
      ar: 'مصراع بدون حفر (حافة مستقيمة أو متراكبة)',
    },
  },
  {
    slug: 'porte-ferree',
    name: { fr: 'Porte ferrée', ar: 'باب مجهز' },
    description: {
      fr: 'Vantail avec mortaise (serrure) et ferrage (3-4 paumelles, 3 fiches)',
      ar: 'مصراع مع تجويف للقفل والتجهيزات (3-4 مفصلات)',
    },
  },
  {
    slug: 'porte-coulissante',
    name: { fr: 'Porte coulissante', ar: 'باب منزلق' },
    description: {
      fr: 'Porte nue chant droit + rainure basse + entaillage poignée cuvette',
      ar: 'باب عاري بحافة مستقيمة + أخدود سفلي + تجويف مقبض',
    },
  },
  {
    slug: 'bloc-porte',
    name: { fr: 'Bloc-porte complet', ar: 'مجموعة باب كاملة' },
    description: {
      fr: 'Vantail ferré monté sur huisserie bois, serrure posée — prêt à installer',
      ar: 'مصراع مجهز مركّب على إطار خشبي، قفل مركّب — جاهز للتركيب',
    },
  },
];

// ============================================================================
// Plinthe basse
// ============================================================================
export type BottomSeal = 'joint-balai' | 'seuil-alu' | 'sans';

export const bottomSeals: { slug: BottomSeal; name: LocalizedString; description: LocalizedString }[] = [
  {
    slug: 'joint-balai',
    name: { fr: 'Joint balai automatique', ar: 'مفصل سفلي أوتوماتيكي' },
    description: {
      fr: 'Descend automatiquement à la fermeture (isolation + silence)',
      ar: 'ينزل تلقائياً عند الإغلاق',
    },
  },
  {
    slug: 'seuil-alu',
    name: { fr: 'Seuil aluminium', ar: 'عتبة ألومنيوم' },
    description: { fr: 'Profil bas inox/aluminium', ar: 'مقطع منخفض من الألومنيوم' },
  },
  {
    slug: 'sans',
    name: { fr: 'Sans plinthe', ar: 'بدون عتبة' },
    description: { fr: 'Espace libre sous la porte', ar: 'مساحة حرة تحت الباب' },
  },
];
