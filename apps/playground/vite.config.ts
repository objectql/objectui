import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/studio/' : '/',
  resolve: {
    alias: {
      '@object-ui/components': path.resolve(__dirname, '../../packages/components/src'),
      '@object-ui/core': path.resolve(__dirname, '../../packages/core/src'),
      '@object-ui/react': path.resolve(__dirname, '../../packages/react/src'),
      '@': path.resolve(__dirname, '../../packages/components/src'),
    }
  },
  server: {
    port: 5174
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});
