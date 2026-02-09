import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ApprovalProcess } from '../ApprovalProcess';
import type { ApprovalProcessSchema } from '@object-ui/types';

describe('ApprovalProcess', () => {
  it('should render pending approval', () => {
    const schema: ApprovalProcessSchema = {
      type: 'approval-process',
      currentNodeId: 'approval-1',
    };

    render(<ApprovalProcess schema={schema} />);
    
    expect(screen.getByText('Pending Approval')).toBeInTheDocument();
    expect(screen.getByText('Approve')).toBeInTheDocument();
    expect(screen.getByText('Reject')).toBeInTheDocument();
    expect(screen.getByText('Reassign')).toBeInTheDocument();
  });

  it('should render approval history', () => {
    const schema: ApprovalProcessSchema = {
      type: 'approval-process',
      currentNodeId: 'approval-2',
      history: [
        {
          nodeId: 'approval-1',
          action: 'approved',
          actor: 'user1',
          actorName: 'John Doe',
          timestamp: '2026-02-01T10:00:00Z',
          comment: 'Looks good!',
        },
      ],
      showHistory: true,
    };

    render(<ApprovalProcess schema={schema} />);
    
    expect(screen.getByText('Approval History')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Looks good!')).toBeInTheDocument();
  });

  it('should render approval rule badge', () => {
    const schema: ApprovalProcessSchema = {
      type: 'approval-process',
      currentNodeId: 'approval-1',
      approvalRule: {
        type: 'all',
      },
    };

    render(<ApprovalProcess schema={schema} />);
    
    expect(screen.getByText('All must approve')).toBeInTheDocument();
  });

  it('should render request data', () => {
    const schema: ApprovalProcessSchema = {
      type: 'approval-process',
      currentNodeId: 'approval-1',
      data: {
        employee: 'Jane Smith',
        leaveType: 'Annual',
        days: 5,
      },
    };

    render(<ApprovalProcess schema={schema} />);
    
    expect(screen.getByText('Request Details')).toBeInTheDocument();
    expect(screen.getByText(/Jane Smith/)).toBeInTheDocument();
  });

  it('should render empty history message', () => {
    const schema: ApprovalProcessSchema = {
      type: 'approval-process',
      currentNodeId: 'approval-1',
      showHistory: true,
      history: [],
    };

    render(<ApprovalProcess schema={schema} />);
    
    expect(screen.getByText('No approval history yet')).toBeInTheDocument();
  });
});
