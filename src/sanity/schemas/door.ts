import { defineType, defineField } from 'sanity';

export const doorSchema = defineType({
  name: 'door',
  title: 'Porte',
  type: 'document',
  groups: [
    { name: 'main', title: 'Principal' },
    { name: 'desc', title: 'Descriptions' },
    { name: 'tech', title: 'Spécifications' },
    { name: 'media', title: 'Visuels' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      group: 'main',
      description: 'Ex. Tolga, Phoenix, Stopper Forza 4',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'main',
      options: { source: 'name', maxLength: 60 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'serie',
      title: 'Série',
      type: 'string',
      group: 'main',
      description: 'Famille du produit (ex. Tolga, Antea Hotel, Tecnica)',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'brand',
      title: 'Marque',
      type: 'string',
      group: 'main',
      description:
        'NDWi = production locale Algérie · NDO = importation. Détermine le badge affiché sur la carte et permet aux clients de filtrer.',
      options: {
        list: [
          { title: 'NDWi — Production Algérie', value: 'ndwi' },
          { title: 'NDO — Importation', value: 'ndo' },
        ],
        layout: 'radio',
      },
      initialValue: 'ndwi',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      group: 'main',
      options: {
        list: [
          { title: 'Porte intérieure', value: 'interieur' },
          { title: 'Porte d’entrée', value: 'entree' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
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
      title: 'Description complète',
      type: 'localeText',
      group: 'desc',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'finishes',
      title: 'Finitions disponibles (legacy, liste libre)',
      type: 'array',
      group: 'tech',
      of: [{ type: 'string' }],
      description:
        'Liste textuelle des finitions — utilisée pour rétro-compat avec le filtrage catalogue. Pour le configurateur 3D, préférer le champ "Finitions configurateur" ci-dessous qui réfère des documents Finition complets (PBR + textures).',
      options: {
        list: [
          { title: 'Laqué mat', value: 'laque-mat' },
          { title: 'Laqué brillant', value: 'laque-brillant' },
          { title: 'Placage bois', value: 'placage-bois' },
          { title: 'Placage noyer', value: 'placage-noyer' },
          { title: 'Placage chêne', value: 'placage-chene' },
          { title: 'Stratifié', value: 'stratifie' },
          { title: 'Vernis naturel', value: 'vernis-naturel' },
        ],
      },
      validation: (R) => R.required().min(1),
    }),
    // ─── Compatibilités configurateur 3D (NDWi uniquement) ──────────────────
    defineField({
      name: 'door3DModel',
      title: 'Modèle 3D associé (GLB)',
      type: 'reference',
      group: 'tech',
      to: [{ type: 'door3DModel' }],
      description:
        "Quel fichier GLB représente cette porte dans le configurateur 3D. Laisser vide si la porte n'est pas configurable.",
    }),
    defineField({
      name: 'compatibleFinitions',
      title: 'Finitions configurateur compatibles',
      type: 'array',
      group: 'tech',
      of: [{ type: 'reference', to: [{ type: 'finition' }] }],
      description:
        'Sélection des couleurs / textures que le client pourra appliquer à cette porte dans le configurateur 3D. Doit pointer vers des documents Finition (avec PBR et textures).',
    }),
    defineField({
      name: 'compatibleHandles',
      title: 'Poignées compatibles',
      type: 'array',
      group: 'tech',
      of: [{ type: 'reference', to: [{ type: 'handle3D' }] }],
      description:
        'Poignées proposées dans le configurateur pour cette porte. Vide = toutes les poignées publiées sont autorisées (fallback).',
    }),
    defineField({
      name: 'compatibleAccessories',
      title: 'Accessoires compatibles',
      type: 'array',
      group: 'tech',
      of: [{ type: 'reference', to: [{ type: 'accessory' }] }],
      description:
        'Vitrages, serrures, paumelles, encadrements proposés pour cette porte. Vide = aucune option d\'accessoire dans le configurateur.',
    }),
    defineField({
      name: 'thicknesses',
      title: 'Épaisseurs (mm)',
      type: 'array',
      group: 'tech',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '44 mm', value: '44mm' },
          { title: '50 mm', value: '50mm' },
          { title: '55 mm', value: '55mm' },
          { title: '60 mm', value: '60mm' },
          { title: '70 mm', value: '70mm' },
        ],
      },
      validation: (R) => R.required().min(1),
    }),
    defineField({
      name: 'features',
      title: 'Caractéristiques',
      type: 'array',
      group: 'tech',
      of: [{ type: 'localeString' }],
      description: 'Liste de points forts (ex. Technologie 4D, Charnières invisibles)',
    }),
    defineField({
      name: 'fireRating',
      title: 'Résistance feu',
      type: 'string',
      group: 'tech',
      options: {
        list: [
          { title: '—', value: '' },
          { title: 'EI30', value: 'EI30' },
          { title: 'EI60', value: 'EI60' },
        ],
      },
    }),
    defineField({
      name: 'acousticDb',
      title: 'Acoustique (dB)',
      type: 'number',
      group: 'tech',
    }),
    defineField({
      name: 'securityClass',
      title: 'Classe de sécurité',
      type: 'string',
      group: 'tech',
      options: {
        list: [
          { title: '—', value: '' },
          { title: 'RC2', value: 'RC2' },
          { title: 'RC3', value: 'RC3' },
          { title: 'RC4', value: 'RC4' },
        ],
      },
    }),
    defineField({
      name: 'heroImage',
      title: 'Image principale (catalogue)',
      type: 'image',
      group: 'media',
      description: "Photo lifestyle pour la fiche produit et le catalogue.",
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'configuratorImage',
      title: 'Image configurateur (fond transparent)',
      type: 'image',
      group: 'media',
      description:
        "Photo de face de la porte fermée, fond blanc/transparent isolé. Sert dans le configurateur 2D — la finition sera teintée automatiquement par CSS. Format recommandé : PNG transparent, 1200×1600 px minimum, finition neutre claire.",
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie',
      type: 'array',
      group: 'media',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'badges',
      title: 'Badges',
      type: 'array',
      group: 'main',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Nouveau', value: 'nouveau' },
          { title: 'Best-seller', value: 'best-seller' },
          { title: 'Sur-mesure', value: 'sur-mesure' },
        ],
      },
    }),
    defineField({
      name: 'order',
      title: 'Ordre d\'affichage',
      type: 'number',
      group: 'main',
      description: 'Plus petit = en premier dans le catalogue',
      initialValue: 100,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'serie', media: 'heroImage', category: 'category' },
    prepare: ({ title, subtitle, media, category }) => ({
      title,
      subtitle: `${subtitle ?? ''}${category ? ' · ' + category : ''}`,
      media,
    }),
  },
  orderings: [
    { title: 'Ordre manuel', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Nom A→Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
  ],
});
