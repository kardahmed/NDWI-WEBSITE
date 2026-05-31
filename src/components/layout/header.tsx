'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { CartIcon } from '@/components/cart/cart-icon';
import { ShimmerButton } from '@/components/ui/shimmer-button';

const navItems = [
  { key: 'groupe', href: '/' },
  { key: 'ndwi', href: '/ndwi' },
  { key: 'ndo', href: '/ndo' },
  { key: 'habitat', href: '/habitat' },
  { key: 'realisations', href: '/realisations' },
  { key: 'pro', href: '/pro' },
  { key: 'showrooms', href: '/showrooms' },
] as const;

/** Sous-pages contextuelles affichées en accordion sous chaque item parent. */
const subMenu: Partial<Record<(typeof navItems)[number]['key'], { label: string; href: string }[]>> = {
  habitat: [
    { label: 'Portes', href: '/habitat/portes' },
    { label: 'Cuisines', href: '/habitat/cuisines' },
    { label: 'Chambres', href: '/habitat/chambres' },
    { label: 'Dressing', href: '/habitat/dressing' },
    { label: 'Bureaux', href: '/habitat/bureaux' },
    { label: 'Salons', href: '/habitat/salons' },
    { label: 'Hôtellerie', href: '/habitat/hotellerie' },
  ],
  showrooms: [
    { label: 'Alger', href: '/showrooms/alger' },
    { label: 'Oran', href: '/showrooms/oran' },
    { label: 'Sétif', href: '/showrooms/setif' },
  ],
};

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const otherLocale = locale === 'fr' ? 'ar' : 'fr';

  // Glass-morphism on scroll : devient plus opaque + blur stronger quand on
  // a scrollé plus de 80 px (sortie de Hero).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Empêche scroll arrière-plan quand menu ouvert + ferme à navigation.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    setOpen(false); // ferme au changement de route
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300 ease-out-soft',
          scrolled
            ? 'border-b border-ink/15 bg-bone-50/85 backdrop-blur-xl supports-[backdrop-filter]:bg-bone-50/70 shadow-sm'
            : 'border-b border-transparent bg-bone-50/60 backdrop-blur-md supports-[backdrop-filter]:bg-bone-50/40'
        )}
      >
        <div className="container-page flex h-20 items-center justify-between gap-8">
          <Link href="/" aria-label="NDWi — New Design Wood Industrie" className="block">
            <Image
              src="/logo/ndwi-full-dark.png"
              alt="NDWi — New Design Wood Industrie"
              width={1036}
              height={477}
              priority
              className="h-10 w-auto sm:h-12"
            />
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
            <CartIcon />
            <Link
              href={pathname}
              locale={otherLocale}
              className="text-xs uppercase tracking-[0.18em] text-ink/60 hover:text-ink"
            >
              {otherLocale.toUpperCase()}
            </Link>
            <ShimmerButton href="/contact" className="!py-3 !px-5 text-xs">
              {t('devis')}
            </ShimmerButton>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <CartIcon />
            <button
              type="button"
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              className="p-2 -mr-2 text-ink"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile menu immersif full-screen ─── */}
      <AnimatePresence>
        {open && (
          <MobileMenuOverlay
            navItems={navItems as unknown as { key: string; href: string }[]}
            t={t}
            pathname={pathname}
            otherLocale={otherLocale}
            locale={locale as 'fr' | 'ar'}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Composant overlay mobile menu ──────────────────────────────────

function MobileMenuOverlay({
  navItems,
  t,
  pathname,
  otherLocale,
  locale,
  onClose,
}: {
  navItems: { key: string; href: string }[];
  t: (k: string) => string;
  pathname: string;
  otherLocale: string;
  locale: 'fr' | 'ar';
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <motion.div
      key="mobile-menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="lg:hidden fixed inset-0 z-[60] bg-bone-50 overflow-y-auto"
    >
      {/* Texture zellige subtile en arrière-plan */}
      <div className="absolute inset-0 bg-zellige opacity-100 pointer-events-none" aria-hidden />

      <div className="relative flex h-full min-h-screen flex-col">
        {/* Top bar miroir du header */}
        <div className="container-page flex h-20 items-center justify-between flex-shrink-0">
          <Image
            src="/logo/ndwi-full-dark.png"
            alt="NDWi"
            width={1036}
            height={477}
            className="h-10 w-auto sm:h-12"
          />
          <button
            type="button"
            aria-label="Fermer le menu"
            className="p-2 -mr-2 text-ink"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav items géants */}
        <nav className="container-page flex-1 flex flex-col justify-center py-10">
          <ul className="space-y-3">
            {navItems.map((item, i) => {
              const sub = (subMenu as Record<string, { label: string; href: string }[]>)[item.key];
              const isActive = pathname === item.href;
              const isExpanded = expanded === item.key;
              return (
                <motion.li
                  key={item.key}
                  initial={{ opacity: 0, x: locale === 'ar' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-ink/10 last:border-b-0"
                >
                  <div className="flex items-center justify-between gap-4 py-3">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'font-display text-4xl sm:text-5xl leading-none transition-colors',
                        isActive ? 'text-copper-500' : 'text-ink hover:text-copper-500'
                      )}
                    >
                      {t(item.key)}
                    </Link>
                    {sub && (
                      <button
                        type="button"
                        aria-label="Sous-menu"
                        onClick={(e) => {
                          e.preventDefault();
                          setExpanded(isExpanded ? null : item.key);
                        }}
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-full border border-ink/20 transition-all',
                          isExpanded && 'rotate-45 bg-ink text-bone-50 border-ink'
                        )}
                      >
                        <span className="text-xl leading-none">+</span>
                      </button>
                    )}
                  </div>

                  {/* Sous-menu en accordion */}
                  <AnimatePresence>
                    {sub && isExpanded && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden ps-1 pb-4 space-y-1.5"
                      >
                        {sub.map((s) => (
                          <li key={s.href}>
                            <Link
                              href={s.href}
                              onClick={onClose}
                              className="flex items-center gap-2 text-sm text-ink/70 hover:text-copper-500 transition-colors"
                            >
                              <span className="h-px w-3 bg-copper-500/40" />
                              {s.label}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* Footer du menu : langue + cart + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="container-page py-6 border-t border-ink/15 space-y-4"
        >
          <CartIcon variant="row" />
          <div className="flex items-center justify-between gap-4 pt-2">
            <Link
              href={pathname}
              locale={otherLocale as 'fr' | 'ar'}
              onClick={onClose}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-ink/70 hover:text-ink"
            >
              <span className="font-display text-lg leading-none">{otherLocale.toUpperCase()}</span>
              <span>· Changer de langue</span>
            </Link>
            <Link
              href="/contact"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-5 py-3 bg-ink text-bone-50 text-xs uppercase tracking-[0.14em] hover:bg-copper-500 transition-colors"
            >
              {t('devis')}
              <ArrowUpRight size={14} className="rtl:rotate-90" />
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
