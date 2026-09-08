# Changelog

All notable changes to Veritheme are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

_Add entries here as you work. `npm run release` freezes this section into a
dated version block. Use the Keep a Changelog headings: Added / Changed /
Deprecated / Removed / Fixed / Security._

## [1.1.0] — 2026-09-08

### Fixed

- **Alert and Banner status colors agree across Figma and CSS.** Backgrounds
  use the intent's semantic surface, Alert outlines use its border, and Alert
  descriptions use its text color. Intent text uses a light palette step in
  dark mode so it remains readable on dark status surfaces. Banner previews
  no longer add an outline absent from the generated component.

### Added

- **Problem reports have somewhere to go.** A new page on the site takes a
  short form — what broke, where, and an optional email — and mails it
  straight through; no account and no GitHub required, with a link to the
  public issue tracker for people who prefer one. The plugin's footer links
  to that page and attaches the running build and the loaded theme to the
  URL, so a report says which version broke rather than only that something
  did.
- **The plugin opens on what it is about to generate.** The preview pane sat
  empty until a component was clicked, so "what will this produce?" cost a
  click per component. The Components step now opens on an Overview: the
  colour ramps that will land in the Colors collection, then a card per
  selected component rendering its own preview. Ticking a box updates it,
  a card opens that component full size, and an Overview button comes back.

- **MCP: `derive_theme`, `audit_contrast`, `explain_token`.** The server could
  only hand out presets; now it builds a whole theme from one brand colour on
  the same engine the wizard uses (ramp, hover/active/disabled, on-colours,
  intent states — CSS and DTCG), scores every colour pair a theme puts next to
  each other with a concrete fix for each failure, and explains what any
  token is for, what it resolves to, which palette step that is and which
  components read it — in any spelling an agent is likely to use.
- **MCP: a slot variable with a fallback is not an unknown token.** The library
  publishes per-instance slots (`var(--input-bg, hsl(var(--surface-card)))`)
  that are undefined until an instance sets them; the linter reported every one
  of them as resolving to nothing. Only a bare `var(--name)` can.

- **MCP: `validate_markup` finds are structured and cover colours.** Each
  finding carries a rule id, a line, the offending snippet and a fix where
  there is one (`format: "json"` returns them raw). Three new rules catch what
  this month's fixes were all about: a raw palette step used as a colour
  (`vt-bg-blue-600`, `var(--red-600)`, told which semantic token it wanted, by
  hover/active context), a `var(--…)` the bundle never defines, and white text
  hardcoded on a solid fill instead of the derived `--on-*`.
- **The site is linted with its own rules.** `audit:site` — part of
  `audit:all` — runs the MCP validator over every built page: components
  rebuilt from utilities, raw palette colours, tokens that resolve to nothing,
  white hardcoded on a fill, text under the floor, cards in cards, undefined
  classes (the site's own stylesheet counts). Its first run found seven
  hand-rolled tables across the examples, the design-system page teaching raw
  palette steps for the danger button's states, and two custom properties
  that never existed; all fixed.
- **MCP: `validate_markup` catches rebuilt components.** A `<table>` without
  `vt-table` and a utility-sized checkbox input are errors now — the two
  rebuilds this month's fixes kept finding by hand.
- **Visual tests cover every theme and mode.** Five pages — buttons, tables,
  cards, the colour docs, the wizard — in all three presets, light and dark.
  The component sweep only ever saw the default preset in light. The diff
  tolerance drops from 5% to 1%: 5% let a re-cut of the whole accent palette
  through green.
- **The docs show their own themes.** Light/dark and the preset picker are
  back in the top bar — a pair of small tabs for the mode and a small select
  for the preset, both at the bar's control height; the sidebar card and the
  top bar share one behaviour. Tabs and the select trigger gained a small
  size for it.
- **Design system is the first item in the top navigation**, ahead of
  Components.
- **MCP: tests for the validator and the theme tools.** Every rule has a
  failing and a passing case; the theme tools are checked end to end.

- **Interaction states are semantic tokens now, for every accent.** Only the
  brand had them; a destructive button painted its hover with `--red-600`
  straight off the raw ladder, because there was nothing else to bind to.
  `--info-*`, `--success-*`, `--warning-*` and `--error-*` now carry `hover`,
  `active` and `disabled`, derived from wherever the fill landed by the same
  step rule the brand uses — one shared rule for all five accents. They ship
  in every theme, in `theme.css`, DTCG, Tailwind, SCSS and Style Dictionary,
  and the Figma plugin resolves `error/fill-hover` the way it already resolved
  `brand/fill-hover`. The danger button reads the semantic states instead of the
  palette.
- **`/create` — a button reveals the state rows.** Fifteen extra rows are a
  wall for someone who never touches them, so the semantic table hides them
  behind *Show state colours*. The colours exist either way: the button is
  about the table, not about the system. Each row shows the step the
  derivation landed on and can be pointed at another step, which then wins
  over the derivation in every export.
- **`/create` — only a fill's own derivatives nest under it.** The tint and the
  border were indented under their intent's fill, which read as if they came
  from it; they are siblings, not variants. What nests now is the text colour
  on the fill and its three states.
- **`/create` — the token moved under the name, and its column is gone.** The
  canonical token was a column of its own next to the name it belongs to; it
  now sits under it as a second line, which frees a column in a table that had
  five.
- **`/create` — a custom token is named by what you called it.** A role added
  by hand shipped as `--intents-custom1` no matter what it was renamed to.
  The name now drives the token — call it *Surface raised* and it exports as
  `--surface-raised` — while the internal key stays put, so references,
  literals and component rebinds survive the rename and follow it. A name that
  would collide with a canonical token, an on-colour or a state takes the next
  free variant rather than overwriting anything.


- **`/create` — the semantic palette reads as a structure, not a list.** Forty
  roles ran as one flat column, so the intents in particular blurred into a
  wall. Each solid fill now owns its variants: the on-colour, the tint and the
  border sit under it, indented and joined by a connector line, the way they
  relate in the system itself. Group headings became bands rather than a line
  of small caps, and hovering a role shows a sentence saying where that colour
  actually appears — the blurbs live in one file so the wizard and the docs
  can say the same thing. The tooltip is the library's own component, so it is
  themed by the system being built.
- **`/create` — on-colours are rows in the semantic palette.** `--on-brand`
  and the four intent on-colours drive the text and icons on every solid
  fill, but the table showed only the fills, so the one token a designer
  most often wants to override was invisible and unreachable. Each on-colour
  now sits directly under its fill, and its cell names the step the derivation
  landed on — `Generic · 0` on a mid-blue brand, `Brand · 950` on a yellow one
  — with a quiet `auto` tag saying the step will follow the fill rather than
  stay put. Picking a step makes it manual, and the picker's `Auto` entry
  hands it back to the derivation, so changing the brand colour keeps moving
  the text with it. The contrast audit
  now scores the pairs as shown rather than as re-derived from the stock
  palette, the live preview paints from the same values, and step 6 lists the
  on-colours among the tokens a component reads, so they can be rebound per
  component.
- **`veritheme.init()`** — the behaviour bundle now exposes its initializer on
  `window.veritheme`, so markup added after load (a rendered preview, a fetched
  fragment, a client-side route) can be wired without a reload. Every
  component's init is idempotent, so calling it again is safe.

- **`/create` — a step-by-step design-system builder** replacing the
  single-page theme generator: colour scales (OKLCH, editable curves, any
  number of custom scales) → semantic roles → shape → spacing grid →
  typography → per-component token rebinding → hand-off. It emits the same
  `theme.css`, DTCG `tokens.json`, Tailwind, SCSS and Style Dictionary files
  the shipped themes are built with. `/themes` and `/generator` redirect here;
  the old generator remains at `/themes-legacy` (noindex, unlinked).
- **Staging** — `stage.veritheme.com`, the same build on its own root behind
  basic auth and `noindex`. `npm run deploy` targets it by default; production
  is reached only through `npm run promote`, which ships the reviewed files,
  snapshots the live site and asks for confirmation at the keyboard.
- `npm run deploy:rollback` — restores production from the snapshot taken
  before the last deploy.
- Dark-mode preview and an Undo button in the builder; colour-vision
  simulation and the WCAG audit carried over from the old generator.
- **Project component registry (MCP).** Three new tools — `list_project_components` / `get_project_component` / `register_project_component` — persist AI-built CUSTOM components (a bank card, a KPI tile) in `veritheme.project.json` at the project root, so they are reused VERBATIM across pages and sessions instead of being re-invented as near-copies. Wired into the rulebook (new §1b "one entity = one markup", core rule 9 "second occurrence = component"), `list_components` (project layer section), `search` (project hits) and the `validate_markup` logic walkthrough (duplicate-entity question).

### Changed

- **Semantic colour tokens say what they are.** `mains-*` became `foreground-*`,
  `surfaces-*` became `surface-*`, `accents-brand*` became `brand-fill*`, and the
  always-black-and-white pair moved from `constant-*` to a `generic` group
  (`--generic-white`, `--generic-black`) that references palette steps 0 and 1000
  like every other semantic token. State names follow one shape now —
  `{intent}-fill-hover|pressed|disabled`. Neutral action colours are their own
  roles (`neutral-fill`, `on-neutral`) instead of borrowing a surface, so a
  secondary button can be retuned without moving the page under it. Old names
  are gone rather than aliased: an exported theme or a DTCG document written
  before the rename is rejected by the importers with the new name to use.
- **Ten text styles, not eighteen.** Heading, Body and Label each keep SM/MD/LG,
  Caption keeps one, and a monospace Code pair ships with the code components.
  Display and Overline are gone as styles; `vt-display`, `vt-overline` and
  `vt-h1`…`vt-h6` still resolve, now as aliases onto the ten. The web, the DTCG
  export and the Figma text styles are generated from that one list, and the
  wizard lets a style be removed from a system entirely — components fall back
  to the shipped value and the export stops carrying it.
- **One size scale instead of two.** The builder had a second table for the
  primitive `--font-size-*` ladder, with its own ratio control. Nothing read
  across: every style carries its own size, so the two drifted until the page
  headline was 32px and the ladder went 24 → 30 → 36 with no 32 in it. The
  ladder is derived now, from the distinct sizes of the styles a system keeps,
  named outward from the step nearest the root size. Deleting a style takes its
  step with it unless another style shares that size, and the two can no longer
  disagree. Exported themes and `system.json` no longer carry a hand-edited
  scale; an older file's copy is ignored on import.
- **The builder's style table is grouped and named like the role table.**
  Heading, Body, Label, Caption and Code each get the band the palette roles
  have, and a row under it drops the family it would otherwise repeat: `SM`,
  not `Label/SM`. Weight is a list of the five weights the system ships rather
  than a number field that accepted 550. The line-height ratio is no longer
  printed under every input. The docs page groups the same way, from the same
  constant.
- **Roboto and Open Sans join the font list** in the builder, next to Inter.

### Fixed

- **Figma text styles follow the Desktop/Mobile device modes.** The plugin has
  a Rems collection carrying those modes, and spacing, control heights and
  corners alias into it — but text sizes were written as literal pixels, so
  switching a file to Mobile shrank the layout by 12.5% and left every text
  style at its desktop size. Font size and line height alias the matching rem
  step now. A size the builder puts between steps has none to point at and
  stays a literal, the same fallback `radius/full` uses.
- **Type sizes are picked off the rem scale, not typed as pixels.** The builder
  took any number from 8 to 160, and a size between steps has no rem variable
  for the plugin to alias, so it landed in Figma as a literal that no device
  mode can rescale. The size field is a list of rem steps now, with the pixel
  value beside it, and the step it is named for is the one the plugin binds. A
  size an imported theme brings in off the scale is kept, shown as pixels and
  flagged, rather than silently snapped to a neighbour. The Grid step is called
  Sizing & spacing, after the collection Figma already uses for it: one rem grid
  carries padding, gaps, control heights, corners and now type.
- **Reading a file back no longer drops rem-aligned sizes.** A variable holding
  an alias is not a number, and the reader only accepted numbers — so every
  radius and text size that sat correctly on the rem grid came back absent
  while off-grid ones survived. The reader follows an alias to its Desktop
  value.
- **The accent ladders sit on the neutral one.** The neutral ramp is densest at
  the top — `/50` and `/100` are a hair apart, because they are two very close
  page surfaces — while the accents stepped evenly, so every accent step read
  one rung darker than the neutral step of the same name: an accent `/50`
  matched grey `/100`, `/100` matched `/200`. Steps 50 through 300 of every
  accent now hit the neutral's own perceived lightness (within 0.004), and
  `/400` eases into the untouched `/500` anchor. From `/600` down the two
  ladders already agreed.
- **Each shipped theme has its own brand colour.** `editorial` and
  `rounded-sans` both pointed at the default blue, so three themes looked like
  one. Editorial takes a terracotta that belongs with its warm paper and
  serif, rounded-sans a violet. Both sit on the same step as the default
  brand, so the ramps generated from them line up with everything else.
- **Theme intents all sit on `/500` now.** Both themes set their intents
  literally, and the values had drifted onto different rungs — warning on
  `/400` in one, success and danger on `/600` in the other — which is what made
  their palettes look uneven next to the default. Hue and saturation are
  untouched; only lightness moved, onto the step each intent claims to be.

- **The accent ladders are cut to perceptual lightness.** `/50` was a different
  amount of light in every family — grey read at 0.985 Oklab L, orange at
  0.972, blue at 0.921 — because the ladders were spaced by HSL lightness,
  which is not what an eye reads. Steps 50 through 400 of brand, info, success,
  warning and error now hit shared perceptual targets, so a tint is a tint
  whatever the hue: the spread across accents fell from 0.05 to 0.005. Neutral
  keeps its own, lighter ladder, and every `/500` anchor is untouched, so no
  brand or intent colour moved.
- **The brand generator works in perceptual space.** Its reference curves were
  HSL lightness, so a generated ramp drifted the same way the palette did: at
  `/200` a teal brand landed on 0.896 while a blue one landed on 0.835. The
  curves are Oklab lightness and chroma now, and that spread is 0.007. A side
  effect worth knowing: the anchor snaps on perceived lightness, so a light
  colour like pure yellow anchors high on the ladder instead of at `/500` —
  which is what the palette layer already did, and the two no longer disagree.
- **The table has one source of truth: its class.** `.vt-table-wrap` sat at
  `--radius-xl` while the containers a table normally lives inside — a card,
  the example block — are rounded less, so the nesting read backwards. It now
  uses `--radius-sm`, and `.vt-api-table-wrap` moves with it. The rest of the
  table followed the same fix: row separators moved into `.vt-table` (a page
  no longer repeats a border utility on every `<tr>`), density became
  `.vt-table-compact` instead of padding utilities per cell, and the Data
  Table page — which hand-rolled the whole component out of utilities, and
  fed that markup to Storybook — now uses the classes, in its live examples,
  its code snippets, its anatomy and its class table.
- **Data Table merged into Table.** Two pages, two Storybook entries and two
  spec entries described the same component, and they had drifted apart. The
  striped and compact examples and the extra do/don't pairs moved onto the
  Table page, `/components/data-table` redirects there, and the spec keeps the
  old name as an alias so an agent asking for a data table still lands on the
  component. Row-selection checkboxes now use the checkbox component instead
  of a styled `<input>`, and the spec's own class list — what agents read —
  names the component's classes rather than a pile of utilities.
- **Story generation skips redirect stubs.** A merged component leaves a
  redirect page in `dist/`, which the generator counted as a component and
  turned into a story with nothing behind it.
- **`/create` — no Undo or Shuffle buttons.** Both are gone from the wizard by
  the owner's call. Undo still works on ⌘Z; the random brand colour is gone
  entirely, presets and the drop zone remain the ways in.
- **Toolbar buttons take the system's control label size.** `.vt-toolbar-btn`
  set no font, so it fell through to the page's 16px at weight 400 while
  every other labelled control uses `--font-size-sm` (14px) at medium.
  Text-labelled toolbar buttons now match the rest of the system; icon-only
  ones are unaffected.
- **`/create` — the live preview is a right-hand sidebar.** It was a floating
  card pinned to the bottom-right corner, so it sat on top of the work and
  covered whatever was under it. Now it is a column in the layout: it pushes
  the working area instead of overlapping it, and a Preview button next to
  Undo hides and restores it — the choice is remembered between visits, and
  narrow screens start with it closed. It slides in and out rather than
  appearing whole, and the panel is on every step — the component step
  included, where the stand shows one component large and says nothing about
  what the edit did to the rest of the system. The scale editor's backdrop
  now stops at the panel's edge, so the preview stays visible while a colour
  is being picked. The preview itself shows the same set the Figma plugin does — a
  status alert, the sign-in card and an activity feed — plus a row of atoms
  (tabs, avatars, a switch and the full badge line), so the status colours,
  the pill radius and the type ladder are all on screen at once.
- **`/create` — the component stand is live.** The preview loads the
  behaviour bundle, so components respond to real hover, press, focus and
  clicks: menus open, the accordion expands, the slider's painted track
  follows its thumb. The state chips stay for the states you cannot hold by
  hand (disabled, focus), and the tooltip demo is back to both of its
  triggers now that only the hovered one shows.
- **`/create` — component preview.** The stage header shows the component
  name as a title with its selector as a subtitle beneath it, and the preview
  state moved to the right-hand pane directly above the colours it changes.
  The state's step control now appears only for components whose state
  actually reads the brand ramp; the rest say so instead of offering a
  control that changes nothing. Previewing a state now preserves the
  library's own cascade: it marks the state with a class of the same weight
  and replays the component's rules in order, so a variant still wins where
  it would in the browser. Before, the stripped pseudo-class outweighed the
  variant and the selected chip and the current pagination page lost their
  brand fill while keeping their white label. The tooltip demo shows one
  trigger — the second only repeated it, and under the hover state both
  tooltips came out at once and collided.
- **Grey ladder reshaped to the eleven-step accent ladder.** The neutral
  scale no longer carries a `75` step: `grey-100` takes its value (96%
  lightness), `grey-200` moves to 90% and `grey-300` to 83%, so the light
  end of the ramp steps evenly instead of bunching around 88–92%. The
  default theme's light roles shift one step down the ladder
  (`surface-subtle` → `grey-100`, `surface-moderate` and `border-default`
  → `grey-200`, `surface-strong` and `border-strong` → `grey-300`).
  Hover fills are pixel-identical; moderate fills and default borders get
  ~2 points darker, contrast fills and strong borders ~5 points. Dark mode is
  untouched. Density in `/create` now runs 9–16 steps (the 12th step is
  `150`, not `75`).
- **Figma plugin 0.10.0** — the Theme Editor is no longer a second builder.
  It receives the wizard's `tokens.json` (full radius ladder, custom scales,
  custom semantic tokens, aliases, custom spacing names, font sizes, shadows)
  and now *creates* the variables it was previously skipping. Per-role colour
  inputs and Shuffle are gone; colours are shown as read-only strips with a
  link to the wizard.
