import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Exclut : api, _next, _vercel, /admin (Sanity Studio), fichiers statiques (avec extension)
  matcher: ['/((?!api|admin|_next|_vercel|.*\\..*).*)'],
};
