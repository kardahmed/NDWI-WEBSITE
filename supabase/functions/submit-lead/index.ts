// Supabase Edge Function: submit-lead
// Reçoit une soumission de formulaire depuis le site, valide, persiste en DB
// (table public.leads) et synchronise vers Brevo (contact + emails transactionnels).
//
// Accepte DEUX formats de payload :
//   - NOUVEAU (architecture 12 formulaires) :
//       { lead_type, common: { fullName, email, phone, message, consent, sourcePage, locale }, specific: {...}, hp_field }
//   - LEGACY (DevisForm historique) :
//       { univers, fullName, email, phone, city, ..., hp_field }
//
// Déploiement :
//   - Via CLI : supabase functions deploy submit-lead --project-ref zcqpzkppycauobhhccqu
//
// Variables d'environnement requises (Supabase Dashboard > Edge Functions > Secrets) :
//   - BREVO_API_KEY
//   - BREVO_SENDER_EMAIL
//   - BREVO_SENDER_NAME
//   - LEAD_NOTIFICATION_EMAIL (fallback global)
//   - LEAD_ROUTE_PARTICULIERS (optionnel — email équipe B2C)
//   - LEAD_ROUTE_RESEAU (optionnel — email distributeurs)
//   - LEAD_ROUTE_PROJETS (optionnel — email hôteliers/promoteurs)
//   - LEAD_ROUTE_ARCHITECTES (optionnel — email Architects Club)
//   - LEAD_ROUTE_CONTACT (optionnel — email standard)
//   (SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont auto-injectés)

// @ts-expect-error — Deno runtime imports
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
// @ts-expect-error — Deno runtime imports
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

declare const Deno: { env: { get(key: string): string | undefined } };

// Origines autorisées (CORS). Définir le secret ALLOWED_ORIGINS (liste séparée
// par des virgules, ex. "https://ndwi-dz.com,https://www.ndwi-dz.com") pour
// restreindre. Si non défini → '*' (comportement historique, ne casse rien).
const ALLOWED_ORIGINS = (Deno.env.get('ALLOWED_ORIGINS') ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function corsHeadersFor(req: Request): Record<string, string> {
  const origin = req.headers.get('origin');
  let allow = '*';
  if (ALLOWED_ORIGINS.length > 0) {
    allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  }
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
}

// Fallback statique (utilisé si un appel n'a pas le contexte requête).
const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS[0] ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface NewEnvelope {
  lead_type: string;
  common: {
    fullName: string;
    email: string;
    phone: string;
    message?: string;
    consent?: boolean;
    sourcePage?: string;
    locale?: 'fr' | 'ar';
  };
  specific: Record<string, unknown>;
  hp_field?: string;
}

interface LegacyPayload {
  univers: string | string[];
  projectType?: string;
  city: string;
  timeline?: string;
  budgetRange?: string;
  productsOfInterest?: string;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  productSlug?: string;
  sourcePage?: string;
  locale?: 'fr' | 'ar';
  hp_field?: string;
  website?: string;
}

interface Normalized {
  leadType: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
  sourcePage: string;
  locale: 'fr' | 'ar';
  common: Record<string, unknown>;
  specific: Record<string, unknown>;
  /** Champs legacy (rétro-compat avec colonnes existantes) */
  city?: string;
  univers?: string;
  productSlug?: string;
  budgetRange?: string;
  timeline?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function jsonResponse(body: unknown, status = 200, cors: Record<string, string> = corsHeaders) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });
}

function isNewEnvelope(p: unknown): p is NewEnvelope {
  return (
    !!p && typeof p === 'object' &&
    typeof (p as NewEnvelope).lead_type === 'string' &&
    typeof (p as NewEnvelope).common === 'object'
  );
}

function universArray(u: string | string[] | undefined): string[] {
  if (!u) return [];
  if (Array.isArray(u)) return u.filter((v) => typeof v === 'string' && v.length > 0);
  return u.length > 0 ? [u] : [];
}

