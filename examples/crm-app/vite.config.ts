import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Monorepo Aliases (Development)
      '@object-ui/core': path.resolve(__dirname, '../../packages/core/src'),
      '@object-ui/types': path.resolve(__dirname, '../../packages/types/src'),
      '@object-ui/react': path.resolve(__dirname, '../../packages/react/src'),
      '@object-ui/components': path.resolve(__dirname, '../../packages/components/src'),
      '@object-ui/layout': path.resolve(__dirname, '../../packages/layout/src'),
      '@object-ui/fields': path.resolve(__dirname, '../../packages/fields/src'),
      '@object-ui/plugin-dashboard': path.resolve(__dirname, '../../packages/plugin-dashboard/src'),
    },
  },
});
