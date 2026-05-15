import { defineType, defineField } from 'sanity';

export const showroomSchema = defineType({
  name: 'showroom',
  title: 'Showroom',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nom (ville)', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 40 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'status',
      title: 'Statut',
      type: 'string',
      options: {
        list: [
          { title: 'Ouvert', value: 'open' },
          { title: 'Programme — Bientôt', value: 'soon' },
        ],
      },
      initialValue: 'open',
    }),
    defineField({ name: 'address', title: 'Adresse', type: 'localeText' }),
    defineField({ name: 'phone', title: 'Téléphone', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'mapsUrl', title: 'Lien Google Maps', type: 'url' }),
    defineField({ name: 'latitude', title: 'Latitude', type: 'number' }),
    defineField({ name: 'longitude', title: 'Longitude', type: 'number' }),
    defineField({
      name: 'hours',
      title: 'Horaires',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Jours', type: 'string' },
            { name: 'value', title: 'Horaires', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'heroImage',
      title: 'Image principale',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({ name: 'order', title: 'Ordre', type: 'number', initialValue: 100 }),
  ],
  preview: { select: { title: 'name', subtitle: 'status', media: 'heroImage' } },
});
