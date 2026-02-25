/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@object-ui/components';
import { SchemaRenderer } from '@object-ui/react';
import type { DataSource } from '@object-ui/types';

export interface RelatedListProps {
  title: string;
  type: 'list' | 'grid' | 'table';
  api?: string;
  data?: any[];
  schema?: any;
  columns?: any[];
  className?: string;
  dataSource?: DataSource;
}

export const RelatedList: React.FC<RelatedListProps> = ({
  title,
  type,
  api,
  data = [],
  schema,
  columns,
  className,
  dataSource,
}) => {
  const [relatedData, setRelatedData] = React.useState(data);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (api && !data.length) {
      setLoading(true);
      if (dataSource && typeof dataSource.find === 'function') {
        dataSource.find(api).then((result) => {
          const items = Array.isArray(result)
            ? result
            : Array.isArray((result as any)?.data)
              ? (result as any).data
              : [];
          setRelatedData(items);
          setLoading(false);
        }).catch((err) => {
          console.error('Failed to fetch related data:', err);
          setLoading(false);
        });
      } else {
        fetch(api)
          .then(res => res.json())
          .then(result => {
            const items = Array.isArray(result) ? result : (result?.data || []);
            setRelatedData(items);
          })
          .catch(err => {
            console.error('Failed to fetch related data:', err);
          })
          .finally(() => setLoading(false));
      }
    }
  }, [api, data, dataSource]);

  const viewSchema = React.useMemo(() => {
    if (schema) return schema;

    // Auto-generate schema based on type
    switch (type) {
      case 'grid':
      case 'table':
        return {
          type: 'data-table',
          data: relatedData,
          columns: columns || [],
          pagination: relatedData.length > 10,
          pageSize: 10,
        };
      case 'list':
        return {
          type: 'data-list',
          data: relatedData,
        };
      default:
        return { type: 'div', children: 'No view configured' };
    }
  }, [type, relatedData, columns, schema]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {relatedData.length} record{relatedData.length !== 1 ? 's' : ''}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            Loading...
          </div>
        ) : relatedData.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
            No related records found
          </div>
        ) : (
          <SchemaRenderer schema={viewSchema} />
        )}
      </CardContent>
    </Card>
  );
};
