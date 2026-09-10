---
'@object-ui/types': minor
---

`ObjectKanbanSchema.groupBy` is now OPTIONAL on both published faces (objectui#8990).

`@objectstack/spec` declares the key optional — `groupBy: z.string().optional()` on
`ObjectKanbanPropsSchema` — while this package required it on the TypeScript
declaration (`packages/types/src/objectql.ts`) and on the Zod mirror
(`packages/types/src/zod/objectql.zod.ts`). objectui was therefore **narrower than the
protocol** on a published key: `ObjectKanbanSchema.safeParse` and `safeValidateSchema`
refused an `object-kanban` node the protocol accepts, and such a node could not be
annotated with its own type.

**This is a widening: nothing that validated before stops validating.** An authored
`groupBy` is still typed and still enforced — a non-string lane key is refused exactly
as it was. Only its absence is newly admitted.

The requiredness was refuted by this repository's own corpus, not only by the protocol.
objectui#7322 justified it as "every documented and tested `object-kanban` node authors
this key", and objectui#7780 recorded two producers excluded from that count; both are
still live:

- `content/docs/utilities/data-objectstack.mdx` documents an `object-kanban` node that
  is exactly `{ type, dataSource }`, with no `groupBy`;
- `packages/plugin-list/src/ListView.tsx` **generates** the node as
  `groupBy: laneField`, where `laneField` ends in an explicit `|| undefined`, so a view
  that declares no lane field emits `groupBy: undefined` at runtime.

**What a lane-less board does, measured rather than assumed.** Every `schema.groupBy`
read in `ObjectKanban.tsx` is a guarded early-return, so the board degrades instead of
breaking: with no lane key and no `columns` it renders an empty board; with bare-string
`columns` it draws those lanes, titled by the raw strings; card moves are inert
(`persistCardMove` and the move callback both open `if (!groupBy) return`). ⚠️ Every
lane-less board holds **zero cards** — `bucketCardsIntoColumns` returns before
distributing records when there is no lane key — so omitting `groupBy` is not a way to
configure a board, it is a board that groups by nothing.

**Side effect worth knowing.** The protocol's bare-string `columns` arm, admitted by
objectui#8913 and recorded there as unreachable, is now reachable: it fires only under
`if (!schema.groupBy)`, which no schema-valid document could satisfy while the key was
required. Pinned with a firing control in
`packages/plugin-kanban/src/__tests__/laneLessBoard-8990.test.tsx`.