- The `rating` documentation page is built from `.vt-rating` / `.vt-star`
  instead of hand-rolled utilities, so token rebinding works on it.
- CI runs the house rules, token tests, the plugin's DTCG importer, both
  builds and the audits (it was calling a script that no longer exists).

### Changed

- **The Figma plugin is one screen.** Three tabs — Theme, Components, Export —
  became a single page, because the system is designed and downloaded on the
  site and the plugin only generates it. The left column carries the system
  (wizard link, drop zone, presets, the loaded colours) and, under
  "What we'll generate", every foundation and component with its checkbox. The
  right column carries the mode switch and the preview: the themed demo, the
  ramps, then a card per selected component on the system's own surface, the
  way a Figma frame looks.

- **The preview has four views: All, Preview, Variables, Components.** All is
  the whole run; Preview is the themed sample alone; Variables lays out the
  colour ramps, both palettes, type, spacing, border width and shadows as the
  tables the site documents them with, following the foundation checkboxes;
  Components is the blocks alone.

- **A component block shows variants, not states.** The full grid was variant ×
  size × state × icon in one wall. Each block now renders one state — its
  variants and sizes — with the state buttons in the block's own header, and
  "All states" for the whole matrix. Blocks are wider and taller, and the
  colour strips left the sidebar: the Variables view shows the real thing.

- **The plugin's own lists use the library's checkbox.** A component or
  foundation row is the checkbox now: it carries the checkbox role and the
  `vt-checkbox` visual instead of a native input dressed to look like one.
  The list also lost its inner inset, so rows line up with the rest of the
  sidebar.

- **The preview is one page with three anchors.** Preview, Variables and
  Components are no longer views to switch between: the pane always shows all
  three under a large heading each, the buttons in the top bar scroll to a
  heading, and whichever section sits under the top edge holds the highlight
  — scroll past the demo and "Variables" lights up. "All" went with it.

- **One palette table, both modes.** Light Palette and Dark Palette were two
  blocks of cards; they are one table now, the wizard's — role, light, dark,
  purpose — with a swatch and the step each side resolves to. Rows are named
  the way the wizard names them, "Primary" under Mains rather than the token,
  and a literal colour shows its value instead of "raw value". Either
  foundation checkbox keeps it. The Variables and Components headings sit
  56px below the section before them. Role names are regular weight, group
  names 14px with room above, and the ramp swatches are 30% shorter. The
  sidebar's "What we'll generate" heading is gone — the search field and the
  list say that already; the rule under the presets still separates them. The
  wizard card now holds the whole story of where a system comes from: build it
  in the wizard, drop it here, or start from a preset. The line repeating that
  colour and shape are set in the wizard went with them. The card is
  `radius-xl` under a `shadow-lg` with 16px of padding, its title set in
  Heading/H5 and its text in Body/SM, and the button and drop zone inside it
  sit at `radius-sm` — the strict concentric value there is square. The divider above the
  search is gone — the card already separates the two halves — and the search
  keeps 8px under it. The
  drop zone sits inside the wizard card, under its button, where the same
  sentence sends you. Blocks take the system's own card surface and
  follow its mode, so the pane is dark when the system is.

- **Rows that read as lists, and a chip with its states.** Breadcrumb,
  Pagination and Tabs put each variant on its own line. A chip is one element
  of a picker, so its block shows every state side by side and keeps only the
  size dropdown. Number Input read its `disabled` flag as a second variant;
  it is a state, and now sits behind the state dropdown like everywhere
  else. In the sidebar, "Deselect All" is gone and the category labels line
  up with the boxes.

- **Colour scales look the same in the plugin and on the canvas as on the
  site.** A family heading with its `--prefix-*`, a strip of equal swatches
  the steps underneath, no stroke on the swatch — the docs page's layout,
  now in the plugin's Variables view and in the Colors frame Figma generates.
  The hex captions are gone: the step is the name the variable goes by. The
  border-width tiles stroke in the system's strong border rather than black,
  and display-size type samples no longer lose their descenders.

