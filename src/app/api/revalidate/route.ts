import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

/**
 * Webhook endpoint appelé par Sanity quand un document est créé, modifié ou supprimé.
 * Invalide le cache ISR de Next.js sur les paths concernés sans rebuild complet.
 *
 * Configuration côté Sanity Studio :
 *   - URL    : https://ndwi-dz.com/api/revalidate
 *   - Trigger: Create, Update, Delete
 *   - Filter : _type in ['door', 'finition', 'product']  (optionnel)
 *   - Secret : la valeur de SANITY_REVALIDATE_SECRET (env Hostinger)
 *
 * Sanity envoie un header `sanity-webhook-signature` HMAC-SHA256 du body.
 * On le vérifie via parseBody (next-sanity/webhook) avant de revalider.
 */

const REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET;

type SanityWebhookBody = {
  _type?: string;
  slug?: { current?: string } | string;
  _id?: string;
};

function getSlug(slug: SanityWebhookBody['slug']): string | undefined {
  if (typeof slug === 'string') return slug;
  return slug?.current;
}

export async function POST(req: NextRequest) {
  if (!REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: 'Server missing SANITY_REVALIDATE_SECRET' },
      { status: 500 }
    );
  }

  let body: SanityWebhookBody | null = null;
  try {
    const parsed = await parseBody<SanityWebhookBody>(req, REVALIDATE_SECRET);
    if (!parsed.isValidSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    body = parsed.body;
  } catch (e) {
    return NextResponse.json(
      { error: 'Bad request', detail: e instanceof Error ? e.message : 'unknown' },
      { status: 400 }
    );
  }

  if (!body?._type) {
    return NextResponse.json({ error: 'Missing _type in payload' }, { status: 400 });
  }

  const slug = getSlug(body.slug);
  const paths: string[] = [];

  // Routage : quel _type Sanity invalide quels paths Next.js.
  switch (body._type) {
    case 'door':
      paths.push('/fr/habitat/portes', '/ar/habitat/portes');
      if (slug) {
        paths.push(`/fr/habitat/portes/${slug}`, `/ar/habitat/portes/${slug}`);
      }
      // Le sitemap inclut chaque porte → on l'invalide aussi.
      paths.push('/sitemap.xml');
      break;

    case 'finition':
      paths.push(
        '/fr/habitat/finitions',
        '/ar/habitat/finitions',
        '/fr/configurateur/portes',
        '/ar/configurateur/portes'
      );
      break;

    case 'product':
      paths.push('/fr/habitat', '/ar/habitat');
      break;

    default:
      // Type non géré : on ne fait rien mais on répond OK pour que Sanity n'insiste pas.
      return NextResponse.json({ ignored: true, _type: body._type });
  }

  paths.forEach((p) => revalidatePath(p));
  // Tag global au cas où des pages utilisent un fetch avec tag.
  revalidateTag('sanity');

  return NextResponse.json({
    revalidated: paths,
    _type: body._type,
    slug: slug ?? null,
    at: new Date().toISOString(),
  });
}

// Empêcher GET (juste pour clarifier en cas de visite manuelle).
export function GET() {
  return NextResponse.json({ error: 'Use POST with Sanity webhook signature' }, { status: 405 });
}
