import { useLocale, useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import {
  NDO_CATEGORY_LABELS,
  type NdoCategory,
  type NdoProduct,
} from '@/sanity/queries/ndoProducts';
import { NdoProductCard } from './ndo-product-card';
import { ContactTrigger } from '@/components/forms/contact-trigger';

interface Props {
  category: NdoCategory;
  products: NdoProduct[];
}

/**
 * Affiche la grille catalogue NDO pour une catégorie donnée.
 * Si la catégorie est encore vide, affiche un état "en cours de constitution" élégant
 * avec un CTA contact pour récolter des demandes anticipées.
 */
export function NdoCatalogue({ category, products }: Props) {
  const locale = useLocale() as Locale;
  // useTranslations imported but not directly needed yet — kept for future i18n strings
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _t = useTranslations;

  const catLabel = NDO_CATEGORY_LABELS[category][locale];

  if (products.length === 0) {
    return (
      <section className="container-page py-24 lg:py-32 text-center">
        <p className="eyebrow text-copper-500">NDO {catLabel}</p>
        <h2 className="heading-display mt-4 text-display-lg max-w-2xl mx-auto">
          {locale === 'ar'
            ? 'كتالوج قيد التحضير'
            : 'Catalogue en cours de constitution.'}
        </h2>
        <p className="mt-6 text-base text-ink/70 max-w-prose mx-auto">
          {locale === 'ar'
            ? "نُكمل حاليًا تجميع الصور والمواصفات لمنتجات NDO من ARAN, PAIL و ICA. تواصل معنا للحصول على مرجع محدد أو لزيارة قاعة العرض."
            : "Nous achevons l'intégration des visuels et caractéristiques des produits NDO importés d'ARAN, PAIL et ICA. Contactez-nous pour une référence précise ou pour visiter notre showroom."}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <ContactTrigger
            sourcePage={`/ndo/${category}`}
            defaultSujet="info-produit"
            label={locale === 'ar' ? 'استفسار عن منتج' : 'Demander une référence'}
          />
          <Link href="/showrooms" className="btn-secondary">
            {locale === 'ar' ? 'زيارة قاعة العرض' : 'Visiter le showroom'}
            <ArrowUpRight size={16} className="rtl:rotate-90" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page py-20 lg:py-28">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <NdoProductCard key={p.slug} product={p} locale={locale} />
        ))}
      </div>
    </section>
  );
}