/** Retourne la première valeur string non vide parmi `keys` dans `obj`. */
function firstString(obj: Record<string, unknown> | undefined, keys: string[]): string | undefined {
  if (!obj) return undefined;
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === 'string' && v.length > 0) return v;
  }
  return undefined;
}

const algerianPhoneRegex = /^(\+213|00213|0)[\s.-]?[5-7]([\s.-]?\d){8}$/;

function validateNew(p: NewEnvelope): string | null {
  if (p.hp_field && p.hp_field.length > 0) return 'spam';
  const c = p.common;
  if (!c.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email)) return 'email';
  // Newsletter : email seul (pas de téléphone ni nom obligatoires).
  if (p.lead_type === 'newsletter') return null;
  if (!c.fullName || c.fullName.length < 2) return 'fullName';
  if (!c.phone || !algerianPhoneRegex.test(c.phone)) return 'phone';
  // Consentement RGPD obligatoire côté serveur (le front l'exige déjà via zod).
  if (c.consent !== true) return 'consent';
  return null;
}

function validateLegacy(p: LegacyPayload): string | null {
  if (p.hp_field && p.hp_field.length > 0) return 'spam';
  if (p.website && p.website.length > 0) return 'spam';
  if (!p.fullName || p.fullName.length < 2) return 'fullName';
  if (!p.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email)) return 'email';
  if (!p.phone || p.phone.length < 8) return 'phone';
  if (universArray(p.univers).length === 0) return 'univers requis';
  if (!p.city || p.city.length < 2) return 'ville requise';
  return null;
}

function normalize(payload: unknown): Normalized | { error: string } {
  if (isNewEnvelope(payload)) {
    const err = validateNew(payload);
    if (err) return { error: err };
    const { common, specific, lead_type } = payload;
    return {
      leadType: lead_type,
      fullName: common.fullName,
      email: common.email,
      phone: common.phone,
      message: common.message ?? '',
      consent: common.consent === true,
      sourcePage: common.sourcePage ?? '',
      locale: (common.locale ?? 'fr') as 'fr' | 'ar',
      common: common as Record<string, unknown>,
      specific: specific ?? {},
      city: typeof specific?.city === 'string' ? specific.city as string : undefined,
      univers: universFromLeadType(lead_type, specific),
      productSlug: typeof specific?.productSlug === 'string' ? specific.productSlug as string : undefined,
      budgetRange: firstString(specific, ['budget', 'budgetAmenagement', 'volumeAnnuelCible']),
      timeline: firstString(specific, ['delai', 'timeline', 'deadlineOuverture', 'phase']),
    };
  }
  // Legacy
  const p = payload as LegacyPayload;
  const err = validateLegacy(p);
  if (err) return { error: err };
  const universList = universArray(p.univers);
  return {
    leadType: 'devis',
    fullName: p.fullName,
    email: p.email,
    phone: p.phone,
    message: [p.message, p.productsOfInterest ? `\n[Produits repérés] ${p.productsOfInterest}` : ''].filter(Boolean).join(''),
    consent: true,
    sourcePage: p.sourcePage ?? '',
    locale: (p.locale ?? 'fr') as 'fr' | 'ar',
    common: {
      fullName: p.fullName, email: p.email, phone: p.phone,
      message: p.message, sourcePage: p.sourcePage, locale: p.locale ?? 'fr',
    },
    specific: {
      univers: universList, projectType: p.projectType, city: p.city,
      timeline: p.timeline, budgetRange: p.budgetRange,
      productsOfInterest: p.productsOfInterest, productSlug: p.productSlug,
    },
    city: p.city,
    univers: universList.join(','),
    productSlug: p.productSlug,
    budgetRange: p.budgetRange,
    timeline: p.timeline,
  };
}

