/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * `PageRenderer` draws a `body` given as ONE node and a `body` given as a list
 * (objectui#8310, maintainer ruling 2026-09-07, director decision batch #2).
 *
 * ## What this half is, and what it is NOT
 *
 * ⛔ This file is a **regression control**, not evidence for the card. The
 * ruling's repair on this side is the deletion of `FlatContent`'s
 * `content as SchemaNode` cast, which is a TYPE-LEVEL change with no runtime
 * effect at all: both arities rendered before it and both render after it. An
 * assertion green in both worlds proves nothing about a change, and this one is
 * labelled so nobody later quotes it as if it did.
 *
 * The discriminating half lives in
 * `packages/types/src/__tests__/page-body-arity-8310.test.ts`: the declaration
 * and the zod mirror both refused the single-node form before this card, and
 * both admit it after.
 *
 * ## Why the control is worth having anyway
 *
 * The cast is what let the single-node branch survive a declaration that
 * forbade it. Deleting the cast without a behavioural pin would leave that
 * branch guarded by nothing but the union it now leans on — and the next
 * narrowing of `PageNodeSchema.body` would delete a live code path with a green
 * suite. So this asserts against the rendered output rather than against
 * `FlatContent`'s internals, and it survives a rewrite of the normalization.
 *
 * ## ⚠️ Why the grid's own children are spelled `children` here, not `items`
 *
 * The root `README.md` flagship example spells the grid's child list `items`,
 * and `grid` reads `children` and nothing else — so that example renders an
 * EMPTY grid element. That is a real defect, measured while writing this file
 * and filed as objectui#8912; it is a DIFFERENT defect from this card (a child
 * key with no reader, versus the arity of `body`) and the ruling here forbids
 * touching the README. This file therefore asserts the two facts separately:
 * the flagship shape verbatim reaches the renderer and draws its `grid` node
 * (which is what `body`'s arity governs), and a `children`-spelled subtree
 * draws all the way down through either arity (which is what proves the whole
 * channel works). ⛔ Do not "repair" this file by moving the flagship
 * transcription to `children` — that would hide objectui#8912 inside a green.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SchemaRenderer } from '@object-ui/react';
// Module scope, not a hook: registers `page`, `grid` and `statistic`. A cold
// `await import()` inside a hook is billed to `hookTimeout` and races the
// assertions (AGENTS.md §测试纪律, objectui#3010).
import '../renderers';

/** The README's flagship grid, verbatim — child list spelled `items` (objectui#8912). */
const flagshipGridAsAuthored = {
  type: 'grid',
  columns: 3,
  items: [
    { type: 'statistic', label: 'Total Users', value: '1234' },
    { type: 'statistic', label: 'Revenue', value: '$56,789' },
    { type: 'statistic', label: 'Orders', value: '432' },
  ],
};

/** The same grid with its child list under the key `grid` actually reads. */
const flagshipGridAsRead = {
  type: 'grid',
  columns: 3,
  children: flagshipGridAsAuthored.items,
};

function renderPage(body: unknown) {
  return render(<SchemaRenderer schema={{ type: 'page', title: 'Dashboard', body } as any} />);
}

const gridsIn = (container: HTMLElement) => container.querySelectorAll('[data-obj-type="grid"]');

describe('PageRenderer — both `body` arities reach the renderer (objectui#8310, CONTROL)', () => {
  it('draws the node when `body` is ONE node — the README flagship shape, verbatim', () => {
    const { container } = renderPage(flagshipGridAsAuthored);
    expect(gridsIn(container)).toHaveLength(1);
  });

  it('draws the node when `body` is a LIST of nodes', () => {
    const { container } = renderPage([flagshipGridAsAuthored]);
    expect(gridsIn(container)).toHaveLength(1);
  });

  it('draws nothing when `body` is absent — the negative control', () => {
    const { container } = renderPage(undefined);
    expect(gridsIn(container)).toHaveLength(0);
  });
});

describe('PageRenderer — the whole subtree draws through either arity (objectui#8310)', () => {
  const labels = ['Total Users', 'Revenue', 'Orders'];

  it('renders every child of a single-node `body`', () => {
    const { container } = renderPage(flagshipGridAsRead);
    for (const label of labels) expect(container.textContent).toContain(label);
  });

  it('renders every child of a list `body`', () => {
    const { container } = renderPage([flagshipGridAsRead]);
    for (const label of labels) expect(container.textContent).toContain(label);
  });
});
