# Architecture des formulaires NDWI

## Principe

Chaque page ou demande utilisateur dispose de **son propre formulaire**, avec des champs métier adaptés au contexte. Tous les formulaires partagent un même socle (coordonnées, RGPD, anti-spam) et un même point d'envoi Supabase.

## Inventaire (12 formulaires)

### B2C — Catalogue habitat / workspace

| Fichier | Page | `lead_type` |
|---|---|---|
| `b2c/devis-porte.tsx` | `/habitat/portes/[slug]` | `devis-porte` |
| `b2c/devis-cuisine.tsx` | `/habitat/cuisines` | `devis-cuisine` |
| `b2c/devis-chambre.tsx` | `/habitat/chambres` | `devis-chambre` |
| `b2c/devis-dressing.tsx` | `/habitat/dressing` | `devis-dressing` |
| `b2c/devis-bureau.tsx` | `/habitat/bureaux`, `/workspace/*` | `devis-bureau` |
| `b2c/devis-salon.tsx` | `/habitat/salons` | `devis-salon` |
| `b2c/devis-hotellerie.tsx` | `/habitat/hotellerie` (B2C) | `devis-hotellerie` |

### Pro — Partenariats et grands comptes

| Fichier | Page | `lead_type` |
|---|---|---|
| `pro/devenir-distributeur.tsx` | `/pro/distributeurs` | `pro-distributeur` |
| `pro/projet-hotelier.tsx` | `/pro/hoteliers` | `pro-hotelier` |
| `pro/partenariat-architecte.tsx` | `/pro/architectes` | `pro-architecte` |
| `pro/promotion-immobiliere.tsx` | `/pro/promoteurs` | `pro-promoteur` |

### Transverse

| Fichier | Page | `lead_type` |
|---|---|---|
| `contact-general.tsx` | `/contact`, `/showrooms/*`, `/realisations/*` | `contact-general` |

## Routage

- `b2c/habitat-trigger.tsx` — sélectionne le bon formulaire B2C selon l'univers de la page habitat.
- `pro/pro-audience-trigger.tsx` — sélectionne le bon formulaire pro selon l'audience.
- `contact-trigger.tsx` — wrapper modal sur `ContactGeneralForm`.

## Briques partagées (`forms/_shared/`)

- `field.tsx` — `Field`, `RadioPills`, `CheckboxPills`, classes input/textarea.
- `honeypot.tsx` — champ anti-bot.
- `consent-rgpd.tsx` — case RGPD obligatoire (FR/AR).
- `form-success.tsx` — écran post-envoi.
- `error-banner.tsx` — bandeau d'erreur.
- `submit-button.tsx` — bouton submit avec loader.
- `form-modal.tsx` — `FormModalTrigger` (bouton qui ouvre une modale avec n'importe quel formulaire).

## Schémas Zod (`lib/schemas/`)

- `lead-common.ts` — base partagée : `fullName`, `email`, `phone` (regex algérienne), `message`, `consent`, `sourcePage`, `locale`, `hp_field`.
- `lead-devis-porte.ts`, `lead-devis-b2c.ts` (cuisine, chambre, dressing, bureau, salon, hotellerie) — B2C.
- `lead-pro-distributeur.ts`, `lead-pro-hotelier.ts`, `lead-pro-architecte.ts`, `lead-pro-promoteur.ts` — Pro.
- `lead-contact.ts` — contact général (message obligatoire).

## Pipeline d'envoi (`lib/forms/submit-lead.ts`)

```ts
submitLead<TData>(leadType, formData) → POST { lead_type, common, specific, hp_field }
```

Tous les formulaires appellent ce helper. Le payload est une **enveloppe discriminée** :

```json
{
  "lead_type": "devis-porte",
  "common": {
    "fullName": "…",
    "email": "…",
    "phone": "+213 …",
    "message": "…",
    "consent": true,
    "sourcePage": "/habitat/portes/marsia",
    "locale": "fr"
  },
  "specific": {
    "categorie": "interieure",
    "quantite": "2-5",
    "finition": "bois",
    "dimensions": "900 × 2100",
    "delai": "3mois",
    "city": "Oran",
    "productSlug": "marsia"
  },
  "hp_field": ""
}
```

## Migration Supabase Edge Function `submit-lead`

L'ancienne Edge Function recevait le shape plat de `DevisForm`. Il faut la mettre à jour pour :

1. **Accepter le nouveau payload** (enveloppe `lead_type` + `common` + `specific`).
2. **Refuser les soumissions où `hp_field` est non vide** (bot).
3. **Insérer dans `leads`** une ligne avec colonnes :
   - `id uuid pk default gen_random_uuid()`
   - `created_at timestamptz default now()`
   - `lead_type text not null` — discriminant pour le routage email/CRM
   - `common_data jsonb not null` — `{ fullName, email, phone, message, consent, sourcePage, locale }`
   - `specific_data jsonb not null` — payload métier brut par formulaire
   - `email text generated always as (common_data->>'email') stored` — index utile
   - `status text default 'new'` — workflow (`new` → `contacted` → `qualified` → `won` / `lost`)
4. **Router par email selon `lead_type`** :
   - `devis-*` → équipe commerciale particuliers (`contact-particuliers@ndwi.dz`)
   - `pro-distributeur` → développement réseau (`reseau@ndwi.dz`)
   - `pro-hotelier`, `pro-promoteur` → cellule projets B2B (`projets@ndwi.dz`)
   - `pro-architecte` → Architects Club (`architects@ndwi.dz`)
   - `contact-general` → standard (`contact@ndwi.dz`)
5. **Conserver compat backward** : si payload sans `lead_type` mais avec `univers` → traiter comme legacy `DevisForm` jusqu'à fin de migration (à supprimer après).

### Schéma SQL recommandé

```sql
create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  lead_type     text not null,
  common_data   jsonb not null,
  specific_data jsonb not null,
  status        text not null default 'new',
  email         text generated always as (common_data->>'email') stored,
  source_page   text generated always as (common_data->>'sourcePage') stored
);

create index leads_lead_type_idx on public.leads (lead_type);
create index leads_created_at_idx on public.leads (created_at desc);
create index leads_email_idx on public.leads (email);
```

### Squelette Edge Function (Deno)

```ts
import { createClient } from 'jsr:@supabase/supabase-js@2';

const ROUTES: Record<string, string[]> = {
  'devis-porte': ['contact-particuliers@ndwi.dz'],
  'devis-cuisine': ['contact-particuliers@ndwi.dz'],
  // …
  'pro-distributeur': ['reseau@ndwi.dz'],
  'pro-hotelier': ['projets@ndwi.dz'],
  'pro-architecte': ['architects@ndwi.dz'],
  'contact-general': ['contact@ndwi.dz'],
};

Deno.serve(async (req) => {
  const body = await req.json();

  if (body.hp_field) return new Response('ok', { status: 200 }); // bot silently dropped

  const { lead_type, common, specific } = body;
  if (!lead_type || !common?.email) {
    return new Response(JSON.stringify({ error: 'invalid payload' }), { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  const { error } = await supabase.from('leads').insert({
    lead_type,
    common_data: common,
    specific_data: specific,
  });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  // sendgrid / resend / SMTP — envoie à ROUTES[lead_type]
  // …

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
});
```

## Suppression future

Une fois la migration backend déployée et validée, supprimer :
- `src/components/forms/devis-form.tsx`
- `src/components/forms/devis-modal-trigger.tsx`
- `src/lib/schemas/lead.ts`

Tous les call-sites ont déjà été migrés vers les nouveaux composants.
