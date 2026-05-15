import { defineType, defineField } from 'sanity';

export const realisationSchema = defineType({
  name: 'realisation',
  title: 'Réalisation',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Titre', type: 'localeString', validation: (R) => R.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title.fr', maxLength: 80 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: 'Résidentiel', value: 'residentiel' },
          { title: 'Promotion immobilière', value: 'promotion' },
          { title: 'Hôtellerie', value: 'hotellerie' },
          { title: 'Workspace / Bureaux', value: 'workspace' },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({ name: 'city', title: 'Ville', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'year', title: 'Année', type: 'number' }),
    defineField({ name: 'client', title: 'Client', type: 'string' }),
    defineField({ name: 'summary', title: 'Résumé', type: 'localeText' }),
    defineField({ name: 'body', title: 'Étude de cas', type: 'localeRichText' }),
    defineField({
      name: 'heroImage',
      title: 'Image principale',
      type: 'image',
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'universes',
      title: 'Univers concernés',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Portes', value: 'portes' },
          { title: 'Cuisines', value: 'cuisines' },
          { title: 'Chambres', value: 'chambres' },
          { title: 'Dressing', value: 'dressing' },
          { title: 'Mobilier hôtelier', value: 'hotellerie' },
          { title: 'Workspace', value: 'workspace' },
        ],
      },
    }),
    defineField({ name: 'featured', title: 'À la une (home)', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'title.fr', subtitle: 'city', media: 'heroImage' },
  },
});
