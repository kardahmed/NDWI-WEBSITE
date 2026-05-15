import { setRequestLocale } from 'next-intl/server';
import { HabitatSubpage } from '@/components/sections/habitat-subpage';

export const metadata = {
  title: 'Mobilier hôtelier — Solutions premium',
  description:
    "Suites complètes, lobby, restauration, salles de séminaire. Références : Marriott Bab Ezzouar, Rodina Oran, Maraval Oran, Hôtel Ibiris. Normes EI30, acoustique 32 dB, RFID.",
};

export default async function HotelleriePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <HabitatSubpage
      slug="hotellerie"
      univers="hotellerie"
      bullets={[
        {
          fr: 'Portes palières acoustiques EI30 + 32 dB, anti-pince-doigt, charnières amorties, compatibles serrures RFID.',
          ar: 'أبواب طوابق عازلة للصوت EI30 + 32 ديسيبل، مانع لانحشار الأصابع، مفصلات ممتصة، متوافقة مع أقفال RFID.',
        },
        {
          fr: 'Mobilier de suites complet : têtes de lit, dressings, bureaux, mini-bars, consoles TV, dressings.',
          ar: 'أثاث الأجنحة الكامل: رؤوس سرير، خزائن ملابس، مكاتب، ميني بار، طاولات تلفزيون.',
        },
        {
          fr: 'Lobby & accueil : banques de réception sur-mesure, mobilier lounge, paravents, signalétique.',
          ar: 'الاستقبال: مكاتب استقبال حسب الطلب، أثاث لاونج، فواصل، لافتات.',
        },
        {
          fr: 'Références : Marriott Bab Ezzouar (280 chambres), Hôtel Rodina Oran, Hôtel Maraval Oran, Hôtel Ibiris.',
          ar: 'مراجع: ماريوت باب الزوار (280 غرفة)، فندق رودينا وهران، فندق مارافال وهران، فندق إبيريس.',
        },
      ]}
    />
  );
}