- **A row in the list scrolls to its block; the checkbox decides.** Clicking a
  component or foundation row brings its block into view, switching to the
  view that shows it if need be and lighting it for a moment. Only the box
  itself includes or excludes — it carries the checkbox role and its own
  keyboard handling. The wizard card is rounder (radius-2xl) and its button
  keeps the library's own corner, which is what makes the two concentric.

- **A block says a thing once.** Some previews carry their own heading and
  blurb, which under the block's own title said it twice — "Icons · Lucide
  icon set." over "Lucide Icons · 36 stroke-based icons from Lucide." The
  block's header stands; the preview keeps only the subsection names that add
  something ("Utility").

- **A block never clips what it shows.** A component's shadow reaches past its
  own box, and the block used to cut it off — the shadow is a token the block
  exists to show. Blocks have no height cap and no inner scrollbar either, so
  the icon set lays out in full and short components stop leaving a gap under
  themselves. Concentric corners checked across the panel: the only offender
  was the select's items, 6px inside a 9px dropdown with 4px of padding.

- **Three dropdowns pick what a block shows: type, size, state.** They replace
  the state chips and the "All states" escape hatch — a block is one slice of a
  component, and the whole grid belongs on the canvas. Defaults are type "all",
  size MD, state Default, kept per component. A dropdown appears only when it
  is a real choice: a tooltip has only placements and a toast only types, so
  those blocks show every value and no control at all. The row spells out
  types only — a select at four sizes is the same select four times, so size
  and state always live in a dropdown, even when size is all a component has. The controls are the design system's own select. The preview no
  longer sits in a frame of its own inside the block's frame.

- **The plugin's own chrome now passes the rules it ships.** Checked with the
  MCP server's linter against the running panel: one primary action per view
  (the wizard link is bordered, Generate is primary), icon-only controls carry
  a name, no duplicate ids, and no interface text under 12px — the floor the
  site has always had and the plugin never did. Preview content keeps its own
  scale and its literal colours, the same exception the site grants its colour
  documentation. 125 duplicated CSS rules and the last of the theme editor's
  styles are gone with it.

- **A component block shows what the docs show.** The block used to carry the
  whole variant × size grid with its row and column headings; it now renders
  the component's variants at one size — LG where there is one — unlabelled,
  the way the site presents them. Components whose only axis is size show
  their sizes instead. "All states" still returns the full matrix. A plain
  button no longer draws icon slots it was never asked for: Icon=True is a
  separate variant with its own renderer.

- **Sizing & Spacing and Border Width read like the canvas.** Each spacing step
  draws a block as wide as its value, next to the step, the pixels and the rem
  — the numbers alone said nothing about the rhythm. Border width puts the
  stroke on the tile, the way the shadow tiles carry their shadow, and the
  shadow tiles gained a hairline so they read on a white block.

- **The plugin looks like the docs.** The icon rail is gone and the mark sits
  next to the title, which now says what the project is called. Every part of
  the preview is a card — name, one line of what it is, a rule, then the
  content — and component blocks run down the pane one after another at full
  width instead of sitting in a cramped grid. Wide content scrolls inside its
  own block, so the pane itself never scrolls sideways. Sizing & Spacing and
  Border Width print their values and nothing else: the bars and hairlines
  were decoration, and the 0.5px one was never visible anyway. Component
  blocks caption themselves from the same one-line descriptions the docs and
  the MCP server use.

- **Nothing to drill into.** Clicking a component used to open a page of its
  own; the blocks are the preview now, so a row in the list only includes or
  excludes it, and the whole sidebar scrolls as one column.

### Removed

- **"Clear file" and the build stamp are out of the plugin footer.** A single
  click that wipes every variable, style and canvas frame in the file does not
  belong next to Generate in a published plugin, and the stamp only ever
  answered a question we had while developing. The footer now carries one link:
  Report a problem. Both handlers stay in the code behind null checks, so
  either can come back by restoring its markup — and the build still travels
  with every report, read from the bundle rather than from the removed element.

- **The plugin's Export tab.** Downloads (kit, CSS + JS, tokens.json) come from
  the wizard on the site, which is where the system is built; the plugin's zip
  encoder and download buttons went with it.

- **The theme editor is gone from the Figma plugin.** The system is designed in
  the wizard on the site; the plugin's job is to generate it. Font picker,
  border-width chips, radius sliders, spacing scale, per-role colour pickers,
  the colour-picker popup, Shuffle and Reset are all removed, along with the
  handlers and CSS behind them. The Design system step keeps what a designer
  needs before pressing Generate: the drop zone, the presets, a light/dark
  toggle, read-only colour strips and the live preview.

- `--grey-75` and the `vt-*-grey-75` utilities. Use `grey-100` — the same
  colour.

### Fixed

- **Two exports disagreed on the disabled brand in dark mode.** `buildThemeCss`
  passes the mode down and takes the deep step (`213 70% 21%`); the DTCG path
  and the Tailwind / SCSS / Style-Dictionary path both called the ladder
  without one and shipped the pale light step (`213 60% 89%`). All three now
  resolve the same way, so a theme means one thing whichever file you read.

- **The wizard's preview ignored a hand-picked brand state.** `systemVars()`
  wrote the chosen colour and then overwrote it with the derived one, so
  picking a red hover left the canvas blue while the downloaded CSS was red.
  The ramp steps still come from the ladder; the three state variables now
  defer to a manual choice, the way the on-colours beside them already did.

- **A quote in a combobox label broke removing its tag.** The label went
  straight into an attribute selector, so `12" screen` threw a SyntaxError on
  deselect: the tick came off, the tag stayed. The tag is found by comparing
  attribute values instead.

- **A disabled control could let focus escape a dialog.** The focus trap
  collected everything matching its selector, disabled and hidden included,
  so when the last match could not take focus, Tab walked out of the modal.
  It now counts only what can actually be focused.

- **Handlers called from inline `onclick` are pinned to `window`.** In the
  shipped bundle the component files are concatenated at top level, where a
  function declaration is already global — but `dialog.js`, `combobox.js` and
  `toast.js` pinned theirs explicitly and select, radio-group and
  dropdown-menu did not. Now they all do, so feeding a single file to a
  bundler no longer silently breaks its markup.

- **The preview drew colours the system never defined, or defined
  differently.** A sweep of every block in every state against the component
  recipes found: the danger button went blank on hover, active and disabled
  because the preview emitted brand states but not the intents' (it now
  derives `--error-fill-hover` and friends on the shipped rule); the demo's
  secondary button, badges, tooltips, chips and pagination painted white or
  `surface-moderate` where the system has `on-*` colours and
  `surface-subtle`; the progress track was a step too dark; alerts and
  banners used the fixed `*-background` tints instead of the recipe's 10% tint
  and 30% ring, and coloured warning's text and icon inconsistently: the shipped
  rule puts a warning alert's whole content in `foreground-primary`, and the
  preview kept the icon orange. Measured on the 10% tint, every intent fails
  AA as body text — info 4.15, error 3.52, warning 2.89, success 2.80 against
  a 4.5 bar — so the library's warning exception is right and the other three
  are worth revisiting. Badge definitions in the registry carried
  `constant/white` from before on-colours existed — fixed there, so the canvas
  is right too. A component's kinds are never a choice: the row shows every
  colour or variant, and a second kind — a badge's style next to its colour
  — becomes a row per value rather than a dropdown or a pin to the first.

- **A loaded system left its brand ladder behind.** A theme states its brand
  as one colour — the eleven steps behind it are generated, not stored — so
  after an import the Colors table and everything reading `brand-*` still
  showed the stock blue. The plugin now grows that ladder from the loaded
  brand, the same generator the wizard uses. Anything else a theme implies
  rather than stores — the on-colours, the brand's and the intents'
  hover/active/disabled — is recomputed on import too, instead of keeping
  what the startup preset had.

- **The loaded file replaces the drop zone instead of pushing the panel
  around.** Both share one slot under the wizard button at a fixed height, so
  the sidebar does not move when a system arrives. The
  "N components · M foundations selected" line is gone; the list and the
  blocks say that already.

- **The Colors table is the wizard's, in the plugin and in Figma.** Base
  circle, name and purpose, the ladder as pills with the anchor step ringed,
  Generic bracketing white and black — one layout on the site, in the plugin's
  Variables view and in the Colors frame the plugin generates.

- **The plugin's top bar is gone.** Logo, name and a one-line tagline sit at
  the head of the sidebar; the preview pane gets the height back.

- **A toast's action button broke the concentric-corner rule, on every
  surface.** The card is `radius-2xl` with `1rem` of padding, so a button
  inside it should be 8px; the docs example, the plugin preview and the Figma
  builder all gave it 12px. The canvas was also guessing the card's own corner
  from the button's ("nearest step to 12 + 16"), landing 4px off, and applying
  the same guess to alerts, which ship at `radius-lg`. All three now state the
  component's own radius, and the action is the Small button — whose
  `radius-sm` is exactly the concentric value.

- **A selected control was painted darker than the system says.** The active
  segment of a button group ships as a brand fill with its derived on-colour;
  the preview drew it in `surface-moderate`, the darkest surface in the
  scale. The chosen item in a block's dropdown was doing the same, and now
  reads as a light tint with a brand label.

- **The plugin's Colors preview showed the stock palette, not the loaded one.**
  Both the Colors foundation and the Overview were drawn from the built-in
  six ramps, so a system with extra families looked like it had none — the
  ramps it was about to generate were invisible until they appeared on the
  canvas. A loaded system's ramps now replace them, under the names it carries;
  dropping the loaded system brings the stock ones back.

- **The Figma plugin got the ramps under the wrong names, and a brand ramp in
  the wrong collection.** The wizard exported every ladder under its internal
  id — `grey`, `blue`, `custom-1` — so Figma showed those names while the
  designer had called them Neutral, Info and their own. Ramps now export under
  the names on screen, and `$extensions` records which canonical family each
  one plays, so a renamed ramp still reaches the recipes that ask for
  `blue/500`. The brand's own ladder moved out of the semantic group into
  `scale`, where the other ramps are — Figma was building a second brand ramp
  inside the Palette collection, next to the real one in Colors. Only what a
  component binds to stays semantic: the fill, its states, the text on it.
- **Importing a theme stripped the plugin's own buttons.** The imported colours
  were written to the library's variables already wrapped in `hsl()`, and the
  CSS wraps them again — `hsl(hsl(213,87%,49%))` is invalid, so every button
  lost its background the moment a token file was dropped in. Those variables
  hold a bare triplet; the preview's own `--t-*` variables are the ones that
  hold a finished colour.
- **A hand-authored spec cannot describe a component as utilities.** The
  spec audit fails when a spec without a recipe lists layout or typography
  utilities as a component's classes; a composition (the form) says so.
- **MCP vendor drift is now a build failure.** The server vendors plain-JS
  modules from the repo. The list lives in one manifest, the sync copies the
  whole dependency closure (the old list missed three modules the copies
  imported), and `audit:vendor` — part of `audit:all` — fails when a copy is
  stale, an import is unresolved, or a module will not load.

- **Themes with off-palette intents had no interaction states at all.**
  `editorial` and `rounded-sans` set their intent fills literally rather than
  by pointing at a ladder step, so there was no ladder to walk and the states
  were simply absent — a destructive button in those themes fell back to the
  default theme's red for hover. An off-palette fill now grows its own ladder
  from itself, the way the brand always has, so its states belong to it.
- **Hover and active could land on the same step.** The walker picked each
  state independently, so on a compressed ramp — which an off-palette accent
  usually is — both resolved to the same step and a button looked identical
  hovered and pressed. Each state must now land past the one before it.

