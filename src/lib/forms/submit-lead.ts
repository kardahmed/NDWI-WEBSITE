import { SUBMIT_LEAD_URL } from '@/lib/supabase';
import type { LeadType, LeadCommon } from '@/lib/schemas/lead-common';

export interface LeadEnvelope {
  lead_type: LeadType;
  common: Omit<LeadCommon, 'hp_field'>;
  specific: Record<string, unknown>;
  hp_field: string;
}

/**
 * Sépare les champs communs des champs spécifiques et POST vers l'Edge Function.
 * Le backend route ensuite vers l'équipe interne en fonction de `lead_type`.
 */
export async function submitLead<TData extends LeadCommon & Record<string, unknown>>(
  leadType: LeadType,
  data: TData
): Promise<{ ok: true } | { ok: false; error: string }> {
  const {
    fullName,
    email,
    phone,
    message,
    consent,
    sourcePage,
    locale,
    hp_field,
    ...specific
  } = data;

  const envelope: LeadEnvelope = {
    lead_type: leadType,
    common: { fullName, email, phone, message, consent, sourcePage, locale },
    specific,
    hp_field: hp_field ?? '',
  };

  try {
    const res = await fetch(SUBMIT_LEAD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
      body: JSON.stringify(envelope),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { ok: false, error: err.error || `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'network' };
  }
}
