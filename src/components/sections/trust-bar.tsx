import { useTranslations } from 'next-intl';

const REFERENCES = [
  { name: 'Marriott', logo: '/images/clients/marriott.png' },
  { name: 'Rodina', logo: '/images/clients/rodina.jpg' },
  { name: 'Ibiris', logo: '/images/clients/ibiris.jpg' },
];

export function TrustBar() {
  const t = useTranslations('home.trust');

  return (
    <section className="border-y border-ink/10 bg-bone-50">
      <div className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:items-center">
          <div className="max-w-md">
            <h2 className="heading-display text-display-md">{t('title')}</h2>
            <p className="mt-3 text-sm text-ink/60">{t('subtitle')}</p>
          </div>
          <ul className="flex flex-wrap items-center justify-start gap-x-12 gap-y-8">
            {REFERENCES.map((ref) => (
              <li key={ref.name} className="flex items-center">
                <img
                  src={ref.logo}
                  alt={ref.name}
                  className="h-12 w-auto max-w-[140px] object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
