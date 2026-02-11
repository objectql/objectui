/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Badge } from '@object-ui/components';
import type { 
  WorkflowDesignerSchema, WorkflowSchema, WorkflowNode, WorkflowEdge, 
  WorkflowNodeType, WorkflowStatus 
} from '@object-ui/types';
import { 
  Plus, Trash2, Save, Play, Pause, GitBranch, CheckCircle, 
  Circle, ArrowRight, Settings, Clock, Bell, Code, Users 
} from 'lucide-react';

export interface WorkflowDesignerProps {
  schema: WorkflowDesignerSchema;
}

const NODE_TYPE_ICONS: Record<WorkflowNodeType, React.ReactNode> = {
  start: <Play className="h-4 w-4 text-green-500" />,
  end: <CheckCircle className="h-4 w-4 text-red-500" />,
  task: <Circle className="h-4 w-4 text-blue-500" />,
  approval: <Users className="h-4 w-4 text-purple-500" />,
  condition: <GitBranch className="h-4 w-4 text-orange-500" />,
  parallel: <ArrowRight className="h-4 w-4 text-teal-500" />,
  delay: <Clock className="h-4 w-4 text-gray-500" />,
  notification: <Bell className="h-4 w-4 text-yellow-500" />,
  script: <Code className="h-4 w-4 text-indigo-500" />,
};

const NODE_TYPE_COLORS: Record<WorkflowNodeType, string> = {
  start: 'border-green-300 bg-green-50',
  end: 'border-red-300 bg-red-50',
  task: 'border-blue-300 bg-blue-50',
  approval: 'border-purple-300 bg-purple-50',
  condition: 'border-orange-300 bg-orange-50',
  parallel: 'border-teal-300 bg-teal-50',
  delay: 'border-gray-300 bg-gray-50',
  notification: 'border-yellow-300 bg-yellow-50',
  script: 'border-indigo-300 bg-indigo-50',
};

const STATUS_BADGES: Record<WorkflowStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
  draft: { variant: 'secondary', label: 'Draft' },
  active: { variant: 'default', label: 'Active' },
  paused: { variant: 'outline', label: 'Paused' },
  completed: { variant: 'default', label: 'Completed' },
  cancelled: { variant: 'destructive', label: 'Cancelled' },
};

/**
 * WorkflowDesigner - Visual workflow builder
 * Provides a visual interface for creating and editing workflow definitions.
 */
