import { defineType, defineField } from 'sanity';

/**
 * Product — cuisines, dressing, chambres, bureaux, salons.
 * (Le schema porte historiquement le nom "Cuisines & Bureaux" car c'est le
 *  catalogue principal NDO + NDWi pour ces catégories.)
 *
 * Workflow utilisateur cible : ouvrir Studio → uploader photo principale →
 * remplir les 3-4 champs essentiels (marque, catégorie, description) →
 * compléter optionnellement les specs techniques + pastilles couleur si dispo.
 */
export const productSchema = defineType({
  name: 'product',
  title: 'Cuisines & Bureaux',
  type: 'document',
  groups: [
    { name: 'main', title: '① Principal', default: true },
    { name: 'desc', title: '② Descriptions' },
    { name: 'specs', title: '③ Caractéristiques' },
    { name: 'price', title: '④ Prix' },
    { name: 'media', title: '⑤ Visuels' },
    { name: 'admin', title: '⑥ Admin' },
  ],
  fields: [
    // ─── ① Principal ─────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Nom du produit',
      type: 'string',
      group: 'main',
      description: 'Ex. Cuisine Cirta Moderne, Bureau Tower, Dressing Atelier',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'main',
      options: { source: 'name', maxLength: 80 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      group: 'main',
      options: {
        list: [
          { title: '🍳 Cuisine', value: 'cuisine' },
          { title: '👔 Dressing', value: 'dressing' },
          { title: '🛏 Chambre', value: 'chambre' },
          { title: '💼 Bureau', value: 'bureau' },
          { title: '🛋 Salon', value: 'salon' },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'brand',
      title: 'Marque',
      type: 'string',
      group: 'main',
      description:
        'NDWi = production locale Algérie · NDO = importation Italie. Affecte le badge sur la card + le filtre des pages /ndo et /ndwi.',
      options: {
        list: [
          { title: 'NDWi — Production Algérie', value: 'ndwi' },
          { title: 'NDO — Importation Italie', value: 'ndo' },
        ],
        layout: 'radio',
      },
      initialValue: 'ndwi',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'collection',
      title: 'Collection / Gamme',
      type: 'string',
      group: 'main',
      description:
        'Ex. CIRTA, HOGGAR, SAHARA, ANTEA, TOWER, PRESIDENT… Permet de grouper plusieurs variantes (ex. Cuisine Cirta Moderne / Bleu Nuit / Mineral Grey font partie de la collection CIRTA).',
    }),
    defineField({
      name: 'tags',
      title: 'Badges',
      type: 'array',
      group: 'main',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Best-seller', value: 'best-seller' },
          { title: 'Signature', value: 'signature' },
          { title: 'Nouveau', value: 'nouveau' },
          { title: 'Édition limitée', value: 'edition-limitee' },
        ],
      },
    }),

    // ─── ② Descriptions ──────────────────────────────────────────────
    defineField({
      name: 'shortDescription',
      title: 'Description courte',
      type: 'localeString',
      group: 'desc',
      description: 'Une phrase qui résume le produit. Affichée sur les cartes catalogue.',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description complète',
      type: 'localeText',
      group: 'desc',
      description:
        'Paragraphe détaillé pour la fiche produit. Style, contexte d’usage, points forts. 2-4 phrases.',
    }),
    defineField({
      name: 'composition',
      title: 'Composition technique',
      type: 'localeText',
      group: 'desc',
      description:
        'Description riche des matériaux et de la construction (ex. "Structure mélaminé blanc, façades MDF laqué brillant, plan de travail quartz Silestone, poignées encastrées inox brossé").',
    }),

    // ─── ③ Caractéristiques techniques ──────────────────────────────
    defineField({
      name: 'caracteristiques',
      title: 'Caractéristiques (liste à puces)',
      type: 'array',
      group: 'specs',
      of: [{ type: 'localeString' }],
      description:
        'Une liste à puces affichée sur la fiche produit (ex. "Façades laquées 8 couches", "Charnières Blum SoftClose", "Garantie 10 ans").',
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions standard (texte libre)',
      type: 'string',
      group: 'specs',
      description:
        'Ex. "L 2,80 × P 0,60 × H 0,90 m" ou "Disponible en 4 m, 5 m, 6 m linéaires". Le client comprend mieux du libre que des champs séparés sur ce type de produit.',
    }),
    defineField({
      name: 'origine',
      title: 'Origine de fabrication',
      type: 'string',
      group: 'specs',
      description:
        'Ex. "Fabriqué en Italie par ARAN Cucine", "Produit en Algérie — usine NDWi Oran". Si vide, déduit de la marque.',
    }),
    defineField({
      name: 'garantie',
      title: 'Garantie',
      type: 'string',
      group: 'specs',
      description: 'Ex. "10 ans constructeur", "5 ans pièces et main d\'œuvre".',
    }),
    defineField({
      name: 'features',
      title: 'Points forts mis en avant (icônes)',
      type: 'array',
      group: 'specs',
      of: [{ type: 'localeString' }],
      description:
        'Liste très courte de 3-5 atouts différenciants pour les cards (ex. "Plan quartz", "Tiroirs Blum", "Made in Italy").',
    }),

    // ─── ④ Prix ─────────────────────────────────────────────────────
    defineField({
      name: 'priceFromDZD',
      title: 'Prix public "à partir de" (DZD)',
      type: 'number',
      group: 'price',
      description:
        'Prix indicatif en Dinars Algériens pour la configuration de base. Affiché en bas de la card et sur la fiche. Laisser vide pour "Prix sur demande" (recommandé pour NDO si tarifs variables).',
      validation: (R) => R.positive(),
    }),

    // ─── ⑤ Visuels ──────────────────────────────────────────────────
    defineField({
      name: 'image',
      title: 'Image principale (catalogue)',
      type: 'image',
      group: 'media',
      description:
        'Photo principale du produit affichée sur la card et en hero de la fiche. Fond blanc/neutre recommandé. 1400×1400 carré (cuisines/bureaux), 1200×1500 portrait (portes).',
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie (photos supplémentaires)',
      type: 'array',
      group: 'media',
      of: [{ type: 'image', options: { hotspot: true } }],
      description:
        'Photos additionnelles affichées en mosaïque sur la fiche produit : vues d\'angle, détail finitions, mise en situation, plans techniques…',
    }),
    defineField({
      name: 'colorVariants',
      title: 'Variantes couleur (pastilles Apple-style)',
      type: 'array',
      group: 'media',
      description:
        'Pour les produits déclinés en plusieurs finitions (ex. Cuisine CIRTA en Moderne / Bleu Nuit / Mineral Grey). Le client cliquera sur une pastille et l\'image principale changera. Laisser vide si une seule version.',
      of: [
        {
          type: 'object',
          name: 'colorVariant',
          fields: [
            defineField({
              name: 'name',
              title: 'Nom de la variante',
              type: 'localeString',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'slug',
              title: 'Slug',
              type: 'slug',
              options: { source: (doc) => (doc as { name?: { fr?: string } }).name?.fr ?? '' },
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'hex',
              title: 'Code couleur hex (#RRGGBB)',
              type: 'string',
              description: 'Pour la pastille — affichée même si l\'image n\'est pas encore uploadée.',
              validation: (R) =>
                R.required().regex(/^#([A-Fa-f0-9]{6})$/, { name: 'hex couleur' }),
            }),
            defineField({
              name: 'image',
              title: 'Image de cette variante',
              type: 'image',
              options: { hotspot: true },
              description:
                'Photo du produit dans cette finition. Remplacera l\'image principale au clic sur la pastille.',
            }),
          ],
          preview: {
            select: { title: 'name.fr', media: 'image', subtitle: 'hex' },
          },
        },
      ],
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Format de la card catalogue',
      type: 'string',
      group: 'media',
      options: {
        list: [
          { title: 'Carré 1:1 (cuisines, bureaux)', value: '1:1' },
          { title: 'Portrait 4:5 (portes)', value: '4:5' },
        ],
        layout: 'radio',
      },
      initialValue: '1:1',
      validation: (R) => R.required(),
    }),

    // ─── ⑥ Admin ────────────────────────────────────────────────────
    defineField({
      name: 'order',
      title: "Ordre d'affichage",
      type: 'number',
      group: 'admin',
      description: 'Plus petit = en premier dans le catalogue. Mettre 1 pour les hero produits.',
      initialValue: 100,
    }),
    defineField({
      name: 'published',
      title: 'Publié',
      type: 'boolean',
      group: 'admin',
      initialValue: true,
      description: 'Décocher pour masquer du site sans supprimer.',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'collection', media: 'image', category: 'category', brand: 'brand' },
    prepare: ({ title, subtitle, media, category, brand }) => {
      const brandTag = brand ? ` [${String(brand).toUpperCase()}]` : '';
      return {
        title: `${title}${brandTag}`,
        subtitle: `${category ?? ''}${subtitle ? ' · ' + subtitle : ''}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Catégorie + ordre',
      name: 'categoryOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
    { title: 'Marque + ordre', name: 'brandOrder', by: [{ field: 'brand', direction: 'asc' }, { field: 'order', direction: 'asc' }] },
    { title: 'Nom A→Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
  ],
});
