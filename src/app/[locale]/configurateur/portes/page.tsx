import { notFound } from 'next/navigation';
import { getLocalizedAlternates } from '@/lib/seo/alternates';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ConfiguratorModelPicker } from '@/components/sections/configurator-model-picker';
import { NdwiConfigurator } from '@/components/configurator/ndwi-configurator';
import { isNdwiConfigurable } from '@/lib/data/doors';
import { fetchDoorBySlug } from '@/sanity/queries/doors';
import { fetchConfiguratorOptions } from '@/sanity/queries/door-options';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'configurator' });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: getLocalizedAlternates('/configurateur/portes', locale),
  };
}

export default async function ConfiguratorPortesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ m?: string }>;
}) {
  const { locale } = await params;
  const { m } = await searchParams;
  setRequestLocale(locale);

  // Garde-fou : le configurateur n'a de sens que pour les portes NDWi configurables
  // (TOLGA, DJADO, PHOENIX, AURÈS). Si l'URL n'a pas de ?m=<slug> valide, on
  // affiche le sélecteur de modèle au lieu d'un configurateur générique.
  if (!m || !isNdwiConfigurable(m)) {
    return <ConfiguratorModelPicker />;
  }

  // Charge la fiche du modèle + bundle d'options (avec images Sanity) en parallèle.
  const [door, options] = await Promise.all([fetchDoorBySlug(m), fetchConfiguratorOptions()]);
  if (!door) notFound();

  return <NdwiConfigurator door={door} options={options} />;
}
