import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { siteConfig } from '@/lib/site';

const menuLinks = [
  { key: 'groupe', href: '/' },
  { key: 'ndwi', href: '/ndwi' },
  { key: 'ndo', href: '/ndo' },
  { key: 'habitat', href: '/habitat' },
  { key: 'realisations', href: '/realisations' },
  { key: 'pro', href: '/pro' },
  { key: 'contact', href: '/contact' },
] as const;

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-bone-100 mt-32">
      <div className="container-page py-20 grid gap-14 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="font-display text-3xl tracking-tight">
            NDWI<span className="text-copper-500">.</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-bone-200/70">
            {t('footer.tagline')}
          </p>
          <p className="mt-6 text-sm leading-relaxed text-bone-200/60">
            {siteConfig.address.line1}<br />
            {siteConfig.address.postalCode} {siteConfig.address.city}, {siteConfig.address.region}<br />
            {siteConfig.address.country}
          </p>
        </div>

        <div>
          <p className="eyebrow !text-bone-200/40 mb-5">{t('footer.menu')}</p>
          <ul className="space-y-3 text-sm">
            {menuLinks.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className="text-bone-200/80 hover:text-copper-500 transition-colors">
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow !text-bone-200/40 mb-5">{t('footer.showrooms')}</p>
          <ul className="space-y-3 text-sm">
            {siteConfig.showrooms.map((slug) => (
              <li key={slug}>
                <Link href={`/showrooms/${slug}`} className="text-bone-200/80 hover:text-copper-500 transition-colors capitalize">
                  {slug}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-bone-200/10">
        <div className="container-page py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-bone-200/50">
          <p>{t('footer.rights', { year })}</p>
          <div className="flex gap-6">
            <Link href="/legal" className="hover:text-copper-500">{t('footer.legal')}</Link>
            <Link href="/privacy" className="hover:text-copper-500">{t('footer.privacy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
