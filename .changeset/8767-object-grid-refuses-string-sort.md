---
'@object-ui/plugin-grid': minor
---

`object-grid` REFUSES the retired string `sort` clause at its own read site
(objectui#8767, maintainer ruling 2026-09-10 — route C).

**Breaking, deliberately.** A `sort: "name desc"` on an `object-grid` node no
longer reaches `$orderby`. It is reported once per spelling with the diagnostic
objectui#8221 / PR #8758 already ship — the message names the offending value
and prescribes the array form — and the query goes out carrying no ordering at
all, exactly as the same key already behaves on `object-view`.

**Why it was still lowering.** The #8221 ruling retired the legacy string
clause: one spelling, the array, everywhere. PR #8758 narrowed the shared sink
`convertSortToQueryParams` and every declaration that published a string arm,
but `ObjectGrid` never used that sink — it reads `schema.sort` and lowers it
with private code, so a bare grid went on honouring at runtime a spelling
`object-view` refuses. One key, two meanings, chosen by which block you are on
— which is the per-block divergence the ruling declined by name when it
rejected option A.

**Migration.** Write the array: `sort: [{ field: 'name', order: 'desc' }]`
(`order` is optional and means `'asc'`). That is the only spelling
`ObjectGridSchema.sort` has declared since #8221, the only one the registered
`sort` input publishes, and the only one `@objectstack/spec` accepts — so
type-checked metadata is already on it, and only untyped JSON or a stored
`sys_metadata` row can still carry the string.

**What is deliberately unchanged.** The wire shape. The array arm still lowers
to this block's own `"field order[, field order]"` join string, and the export
path and the header-arrow reader `parseSchemaSort` still read the key exactly as
before. Routing the whole key through the shared sink would send its
`{ field: direction }` map where every grid today sends a string; that is a
separate change with its own blast radius, and this ruling explicitly did not
take it.
