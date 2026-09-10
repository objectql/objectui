---
'@object-ui/types': patch
---

Refuse `breadcrumbs` by name on the `page` node (objectui#8871, ADR-0049 enforce-or-remove).

**Accept-set change, deliberately.** A `page` document carrying `breadcrumbs` used to parse
GREEN and render nothing. `PageNodeSchema` never declared the key and no renderer ever read
it, so the array survived purely through `BaseSchema`'s `.passthrough()`. It now fails at
parse with the remedy in the message, and the TypeScript twin is `breadcrumbs?: never`, so
`tsc` refuses it at the authoring site before anything runs.

**Why ADR-0049 and not a fresh ruling.** objectui#7926 refused `actions` on this same node
and, by its own comments, ruled on that key ONLY — its ruling is not borrowed here. What
reaches this key is the standing enforce-or-remove gate, which this repository applies to
this exact face: `packages/types/src/zod/tombstone.zod.ts`'s `retirementTombstone` is
documented as the "ADR-0049 RETIREMENT TOMBSTONE" helper and is internal to these zod
modules, 63 changesets cite the ADR, and `PageNodeSchema` already carried one of its refusal
arms one member up. objectui#7926 left this key parsing on purpose so that retiring it would
be a decision rather than an accident, and wrote a pin saying so; that pin is **flipped**,
not deleted.

**What was measured.** Zero readers, with a **point-access** probe rather than a bare word:
`\.breadcrumbs` scores 0 tree-wide (exit 1) against 10 files for `\.breadcrumb\b` as the lit
control. The bare word would have lied — it also names Sentry's own unrelated concept
(`app-shell/src/observability/sentry.ts`) and appears in two comments listing UI surfaces
(`core/src/utils/record-title.ts`, `layout/src/NavigationRenderer.tsx`), so a bare probe
reports five readers that do not exist.

Three author sites, all teaching passages in `content/docs/guide/layout.md`, and that count
**corrects objectui#7926's "1 site"**: its census filtered on `page`-TAGGED objects, and two
of the three passages carry no `type` at all — the Schema API block declared
`breadcrumbs?: Array<{ label, href }>` outright, and Best Practices §2 authored it on an
untagged fragment. No example app, catalog fixture, template or customer document writes the
key, so the refusal strands no authored document in this tree.

**Migration** — the trail is a NODE, and it already ships:

```json
{
  "type": "page",
  "title": "Acme Corporation",
  "body": [
    {
      "type": "breadcrumb",
      "items": [
        { "label": "Home", "href": "/" },
        { "label": "Customers", "href": "/customers" },
        { "label": "Acme Corporation" }
      ]
    }
  ]
}
```

`breadcrumb` is a registered renderer taking the same `{ label, href }` item shape the
retired key carried, plus `separator`, `maxItems` and a per-item `icon`. ⛔ Not the
`page:header` block's `breadcrumb`, which is **singular** and a **boolean** display toggle
rather than a list of links — the guide's own "There is no `breadcrumbs` array" passage is
about that component, and is unchanged.

**Why a refusal and not a deletion.** There was nothing to delete: the key was never in the
shape, and under `.passthrough()` an undeclared key is not refused, it is KEPT. Declaring the
refusal is what makes it audible, and what converts a write from OUTSIDE this repository —
the half no in-tree census can read — into a named refusal carrying its own remedy.

**Scope.** One key, by name; the node is **not** strict. Only 2 of the 23 passthrough-
surviving undeclared keys land on a real SDUI `page` node (`actions` and this one); the rest
belong to different declarations that merely spell `type: 'page'`. Strictness would also have
reddened a living pin — `page-app-dashboard-spec-parity.test.ts`, "the component envelope
still passes unknown renderer props through" — which stays green and is re-asserted from this
card's side.

Marked `patch` on the precedent of objectui#7926, which took `patch` for the identical shape
on this same node one release earlier. (The `ComponentInput.inputType` tombstone,
objectui#5905, took `minor` for the same helper on a different node; the closer precedent is
the one that shares the file, the node and the mechanism.)
