import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { MapPin, Phone, ArrowUpRight, Clock } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { showrooms } from '@/lib/data/showrooms';
import type { Locale } from '@/i18n/routing';

const FALLBACK_IMAGES = [
  '/images/showrooms/showroom-01.jpg',
  '/images/showrooms/showroom-02.jpg',
  '/images/showrooms/showroom-03.jpg',
];

export function ShowroomsList() {
  const locale = useLocale() as Locale;
  const t = useTranslations('showrooms');

  return (
    <section className="container-page py-20">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {showrooms.map((s, idx) => {
          const isOpen = s.status === 'open';
          const cover = s.image || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
          return (
            <div
              key={s.slug}
              className={`relative bg-bone-50 border border-ink/10 flex flex-col overflow-hidden ${
                !isOpen ? 'opacity-60' : ''
              }`}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-bone-100">
                <Image
                  src={cover}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {!isOpen && (
                  <div className="absolute inset-0 bg-ink/30" aria-hidden />
                )}
              </div>
              <div className="p-7 flex flex-col flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="eyebrow !text-copper-500">
                    {isOpen ? t('badge.open') : t('badge.soon')}
                  </p>
                  <h3 className="mt-3 font-display text-3xl text-ink">{s.city[locale]}</h3>
                </div>
                {isOpen && (
                  <Link
                    href={`/showrooms/${s.slug}`}
                    aria-label={t('cardCta')}
                    className="h-9 w-9 border border-ink/10 flex items-center justify-center hover:bg-ink hover:text-bone-50 transition-colors"
                  >
                    <ArrowUpRight size={16} className="rtl:rotate-90" />
                  </Link>
                )}
              </div>

              <div className="mt-6 space-y-3 text-sm text-ink/70 flex-1">
                <div className="flex gap-3">
                  <MapPin size={16} className="flex-shrink-0 mt-0.5 text-ink/40" />
                  <p>{s.address[locale]}</p>
                </div>

                {s.phone && (
                  <div className="flex gap-3">
                    <Phone size={16} className="flex-shrink-0 mt-0.5 text-ink/40" />
                    <a href={`tel:${s.phone.replace(/\s/g, '')}`} className="hover:text-copper-500">
                      {s.phone}
                    </a>
                  </div>
                )}

                {isOpen && s.hours && (
                  <div className="flex gap-3">
                    <Clock size={16} className="flex-shrink-0 mt-0.5 text-ink/40" />
                    <p className="text-xs">
                      {s.hours[0].label[locale]} · {s.hours[0].value[locale]}
                    </p>
                  </div>
                )}
              </div>

              {isOpen && (
                <div className="mt-6 pt-6 border-t border-ink/10 flex flex-wrap gap-3">
                  <Link
                    href={`/showrooms/${s.slug}`}
                    className="text-xs uppercase tracking-[0.14em] link-underline"
                  >
                    {t('cardCta')}
                  </Link>
                  <span className="text-ink/20">·</span>
                  <a
                    href={s.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-[0.14em] text-copper-500 link-underline"
                  >
                    {t('cardMaps')}
                  </a>
                </div>
              )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
