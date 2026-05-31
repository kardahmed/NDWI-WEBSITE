import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { BentoGrid, BentoCard } from '@/components/ui/bento';
import { cn } from '@/lib/utils';

/**
 * Section gateways B2B sur la home — refondue en bento asymétrique.
 *
 * Layout :
 *   ┌──────────────────────────┬──────────────┐
 *   │   Promoteurs (lg 2×2)    │ Architectes  │
 *   │   gros visuel + texte    ├──────────────┤
 *   │                          │ Hôteliers    │
 *   ├────────────┬─────────────┴──────────────┤
 *   │ Distrib.   │  CTA pleine largeur (md)   │
 *   └────────────┴────────────────────────────┘
 *
 * Promoteurs en hero card (segment lead NDWi), 3 autres en sm,
 * et un CTA copper en bas pour contact direct.
 */
export function ProGateways() {
  const t = useTranslations('home.pro');

  return (
    <section className="container-page py-12 lg:py-16">
      <div className="max-w-2xl mb-12">
        <span className="eyebrow">05 — B2B</span>
        <h2 className="heading-display mt-4 text-display-lg">{t('title')}</h2>
        <p className="mt-6 text-base leading-relaxed text-ink/70">{t('subtitle')}</p>
      </div>

      <BentoGrid>
        {/* ─── Card hero : Promoteurs (lg 2×2) ─── */}
        <BentoCard size="lg" padding="p-0" interactive className="!bg-ink text-bone-50 min-h-[28rem]">
          <Link href="/pro/promoteurs" className="relative h-full w-full block overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out-soft group-hover:scale-105"
              style={{ backgroundImage: 'url(/images/pro/promoteurs.jpg)' }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/55 to-ink/15" aria-hidden />
            <div className="relative h-full flex flex-col justify-between p-8 lg:p-10">
              <span className="text-[10px] uppercase tracking-[0.18em] text-copper-400">
                01 — Segment principal
              </span>
              <div>
                <p className="font-display text-4xl lg:text-5xl text-bone-50 leading-tight">
                  {t('promoteurs')}
                </p>
                <p className="mt-4 text-sm text-bone-50/75 max-w-md leading-relaxed">
                  Programmes immobiliers neufs et rénovations. Étude
                  volumétrique sous 72 h ouvrées.
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-copper-400 group-hover:gap-3 transition-all">
                  Découvrir notre offre promoteurs
                  <ArrowUpRight size={16} className="rtl:rotate-90" />
                </span>
              </div>
            </div>
          </Link>
        </BentoCard>

        {/* ─── Architectes (sm) ─── */}
        <BentoSmallGateway n={2} label={t('architectes')} image="/images/pro/architectes.jpg" href="/pro/architectes" />

        {/* ─── Hôteliers (sm) ─── */}
        <BentoSmallGateway n={3} label={t('hoteliers')} image="/images/pro/hoteliers.jpg" href="/pro/hoteliers" />

        {/* ─── Distributeurs (sm) ─── */}
        <BentoSmallGateway n={4} label={t('distributeurs')} image="/images/pro/distributeurs.jpg" href="/pro/distributeurs" />

        {/* ─── CTA copper md ─── */}
        <BentoCard size="md" bg="bg-copper-500" interactive padding="p-0">
          <Link
            href="/contact"
            className="relative h-full w-full flex items-center justify-between gap-4 p-8 lg:p-10 text-bone-50"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-bone-50/80">
                Vous êtes un autre type de pro ?
              </p>
              <p className="mt-2 font-display text-2xl lg:text-3xl">
                Parlons-en directement.
              </p>
            </div>
            <ArrowUpRight
              size={28}
              strokeWidth={1.5}
              className={cn(
                'flex-shrink-0 transition-transform',
                'group-hover:translate-x-1 group-hover:-translate-y-1 rtl:rotate-90'
              )}
            />
          </Link>
        </BentoCard>
      </BentoGrid>
    </section>
  );
}

// ─── Helper card sm (image bg + label + arrow) ─────────────────────

function BentoSmallGateway({
  n,
  label,
  image,
  href,
}: {
  n: number;
  label: string;
  image: string;
  href: string;
}) {
  return (
    <BentoCard size="sm" padding="p-0" interactive className="!bg-ink text-bone-50">
      <Link href={href} className="relative h-full w-full block overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out-soft group-hover:scale-105"
          style={{ backgroundImage: `url(${image})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/55 to-ink/20" aria-hidden />
        <div className="relative h-full flex flex-col justify-between p-6">
          <span className="text-[10px] uppercase tracking-[0.18em] text-bone-200/70">
            0{n}
          </span>
          <div>
            <p className="font-display text-xl text-bone-50">{label}</p>
            <ArrowUpRight
              size={18}
              className="mt-3 text-copper-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 rtl:rotate-90"
            />
          </div>
        </div>
      </Link>
    </BentoCard>
  );
}