- **The MCP server's vendored copies were stale and broken.** Its
  `theme-css.mjs` was a release behind, so a theme it handed out carried no
  interaction states, and its `brand-scale.mjs` had been replaced by the
  source version without the two modules that version imports — any call
  through it would have thrown at runtime. The vendored set is in sync again.
- **A disabled brand control is dark in dark mode.** `--brand-fill-disabled` pointed
  at the light `/200` step in every theme block, including the dark one, where
  a pale tint is the brightest thing on the page. The Figma plugin had always
  resolved the deep step there; the CSS now does too, and the intents follow
  the same rule.
- **Wizard exports no longer freeze a light on-colour into dark mode.** A
  manual on-colour in the light map leaked into the dark block through the
  merged colour map, so a system whose dark mode was left on `Auto` shipped
  the light override anyway. Each mode now takes its override from its own
  map. The same emitters also printed `--on-brand` twice once the value
  existed as a role; it is emitted once.
- **`sitemap.xml` is generated from the routes that exist.** It was written by
  hand, so it drifted: Google was still being handed `/components/sheet/`,
  `/components/aspect-ratio/` and `/components/color-picker/` — 404 for months —
  along with fourteen URLs that had become redirects, while every `/examples/*`
  page was missing from it entirely. `scripts/build-sitemap.mjs` now derives the
  map from `src/pages` during the build, skipping the error page, redirect stubs
  and noindex pages, and dating each entry from the page's last commit. 93
  entries with 17 broken ones became 107 with none.
- **The Figma plugin links component pages without stripping the trailing
  slash.** Both the canvas artboards and the plugin's own preview link pointed
  at `veritheme.com/components/<name>`, which redirects to the same path with a
  slash — the source of the redirected and canonical-variant URLs the search
  console was reporting. `public/llms.txt` likewise still advertised
  `/docs/design-tokens/`, `/docs/utilities/` and `/themes/`, all of them
  redirects now, and named the token exports by an extension they no longer use.
- **A brand colour at the end of the ramp gets states you can see.** Hover and
  active were picked by step number — one step darker, two steps darker — which
  holds while the ladder is evenly spaced and stops holding at its ends. Pin the
  brand to black and the anchor sits on the darkest step with the whole ramp
  compressed toward zero: the neighbouring step differed by a single point of
  lightness, so the hover token existed and the button did not change. The step
  is now chosen by visible difference instead — walking out from the anchor
  until the colour actually differs, and lightening when there is no room left
  to darken. Both states travel the same way, so a press never brightens after a
  hover that dimmed. Evenly spaced ramps, the three shipped themes included, are
  untouched: they already cleared the threshold at the step they were using.
- **An open accordion panel no longer clips its own bottom.** Expanding froze
  a pixel `max-height` measured at that instant and kept it forever, so once
  the web font arrived — or the column changed width — the text rewrapped
  taller than the ceiling and the last line ran into the item's divider, with
  the bottom padding cut away. Reloading hid it, because the font was cached
  by then. The ceiling is now released once the expansion has played, so the
  panel simply takes the height its content needs.
- Exported `--brand-*` now follows the palette ramp shown in the builder, so
  extreme brand colours (pure yellow, black, white) no longer disagree between
  the palette and the derived scale.
- On-colours no longer assume a `950` step exists — a 9-step ladder used to
  export `undefined`.
- Neutral greys keep their hue across the ramp when the neutral is set by hand.
- `role-guard` reports the contrast ratio that actually ships.
- `parseHsl` accepts a negative hue.
- **npm:** `import 'veritheme'` no longer tree-shakes to an empty module —
  the JS bundle self-initialises, so it is now declared side-effectful. The
  file paths the README documents (`veritheme/veritheme.min.css`, `.js`) are
  listed in `exports`; they used to fail with `ERR_PACKAGE_PATH_NOT_EXPORTED`.
  Guarded by `npm run test:package`.
- **Number Input:** a typed `0` is kept — it used to be replaced by `min`,
  and an emptied field without `min` became `-Infinity`. The docs page copy
  of the behaviour is fixed the same way.
- **`/create` exports agree on the brand.** Tailwind, SCSS and Style
  Dictionary re-derived the brand ladder from the accent with the library's
  default state steps and the stock palette, so moving `hover` or reshaping
  the ramp changed `theme.css` and `tokens.json` but not the other three.
  All formats now receive the one resolved ladder and the wizard's own palette.
- **`/create` root size reaches `theme.css`.** A system authored at, say, a
  20px root exported `0.4rem` for an 8px radius and rendered 6.4px on a
  stock page; the file now opens with `html { font-size: 20px }` (only when
  the root is not 16px) and says how to drop it.
- **`/create` hand-off snippet** linked `veritheme/dist/…` on unpkg; the
  package ships `veritheme.min.css` / `.js` at its root, as the docs say.

## [1.0.8] — 2026-07-21

