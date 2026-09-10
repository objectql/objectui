/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * ══════════════════════════════════════════════════════════════════════════
 * `record:chatter.feed` / `record:discussion.feed` carry the AFFORDANCE
 * members, and only those (objectui#8934)
 * ══════════════════════════════════════════════════════════════════════════
 *
 * The registration used to describe this key as "same shape as
 * record:activity", which advertised four FILTER members
 * (`types` / `limit` / `showCompleted` / `unifiedTimeline`) that nothing on
 * this path reads. The maintainer ruled (2026-09-10) that the DESCRIPTION is
 * what changes — the rendering path is untouched — so what this file pins is
 * the behaviour the corrected description now claims, in both directions:
 *
 *   POSITIVE  the five affordance members reach `RecordActivityTimeline` and
 *             MOVE it;
 *   NEGATIVE  a filter member authored inside `feed` changes nothing at all;
 *   CONTROL   the same filter values, applied through the pipeline that
 *             `record:activity` really runs (`applyFeedConfig`), DO narrow the
 *             same fixture — so the zero above is a reading about the PATH,
 *             not a fixture in which no filter could ever have shown.
 *
 * ⛔ What this file deliberately does NOT assert: "these members are dead".
 * A pin whose whole subject is that a contract is wrong freezes the defect;
 * the reasoning belongs in the card, and the card was answered by correcting
 * the description. Every case below has a live subject.
 *
 * ## Why `showSubscriptionToggle` is pinned on the timeline, not on the panel
 *
 * It IS one of the five: `RecordActivityTimeline` reads it. But the bell it
 * gates is rendered behind `showSubscription && subscription`, and
 * `RecordChatterRenderer` never passes a `subscription` — the declared-but-
 * inert gap `record:activity`'s own registration already spells out ("NOT
 * IMPLEMENTED — no record-subscription backend exists yet"). So its live
 * subject is on `RecordActivityTimeline` directly, where a `subscription` can
 * be supplied, and that is where it is pinned. It is an affordance member; it
 * is not retired here.
 *
 * ## Resolution
 *
 * Nothing resolves through any `dist/`: `../record-chatter`,
 * `../recordActivityFeed` and `../../RecordActivityTimeline` are this
 * package's own source, and `@object-ui/react` is mapped to its `src` by the
 * root `vitest.config.mts` alias table.
 */

import * as React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { DiscussionContextProvider } from '@object-ui/react';
import { ComponentRegistry } from '@object-ui/core';
import type { ComponentInput, FeedItem, RecordActivityComponentProps, RecordSubscription } from '@object-ui/types';
import { RecordChatterRenderer } from '../record-chatter';
import { applyFeedConfig } from '../recordActivityFeed';
import { RecordActivityTimeline } from '../../RecordActivityTimeline';
import '../../index';

/** Both registered names are the same renderer on the same `CHATTER_INPUTS`. */
const BLOCK_NAMES = ['record:chatter', 'record:discussion'] as const;

/** The composer placeholder in the `en` pack — `showCommentInput`'s observable. */
const COMPOSER = /Leave a comment/;
/** The filter dropdown's accessible name — `showFilterToggle`'s observable. */
const FILTER_TRIGGER = 'Filter activity';
/** The empty-state reaction button — `enableReactions`'s observable. */
const ADD_REACTION = 'Add reaction';
/** The bell's accessible name when not subscribed — `showSubscriptionToggle`'s. */
const SUBSCRIBE = 'Subscribe to notifications';

/**
 * One item of each kind the four filter members can act on:
 *   `types`            keeps only `comment`
 *   `unifiedTimeline`  set false drops `field_change`
 *   `showCompleted`    set true keeps `task` (dropped by default)
 *   `limit`            is the page window on the `record:activity` path
 * Fixed timestamps well in the past, so every row formats through
 * `toLocaleDateString()` and two renders are byte-comparable.
 */
const ITEMS: FeedItem[] = [
  { id: 'c-1', type: 'comment', actor: 'Ada', body: 'Root comment', createdAt: '2026-01-02T00:00:00.000Z' },
  {
    id: 'f-1',
    type: 'field_change',
    actor: 'Grace',
    createdAt: '2026-01-03T00:00:00.000Z',
    fieldChanges: [{ field: 'stage', fieldLabel: 'Stage', oldValue: 'New', newValue: 'Won' }],
  },
  { id: 't-1', type: 'task', actor: 'Ada', body: 'Follow up call', createdAt: '2026-01-04T00:00:00.000Z' },
];

/** Every filter member of `record:activity`, authored where it does nothing. */
const FILTERS = {
  types: ['comment'],
  limit: 1,
  showCompleted: true,
  unifiedTimeline: false,
} as const;

/** The affordance members, all stated, so nothing here rides on a default. */
const AFFORDANCES = {
  showFilterToggle: true,
  showCommentInput: true,
  enableReactions: true,
  enableThreading: false,
  showSubscriptionToggle: true,
} as const;

const handlers = {
  onAddComment: vi.fn(),
  onAddReply: vi.fn(),
  onToggleReaction: vi.fn(),
};

function mount(feed: unknown) {
  return render(
    <DiscussionContextProvider items={ITEMS as any} loading={false} {...handlers}>
      <RecordChatterRenderer schema={{ position: 'bottom', feed } as any} />
    </DiscussionContextProvider>,
  );
}

/**
 * Everything the four filter members could move, read off the rendered panel:
 * which rows survived, the header's own count of them, and the affordances.
 *
 * Text alone is NOT a sufficient instrument here and the control below says so
 * out loud — `enableReactions` adds an icon-only button, so it changes the DOM
 * while leaving `textContent` byte-identical. A signature that reads roles as
 * well as text is what makes "changed nothing" a measurement.
 */
function panelSignature() {
  return {
    rows: screen.queryAllByText(/Root comment|Follow up call|Stage/).map((el) => el.textContent),
    heading: screen.getByRole('heading', { level: 2 }).textContent,
    reactionButtons: screen.queryAllByRole('button', { name: ADD_REACTION }).length,
    composer: !!screen.queryByPlaceholderText(COMPOSER),
    filterTrigger: !!screen.queryByRole('combobox', { name: FILTER_TRIGGER }),
  };
}

beforeEach(() => {
  cleanup();
  handlers.onAddComment.mockClear();
  handlers.onAddReply.mockClear();
  handlers.onToggleReaction.mockClear();
});

describe.each(BLOCK_NAMES)('%s: the five AFFORDANCE members move the timeline', (_blockName) => {
  it('`showFilterToggle` decides whether the filter dropdown is rendered', () => {
    mount({ ...AFFORDANCES, showFilterToggle: true });
    expect(screen.getByRole('combobox', { name: FILTER_TRIGGER })).toBeTruthy();

    cleanup();
    mount({ ...AFFORDANCES, showFilterToggle: false });
    expect(screen.queryByRole('combobox', { name: FILTER_TRIGGER })).toBeNull();
    // CONTROL — the panel still rendered, so "no dropdown" is not "no panel".
    expect(screen.getByText('Root comment')).toBeTruthy();
  });

  it('`showCommentInput` decides whether the composer is rendered', () => {
    mount({ ...AFFORDANCES, showCommentInput: true });
    expect(screen.getByPlaceholderText(COMPOSER)).toBeTruthy();

    cleanup();
    mount({ ...AFFORDANCES, showCommentInput: false });
    expect(screen.queryByPlaceholderText(COMPOSER)).toBeNull();
    expect(screen.getByText('Root comment')).toBeTruthy();
  });

  it('`enableReactions` decides whether the reaction affordance is rendered', () => {
    mount({ ...AFFORDANCES, enableReactions: true });
    expect(screen.getAllByRole('button', { name: ADD_REACTION }).length).toBeGreaterThan(0);

    cleanup();
    mount({ ...AFFORDANCES, enableReactions: false });
    expect(screen.queryAllByRole('button', { name: ADD_REACTION })).toHaveLength(0);
    expect(screen.getByText('Root comment')).toBeTruthy();
  });

  it('`enableThreading` decides whether a reply is pulled out of the root list', () => {
    const withReply = [
      ...ITEMS,
      { id: 'c-2', type: 'comment', actor: 'Grace', body: 'A threaded reply', parentId: 'c-1', createdAt: '2026-01-05T00:00:00.000Z' } as FeedItem,
    ];
    const rootBodies = () => screen.queryAllByText(/Root comment|A threaded reply/).map((el) => el.textContent);
    const mountWith = (feed: unknown) =>
      render(
        <DiscussionContextProvider items={withReply as any} loading={false} {...handlers}>
          <RecordChatterRenderer schema={{ position: 'bottom', feed } as any} />
        </DiscussionContextProvider>,
      );

    mountWith({ ...AFFORDANCES, enableThreading: true });
    expect(rootBodies()).toEqual(['Root comment']);

    cleanup();
    mountWith({ ...AFFORDANCES, enableThreading: false });
    expect(rootBodies()).toEqual(['Root comment', 'A threaded reply']);
  });
});

describe('`showSubscriptionToggle` moves `RecordActivityTimeline`, the component `feed` is handed to', () => {
  const subscription: RecordSubscription = { recordId: 'r-1', subscribed: false };
  const SUBSCRIPTION_ON: RecordActivityComponentProps = { showSubscriptionToggle: true };
  const SUBSCRIPTION_OFF: RecordActivityComponentProps = { showSubscriptionToggle: false };

  it('renders the bell when the member is on AND the host supplies a subscription', () => {
    render(<RecordActivityTimeline items={ITEMS} config={SUBSCRIPTION_ON} subscription={subscription} />);
    expect(screen.getByRole('button', { name: SUBSCRIBE })).toBeTruthy();

    cleanup();
    render(<RecordActivityTimeline items={ITEMS} config={SUBSCRIPTION_OFF} subscription={subscription} />);
    expect(screen.queryByRole('button', { name: SUBSCRIBE })).toBeNull();
    // CONTROL — the timeline still rendered, so "no bell" is not "no timeline".
    expect(screen.getByText('Root comment')).toBeTruthy();
  });

  it('CONTROL — the same member with NO subscription renders no bell, which is why the chatter path shows none', () => {
    // `RecordChatterRenderer` never passes `subscription`, so this is the leg
    // that explains the gap without pinning the member as dead: the member is
    // live (case above), the HOST input is what is missing here.
    render(<RecordActivityTimeline items={ITEMS} config={SUBSCRIPTION_ON} />);
    expect(screen.queryByRole('button', { name: SUBSCRIBE })).toBeNull();
    expect(screen.getByText('Root comment')).toBeTruthy();
  });
});

describe('a FILTER member authored inside `feed` changes nothing (objectui#8934)', () => {
  it.each(BLOCK_NAMES)('%s: the rendered panel is identical with and without every filter member', (_blockName) => {
    const { container: withoutFilters } = mount({ ...AFFORDANCES });
    const baselineSignature = panelSignature();
    const baselineText = withoutFilters.textContent;

    cleanup();
    const { container: withFilters } = mount({ ...AFFORDANCES, ...FILTERS });

    expect(panelSignature()).toEqual(baselineSignature);
    expect(withFilters.textContent).toBe(baselineText);

    // Named rather than left to the comparison: every row a filter would have
    // removed is still on screen, and the header still counts all three.
    expect(screen.getByText('Root comment')).toBeTruthy();    // types: ['comment'] kept this one
    expect(screen.getByText('Follow up call')).toBeTruthy();  // types would have dropped it
    expect(screen.getByText(/Stage/)).toBeTruthy();           // unifiedTimeline: false would have
    expect(baselineSignature.heading).toContain('(3)');       // limit: 1 would have made it (1)
  });

  it.each(BLOCK_NAMES)('%s: CONTROL — an AFFORDANCE member in the same authored object DOES move it', (_blockName) => {
    // Without this leg the case above is satisfiable by a harness that never
    // reads `feed` at all: the filters would "change nothing" because nothing
    // in `feed` changes anything.
    const { container: on } = mount({ ...AFFORDANCES, ...FILTERS, enableReactions: true });
    const withReactions = panelSignature();
    const textWithReactions = on.textContent;
    expect(withReactions.reactionButtons).toBeGreaterThan(0);

    cleanup();
    const { container: off } = mount({ ...AFFORDANCES, ...FILTERS, enableReactions: false });
    expect(panelSignature()).not.toEqual(withReactions);
    expect(screen.queryAllByRole('button', { name: ADD_REACTION })).toHaveLength(0);

    // ⚠️ MEASURED, and the reason `panelSignature` exists: this member moves
    // the DOM without moving one byte of its TEXT — the reaction affordance is
    // an icon-only button. A text-only instrument would have reported "nothing
    // changed" here, which is exactly the verdict the case above reports about
    // the filter members, so the two must not share that instrument alone.
    expect(off.textContent).toBe(textWithReactions);
  });

  it('FIRING CONTROL — the same filter values DO narrow the same fixture through `applyFeedConfig`', () => {
    // `applyFeedConfig` is the pipeline `record:activity` runs on every render,
    // and its only non-test call site is `record-activity.tsx`. Running the
    // fixture through it proves the values above are well-formed and effective,
    // so the zero on the chatter path is about the PATH.
    const ids = (feed: { items: FeedItem[] }) => feed.items.map((i) => i.id);

    // Baseline: no filters at all. `showCompleted` defaults false, so the task
    // is already out; the comment and the field change survive.
    expect(ids(applyFeedConfig(ITEMS, {}, 50))).toEqual(['c-1', 'f-1']);

    // `unifiedTimeline: false` drops the field change, `showCompleted: true`
    // keeps the task, and `types: ['comment']` then keeps only the comment.
    expect(ids(applyFeedConfig(ITEMS, FILTERS, 50))).toEqual(['c-1']);

    // Each member on its own, so a single one going inert cannot hide behind
    // the combination.
    expect(ids(applyFeedConfig(ITEMS, { showCompleted: true }, 50))).toEqual(['c-1', 'f-1', 't-1']);
    expect(ids(applyFeedConfig(ITEMS, { unifiedTimeline: false }, 50))).toEqual(['c-1']);
    expect(ids(applyFeedConfig(ITEMS, { types: ['task'], showCompleted: true }, 50))).toEqual(['t-1']);
    // `limit` reaches the pipeline as the page window (`record-activity.tsx`
    // reads the member and passes it as `pageSize`).
    expect(ids(applyFeedConfig(ITEMS, {}, 1))).toEqual(['f-1']);
  });
});

describe('the declaration behind the description (objectui#8934)', () => {
  it('both names share ONE `inputs` array, so the description is authored once', () => {
    const chatter = ComponentRegistry.getConfig('record:chatter');
    const discussion = ComponentRegistry.getConfig('record:discussion');
    expect(chatter?.inputs).toBeTruthy();
    // Same ARRAY, not merely equal contents: duplicating it to "fix them
    // separately" is what this pin exists to catch.
    expect(discussion?.inputs).toBe(chatter?.inputs);
  });

  it('`feed` is a bare `type: object` — there is no member list on it to narrow', () => {
    // The measurement behind the ruling's route: `ComponentInput`'s only slot
    // one level down is `of`, the coarse KIND of an ARRAY's elements or of a
    // MAP's values, and `feed` is a fixed-key record rather than a map. So the
    // description is the only place the member set can be stated, and it is.
    const feed = ComponentRegistry.getConfig('record:chatter')?.inputs?.find((i: ComponentInput) => i.name === 'feed');
    expect(feed).toBeTruthy();
    expect(feed?.type).toBe('object');
    expect(feed?.of).toBeUndefined();
    // CONTROL — the instrument reads `of` where a sibling registration declares
    // one, so `undefined` above is a reading rather than a blind lookup.
    const activityTypes = ComponentRegistry.getConfig('record:activity')?.inputs?.find((i: ComponentInput) => i.name === 'types');
    expect(activityTypes?.of).toBe('string');
  });
});
