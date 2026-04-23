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
  '@object-ui/collaboration': path.resolve(__dirname, '../../packages/collaboration/src'),
  '@object-ui/components': path.resolve(__dirname, '../../packages/components/src'),
  '@object-ui/core': path.resolve(__dirname, '../../packages/core/src'),
  '@object-ui/data-objectstack': path.resolve(__dirname, '../../packages/data-objectstack/src'),
  '@object-ui/fields': path.resolve(__dirname, '../../packages/fields/src'),
  '@object-ui/i18n': path.resolve(__dirname, '../../packages/i18n/src'),
  '@object-ui/layout': path.resolve(__dirname, '../../packages/layout/src'),
  '@object-ui/permissions': path.resolve(__dirname, '../../packages/permissions/src'),
  '@object-ui/plugin-calendar': path.resolve(__dirname, '../../packages/plugin-calendar/src'),
  '@object-ui/plugin-charts': path.resolve(__dirname, '../../packages/plugin-charts/src'),
  '@object-ui/plugin-chatbot': path.resolve(__dirname, '../../packages/plugin-chatbot/src'),
  '@object-ui/plugin-dashboard': path.resolve(__dirname, '../../packages/plugin-dashboard/src'),
  '@object-ui/plugin-designer': path.resolve(__dirname, '../../packages/plugin-designer/src'),
  '@object-ui/plugin-detail': path.resolve(__dirname, '../../packages/plugin-detail/src'),
  '@object-ui/plugin-form': path.resolve(__dirname, '../../packages/plugin-form/src'),
  '@object-ui/plugin-grid': path.resolve(__dirname, '../../packages/plugin-grid/src'),
  '@object-ui/plugin-kanban': path.resolve(__dirname, '../../packages/plugin-kanban/src'),
  '@object-ui/plugin-list': path.resolve(__dirname, '../../packages/plugin-list/src'),
  '@object-ui/plugin-report': path.resolve(__dirname, '../../packages/plugin-report/src'),
  '@object-ui/plugin-view': path.resolve(__dirname, '../../packages/plugin-view/src'),
  '@object-ui/react': path.resolve(__dirname, '../../packages/react/src'),
  '@object-ui/types': path.resolve(__dirname, '../../packages/types/src'),
};

export default defineConfig({
  plugins: [react()],
  resolve: { alias: workspaceAliases },
});
