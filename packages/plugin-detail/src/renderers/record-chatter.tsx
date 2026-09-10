/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * `record:chatter` / `record:discussion` — Salesforce-style social feed for
 * the current record. The renderer is a thin wrapper around
 * `RecordChatterPanel`; it pulls feed items + mutation handlers from the
 * surrounding `DiscussionContext` (mounted by `RecordDetailView` or any
 * other host shell that owns the feed). When no DiscussionContext is
 * present the panel renders an empty feed so the page still composes
 * correctly in standalone previews.
 *
 * ## `feed` is the full `record:activity` shape, and it is applied HERE
 *
 * `@objectstack/spec` declares `RecordChatterProps.feed:
 * RecordActivityProps.optional()` (`component.zod.ts:1366`), bound to BOTH
 * names (`:2948` `record:chatter`, `:2962` `record:discussion`), and
 * `RecordActivityProps` carries the filter members `types` / `limit` /
 * `showCompleted` / `unifiedTimeline`. This renderer used to hand
 * `discussion.items` to the panel raw, so those four were accepted by the spec,
 * declared in the registration, and then discarded in silence — an
 * IMPLEMENTATION GAP, not a narrower contract (objectui#8934).
 *
 * The pipeline below is `record-activity.tsx:219`'s, not a second convention:
 * the same `applyFeedConfig(sourceItems, { types, showCompleted,
 * unifiedTimeline }, pageSize)` call, and the same reading of `limit` as a PAGE
 * SIZE that "Load more" grows by, rather than a hard cap.
 *
 * ⚠️ Consequences an author sees, because the spec's DEFAULTS now apply here
 * too: `showCompleted` defaults false, so completed activities (feed type
 * `task`) are hidden unless asked for; and an unauthored `limit` is
 * `DEFAULT_ACTIVITY_LIMIT` (20), so a longer feed pages instead of rendering
 * whole. Both are `record:activity`'s behaviour, which is what the protocol
 * says this key is.
 *
 * ⚠️ NOT closed by this pipeline, and not claimed to be: `filterMode` and
 * `enableMentions` are also declared on `RecordActivityProps` and are still
 * unread on this path — `RecordActivityTimeline` takes `filterMode` as a
 * component PROP (`:187`, `:212`), never off `config`, and the chatter path's
 * mentions come from the host context's `mentionSuggestions`. `applyFeedConfig`
 * covers the four filter members only. Tracked as objectui#8968.
 */

import React from 'react';
import { useRecordContext, useDiscussionContext } from '@object-ui/react';
import type { FeedItem, RecordActivityComponentProps, RecordChatterComponentProps } from '@object-ui/types';
import { RecordChatterPanel } from '../RecordChatterPanel';
import { applyFeedConfig, normalizeLimit } from './recordActivityFeed';

const splitDesigner = (props: Record<string, any>) => {
  const { 'data-obj-id': id, 'data-obj-type': type, style, ...rest } = props || {};
  return { designer: { 'data-obj-id': id, 'data-obj-type': type, style }, rest };
};

export interface RecordChatterRendererProps {
  schema?: RecordChatterComponentProps & Record<string, any>;
  className?: string;
  [k: string]: any;
}

export const RecordChatterRenderer: React.FC<RecordChatterRendererProps> = ({
  schema = {} as any,
  className,
  ...props
}) => {
  useRecordContext();
  const discussion = useDiscussionContext();
  const { designer } = splitDesigner(props);

  // Merge schema-supplied config (position, feed sub-config) with the same
  // three AFFORDANCE defaults the host's auto-appended panel hard-codes
  // (`@object-ui/app-shell` `RecordDetailView.tsx:2549`).
  //
  // ⚠️ The affordance defaults still match. The rendered FEED no longer does,
  // and this comment used to claim it did — "so an author-placed
  // `record:discussion` looks identical to the fallback the host injects when
  // no component is present". That sentence was true until objectui#8934 and
  // is false now: this path runs `applyFeedConfig` below, so the protocol's
  // `feed` defaults apply here (completed activities hidden, a 20-item page
  // window with "Load more"), while the fallback hands its rows to
  // `RecordChatterPanel` raw — no pipeline, no paging. Measured on the same
  // feed: three comments plus one `task` row renders four rows there and
  // three here; twenty-five comments renders twenty-five there and twenty
  // plus a "Load more" here. Tracked as objectui#8983.
  // ⛔ Do not restore the old sentence without closing that divergence first.
  const config = {
    position: 'bottom',
    collapsible: false,
    feed: {
      enableReactions: true,
      enableThreading: true,
      showCommentInput: true,
    },
    ...(schema as any),
  } as any;

  // The nested `feed` IS `RecordActivityProps` (spec `component.zod.ts:1366`),
  // so its filter members are applied on this path with the same pipeline and
  // the same call shape `record:activity` uses at `record-activity.tsx:219`.
  const feed = config.feed as RecordActivityComponentProps | undefined;

  // Page window. Starts at `limit` and grows by `limit` per "Load more", so the
  // authored `limit` is a page size (the spec's wording) rather than a hard cap
  // — the same reading, and the same `extraPages`-is-the-state shape, as
  // `record-activity.tsx:159-160`.
  const [extraPages, setExtraPages] = React.useState(0);
  const limit = normalizeLimit(feed?.limit);
  const pageSize = limit * (extraPages + 1);

  const discussionItems = discussion?.items as FeedItem[] | undefined;
  const applied = React.useMemo(
    () =>
      applyFeedConfig(
        discussionItems ?? [],
        {
          types: feed?.types,
          showCompleted: feed?.showCompleted,
          unifiedTimeline: feed?.unifiedTimeline,
        },
        pageSize,
      ),
    [discussionItems, feed?.types, feed?.showCompleted, feed?.unifiedTimeline, pageSize],
  );

  // `record-activity.tsx:233` writes this with an empty dependency list. The
  // setter is named here instead — it is stable, so the two are equivalent at
  // runtime — because with `[]` the React Compiler cannot preserve the manual
  // memoization (it infers `setExtraPages`) and reports `Compilation Skipped`
  // on this component. One deviation, in a dependency array, to keep this
  // component compiled; the pipeline call shape below is copied unchanged.
  const handleLoadMore = React.useCallback(() => {
    setExtraPages((n) => n + 1);
  }, [setExtraPages]);

  return (
    <div className={className} {...designer}>
      <RecordChatterPanel
        items={applied.items}
        config={config}
        // "Load more" grows the window by `limit`. Without this pair an
        // authored `limit` would be a silent truncation of the feed instead of
        // the page size the spec says it is.
        hasMore={applied.hasMore}
        onLoadMore={handleLoadMore}
        // The host that owns the fetch produces this (app-shell
        // `RecordDetailView`); without it a hand-placed `record:chatter` /
        // `record:discussion` spends the whole fetch claiming the record has
        // no comments (objectui#3209 — #3205 added the render branch, this
        // is the signal that reaches it). `record:activity` reads the same
        // field off the same context; no second idiom.
        loading={discussion?.loading}
        onAddComment={discussion?.onAddComment as any}
        onAddReply={discussion?.onAddReply as any}
        onToggleReaction={discussion?.onToggleReaction as any}
        mentionSuggestions={discussion?.mentionSuggestions as any}
        onUploadAttachments={discussion?.onUploadAttachments as any}
      />
    </div>
  );
};

export default RecordChatterRenderer;
