import { setRequestLocale } from 'next-intl/server';
import { WorkspaceSubpage } from '@/components/sections/workspace-subpage';

export const metadata = {
  title: 'Salles de réunion — NDO Workspace',
  description:
    "Tables conférence 6-20 personnes, sièges visiteurs assortis, intégration AV. Boardrooms premium pour décisions stratégiques.",
};

export default async function ReunionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <WorkspaceSubpage
      slug="reunion"
      bullets={[
        {
          fr: 'Tables conférence sur-mesure de 6 à 20 personnes — placage noyer, frêne ou laqué, plateau monobloc ou modulable.',
          ar: 'طاولات اجتماع حسب الطلب من 6 إلى 20 شخصاً — قشرة جوز أو دردار أو مطلي، سطح أحادي أو معياري.',
        },
        {
          fr: 'Passe-câbles et boîtiers AV intégrés (HDMI, USB-C, prises secteur) pour visioconférence sans dérangement.',
          ar: 'تمرير كابلات وعلب AV مدمجة (HDMI، USB-C، مقابس) للاجتماعات الافتراضية دون إزعاج.',
        },
        {
          fr: 'Sièges visiteurs Eames Executive Chair ou équivalent, cuir pleine fleur, base aluminium poli.',
          ar: 'كراسي زوار Eames Executive Chair أو ما يعادلها، جلد طبيعي، قاعدة ألومنيوم مصقول.',
        },
        {
          fr: 'Acoustique optimisée : panneaux muraux absorbants, plafond technique, intégration éclairage Dali.',
          ar: 'صوتيات محسّنة: ألواح جدارية ماصة، سقف تقني، تكامل إضاءة Dali.',
        },
      ]}
    />
  );
}
