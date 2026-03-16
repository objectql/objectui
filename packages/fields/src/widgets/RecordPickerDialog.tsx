import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Separator,
} from '@object-ui/components';
import {
  Search,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import type { DataSource, QueryParams, LookupColumnDef } from '@object-ui/types';

/** Default page size for the Record Picker dialog */
const DEFAULT_PAGE_SIZE = 10;

/**
 * Normalise a lookup_columns entry (string | LookupColumnDef) into a
 * concrete LookupColumnDef object.
 */
function normalizeColumn(col: string | LookupColumnDef): LookupColumnDef {
  return typeof col === 'string' ? { field: col } : col;
}

/**
 * Pretty-print a field name as a column header label.
 * Converts snake_case / camelCase to Title Case.
 */
function fieldToLabel(field: string): string {
  return field
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, c => c.toUpperCase());
}

export interface RecordPickerDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Called when the dialog should close */
  onOpenChange: (open: boolean) => void;

  /** Dialog title */
  title?: string;
  /** Allow multiple selection */
  multiple?: boolean;

  /** DataSource to fetch records from */
  dataSource: DataSource;
  /** Object name to query (e.g. 'customers') */
  objectName: string;

  /** Columns to display. Defaults to [displayField, descriptionField]. */
  columns?: Array<string | LookupColumnDef>;
  /** Primary display field (default: 'name') */
  displayField?: string;
  /** Record id field (default: 'id') */
  idField?: string;

  /** Page size (default: 10) */
  pageSize?: number;

  /** Currently selected value(s) */
  value?: any;
  /** Called when selection changes */
  onSelect: (value: any) => void;
}

/**
 * RecordPickerDialog — Enterprise-grade record selection dialog.
 *
 * Renders records in a table with multi-column display, search,
 * pagination, column sorting, keyboard navigation, loading/error/empty
 * states, and single/multi-select.  Responsive: mobile-friendly width
 * via Tailwind breakpoints.
 */
