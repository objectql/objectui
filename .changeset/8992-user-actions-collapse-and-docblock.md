---
'@object-ui/types': patch
---

Collapse the now-redundant `UserActionsSchema` extension, and correct a docblock that
told authors an undeclared `userActions` key is silently dropped when it is refused by
name (objectui#8992).

`objectql.zod.ts`'s `UserActionsSchema` read
`stripImportedDefaults(Spec).extend({ group, hideFields, rowColor })`, an extension that
existed only because `@objectstack/spec` did not declare those three keys while
`normalizeListViewSchema` folded objectui's legacy `showGroup` / `showHideFields` /
`showColor` onto them. The protocol adopted all three in 17.3.0 (objectui#5435's
ruling), so the extension is now a second local copy of a protocol declaration — the
shape two faces start drifting from — and it collapses into the plain by-reference
re-export its own note always said it would become.

⭐ The urgent half is the docblock. It stated that `UserActionsConfigSchema` "is NOT
`.strict()`, so ... an author writing `userActions: { group: false }` had it silently
stripped — valid on parse, no effect at render". Measured against the published
artifacts of 17.0.0, 17.2.0, 17.3.0 and the resolved 17.4.0, every one of them REFUSES
an undeclared key and NAMES it (`unrecognized_keys`, one issue). A comment promising
silent tolerance in front of a loud-rejection runtime points an author — human or AI —
at a config that will fail the save gate while telling them that outcome is impossible.
`__tests__/user-actions-mirror-8992.test.ts` now pins the refusal, with firing controls
in both directions, so the sentence cannot rot back.

The accept set does not move: extended and collapsed were parsed side by side over a
33-document corpus (every declared key in both polarities, the full block, undeclared
keys, wrong types, non-objects) with an identical result — same success, same parsed
output, same refusal codes, keys and messages — and a sentinel proving the comparison
can see a difference when one exists.

⚠️ TWO THINGS ON THE PUBLISHED SURFACE DO MOVE, both confined to those three keys, and
both measured by rebuilding `packages/types/dist` on each side of the change:

1. They lose the three local `.describe()` strings the extension carried, because the
   protocol declares those keys without descriptions of its own. Nothing in this
   repository reads them, and a mirror that authors prose for a protocol key is the same
   class of local invention the import boundary (objectui#8317) removed for defaults.
2. In the emitted `objectql.zod.d.ts` the three move from `z.ZodOptional<z.ZodBoolean>`
   to `z.ZodDefault<z.ZodBoolean>` — the spec's own declaration, as the compiler sees it
   before the runtime strip. `z.input` is unchanged (`boolean | undefined` either way);
   `z.output` for these three goes from `boolean | undefined` to `boolean`. This is the
   import boundary's DELIBERATE and ruled property — `stripImportedDefaults` is typed
   `T` in, `T` out, because stripping is "a property of the PARSE, not of the
   declaration" (decision batch #90) — and it is what the OTHER EIGHT keys on this same
   object have declared all along. The extension was making three keys the odd ones out
   of an object whose eleven members behave identically at runtime; the collapse makes
   the declaration uniform. ⛔ It does not change what parses: an omitted key is still
   absent from the parsed output, measured, on all eleven.

The emitted declaration also carries `z.core.$strict` on BOTH sides of this change,
which is the compiler restating in objectui's own published artifact what the corrected
docblock now says in prose.

⚠️ The three keys are version-borne from here on. `@object-ui/types` declares
`@objectstack/spec: ^17.3.0` and that floor is now load-bearing for them — 17.2.0
declares 8 keys on this object, 17.3.0 declares 11. The extension used to carry the
three locally whatever version resolved; it no longer does.
