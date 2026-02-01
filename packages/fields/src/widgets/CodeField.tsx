import React from 'react';
import { Textarea, cn } from '@object-ui/components';
import { FieldWidgetProps } from './types';

/**
 * Code field widget - provides a code editor with syntax highlighting
 * Uses a simple textarea with monospace font
 * For advanced code editing, use the @object-ui/plugin-editor component
 */
export function CodeField({ value, onChange, field, readonly, ...props }: FieldWidgetProps<string>) {
  const config = field || (props as any).schema;
  // Get code-specific configuration from field metadata
  const language = (config as any)?.language ?? 'javascript';

  if (readonly) {
    return (
      <pre className={cn("text-sm bg-muted p-2 rounded overflow-x-auto border", props.className)}>
        <code>{value || '-'}</code>
      </pre>
    );
  }

  return (
    <Textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={config?.placeholder || `// Write ${language} code here...`}
      disabled={readonly || props.disabled}
      className={cn("font-mono text-sm", props.className)}
      rows={12}
      spellCheck={false}
    />
  );
}
