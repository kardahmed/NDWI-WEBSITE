import { useLocale, useTranslations } from 'next-intl';
import { Briefcase, MapPin, ArrowUpRight } from 'lucide-react';
import { jobOffers } from '@/lib/data/carrieres';
import type { Locale } from '@/i18n/routing';

export function CareersJobs() {
  const locale = useLocale() as Locale;
  const t = useTranslations('careers.jobs');

  return (
    <section className="bg-bone-200/40 border-y border-ink/10 py-16 lg:py-20">
      <div className="container-page">
        <div className="max-w-2xl mb-12">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
        </div>

        {jobOffers.length === 0 ? (
          <div className="bg-bone-50 border border-dashed border-ink/15 px-10 py-16 lg:py-20 text-center">
            <Briefcase size={32} className="mx-auto text-ink/30" strokeWidth={1.5} />
            <p className="mt-6 eyebrow !text-ink/40">{t('empty.eyebrow')}</p>
            <h3 className="heading-display mt-4 text-2xl text-ink">{t('empty.title')}</h3>
            <p className="mt-4 max-w-md mx-auto text-sm text-ink/60 leading-relaxed">
              {t('empty.body')}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-ink/10 border border-ink/10 bg-bone-50">
            {jobOffers.map((job) => (
              <li key={job.slug} className="group flex flex-col lg:flex-row gap-4 lg:items-center justify-between p-6 lg:p-8 hover:bg-bone-100 transition-colors">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-[0.14em] text-copper-500">
                    {job.department[locale]}
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-ink">{job.title[locale]}</h3>
                  <p className="mt-2 text-sm text-ink/65 max-w-2xl">{job.summary[locale]}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/50">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={12} /> {job.location[locale]}
                    </span>
                    <span>·</span>
                    <span>{job.contractType}</span>
                    <span>·</span>
                    <span>{job.experience[locale]}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="self-start lg:self-auto inline-flex items-center gap-2 border border-ink px-5 py-3 text-xs uppercase tracking-[0.14em] hover:bg-ink hover:text-bone-50 transition-colors"
                >
                  {t('apply')}
                  <ArrowUpRight size={14} className="rtl:rotate-90" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
