import { setRequestLocale } from 'next-intl/server';
import { WorkspaceSubpage } from '@/components/sections/workspace-subpage';

export const metadata = {
  title: 'Cloisons & agencement — NDO Workspace',
  description:
    "Cloisons vitrées toute hauteur, phone booths acoustiques 40 dB, démontables et réutilisables. Modularité workspace premium.",
};

export default async function CloisonsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <WorkspaceSubpage
      slug="cloisons"
      bullets={[
        {
          fr: 'Cloisons vitrées toute hauteur avec profilés aluminium fin — verre simple ou double, options sablage et film décoratif.',
          ar: 'فواصل زجاجية بكامل الارتفاع بإطارات ألومنيوم رفيعة — زجاج عادي أو مزدوج، خيارات الرملي وغشاء زخرفي.',
        },
        {
          fr: 'Phone booths acoustiques modulaires, isolation 40 dB, ventilation intégrée, éclairage et prises.',
          ar: 'كابينات صوتية معيارية للهاتف، عزل 40 ديسيبل، تهوية مدمجة، إضاءة ومقابس.',
        },
        {
          fr: 'Système démontable et réutilisable — déménagement, réagencement, extension sans gros œuvre.',
          ar: 'نظام قابل للفك وإعادة الاستخدام — انتقال، إعادة ترتيب، توسعة دون أشغال كبيرة.',
        },
        {
          fr: 'Cloisons acoustiques avec mousse mélamine certifiée, finition feutre laine ou textile sur-mesure.',
          ar: 'فواصل صوتية برغوة Melamine معتمدة، تشطيب لباد صوف أو قماش حسب الطلب.',
        },
      ]}
    />
  );
}
