import { defineType, defineField } from 'sanity';

export const productSchema = defineType({
  name: 'product',
  title: 'Cuisines & Bureaux',
  type: 'document',
  groups: [
    { name: 'main', title: 'Principal' },
    { name: 'desc', title: 'Descriptions' },
    { name: 'media', title: 'Visuel' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nom du produit',
      type: 'string',
      group: 'main',
      description: 'Ex. Cuisine Cirta Moderne, Bureau Tower, Porte Antea Variant',
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
          { title: 'Cuisine', value: 'cuisine' },
          { title: 'Dressing', value: 'dressing' },
          { title: 'Chambre', value: 'chambre' },
          { title: 'Bureau', value: 'bureau' },
          { title: 'Salon', value: 'salon' },
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
        'NDWi = production locale Algérie · NDO = importation. Cette information détermine le badge affiché sur la carte produit et permet aux clients de filtrer.',
      options: {
        list: [
          { title: 'NDWi 🇩🇿 — Production Algérie', value: 'ndwi' },
          { title: 'NDO 🇮🇹 — Importation', value: 'ndo' },
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
        'Ex. Cirta, Hoggar, Sahara, Antea, Djado, Tower, President… Sert à grouper et filtrer.',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Description courte',
      type: 'localeString',
      group: 'desc',
      description: 'Une phrase qui résume le produit (utilisée sur les cartes catalogue)',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description complète (optionnel)',
      type: 'localeText',
      group: 'desc',
      description: 'Paragraphe détaillé — pour fiche produit future.',
    }),
    defineField({
      name: 'image',
      title: 'Packshot (fond blanc)',
      type: 'image',
      group: 'media',
      description:
        'Photo produit sur fond blanc pur (style catalogue luxe). 1400×1400 carré pour cuisines/bureaux, 1200×1500 portrait pour portes.',
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Format de la card',
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
    defineField({
      name: 'order',
      title: "Ordre d'affichage",
      type: 'number',
      group: 'main',
      description: 'Plus petit = en premier dans le catalogue',
      initialValue: 100,
    }),
    defineField({
      name: 'published',
      title: 'Publié',
      type: 'boolean',
      group: 'main',
      initialValue: true,
      description: 'Décocher pour masquer du site sans supprimer.',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'collection', media: 'image', category: 'category' },
    prepare: ({ title, subtitle, media, category }) => ({
      title,
      subtitle: `${category ?? ''}${subtitle ? ' · ' + subtitle : ''}`,
      media,
    }),
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
    { title: 'Nom A→Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
  ],
});