export const WorkflowDesigner: React.FC<WorkflowDesignerProps> = ({ schema }) => {
  const { 
    workflow: initialWorkflow, 
    readOnly = false, 
    showToolbar = true,
  } = schema;

  const [workflow, setWorkflow] = useState<WorkflowSchema>(initialWorkflow || {
    type: 'workflow',
    title: 'New Workflow',
    status: 'draft',
    nodes: [
      { id: 'start-1', type: 'start', label: 'Start', position: { x: 100, y: 100 } },
      { id: 'end-1', type: 'end', label: 'End', position: { x: 100, y: 400 } },
    ],
    edges: [],
    variables: [],
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const selectedNode = useMemo(() => 
    workflow.nodes.find(n => n.id === selectedNodeId), 
    [workflow.nodes, selectedNodeId]
  );

  // Node management
  const addNode = useCallback((type: WorkflowNodeType) => {
    if (readOnly) return;
    const id = `${type}-${Date.now()}`;
    const newNode: WorkflowNode = {
      id,
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      position: { x: 200, y: (workflow.nodes.length + 1) * 80 },
    };
    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
    }));
    setSelectedNodeId(id);
  }, [readOnly, workflow.nodes.length]);

  const updateNode = useCallback((nodeId: string, updates: Partial<WorkflowNode>) => {
    if (readOnly) return;
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => n.id === nodeId ? { ...n, ...updates } : n),
    }));
  }, [readOnly]);

  const removeNode = useCallback((nodeId: string) => {
    if (readOnly) return;
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== nodeId),
      edges: prev.edges.filter(e => e.source !== nodeId && e.target !== nodeId),
    }));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  }, [readOnly, selectedNodeId]);

  // Edge management
  const addEdge = useCallback((source: string, target: string) => {
    if (readOnly) return;
    const id = `edge-${Date.now()}`;
    const newEdge: WorkflowEdge = { id, source, target };
    setWorkflow(prev => ({
      ...prev,
      edges: [...prev.edges, newEdge],
    }));
  }, [readOnly]);

  const removeEdge = useCallback((edgeId: string) => {
    if (readOnly) return;
    setWorkflow(prev => ({
      ...prev,
      edges: prev.edges.filter(e => e.id !== edgeId),
    }));
    if (selectedEdgeId === edgeId) setSelectedEdgeId(null);
  }, [readOnly, selectedEdgeId]);

  const handleSave = () => {
    console.log('Saving workflow:', workflow);
    if (schema.onSave) {
      // Trigger save handler
    }
  };

  const handlePublish = () => {
    setWorkflow(prev => ({ ...prev, status: 'active' }));
    console.log('Publishing workflow');
    if (schema.onPublish) {
      // Trigger publish handler  
    }
  };

  const statusInfo = STATUS_BADGES[workflow.status || 'draft'];

  // Available node types for adding
  const nodeTypes: WorkflowNodeType[] = ['task', 'approval', 'condition', 'parallel', 'delay', 'notification', 'script'];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex items-center justify-between gap-2 p-4 bg-card rounded-lg border">
          <div className="flex items-center gap-3">
            <div>
              <Input
                value={workflow.title || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWorkflow(prev => ({ ...prev, title: e.target.value }))}
                className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0"
                readOnly={readOnly}
                placeholder="Workflow Title"
              />
            </div>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
          {!readOnly && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button size="sm" onClick={handlePublish} disabled={workflow.status === 'active'}>
                <Play className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Node Palette */}
        {!readOnly && (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm">Add Node</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {nodeTypes.map(type => (
                <button
                  key={type}
                  onClick={() => addNode(type)}
                  className="w-full flex items-center gap-2 p-2 rounded-md border hover:bg-muted/50 transition-colors text-sm"
                >
                  {NODE_TYPE_ICONS[type]}
                  <span className="capitalize">{type}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Canvas - Node List View */}
        <Card className={readOnly ? 'lg:col-span-3' : 'lg:col-span-2'}>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Workflow Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {workflow.nodes.map((node) => (
                <div
                  key={node.id}
                  onClick={() => { setSelectedNodeId(node.id); setSelectedEdgeId(null); }}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    NODE_TYPE_COLORS[node.type]
                  } ${selectedNodeId === node.id ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'}`}
                >
                  <div className="flex items-center gap-2">
                    {NODE_TYPE_ICONS[node.type]}
                    <span className="font-medium text-sm">{node.label}</span>
                    <span className="text-xs text-muted-foreground capitalize">({node.type})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Connection indicators */}
                    {workflow.edges.filter((e: WorkflowEdge) => e.source === node.id).length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {workflow.edges.filter((e: WorkflowEdge) => e.source === node.id).length} out
                      </Badge>
                    )}
                    {!readOnly && node.type !== 'start' && node.type !== 'end' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); removeNode(node.id); }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {/* Edges */}
              {workflow.edges.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <Label className="text-xs text-muted-foreground mb-2 block">Connections</Label>
                  {workflow.edges.map((edge: WorkflowEdge) => {
                    const sourceNode = workflow.nodes.find((n: WorkflowNode) => n.id === edge.source);
                    const targetNode = workflow.nodes.find((n: WorkflowNode) => n.id === edge.target);
                    return (
                      <div key={edge.id} className="flex items-center gap-2 p-2 text-sm">
                        <span>{sourceNode?.label || edge.source}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span>{targetNode?.label || edge.target}</span>
                        {edge.label && <Badge variant="outline" className="text-xs">{edge.label}</Badge>}
                        {!readOnly && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 w-5 p-0 ml-auto text-red-500"
                            onClick={() => removeEdge(edge.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Quick Connect */}
              {!readOnly && workflow.nodes.length >= 2 && (
                <div className="mt-4 pt-4 border-t">
                  <Label className="text-xs text-muted-foreground mb-2 block">Quick Connect</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      id="edge-source"
                      className="border rounded-md p-1.5 text-sm bg-background"
                    >
                      <option value="">From...</option>
                      {workflow.nodes.filter((n: WorkflowNode) => n.type !== 'end').map((n: WorkflowNode) => (
                        <option key={n.id} value={n.id}>{n.label}</option>
                      ))}
                    </select>
                    <select
                      id="edge-target"
                      className="border rounded-md p-1.5 text-sm bg-background"
                    >
                      <option value="">To...</option>
                      {workflow.nodes.filter((n: WorkflowNode) => n.type !== 'start').map((n: WorkflowNode) => (
                        <option key={n.id} value={n.id}>{n.label}</option>
                      ))}
                    </select>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={() => {
                      const source = (document.getElementById('edge-source') as HTMLSelectElement)?.value;
                      const target = (document.getElementById('edge-target') as HTMLSelectElement)?.value;
                      if (source && target && source !== target) {
                        addEdge(source, target);
                      }
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Connect
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Properties Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedNode ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Label</Label>
                  <Input
                    value={selectedNode.label}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNode(selectedNode.id, { label: e.target.value })}
                    className="h-8 text-sm"
                    readOnly={readOnly}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Type</Label>
                  <div className="flex items-center gap-2 p-2 rounded-md bg-muted text-sm">
                    {NODE_TYPE_ICONS[selectedNode.type]}
                    <span className="capitalize">{selectedNode.type}</span>
                  </div>
                </div>
                {selectedNode.description !== undefined && (
                  <div className="space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Input
                      value={selectedNode.description || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNode(selectedNode.id, { description: e.target.value })}
                      className="h-8 text-sm"
                      readOnly={readOnly}
                    />
                  </div>
                )}
                {(selectedNode.type === 'approval' || selectedNode.type === 'task') && (
                  <>
                    <div className="space-y-1">
                      <Label className="text-xs">Assignee</Label>
                      <Input
                        value={selectedNode.assignee || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNode(selectedNode.id, { assignee: e.target.value })}
                        className="h-8 text-sm"
                        placeholder="User, role, or expression"
                        readOnly={readOnly}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Assignee Type</Label>
                      <select
                        className="w-full border rounded-md h-8 text-sm px-2 bg-background"
                        value={selectedNode.assigneeType || 'user'}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateNode(selectedNode.id, { assigneeType: e.target.value as any })}
                        disabled={readOnly}
                      >
                        <option value="user">User</option>
                        <option value="role">Role</option>
                        <option value="group">Group</option>
                        <option value="expression">Expression</option>
                      </select>
                    </div>
                  </>
                )}
                {selectedNode.type === 'delay' && (
                  <div className="space-y-1">
                    <Label className="text-xs">Timeout (minutes)</Label>
                    <Input
                      type="number"
                      value={selectedNode.timeout || 60}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNode(selectedNode.id, { timeout: Number(e.target.value) })}
                      className="h-8 text-sm"
                      readOnly={readOnly}
                    />
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-2">
                  ID: {selectedNode.id}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-8">
                Select a node to edit its properties
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
