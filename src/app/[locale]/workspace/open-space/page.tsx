import { setRequestLocale } from 'next-intl/server';
import { WorkspaceSubpage } from '@/components/sections/workspace-subpage';

export const metadata = {
  title: 'Open space & postes de travail — NDO Workspace',
  description:
    "Bureaux réglables sit-stand, bench modulables 2-6 postes, écrans acoustiques certifiés. Ergonomie professionnelle pour open space premium.",
};

export default async function OpenSpacePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <WorkspaceSubpage
      slug="open-space"
      bullets={[
        {
          fr: 'Bureaux individuels réglables en hauteur (sit-stand) avec moteur électrique silencieux, mémoires de position.',
          ar: 'مكاتب فردية قابلة للتعديل في الارتفاع (الجلوس/الوقوف) بمحرك كهربائي صامت، ذاكرات الوضع.',
        },
        {
          fr: 'Bench modulables 2 à 6 postes, structure aluminium, passe-câbles intégrés et bandeau d\'alimentation.',
          ar: 'وحدات Bench قابلة للتعديل من 2 إلى 6 مكاتب، هيكل ألومنيوم، تمرير الكابلات مدمج وشريط طاقة.',
        },
        {
          fr: 'Écrans acoustiques certifiés EN ISO 23351-1, finition feutre laine ou textile, absorbe jusqu\'à 0.9 αw.',
          ar: 'شاشات صوتية معتمدة EN ISO 23351-1، تشطيب لباد صوف أو قماش، تمتص حتى 0.9 αw.',
        },
        {
          fr: 'Sièges opérationnels ergonomiques (Vitra, Herman Miller), réglage 5 axes, mécanisme synchrone certifié.',
          ar: 'كراسي تشغيلية إرغونومية (Vitra، Herman Miller)، ضبط 5 محاور، آلية متزامنة معتمدة.',
        },
      ]}
    />
  );
}
