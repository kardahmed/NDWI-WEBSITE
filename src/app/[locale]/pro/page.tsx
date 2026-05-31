import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getLocalizedAlternates } from '@/lib/seo/alternates';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { HeroStory } from '@/components/ui/hero-story';
import { proAudiences } from '@/lib/data/pro';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'proIndex' });
  return { title: t('meta.title'), description: t('meta.description') };
}

export default async function ProIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('proIndex');
  const L = locale as Locale;

  return (
    <>
      <HeroStory
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        theme="dark"
        height="md"
        scrollCueId="audiences"
      />

      <section id="audiences" className="container-page py-12 pb-32">
        <div className="grid gap-px bg-ink/10 border border-ink/10 sm:grid-cols-2">
          {proAudiences.map((a, i) => (
            <Link
              key={a.slug}
              href={`/pro/${a.slug}`}
              className="group relative bg-bone-50 p-8 lg:p-12 min-h-[20rem] flex flex-col transition-colors hover:bg-ink hover:text-bone-50"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs uppercase tracking-[0.18em] text-ink/40 group-hover:text-bone-200/60">
                  0{i + 1}
                </span>
                <ArrowUpRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 rtl:group-hover:-translate-x-1 rtl:rotate-90"
                />
              </div>

              <div className="mt-auto">
                <p className="text-xs uppercase tracking-[0.16em] text-copper-500 group-hover:text-copper-400">
                  {a.promise[L]}
                </p>
                <h3 className="mt-3 heading-display text-3xl lg:text-4xl">{a.eyebrow[L]}</h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed opacity-70">
                  {a.subtitle[L]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
