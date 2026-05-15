'use client';

import { useState, useMemo, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Layers,
  DoorOpen,
  Compass,
  Settings2,
  Ruler,
  Tag,
  Expand,
  Camera,
  Send,
  Share2,
  Copy,
  X,
  Check,
  FileDown,
} from 'lucide-react';
import QRCode from 'qrcode';
import { DoorScene, type EnvironmentPreset } from './door-scene';
import { ARLauncher } from './ar-launcher';
import type { CameraPreset } from './camera-controller';
import type { DoorPart } from './door-parts';
import { useSoundFx } from './use-sound-fx';
import { Volume2, VolumeX, GitCompareArrows } from 'lucide-react';

const PART_LABELS: Record<DoorPart, { fr: string; ar: string; subtitle?: { fr: string; ar: string } }> = {
  panel: { fr: 'Panneau', ar: 'اللوحة', subtitle: { fr: 'Couleur, texture, finition', ar: 'لون، ملمس، تشطيب' } },
  frame: { fr: 'Encadrement', ar: 'الإطار', subtitle: { fr: 'Cadre fixe noir mat', ar: 'إطار ثابت أسود مطفي' } },
  handle: { fr: 'Poignée', ar: 'المقبض', subtitle: { fr: '4 variantes disponibles', ar: '4 إصدارات متاحة' } },
  lock: { fr: 'Serrure', ar: 'القفل', subtitle: { fr: 'Cylindre haute sécurité', ar: 'أسطوانة عالية الأمان' } },
  hinges: { fr: 'Paumelles', ar: 'المفصلات', subtitle: { fr: '3 paumelles inox 304', ar: '3 مفصلات فولاذ 304' } },
  glass: { fr: 'Vitrage', ar: 'الزجاج', subtitle: { fr: 'Verre feuilleté satiné', ar: 'زجاج مغطى مصقول' } },
};
import {
  defaultDoorConfig,
  handleVariants,
  computeLeadEstimate,
  type DoorConfig3D,
  type HandleSlug,
  type MaterialSlug,
  type FinishSlug,
  type OpeningSide,
  type OpeningDirection,
} from './types';
import type { Finition3D } from '@/sanity/queries/configurator3D';
import { cn, buildWhatsAppUrl } from '@/lib/utils';
import { siteConfig } from '@/lib/site';
import type { Locale } from '@/i18n/routing';

const SIDEBAR_SECTIONS = [
  { id: 'couleurs', label: { fr: 'Couleurs', ar: 'الألوان' }, icon: Palette },
  { id: 'materiaux', label: { fr: 'Matériaux', ar: 'المواد' }, icon: Layers },
  { id: 'poignees', label: { fr: 'Poignées', ar: 'المقابض' }, icon: DoorOpen },
  { id: 'ouverture', label: { fr: "Sens d'ouverture", ar: 'اتجاه الفتح' }, icon: Compass },
  { id: 'accessoires', label: { fr: 'Accessoires', ar: 'الإكسسوارات' }, icon: Settings2 },
  { id: 'dimensions', label: { fr: 'Dimensions', ar: 'الأبعاد' }, icon: Ruler },
  { id: 'recap', label: { fr: 'Récapitulatif', ar: 'الملخص' }, icon: Tag },
] as const;

type SectionId = (typeof SIDEBAR_SECTIONS)[number]['id'];

interface Configurator3DProps {
  /** Finitions disponibles (depuis Sanity). Si la liste est vide, le sélecteur affiche un message d'aide. */
  finitions: Finition3D[];
  /** URL du GLB Sanity à charger pour la porte. Si vide, fallback procédural. */
  glbUrl?: string;
}

