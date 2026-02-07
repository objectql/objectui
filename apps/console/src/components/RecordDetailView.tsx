/**
 * RecordDetailView Component
 *
 * Renders a detail view for a single record, resolved by URL params.
 * Uses the DetailView plugin component with auto-generated sections from
 * the object field definitions.
 */

import { useParams } from 'react-router-dom';
import { DetailView } from '@object-ui/plugin-detail';
import { Empty, EmptyTitle } from '@object-ui/components';
import { MetadataToggle, MetadataPanel, useMetadataInspector } from './MetadataInspector';

interface RecordDetailViewProps {
  dataSource: any;
  objects: any[];
  onEdit: (record: any) => void;
}

export function RecordDetailView({ dataSource, objects, onEdit }: RecordDetailViewProps) {
  const { objectName, recordId } = useParams();
  const { showDebug, toggleDebug } = useMetadataInspector();
  const objectDef = objects.find((o: any) => o.name === objectName);

  if (!objectDef) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Empty>
          <EmptyTitle>Object Not Found</EmptyTitle>
          <p>Object "{objectName}" definition missing.</p>
        </Empty>
      </div>
    );
  }

  const detailSchema = {
    type: 'detail-view',
    objectName: objectDef.name,
    resourceId: recordId,
    showBack: true,
    onBack: 'history',
    showEdit: true,
    title: objectDef.label,
    sections: [
      {
        title: 'Details',
        fields: Object.keys(objectDef.fields || {}).map(key => ({
          name: key,
          label: objectDef.fields[key].label || key,
          type: objectDef.fields[key].type || 'text',
        })),
        columns: 2,
      },
    ],
  };

  return (
    <div className="h-full bg-background overflow-hidden flex flex-col relative">
      <div className="absolute top-4 right-4 z-50">
        <MetadataToggle open={showDebug} onToggle={toggleDebug} />
      </div>

      <div className="flex-1 overflow-hidden flex flex-row">
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          <DetailView
            schema={detailSchema}
            dataSource={dataSource}
            onEdit={() => onEdit({ _id: recordId, id: recordId })}
          />
        </div>
        <MetadataPanel
          open={showDebug}
          sections={[{ title: 'View Schema', data: detailSchema }]}
        />
      </div>
    </div>
  );
}
