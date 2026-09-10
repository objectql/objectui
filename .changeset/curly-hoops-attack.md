---
---

Internal only — no package changes, so no release.

Adds a repository check, `check:doc-example-ids`, that resolves every
`<SchemaExample id="…" />` reference in `content/docs/**` against the schema
catalog's generated registry, together with its test and its own workflow. An
unknown id reaches the docs site as a throw at page render; nothing asked the
question before render. The check adds no runtime code and touches no published
package: the schema catalog is private and its lookup behaviour is unchanged.
