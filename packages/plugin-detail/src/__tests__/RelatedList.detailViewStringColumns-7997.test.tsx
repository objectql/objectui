/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * objectui#7997 — the BEHAVIOUR half of the declaration widening: a
 * `DetailViewSchema` authored with bare field names renders the columns the
 * string branch resolves, and this file is typed so that the declaration and
 * the behaviour cannot drift apart again.
 *
 * ## What this file adds that the neighbouring pins do not
 *
 * `RelatedList.columnIdentityAccessor.test.tsx` already pins the string branch
 * ("keeps bare-string entries hydrating as before"), and it is the FIRING
 * CONTROL for that branch — measured, see below. What no test covered is the
 * seam this card is actually about: the columns arriving as a member of a
 * `DetailViewSchema`, which is where the TypeScript author gets stopped.
 *
 * So `RELATED` below is annotated with the real view type. Revert
 * `DetailViewSchema.related[].columns` to `TableColumn[]` and this file stops
 * COMPILING (`tsc -p tsconfig.test.json`, TS2322 on the string entries) — the
 * declaration is load-bearing here, not decorative. `DetailView` itself reaches
 * the renderer through `columns={related.columns as any}`, so the cast — not
 * the type — was carrying this arm at runtime; that is why the runtime needed
 * no change and why a behaviour-only pin would have proved nothing about the
 * card.
 *
 * ## The firing control, measured rather than asserted
 *
 * A green test against an arm that cannot break is not a measurement. The
 * string branch of `RelatedList.normalizeColumn` was ablated on disk (the
 * `typeof c !== 'string'` guard inverted, so bare strings fall through
 * unresolved), the ablation was proved present by blob hash, and this file was
 * run against it:
 *
 *   - `renders the object-schema label as the header` — FAILED (the header cell
 *     read `status`, the raw field name, instead of `SchemaLabel`).
 *   - `renders type-aware cells` — FAILED (cells read `planned` / `running`,
 *     the raw stored values, instead of the option labels).
 *
 * The exact runs are quoted in the PR body. The file was restored from its
 * `HEAD` blob and `git diff HEAD` proved empty before anything else was read.
 *
 * ## Desktop, pinned rather than inherited (objectui#8399)
 *
 * `RelatedList` reads `useIsMobile` (breakpoint 768): above it a `type="table"`
 * list renders a real `data-table` with header cells; below it a card layout
 * with no headers and no cells at all. Every assertion here reads a rendered
 * header or cell, so the width is set explicitly rather than inherited from
 * happy-dom's ambient 1024.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import type { DetailViewSchema } from '@object-ui/types';
import { RelatedList } from '../RelatedList';

beforeAll(() => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1280 });
});

/**
 * A select field whose stored values and display labels differ, so "the string
 * branch resolved the field def" and "it did not" produce different TEXT rather
 * than the same text twice.
 */
const fields = {
  status: {
    type: 'select',
    label: 'SchemaLabel',
    options: [
      { value: 'planned', label: 'Planned' },
      { value: 'running', label: 'Running' },
    ],
  },
};

const rows = [
  { id: 't1', status: 'planned' },
  { id: 't2', status: 'running' },
];

/**
 * THE SUBJECT OF THIS CARD, authored the way a TypeScript host authors it.
 *
 * The annotation is the gate: before objectui#7997 the `columns: ['status']`
 * entry was TS2322 against `TableColumn[]`, and the only way to write this was
 * to drop the annotation or cast it away — which is precisely the report.
 */
const RELATED: NonNullable<DetailViewSchema['related']> = [
  { title: 'Tasks', type: 'table', api: 'task', columns: ['status'] },
];

const makeDS = (label = 'SchemaLabel') => ({
  find: vi.fn(async () => rows),
  getObjectSchema: vi.fn(async () => ({
    name: 'task',
    fields: { ...fields, status: { ...fields.status, label } },
  })),
});

/**
 * Hand the renderer the member itself — no cast, no re-literal. If the two
 * halves of this card ever disagree again, they disagree HERE.
 */
function renderFromView(entry = RELATED[0], schemaLabel = 'SchemaLabel') {
  return render(
    <RelatedList
      title={entry.title}
      type={entry.type}
      api={entry.api}
      objectName={entry.api}
      columns={entry.columns}
      data={rows}
      dataSource={makeDS(schemaLabel) as never}
    />,
  );
}

/** Every rendered header cell's text, in order. */
const headers = () =>
  Array.from(document.querySelectorAll('thead th')).map((th) => (th.textContent ?? '').trim());

/** Every rendered body cell's text. */
const cellTexts = () =>
  Array.from(document.querySelectorAll('tbody td')).map((td) => (td.textContent ?? '').trim());

describe('objectui#7997 — a DetailViewSchema authored with field names renders', () => {
  it('renders the object-schema label as the header, not the raw field name', async () => {
    // The whole argument for the string arm: the header FOLLOWS the field's
    // label, so a rename in the object schema reaches this list for free. The
    // hand-spelled `{ accessorKey, header }` equivalent freezes the text.
    renderFromView();

    await waitFor(() => expect(screen.getByText('SchemaLabel')).toBeInTheDocument());
    expect(headers()).toEqual(['SchemaLabel']);
    // The negative half, so the row cannot pass on a header that merely EXISTS.
    expect(headers()).not.toContain('status');
  });

  it('renders type-aware cells — option labels, not stored values', async () => {
    // The second thing the string branch buys: a cell renderer resolved from
    // the field def. Without it the column paints `planned` / `running`.
    renderFromView();

    await waitFor(() =>
      expect(cellTexts()).toEqual(expect.arrayContaining(['Planned', 'Running'])),
    );
    expect(cellTexts()).not.toContain('planned');
    expect(cellTexts()).not.toContain('running');
  });

  it('CONTROL — the harness renders the SAME column spelled as a TableColumn', async () => {
    // Says the failures above would be about the string branch specifically,
    // not about a list that cannot render this field at all. The object arm
    // addresses the same field and reaches the same cells; only the header
    // differs, because the author spelled it themselves.
    renderFromView({
      title: 'Tasks',
      type: 'table',
      api: 'task',
      columns: [{ accessorKey: 'status', header: 'Hand-spelled' }],
    });

    await waitFor(() => expect(screen.getByText('Hand-spelled')).toBeInTheDocument());
    expect(headers()).toEqual(['Hand-spelled']);
    await waitFor(() =>
      expect(cellTexts()).toEqual(expect.arrayContaining(['Planned', 'Running'])),
    );
  });

  it('CONTROL — the header FOLLOWS the object schema, it is not echoed text', async () => {
    // The complement of row one, and the assertion that makes row one mean what
    // it claims. Same authored `columns: ['status']`, one thing changed — the
    // field's `label` in the object schema — and the header moves with it. A
    // branch that echoed the field name, or any fixed string, is red here while
    // staying green on row one's positive alone.
    renderFromView(RELATED[0], 'RenamedInSchema');

    await waitFor(() => expect(screen.getByText('RenamedInSchema')).toBeInTheDocument());
    expect(headers()).toEqual(['RenamedInSchema']);
    expect(headers()).not.toContain('SchemaLabel');
  });
});
