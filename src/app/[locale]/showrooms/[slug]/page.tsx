import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { MapPin, Phone, Mail, Clock, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link, routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { showrooms, getShowroomBySlug, showroomPhones, PHONE_KIND_ABBR } from '@/lib/data/showrooms';
import { ContactTrigger } from '@/components/forms/contact-trigger';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    showrooms.filter((s) => s.status === 'open').map((s) => ({ locale, slug: s.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const s = getShowroomBySlug(slug);
  if (!s) return {};
  const L = locale as Locale;
  return {
    title: `Showroom ${s.city[L]}`,
    description: s.address[L],
  };
}

export default async function ShowroomDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const s = getShowroomBySlug(slug);
  if (!s || s.status !== 'open') notFound();

  const t = await getTranslations('showroomDetail');
  const L = locale as Locale;

  return (
    <>
      <div className="container-page pt-10">
        <Link
          href="/showrooms"
          className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-copper-500 transition-colors"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" />
          {t('back')}
        </Link>
      </div>

      <section className="container-page pt-10 pb-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          {/* Hero info */}
          <div>
            <span className="eyebrow">Showroom</span>
            <h1 className="heading-display mt-5 text-display-xl">{s.city[L]}</h1>

            {s.universes && (
              <div className="mt-6 flex flex-wrap gap-2">
                {s.universes.map((u) => (
                  <span
                    key={u}
                    className="px-3 py-1.5 border border-ink/20 text-[10px] uppercase tracking-[0.18em] text-ink/70"
                  >
                    {u === 'habitat' ? 'Habitat' : 'Workspace'}
                  </span>
                ))}
              </div>
            )}

            {/* Info bloc */}
            <div className="mt-12 space-y-8">
              <InfoRow icon={<MapPin size={20} />} label={t('address')}>
                {s.address[L]}
              </InfoRow>

              {showroomPhones(s).length > 0 && (
                <InfoRow icon={<Phone size={20} />} label={t('phone')}>
                  <ul className="space-y-1">
                    {showroomPhones(s).map((p, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="w-4 text-ink/40">{PHONE_KIND_ABBR[p.kind]}</span>
                        {p.kind === 'fax' ? (
                          <span>{p.value}</span>
                        ) : (
                          <a
                            href={`tel:${p.value.replace(/\s/g, '')}`}
                            className="hover:text-copper-500"
                          >
                            {p.value}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </InfoRow>
              )}

              {s.email && (
                <InfoRow icon={<Mail size={20} />} label={t('email')}>
                  <a href={`mailto:${s.email}`} className="hover:text-copper-500">
                    {s.email}
                  </a>
                </InfoRow>
              )}

              {s.hours && (
                <InfoRow icon={<Clock size={20} />} label={t('hours')}>
                  <ul className="space-y-1">
                    {s.hours.map((h, i) => (
                      <li key={i} className="flex justify-between gap-6">
                        <span>{h.label[L]}</span>
                        <span className="text-ink/60">{h.value[L]}</span>
                      </li>
                    ))}
                  </ul>
                </InfoRow>
              )}
            </div>

            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <ContactTrigger
                sourcePage={`/showrooms/${s.slug}`}
                defaultSujet="rdv-showroom"
                label={t('cta.rdv')}
                className="flex-1"
              />
              <a
                href={s.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1"
              >
                {t('cta.maps')}
                <ArrowUpRight size={16} className="rtl:rotate-90" />
              </a>
            </div>
          </div>

          {/* Visual + small map embed */}
          <aside>
            <div className="aspect-[4/5] bg-gradient-to-br from-bone-200 to-bone-100 border border-ink/10 flex items-center justify-center">
              <p className="font-display text-5xl text-ink/15">{s.city[L]}</p>
            </div>
            <p className="mt-3 text-xs text-ink/40">{t('photoSoon')}</p>
          </aside>
        </div>
      </section>
    </>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex-shrink-0 h-10 w-10 border border-ink/10 flex items-center justify-center text-copper-500">
        {icon}
      </div>
      <div className="flex-1">
        <p className="eyebrow !text-ink/40 mb-2">{label}</p>
        <div className="text-sm text-ink/80 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
