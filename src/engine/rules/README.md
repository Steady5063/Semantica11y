# Rule Reference

This folder contains the default rule implementations used by `RuleEngine`.
Each file exports one rule object. Some exported rules perform several related
checks; those are called out under the rule file.

Default rule order is defined in `../definitions.js`.

## `aria-landmarks.js`

Exports: `ariaLandmarksRule`
Rule id: `aria-landmarks`
Severity: `warning`

Checks `div` elements with ARIA landmark roles that should usually be native
landmark elements.

Covered roles:
- `role="banner"` suggests `<header>`
- `role="contentinfo"` suggests `<footer>`
- `role="navigation"` suggests `<nav>`
- `role="main"` suggests `<main>`
- `role="complementary"` suggests `<aside>`
- `role="article"` suggests `<article>`
- `role="region"` suggests `<section>`

## `missing-form-labels.js`

Exports: `missingFormLabelsRule`
Rule id: `missing-form-labels`
Severity: `error`

Checks `input`, `textarea`, and `select` elements for an accessible label.

Passes when:
- The control is a hidden input.
- The control has an `id` matched by `label[for]`.
- The control has `aria-label`.
- The control has `aria-labelledby`.

Fails when a visible form control has none of those label sources.

## `heading-hierarchy.js`

Exports: `headingHierarchyRule`
Rule id: `heading-hierarchy`
Severity: `warning`

Checks document heading structure.

Individual checks:
- Missing page `<h1>`: warns when the document has no `h1`.
- Skipped heading levels: warns when a heading jumps by more than one level
  after a previous heading, such as `<h1>` followed by `<h3>`.

## `aria-actions.js`

Exports: `ariaActionsRule`
Rule id: `aria-actions`
Severity: `warning`

Checks elements with ARIA action roles that should use native interactive
elements when possible.

Covered roles:
- `role="button"` suggests `<button>`
- `role="checkbox"` suggests `<input type="checkbox">`
- `role="link"` suggests `<a>`
- `role="textbox"` suggests `<input>` or `<textarea>`

Individual checks:
- Non-native action role usage: warns when a non-semantic element uses one of
  the covered action roles.
- Mismatched native action role: warns when a native interactive element has a
  conflicting ARIA action role, such as an anchor with `role="button"`.

Passes when the element already matches the native semantic element for that
role.

## `aria-structure.js`

Exports: `ariaStructureRule`
Rule id: `aria-structure`
Severity: `warning`

Checks elements with ARIA structure roles that should use native semantic
elements when possible.

Role mappings live in `../aria-structure-role-mappings.js`.

Covered roles:
- `role="article"` suggests `<article>`
- `role="blockquote"` suggests `<blockquote>`
- `role="caption"` suggests `<caption>`
- `role="cell"` suggests `<td>`
- `role="code"` suggests `<code>`
- `role="columnheader"` suggests `<th scope="col">`
- `role="definition"` suggests `<dfn>`
- `role="deletion"` suggests `<del>`
- `role="emphasis"` suggests `<em>`
- `role="figure"` suggests `<figure>`
- `role="generic"` suggests a more specific semantic element or removing `role="generic"`
- `role="heading"` suggests `<h1>` through `<h6>`
- `role="img"` suggests `<img>`
- `role="list"` suggests `<ul>` or `<ol>`
- `role="listitem"` suggests `<li>`
- `role="paragraph"` suggests `<p>`
- `role="row"` suggests `<tr>`
- `role="rowgroup"` suggests `<thead>`, `<tbody>`, or `<tfoot>`
- `role="rowheader"` suggests `<th scope="row">`
- `role="separator"` suggests `<hr>`
- `role="strong"` suggests `<strong>`
- `role="subscript"` suggests `<sub>`
- `role="superscript"` suggests `<sup>`
- `role="table"` suggests `<table>`
- `role="term"` suggests `<dt>`
- `role="time"` suggests `<time>`

Passes when the element already matches the native semantic element for that
role. `generic` always reports because there is no more specific native match.

## `missing-role-action.js`

Exports: `missingRoleActionRule`
Rule id: `missing-role-action`
Severity: `warning`

Checks non-semantic elements that appear interactive but do not have native
interactive semantics or an action role.

Individual checks:
- Focusable custom action: warns for elements with `tabindex="0"` that are not
  native interactive elements and do not have an action role.
- Click-only custom action: warns for elements with `onclick` that are not
  native interactive elements and do not have an action role.

Recognized action roles are `button`, `checkbox`, `link`, and `textbox`.

Native interactive elements pass, including `button`, `select`, `textarea`,
anchors with `href`, and non-hidden inputs.

## `image-alt.js`

Exports: `imageAltRule`
Rule id: `image-alt`

Checks `img` elements for `alt` usage and conflicting ARIA labels.

Individual checks:
- Missing `alt`: reports an `error` when an image has no `alt` attribute.
- `aria-label` without `alt`: reports a `warning`.
- `aria-label` with `alt=""`: reports a `warning`.
- `aria-label` overriding `alt`: reports a `warning` when normalized
  `aria-label` text differs from normalized `alt` text.

Passes when an image has `alt` and no conflicting `aria-label`, or when
`aria-label` exactly matches the `alt` text.

## `native-label.js`

Exports: `nativeLabelRule`
Rule id: `native-label`

Checks native action and form elements with `aria-label` against their native
or visible label text.

Scanned elements:
- `button[aria-label]`
- `a[href][aria-label]`
- `input[aria-label]`
- `textarea[aria-label]`
- `select[aria-label]`

Individual checks:
- Duplicate label: reports a `warning` when `aria-label` duplicates the native
  label text.
- Conflicting label: reports an `error` when `aria-label` does not match the
  native label text.

Allowed cases:
- Elements with no native label text.
- `aria-label` values that include the native text.
- Approved helper text added after the native text, currently
  "opens in a new window" and "opens in new window".

## `missing-key-landmark.js`

Exports: `missingKeyLandmarkRule`
Rule id: `missing-key-landmark`
Severity: `suggestion`

Checks whether the page has core structure landmarks and a heading.

Individual checks:
- Missing main content landmark: passes with `<main>` or `role="main"`.
- Missing navigation landmark: passes with `<nav>` or `role="navigation"`.
- Missing footer landmark: passes with `<footer>` or `role="contentinfo"`.
- Missing page heading: passes with any `h1` through `h6`, or `role="heading"`.

This rule intentionally reports suggestions rather than errors or warnings.
