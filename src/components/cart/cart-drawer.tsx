'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useCart } from '@/lib/cart/cart-context';
import { CartItemRow } from './cart-item-row';
import { CartDevisForm } from './cart-devis-form';
import { formatPriceLocalized } from '@/lib/format/price';

/**
 * Drawer panier devis : panneau plein-hauteur qui glisse depuis la droite.
 * - Backdrop sombre cliquable pour fermer.
 * - Liste des items en haut, formulaire devis en bas.
 * - Bouton "Vider le panier" + bouton "Demander mon devis" toggle visibilité du form.
 */
export function CartDrawer() {
  const locale = useLocale() as 'fr' | 'ar';
  const { items, count, clear, drawerOpen, closeDrawer } = useCart();
  const [showForm, setShowForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Si le panier devient vide, on cache le form (sinon "votre panier est vide" affiche tout seul).
  useEffect(() => {
    if (items.length === 0) setShowForm(false);
  }, [items.length]);

  // Empêche le scroll arrière-plan quand le drawer est ouvert.
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  if (!mounted) return null;

  const L = {
    title: locale === 'ar' ? 'سلة طلب التسعير' : 'Panier devis',
    subtitle:
      locale === 'ar'
        ? 'المنتجات المضافة — طلب تسعير واحد لكل المجموعة.'
        : 'Vos produits sélectionnés — une seule demande de devis pour tout le lot.',
    empty: locale === 'ar' ? 'سلتك فارغة.' : 'Votre panier est vide.',
    emptyHint:
      locale === 'ar'
        ? 'تصفح الكتالوج وأضف منتجاتك للحصول على عرض سعر مجمّع.'
        : 'Parcourez le catalogue et ajoutez vos produits pour recevoir un devis groupé.',
    close: locale === 'ar' ? 'إغلاق' : 'Fermer',
    clear: locale === 'ar' ? 'تفريغ' : 'Vider',
    askDevis: locale === 'ar' ? 'طلب التسعير' : 'Demander mon devis',
    backToList: locale === 'ar' ? '← العودة إلى السلة' : '← Retour au panier',
    summary: (n: number, q: number) =>
      locale === 'ar'
        ? `${n} منتج · ${q} قطعة`
        : `${n} produit${n > 1 ? 's' : ''} · ${q} pièce${q > 1 ? 's' : ''}`,
  };

  return createPortal(
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[100] bg-ink/45 backdrop-blur-[2px]"
            aria-hidden
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: locale === 'ar' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: locale === 'ar' ? '-100%' : '100%' }}
            transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
            role="dialog"
            aria-label={L.title}
            className="fixed top-0 z-[101] h-full w-full sm:max-w-md lg:max-w-lg bg-bone-50 shadow-2xl flex flex-col end-0"
          >
            {/* Header */}
            <header className="flex items-start justify-between gap-4 p-6 border-b border-ink/10">
              <div>
                <div className="flex items-center gap-2 text-copper-500">
                  <ShoppingBag size={16} strokeWidth={2} />
                  <span className="eyebrow">{L.title}</span>
                </div>
                <h2 className="heading-display mt-2 text-2xl">{L.title}</h2>
                {items.length > 0 && (
                  <p className="mt-1 text-xs text-ink/50">{L.summary(items.length, count)}</p>
                )}
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label={L.close}
                className="h-9 w-9 flex items-center justify-center text-ink/50 hover:text-ink"
              >
                <X size={20} />
              </button>
            </header>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6">
              {items.length === 0 ? (
                <div className="py-16 text-center">
                  <ShoppingBag size={32} strokeWidth={1.2} className="mx-auto text-ink/20" />
                  <p className="mt-4 font-display text-xl text-ink/70">{L.empty}</p>
                  <p className="mt-2 text-sm text-ink/50 max-w-xs mx-auto">{L.emptyHint}</p>
                </div>
              ) : showForm ? (
                <div className="py-6">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="mb-5 text-xs uppercase tracking-[0.14em] text-ink/50 hover:text-ink"
                  >
                    {L.backToList}
                  </button>
                  <CartDevisForm onSubmitted={() => setShowForm(false)} />
                </div>
              ) : (
                <div className="divide-y divide-ink/10">
                  {items.map((item) => (
                    <CartItemRow key={item.id} item={item} onNavigate={closeDrawer} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && !showForm && (
              <footer className="border-t border-ink/10 p-6 space-y-3 bg-bone-100">
                {(() => {
                  const totalEstime = items.reduce(
                    (sum, it) => sum + (it.priceFromDZD ? it.priceFromDZD * it.quantity : 0),
                    0
                  );
                  const hasUnpriced = items.some((it) => !it.priceFromDZD);
                  return totalEstime > 0 ? (
                    <div className="flex items-baseline justify-between pb-3 border-b border-ink/10">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.14em] text-ink/45">
                          {locale === 'ar' ? 'تقدير إجمالي' : 'Total estimatif'}
                        </p>
                        {hasUnpriced && (
                          <p className="mt-0.5 text-[10px] text-ink/35">
                            {locale === 'ar' ? '+ منتجات على الطلب' : '+ produits sur demande'}
                          </p>
                        )}
                      </div>
                      <p className="font-display text-2xl text-ink tabular-nums">
                        {formatPriceLocalized(totalEstime, locale)}
                      </p>
                    </div>
                  ) : null;
                })()}
                <p className="text-[11px] text-ink/55 leading-relaxed">
                  {locale === 'ar'
                    ? 'الأسعار النهائية ستُحتسب بعد دراسة احتياجاتك من قبل فريقنا.'
                    : "Les prix définitifs sont calculés après étude de vos besoins par notre équipe."}
                </p>
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="btn-primary w-full !bg-copper-500 !border-copper-500 hover:!bg-copper-600 hover:!border-copper-600"
                >
                  {L.askDevis}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(locale === 'ar' ? 'تفريغ السلة بالكامل ؟' : 'Vider tout le panier ?'))
                      clear();
                  }}
                  className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-ink/40 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={11} />
                  {L.clear}
                </button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
