import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ProductDetail } from '@/components/sections/product-detail';
import { fetchAllProducts } from '@/sanity/queries/products';
import { routing } from '@/i18n/routing';

export const revalidate = 60;

export async function generateStaticParams() {
  const all = await fetchAllProducts();
  return routing.locales.flatMap((locale) =>
    all.filter((p) => p.category === 'bureau').map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = await fetchAllProducts();
  const p = all.find((x) => x.slug === slug && x.category === 'bureau');
  if (!p) return {};
  return { title: `${p.name} — Bureau`, description: p.shortDescription.fr };
}

export default async function BureauDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const all = await fetchAllProducts();
  const product = all.find((p) => p.slug === slug && p.category === 'bureau');
  if (!product) notFound();

  return (
    <ProductDetail
      product={product}
      backHref="/habitat/bureaux"
      backLabel={locale === 'ar' ? 'العودة إلى المكاتب' : 'Retour aux bureaux'}
    />
  );
}
