import { defineType, defineField } from 'sanity';

export const blogPostSchema = defineType({
  name: 'blogPost',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Titre', type: 'localeString', validation: (R) => R.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title.fr', maxLength: 100 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {
        list: [
          { title: 'Tendances déco', value: 'tendances' },
          { title: "Guides d'achat", value: 'guides' },
          { title: 'Conseils techniques', value: 'conseils' },
          { title: "Coulisses de l'usine", value: 'usine' },
          { title: 'Projets inspirants', value: 'projets' },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({ name: 'excerpt', title: 'Résumé', type: 'localeText' }),
    defineField({ name: 'body', title: 'Contenu', type: 'localeRichText', validation: (R) => R.required() }),
    defineField({
      name: 'cover',
      title: 'Image de couverture',
      type: 'image',
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'author',
      title: 'Auteur',
      type: 'string',
      initialValue: 'Groupe NDWI',
    }),
    defineField({ name: 'publishedAt', title: 'Date de publication', type: 'datetime', validation: (R) => R.required() }),
    defineField({ name: 'featured', title: 'À la une', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'title.fr', subtitle: 'category', media: 'cover' },
  },
  orderings: [
    { title: 'Plus récent', name: 'recent', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
});