export function Configurator3D({ finitions, glbUrl }: Configurator3DProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('configurator');

  // Initial config : applique la première finition Sanity comme défaut
  const firstFinition = finitions[0];
  const [config, setConfig] = useState<DoorConfig3D>(() => ({
    ...defaultDoorConfig,
    finitionSlug: firstFinition?.slug ?? '',
    colorHex: firstFinition?.baseColor ?? defaultDoorConfig.colorHex,
    textureUrl: firstFinition?.woodTextureUrl,
    material: finitionToMaterial(firstFinition),
    finish: finitionToFinish(firstFinition),
  }));
  const [openSection, setOpenSection] = useState<SectionId>('couleurs');
  const [fullscreen, setFullscreen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [envPreset, setEnvPreset] = useState<EnvironmentPreset>('studio');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('three-quarter');
  const [hoveredPart, setHoveredPart] = useState<DoorPart | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const sound = useSoundFx();
  const [comparisonSnapshot, setComparisonSnapshot] = useState<DoorConfig3D | null>(null);

  const toggleCompare = () => {
    if (comparisonSnapshot) {
      setComparisonSnapshot(null);
    } else {
      setComparisonSnapshot({ ...config });
    }
    sound.play('click');
  };

  // ───── Restore config depuis URL au mount ─────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('conf');
    if (!encoded) return;
    try {
      const restored = JSON.parse(atob(decodeURIComponent(encoded))) as Partial<DoorConfig3D>;
      // Merge prudent : on garde les valeurs par défaut pour les champs manquants
      setConfig((c) => ({ ...c, ...restored, openAmount: 0 }));
    } catch (e) {
      console.warn('Config URL corrompue, ignorée', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Génère l'URL permalink de la config courante (sans état d'animation). */
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const { openAmount: _ignored, ...persistable } = config;
    const encoded = encodeURIComponent(btoa(JSON.stringify(persistable)));
    return `${window.location.origin}${window.location.pathname}?conf=${encoded}`;
  }, [config]);

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback : sélectionne le contenu d'un champ caché (non implémenté ici)
    }
  };

  const nativeShare = async () => {
    if (!navigator.share) {
      copyShareUrl();
      return;
    }
    try {
      await navigator.share({
        title: 'Ma porte sur-mesure NDWI',
        text: 'Découvrez ma configuration porte chez NDWi.',
        url: shareUrl,
      });
    } catch {
      // user cancelled
    }
  };

  const leadEstimate = useMemo(() => computeLeadEstimate(config), [config]);

  const update = <K extends keyof DoorConfig3D>(key: K, value: DoorConfig3D[K]) => {
    setConfig((c) => ({ ...c, [key]: value }));
    sound.play('click');
  };

  const setFinition = (f: Finition3D) => {
    setConfig((c) => ({
      ...c,
      finitionSlug: f.slug,
      colorHex: f.baseColor,
      textureUrl: f.woodTextureUrl,
      material: finitionToMaterial(f),
      finish: finitionToFinish(f),
    }));
    sound.play('click');
  };

  const setCustomColor = (hex: string) => {
    setConfig((c) => ({ ...c, finitionSlug: '', colorHex: hex, textureUrl: undefined }));
  };

  const toggleOpenAnim = () => {
    const willOpen = config.openAmount <= 0.5;
    setConfig((c) => ({ ...c, openAmount: willOpen ? 1 : 0 }));
    sound.play(willOpen ? 'door-open' : 'door-close');
  };

  /** Génère et télécharge la fiche PDF avec render 3D + récap + QR code. */
  const downloadPDF = async () => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const screenshotDataUrl = canvas.toDataURL('image/png');
    const qrDataUrl = await QRCode.toDataURL(shareUrl, { width: 400, margin: 1 });
    const finition = finitions.find((f) => f.slug === config.finitionSlug);
    const { generateQuotePDF } = await import('./pdf-quote');
    await generateQuotePDF({
      config,
      finition,
      screenshotDataUrl,
      qrDataUrl,
      shareUrl,
    });
  };

  /** Capture le canvas R3F en PNG et déclenche un download local + un partage WhatsApp si dispo. */
  const captureScreenshot = (mode: 'download' | 'whatsapp') => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const dataUrl = (canvas as HTMLCanvasElement).toDataURL('image/png');
    if (mode === 'download') {
      const link = document.createElement('a');
      link.download = `ndwi-config-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      return;
    }
    // mode === 'whatsapp' : on déclenche le téléchargement ET on ouvre WhatsApp
    // (WhatsApp Web ne permet pas l'attachement d'images via URL,
    //  on guide donc l'utilisateur en téléchargeant l'image + ouvrant la conversation)
    const link = document.createElement('a');
    link.download = `ndwi-config-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    sendQuoteWhatsApp();
  };

  const sendQuoteWhatsApp = () => {
    const finitionName =
      finitions.find((f) => f.slug === config.finitionSlug)?.name ?? config.colorHex;
    const handleName = handleVariants.find((h) => h.slug === config.handle)?.name ?? '—';
    const summary = [
      `Demande de devis — Configurateur porte NDWi`,
      ``,
      `Finition : ${finitionName} (${config.colorHex})`,
      `Matériau : ${config.material}`,
      `Aspect : ${config.finish}`,
      `Poignée : ${handleName}`,
      `Charnière : ${config.hingeSide}`,
      `Sens d'ouverture : ${config.openingDirection}`,
      `Vitrage : ${config.hasGlass ? 'Oui' : 'Non'}`,
      `Serrure : ${config.hasLock ? 'Oui' : 'Non'}`,
      `Dimensions : ${config.widthCm} × ${config.heightCm} cm`,
      ``,
      `Merci de me faire parvenir un devis personnalisé.`,
      ``,
      `— envoyé depuis le configurateur ndwi-dz.com`,
    ].join('\n');
    window.open(buildWhatsAppUrl(siteConfig.whatsapp, summary), '_blank');
  };

  return (
    <section
      className={cn(
        'relative w-full bg-bone-50',
        fullscreen ? 'fixed inset-0 z-50 h-screen' : 'h-[calc(100vh-80px)] min-h-[700px]'
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] h-full">
        {/* ───────── Sidebar gauche ───────── */}
        <aside className="bg-bone-50 border-e border-ink/10 overflow-y-auto">
          <div className="p-6 border-b border-ink/10">
            <p className="eyebrow text-copper-500">{t('eyebrow')}</p>
            <h1 className="heading-display mt-3 text-2xl lg:text-3xl leading-tight">
              {locale === 'ar' ? 'صمم بابك حسب الطلب' : 'Composez votre porte.'}
            </h1>
          </div>

          {/* Sections accordéon */}
          <div>
            {SIDEBAR_SECTIONS.map((section) => {
              const Icon = section.icon;
              const isOpen = openSection === section.id;
              return (
                <div key={section.id} className="border-b border-ink/8">
                  <button
                    onClick={() => setOpenSection(isOpen ? ('' as SectionId) : section.id)}
                    className="w-full flex items-center gap-3 px-6 py-4 hover:bg-ink/5 transition-colors text-start"
                  >
                    <Icon size={18} className="text-copper-500" />
                    <span className="text-sm uppercase tracking-[0.14em]">
                      {section.label[locale]}
                    </span>
                    <span className="ms-auto text-xs text-ink/40">{isOpen ? '−' : '+'}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          {renderSection(section.id, config, update, setFinition, setCustomColor, locale, finitions)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* CTA devis sticky en bas */}
          <div className="sticky bottom-0 bg-ink text-bone-50 p-6 border-t border-copper-500/30">
            {/* Badge délai indicatif */}
            <div className="flex items-center gap-2 mb-4 text-[10px] uppercase tracking-[0.14em]">
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  leadEstimate.stock === 'in-stock'
                    ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                    : leadEstimate.stock === 'on-order'
                      ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                      : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                )}
              />
              <span className="text-bone-50/70">
                {locale === 'ar' ? 'دلائل' : 'Délai indicatif'}
              </span>
              <span className="text-bone-50/40">·</span>
              <span className="text-bone-50/70">
                {leadEstimate.weeksMin === leadEstimate.weeksMax
                  ? `${leadEstimate.weeksMin}`
                  : `${leadEstimate.weeksMin}-${leadEstimate.weeksMax}`}{' '}
                {locale === 'ar' ? 'أسابيع' : 'semaines'}
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-bone-50/50">
              {locale === 'ar' ? 'احصل على عرض سعر شخصي' : 'Devis personnalisé sous 24 h'}
            </p>
            <p className="font-display text-xl mt-1 leading-snug">
              {locale === 'ar'
                ? 'فريقنا يدرس تكوينك ويعود إليك بالسعر الدقيق.'
                : 'Notre équipe étudie votre config et revient vers vous avec un tarif précis.'}
            </p>
            <button
              onClick={() => captureScreenshot('whatsapp')}
              className="mt-5 w-full flex items-center justify-center gap-2 bg-copper-500 text-bone-50 py-3 text-sm uppercase tracking-[0.14em] hover:bg-copper-400 transition-colors"
            >
              <Send size={14} />
              {locale === 'ar' ? 'طلب عرض سعر' : 'Demander un devis'}
            </button>
            <p className="mt-2 text-[10px] text-bone-50/40 text-center leading-snug">
              {locale === 'ar'
                ? 'صورة التكوين تُحفظ تلقائياً، أرفقها في الواتساب.'
                : 'L\'image de votre config sera téléchargée — joignez-la dans WhatsApp.'}
            </p>
          </div>
        </aside>

        {/* ───────── Canvas central ───────── */}
        <div className="relative bg-gradient-to-br from-bone-100 to-bone-200">
          {comparisonSnapshot ? (
            <div className="grid grid-cols-2 h-full">
              <div className="relative border-e border-ink/10">
                <DoorScene
                  config={comparisonSnapshot}
                  glbUrl={glbUrl}
                  environmentPreset={envPreset}
                  cameraPreset={cameraPreset}
                />
                <span className="absolute top-3 start-3 bg-ink/90 text-bone-50 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em]">
                  {locale === 'ar' ? 'قبل' : 'Avant'}
                </span>
              </div>
              <div className="relative">
                <DoorScene
                  config={config}
                  glbUrl={glbUrl}
                  environmentPreset={envPreset}
                  cameraPreset={cameraPreset}
                  hoveredPart={hoveredPart}
                  onHoverPart={(p, x, y) => {
                    setHoveredPart(p);
                    if (p && x !== undefined && y !== undefined) setHoverPos({ x, y });
                  }}
                />
                <span className="absolute top-3 start-3 bg-copper-500 text-bone-50 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em]">
                  {locale === 'ar' ? 'بعد' : 'Après'}
                </span>
              </div>
            </div>
          ) : (
            <DoorScene
              config={config}
              glbUrl={glbUrl}
              environmentPreset={envPreset}
              cameraPreset={cameraPreset}
              hoveredPart={hoveredPart}
              onHoverPart={(p, x, y) => {
                setHoveredPart(p);
                if (p && x !== undefined && y !== undefined) setHoverPos({ x, y });
              }}
            />
          )}

          {/* Tooltip hover qui suit le curseur */}
          {hoveredPart && (
            <div
              className="pointer-events-none fixed z-40 bg-ink/95 text-bone-50 px-3 py-2 backdrop-blur shadow-lg"
              style={{
                left: hoverPos.x + 16,
                top: hoverPos.y + 16,
                transform: 'translateZ(0)',
              }}
            >
              <p className="text-sm font-medium">{PART_LABELS[hoveredPart][locale]}</p>
              {PART_LABELS[hoveredPart].subtitle && (
                <p className="text-[10px] uppercase tracking-[0.12em] text-bone-50/60 mt-1">
                  {PART_LABELS[hoveredPart].subtitle![locale]}
                </p>
              )}
            </div>
          )}

          {/* Contrôles flottants haut-droit */}
          <div className="absolute top-4 end-4 flex gap-2">
            <button
              onClick={toggleOpenAnim}
              className="flex items-center gap-2 bg-bone-50/90 backdrop-blur px-3 py-2 text-[11px] uppercase tracking-[0.12em] hover:bg-bone-50 transition-colors"
              title={locale === 'ar' ? 'افتح/أغلق' : 'Ouvrir/fermer'}
            >
              <DoorOpen size={14} />
              {config.openAmount > 0.5 ? (locale === 'ar' ? 'إغلاق' : 'Fermer') : (locale === 'ar' ? 'فتح' : 'Ouvrir')}
            </button>
            <button
              onClick={() => captureScreenshot('download')}
              className="flex items-center gap-2 bg-bone-50/90 backdrop-blur px-3 py-2 text-[11px] uppercase tracking-[0.12em] hover:bg-bone-50 transition-colors"
              title={locale === 'ar' ? 'لقطة شاشة' : 'Capturer une image'}
            >
              <Camera size={14} />
              {locale === 'ar' ? 'لقطة' : 'Capturer'}
            </button>
            <button
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-2 bg-bone-50/90 backdrop-blur px-3 py-2 text-[11px] uppercase tracking-[0.12em] hover:bg-bone-50 transition-colors"
              title={locale === 'ar' ? 'مشاركة' : 'Partager'}
            >
              <Share2 size={14} />
              {locale === 'ar' ? 'مشاركة' : 'Partager'}
            </button>
            <ARLauncher glbUrl={glbUrl} locale={locale} />
            <button
              onClick={toggleCompare}
              className={cn(
                'flex items-center gap-2 backdrop-blur px-3 py-2 text-[11px] uppercase tracking-[0.12em] transition-colors',
                comparisonSnapshot
                  ? 'bg-copper-500 text-bone-50 hover:bg-copper-400'
                  : 'bg-bone-50/90 hover:bg-bone-50'
              )}
              title={locale === 'ar' ? 'مقارنة' : 'Comparer'}
            >
              <GitCompareArrows size={14} />
              {comparisonSnapshot
                ? locale === 'ar'
                  ? 'إنهاء'
                  : 'Terminer'
                : locale === 'ar'
                  ? 'مقارنة'
                  : 'Comparer'}
            </button>
            <button
              onClick={sound.toggle}
              className="bg-bone-50/90 backdrop-blur p-2 hover:bg-bone-50 transition-colors"
              title={
                locale === 'ar'
                  ? sound.enabled
                    ? 'كتم الصوت'
                    : 'تفعيل الصوت'
                  : sound.enabled
                    ? 'Couper le son'
                    : 'Activer le son'
              }
            >
              {sound.enabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>
            <button
              onClick={() => setFullscreen((f) => !f)}
              className="bg-bone-50/90 backdrop-blur p-2 hover:bg-bone-50 transition-colors"
              title={locale === 'ar' ? 'ملء الشاشة' : 'Plein écran'}
            >
              <Expand size={14} />
            </button>
          </div>

          {/* Badge config en bas */}
          <div className="absolute bottom-4 start-4 bg-bone-50/85 backdrop-blur px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-ink/70">
            {config.widthCm} × {config.heightCm} cm
            <span className="mx-2 text-ink/30">·</span>
            {config.material}
            <span className="mx-2 text-ink/30">·</span>
            {config.finish}
          </div>

          {/* Camera presets centre-bas (Tesla-style) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 bg-bone-50/85 backdrop-blur p-1">
            {(
              [
                { p: 'face', label: { fr: 'Face', ar: 'أمامي' } },
                { p: 'three-quarter', label: { fr: '3/4', ar: '3/4' } },
                { p: 'profile', label: { fr: 'Profil', ar: 'جانبي' } },
                { p: 'handle-detail', label: { fr: 'Poignée', ar: 'مقبض' } },
                { p: 'free', label: { fr: 'Libre', ar: 'حر' } },
              ] as { p: CameraPreset; label: { fr: string; ar: string } }[]
            ).map(({ p, label }) => (
              <button
                key={p}
                onClick={() => setCameraPreset(p)}
                className={cn(
                  'px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] transition-colors',
                  cameraPreset === p ? 'bg-ink text-bone-50' : 'text-ink/60 hover:text-ink'
                )}
              >
                {label[locale]}
              </button>
            ))}
          </div>

          {/* Toggle ambiance HDR en bas à droite */}
          <div className="absolute bottom-4 end-4 flex gap-1 bg-bone-50/85 backdrop-blur p-1">
            {(['studio', 'lobby', 'apartment'] as EnvironmentPreset[]).map((p) => (
              <button
                key={p}
                onClick={() => setEnvPreset(p)}
                className={cn(
                  'px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] transition-colors',
                  envPreset === p
                    ? 'bg-ink text-bone-50'
                    : 'text-ink/60 hover:text-ink'
                )}
                title={
                  locale === 'ar'
                    ? p === 'studio' ? 'استوديو' : p === 'lobby' ? 'ردهة' : 'شقة'
                    : p === 'studio' ? 'Studio' : p === 'lobby' ? 'Lobby' : 'Apparte­ment'
                }
              >
                {locale === 'ar'
                  ? p === 'studio' ? 'استوديو' : p === 'lobby' ? 'ردهة' : 'شقة'
                  : p === 'studio' ? 'Studio' : p === 'lobby' ? 'Lobby' : 'Apparte­mt'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ───────── Modale Partage (QR + URL) ───────── */}
      <AnimatePresence>
        {shareOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShareOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-bone-50 max-w-md w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShareOpen(false)}
                className="absolute top-4 end-4 text-ink/40 hover:text-ink transition-colors"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
              <p className="eyebrow text-copper-500 mb-2">
                {locale === 'ar' ? 'مشاركة التكوين' : 'Partager votre configuration'}
              </p>
              <h2 className="heading-display text-2xl mb-6 leading-tight">
                {locale === 'ar' ? 'احفظ بابك أو شاركه' : 'Sauvegardez ou partagez votre porte.'}
              </h2>
              <div className="flex justify-center mb-6 p-4 bg-bone-100 border border-ink/5">
                <QRCodeSVG value={shareUrl} size={180} bgColor="#f5f2ee" fgColor="#0a0a0a" />
              </div>
              <p className="text-xs text-ink/60 mb-3 text-center">
                {locale === 'ar'
                  ? 'امسح الرمز ضوئياً بهاتفك لاستعادة تكوينك في أي مكان.'
                  : 'Scannez avec votre téléphone pour retrouver votre configuration partout.'}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 px-3 py-2 border border-ink/15 text-xs font-mono truncate bg-bone-100"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  onClick={copyShareUrl}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 text-xs uppercase tracking-[0.12em] transition-colors',
                    copied
                      ? 'bg-green-600 text-bone-50'
                      : 'bg-ink text-bone-50 hover:bg-ink/80'
                  )}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied
                    ? locale === 'ar'
                      ? 'منسوخ'
                      : 'Copié'
                    : locale === 'ar'
                      ? 'نسخ'
                      : 'Copier'}
                </button>
              </div>
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={nativeShare}
                  className="mt-3 w-full bg-copper-500 text-bone-50 py-3 text-sm uppercase tracking-[0.14em] hover:bg-copper-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 size={14} />
                  {locale === 'ar' ? 'مشاركة عبر التطبيقات' : 'Partager via une app'}
                </button>
              )}
              <button
                onClick={downloadPDF}
                className="mt-2 w-full border border-ink/15 py-3 text-sm uppercase tracking-[0.14em] hover:border-ink/40 transition-colors flex items-center justify-center gap-2"
              >
                <FileDown size={14} />
                {locale === 'ar' ? 'تحميل الفيش التقنية PDF' : 'Télécharger fiche PDF'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// SECTION CONTENT RENDERER
// ──────────────────────────────────────────────────────────────────────────────

function renderSection(
  id: SectionId,
  config: DoorConfig3D,
  update: <K extends keyof DoorConfig3D>(k: K, v: DoorConfig3D[K]) => void,
  setFinition: (f: Finition3D) => void,
  setCustomColor: (hex: string) => void,
  locale: Locale,
  finitions: Finition3D[]
) {
  switch (id) {
    case 'couleurs':
      return (
        <div className="space-y-3">
          {finitions.length === 0 ? (
            <p className="text-xs text-ink/50 italic leading-relaxed">
              {locale === 'ar'
                ? 'لم تتم إضافة أي تشطيبات بعد. أضفها من خلال /admin.'
                : 'Aucune finition disponible. Ajoutez-en dans /admin → Finitions.'}
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {finitions.map((f) => (
                <button
                  key={f.slug}
                  onClick={() => setFinition(f)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-2 border transition-colors',
                    config.finitionSlug === f.slug
                      ? 'border-ink bg-ink/5'
                      : 'border-ink/15 hover:border-ink/40'
                  )}
                  title={locale === 'ar' ? f.nameAr ?? f.name : f.name}
                >
                  {/* Swatch : image Sanity si dispo, sinon couleur unie */}
                  {f.swatchUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={f.swatchUrl}
                      alt={f.name}
                      className="block h-12 w-full object-cover border border-ink/10"
                    />
                  ) : f.woodTextureUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={f.woodTextureUrl}
                      alt={f.name}
                      className="block h-12 w-full object-cover border border-ink/10"
                    />
                  ) : (
                    <span
                      className="block h-12 w-full border border-ink/10"
                      style={{ backgroundColor: f.baseColor }}
                    />
                  )}
                  <span className="text-[10px] text-center leading-tight line-clamp-2">
                    {locale === 'ar' ? f.nameAr ?? f.name : f.name}
                  </span>
                </button>
              ))}
            </div>
          )}
          <div className="pt-3 border-t border-ink/10">
            <label className="block text-[10px] uppercase tracking-[0.14em] text-ink/50 mb-2">
              {locale === 'ar' ? 'لون مخصص' : 'Couleur personnalisée'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.colorHex}
                onChange={(e) => setCustomColor(e.target.value)}
                className="h-10 w-14 border border-ink/15 cursor-pointer"
              />
              <input
                type="text"
                value={config.colorHex}
                onChange={(e) => setCustomColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-ink/15 text-sm font-mono"
              />
            </div>
          </div>
        </div>
      );

    case 'materiaux':
      return (
        <div className="space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-ink/50 mb-2">
              {locale === 'ar' ? 'المادة' : 'Matériau'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(['bois', 'laque', 'metal'] as MaterialSlug[]).map((m) => (
                <button
                  key={m}
                  onClick={() => update('material', m)}
                  className={cn(
                    'py-3 px-3 border text-sm capitalize transition-colors',
                    config.material === m ? 'border-ink bg-ink text-bone-50' : 'border-ink/15 hover:border-ink/40'
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-ink/50 mb-2">
              {locale === 'ar' ? 'التشطيب' : 'Finition'}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(['mat', 'satine', 'brillant'] as FinishSlug[]).map((f) => (
                <button
                  key={f}
                  onClick={() => update('finish', f)}
                  className={cn(
                    'py-2 px-2 border text-xs capitalize transition-colors',
                    config.finish === f ? 'border-ink bg-ink text-bone-50' : 'border-ink/15 hover:border-ink/40'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      );

    case 'poignees':
      return (
        <div className="grid grid-cols-2 gap-2">
          {handleVariants.map((h) => (
            <button
              key={h.slug}
              onClick={() => update('handle', h.slug)}
              className={cn(
                'p-3 border text-start transition-colors',
                config.handle === h.slug ? 'border-ink bg-ink/5' : 'border-ink/15 hover:border-ink/40'
              )}
            >
              <p className="font-medium text-sm">{locale === 'ar' ? h.nameAr : h.name}</p>
            </button>
          ))}
        </div>
      );

    case 'ouverture':
      return (
        <div className="space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-ink/50 mb-2">
              {locale === 'ar' ? 'جانب المفصل' : 'Côté charnière'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(['gauche', 'droite'] as OpeningSide[]).map((s) => (
                <button
                  key={s}
                  onClick={() => update('hingeSide', s)}
                  className={cn(
                    'py-2 px-3 border text-xs capitalize transition-colors',
                    config.hingeSide === s ? 'border-ink bg-ink text-bone-50' : 'border-ink/15 hover:border-ink/40'
                  )}
                >
                  {locale === 'ar' ? (s === 'gauche' ? 'يسار' : 'يمين') : s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-ink/50 mb-2">
              {locale === 'ar' ? 'اتجاه' : 'Sens'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(['interieur', 'exterieur'] as OpeningDirection[]).map((d) => (
                <button
                  key={d}
                  onClick={() => update('openingDirection', d)}
                  className={cn(
                    'py-2 px-3 border text-xs capitalize transition-colors',
                    config.openingDirection === d ? 'border-ink bg-ink text-bone-50' : 'border-ink/15 hover:border-ink/40'
                  )}
                >
                  {locale === 'ar' ? (d === 'interieur' ? 'داخلي' : 'خارجي') : d}
                </button>
              ))}
            </div>
          </div>
        </div>
      );

    case 'accessoires':
      return (
        <div className="space-y-3">
          {[
            { key: 'hasGlass' as const, label: { fr: 'Vitrage', ar: 'زجاج' }, price: 9000 },
            { key: 'hasLock' as const, label: { fr: 'Serrure', ar: 'قفل' }, price: 3500 },
          ].map((opt) => (
            <label key={opt.key} className="flex items-center gap-3 cursor-pointer group">
              <span
                className={cn(
                  'h-5 w-5 border flex items-center justify-center transition-colors',
                  config[opt.key]
                    ? 'border-copper-500 bg-copper-500'
                    : 'border-ink/30 group-hover:border-ink'
                )}
              >
                {config[opt.key] && <span className="h-2 w-2 bg-bone-50" />}
              </span>
              <input
                type="checkbox"
                checked={config[opt.key]}
                onChange={(e) => update(opt.key, e.target.checked)}
                className="sr-only"
              />
              <span className="text-sm flex-1">{opt.label[locale]}</span>
            </label>
          ))}
        </div>
      );

    case 'dimensions':
      return (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] uppercase tracking-[0.14em] text-ink/50">
                {locale === 'ar' ? 'العرض' : 'Largeur'}
              </label>
              <span className="text-sm font-mono">{config.widthCm} cm</span>
            </div>
            <input
              type="range"
              min={70}
              max={120}
              step={1}
              value={config.widthCm}
              onChange={(e) => update('widthCm', parseInt(e.target.value, 10))}
              className="w-full accent-copper-500"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] uppercase tracking-[0.14em] text-ink/50">
                {locale === 'ar' ? 'الارتفاع' : 'Hauteur'}
              </label>
              <span className="text-sm font-mono">{config.heightCm} cm</span>
            </div>
            <input
              type="range"
              min={190}
              max={240}
              step={1}
              value={config.heightCm}
              onChange={(e) => update('heightCm', parseInt(e.target.value, 10))}
              className="w-full accent-copper-500"
            />
          </div>
        </div>
      );

    case 'recap':
      return (
        <div className="space-y-3 text-sm">
          <Line label={locale === 'ar' ? 'المادة' : 'Matériau'} value={config.material} />
          <Line label={locale === 'ar' ? 'التشطيب' : 'Aspect'} value={config.finish} />
          <Line
            label={locale === 'ar' ? 'المقبض' : 'Poignée'}
            value={handleVariants.find((h) => h.slug === config.handle)?.name ?? '—'}
          />
          <Line
            label={locale === 'ar' ? 'جانب المفصل' : 'Charnière'}
            value={config.hingeSide}
          />
          <Line
            label={locale === 'ar' ? 'الاتجاه' : 'Sens'}
            value={config.openingDirection}
          />
          <Line
            label={locale === 'ar' ? 'زجاج' : 'Vitrage'}
            value={config.hasGlass ? (locale === 'ar' ? 'نعم' : 'Oui') : (locale === 'ar' ? 'لا' : 'Non')}
          />
          <Line
            label={locale === 'ar' ? 'قفل' : 'Serrure'}
            value={config.hasLock ? (locale === 'ar' ? 'نعم' : 'Oui') : (locale === 'ar' ? 'لا' : 'Non')}
          />
          <Line
            label={locale === 'ar' ? 'الأبعاد' : 'Dimensions'}
            value={`${config.widthCm}×${config.heightCm} cm`}
          />
          <p className="border-t border-ink/10 pt-3 text-xs text-ink/60 italic leading-relaxed">
            {locale === 'ar'
              ? 'سيقوم فريقنا بدراسة هذا التكوين ويعود إليك بسعر شخصي خلال 24 ساعة.'
              : 'Notre équipe étudie cette configuration et revient vers vous avec un tarif personnalisé sous 24 h.'}
          </p>
        </div>
      );

    default:
      return null;
  }
}

// ────────── Mappers Finition Sanity → DoorConfig3D ──────────

function finitionToMaterial(f?: Finition3D): MaterialSlug {
  if (!f) return 'bois';
  switch (f.category) {
    case 'wood':
      return 'bois';
    case 'lacquer':
      return 'laque';
    case 'metallic':
      return 'metal';
    case 'natural':
    case 'laminate':
    default:
      return 'bois';
  }
}

function finitionToFinish(f?: Finition3D): FinishSlug {
  if (!f) return 'satine';
  // Mappe la roughness PBR vers nos 3 niveaux logiques.
  if (f.roughness <= 0.2) return 'brillant';
  if (f.roughness >= 0.7) return 'mat';
  return 'satine';
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-ink/70">
      <span>{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
