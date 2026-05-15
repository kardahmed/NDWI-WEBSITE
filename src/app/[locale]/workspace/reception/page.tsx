import { setRequestLocale } from 'next-intl/server';
import { WorkspaceSubpage } from '@/components/sections/workspace-subpage';

export const metadata = {
  title: 'Réception & accueil — NDO Workspace',
  description:
    "Banques d'accueil sur-mesure, salons visiteurs design, signalétique & logo intégrés. La première impression de votre marque.",
};

export default async function ReceptionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <WorkspaceSubpage
      slug="reception"
      bullets={[
        {
          fr: 'Banques d\'accueil sur-mesure — placage noyer, marbre Calacatta, plan rétro-éclairé, intégration écran.',
          ar: 'مكاتب استقبال حسب الطلب — قشرة جوز، رخام كالاكاتا، سطح مضاء من الخلف، تكامل شاشة.',
        },
        {
          fr: 'Salons visiteurs design — canapés modulables, fauteuils signature, tables basses noyer/marbre.',
          ar: 'صالونات الزوار بتصميم راقٍ — أرائك معيارية، كراسي مميزة، طاولات منخفضة جوز/رخام.',
        },
        {
          fr: 'Signalétique et logo intégrés — lettrage brossé inox, laiton, lumineux LED ou découpe haute précision.',
          ar: 'لافتات وشعار مدمج — حروف ستانلس مصقول، نحاس، LED مضاء أو قص دقيق.',
        },
        {
          fr: 'Cohérence brand : couleurs corporate, matériaux assortis, ambiance lumière premium chaleureuse.',
          ar: 'انسجام مع الهوية: ألوان الشركة، مواد متناسقة، إضاءة فاخرة دافئة.',
        },
      ]}
    />
  );
}
