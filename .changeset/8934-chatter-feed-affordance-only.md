---
'@object-ui/plugin-detail': patch
---

`record:chatter.feed` / `record:discussion.feed` stop advertising four members
this path never reads (objectui#8934).

**The defect.** The nested `feed` input on both names was described as
"Activity-feed config nested inside the panel — same shape as record:activity".
It is not. `RecordChatterPanel` hands `config?.feed` straight to
`RecordActivityTimeline`, which reads exactly the five AFFORDANCE members
(`showFilterToggle`, `showCommentInput`, `enableReactions`, `enableThreading`,
`showSubscriptionToggle`) in one block. The four FILTER members of
`record:activity` — `types`, `limit`, `showCompleted`, `unifiedTimeline` — are
applied by `applyFeedConfig`, whose only non-test call site is
`record-activity.tsx`. Nothing on the chatter/discussion path reaches it, so a
filter authored inside `feed` was accepted and then discarded in silence. That
description ships to `sdui.manifest.json` and is what an AI author reads before
writing the block, so the over-promise was the authoring surface teaching a
write that could not work.

**What changed, and what deliberately did not.** The maintainer ruled on
2026-09-10 that the DESCRIPTION changes: it now names the five affordances it
carries and says the filter members belong to `record:activity`'s own inputs.
Making the sentence true the other way — running `applyFeedConfig` on the
chatter path — was refused, because it changes what shipped pages render.
**There is no runtime behaviour change here**, and no new call to
`applyFeedConfig` anywhere.

The DECLARATION is unchanged, and that is a measurement rather than an
omission: `feed` is a bare `type: 'object'` with a description and nothing
else, and `ComponentInput` has no member-list slot for a fixed-key record —
its only slot one level down, `of`, is the coarse KIND of an array's elements
or of a map's values and is explicitly "NOT a nested schema". So there was no
member list to narrow, and inventing one to have something to narrow was not
taken. The description carries the whole fix.

Both names share one `CHATTER_INPUTS` array, so the corrected text is authored
once and is byte-identical on `record:chatter` and `record:discussion`.
`record:activity`'s own eleven inputs are untouched — the four filter members
are live there.
