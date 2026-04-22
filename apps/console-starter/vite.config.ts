import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Workspace src/ aliases ensure plugin side-effect imports
// (ComponentRegistry.register) resolve to the same singleton instance, mirroring
// what apps/console does. Customers shipping a real app can drop these aliases
// once the @object-ui/* packages are published to a registry.
const workspaceAliases: Record<string, string> = {
  '@object-ui/app-shell': path.resolve(__dirname, '../../packages/app-shell/src'),
  '@object-ui/auth': path.resolve(__dirname, '../../packages/auth/src'),
  '@object-ui/components': path.resolve(__dirname, '../../packages/components/src'),
  '@object-ui/core': path.resolve(__dirname, '../../packages/core/src'),
  '@object-ui/fields': path.resolve(__dirname, '../../packages/fields/src'),
  '@object-ui/i18n': path.resolve(__dirname, '../../packages/i18n/src'),
  '@object-ui/plugin-form': path.resolve(__dirname, '../../packages/plugin-form/src'),
  '@object-ui/plugin-grid': path.resolve(__dirname, '../../packages/plugin-grid/src'),
  '@object-ui/plugin-view': path.resolve(__dirname, '../../packages/plugin-view/src'),
  '@object-ui/react': path.resolve(__dirname, '../../packages/react/src'),
  '@object-ui/types': path.resolve(__dirname, '../../packages/types/src'),
};

export default defineConfig({
  plugins: [react()],
  resolve: { alias: workspaceAliases },
});
