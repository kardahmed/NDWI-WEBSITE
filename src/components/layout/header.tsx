'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const navItems = [
  // "Le Groupe" en tête : pointe vers la home (= page Groupe fusionnée).
  { key: 'groupe', href: '/' },
  { key: 'ndwi', href: '/ndwi' },
  { key: 'ndo', href: '/ndo' },
  { key: 'habitat', href: '/habitat' },
  { key: 'realisations', href: '/realisations' },
  { key: 'pro', href: '/pro' },
  { key: 'showrooms', href: '/showrooms' },
] as const;

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const otherLocale = locale === 'fr' ? 'ar' : 'fr';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink/10 bg-bone-50/85 backdrop-blur supports-[backdrop-filter]:bg-bone-50/70">
      <div className="container-page flex h-20 items-center justify-between gap-8">
        <Link href="/" className="font-display text-2xl tracking-tight">
          NDWI<span className="text-copper-500">.</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'text-sm tracking-wide text-ink/80 transition-colors hover:text-copper-500',
                pathname === item.href && 'text-copper-500'
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-5">
          <Link href={pathname} locale={otherLocale} className="text-xs uppercase tracking-[0.18em] text-ink/60 hover:text-ink">
            {otherLocale.toUpperCase()}
          </Link>
          <Link href="/contact" className="btn-primary !py-3 !px-5 text-xs">
            {t('devis')}
          </Link>
        </div>

        <button
          type="button"
          aria-label="Menu"
          className="lg:hidden p-2 -mr-2"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-ink/10 bg-bone-50">
          <nav className="container-page py-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-base text-ink/80 hover:text-copper-500"
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-4 border-t border-ink/10">
              <Link href={pathname} locale={otherLocale} className="text-xs uppercase tracking-[0.18em]">
                {otherLocale.toUpperCase()}
              </Link>
              <Link href="/contact" onClick={() => setOpen(false)} className="btn-primary !py-3 !px-5 text-xs">
                {t('devis')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
