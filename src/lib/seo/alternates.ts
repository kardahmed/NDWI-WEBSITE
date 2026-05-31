import { siteConfig } from '@/lib/site';
import { routing } from '@/i18n/routing';

/**
 * Génère les hreflang alternates pour une route donnée.
 *
 * À utiliser dans generateMetadata de chaque page :
 *
 *   export async function generateMetadata({ params }) {
 *     const { locale } = await params;
 *     return {
 *       title: '...',
 *       description: '...',
 *       alternates: getLocalizedAlternates('/habitat/portes', locale),
 *     };
 *   }
 *
 * Génère :
 *   - canonical = URL absolue pour la locale courante
 *   - languages.fr = URL FR
 *   - languages.ar = URL AR
 *   - languages['x-default'] = URL FR (locale par défaut)
 *
 * @param routePath chemin sans préfixe locale (ex. '/habitat/portes')
 * @param currentLocale locale active (pour la canonical)
 */
/**
 * Variante "static" — pour les pages qui utilisent `export const metadata`
 * et n'ont pas accès au `locale` (sans canonical du coup, Next.js prendra
 * l'URL courante automatiquement).
 *
 *   export const metadata = {
 *     title: '...',
 *     alternates: getStaticAlternates('/ndo'),
 *   };
 */
export function getStaticAlternates(routePath: string) {
  const path = routePath.startsWith('/') ? routePath : `/${routePath}`;
  const cleanPath = path.replace(/\/$/, '') || '';
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${siteConfig.url}/${loc}${cleanPath}`;
  }
  languages['x-default'] = `${siteConfig.url}/${routing.defaultLocale}${cleanPath}`;
  return { languages };
}

export function getLocalizedAlternates(routePath: string, currentLocale: string) {
  // Nettoyer le path : enlever slash final, garantir slash initial
  const path = routePath.startsWith('/') ? routePath : `/${routePath}`;
  const cleanPath = path.replace(/\/$/, '') || '';

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${siteConfig.url}/${loc}${cleanPath}`;
  }
  // x-default pointe vers FR (locale par défaut)
  languages['x-default'] = `${siteConfig.url}/${routing.defaultLocale}${cleanPath}`;

  return {
    canonical: `${siteConfig.url}/${currentLocale}${cleanPath}`,
    languages,
  };
}
