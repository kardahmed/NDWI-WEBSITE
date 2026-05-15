import { defineType } from 'sanity';

export const localeString = defineType({
  name: 'localeString',
  title: 'Texte localisé',
  type: 'object',
  fields: [
    { name: 'fr', title: 'Français', type: 'string', validation: (R) => R.required() },
    { name: 'ar', title: 'العربية', type: 'string' },
  ],
  options: { columns: 2 },
});

export const localeText = defineType({
  name: 'localeText',
  title: 'Paragraphe localisé',
  type: 'object',
  fields: [
    { name: 'fr', title: 'Français', type: 'text', rows: 4, validation: (R) => R.required() },
    { name: 'ar', title: 'العربية', type: 'text', rows: 4 },
  ],
});

export const localeRichText = defineType({
  name: 'localeRichText',
  title: 'Contenu riche localisé',
  type: 'object',
  fields: [
    {
      name: 'fr',
      title: 'Français',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    },
    {
      name: 'ar',
      title: 'العربية',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    },
  ],
});