Lockstep npm release of `veritheme` + `@veritheme/mcp-server` — same version even when only one package changed (owner's rule). Core package content is unchanged vs 1.0.7; all changes are in the MCP server. Site deploy pending.

### Added — MCP server
- **4 new tools**: `get_guidelines` (full AI-generation rulebook), `get_starter` (exact CDN page skeleton, dark-mode boot, theming), `validate_markup` (lints HTML against a 2119-class registry: off-scale/unknown classes, arbitrary values, sub-12px text, nested cards, multiple primaries, unlabeled icon buttons, dead hover-only controls — plus a logic-walkthrough questionnaire), `get_theme_css` (preset/custom theme → ready CSS with derived brand scale via vendored theme-css/brand-scale modules).
- **Generation protocol** (§0 of the rulebook): spec the page model (regions, every control + scope + effect, data invariants) before markup; walkthrough + whole-page re-audit after every edit. New rules: control scope integrity, data coherence, control-cluster consistency, no dead controls.
- **Behavior contracts on all 24 patterns** (what each control does at what scope), authored in `scripts/mcp-pattern-behaviors.json`, merged by the pattern builder, rendered by `get_pattern`.
- **JS-bundle wiring docs** on 18 interactive components (`js` field → `## JS wiring`), **gotchas** expanded 6→20 components, **search aliases** on 46 components (modal→dialog, loader→spinner, …), normalized `get_component` lookup.
- Snippets for radio, pill, icon-badge, list-item, nav-item, section-label, count-badge via new `$mcp.snippet` recipe support (70→82 snippets).

### Changed — MCP server
- **Server `instructions` cut ~7 KB → ~2.2 KB core** (clients truncate long instruction blobs — the old one was cut mid-way); the full rulebook moved to `get_guidelines`, with checklist footers on `list_components`/`list_patterns` as a safety net.
- Stale interaction docs rewritten where they contradicted the JS bundle ("ships NO JS — you wire it" on dialog/select/dropdown-menu; "there is NO .vt-dropdown-menu class").
- Component data hygiene: 5 duplicate dashless spec keys merged, 27 keys renamed to canonical dashed ids (generator slug now derives from the recipe file name), 53 missing descriptions written, 9 docs-site internal widgets hidden from the catalog.

### Fixed — MCP server
- `componentCatalog` resource crashed on composite components without a `classes` block.
- `veritheme.project.json` that fails to parse (a stray comma, wrong shape)
  is reported instead of being treated as empty — the next
  `register_project_component` used to overwrite the file and lose every
  registered component. Writes now go through a temp file + rename.

## [1.0.7] — 2026-07-21

### Fixed
- **Mobile top navigation.** The site header (`TopBar`) hid its nav below 640px with no replacement, so on the homepage (standalone header, no sidebar) mobile users couldn't reach Components / Examples / Generator / Storybook / Figma. Added a hamburger button (≤640px) that toggles a dropdown menu with the top-level links; Esc / outside-click / link-click close it. Desktop nav unchanged.

### Changed
- **Calendar examples polish.** Month/week example headers use a square page-btn for search and a full-size primary "New event"; preview snapshots re-shot to match.

## [1.0.8] — 2026-07-21

npm-only lockstep release of `veritheme` + `@veritheme/mcp-server` (published from `feat/florin`; site deploy and git tag follow with the branch merge). Core package content is unchanged — the version moves in lockstep with the MCP server by owner's rule.

### Added — MCP server
- **4 new tools**: `get_guidelines` (full AI-generation rulebook), `get_starter` (exact CDN page skeleton, dark-mode boot, theming), `validate_markup` (lints HTML against a 2119-class registry: off-scale/unknown classes, arbitrary values, sub-12px text, nested cards, multiple primaries, unlabeled icon buttons, dead hover-only controls — plus a logic-walkthrough questionnaire), `get_theme_css` (preset/custom theme → ready CSS with derived brand scale via vendored theme-css/brand-scale modules).
- **Generation protocol** (§0 of the rulebook): spec the page model (regions, every control + scope + effect, data invariants) before markup; walkthrough + whole-page re-audit after every edit. New rules: control scope integrity, data coherence, control-cluster consistency, no dead controls.
- **Behavior contracts on all 24 patterns** (what each control does at what scope), authored in `scripts/mcp-pattern-behaviors.json`, merged by the pattern builder, rendered by `get_pattern`.
- **JS-bundle wiring docs** on 18 interactive components (`js` field → `## JS wiring`), **gotchas** expanded 6→20 components, **search aliases** on 46 components (modal→dialog, loader→spinner, …), normalized `get_component` lookup.
- Snippets for radio, pill, icon-badge, list-item, nav-item, section-label, count-badge via new `$mcp.snippet` recipe support (70→82 snippets).

### Changed — MCP server
- **Server `instructions` cut ~7 KB → ~2.2 KB core** (clients truncate long instruction blobs — the old one was cut mid-way); the full rulebook moved to `get_guidelines`, with checklist footers on `list_components`/`list_patterns` as a safety net.
- Stale interaction docs rewritten where they contradicted the JS bundle ("ships NO JS — you wire it" on dialog/select/dropdown-menu; "there is NO .vt-dropdown-menu class").
- Component data hygiene: 5 duplicate dashless spec keys merged, 27 keys renamed to canonical dashed ids (generator slug now derives from the recipe file name), 53 missing descriptions written, 9 docs-site internal widgets hidden from the catalog.

### Fixed — MCP server
- `componentCatalog` resource crashed on composite components without a `classes` block.

## [1.0.6] — 2026-07-18

### Added
- **Per-component interaction docs for AI.** Every interactive component spec now carries an `interactions` field (which states are automatic vs. how to trigger active/disabled/error/loading in markup), surfaced by `get_component` as `## Interactions` and in `llms-full.txt`. Fills the gap where child-element states (tabs→tab, accordion→item, nav) were invisible to AI. Documentation only — no CSS change.
- **Anti-patterns / common mistakes** listed in the MCP instructions, the design-system overview resource, and a new section on `/docs/design-principles` (rebuilding components, utility size/color overrides, info-as-brand, sub-12px, nested cards, hardcoded backgrounds, unlabeled icon buttons, multiple primaries, no empty state).
- **Container queries**: `vt-cq` (establishes an inline-size query container) + `vt-cq-sm:` / `vt-cq-md:` / `vt-cq-lg:` variants for the common reflow utilities, so a component adapts to its container instead of the viewport. Documented with a live demo on `/docs/utilities-layout` and in the MCP responsive rule.
- **RTL logical utilities**: `vt-ms-*` / `vt-me-*` (margin-inline), `vt-ps-*` / `vt-pe-*` (padding-inline), `vt-text-start` / `vt-text-end`.
- **Semantic-first principle** in the MCP generation rules and the Design Principles page: the token/class names ARE the design intent, so match the content's meaning to the name (success = positive, warning = caution, error/danger = failure/destructive, info = neutral notice + focus, brand-fill = product accent; mains primary→quaternary = most→least important; surfaces = elevation; typography classes = role) rather than picking by appearance. The existing colour/typography rules become the guardrails under this framing.
- **Calendar example pages.** Two new full-page examples under `/examples/` — a month grid with meetings, tasks, and continuous multi-day event bars, and a week view with an hourly time grid, all-day events, and flat colour-coded blocks (tinted fill + left accent, the real-calendar look). Built entirely from Veritheme components and utilities across five named calendars, light + dark.

### Changed
- **Components are now RTL-safe internally.** Physical directional properties in the recipes (padding/margin/border-left/right, text-align, and asymmetric padding/margin shorthands) were converted to logical properties (`padding-inline-start`, `border-inline-end`, `padding-inline`, `text-align: start`…). Identical rendering in LTR; correct mirroring under `dir="rtl"` (verified: sidebar link padding flips). Placement variants (tooltip/popover left/right) and directional positioning remain physical for now.

## [1.0.5] — 2026-07-18

### Fixed
- **Bordered secondary badges used the dark text color as their outline.** `vt-badge-bordered` set `border-color` to `--badge-accent`, which for the neutral `secondary` color is `foreground-secondary` (a body-text grey) — so tag-list badges (Astro, React, …) had a heavy dark outline instead of a subtle one. A new `--badge-border` variable defaults to the accent (colored bordered badges keep their intent-colored outline) but `secondary` now maps it to `border-strong`, matching chips and other bordered controls. Also refreshed a stale docs line ("VT Utilities" tag, badge icon now documented as 14px).

## [1.0.4] — 2026-07-18

### Fixed
- **`vt-card` no longer overrides margin/typography utilities on nested `h3`/`p`.** The card's built-in content defaults (`h3 { margin: 0 0 4px }`, `h3 + p { … }`) used a plain descendant selector whose specificity beat utility classes — so `vt-mt-3` and friends on a card title were silently ignored (e.g. the kanban card badge sat flush against its title). The defaults are now wrapped in `:where(.vt-card)` (zero specificity): a bare `<h3>` still gets the default spacing, but any utility on card content now wins. Audit: card was the last recipe with this utility-overriding pattern — badge's forced icon size was fixed in 1.0.3; avatar `img` (100% fill) and select `> svg` (internal chevron) are legitimate and untouched.

## [1.0.3] — 2026-07-18

### Fixed
- **Badge leading icons were oversized (20px), inflating badge height.** `.vt-badge > svg/img` forced 20×20 icons, overriding the demo's utility sizes — so an icon badge rendered 29px tall (full-stadium) instead of 24px, making bordered "Featured"-style badges look inconsistent next to plain ones. Icons are now 14×14, keeping every badge 24px tall; the demo drops its redundant `vt-w-3` overrides (component-first).

### Changed
- **`vt-api-table` restyled to match `vt-table`** — the API Reference / Accessibility tables on every component page now share the standard table look: `radius-xl` container, `surface-subtle` header without uppercase, `font-size-sm` cells. The bespoke colored `vt-api-type--*` chips are gone; class types render as `vt-badge vt-badge-soft vt-badge-secondary` (intent colors stay reserved for semantic states).

### Added
- **Component pages surface "When to use"** — every component page header now auto-renders the usage guidance from the specs (same text as MCP/llms/registry), matched by URL slug in ComponentPage. Chip, Code Block, Collapsible, Media and Not Found gained the missing API Reference / Accessibility sections.

### Removed
- **/components/ overview page** — the Components nav now lands on /docs/introduction/ (redirect in place); the six stale Foundation duplicates under /components/ (border, colors, effects, icons, spacing, typography) are deleted and redirect to their current /docs/ versions.

- **shadcn registry: usage guidance in descriptions.** Every item in `/r/*.json` now ends with "When to use: …" — the same when/when-not/alternative text served by MCP `get_component` and `llms-full.txt`, so CLI consumers see it in `npx shadcn add` output too.
- **Examples now demonstrate states** (per the states rule): the tasks board gained an empty "Blocked" column built on `vt-empty-state`, and analytics gained a "Realtime" card that loads with `vt-skeleton` lines — both flow into the MCP composition patterns on rebuild.

## [1.0.2] — 2026-07-18

### Added
- **MCP server: composition patterns and per-component usage guidance.** New tools `list_patterns`/`get_pattern` serve 22 page skeletons distilled from the live examples (structure only — content elided, repeats collapsed); every component spec now carries a `usage` field ("when to use / when not / alternative"), surfaced by `get_component`. The server instructions grew a full generation rulebook: component-first, min-12px typography with semantic classes, spacing grid, color roles (brand vs blue, surface & text hierarchy), radius scale, page rhythm, states, content voice, icon and responsive conventions, and a pre-return self-review checklist. `llms-full.txt` carries the same rules and usage notes for non-MCP consumers.
- **Docs: Design principles page** (`/docs/design-principles`) — the same rulebook for humans.
- Utility `vt-rounded-concentric-3` — concentric inner radius (`calc(var(--radius-2xl) - var(--spacing-3))`) for an element inset by `p-3` inside a `vt-card`, so nested corners run parallel to the card's per the concentric-radius rule (theme-independent).
- Utility `vt-self-center` (`align-self: center`); gradient stop `vt-to-brand-fill/70`; `vt-decoration-brand-fill/30`.

### Fixed
- **Brand-vs-blue rule enforced in components**: `vt-tree-view` active item and `vt-resizable` handle hover now use `brand-fill` instead of `info-fill` — interactive/selection states belong to the brand accent; blue `info-*` is reserved for informational states and focus (matches `vt-sidebar-link`, `vt-calendar-day`, `vt-timeline-dot`, `vt-nav-item`).

### Changed
- **Site navigation: one clear sidebar.** The Function/Structure (atomic) toggle is gone; a single functional grouping remains — Docs, Foundation, Actions, Forms, Navigation, Layout, Data Display, Feedback, Overlay (new: Dialog/Dropdown/Popover/Tooltip) and Blocks (new: composite sections — Auth, Feature Section, Media, Not Found, Onboarding Flow, Pricing Card, Testimonial). Nine previously unlisted pages (Stepper, Timeline, Page Layout and the Blocks set) are now reachable. `/showcase` is retired in favor of Storybook (redirects to `/storybook/`).
- **All component font sizes are now bound to typography tokens** (no hardcoded px/rem left in recipes), enforcing the min-12px text rule at the library level: `vt-count-badge`, `vt-pill-sm` and `vt-sidebar-badge` go 10px → `--font-size-xs` (12px); `vt-input-sm`/`vt-textarea-sm` go 13px → xs; `vt-select` trigger/items 14px → `--font-size-sm` and its label 12px → xs (weight 600 → `--font-weight-semibold`); `vt-number-input-sm` 0.75rem → xs and `vt-otp-input` lg 1.25rem → `--font-size-xl` (same values, token-bound).
- **Site sweep per the MCP generation rules**: every readable text ≥ 12px (all `vt-text-[10px]`/`[11px]` usages replaced with `vt-text-xs`; sub-10px text remains only inside miniature catalog illustrations); 50 hand-rolled uppercase group labels across 20 pages replaced with the `vt-section-label` component; hand-rolled hover tooltips (avatar-group), count pills (list), calendar weekday rows and hand-sized avatars replaced with `vt-tooltip`, `vt-count-badge`, `vt-calendar-weekday` and `vt-avatar-sm`; mail/compose attachment chips unified with the task-detail pattern (`vt-card` + stretch icon tile + `vt-rounded-concentric-3`).

## [1.0.1] — 2026-07-17

### Added
- **Badge & icon-badge: `soft` style variant and `info` color.** Badge now offers a soft (tinted-background) style alongside solid/outline; icon-badge gains size options and a `square` shape. Documented in the components pages and reflected across the site.
- **Banner: intent variants** (info / success / warning / danger) driven by design tokens, replacing the site-only `status-pill` / tone / `surface-card` CSS that previously faked them.
- New `rating` entry in the shadcn-style registry (`public/r/rating.json`).

### Changed
- **`/examples` and docs pages migrated to real library components.** The examples gallery and documentation now compose Veritheme components instead of hand-rolled site-only CSS (per the "pages must use DS components" rule); catalog screenshots regenerated to match.
- Component count unified to the actual **66** in every public place — site copy and meta descriptions, README, GitHub repo description, og-image, llms.txt (was variously 62/63/75/79). The Figma plugin's 45 is a separate, correct number (its own canvas set).
- New social-preview image (`og-image.png`): Veritheme brand, “One source of truth for Figma, code & AI”. HTML source lives in `scripts/og-card.html` (regeneration command in its header comment).
- Brand is written **Veritheme** (capital V) in all display text — site titles, OG tags, docs prose, plugin name ("Veritheme Design Tokens"), Storybook, READMEs. Technical identifiers stay lowercase as required: npm package `veritheme`, scope `@veritheme`, domain veritheme.com, bundle files `veritheme.(min.)css/js`, localStorage key `veritheme-theme`.

### Removed
- **Figma plugin: the Blocks generation step is removed** (shipped in 1.0.0, cut for the Community release — block generation had quality problems). The plugin flow is back to Theme → Components → Export; the blocks compiler (`scripts/build-plugin-blocks.mjs`), `registry/blocks.json` and the Blocks UI/generation code are deleted. DTCG `.tokens.json` import via the drop-zone is kept. The destructive "Clear file" button stays hidden (footer, `display:none`).

## [1.0.0] — 2026-07-15

First release under the new name. **uicraft is now Veritheme** — the version
number restarts at 1.0.0 with the rename; the last release under the old name
was `@uicraft/core@1.4.4`.

### Changed
- **Project renamed: uicraft → Veritheme.** npm package `@uicraft/core` → `veritheme` (the old package is deprecated but keeps working); utility/component class prefix `uc-` → `vt-`; CSS custom properties `--uc-*` → `--vt-*`; data attributes `data-uc-*` → `data-vt-*`; bundle files `uicraft.(min.)css/js` → `veritheme.(min.)css/js`; site moved from getuicraft.com to [veritheme.com](https://veritheme.com) (old URLs redirect); GitHub repo is now [tarasenko-by/veritheme](https://github.com/tarasenko-by/veritheme).

### Added
- **Figma plugin: new "Blocks" step in the generation flow** (Theme → Components → Blocks → Export) — 15 site composites (Header, Footer, PricingCard, Testimonial, FeatureSection, Timeline, Stepper, Calendar, DataTable, Carousel, Auth, NotFound, OnboardingFlow, PageLayout, Media; 68 variants), grouped on canvas into "Blocks · Sections / Application / Media" sections. The Components page now advances with "Next: Blocks"; the Blocks page launches ONE combined generation (components + foundations + blocks) with the shared progress bar. Blocks follow atomic design: embedded buttons, badges, inputs, chips, avatars and ratings are placed as instances of the component library built in the same run. The list panel shows live HTML previews rendered from the real site markup. The "Clear file" button is visible again in the Components footer.
- Blocks are compiled at build time from the site's own docs markup (`scripts/build-plugin-blocks.mjs`, wired into `build:plugin`): vt-* utility classes and component-recipe CSS rules are mapped back to design tokens, so generated frames keep full Figma-variable binding (fills, strokes, radii, spacing, text styles); embedded core components (buttons, badges, inputs…) are placed as real library instances. The site markup stays the single source of truth — new/changed docs examples flow into the plugin on rebuild. Curated set lives in `registry/blocks.json`.
- The blocks compiler validates color tokens against the live token set and reports dead token references found in docs markup (substituted with `surface/subtle` on canvas).

## [1.4.4] — 2026-07-04

### Changed
- Sidebar text bumped from 12px (`--font-size-xs`) to 14px (`--font-size-sm`) — nav links, group buttons, section labels, the view toggle, and the search input all move up one step, preserving the size hierarchy (uppercase headers stay bold caps, sub-items stay normal weight). The 10px count badge is unchanged. Single recipe change (`components/sidebar.json`).

## [1.4.3] — 2026-07-04

### Changed
- ExampleBlock (the "Preview / Code" block used on every component and docs page) now matches the `vt-table` container: its header bar uses `surface-subtle` (was the darker `surface-moderate`) and the block/header/code-panel corner radius is `radius-xl` (was `radius-2xl`), so the header reads as the same light, rounded surface as table headers across the whole site. Single recipe change (`components/example-block.json`) → propagates everywhere.

## [1.4.2] — 2026-07-04

### Changed
- Foundation "token tables" (Size Scale, Token Syntax, color/type/border/effects reference tables on the docs and component foundation pages) now inherit the real `vt-table` component's header styling instead of hand-overriding it. Every table header row dropped its ad-hoc background (`vt-bg-surface-moderate`/`-moderate/50`/`-subtle`) and every header cell dropped the utilities that `.vt-table th` already provides identically (`vt-text-left`/`-px-4`/`-py-3`/`-py-2`/`-pr-4`/`-font-semibold`/`-font-medium`/`-text-xs`/`-text-foreground-disabled`) — only structural classes (column widths, right/center alignment) remain. So the reference tables now match the `vt-table` used on component pages instead of carrying a slightly different, hand-built header. Applied across all 10 foundation pages (`docs/{typography,utilities-layout,spacing,design-system,border,colors}`, `components/{spacing,typography,colors,border}`).

## [1.4.1] — 2026-07-04

### Added
- Four new design-system components, promoted from page-local demo markup to real recipes (`components/*.json` → generated CSS, shipped in `system.scss`, shadcn registry `/r/`, MCP specs, Storybook): **Combobox** (`vt-combobox-wrapper` + `-item`/`-group`/`-tags`/`-tag`/`-icon`/`-button-label`/`-empty`), **Command** (`vt-command-wrapper` + `-input`/`-list`/`-group`/`-item`/`-separator`/`-empty`), **Tree View** (`vt-tree` + `-item`/`-toggle`/`-chevron`/`-children`/`-leaf`/`-active`), and **Resizable** (`vt-resize-handle` + `-col`/`-row` orientation). Their pages previously referenced these classes with no CSS behind them (the styling was lost in an earlier refactor), so the demos rendered unstyled; now they're first-class components.
- Utility generator (`generate-vt-utilities.mjs`) filled in ~50 standard utilities the docs pages already used but that were never emitted — so every `vt-*` on the site resolves to our CSS: the `2.5` step across spacing/width/height, width fractions (`1/4`, `4/6`, `5/12`), `vt-flex-row`, `vt-h-screen`/`-auto`/`-px`, `vt-w-px`/`-fit`/`-52`, `vt-max-w-4xl`/`-6xl`, `vt-col-span-1..6`, `vt-mt-auto`, `vt-place-items-center`, `vt-border-0`, `vt-font-black`/`-sans`, `vt-leading-snug`, `vt-break-all`, `vt-list-disc`/`-decimal`/`-inside`, `vt-underline-offset-2`, `vt-rotate-45`, `vt-translate-y-24`, `vt-drop-shadow-md`, `vt-cursor-text`, `vt-bottom-6`/`-right-6`, more responsive (`sm:flex`, `sm:col-span-1`, `md:grid-cols-3`, `lg:flex`, `lg:grid-cols-6`), hover/focus-visible/focus-within/group-hover variants, gradient `from-*`/`to-*` stops, and a batch of arbitrary sizes used on specific cards.

### Changed
- Sitewide pass to make every page reference the design system instead of hand-building visuals with utilities: where a real component/class exists, the markup now uses it. Renamed invented classes to their real equivalents — `form.astro` `vt-form-field`/`-hint`/`-error`/`-message` → `vt-field`/`vt-field-description`/`vt-field-error` (these were taught verbatim in the copy-paste code examples), `vt-chip-btn`/`-selected` → `vt-chip`/`vt-chip-active`, `vt-separator-vertical` → `vt-separator-v`, `vt-nav-link`/`vt-link-external` → `vt-nav-item`/`vt-link`, `vt-tag`/`-selected` → `vt-chip`/`vt-chip-active`. Replaced hand-rolled component visuals with the component class + modifier — showcase's faux segmented buttons → `vt-btn-group` + `vt-btn`, faux chips → `vt-chip`/`vt-chip-active`, pricing-card "Popular" ribbon → `vt-badge vt-badge-primary`, the overview status pill → `vt-chip vt-chip-active`, sidebar-nav notification count → `vt-count-badge`, page-layout's hand-sized buttons → `vt-btn-sm`.

### Fixed
- Page-local helper classes that had no CSS anywhere (rendered unstyled) now reference real CSS: `vt-tabs-content`, `vt-theme-toggle`/`vt-select-wrapper`, `vt-drag-scroll`, `vt-list-check`, `vt-sidebar-overview`, `vt-color-format-btn`, `vt-component-section`, `vt-size-label` got scoped `<style>` blocks; `vt-hover:bg-neutrals-overlay` (no such token) → `vt-hover:bg-surface-subtle`; `vt-!p-0` (defined without the `vt-` prefix) → `!p-0`.

## [1.4.0] — 2026-07-04

### Added
- Storybook: generated "Playground" (controls bound to the recipe axes) and "All Variants" (captioned grid, columns × rows = first × second axis) stories for every component with variant axes — 13 generated components (input, textarea, switch, checkbox, avatar, alert, progress, separator, link, skeleton, number-input, radio-group, button-group) plus the curated Button/Badge, up from 4. The story markup is a real instance extracted from the docs examples (the cleanest one — fewest non-axis classes — so a stacked avatar's `vt-w-6` or a checked switch's state doesn't leak into every cell), which makes nested anatomies (switch thumb, avatar photo, number-input buttons) render true to the site. Modifier classes are validated against the built CSS instead of the spec class lists (which miss `vt-link-muted`, `vt-separator-h/v`, `vt-input-error` — the old Link/Separator controls were silent no-ops), and a `size` axis is derived from the CSS when the spec doesn't declare one (number-input, radio-group, button-group). Components whose axis maps to no real class (rating) or that are invisible in isolation (tooltip) are skipped rather than given dead controls; separators and progress bars get sized wrappers so they don't collapse in the shrink-wrapped story cell. Docs sections that just sweep one axis ("Sizes", "Variants") are dropped when the All Variants grid exists — they were pure duplicates; context sections (states, slots, compositions like "With Label", "Disabled", "Colors") stay. Playgrounds also expose **state controls**: boolean `checked`/`active` and `disabled` args that swap between real docs instances of each state combo (a checked switch brings its real `vt-active` + brand background + aria-checked markup, a disabled chip its opacity/cursor classes), so the toggles render exactly what the docs show rather than a synthetic approximation; `disabled` is synthesized as a real attribute where the CSS styles `:disabled` and the docs lack an example. A state only becomes a control when examples show both sides of it — no invented toggles. This adds playgrounds to state-only components (chip, pagination, select trigger) — 16 generated + 2 curated total — and a `label` text control appears when every template body is plain text (pagination, link). Axis values with their own docs instance also swap the whole template, not just the root class — an alert's intents differ inside (per-intent Lucide icon whose color comes from the variant's CSS cascade), so a shared template rendered every intent with the info icon in plain text color; now each Playground selection and All Variants cell uses that variant's real markup. **Composition slots** (SLOT_RULES map): optional parts the docs kept in separate sections — the alert's description, action button, and close button — are now Playground controls (text control where clearing hides the slot; booleans for action/close, the close button's page-specific onclick rewritten to a self-contained `this.closest(…)` dismiss) and an "All Variants" second **Compositions** section (default / + action / + close / all — capped sweep instead of a full cartesian explosion). The slot subtree comes from the docs' own "With …" example (donor) and is injected into variant templates that lack it, so every intent can toggle every slot. Heading text (`h1–h6`) is exposed as a `title` text control wherever a playground template has one. The replaced docs sections ("With Description", "With Action Button", "Closable") are dropped as redundant. Slot rules cover **banner** (text, action, dismiss — plus a derived `tone` axis from the shared `vt-tone-*` family, so the tone sweep renders each tone's own icon), **toast** (icon, title, description, action — its "Static Previews" markup lives outside ExampleBlock panels, so template extraction falls back to scanning the whole built page), **empty-state** (icon, description, action, title) and **card** (header, footer — the docs show no footer despite the section title, so the footer donor is hand-written against the `.vt-card-footer` CSS). Slot-only components get a Playground and a compositions-only All Variants without an axis grid; composition cells flip each slot away from its default ("+ action", "− icon"). **Tooltip** un-skipped: its wrap recreates the docs anchor (button + `vt-tooltip-wrap`) with a forced-visible style, giving a `placement` axis (top/bottom/left/right — each placement's own docs instance carries its arrow). **Menu item**: `selected` (the `vt-selected` marker joined the state detection) + `disabled` (`aria-disabled` now counts) + icon slot + editable label (label detection now tolerates slot placeholders around the text). **Accordion** got a Playground through a new axis kind — attribute axes: its API is `data-*` (`data-accordion="single|multiple"`, `data-accordion-variant="bordered"`), so the generator extracts the instance by the root attribute and the controls rewrite attribute values on the root tag (veritheme.js re-inits after every story render, so single/multiple behavior is live); the "Multiple Open"/"Bordered" docs sections fold into the All Variants sweep. 23 generated playgrounds total; the rest are blocked by design-system gaps — rating, slider, avatar-group, notification-badge, otp-input, file-upload and stats-card declare base classes in the MCP specs that neither the docs markup nor the CSS actually use, so there is nothing for controls to hook onto.
- Storybook: an always-visible "Theme" dropzone in the sidebar, above the component tree, that applies a custom theme at runtime — click it to pick (or drag a file onto it) a Veritheme theme JSON (`tokens/themes/*.json` format: colors, radius, fontFamily, `dark.colors`…) or a CSS file with variable overrides, and every story restyles live, no rebuild. While a theme is active the zone shows the loaded file name with a green dot ("click or drop to replace"), and a "Reset" button appears below it (hidden otherwise) to return to the preset toolbar; non-.json/.css files are rejected with a message. Storybook 10 has no sidebar addon slot, so the block self-mounts before `#storybook-explorer-menu` and a MutationObserver re-mounts it across sidebar re-renders (desktop and the mobile drawer). JSON goes through the same `theme JSON → CSS variables` code path as the build (`scripts/lib/theme-css.mjs`, extracted from `build-themes.mjs` and shared node/browser), so the derived brand scale (50–950 + hover/active/disabled) and on-accent contrast tokens come out identical to a built-in preset. The applied theme sets `html[data-theme="custom"]` — preset blocks stop matching and the Default `:root` block backfills any token the custom theme doesn't set — and persists across reloads (localStorage; on boot the preview announces its state to the block, since the block usually mounts before the preview iframe and a request-only handshake would miss). The theme toolbar itself now reads its items from the generated `theme-manifest.json` instead of a hardcoded list, so new theme presets appear automatically.
- Storybook (`@storybook/html-vite`, Storybook 10) covering the public component set — `scripts/build-component-stories.mjs` generates stories for all 46 components of `registry/components.json` (the same registry the Figma plugin generates on canvas; site-internal showcase components stay out), with specs/axes from `component-specs.json` (auto-runs via `prestorybook`/`prebuild:storybook`). Example markup is extracted from the **built docs site** (`dist/components/*/index.html` ExampleBlock preview panels) — fully-rendered HTML with real Lucide icons, portraits, and complete class lists, so every story is pixel-identical to the docs (and to what the Figma plugin's recipes describe). Self-contained inline handlers (`this.classList.toggle`) survive, page-global ones are stripped. Fallback chain for components without a built page: docs code literals (with icon/photo substitution) → MCP snippets (junk-filtered) → hand-written extras. A curated `stories/<key>.stories.js` (Button, Badge) takes precedence over generation. A toolbar switches theme (Default / Editorial / Rounded Sans) and light/dark mode, and the preview re-fires `astro:after-swap` after each story render so interactive components (accordion, select, dialog…) work. Run with `npm run storybook`, build with `npm run build:storybook`; deployed to `getveritheme.com/storybook/` (deploy.mjs syncs `storybook-static/` and excludes `/storybook` from the site's `--delete` mirror). The preview pins the root font-size to 16px — the library's fluid `:root` scale reacts to the canvas iframe width and would skew rem metrics; pinned, everything measures 1:1 with the Figma specs (md button 40px tall, 16×8 padding, 14px font).
- Site: `llms-full.txt` — the complete machine-readable reference for AI agents, generated from the MCP component specs: all 82 components with classes, anatomy, states, sizes, variant styling, tokens, and HTML snippets, plus the full design-token tables and theme list. Linked from `llms.txt`; rebuilt on every `predev`/`prebuild` (`npm run build:llms`).
- Site: shadcn-compatible registry at `/r/` — every bundled component is a registry item, so any project can pull Veritheme CSS with `npx shadcn@latest add https://getveritheme.com/r/button.json` (or via an `@veritheme` namespace in `components.json`). A `base` item carries tokens + resets + utilities and is auto-installed as a dependency; component `uses` become transitive registry dependencies. Index at `/r/registry.json`, docs section on the Installation page; generated by `npm run build:registry` from the same `system.scss` import list that defines the public bundle.
- Themes: portable exports for every preset in `public/tokens/` — `{theme}.vars.css` (flat CSS custom properties, light + dark, full token set incl. derived brand scale and on-accent tokens), `{theme}.tailwind.css` (Tailwind v4 `@theme` mapping with dark-mode flipping), and `{theme}.dtcg.json` (W3C Design Tokens for Style Dictionary / Tokens Studio). Download table in the Design System docs; generated by `npm run build:theme-exports`.
- Figma plugin: Shuffle and Reset buttons in the Theme Editor, pinned in a bar below the settings scroll (matching the site theme generator). Shuffle randomizes the accent color (same 8 hues as the site), radius scale, font, and spacing scale; Reset returns to the active preset — or to the loaded theme file, if one is loaded.
- Figma plugin: WCAG contrast warnings in the Theme Editor. When a color pair drops below its AA bar (3:1 for accent On-colors as UI/large text, 4.5:1 for primary text vs background) a compact ratio badge appears next to the row — acceptable values stay hidden so the panel keeps quiet, and the badge is overlay-positioned so appearing never shifts the layout. Works in both light and dark editing modes.
- Figma plugin: unapplied Theme Editor edits now survive plugin restarts — the draft is saved to Figma client storage on every edit and restored when the plugin reopens; applying the theme drops the draft.
- Figma plugin: a spinner next to the generation progress bar — visible for the whole run, so long builds (many components, or a slow single component where the percentage sits still) don't look like a frozen plugin.

### Changed
- Figma plugin: `Apply to Figma` now preflights the theme font against the fonts installed in Figma (family and faces) before writing anything. A missing family used to surface mid-apply as an "unloaded font" error after several 10-second load timeouts; now it warns immediately and applies with Inter. The Generate path's existing family check also gained the face-level report.

- Figma plugin: the Theme Editor preview's login card now shows the Veritheme logo glyph on the brand-colored tile (instead of an empty brand square); the glyph color follows the derived on-brand token, so it stays contrast-correct as the theme changes.

### Added
- JS bundle: `UCChip` — filter chips inside `[data-chip-group]` toggle on click (`vt-chip-active` + `data-selected` + `aria-pressed`), and `UCTabs` — `[data-tab-group]` tab switching with roving-tabindex keyboard nav (arrows/Home/End). Both behaviors previously lived as docs-page-local scripts, so bundle consumers got static markup.
- Utilities: filled the gaps the docs already relied on — `vt-bg-success-fill` (+ `/10–/50` tints), `vt-border-success-fill/30`, `vt-border-warning-fill/30`, `vt-border-error-fill/30`, `vt-border-input`, `vt-bg-warning-fill`, `vt-bg-border-strong`, `vt-bg-foreground-disabled/20`, `vt-text-constant-white/70,80`, `vt-text-success-fill/40`, `vt-text-foreground-disabled/20`, `vt-bg-gradient-to-t`. The success-colored chip dot was invisible everywhere because `vt-bg-success-fill` didn't exist.

### Added
- JS bundle: `UCRadioGroup` + `selectRadio(group, el)` global — custom radio groups now work out of the box (the dropdown-menu's radio-item helper was renamed to `selectMenuRadio` to free the name; it was silently shadowing the radio-group handler). `UCToast.show` creates its `#toast-container` host on first use instead of silently doing nothing when the page doesn't provide one.
- Tree View styles (`vt-tree-*`) moved from a docs-page-local `<style>` block into the design-system bundle — bundle consumers used to get unstyled markup.
- Site: Storybook link in the topbar navigation (`/storybook/`; hidden below 960px where the nav runs out of room).

### Fixed
- Border docs (both `/docs/border` and `/components/border`): the radius scale used a stale ad-hoc naming (`micro/tiny/small/medium/large/big/huge`) with values (2px, 6px) that no longer exist in the token set. Both pages now show the canonical scale used by the tokens and the Figma plugin — `none 0 / xs 4 / sm 8 / lg 12 (base) / xl 16 / 2xl 24 / 3xl 32 / 4xl 40 / full` — and preview swatches use the real `vt-rounded-*` utilities instead of hard-coded px classes. Added the missing `vt-rounded-xs` and `vt-rounded-4xl` utilities (`--radius-xs`/`--radius-4xl` already existed as tokens).
- Switch: a `vt-bg-*` color utility on an active switch was overridden by `.vt-switch.vt-active`'s brand background (specificity) — colored switches rendered blue until re-toggled. The brand fill now yields to color utilities.
- Avatar docs: the "lg" example used the `vt-avatar-xl` class, making lg and xl identical (80px); lg is 56px again.
- Progress/File Upload docs: several migrated inline-style classes referenced the removed `--accents-blue` token — fills and icons rendered transparent. Rewritten with semantic utilities (`vt-bg-success-fill`, `vt-bg-warning-fill`) and the token reference fixed to `--info-fill`.
- Accordion flush: hover highlight is now rounded only on the outer corners — first item top, last item bottom, middle items square.
- Separator "with label": the label no longer fakes the gap with an opaque background; the rule is split into two flex lines around the text (works on any surface).
- Number Input, Data Table docs: container radius unified to `--radius-xl` (1rem).

### Removed
- Accordion: the Flush variant is gone everywhere — `data-accordion-variant="flush"` CSS, the docs section + API row, the registry variant, the generated Storybook story, and the Figma-plugin handler/preview.
- Color Picker: docs page, sidebar/search entries, and the components-index card removed entirely.
- Aspect Ratio: the docs page and search-index entry are gone (the `vt-aspect-*` utilities stay — the Media component uses them).
- Sheet component — dropped from the design system entirely: recipe, docs page, sidebar/nav links, showcase demo, `UCSheet` + `openSheet`/`closeSheet` globals in the JS bundle, `vt-sheet-*` CSS, the Figma-plugin registry entry, and the MCP spec/snippet.
- Keyboard-shortcut hints everywhere: the tooltip "With Keyboard Shortcut" and command "With Keyboard Shortcuts" docs sections, `⌘`-kbd right-slots in Menu Item examples, the "Shortcuts" dropdown item, and related copy.

### Changed
- Number Input: the value field is now a fixed compact width (3.5rem, was an unconstrained native input), native webkit/moz spinners are hidden, and horizontal padding tightened — digits sit centered in a properly sized middle section.
- Tooltip docs: the icon-toolbar example container radius reduced 2xl→xl so it is concentric with the inner buttons' hover radius (inner 12px + 4px padding = outer 16px).
- CSS cascade: `vt-*` utilities now come last in the bundle, so a utility on a component instance wins over the component's base style. Before, `.vt-toolbar-btn`'s fixed 36px width beat `vt-w-auto` (toolbar labels overlapped) and `.vt-avatar`'s grey background beat `vt-bg-info-fill` (initials avatars lost their color) — both visible on the docs site itself, surfaced via Storybook.
- Table: container radius reduced from `radius-2xl` (24px) to `radius-xl` (16px in the default theme; editorial 14px, rounded-sans 18px). Header rows use `surface-subtle` instead of `surface-moderate` (both `.vt-table thead` and the Data Table examples).

### Changed (Storybook)
- The sidebar now also lists CSS-only components — everything with a docs page that the Figma plugin doesn't generate (Calendar, Carousel, Collapsible, Data Table, Timeline, templates, …) — labeled with a "(css)" suffix; 71 components total.
- All stories render centered; leaf components with recipe axes get an auto-generated "All Variants" grid alongside the docs examples.

### Added
- JS bundle: `UCCalendar` — day selection for `[data-calendar="single|range"]` grids (single click-to-select; range start→end with middle fill, reversed picks swap). Date Picker docs got interactive presets (active state + trigger label update) and an interactive selectable list example.
- Calendar day states `vt-outside`, `vt-range-start/middle/end` — the docs used these classes but they were never styled.
- Gradient utilities `vt-from-info-fill`, `vt-to-info-fill/70` — the transparent-header docs example referenced them; without a backdrop its white text sat on the page background in light mode.

### Changed
- Dropdown menus: container radius raised to `--radius-xl` (1rem); with the 0.25rem padding the menu items' `--radius-lg` corners are now concentric (16 − 4 = 12).
- Auth template examples use the Veritheme logo instead of a colored placeholder square.
- Sidebar Nav compact example: icons downsized to the standard `vt-w-4` (the `vt-w-4.5` class it used doesn't exist, so icons fell back to the SVG's 24px attribute).
- Avatar Group "with status": the example no longer stacks avatars — with overlap the status dots inevitably collide with the next avatar; statuses now sit on a spaced row.
- Calendar range selection renders as one continuous band: the tint is drawn with pseudo-elements that bridge the grid gaps, capped by the brand circles on the start/end days (was: detached squares per day).

### Fixed
- Dropdown menu (JS bundle): the outside-click closer was shutting combobox panels (they share the `vt-dropdown-menu` class) — a combobox dropdown flashed open and immediately closed; combobox-owned menus are now skipped.
- Dropdown menu (JS bundle): re-initialization after `astro:after-swap` never bound triggers added after the first page load — the body-level init guard short-circuited the whole init. Document-level listeners now register once while trigger binding runs on every init, so dropdowns work after soft navigation (and in Storybook).
- Accordion: opening an item clipped its bottom padding. `openContent` measured the panel while `padding-bottom` was still mid-transition, so the frozen `max-height` came out ~16px short and the text sat flush against the item border. The measurement now runs with transitions suppressed (and the init path reuses `openContent` instead of duplicating the buggy math). Surfaced by Storybook, but reproducible on the docs site by clicking any accordion item.
- Site: 80 `vt-inline-*` demo rules dropped by an earlier `migrate:styles` rerun are back — the spacing/typography scale visuals, progress bars, resizable/scroll-view/empty-state/stats-card/select/rating/date-picker/collapsible/file-upload demos (and their `/docs/` mirrors) had been rendering unstyled. `scripts/migrate-component-styles.mjs` now preserves generated rules and extracted `<style>` sections that pages still reference instead of rebuilding both files from scratch, so already-migrated pages can't lose their styles again.
- Site: the ⌘K search overlay and the topbar search/GitHub icons were completely unstyled (the overlay markup rendered inline at the top of every page) — the `<style>` block extracted from `TopBar.astro` kept Astro's `:global(...)` wrappers, which are invalid selectors in a plain stylesheet. The migrate script now unwraps `:global()` on extraction, and the generated file was fixed.
- Site: the search palette linked to the removed Sheet page and to `/components/border-radius/` (404) — Sheet entry dropped, Border Radius now points at `/components/border/`.
- Site: the "UC Utilities" / "Dark Mode" hero badges on `/components/` rendered black text on the brand fill — they still carried the pre-refactor ad-hoc outline classes on a base `vt-badge` that is now brand-filled. Migrated to `vt-badge-bordered` (with neutral border/text overrides), and the Badge overview card now previews the real `vt-badge` / `vt-badge-secondary` / `vt-badge-bordered` variants instead of hand-rolled color overrides.

### Removed
- Figma plugin: the never-functional "Unsaved changes" hint markup was dropped from the Theme Editor footer (a CSS conflict had kept it permanently hidden; instead of surfacing it, the indicator was removed — draft persistence covers the lost-work risk).
- Figma plugin: the destructive debug-only "Clear file" button is hidden from the Components footer (markup and wiring kept; flip its inline `display` to bring it back for debugging).

### Fixed
- Figma plugin: the Badge preview was broken (a single "—" placeholder) — the UI never had a preview handler for the `badge` def type the canvas generates, and the defs carry their Variant/Color axes only in the name string. Added the mirrored preview handler and a def normalizer, so the full Filled/Bordered × 5-color matrix now renders.
- Figma plugin: the UI preview and the canvas generator each kept their own hardcoded copies of component metrics, and they had drifted apart. Shared tables now live in `src/shared/component-metrics.ts` (input/select states, chip, menu-item, alert/banner tones, toast content, progress colors, spacing scale), and the preview reads recipe-covered sizes (button, input, checkbox, radio, switch, avatar, progress) from `component-recipes.json` — the same source the canvas builds from. Drift fixed along the way: preview avatars rendered 32/40/48/64 px instead of the canonical 24/40/56/80; preview buttons used the pre-on-brand color logic (white text + darkening simulation) instead of the real `on/brand` + `brand/fill-hover` tokens, and their spacing keys resolved against an identity map (`'4'` → 4 px instead of 16 px) until the first theme edit patched it; alert/banner tints were simulated with color-mix instead of the real `*/background` tokens; the canvas progress bar was missing the Blue color the preview offered; three separate in-file copies of the button tables (one unreachable, with values that matched nothing) are gone.

## [1.3.0] — 2026-07-02

### Added
- Figma plugin: dark-mode theme editing is now enabled. The Theme Editor got a Light/Dark mode switch (the dark editor with all 25 semantic color tokens was built but hidden), and the Components page got back its light/dark preview toggle. Dark colors flow end-to-end: presets → editor → live preview → `Apply to Figma` (dark mode of the Palette collection) → read-back on plugin start. On the Figma free plan (no second variable mode) both switches hide themselves and the editor falls back to light.

### Changed
- Site topbar version is now derived from the root `package.json` instead of a hardcoded string, so it can never fall out of date again.

### Fixed
- Theme generator (`/themes/`): border radii didn't work — preset themes store radii in rem (`0.75rem`), but the generator parsed them with `parseFloat` and emitted the number as px, so previews rendered with `0.75px` corners instead of `12px`. Rem values are now converted to px on load, and exported `theme.json` radii are written back in rem, matching the preset format.
- Dark mode surface hierarchy unified across all themes: the page background is now the darkest tone and cards sit ~6 lightness points above it (standard elevation). Default already followed this (bg `0 0% 0%`, card `240 3% 6%`); editorial and rounded-sans had it inverted with a too-subtle 2-point delta (bg 10%, card 8%) — now editorial is bg `22 16% 4%` / card `24 16% 10%` and rounded-sans is bg `226 24% 4%` / card `226 24% 10%`. The docs dark demo (introduction.astro) was updated to match.
- Figma plugin: the palette preview in the UI rendered a stale hardcoded grey scale (pre-06.2026 redistribution, with a non-monotonic 700/800 step) and silently dropped the Brand row — it is now built from `tokens/palette.json`, the single source of truth.
- Figma plugin: font-loading timeouts no longer leave the losing `loadFontAsync` promise as a potential unhandled rejection.
- Figma plugin: re-applying a theme with a custom font (e.g. Manrope) threw `in setValueForMode: unloaded font "Manrope ExtraBold"`. Three causes fixed: `ensureFonts` never preloaded the Extra Bold face (used by all Display styles and H1); the `fontStyle` variables stored the generic face name ("Extra Bold") instead of the family's real one ("ExtraBold"); and typography variables were written while text styles were still bound to them, so Figma re-rendered mid-update against a not-yet-loaded font. Text styles are now unbound before the update and re-bound after, and `fontStyle` stores the family-resolved face name.
- Figma plugin: the Icons preview grid was missing 9 icons (Download, FilePlus, FolderPlus, FolderOpen, PanelLeft, CreditCard, Truck, RotateCcw, Calendar) that the plugin generates on canvas — the UI and canvas icon sets were two hand-synced copies that had drifted. Both now read from a single shared module (`src/shared/lucide-icons.ts`), so they cannot drift again.
- Public `veritheme` no longer references the private source repo: package `repository`/`bugs` now point to `tarasenko-by/veritheme`, and the README no longer links to the main repo.
- `@veritheme/mcp-server` reported a hardcoded `0.1.0` version to clients — it now derives the version from `package.json`. Also refreshed the bundled theme presets and aligned the specs `_meta.version` with the release version.

### Internal
- Figma plugin: the sandbox bundle no longer embeds the CSS/JS bundles, snippets and theme presets it never used — `build-plugin.mjs` now emits a `data.plugin.json` subset for `code.ts` (dist/code.js: 1 045 KB → 783 KB).
- Removed stale committed build artifacts `figma-plugin/code.js` and `figma-plugin/ui.html` (the manifest builds from `dist/`; these hadn't been regenerated since April).
- Changelog reminder: a `Stop` hook (`scripts/check-changelog-reminder.mjs`) blocks finishing a turn when product files changed since the last tag but `[Unreleased]` is empty.
- `publish-core` now ships `CHANGELOG.md` to the public mirror + npm; `release` cuts a GitHub Release on the public repo too.
- `release` now publishes `@veritheme/mcp-server` to npm alongside `veritheme` (and syncs its bundled data before committing) so the two packages never drift in version again.
- Bumped the MCP SDK to `^1.29.0` and migrated the server to the `registerTool`/`registerResource` API.

## [1.2.1] — 2026-06-24

### Added
- Per-accent on-color tokens (`on-brand` / `on-error` / `on-success` / `on-warning` / `on-info`) for correct text contrast on each accent surface.
- Full type scale and extended sizing/spacing grid (fixed px grid up to 96px), with the foundation tokens regrouped.
- Figma plugin: variable collections now ordered via numeric-prefixed names (`01 Palette`, `02 …`) so they sort predictably in Figma; plus a "Clear file" button.

### Fixed
- Editorial and rounded-sans theme contrast adjustments toward WCAG AA.

### Internal
- Release pipeline: `npm run release` (versioned, tagged, single source of truth) and `npm run deploy` (rsync + `VERSION` stamp on prod).

## [1.0.0] — 2026-04-17

First stable release.

### Added
- 47 components with recipe-based generation (Button, Badge, Avatar, Separator, Switch, Checkbox, Radio, Input, Textarea, Tabs, Breadcrumb, Card, Toast, Alert, and more).
- CSS slot API (`--btn-*` vars) for per-instance customization without selectors or `!important`.
- Design token system with 3 themes (default, editorial, rounded-sans), light + dark modes.
- Button `clear` intent variant — transparent background, primary text, subtle hover.
- Astro-based documentation site (94 pages) covering components, utilities, tokens, and examples.
- Figma plugin for generating component sets from recipes.
- MCP server for programmatic component spec access.
- Vanilla JS bundle (`veritheme.min.js` + `veritheme.min.css`) published as `veritheme` to npm and `tarasenko-by/veritheme` on GitHub.
- `@layer veritheme` cascade — any unlayered consumer CSS automatically wins without `!important`.
- `prefers-reduced-motion` a11y block.
- Logical CSS properties throughout (RTL-ready).
- CI: `vt-` prefix check, no-inline-styles check, token tests, full build.

### Known issues
- **WCAG contrast**: 32 token pairs fall below AA across editorial/rounded-sans themes. Default theme addressed; remaining themes queued for v1.1.
- **Scope**: 18 components (Dialog, Accordion, Slider, Button Group, Popover, Sheet, Sidebar, mini-variants) remain in `main.scss` pending recipe-engine extensions (`rawRules`, `@keyframes`, `[data-*]` selectors). Scheduled for v1.1.

[Unreleased]: https://github.com/tarasenko-by/veritheme-workspace/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/tarasenko-by/veritheme-workspace/releases/tag/v1.1.0
[1.0.7]: https://github.com/tarasenko-by/veritheme-workspace/releases/tag/v1.0.7
[1.0.6]: https://github.com/tarasenko-by/veritheme-workspace/releases/tag/v1.0.6
[1.0.5]: https://github.com/tarasenko-by/veritheme-workspace/releases/tag/v1.0.5
[1.0.4]: https://github.com/tarasenko-by/veritheme-workspace/releases/tag/v1.0.4
[1.0.3]: https://github.com/tarasenko-by/veritheme-workspace/releases/tag/v1.0.3
[1.0.2]: https://github.com/tarasenko-by/veritheme-workspace/releases/tag/v1.0.2
[1.0.1]: https://github.com/tarasenko-by/veritheme-workspace/releases/tag/v1.0.1
[1.4.4]: https://github.com/tarasenko-by/veritheme-workspace/releases/tag/v1.4.4
[1.4.3]: https://github.com/tarasenko-by/veritheme-workspace/releases/tag/v1.4.3
[1.4.2]: https://github.com/tarasenko-by/veritheme-workspace/releases/tag/v1.4.2
[1.4.1]: https://github.com/tarasenko-by/veritheme-workspace/releases/tag/v1.4.1
[1.4.0]: https://github.com/tarasenko-by/veritheme-workspace/releases/tag/v1.4.0
[1.3.0]: https://github.com/tarasenko-by/veritheme-workspace/releases/tag/v1.3.0
[1.2.1]: https://github.com/tarasenko-by/veritheme-workspace/releases/tag/v1.2.1
[1.0.0]: https://github.com/tarasenko-by/veritheme-workspace/releases/tag/v1.0.0