/** Déduit un "univers" rétro-compatible à partir du lead_type pour la colonne `leads.univers`. */
function universFromLeadType(leadType: string, specific?: Record<string, unknown>): string {
  if (leadType.startsWith('devis-')) return leadType.replace('devis-', '');
  if (leadType === 'pro-hotelier') return 'hotellerie';
  if (leadType === 'pro-distributeur') return 'reseau';
  if (leadType === 'pro-architecte') return 'architectes';
  if (leadType === 'pro-promoteur') return 'promotion';
  if (leadType === 'contact-general') {
    return (specific?.sujet as string) ?? 'contact';
  }
  return 'autre';
}

// ─── Routage email par lead_type ──────────────────────────────────────────────

function routeForLeadType(leadType: string, fallback: string): string {
  const env = Deno.env.get.bind(Deno.env);
  if (leadType.startsWith('devis-')) return env('LEAD_ROUTE_PARTICULIERS') || fallback;
  if (leadType === 'pro-distributeur') return env('LEAD_ROUTE_RESEAU') || fallback;
  if (leadType === 'pro-hotelier' || leadType === 'pro-promoteur') return env('LEAD_ROUTE_PROJETS') || fallback;
  if (leadType === 'pro-architecte') return env('LEAD_ROUTE_ARCHITECTES') || fallback;
  if (leadType === 'contact-general') return env('LEAD_ROUTE_CONTACT') || fallback;
  return fallback;
}

// ─── Labels lisibles ──────────────────────────────────────────────────────────

const LEAD_TYPE_LABELS: Record<string, string> = {
  'devis-porte': 'Devis porte',
  'devis-cuisine': 'Devis cuisine',
  'devis-chambre': 'Devis chambre',
  'devis-dressing': 'Devis dressing',
  'devis-bureau': 'Devis bureau / workspace',
  'devis-salon': 'Devis salon',
  'devis-hotellerie': 'Devis hôtellerie B2C',
  'pro-distributeur': 'Pro · Distributeur',
  'pro-hotelier': 'Pro · Projet hôtelier',
  'pro-architecte': 'Pro · Architecte',
  'pro-promoteur': 'Pro · Promoteur immobilier',
  'contact-general': 'Contact général',
  'newsletter': 'Newsletter',
  'devis': 'Devis (legacy)',
};

// ─── Brevo ────────────────────────────────────────────────────────────────────

async function upsertBrevoContact(n: Normalized, apiKey: string) {
  const [firstName, ...rest] = n.fullName.split(' ');
  const lastName = rest.join(' ') || firstName;

  const attributes: Record<string, unknown> = {
    FIRSTNAME: firstName,
    LASTNAME: lastName,
    SMS: n.phone,
    LEAD_TYPE: LEAD_TYPE_LABELS[n.leadType] || n.leadType,
    SOURCE_PAGE: n.sourcePage || '/',
    LOCALE: n.locale,
  };
  if (n.city) attributes.CITY = n.city;
  if (n.univers) attributes.UNIVERS = n.univers;
  if (n.budgetRange) attributes.BUDGET_RANGE = n.budgetRange;
  if (n.timeline) attributes.TIMELINE = n.timeline;
  if (n.productSlug) attributes.PRODUCT_INTEREST = n.productSlug;

  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email: n.email, attributes, updateEnabled: true }),
  });

  if (!res.ok && res.status !== 204) {
    console.error('[Brevo upsert]', res.status, await res.text());
    return null;
  }
  try { const d = await res.json(); return d.id as number | undefined; } catch { return undefined; }
}

async function sendBrevoEmail(args: {
  to: { email: string; name?: string }[];
  subject: string;
  html: string;
  apiKey: string;
  senderEmail: string;
  senderName: string;
  replyTo?: { email: string; name?: string };
}) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': args.apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      sender: { email: args.senderEmail, name: args.senderName },
      to: args.to,
      subject: args.subject,
      htmlContent: args.html,
      replyTo: args.replyTo,
    }),
  });
  if (!res.ok) { console.error('[Brevo email]', res.status, await res.text()); return false; }
  return true;
}

