import { setRequestLocale } from 'next-intl/server';
import { WorkspaceSubpage } from '@/components/sections/workspace-subpage';

export const metadata = {
  title: 'Mobilier de direction — NDO Workspace',
  description:
    "Bureaux exécutifs sur-mesure, fauteuils cuir pleine fleur, rangements coordonnés. Signatures italiennes Poltrona Frau, Molteni, Vitra.",
};

export default async function DirectionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <WorkspaceSubpage
      slug="direction"
      bullets={[
        {
          fr: 'Bureaux exécutifs sur-mesure en noyer massif, chêne ou laqué — dimensions et configuration adaptées à votre espace.',
          ar: 'مكاتب تنفيذية حسب الطلب من الجوز المصمت أو السنديان أو المطلي — الأبعاد والترتيب يتكيفان مع فضائك.',
        },
        {
          fr: 'Fauteuils cuir pleine fleur signature Poltrona Frau, mécanismes ergonomiques de haute précision.',
          ar: 'كراسي بجلد طبيعي راقٍ موقّعة من Poltrona Frau، آليات إرغونومية عالية الدقة.',
        },
        {
          fr: 'Bibliothèques et rangements coordonnés (crédences, armoires, modules muraux) en harmonie avec le bureau.',
          ar: 'مكتبات ووحدات تخزين متناسقة (Credenza، خزائن، وحدات حائطية) بانسجام مع المكتب.',
        },
        {
          fr: 'Conseil prescription sur place (showroom Oran, Alger) — choix matériaux, plans d\'implantation, devis 24h.',
          ar: 'استشارة على المكان (معرض وهران، الجزائر) — اختيار المواد، مخططات التركيب، عرض سعر خلال 24 ساعة.',
        },
      ]}
    />
  );
}
