import { defineConfig, defineDocs, defineCollections } from 'fumadocs-mdx/config';
import { z } from 'zod';

export const { docs, meta } = defineDocs({
  dir: '../../docs',
  docs: {
    files: [
      '**/*.{md,mdx}', 
      '!**/node_modules/**', 
      '!**/.vitepress/**',
      '!**/dist/**',
      '!**/.*/**',
      '!**/COMPONENT_MAPPING_GUIDE.md',
      '!**/COMPONENT_NAMING_CONVENTIONS.md',
      '!**/DEVELOPMENT_ROADMAP_2026.md',
      '!**/EVALUATION_INDEX.md',
      '!**/OBJECTSTACK_COMPONENT_EVALUATION.md',
      '!**/OBJECTSTACK_COMPONENT_EVALUATION_EN.md',
    ],
  },
});

export const blog = defineCollections({
  dir: 'content/blog',
  files: ['**/*.{md,mdx}', '!**/node_modules/**'],
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string().or(z.date()).transform((d) => new Date(d).toISOString()),
    author: z.string().optional(),
  }),
  type: 'doc',
});

export default defineConfig();
