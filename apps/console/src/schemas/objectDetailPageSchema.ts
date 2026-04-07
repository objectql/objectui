/**
 * Object Detail Page Schema Factory
 *
 * Generates a PageSchema for the object detail page. The schema uses custom
 * widget types (registered in ComponentRegistry via registerObjectDetailWidgets)
 * that are fully self-contained — each widget resolves its data from React
 * context rather than requiring prop drilling.
 *
 * Usage:
 *   const schema = buildObjectDetailPageSchema('account', metadataItem);
 *   // Render via SchemaRenderer or as body nodes in MetadataDetailPage
 *
 * @module schemas/objectDetailPageSchema
 */

import type { PageSchema } from '@object-ui/types';

/**
 * Build a PageSchema for an object detail page.
 *
 * @param objectName - The API name of the object (e.g. 'account')
 * @param item       - The raw metadata item (optional, used for title/description)
 * @returns A fully-formed PageSchema ready for rendering
 */
export function buildObjectDetailPageSchema(
  objectName: string,
  item?: Record<string, unknown> | null,
): PageSchema {
  const label = (item?.label as string) || objectName;
  const description = (item?.description as string) || objectName;

  return {
    type: 'page',
    name: `object-detail-${objectName}`,
    title: label,
    description,
    icon: 'database',
    pageType: 'record_detail',
    object: objectName,
    body: [
      { type: 'object-properties', id: `${objectName}-properties`, objectName } as any,
      { type: 'object-relationships', id: `${objectName}-relationships`, objectName } as any,
      { type: 'object-keys', id: `${objectName}-keys`, objectName } as any,
      { type: 'object-data-experience', id: `${objectName}-data-experience`, objectName } as any,
      { type: 'object-data-preview', id: `${objectName}-data-preview`, objectName } as any,
      { type: 'object-field-designer', id: `${objectName}-field-designer`, objectName } as any,
    ],
  };
}
