import '@object-ui/components';
import { SchemaRendererProvider, SchemaRenderer } from '@object-ui/react';
import schema from './schema.json';

/**
 * Page-level data source.
 * The `hidden` expression in schema.json references `data.user.role`
 * to control visibility of the "Admin Settings" button.
 * In a real app this would come from your auth/state layer.
 */
const pageData = {
  user: {
    name: 'Avery Morgan',
    role: 'admin',
  },
};

export function App() {
  return (
    <SchemaRendererProvider dataSource={pageData}>
      <div className="mx-auto max-w-6xl p-6 md:p-10">
        <SchemaRenderer schema={schema} />
      </div>
    </SchemaRendererProvider>
  );
}
