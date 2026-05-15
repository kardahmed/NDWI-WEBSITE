import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/sanity/schemas';
import { apiVersion, dataset, projectId } from './src/sanity/env';

export default defineConfig({
  name: 'ndwi-cms',
  title: 'Groupe NDWI — CMS',
  projectId: projectId || 'placeholder',
  dataset,
  basePath: '/admin',
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
  schema: { types: schemaTypes },
});
