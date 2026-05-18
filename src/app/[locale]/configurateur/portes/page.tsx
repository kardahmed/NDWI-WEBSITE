import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Configurator3DClient } from '@/components/configurator-3d/configurator-3d-client';
import { fetchFinitions, fetchDoor3DModels } from '@/sanity/queries/configurator3D';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'configurator' });
  return { title: t('meta.title'), description: t('meta.description') };
}

export default async function ConfiguratorPortesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Récupère toutes les finitions publiées + tous les modèles 3D depuis Sanity.
  const [allFinitions, models] = await Promise.all([fetchFinitions(), fetchDoor3DModels()]);

  // Si un modèle 3D définit ses finitions disponibles, on filtre. Sinon on passe toutes.
  // (Tant qu'il n'y a qu'un modèle générique, on prend simplement le premier ou toutes.)
  const firstModel = models[0];
  const availableSlugs = firstModel?.availableFinitionSlugs ?? [];
  const finitions =
    availableSlugs.length > 0
      ? allFinitions.filter((f) => availableSlugs.includes(f.slug))
      : allFinitions;

  return (
    <Configurator3DClient
      finitions={finitions}
      glbUrl={firstModel?.glbUrl}
      model={firstModel}
    />
  );
}
