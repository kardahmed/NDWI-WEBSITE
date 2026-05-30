import { defineType, defineField } from 'sanity';

/**
 * Revêtement / finition CPL — option globale partagée par les portes NDWi.
 * Documents référencés par Door.compatibleRevetements[].
 */
export const revetementSchema = defineType({
  name: 'revetement',
  title: 'Revêtement (Finition catalogue)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom commercial',
      type: 'string',
      description: 'Ex. BIANCO NIVEO, PATINATO GHIACCIO, ROVERE AZTECO',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'name', maxLength: 60 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'code',
      title: 'Code catalogue',
      type: 'string',
      description: 'Code numérique officiel du catalogue NDWi (ex. 0118, 8765).',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'family',
      title: 'Famille couleur',
      type: 'string',
      options: {
        list: [
          { title: 'Blanc', value: 'blanc' },
          { title: 'Gris', value: 'gris' },
          { title: 'Bois clair', value: 'bois-clair' },
          { title: 'Bois foncé', value: 'bois-fonce' },
          { title: 'Wengé', value: 'wenge' },
        ],
      },
    }),
    defineField({
      name: 'hex',
      title: 'Code couleur HEX (#RRGGBB)',
      type: 'string',
      description: 'Pour la pastille du configurateur en attendant la photo réelle.',
      validation: (R) =>
        R.required().regex(/^#([A-Fa-f0-9]{6})$/, { name: 'hex couleur' }),
    }),
    defineField({
      name: 'image',
      title: 'Photo texture (échantillon)',
      type: 'image',
      options: { hotspot: true },
      description: 'Photo HD de l\'échantillon réel (texture en gros plan) — 800×800 minimum. Remplace la pastille hex sur le configurateur quand uploadée.',
    }),
    defineField({
      name: 'description',
      title: 'Description (optionnel)',
      type: 'localeText',
      description: 'Une phrase qui parle du look (ex. "Effet chêne brossé chaleureux, veinage marqué"). Aide le client à se projeter.',
    }),
    defineField({
      name: 'priceSupplementDZD',
      title: 'Supplément de prix (DZD, optionnel)',
      type: 'number',
      description: 'Si cette finition coûte en plus du prix de base (ex. laqués brillants premium). Laisser vide si incluse au prix de base.',
      validation: (R) => R.min(0),
    }),
    defineField({
      name: 'order',
      title: 'Ordre d’affichage',
      type: 'number',
      description: 'Plus petit = en premier dans le configurateur.',
      initialValue: 100,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'code', media: 'image' },
  },
  orderings: [
    { title: 'Ordre', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Code', name: 'codeAsc', by: [{ field: 'code', direction: 'asc' }] },
  ],
});
