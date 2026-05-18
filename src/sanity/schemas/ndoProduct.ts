import { defineType, defineField } from 'sanity';

/**
 * Produits NDO — catalogue e-commerce de produits FINIS (importation Italie).
 * Contrairement aux portes NDWi qui sont configurables 3D, les produits NDO
 * sont vendus tels quels avec leurs couleurs/finitions fixes.
 *
 * Sources : ARAN Cucine, PAIL, ICA…
 */
export const ndoProductSchema = defineType({
  name: 'ndoProduct',
  title: 'Produits NDO (catalogue e-commerce)',
  type: 'document',
  groups: [
    { name: 'main', title: 'Principal' },
    { name: 'desc', title: 'Descriptions' },
    { name: 'specs', title: 'Caractéristiques' },
    { name: 'media', title: 'Visuels' },
    { name: 'commerce', title: 'Commerce' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nom du produit',
      type: 'string',
      group: 'main',
      description: 'Ex. Volare, Penelope, Mood Round',
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
      name: 'manufacturer',
      title: 'Fabricant italien',
      type: 'string',
      group: 'main',
      description: 'Marque originelle dont NDO importe les produits.',
      options: {
        list: [
          { title: 'ARAN Cucine', value: 'aran' },
          { title: 'PAIL', value: 'pail' },
          { title: 'ICA', value: 'ica' },
          { title: 'Autre partenaire italien', value: 'other' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie produit',
      type: 'string',
      group: 'main',
      description: 'Détermine où il apparaît dans la nav NDO et /ndo/[category].',
      options: {
        list: [
          { title: 'Cuisines', value: 'cuisines' },
          { title: 'Portes', value: 'portes' },
          { title: 'Dressing', value: 'dressing' },
          { title: 'Salle de bain', value: 'sdb' },
          { title: 'Mobilier salon', value: 'salons' },
          { title: 'Mobilier chambres', value: 'chambres' },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'collection',
      title: 'Collection / Gamme',
      type: 'string',
      group: 'main',
      description: 'Ex. Volare Easy, Penelope Glam, Mood Tonda',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Description courte (FR)',
      type: 'string',
      group: 'desc',
      description: 'Une phrase qui résume le produit (utilisée sur les cartes).',
      validation: (R) => R.required().max(180),
    }),
    defineField({
      name: 'shortDescriptionAr',
      title: 'Description courte (AR)',
      type: 'string',
      group: 'desc',
    }),
    defineField({
      name: 'description',
      title: 'Description longue (FR)',
      type: 'text',
      group: 'desc',
      rows: 6,
      description: 'Texte fiche produit. Style éditorial, premium.',
    }),
    defineField({
      name: 'descriptionAr',
      title: 'Description longue (AR)',
      type: 'text',
      group: 'desc',
      rows: 6,
    }),
    defineField({
      name: 'styles',
      title: 'Styles disponibles',
      type: 'array',
      group: 'specs',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Moderne', value: 'modern' },
          { title: 'Classique', value: 'classic' },
          { title: 'Contemporain', value: 'contemporary' },
          { title: 'Minimaliste', value: 'minimalist' },
          { title: 'Luxe', value: 'luxury' },
        ],
      },
    }),
    defineField({
      name: 'colors',
      title: 'Couleurs disponibles',
      type: 'array',
      group: 'specs',
      description:
        'Liste des coloris dans lesquels ce produit est commercialisé. Chaque entrée a un nom et une couleur hex pour pastille.',
      of: [
        {
          type: 'object',
          name: 'colorOption',
          title: 'Option de couleur',
          fields: [
            { name: 'name', title: 'Nom (FR)', type: 'string', validation: (R) => R.required() },
            { name: 'nameAr', title: 'Nom (AR)', type: 'string' },
            {
              name: 'hex',
              title: 'Pastille (hex)',
              type: 'string',
              validation: (R) => R.regex(/^#[0-9a-fA-F]{6}$/).error('Format #RRGGBB'),
            },
            {
              name: 'image',
              title: 'Photo produit dans ce coloris',
              type: 'image',
              description: "Photo haute résolution du produit dans ce coloris (optionnel).",
              options: { hotspot: true },
            },
          ],
          preview: { select: { title: 'name', subtitle: 'hex' } },
        },
      ],
    }),
    defineField({
      name: 'materials',
      title: 'Matériaux principaux',
      type: 'array',
      group: 'specs',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Bois massif', value: 'solid-wood' },
          { title: 'Placage bois', value: 'wood-veneer' },
          { title: 'Laqué', value: 'lacquer' },
          { title: 'Stratifié HPL', value: 'hpl' },
          { title: 'Verre', value: 'glass' },
          { title: 'Métal', value: 'metal' },
          { title: 'Quartz/marbre', value: 'stone' },
        ],
      },
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions disponibles',
      type: 'string',
      group: 'specs',
      description: 'Ex: "Largeur 90 à 360 cm, profondeur 60 cm". Champ libre.',
    }),
    defineField({
      name: 'specs',
      title: 'Spécifications techniques',
      type: 'array',
      group: 'specs',
      of: [
        {
          type: 'object',
          name: 'spec',
          fields: [
            { name: 'label', title: 'Critère', type: 'string', validation: (R) => R.required() },
            { name: 'value', title: 'Valeur', type: 'string', validation: (R) => R.required() },
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        },
      ],
      description: 'Liste libre de spécifications (résistance, certifications, garantie…).',
    }),
    defineField({
      name: 'heroImage',
      title: 'Image principale (lifestyle)',
      type: 'image',
      group: 'media',
      description: 'Photo principale fiche produit. Lifestyle ou packshot HD.',
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie',
      type: 'array',
      group: 'media',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Photos additionnelles (3-8 photos recommandées).',
    }),
    defineField({
      name: 'priceFrom',
      title: 'Prix "à partir de" (DZD, optionnel)',
      type: 'number',
      group: 'commerce',
      description:
        'Si renseigné, le site affichera "à partir de XX XXX DZD" sur la fiche. Sinon, seul un devis sur demande sera proposé.',
    }),
    defineField({
      name: 'leadTime',
      title: 'Délai de livraison',
      type: 'string',
      group: 'commerce',
      description: 'Ex: "4 à 6 semaines depuis l\'Italie", "Sur stock — disponible immédiatement".',
    }),
    defineField({
      name: 'inStock',
      title: 'En stock',
      type: 'boolean',
      group: 'commerce',
      initialValue: false,
      description: 'Cocher si le produit est dispo sur stock NDWI Oran. Sinon = sur commande.',
    }),
    defineField({
      name: 'showroomDisplay',
      title: 'Exposé en showroom',
      type: 'boolean',
      group: 'commerce',
      initialValue: false,
      description: 'Cocher si le client peut le voir physiquement.',
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
          { title: 'Made in Italy', value: 'italy' },
          { title: 'Édition limitée', value: 'edition-limitee' },
        ],
      },
    }),
    defineField({
      name: 'order',
      title: "Ordre d'affichage",
      type: 'number',
      group: 'main',
      initialValue: 100,
    }),
    defineField({
      name: 'published',
      title: 'Publié',
      type: 'boolean',
      group: 'main',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      manufacturer: 'manufacturer',
      category: 'category',
      media: 'heroImage',
    },
    prepare: ({ title, manufacturer, category, media }) => ({
      title,
      subtitle: `${manufacturer?.toUpperCase() ?? ''} · ${category ?? ''}`,
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
    {
      title: 'Fabricant',
      name: 'mfrAsc',
      by: [{ field: 'manufacturer', direction: 'asc' }, { field: 'name', direction: 'asc' }],
    },
  ],
});
