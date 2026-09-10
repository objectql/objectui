/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * `record:chatter.feed` / `record:discussion.feed` — the nested config's
 * MEMBER shape, and the fact that authoring it REPLACES (objectui#8071)
 * ══════════════════════════════════════════════════════════════════════════
 *
 * The per-block member pin objectui#8068 asks for on these two keys. They are
 * ONE key on ONE renderer: `record:chatter` and `record:discussion` are the
 * same `RecordChatterRenderer` registered under two names against the same
 * `CHATTER_INPUTS`, so one file pins both — the shape
 * `record-picker-label-placeholder-i18n.test.tsx` already set for a pair of
 * keys covered by a single mechanism (objectui#8071 slice 3).
 *
 * `feed` is declared a bare `type: 'object'`: the registration carries no
 * member list at all, so its `description` is the whole published statement of
 * what the key admits. (objectui#8934 rewrote that description; the
 * declaration was measured and deliberately left alone — `ComponentInput` has
 * no member-list slot for a fixed-key record.) The only prior coverage,
 * `record-chatter.loading.test.tsx` (read end to end before this file was
 * written), is about the host's `loading` signal reaching the panel and never
 * authors `feed` at all.
 *
 * ## The member fact that matters most: authoring `feed` REPLACES it
 *
 * `record-chatter.tsx` composes its config as
 *
 *     { position, collapsible, feed: {DEFAULTS}, ...(schema) }
 *
 * — a SHALLOW spread. So an authored `feed` does not merge with the renderer's
 * three defaults (`enableReactions` / `enableThreading` / `showCommentInput`,
 * all true), it displaces them wholesale, and every member the author did not
 * restate falls back to `RecordActivityTimeline`'s own `?? false`. An author
 * who writes `feed: { showCommentInput: true }` meaning "and keep the rest"
 * turns reactions and threading OFF. That is the whole reason this key needs a
 * member pin rather than a presence check, and it is asserted below in both
 * directions rather than described here.
 *
 * ## LIMIT — which members of `feed` are live on THIS path
 *
 * `config.feed` is handed straight to `RecordActivityTimeline`, which reads
 * exactly the five AFFORDANCE members (`showFilterToggle`,
 * `showCommentInput`, `enableReactions`, `enableThreading`,
 * `showSubscriptionToggle`). The FILTER members of `record:activity`
 * (`types` / `limit` / `showCompleted` / `unifiedTimeline`) are applied by
 * `applyFeedConfig`, which only `record-activity.tsx` calls — so they do
 * nothing nested inside `feed`.
 *
 * ⚠️ RE-POINTED (objectui#8934). This section used to state the reading above
 * as a correction to the registration, whose description then read "same shape
 * as record:activity" — wider than the read site is. That gap is closed at the
 * source: the maintainer ruled on 2026-09-10 that the DESCRIPTION changes and
 * the rendering path does not, so the registration now names the five
 * affordances and says the four filter members are not read on this path. The
 * reading above no longer contradicts the published contract; it agrees with
 * it.
 *
 * This file still pins only the LIVE members. The behaviour the corrected
 * description claims — the five affordances move the timeline, a filter member
 * authored inside `feed` moves nothing, with `applyFeedConfig` as the firing
 * control that makes that zero a reading — is pinned next door in
 * `recordChatterFeedAffordanceOnly-8934.test.tsx`. "This member is dead" is
 * asserted in neither file: that is a claim about a contract defect, and the
 * defect was answered by correcting the contract.
 *
 * ## Resolution
 *
 * Nothing resolves through any `dist/`: `../record-chatter` is this package's
 * own source and `@object-ui/react` is mapped to its `src` by the root
 * `vitest.config.mts` alias table, so an ablation of `record-chatter.tsx` is
 * visible here without a rebuild.
 */

import * as React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { DiscussionContextProvider } from '@object-ui/react';
import type { FeedItem } from '@object-ui/types';
import { RecordChatterRenderer } from '../record-chatter';

/** The composer's placeholder in the `en` pack — `showCommentInput`'s observable. */
const COMPOSER = /Leave a comment/;
/** The empty-state reaction button's accessible name — `enableReactions`'s observable. */
const ADD_REACTION = 'Add reaction';

/** A root comment plus a REPLY to it: `enableThreading`'s observable is whether
 *  the reply is pulled out of the root list and under its parent. */
const ITEMS: FeedItem[] = [
  { id: 'c-1', type: 'comment', actor: 'Ada', body: 'Root comment', createdAt: '2026-01-02T00:00:00.000Z' },
  { id: 'c-2', type: 'comment', actor: 'Grace', body: 'A threaded reply', parentId: 'c-1', createdAt: '2026-01-03T00:00:00.000Z' },
];

const handlers = {
  onAddComment: vi.fn(),
  onAddReply: vi.fn(),
  onToggleReaction: vi.fn(),
};

/** Both registered names resolve to this one renderer — every case runs on both. */
const BLOCK_NAMES = ['record:chatter', 'record:discussion'] as const;

function mount(feed: unknown, opts: { authored?: boolean } = {}) {
  const schema: Record<string, unknown> = { position: 'bottom' };
  if (opts.authored !== false) schema.feed = feed;
  return render(
    <DiscussionContextProvider items={ITEMS as any} loading={false} {...handlers}>
      <RecordChatterRenderer schema={schema as any} />
    </DiscussionContextProvider>,
  );
}

/** Root-level feed rows, i.e. bodies rendered outside a threaded reply block. */
const rootBodies = () => screen.queryAllByText(/Root comment|A threaded reply/).map((el) => el.textContent);

beforeEach(() => {
  cleanup();
  handlers.onAddComment.mockClear();
  handlers.onAddReply.mockClear();
  handlers.onToggleReaction.mockClear();
});

describe.each(BLOCK_NAMES)('%s `feed` members reach the timeline (objectui#8071)', (blockName) => {
  it(`${blockName}: with NO \`feed\` authored, the renderer's three defaults are in force`, () => {
    // The baseline the displacement case below is measured against: reactions
    // and the composer are ON without the author writing anything.
    mount(undefined, { authored: false });
    expect(screen.getByPlaceholderText(COMPOSER)).toBeTruthy();
    expect(screen.getAllByRole('button', { name: ADD_REACTION }).length).toBeGreaterThan(0);
  });

  it(`${blockName}: \`showCommentInput: false\` withholds the composer`, () => {
    mount({ showCommentInput: false, enableReactions: true, enableThreading: false });
    expect(screen.queryByPlaceholderText(COMPOSER)).toBeNull();
    // CONTROL — the panel still rendered, so "no composer" is not "no panel".
    expect(screen.getByText('Root comment')).toBeTruthy();
  });

  it(`${blockName}: \`enableReactions: false\` withholds the reaction affordance`, () => {
    mount({ showCommentInput: true, enableReactions: false, enableThreading: false });
    expect(screen.queryAllByRole('button', { name: ADD_REACTION })).toHaveLength(0);
    expect(screen.getByPlaceholderText(COMPOSER)).toBeTruthy();
  });

  it(`${blockName}: \`enableThreading\` decides whether a reply is a ROOT row`, () => {
    // The member with a structural effect rather than an affordance one: with
    // threading ON the reply is grouped under its parent and leaves the root
    // list; with it OFF the same item is rendered as another top-level row.
    mount({ showCommentInput: false, enableReactions: false, enableThreading: true });
    expect(rootBodies()).toEqual(['Root comment']);

    cleanup();
    mount({ showCommentInput: false, enableReactions: false, enableThreading: false });
    expect(rootBodies()).toEqual(['Root comment', 'A threaded reply']);
  });
});

describe('an authored `feed` REPLACES the defaults rather than merging (objectui#8071)', () => {
  // The shallow-spread consequence, and the reason this key earns a member pin.
  it.each(BLOCK_NAMES)('%s: restating ONE member drops the other two defaults', (_blockName) => {
    mount({ showCommentInput: true });
    // The member the author restated is honoured…
    expect(screen.getByPlaceholderText(COMPOSER)).toBeTruthy();
    // …and the two they did not are NOT inherited from the renderer's default
    // `feed`, because the whole object was displaced.
    expect(screen.queryAllByRole('button', { name: ADD_REACTION })).toHaveLength(0);
    expect(rootBodies()).toEqual(['Root comment', 'A threaded reply']);
  });

  it.each(BLOCK_NAMES)('%s: CONTROL — the SAME three affordances are on when `feed` is absent', (_blockName) => {
    // Without this control the case above is satisfiable by a renderer in which
    // reactions and threading are simply never on in this harness.
    mount(undefined, { authored: false });
    expect(screen.getByPlaceholderText(COMPOSER)).toBeTruthy();
    expect(screen.getAllByRole('button', { name: ADD_REACTION }).length).toBeGreaterThan(0);
    expect(rootBodies()).toEqual(['Root comment']);
  });

  it.each(BLOCK_NAMES)('%s: an EMPTY `feed` displaces all three, and they land DIFFERENTLY', (_blockName) => {
    // `feed: {}` is an authored object, so the spread replaces the renderer's
    // defaults with nothing. What each member then falls back to is
    // `RecordActivityTimeline`'s OWN default, and those are not uniform:
    //
    //   showCommentInput  `config?.showCommentInput !== false`  -> ON when absent
    //   enableReactions   `config?.enableReactions ?? false`     -> OFF when absent
    //   enableThreading   `config?.enableThreading ?? false`     -> OFF when absent
    //
    // So displacing the default `feed` silently turns reactions and threading
    // off while leaving the composer up. Measured, not assumed: the first shape
    // of this case asserted all three went off and went red on the composer.
    // Pinned per member so the asymmetry cannot drift unnoticed in either
    // direction — a future uniform `?? false` would take the composer down, and
    // a future deep merge would bring all three back.
    mount({});
    expect(screen.getByPlaceholderText(COMPOSER)).toBeTruthy();
    expect(screen.queryAllByRole('button', { name: ADD_REACTION })).toHaveLength(0);
    expect(rootBodies()).toEqual(['Root comment', 'A threaded reply']);
  });

  it.each(BLOCK_NAMES)('%s: only an EXPLICIT `false` withholds the composer', (_blockName) => {
    // The other side of that asymmetry, and the control that stops the case
    // above from reading as "the composer ignores `feed` entirely".
    mount({ showCommentInput: false });
    expect(screen.queryByPlaceholderText(COMPOSER)).toBeNull();
  });
});
