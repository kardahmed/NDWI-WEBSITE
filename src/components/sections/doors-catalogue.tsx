'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { doorCategoryLabels, doorFinishLabels, getDoorBrand } from '@/lib/data/doors';
import type { DoorBrand, DoorCategory, DoorFinish, DoorProduct, Thickness } from '@/lib/data/types';
import type { Locale } from '@/i18n/routing';
import { ProductCard } from '@/components/ui/product-card';
import { cn } from '@/lib/utils';

const allCategories: DoorCategory[] = ['interieur', 'entree'];
const allFinishes: DoorFinish[] = [
  'laque-mat',
  'laque-brillant',
  'placage-bois',
  'placage-noyer',
  'placage-chene',
  'stratifie',
  'vernis-naturel',
];
const allThicknesses: Thickness[] = ['44mm', '50mm', '55mm', '60mm', '70mm'];

interface DoorsCatalogueProps {
  doors: DoorProduct[];
  /** Masque les onglets brand (utile quand on est sur /ndwi/portes ou /ndo/portes
   *  qui sont déjà filtrés par marque côté serveur). */
  hideBrandTabs?: boolean;
}

export function DoorsCatalogue({ doors, hideBrandTabs = false }: DoorsCatalogueProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('catalogue');

  const [category, setCategory] = useState<DoorCategory | 'all'>('all');
  const [brand, setBrand] = useState<DoorBrand | 'all'>('all');
  const [finishes, setFinishes] = useState<DoorFinish[]>([]);
  const [thicknesses, setThicknesses] = useState<Thickness[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const filtered = useMemo(() => {
    return doors.filter((door) => {
      if (category !== 'all' && door.category !== category) return false;
      if (brand !== 'all' && getDoorBrand(door) !== brand) return false;
      if (finishes.length > 0 && !door.finishes.some((f) => finishes.includes(f))) return false;
      if (thicknesses.length > 0 && !door.thicknesses.some((th) => thicknesses.includes(th)))
        return false;
      return true;
    });
  }, [doors, category, brand, finishes, thicknesses]);

  const totalFilters =
    (category !== 'all' ? 1 : 0) + (brand !== 'all' ? 1 : 0) + finishes.length + thicknesses.length;

  const toggleFinish = (f: DoorFinish) =>
    setFinishes((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  const toggleThickness = (th: Thickness) =>
    setThicknesses((prev) => (prev.includes(th) ? prev.filter((x) => x !== th) : [...prev, th]));

  const resetAll = () => {
    setCategory('all');
    setBrand('all');
    setFinishes([]);
    setThicknesses([]);
  };

  return (
    <section className="container-page pb-32">
      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-6 flex items-center justify-between">
        <button
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em]"
        >
          <Filter size={16} />
          {t('filters')}
          {totalFilters > 0 && (
            <span className="ms-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-copper-500 text-[10px] text-bone-50">
              {totalFilters}
            </span>
          )}
        </button>
        <p className="text-sm text-ink/60">
          {filtered.length} {t('results')}
        </p>
      </div>

      {/* Onglets marque — choix prioritaire avant les filtres détaillés.
          Masqués sur les pages brand-specific (/ndwi/portes, /ndo/portes). */}
      {!hideBrandTabs && (
        <BrandTabs
          doors={doors}
          active={brand}
          onChange={setBrand}
          locale={locale}
        />
      )}

      <div className="grid gap-12 lg:grid-cols-[260px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block sticky top-28 h-fit space-y-10">
          <FilterGroup
            label={t('category')}
            options={[
              { value: 'all', label: t('all') },
              ...allCategories.map((c) => ({ value: c, label: doorCategoryLabels[c][locale] })),
            ]}
            value={category}
            onChange={(v) => setCategory(v as DoorCategory | 'all')}
          />

          <CheckboxGroup
            label={t('finishesLabel')}
            options={allFinishes.map((f) => ({ value: f, label: doorFinishLabels[f][locale] }))}
            selected={finishes}
            onToggle={(v) => toggleFinish(v as DoorFinish)}
          />

          <CheckboxGroup
            label={t('thickness')}
            options={allThicknesses.map((th) => ({ value: th, label: th }))}
            selected={thicknesses}
            onToggle={(v) => toggleThickness(v as Thickness)}
          />

          {totalFilters > 0 && (
            <button
              onClick={resetAll}
              className="text-sm text-copper-500 link-underline"
            >
              {t('reset')}
            </button>
          )}
        </aside>

        <div>
          <div className="hidden lg:flex items-center justify-between mb-8">
            <p className="text-sm text-ink/60">
              {filtered.length} {t('results')}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-lg text-ink/60">{t('noResults')}</p>
              <button onClick={resetAll} className="mt-4 text-sm text-copper-500 link-underline">
                {t('reset')}
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((door) => (
                  <motion.div
                    key={door.slug}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ProductCard
                      product={door}
                      locale={locale}
                      href={`/habitat/portes/${door.slug}`}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-ink/40"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
              className="absolute end-0 top-0 h-full w-[88%] max-w-md bg-bone-50 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-bone-50 border-b border-ink/10 p-5 flex items-center justify-between">
                <p className="font-display text-2xl">{t('filters')}</p>
                <button onClick={() => setMobileOpen(false)} aria-label="Close">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-10">
                <FilterGroup
                  label={t('category')}
                  options={[
                    { value: 'all', label: t('all') },
                    ...allCategories.map((c) => ({ value: c, label: doorCategoryLabels[c][locale] })),
                  ]}
                  value={category}
                  onChange={(v) => setCategory(v as DoorCategory | 'all')}
                />
                <CheckboxGroup
                  label={t('finishesLabel')}
                  options={allFinishes.map((f) => ({ value: f, label: doorFinishLabels[f][locale] }))}
                  selected={finishes}
                  onToggle={(v) => toggleFinish(v as DoorFinish)}
                />
                <CheckboxGroup
                  label={t('thickness')}
                  options={allThicknesses.map((th) => ({ value: th, label: th }))}
                  selected={thicknesses}
                  onToggle={(v) => toggleThickness(v as Thickness)}
                />
              </div>
              <div className="sticky bottom-0 bg-bone-50 border-t border-ink/10 p-5 flex gap-3">
                <button onClick={resetAll} className="flex-1 btn-secondary !py-3">
                  {t('reset')}
                </button>
                <button onClick={() => setMobileOpen(false)} className="flex-1 btn-primary !py-3">
                  {t('apply')} ({filtered.length})
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="eyebrow !text-ink/40 mb-4">{label}</p>
      <ul className="space-y-2">
        {options.map((opt) => (
          <li key={opt.value}>
            <button
              onClick={() => onChange(opt.value)}
              className={cn(
                'text-sm transition-colors',
                value === opt.value ? 'text-copper-500' : 'text-ink/70 hover:text-ink'
              )}
            >
              {opt.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CheckboxGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <p className="eyebrow !text-ink/40 mb-4">{label}</p>
      <ul className="space-y-2.5">
        {options.map((opt) => {
          const checked = selected.includes(opt.value);
          return (
            <li key={opt.value}>
              <label className="flex items-center gap-3 cursor-pointer group">
                <span
                  className={cn(
                    'h-4 w-4 border flex items-center justify-center transition-colors',
                    checked ? 'border-copper-500 bg-copper-500' : 'border-ink/30 group-hover:border-ink'
                  )}
                >
                  {checked && <span className="h-1.5 w-1.5 bg-bone-50" />}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => onToggle(opt.value)}
                />
                <span
                  className={cn(
                    'text-sm transition-colors',
                    checked ? 'text-ink' : 'text-ink/70 group-hover:text-ink'
                  )}
                >
                  {opt.label}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Onglets de marque en tête de catalogue — choix prioritaire NDWi vs NDO. */
function BrandTabs({
  doors,
  active,
  onChange,
  locale,
}: {
  doors: DoorProduct[];
  active: DoorBrand | 'all';
  onChange: (v: DoorBrand | 'all') => void;
  locale: Locale;
}) {
  const ndwiCount = doors.filter((d) => getDoorBrand(d) === 'ndwi').length;
  const ndoCount = doors.filter((d) => getDoorBrand(d) === 'ndo').length;
  const tabs: Array<{
    value: DoorBrand | 'all';
    title: string;
    sub: string;
    count: number;
    accent: 'ink' | 'copper' | 'darkInk';
  }> = [
    {
      value: 'all',
      title: locale === 'ar' ? 'كل الأبواب' : 'Toutes les portes',
      sub: locale === 'ar' ? 'الفهرس الكامل' : 'Catalogue complet',
      count: doors.length,
      accent: 'ink',
    },
    {
      value: 'ndwi',
      title: 'NDWi',
      sub: locale === 'ar' ? 'إنتاج محلي · قابل للتخصيص' : 'Production locale · Configurable',
      count: ndwiCount,
      accent: 'copper',
    },
    {
      value: 'ndo',
      title: 'NDO',
      sub: locale === 'ar' ? 'استيراد إيطاليا · منتج نهائي' : 'Importation Italie · Produit fini',
      count: ndoCount,
      accent: 'darkInk',
    },
  ];

  return (
    <div className="mb-10 lg:mb-14">
      <div className="grid gap-px bg-ink/10 border border-ink/10 sm:grid-cols-3">
        {tabs.map((tab) => {
          const isActive = active === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onChange(tab.value)}
              className={cn(
                'group relative flex items-baseline justify-between gap-4 p-5 lg:p-6 text-start transition-colors',
                isActive
                  ? tab.accent === 'copper'
                    ? 'bg-copper-500 text-bone-50'
                    : tab.accent === 'darkInk'
                      ? 'bg-ink text-bone-50'
                      : 'bg-ink text-bone-50'
                  : 'bg-bone-50 hover:bg-bone-100'
              )}
              aria-pressed={isActive}
            >
              <div>
                <p
                  className={cn(
                    'font-display text-2xl lg:text-3xl leading-none',
                    !isActive && 'text-ink'
                  )}
                >
                  {tab.title}
                </p>
                <p
                  className={cn(
                    'mt-2 text-[11px] uppercase tracking-[0.14em]',
                    isActive ? 'text-bone-50/75' : 'text-ink/55'
                  )}
                >
                  {tab.sub}
                </p>
              </div>
              <span
                className={cn(
                  'tabular-nums font-display text-3xl lg:text-4xl',
                  isActive ? 'text-bone-50' : 'text-ink/30 group-hover:text-ink/60'
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
