/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';
import { cn, Card, CardContent } from '@object-ui/components';
import type { HighlightField, FieldMetadata } from '@object-ui/types';
import { getCellRenderer } from '@object-ui/fields';
import { useSafeFieldLabel } from '@object-ui/react';

export interface HeaderHighlightProps {
  fields: HighlightField[];
  data?: any;
  className?: string;
  /** Object name for i18n field label resolution */
  objectName?: string;
  /** Object schema for field metadata enrichment */
  objectSchema?: any;
}

export const HeaderHighlight: React.FC<HeaderHighlightProps> = ({
  fields,
  data,
  className,
  objectName,
  objectSchema,
}) => {
  const { fieldLabel } = useSafeFieldLabel();
  if (!fields.length || !data) return null;

  // Filter to only fields with values
  const visibleFields = fields.filter((f) => {
    const val = data?.[f.name];
    return val !== null && val !== undefined && val !== '';
  });

  if (visibleFields.length === 0) return null;

  return (
    <Card className={cn('bg-muted/30 border-dashed', className)}>
      <CardContent className="py-3 px-4">
        <div className={cn(
          'grid gap-4',
          visibleFields.length === 1 ? 'grid-cols-1' :
          visibleFields.length === 2 ? 'grid-cols-2' :
          visibleFields.length === 3 ? 'grid-cols-3' :
          'grid-cols-2 md:grid-cols-4'
        )}>
          {visibleFields.map((field) => {
            const value = data[field.name];
            // Enrich field with objectSchema metadata for type-aware rendering
            const objectDefField = objectSchema?.fields?.[field.name];
            const resolvedType = field.type || objectDefField?.type;
            const enrichedField: Record<string, any> = { ...field };
            if (objectDefField) {
              if (!field.type && objectDefField.type) enrichedField.type = objectDefField.type;
              if (objectDefField.options && !enrichedField.options) enrichedField.options = objectDefField.options;
              if (objectDefField.currency && !enrichedField.currency) enrichedField.currency = objectDefField.currency;
              if (objectDefField.precision !== undefined && enrichedField.precision === undefined) enrichedField.precision = objectDefField.precision;
              if (objectDefField.format && !enrichedField.format) enrichedField.format = objectDefField.format;
            }

            // Use type-aware cell renderer when field type is available
            let displayValue: React.ReactNode = String(value);
            if (resolvedType) {
              const CellRenderer = getCellRenderer(resolvedType);
              if (CellRenderer) {
                // Guard: plain objects (e.g. MongoDB Decimal128 {$numberDecimal}, expanded refs)
                // can crash renderers that pass non-primitive values straight to JSX children.
                // Types like lookup/user/owner/file/image handle objects natively.
                const isPlainObject = value !== null && typeof value === 'object'
                  && !Array.isArray(value) && !(value instanceof Date);
                const OBJECT_SAFE_TYPES = ['lookup', 'master_detail', 'user', 'owner', 'file', 'image', 'object'];

                if (isPlainObject && !OBJECT_SAFE_TYPES.includes(resolvedType)) {
                  displayValue = String(value.name || value.label || value._id || JSON.stringify(value));
                } else {
                  displayValue = <CellRenderer value={value} field={enrichedField as unknown as FieldMetadata} />;
                }
              }
            }

            return (
              <div key={field.name} className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {field.icon && <span className="mr-1">{field.icon}</span>}
                  {fieldLabel(objectName || '', field.name, field.label)}
                </span>
                <span className="text-sm font-semibold truncate">
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
