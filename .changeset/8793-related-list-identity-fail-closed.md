---
"@object-ui/plugin-detail": minor
---

fix(plugin-detail): `record:related_list` field security now fails closed on a column it cannot name

The block filters `columns` against the field-security allow-list built from
`enforceFieldSecurity` / `redactFields`. Its else-branch KEPT any entry whose
identity it could not resolve. That branch was the bypass: the block resolves a
column through `columnIdentity`, which deliberately refuses the table library's
own `accessorKey` (objectui#3104 — TanStack's column key is not ObjectStack
metadata identity), while `RelatedList` renders a column as
`accessorKey || columnIdentity(c)`. So a column authored `{ accessorKey: 'salary' }`
was named by nobody in the filter, skipped both the FLS check and the redact
list, and then painted its real values through the table's own key.

An entry the security fold cannot check is now excluded rather than kept.

**Behaviour change, deliberately narrowing.** On a related list that switches
the filter on, a column whose identity resolves to none of `field` / `name` /
`fieldName` / `key` stops rendering — including one authored purely in the
`accessorKey` spelling, and including the case where the redacted or denied
field is some other column entirely. Lists that set neither key are untouched:
the fold does not run there and `columns` is still handed down by reference.
The protocol-declared spelling for this key is a field-name string
(`RecordRelatedListProps.columns`), which resolves and is unaffected.