export function RecordPickerDialog({
  open,
  onOpenChange,
  title = 'Select Record',
  multiple = false,
  dataSource,
  objectName,
  columns: columnsProp,
  displayField = 'name',
  idField = 'id',
  pageSize = DEFAULT_PAGE_SIZE,
  value,
  onSelect,
}: RecordPickerDialogProps) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Column sorting state
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // For multi-select, track pending selections before confirming
  const [pendingSelection, setPendingSelection] = useState<Set<any>>(new Set());

  // Keyboard navigation: focused row index
  const [focusedRow, setFocusedRow] = useState(-1);
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

  // Resolved columns
  const resolvedColumns = useMemo<LookupColumnDef[]>(() => {
    if (columnsProp && columnsProp.length > 0) {
      return columnsProp.map(normalizeColumn);
    }
    // Auto-infer: just use displayField
    return [{ field: displayField, label: fieldToLabel(displayField) }];
  }, [columnsProp, displayField]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Fetch records
  const fetchRecords = useCallback(
    async (search?: string, page = 1, sort?: { field: string; direction: 'asc' | 'desc' } | null) => {
      if (!dataSource || !objectName) return;

      setLoading(true);
      setError(null);

      try {
        const params: QueryParams = {
          $top: pageSize,
          $skip: (page - 1) * pageSize,
        };
        if (search && search.trim()) {
          params.$search = search.trim();
        }
        if (sort) {
          params.$orderby = { [sort.field]: sort.direction };
        }

        const result = await dataSource.find(objectName, params);
        const data: any[] = result?.data ?? result ?? [];

        setRecords(data);
        setTotalCount(result?.total ?? data.length);
        setFocusedRow(-1);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    },
    [dataSource, objectName, pageSize],
  );

  // Build current sort object for passing to fetchRecords
  const currentSort = useMemo(
    () => sortField ? { field: sortField, direction: sortDirection } : null,
    [sortField, sortDirection],
  );

  // Fetch when dialog opens, page changes, or sort changes
  useEffect(() => {
    if (open) {
      fetchRecords(searchQuery || undefined, currentPage, currentSort);
    }
    if (!open) {
      // Reset state on close
      setSearchQuery('');
      setCurrentPage(1);
      setError(null);
      setRecords([]);
      setSortField(null);
      setSortDirection('asc');
      setFocusedRow(-1);
      // Reset pending selection to match current value
      setPendingSelection(new Set(
        multiple ? (Array.isArray(value) ? value : []) : [],
      ));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentPage, currentSort]);

  // Initialize pending selection when dialog opens
  useEffect(() => {
    if (open && multiple) {
      setPendingSelection(new Set(Array.isArray(value) ? value : []));
    }
  }, [open, multiple, value]);

  // Debounced search
  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setCurrentPage(1);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        fetchRecords(query || undefined, 1, currentSort);
      }, 300);
    },
    [fetchRecords, currentSort],
  );

  // Clean up debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Column sort handler
  const handleSort = useCallback((field: string) => {
    setSortField(prev => {
      if (prev === field) {
        // Toggle direction
        setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
        return field;
      }
      setSortDirection('asc');
      return field;
    });
    setCurrentPage(1);
  }, []);

  // Get record id
  const getRecordId = useCallback(
    (record: any) => record[idField] ?? record.id ?? record._id,
    [idField],
  );

  // Check if a record is selected
  const isSelected = useCallback(
    (record: any) => {
      const rid = getRecordId(record);
      if (multiple) {
        return pendingSelection.has(rid);
      }
      return value === rid;
    },
    [multiple, value, pendingSelection, getRecordId],
  );

  // Handle row click
  const handleRowClick = useCallback(
    (record: any) => {
      const rid = getRecordId(record);

      if (multiple) {
        setPendingSelection(prev => {
          const next = new Set(prev);
          if (next.has(rid)) {
            next.delete(rid);
          } else {
            next.add(rid);
          }
          return next;
        });
      } else {
        // Single select — immediately close
        onSelect(rid);
        onOpenChange(false);
      }
    },
    [multiple, getRecordId, onSelect, onOpenChange],
  );

  // Confirm multi-select
  const handleConfirm = useCallback(() => {
    onSelect(Array.from(pendingSelection));
    onOpenChange(false);
  }, [pendingSelection, onSelect, onOpenChange]);

  // Page navigation
  const handlePrevPage = useCallback(() => {
    setCurrentPage(p => Math.max(1, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(p => Math.min(totalPages, p + 1));
  }, [totalPages]);

  // Keyboard navigation for the table
  const handleTableKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (records.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedRow(prev => Math.min(prev + 1, records.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedRow(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (focusedRow >= 0 && focusedRow < records.length) {
          handleRowClick(records[focusedRow]);
        }
      }
    },
    [records, focusedRow, handleRowClick],
  );

  // Scroll focused row into view
  useEffect(() => {
    if (focusedRow >= 0 && tableBodyRef.current) {
      const row = tableBodyRef.current.querySelector(`[data-row-index="${focusedRow}"]`);
      if (row && typeof row.scrollIntoView === 'function') {
        row.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedRow]);

  // Get display value for a cell
  const getCellValue = useCallback((record: any, field: string): string => {
    const val = record[field];
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') {
      // Handle MongoDB types / expanded references
      if (val.$numberDecimal) return String(Number(val.$numberDecimal));
      if (val.$oid) return String(val.$oid);
      if (val.$date) return new Date(val.$date).toLocaleDateString();
      if (val.name || val.label) return String(val.name || val.label);
      return JSON.stringify(val);
    }
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    return String(val);
  }, []);

  // Render sort indicator for a column
  const renderSortIcon = useCallback((field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 size-3 opacity-40" />;
    }
    return sortDirection === 'asc'
      ? <ArrowUp className="ml-1 size-3" />
      : <ArrowDown className="ml-1 size-3" />;
  }, [sortField, sortDirection]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl w-[95vw] sm:w-full max-h-[85vh] sm:max-h-[80vh] flex flex-col"
        data-testid="record-picker-dialog"
      >
        <DialogHeader>
          <DialogTitle>
            {title}
            {multiple && <span className="sr-only"> (multiple selection)</span>}
          </DialogTitle>
        </DialogHeader>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
            data-testid="record-picker-search"
          />
          {loading && (
            <Loader2
              className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground"
              data-testid="record-picker-loading-indicator"
            />
          )}
        </div>

        <Separator />

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center gap-2 py-4" role="alert">
            <AlertCircle className="size-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchRecords(searchQuery || undefined, currentPage, currentSort)}
              type="button"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Loading state (initial) */}
        {loading && records.length === 0 && !error && (
          <div className="flex flex-col items-center gap-2 py-8" role="status" aria-live="polite">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading…</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && records.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No records found</p>
          </div>
        )}

        {/* Table */}
        {!error && records.length > 0 && (
          <div
            className="flex-1 overflow-auto min-h-0"
            tabIndex={0}
            onKeyDown={handleTableKeyDown}
            role="grid"
            aria-label="Records"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  {multiple && (
                    <TableHead className="w-10" />
                  )}
                  {resolvedColumns.map(col => (
                    <TableHead
                      key={col.field}
                      style={col.width ? { width: col.width } : undefined}
                      className="cursor-pointer select-none"
                      onClick={() => handleSort(col.field)}
                      aria-sort={sortField === col.field ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                    >
                      <span className="inline-flex items-center">
                        {col.label || fieldToLabel(col.field)}
                        {renderSortIcon(col.field)}
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody ref={tableBodyRef}>
                {records.map((record, idx) => {
                  const rid = getRecordId(record);
                  const selected = isSelected(record);
                  const focused = idx === focusedRow;

                  return (
                    <TableRow
                      key={rid ?? idx}
                      data-row-index={idx}
                      className={cn(
                        'cursor-pointer',
                        selected ? 'bg-accent/50' : 'hover:bg-accent/30',
                        focused && 'ring-2 ring-primary ring-inset',
                      )}
                      onClick={() => handleRowClick(record)}
                      data-testid={`record-row-${rid}`}
                      aria-selected={selected}
                    >
                      {multiple && (
                        <TableCell className="w-10">
                          {selected && <Check className="size-4 text-primary" />}
                        </TableCell>
                      )}
                      {resolvedColumns.map(col => (
                        <TableCell key={col.field}>
                          {getCellValue(record, col.field)}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {!error && totalCount > 0 && (
          <>
            <Separator />
            <div className="flex items-center justify-between text-sm text-muted-foreground px-1" data-testid="record-picker-pagination">
              <span>
                {totalCount} {totalCount === 1 ? 'record' : 'records'}
                {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
              </span>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-7"
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1}
                    type="button"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-7"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                    type="button"
                    aria-label="Next page"
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Multi-select confirmation */}
        {multiple && (
          <DialogFooter>
            <div className="flex items-center gap-2 w-full justify-between">
              <span className="text-sm text-muted-foreground">
                {pendingSelection.size} selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleConfirm}>
                  Confirm
                </Button>
              </div>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
