import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardEditor } from '../DashboardEditor';
import type { DashboardSchema } from '@object-ui/types';

const DASHBOARD_WITH_WIDGETS: DashboardSchema = {
  type: 'dashboard',
  title: 'Test Dashboard',
  columns: 2,
  widgets: [
    { id: 'w1', title: 'Revenue', type: 'metric', object: 'orders', valueField: 'amount', aggregate: 'sum' },
    { id: 'w2', title: 'Sales Chart', type: 'bar', object: 'orders', categoryField: 'month' },
  ],
};

describe('DashboardEditor external selection', () => {
  it('should show property panel for externally selected widget', () => {
    const onChange = vi.fn();
    render(
      <DashboardEditor
        schema={DASHBOARD_WITH_WIDGETS}
        onChange={onChange}
        selectedWidgetId="w1"
        onWidgetSelect={vi.fn()}
      />,
    );

    expect(screen.getByTestId('widget-property-panel')).toBeDefined();
    const titleInput = screen.getByTestId('widget-prop-title') as HTMLInputElement;
    expect(titleInput.value).toBe('Revenue');
  });

  it('should call onWidgetSelect when widget is clicked in editor', () => {
    const onChange = vi.fn();
    const onWidgetSelect = vi.fn();
    render(
      <DashboardEditor
        schema={DASHBOARD_WITH_WIDGETS}
        onChange={onChange}
        selectedWidgetId={null}
        onWidgetSelect={onWidgetSelect}
      />,
    );

    fireEvent.click(screen.getByTestId('dashboard-widget-w2'));
    expect(onWidgetSelect).toHaveBeenCalledWith('w2');
  });

  it('should call onWidgetSelect(null) when property panel is closed', () => {
    const onChange = vi.fn();
    const onWidgetSelect = vi.fn();
    render(
      <DashboardEditor
        schema={DASHBOARD_WITH_WIDGETS}
        onChange={onChange}
        selectedWidgetId="w1"
        onWidgetSelect={onWidgetSelect}
      />,
    );

    // Close the property panel
    const closeBtn = screen.getByLabelText('Close');
    fireEvent.click(closeBtn);
    expect(onWidgetSelect).toHaveBeenCalledWith(null);
  });

  it('should not show property panel when selectedWidgetId is null', () => {
    const onChange = vi.fn();
    render(
      <DashboardEditor
        schema={DASHBOARD_WITH_WIDGETS}
        onChange={onChange}
        selectedWidgetId={null}
        onWidgetSelect={vi.fn()}
      />,
    );

    expect(screen.queryByTestId('widget-property-panel')).toBeNull();
  });

  it('should switch to different widget when selectedWidgetId changes', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <DashboardEditor
        schema={DASHBOARD_WITH_WIDGETS}
        onChange={onChange}
        selectedWidgetId="w1"
        onWidgetSelect={vi.fn()}
      />,
    );

    expect((screen.getByTestId('widget-prop-title') as HTMLInputElement).value).toBe('Revenue');

    rerender(
      <DashboardEditor
        schema={DASHBOARD_WITH_WIDGETS}
        onChange={onChange}
        selectedWidgetId="w2"
        onWidgetSelect={vi.fn()}
      />,
    );

    expect((screen.getByTestId('widget-prop-title') as HTMLInputElement).value).toBe('Sales Chart');
  });

  it('should work without external control (backward compatible)', () => {
    const onChange = vi.fn();
    render(
      <DashboardEditor schema={DASHBOARD_WITH_WIDGETS} onChange={onChange} />,
    );

    // Click widget to select internally
    fireEvent.click(screen.getByTestId('dashboard-widget-w1'));
    expect(screen.getByTestId('widget-property-panel')).toBeDefined();
  });

  it('should call onChange with updated schema when property is edited (live preview path)', () => {
    const onChange = vi.fn();
    render(
      <DashboardEditor
        schema={DASHBOARD_WITH_WIDGETS}
        onChange={onChange}
        selectedWidgetId="w1"
        onWidgetSelect={vi.fn()}
      />,
    );

    // Edit the title
    fireEvent.change(screen.getByTestId('widget-prop-title'), { target: { value: 'New Revenue' } });

    // onChange should be called with the updated schema — this is the live preview path
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        widgets: expect.arrayContaining([
          expect.objectContaining({ id: 'w1', title: 'New Revenue' }),
        ]),
      }),
    );
  });

  it('should call onWidgetSelect when adding a new widget', () => {
    const onChange = vi.fn();
    const onWidgetSelect = vi.fn();
    render(
      <DashboardEditor
        schema={DASHBOARD_WITH_WIDGETS}
        onChange={onChange}
        selectedWidgetId={null}
        onWidgetSelect={onWidgetSelect}
      />,
    );

    fireEvent.click(screen.getByTestId('dashboard-add-metric'));
    // Should auto-select the newly added widget
    expect(onWidgetSelect).toHaveBeenCalled();
    const calledId = onWidgetSelect.mock.calls[0][0] as string;
    expect(calledId).toMatch(/^widget_/);
  });

  it('should call onWidgetSelect(null) when removing the selected widget', () => {
    const onChange = vi.fn();
    const onWidgetSelect = vi.fn();
    render(
      <DashboardEditor
        schema={DASHBOARD_WITH_WIDGETS}
        onChange={onChange}
        selectedWidgetId="w1"
        onWidgetSelect={onWidgetSelect}
      />,
    );

    fireEvent.click(screen.getByTestId('dashboard-widget-remove-w1'));
    expect(onWidgetSelect).toHaveBeenCalledWith(null);
  });
});
