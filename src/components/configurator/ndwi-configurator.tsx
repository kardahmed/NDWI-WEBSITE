'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { DoorPhotoPreview } from './door-photo-preview';
import { Check, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Link } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import type { DoorProduct } from '@/lib/data/types';
import { sensOuvertureLabels, type SensOuverture } from '@/lib/data/door-options';
import type { ConfiguratorOptionsBundle } from '@/sanity/queries/door-options';
import { getDoorBrand, doorBrandLabels } from '@/lib/data/doors';
import { useCart } from '@/lib/cart/cart-context';
import { formatPriceLocalized, priceOnRequestLabel } from '@/lib/format/price';
import { cn } from '@/lib/utils';

interface Props {
  door: DoorProduct;
  /** Bundle d'options chargé côté serveur (Sanity merged with seed). */
  options: ConfiguratorOptionsBundle;
}

/**
 * Configurateur NDWi catalog-driven — Apple-style.
 * Affiche uniquement les options déclarées compatibles sur la fiche du modèle.
 * Prix dynamique = priceFromDZD × quantité. Add to cart capture toute la config.
 */
export function NdwiConfigurator({ door, options }: Props) {
  const locale = useLocale() as Locale;
  const L = locale;
  const { addItem, openDrawer } = useCart();
  const brand = getDoorBrand(door);

  // ─── Options résolues — filtre le bundle par slugs compatibles ───
  const revetements = (door.compatibleRevetements ?? [])
    .map((slug) => options.revetements.find((r) => r.slug === slug))
    .filter((r): r is NonNullable<typeof r> => !!r);
  const poignees = (door.compatiblePoignees ?? [])
    .map((slug) => options.poignees.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p);
  const serrures = (door.compatibleSerrures ?? [])
    .map((slug) => options.serrures.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => !!s);
  const remplissages = (door.compatibleRemplissages ?? [])
    .map((slug) => options.remplissages.find((r) => r.slug === slug))
    .filter((r): r is NonNullable<typeof r> => !!r);
  const vitrages = (door.compatibleVitrages ?? [])
    .map((slug) => options.vitrages.find((v) => v.slug === slug))
    .filter((v): v is NonNullable<typeof v> => !!v);
  const sensOptions = door.compatibleSens ?? [];

  const dimRange = door.dimensionsRange ?? {
    largeurMin: 60,
    largeurMax: 120,
    hauteurMin: 200,
    hauteurMax: 240,
  };

  // ─── État local de la config ─────────────────────────────────────
  const [revetementSlug, setRevetementSlug] = useState<string | undefined>(revetements[0]?.slug);
  const [poigneeSlug, setPoigneeSlug] = useState<string | undefined>(poignees[0]?.slug);
  const [serrureSlug, setSerrureSlug] = useState<string | undefined>(serrures[0]?.slug);
  const [remplissageSlug, setRemplissageSlug] = useState<string | undefined>(remplissages[0]?.slug);
  const [vitrageSlug, setVitrageSlug] = useState<string | undefined>(
    vitrages.find((v) => v.slug === 'porte-pleine')?.slug ?? vitrages[0]?.slug
  );
  const [sens, setSens] = useState<SensOuverture | undefined>(sensOptions[0]);
  const [largeur, setLargeur] = useState<number>(
    Math.round((dimRange.largeurMin + dimRange.largeurMax) / 2)
  );
  const [hauteur, setHauteur] = useState<number>(
    Math.round((dimRange.hauteurMin + dimRange.hauteurMax) / 2)
  );
  const [quantite, setQuantite] = useState<number>(1);

  // ─── Données dérivées (à partir du bundle filtré par compatibilité) ──
  const revetement = revetementSlug ? revetements.find((r) => r.slug === revetementSlug) : undefined;
  const poignee = poigneeSlug ? poignees.find((p) => p.slug === poigneeSlug) : undefined;
  const serrure = serrureSlug ? serrures.find((s) => s.slug === serrureSlug) : undefined;
  const remplissage = remplissageSlug
    ? remplissages.find((r) => r.slug === remplissageSlug)
    : undefined;
  const vitrage = vitrageSlug ? vitrages.find((v) => v.slug === vitrageSlug) : undefined;

  const sousTotal = useMemo(
    () => (door.priceFromDZD ?? 0) * quantite,
    [door.priceFromDZD, quantite]
  );

  // ─── Traductions inline ──────────────────────────────────────────
  const T = {
    title: L === 'ar' ? 'كوّن بابك' : 'Configurez votre porte',
    sub:
      L === 'ar'
        ? 'كل خيار يُحدّث الملخص الجانبي مباشرة. السعر إرشادي للتكوين الحالي.'
        : "Chaque choix met à jour le récapitulatif en temps réel. Le prix est indicatif pour la configuration actuelle.",
    step: L === 'ar' ? 'الخطوة' : 'Étape',
    revetement: L === 'ar' ? 'الكسوة' : 'Revêtement',
    poignee: L === 'ar' ? 'المقبض' : 'Poignée',
    serrure: L === 'ar' ? 'القفل' : 'Serrure',
    sens: L === 'ar' ? 'اتجاه الفتح' : "Sens d’ouverture",
    remplissage: L === 'ar' ? 'الحشو' : 'Remplissage',
    vitrage: L === 'ar' ? 'الزجاج / إصدار اللوح' : 'Vitrage / variante panneau',
    dimensions: L === 'ar' ? 'الأبعاد (سم)' : 'Dimensions (cm)',
    largeur: L === 'ar' ? 'العرض' : 'Largeur',
    hauteur: L === 'ar' ? 'الارتفاع' : 'Hauteur',
    quantite: L === 'ar' ? 'الكمية' : 'Quantité',
    summary: L === 'ar' ? 'الملخص' : 'Récapitulatif',
    addToCart: L === 'ar' ? 'إضافة إلى سلة طلب التسعير' : 'Ajouter au devis',
    backToProduct: L === 'ar' ? 'العودة إلى المنتج' : 'Voir la fiche produit',
    priceDisclaimer:
      L === 'ar'
        ? 'سعر إرشادي للتكوين الأساسي. التشطيب النهائي قد يُعدّل السعر.'
        : 'Prix indicatif pour la configuration de base. La finition exacte peut ajuster le tarif.',
  };

  function handleAddToCart() {
    addItem({
      productType: 'porte',
      productSlug: door.slug,
      productName: door.name,
      brand,
      productHref: `/habitat/portes/${door.slug}`,
      quantity: quantite,
      priceFromDZD: door.priceFromDZD,
      configuration: {
        revetement: revetement
          ? { slug: revetement.slug, label: `${revetement.name} (${revetement.code})` }
          : undefined,
        poignee: poignee ? { slug: poignee.slug, label: poignee.name } : undefined,
        sensOuverture: sens,
        dimensions: { largeur, hauteur, unit: 'cm' },
        accessoires: [
          serrure ? { slug: serrure.slug, label: serrure.name[L] } : null,
          vitrage ? { slug: vitrage.slug, label: vitrage.name } : null,
          remplissage ? { slug: remplissage.slug, label: remplissage.name[L] } : null,
        ].filter((x): x is NonNullable<typeof x> => !!x),
      },
    });
    openDrawer();
  }

  return (
    <section className="container-page py-10 pb-40 lg:py-12 lg:pb-12">
      {/* En-tête */}
      <header className="mb-10 max-w-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-medium bg-copper-500 text-bone-50">
            {doorBrandLabels[brand][L]}
          </span>
          <span className="text-xs uppercase tracking-[0.16em] text-ink/50">
            {door.serie}
          </span>
        </div>
        <h1 className="heading-display mt-4 text-display-lg leading-none">
          {T.title} <span className="text-copper-500">{door.name}.</span>
        </h1>
        <p className="mt-4 text-base text-ink/65 leading-relaxed lg:text-lg">{T.sub}</p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
        {/* ─── Colonne de gauche : sections séquentielles ─── */}
        <div className="space-y-12 lg:space-y-16">
          {/* Section 1 : Revêtement */}
          {revetements.length > 0 && (
            <Step n={1} label={T.revetement} stepLabel={T.step} chosen={revetement?.name}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {revetements.map((r) => {
                  const active = r.slug === revetementSlug;
                  return (
                    <button
                      key={r.slug}
                      type="button"
                      onClick={() => setRevetementSlug(r.slug)}
                      className={cn(
                        'group relative flex flex-col items-stretch border p-3 text-start transition-all',
                        active
                          ? 'border-ink bg-bone-50 shadow-sm'
                          : 'border-ink/15 bg-bone-50 hover:border-ink/40'
                      )}
                      aria-pressed={active}
                    >
                      <span
                        className="relative block h-16 overflow-hidden border border-ink/15"
                        style={r.image ? undefined : { backgroundColor: r.hex }}
                        aria-hidden
                      >
                        {r.image && (
                          <Image
                            src={r.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="160px"
                          />
                        )}
                      </span>
                      <span className="mt-2.5 block font-display text-sm leading-tight text-ink truncate">
                        {r.name}
                      </span>
                      <span className="mt-0.5 block text-[10px] uppercase tracking-[0.14em] text-copper-500 tabular-nums">
                        {r.code}
                      </span>
                      {active && (
                        <span className="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-bone-50">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </Step>
          )}

          {/* Section 2 : Poignée */}
          {poignees.length > 0 && (
            <Step n={2} label={T.poignee} stepLabel={T.step} chosen={poignee?.name}>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {poignees.map((p) => {
                  const active = p.slug === poigneeSlug;
                  return (
                    <button
                      key={p.slug}
                      type="button"
                      onClick={() => setPoigneeSlug(p.slug)}
                      className={cn(
                        'relative flex items-start gap-3 border p-4 text-start transition-all',
                        active
                          ? 'border-ink bg-bone-50 shadow-sm'
                          : 'border-ink/15 bg-bone-50 hover:border-ink/40'
                      )}
                      aria-pressed={active}
                    >
                      {/* Vignette image (Sanity) si présente, sinon radio circle */}
                      {p.image ? (
                        <span className="relative h-14 w-14 flex-shrink-0 overflow-hidden border border-ink/10 bg-white">
                          <Image src={p.image} alt={p.name} fill className="object-contain p-1" sizes="56px" />
                        </span>
                      ) : (
                        <span className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 border-ink/30">
                          {active && <span className="h-2 w-2 rounded-full bg-ink" />}
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-base text-ink leading-tight">
                          {p.name}
                        </span>
                        <span className="mt-1 block text-[10px] uppercase tracking-[0.14em] text-ink/50">
                          {p.finition.replace(/-/g, ' ')}
                        </span>
                        {p.description && (
                          <span className="mt-1.5 block text-[11px] text-ink/55 leading-snug">
                            {p.description[L]}
                          </span>
                        )}
                      </span>
                      {active && p.image && (
                        <span className="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-bone-50">
                          <Check size={11} strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </Step>
          )}

          {/* Section 3 : Serrure */}
          {serrures.length > 0 && (
            <Step n={3} label={T.serrure} stepLabel={T.step} chosen={serrure?.name[L]}>
              <div className="space-y-3">
                {serrures.map((s) => {
                  const active = s.slug === serrureSlug;
                  return (
                    <button
                      key={s.slug}
                      type="button"
                      onClick={() => setSerrureSlug(s.slug)}
                      className={cn(
                        'flex w-full items-start gap-4 border p-5 text-start transition-all',
                        active
                          ? 'border-ink bg-bone-50 shadow-sm'
                          : 'border-ink/15 bg-bone-50 hover:border-ink/40'
                      )}
                      aria-pressed={active}
                    >
                      {/* Vignette serrure (Sanity) si présente */}
                      {s.image ? (
                        <span className="relative h-16 w-16 flex-shrink-0 overflow-hidden border border-ink/10 bg-white">
                          <Image src={s.image} alt={s.name[L]} fill className="object-contain p-1.5" sizes="64px" />
                        </span>
                      ) : (
                        <span className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 border-ink/30">
                          {active && <span className="h-2 w-2 rounded-full bg-ink" />}
                        </span>
                      )}
                      <span className="flex-1">
                        <span className="block font-display text-lg text-ink">{s.name[L]}</span>
                        {s.description && (
                          <span className="mt-1 block text-sm text-ink/60 leading-snug">
                            {s.description[L]}
                          </span>
                        )}
                      </span>
                      {active && s.image && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-bone-50 flex-shrink-0">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </Step>
          )}

          {/* Section 4 : Sens d'ouverture */}
          {sensOptions.length > 0 && (
            <Step n={4} label={T.sens} stepLabel={T.step} chosen={sens ? sensOuvertureLabels[sens][L] : undefined}>
              <div className="flex flex-wrap gap-3">
                {sensOptions.map((s) => {
                  const active = s === sens;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSens(s)}
                      className={cn(
                        'px-5 py-3 border text-sm transition-all',
                        active
                          ? 'border-ink bg-ink text-bone-50'
                          : 'border-ink/20 bg-bone-50 text-ink/75 hover:border-ink/50 hover:text-ink'
                      )}
                      aria-pressed={active}
                    >
                      {sensOuvertureLabels[s][L]}
                    </button>
                  );
                })}
              </div>
            </Step>
          )}

          {/* Section 5 : Remplissage (Djado only en pratique) */}
          {remplissages.length > 1 && (
            <Step n={5} label={T.remplissage} stepLabel={T.step} chosen={remplissage?.name[L]}>
              <div className="grid gap-3 sm:grid-cols-2">
                {remplissages.map((r) => {
                  const active = r.slug === remplissageSlug;
                  return (
                    <button
                      key={r.slug}
                      type="button"
                      onClick={() => setRemplissageSlug(r.slug)}
                      className={cn(
                        'relative flex items-start gap-3 border p-4 text-start transition-all',
                        active
                          ? 'border-ink bg-bone-50 shadow-sm'
                          : 'border-ink/15 bg-bone-50 hover:border-ink/40'
                      )}
                      aria-pressed={active}
                    >
                      {r.image ? (
                        <span className="relative h-14 w-14 flex-shrink-0 overflow-hidden border border-ink/10 bg-white">
                          <Image src={r.image} alt={r.name[L]} fill className="object-contain p-1" sizes="56px" />
                        </span>
                      ) : (
                        <span className="mt-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 border-ink/30">
                          {active && <span className="h-2 w-2 rounded-full bg-ink" />}
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-base text-ink leading-tight">
                          {r.name[L]}
                        </span>
                        {r.description && (
                          <span className="mt-1 block text-[11px] text-ink/55 leading-snug">
                            {r.description[L]}
                          </span>
                        )}
                      </span>
                      {active && r.image && (
                        <span className="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-bone-50">
                          <Check size={11} strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </Step>
          )}

          {/* Section 6 : Vitrage / variante panneau */}
          {vitrages.length > 1 && (
            <Step n={6} label={T.vitrage} stepLabel={T.step} chosen={vitrage?.name}>
              <div className="space-y-4">
                {(['plein', 'vitre-standard', 'insert-metal', 'vitre-sur-commande'] as const).map(
                  (cat) => {
                    const list = vitrages.filter((v) => v.category === cat);
                    if (list.length === 0) return null;
                    const catLabel: Record<typeof cat, string> = {
                      plein: L === 'ar' ? 'كامل' : 'Plein',
                      'vitre-standard': L === 'ar' ? 'مزجج معياري' : 'Vitré standard',
                      'insert-metal': L === 'ar' ? 'إدراج معدني' : 'Insert métal',
                      'vitre-sur-commande': L === 'ar' ? 'حسب الطلب' : 'Sur commande',
                    };
                    return (
                      <div key={cat}>
                        <p className="text-[10px] uppercase tracking-[0.14em] text-ink/45 mb-2">
                          {catLabel[cat]}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {list.map((v) => {
                            const active = v.slug === vitrageSlug;
                            return (
                              <button
                                key={v.slug}
                                type="button"
                                onClick={() => setVitrageSlug(v.slug)}
                                className={cn(
                                  'inline-flex items-center gap-2 border text-sm transition-all',
                                  v.image ? 'p-1.5 ps-1.5 pe-3' : 'px-4 py-2',
                                  active
                                    ? 'border-ink bg-ink text-bone-50'
                                    : 'border-ink/20 bg-bone-50 text-ink/75 hover:border-ink/50 hover:text-ink'
                                )}
                                aria-pressed={active}
                              >
                                {v.image && (
                                  <span className="relative h-10 w-8 flex-shrink-0 overflow-hidden bg-white">
                                    <Image src={v.image} alt={v.name} fill className="object-contain" sizes="32px" />
                                  </span>
                                )}
                                <span>{v.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </Step>
          )}

          {/* Section 7 : Dimensions */}
          <Step
            n={7}
            label={T.dimensions}
            stepLabel={T.step}
            chosen={`${largeur} × ${hauteur} cm`}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <DimSlider
                label={T.largeur}
                min={dimRange.largeurMin}
                max={dimRange.largeurMax}
                value={largeur}
                onChange={setLargeur}
              />
              <DimSlider
                label={T.hauteur}
                min={dimRange.hauteurMin}
                max={dimRange.hauteurMax}
                value={hauteur}
                onChange={setHauteur}
              />
            </div>
          </Step>
        </div>

        {/* ─── Colonne droite : sticky summary + CTA ─── */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            <SummaryPanel
              door={door}
              revetement={revetement}
              poignee={poignee}
              serrure={serrure}
              vitrage={vitrage}
              remplissage={remplissage}
              sens={sens}
              largeur={largeur}
              hauteur={hauteur}
              quantite={quantite}
              sousTotal={sousTotal}
              locale={L}
              T={T}
              setQuantite={setQuantite}
              onAddToCart={handleAddToCart}
            />
            <Link
              href={`/habitat/portes/${door.slug}`}
              className="block text-center text-xs uppercase tracking-[0.14em] text-ink/55 hover:text-copper-500 transition-colors"
            >
              {T.backToProduct}
            </Link>
          </div>
        </aside>
      </div>

      {/* ─── Mobile : barre fixe en bas ─── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-bone-50 p-4 lg:hidden">
        <div className="container-page flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-ink/45">
              {door.priceFromDZD ? T.summary : priceOnRequestLabel(L)}
            </p>
            {door.priceFromDZD && (
              <p className="font-display text-xl text-ink leading-none tabular-nums">
                {formatPriceLocalized(sousTotal, L)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="btn-primary !bg-copper-500 !border-copper-500 hover:!bg-copper-600 hover:!border-copper-600"
          >
            <ShoppingBag size={14} />
            {L === 'ar' ? 'إضافة' : 'Ajouter'}
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Sous-composants ─────────────────────────────────────────────

function Step({
  n,
  label,
  stepLabel,
  chosen,
  children,
}: {
  n: number;
  label: string;
  stepLabel: string;
  chosen?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <header className="mb-5 flex items-baseline justify-between gap-4 border-b border-ink/10 pb-3">
        <div className="flex items-baseline gap-3">
          <span className="text-[10px] uppercase tracking-[0.14em] text-copper-500 tabular-nums">
            {stepLabel} {n}
          </span>
          <h2 className="font-display text-xl text-ink lg:text-2xl">{label}</h2>
        </div>
        {chosen && (
          <span className="hidden sm:inline-block max-w-[40%] text-xs text-ink/60 truncate text-end">
            {chosen}
          </span>
        )}
      </header>
      {children}
    </section>
  );
}

function DimSlider({
  label,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-xs uppercase tracking-[0.14em] text-ink/55">{label}</label>
        <span className="font-display text-2xl text-ink tabular-nums">{value} cm</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-copper-500"
      />
      <div className="mt-1 flex justify-between text-[10px] text-ink/40 tabular-nums">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

interface SummaryProps {
  door: DoorProduct;
  revetement?: ConfiguratorOptionsBundle['revetements'][number];
  poignee?: ConfiguratorOptionsBundle['poignees'][number];
  serrure?: ConfiguratorOptionsBundle['serrures'][number];
  vitrage?: ConfiguratorOptionsBundle['vitrages'][number];
  remplissage?: ConfiguratorOptionsBundle['remplissages'][number];
  sens?: SensOuverture;
  largeur: number;
  hauteur: number;
  quantite: number;
  sousTotal: number;
  locale: Locale;
  T: { summary: string; quantite: string; addToCart: string; priceDisclaimer: string };
  setQuantite: (q: number) => void;
  onAddToCart: () => void;
}

function SummaryPanel({
  door,
  revetement,
  poignee,
  serrure,
  vitrage,
  remplissage,
  sens,
  largeur,
  hauteur,
  quantite,
  sousTotal,
  locale,
  T,
  setQuantite,
  onAddToCart,
}: SummaryProps) {
  const L = locale;
  return (
    <div className="border border-ink/15 bg-bone-50">
      {/* Aperçu live — photo de la porte + overlay couleur du revêtement choisi */}
      <DoorPhotoPreview
        door={door}
        revetement={revetement}
        poignee={poignee}
        vitrage={vitrage}
        sens={sens}
      />
      <div className="px-5 pt-3 pb-2 text-center bg-bone-50 border-b border-ink/10">
        <span className="font-display text-xl text-ink">{door.name}</span>
      </div>

      <div className="p-5 space-y-4">
        <p className="eyebrow !text-ink/40">{T.summary}</p>
        <dl className="space-y-2 text-xs">
          <Row label={L === 'ar' ? 'الكسوة' : 'Revêtement'} value={revetement?.name} />
          <Row label={L === 'ar' ? 'المقبض' : 'Poignée'} value={poignee?.name} />
          <Row label={L === 'ar' ? 'القفل' : 'Serrure'} value={serrure?.name[L]} />
          {remplissage && <Row label={L === 'ar' ? 'الحشو' : 'Remplissage'} value={remplissage.name[L]} />}
          {vitrage && <Row label={L === 'ar' ? 'الزجاج' : 'Vitrage'} value={vitrage.name} />}
          {sens && <Row label={L === 'ar' ? 'الفتح' : 'Sens'} value={sensOuvertureLabels[sens][L]} />}
          <Row label={L === 'ar' ? 'الأبعاد' : 'Dimensions'} value={`${largeur} × ${hauteur} cm`} />
        </dl>

        {/* Quantité */}
        <div className="flex items-center justify-between border-t border-ink/10 pt-4">
          <span className="text-xs uppercase tracking-[0.14em] text-ink/55">{T.quantite}</span>
          <div className="inline-flex items-center border border-ink/20">
            <button
              type="button"
              onClick={() => setQuantite(Math.max(1, quantite - 1))}
              disabled={quantite <= 1}
              className="h-8 w-8 flex items-center justify-center text-ink/60 hover:text-ink hover:bg-bone-100 disabled:opacity-30"
              aria-label="−"
            >
              <Minus size={12} />
            </button>
            <span className="w-10 text-center text-sm font-medium tabular-nums">{quantite}</span>
            <button
              type="button"
              onClick={() => setQuantite(quantite + 1)}
              className="h-8 w-8 flex items-center justify-center text-ink/60 hover:text-ink hover:bg-bone-100"
              aria-label="+"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-ink/10 pt-4">
          {door.priceFromDZD ? (
            <>
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] uppercase tracking-[0.14em] text-ink/45">
                  {L === 'ar' ? 'تقدير' : 'Estimation'}
                </span>
                <span className="font-display text-2xl text-ink tabular-nums">
                  {formatPriceLocalized(sousTotal, L)}
                </span>
              </div>
              <p className="mt-2 text-[10px] text-ink/45 leading-snug">{T.priceDisclaimer}</p>
            </>
          ) : (
            <p className="font-display text-base text-ink/70">{priceOnRequestLabel(L)}</p>
          )}
        </div>

        <button
          type="button"
          onClick={onAddToCart}
          className="btn-primary w-full !bg-copper-500 !border-copper-500 hover:!bg-copper-600 hover:!border-copper-600 mt-2"
        >
          <ShoppingBag size={14} />
          {T.addToCart}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-ink/50">{label}</dt>
      <dd className="text-ink text-end truncate">{value}</dd>
    </div>
  );
}
