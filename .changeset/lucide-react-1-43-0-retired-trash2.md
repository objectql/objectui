---
'@object-ui/plugin-detail': patch
'@object-ui/components': patch
'@object-ui/types': patch
'@object-ui/cli': patch
---

Move `lucide-react` from `^1.31.0` to `^1.43.0` and repair the one spelling the jump
retires, so the delete affordances that resolve their icon from a STRING keep drawing a
glyph.

Measured against the installed artifact rather than the upstream changelog. Across the
whole 1.31.0 to 1.43.0 jump lucide removes **zero** public names — 6072 to 6230 names in
`lucide-react`'s type surface with none dropped, 6068 to 6224 runtime exports with none
dropped, and nothing at all removed from `lucide-react/dynamic.mjs`. Every one of the 333
value names and the one type name this repository imports resolves in both versions
(controls: `Trash` resolves in both, a bogus name resolves in neither). So no import
breaks and no type breaks.

Exactly one key leaves the runtime `icons` record: `Trash2`. lucide retired it in favour
of `trash`, and it survives as a DEPRECATED EXPORT of the same object — which is why
nothing goes red on the compiler or on a component render, and only STRING lookups
through `renderers/action/resolve-icon.ts` are affected, because those read record
MEMBERSHIP. Repaired at all four sites that reach that resolver, three schema-catalog
documents and `DetailView`'s system delete action.

What a user sees change:

- `DetailView`'s delete action (`icon: 'trash-2'` to `'trash'`) draws its icon again
  instead of a label with nothing beside it. The glyph is unchanged: lucide 1.43.0's
  `trash` icon node is byte-identical to 1.31.0's `trash-2` icon node.
- Icons that lucide has since renamed now carry an extra class per retired alias — a
  spinner renders `class="lucide lucide-loader-circle lucide-loader-2 ..."`. This is
  additive (248 of 1818 icon modules carry an alias), so a `.lucide-loader-circle`
  selector still matches; a selector asserting the exact, complete class string does not.
- The workspace stops installing two copies of the icon library. `main` resolves
  `lucide-react` twice — 1.31.0 for this workspace and 1.35.0 for `fumadocs-ui` — and
  both collapse onto 1.43.0 here.
