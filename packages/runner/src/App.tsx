// Ensure this file is treated as a module
export {}; 

import { SchemaRenderer } from '@object-ui/react';
import '@object-ui/components';
import { PageSchema } from '@object-ui/types';
import { useState, useEffect } from 'react';

export default function App() {
  const [schema, setSchema] = useState<PageSchema | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadApp = async () => {
      try {
        // 1. Try to load 'app.json' (App Mode)
        const appFiles = import.meta.glob('./app-data/app.json');
        
        if (appFiles['./app-data/app.json']) {
          const mod: any = await appFiles['./app-data/app.json']();
          setSchema(mod.default || mod);
          return;
        }

        // 2. Fallback: Try to load any JSON in root (Single Page Mode)
        const jsonFiles = import.meta.glob('./app-data/*.json');
        
        const jsonKeys = Object.keys(jsonFiles).filter(key => !key.endsWith('package.json'));
        const firstFile = jsonKeys[0];
        
        if (firstFile) {
           const mod: any = await jsonFiles[firstFile]();
           setSchema(mod.default || mod);
           return;
        }

        // 3. Fallback: Try Pages folder
        const pageFiles = import.meta.glob('./app-data/pages/*.json');
        const firstPage = Object.keys(pageFiles)[0];
         if (firstPage) {
           const mod: any = await pageFiles[firstPage]();
           setSchema(mod.default || mod);
           return;
        }

        setSchema({
           type: 'page',
           title: 'Empty App',
           body: [{ type: 'div', className: "p-10 text-center text-muted-foreground", body: 'No JSON files found in src/app-data. Please mount an app directory.' }]
        } as any);

      } catch (err) {
        console.error(err);
        setError("Failed to load application schema.");
      }
    };

    loadApp();
  }, []);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-red-50 text-red-600">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Error Loading App</h1>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!schema) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        Loading schema...
      </div>
    );
  }

  return (
    <div className="object-ui-app">
      <SchemaRenderer schema={schema} />
    </div>
  );
}