// ─── Templates HTML ───────────────────────────────────────────────────────────

function escapeHtml(s: string) { return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!)); }

function clientConfirmationHtml(n: Normalized) {
  const typeLabel = LEAD_TYPE_LABELS[n.leadType] || n.leadType;
  if (n.locale === 'ar') {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; color: #0A0A0A; direction: rtl; text-align: right;">
        <h2 style="font-weight: 400;">شكراً لك ${escapeHtml(n.fullName)} 🙏</h2>
        <p>تم استلام طلبك (${escapeHtml(typeLabel)}). سيتواصل معك مستشار خلال 24 إلى 48 ساعة عمل.</p>
        <hr style="border: none; border-top: 1px solid #E8E0D5; margin: 24px 0;" />
        <p style="margin-top: 32px; font-size: 13px; color: #4A4A4A;">مجموعة NDWI<br/>وهران، الجزائر</p>
      </div>
    `;
  }
  return `
    <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; color: #0A0A0A;">
      <h2 style="font-weight: 400;">Merci ${escapeHtml(n.fullName)} 🙏</h2>
      <p>Votre demande (<strong>${escapeHtml(typeLabel)}</strong>) a bien été reçue. Un conseiller du Groupe NDWI vous recontactera sous 24 à 48 h ouvrées.</p>
      <hr style="border: none; border-top: 1px solid #E8E0D5; margin: 24px 0;" />
      <p style="margin-top: 32px; font-size: 13px; color: #4A4A4A;">Groupe NDWI<br/>Oran, Algérie</p>
    </div>
  `;
}

function teamNotificationHtml(n: Normalized) {
  const typeLabel = LEAD_TYPE_LABELS[n.leadType] || n.leadType;
  const specificRows = Object.entries(n.specific)
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0))
    .map(([k, v]) => {
      const val = Array.isArray(v) ? v.join(' · ') : typeof v === 'object' ? JSON.stringify(v) : String(v);
      return `<tr><td style="padding: 8px 12px; background: #F5F2EE; width: 180px;"><strong>${escapeHtml(k)}</strong></td><td style="padding: 8px 12px;">${escapeHtml(val)}</td></tr>`;
    })
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; color: #0A0A0A;">
      <div style="background: #0A0A0A; color: #F5F2EE; padding: 20px 24px;">
        <p style="margin: 0; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #B8651A;">${escapeHtml(typeLabel)}</p>
        <h2 style="margin: 8px 0 0 0; font-weight: 400; font-size: 22px;">${escapeHtml(n.fullName)}</h2>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 14px;">
        <tr><td style="padding: 8px 12px; background: #F5F2EE; width: 180px;"><strong>Email</strong></td><td style="padding: 8px 12px;"><a href="mailto:${escapeHtml(n.email)}">${escapeHtml(n.email)}</a></td></tr>
        <tr><td style="padding: 8px 12px; background: #F5F2EE;"><strong>Téléphone</strong></td><td style="padding: 8px 12px;"><a href="tel:${escapeHtml(n.phone)}">${escapeHtml(n.phone)}</a></td></tr>
        ${n.sourcePage ? `<tr><td style="padding: 8px 12px; background: #F5F2EE;"><strong>Page source</strong></td><td style="padding: 8px 12px;">${escapeHtml(n.sourcePage)}</td></tr>` : ''}
        <tr><td style="padding: 8px 12px; background: #F5F2EE;"><strong>Langue</strong></td><td style="padding: 8px 12px;">${n.locale.toUpperCase()}</td></tr>
        ${specificRows}
      </table>

      ${n.message ? `
        <div style="margin-top: 24px; padding: 16px; background: #F5F2EE; border-left: 3px solid #B8651A;">
          <p style="margin: 0 0 8px 0; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #4A4A4A;">Message</p>
          <p style="margin: 0; font-size: 14px; white-space: pre-wrap;">${escapeHtml(n.message)}</p>
        </div>
      ` : ''}

      <p style="margin-top: 32px; font-size: 12px; color: #4A4A4A;">Reçu via le site ndwi-dz.com</p>
    </div>
  `;
}

// ─── Handler principal ────────────────────────────────────────────────────────

serve(async (req: Request) => {
  const cors = corsHeadersFor(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return jsonResponse({ error: 'method not allowed' }, 405, cors);

  let raw: unknown;
  try { raw = await req.json(); } catch { return jsonResponse({ error: 'invalid json' }, 400, cors); }

  const result = normalize(raw);
  if ('error' in result) {
    if (result.error === 'spam') return jsonResponse({ ok: true }, 200, cors); // silently drop
    return jsonResponse({ error: result.error }, 400, cors);
  }
  const n = result;

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const brevoApiKey = Deno.env.get('BREVO_API_KEY');
  const senderEmail = Deno.env.get('BREVO_SENDER_EMAIL');
  const senderName = Deno.env.get('BREVO_SENDER_NAME') || 'Groupe NDWI';
  const notifyEmail = Deno.env.get('LEAD_NOTIFICATION_EMAIL');

  if (!supabaseUrl || !supabaseServiceKey || !brevoApiKey || !senderEmail || !notifyEmail) {
    console.error('[submit-lead] Missing env vars');
    return jsonResponse({ error: 'server config' }, 500, cors);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // 1) Insert lead
  const { data: leadRow, error: insertError } = await supabase
    .from('leads')
    .insert({
      email: n.email,
      full_name: n.fullName,
      phone: n.phone,
      city: n.city ?? null,
      lead_type: n.leadType,
      source_page: n.sourcePage || null,
      univers: n.univers ?? null,
      product_slug: n.productSlug ?? null,
      message: n.message || null,
      budget_range: n.budgetRange ?? null,
      project_timeline: n.timeline ?? null,
      locale: n.locale,
      user_agent: req.headers.get('user-agent') || null,
      common_data: n.common,
      specific_data: n.specific,
      consent: n.consent,
    })
    .select()
    .single();

  if (insertError) {
    console.error('[submit-lead] DB insert error', insertError);
    return jsonResponse({ error: 'db error', detail: insertError.message }, 500, cors);
  }

  // 2) Brevo upsert (non-bloquant)
  const brevoContactId = await upsertBrevoContact(n, brevoApiKey).catch(() => null);
  if (brevoContactId) {
    await supabase
      .from('leads')
      .update({ brevo_contact_id: brevoContactId, brevo_synced_at: new Date().toISOString() })
      .eq('id', leadRow.id);
  }

  // 3) Emails (confirmation client + notification équipe routée par lead_type)
  const targetTeamEmail = routeForLeadType(n.leadType, notifyEmail);
  const typeLabel = LEAD_TYPE_LABELS[n.leadType] || n.leadType;

  await Promise.all([
    sendBrevoEmail({
      to: [{ email: n.email, name: n.fullName }],
      subject: n.locale === 'ar' ? 'تم استلام طلبك — مجموعة NDWI' : "Votre demande a bien été reçue — Groupe NDWI",
      html: clientConfirmationHtml(n),
      apiKey: brevoApiKey, senderEmail, senderName,
    }).catch((e) => console.error('[client mail]', e)),
    sendBrevoEmail({
      to: [{ email: targetTeamEmail }],
      subject: `🔔 ${typeLabel} — ${n.fullName}${n.city ? ` (${n.city})` : ''}`,
      html: teamNotificationHtml(n),
      apiKey: brevoApiKey, senderEmail, senderName,
      replyTo: { email: n.email, name: n.fullName },
    }).catch((e) => console.error('[team mail]', e)),
  ]);

  return jsonResponse({ ok: true, leadId: leadRow.id }, 200, cors);
});
