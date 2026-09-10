---
'@object-ui/types': minor
---

`DetailViewSchema.related[].columns` accepts a bare field name (objectui#7997).

The member was declared `TableColumn[]`. `RelatedList.normalizeColumn` has a
dedicated bare-string branch — it resolves the name against the related object's
schema, derives the header from the field's `label` and attaches a type-aware cell
renderer — and that branch is pinned by
`RelatedList.columnIdentityAccessor.test.tsx`. So the renderer accepted two arms and
the declaration named one, and the shorter form (`columns: ['status', 'amount']`) did
not type-check for a TypeScript host even though it renders *better* than the
hand-spelled equivalent: a hand-written `header` stops following a field's label
rename, a derived one does not.

The member is now `Array<TableColumn | string>`.

**Additive. Nothing that compiled before stops compiling.** The object arm is
untouched — `TableColumn` entries, including the optional members (`width`, `align`,
`className`, …), still assign, and the `packages/plugin-detail/README.md` example is
type-checked unchanged in the new pin. Graded **minor** rather than patch on that
basis: it moves the published type surface of `@object-ui/types` and lets authors
write a shape that previously failed to compile, which is a feature-level change to
what the package accepts; and rather than **major**, because the widened member is in
*input* position for authors, so no existing author is broken by it.

⚠️ Read `columns?: Array<TableColumn | string>` as *what this renderer accepts*, not
as a protocol shape. `@objectstack/spec` declares no `DetailView` schema at all —
`DetailViewSchema` is objectui's own host-facing React view schema. The spec-bound
twin is the `record:related_list` page block, whose `columns` is `z.array(z.string())`
in the spec and `string[]` in `packages/types/src/record-components.ts`; those two were
already aligned and are **unchanged** here.

**Not changed, deliberately, and pinned so it cannot drift:** the zod mirror
(`views.zod.ts` spells this member `z.array(z.any())`, so the JSON authoring path never
refused strings — the typed path was the only one that did) and the object arm itself
(retiring it is a separate, non-additive decision).
