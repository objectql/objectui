---
'@object-ui/types': minor
---

Declare `columns` on the `object-kanban` face — the swimlane vocabulary the board
reads and neither published face named (objectui#8913).

**`minor`, and the level is reasoned rather than copied.** This is not a `patch`:
`@object-ui/types/zod` is a published validator and its **accept set narrows**. A
document whose `columns` was previously admitted unexamined — `columns: "todo"`,
`columns: [42]`, a lane with no `title`, a lane card with no `title` — is now
refused by `ObjectKanbanSchema.safeParse` and by `safeValidateSchema`, so a
consumer's own validation can go from green to red on bytes they did not change.
It is not a `major` either: this repository's fixed group tracks the
`@objectstack` major (AGENTS.md §版本号策略), so breaking semantics ship as
`minor` with the semantics spelled out — which is what this entry is.

**What moved.** `ObjectKanbanSchema` gains `columns` on both halves that move
together — the TypeScript interface (`objectql.ts`) and its Zod mirror
(`zod/objectql.zod.ts`). Retiring the bare `kanban` node type key (objectui#8802)
removed the only face that judged a lane, and `object-kanban` had never declared
the key, so it rode `BaseSchema`'s `[key: string]: any` / `.passthrough()`:
read by the renderer at three sites, named by no published face.

**Declaring here can only narrow.** On a face that already carries an index
signature there is no wider state to reach — the value was already `any` — so this
adds validation where there was none and mints no new authoring surface.

**The element is the protocol's union, not this repository's runtime lane type.**
`@objectstack/spec` declares `ObjectKanbanPropsSchema.columns` as
`z.array(z.unknown()).optional()` and states the element shape in its `describe`
prose: swimlane definitions, `{ id, title }` per `groupBy` value, **or bare value
strings**. Both arms are admitted here, and on the object arm **`cards` is
optional**. The alternative — reusing `KanbanColumn`, whose `cards` is required —
was measured and rejected: it is the RUNTIME lane (`bucketCardsIntoColumns` fills
`cards` before either board implementation sees one), and as the authoring element
it would have refused the protocol's own gate-validated `{ id, title }` example,
the lanes the renderer materializes from a picklist, and this repository's own
typed board fixtures.

**What is judged again.** A lane is a bare string or an object with `id`
(string or number — the renderer coerces with `String()`) and `title`, optionally
carrying `cards`, `limit`, `className` and `collapsed` — exactly the members the
two board implementations read. When a lane carries `cards`, each card is judged
by the one card authority (`KanbanCardSchema`), which is what restores
objectui#6939's finding: **a card with no `title` is refused again**.

**What is deliberately NOT judged.** `cards` is not required (a swimlane does not
carry its own cards), so an undeclared lane key such as the retired `items`
spelling is accepted and dropped rather than refused — the strip posture
`KanbanColumn`'s own mirror already carries. Narrowing below the protocol's union
is an `@objectstack/spec` change, not a local one.

**Migration.** Boards authored the way the docs and the schema catalog teach them
need no change. A board whose `columns` carried a shape nothing could render —
a non-array, a non-lane element, a lane missing `id`/`title`, a card missing
`id`/`title` — now reports instead of validating silently and rendering an empty
or mis-bucketed lane.
