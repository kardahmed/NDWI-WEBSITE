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
      description: 'Photo HD de l\'échantillon réel — remplace la pastille hex quand dispo.',
    }),
    defineField({
      name: 'order',
      title: 'Ordre d’affichage',
      type: 'number',
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
