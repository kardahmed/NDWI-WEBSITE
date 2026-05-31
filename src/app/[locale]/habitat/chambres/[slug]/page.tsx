import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ProductDetail } from '@/components/sections/product-detail';
import { fetchAllProducts } from '@/sanity/queries/products';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { getLocalizedAlternates } from '@/lib/seo/alternates';

export const revalidate = 60;

export async function generateStaticParams() {
  const all = await fetchAllProducts();
  return routing.locales.flatMap((locale) =>
    all.filter((p) => p.category === 'chambre').map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const L = locale as Locale;
  const all = await fetchAllProducts();
  const p = all.find((x) => x.slug === slug && x.category === 'chambre');
  if (!p) return {};
  const suffix = { fr: 'Chambre', ar: 'غرفة نوم' };
  return {
    title: `${p.name} — ${suffix[L]}`,
    description: p.shortDescription[L],
    alternates: getLocalizedAlternates(`/habitat/chambres/${slug}`, locale),
  };
}

export default async function ChambreDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const all = await fetchAllProducts();
  const product = all.find((p) => p.slug === slug && p.category === 'chambre');
  if (!product) notFound();

  return (
    <ProductDetail
      product={product}
      backHref="/habitat/chambres"
      backLabel={locale === 'ar' ? 'العودة إلى غرف النوم' : 'Retour aux chambres'}
    />
  );
}
