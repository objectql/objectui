import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WorkflowDesigner } from '../WorkflowDesigner';
import type { WorkflowDesignerSchema } from '@object-ui/types';

describe('WorkflowDesigner', () => {
  it('should render with default workflow', () => {
    const schema: WorkflowDesignerSchema = {
      type: 'workflow-designer',
    };

    render(<WorkflowDesigner schema={schema} />);
    
    expect(screen.getByDisplayValue('New Workflow')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
    // Node labels appear in both the flow list and select dropdowns, so use getAllByText
    expect(screen.getAllByText('Start').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('End').length).toBeGreaterThanOrEqual(1);
  });

  it('should render provided workflow', () => {
    const schema: WorkflowDesignerSchema = {
      type: 'workflow-designer',
      workflow: {
        type: 'workflow',
        title: 'Leave Approval',
        status: 'active',
        nodes: [
          { id: 'start-1', type: 'start', label: 'Start' },
          { id: 'approval-1', type: 'approval', label: 'Manager Approval' },
          { id: 'end-1', type: 'end', label: 'End' },
        ],
        edges: [
          { id: 'e1', source: 'start-1', target: 'approval-1' },
          { id: 'e2', source: 'approval-1', target: 'end-1' },
        ],
      },
    };

    render(<WorkflowDesigner schema={schema} />);
    
    expect(screen.getByDisplayValue('Leave Approval')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getAllByText('Manager Approval').length).toBeGreaterThanOrEqual(1);
  });

  it('should add a node', () => {
    const schema: WorkflowDesignerSchema = {
      type: 'workflow-designer',
    };

    render(<WorkflowDesigner schema={schema} />);
    
    // Click task button to add a task node
    const taskButton = screen.getByText('task');
    fireEvent.click(taskButton);
    
    expect(screen.getAllByText('New Task').length).toBeGreaterThanOrEqual(1);
  });

  it('should render in read-only mode', () => {
    const schema: WorkflowDesignerSchema = {
      type: 'workflow-designer',
      readOnly: true,
      workflow: {
        type: 'workflow',
        title: 'Test',
        status: 'active',
        nodes: [
          { id: 'start-1', type: 'start', label: 'Start' },
          { id: 'end-1', type: 'end', label: 'End' },
        ],
        edges: [],
      },
    };

    render(<WorkflowDesigner schema={schema} />);
    
    // Should not show Add Node palette
    expect(screen.queryByText('Add Node')).not.toBeInTheDocument();
  });

  it('should select node and show properties', () => {
    const schema: WorkflowDesignerSchema = {
      type: 'workflow-designer',
      workflow: {
        type: 'workflow',
        title: 'Test',
        status: 'draft',
        nodes: [
          { id: 'start-1', type: 'start', label: 'Start' },
          { id: 'task-1', type: 'task', label: 'Review Document' },
          { id: 'end-1', type: 'end', label: 'End' },
        ],
        edges: [],
      },
    };

    render(<WorkflowDesigner schema={schema} />);
    
    // Click on a node - use the span with font-medium class inside the flow list
    const nodeElements = screen.getAllByText('Review Document');
    fireEvent.click(nodeElements[0]);
    
    // Properties panel should show node details
    expect(screen.getByDisplayValue('Review Document')).toBeInTheDocument();
  });
});
