/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditorModeToggle } from '../EditorModeToggle';
import type { EditorMode } from '@object-ui/types';

describe('EditorModeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all three modes', () => {
    const onChange = vi.fn();
    render(<EditorModeToggle mode="edit" onChange={onChange} />);
    expect(screen.getByTestId('editor-mode-edit')).toBeDefined();
    expect(screen.getByTestId('editor-mode-preview')).toBeDefined();
    expect(screen.getByTestId('editor-mode-code')).toBeDefined();
  });

  it('should highlight the active mode', () => {
    const onChange = vi.fn();
    render(<EditorModeToggle mode="preview" onChange={onChange} />);
    const previewBtn = screen.getByTestId('editor-mode-preview');
    expect(previewBtn.getAttribute('aria-checked')).toBe('true');
  });

  it('should call onChange when mode is clicked', () => {
    const onChange = vi.fn();
    render(<EditorModeToggle mode="edit" onChange={onChange} />);
    fireEvent.click(screen.getByTestId('editor-mode-code'));
    expect(onChange).toHaveBeenCalledWith('code');
  });

  it('should render mode labels', () => {
    const onChange = vi.fn();
    render(<EditorModeToggle mode="edit" onChange={onChange} />);
    expect(screen.getByText('Edit')).toBeDefined();
    expect(screen.getByText('Preview')).toBeDefined();
    expect(screen.getByText('Code')).toBeDefined();
  });

  it('should have radiogroup role', () => {
    const onChange = vi.fn();
    render(<EditorModeToggle mode="edit" onChange={onChange} />);
    expect(screen.getByRole('radiogroup')).toBeDefined();
  });

  it('should disable all buttons when disabled', () => {
    const onChange = vi.fn();
    render(<EditorModeToggle mode="edit" onChange={onChange} disabled />);
    expect(screen.getByTestId('editor-mode-edit').hasAttribute('disabled')).toBe(true);
    expect(screen.getByTestId('editor-mode-preview').hasAttribute('disabled')).toBe(true);
    expect(screen.getByTestId('editor-mode-code').hasAttribute('disabled')).toBe(true);
  });

  it('should render with custom className', () => {
    const onChange = vi.fn();
    render(<EditorModeToggle mode="edit" onChange={onChange} className="my-class" />);
    expect(screen.getByTestId('editor-mode-toggle').className).toContain('my-class');
  });
});
