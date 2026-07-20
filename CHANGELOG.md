# Changelog

All notable changes to Veritheme are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

_Add entries here as you work. `npm run release` freezes this section into a
dated version block. Use the Keep a Changelog headings: Added / Changed /
Deprecated / Removed / Fixed / Security._

## [1.0.7] — 2026-07-21

### Fixed
- **Mobile top navigation.** The site header (`TopBar`) hid its nav below 640px with no replacement, so on the homepage (standalone header, no sidebar) mobile users couldn't reach Components / Examples / Generator / Storybook / Figma. Added a hamburger button (≤640px) that toggles a dropdown menu with the top-level links; Esc / outside-click / link-click close it. Desktop nav unchanged.

### Changed
- **Calendar examples polish.** Month/week example headers use a square page-btn for search and a full-size primary "New event"; preview snapshots re-shot to match.

## [1.0.6] — 2026-07-18

### Added
- **Per-component interaction docs for AI.** Every interactive component spec now carries an `interactions` field (which states are automatic vs. how to trigger active/disabled/error/loading in markup), surfaced by `get_component` as `## Interactions` and in `llms-full.txt`. Fills the gap where child-element states (tabs→tab, accordion→item, nav) were invisible to AI. Documentation only — no CSS change.
- **Anti-patterns / common mistakes** listed in the MCP instructions, the design-system overview resource, and a new section on `/docs/design-principles` (rebuilding components, utility size/color overrides, info-as-brand, sub-12px, nested cards, hardcoded backgrounds, unlabeled icon buttons, multiple primaries, no empty state).
- **Container queries**: `vt-cq` (establishes an inline-size query container) + `vt-cq-sm:` / `vt-cq-md:` / `vt-cq-lg:` variants for the common reflow utilities, so a component adapts to its container instead of the viewport. Documented with a live demo on `/docs/utilities-layout` and in the MCP responsive rule.
- **RTL logical utilities**: `vt-ms-*` / `vt-me-*` (margin-inline), `vt-ps-*` / `vt-pe-*` (padding-inline), `vt-text-start` / `vt-text-end`.
- **Semantic-first principle** in the MCP generation rules and the Design Principles page: the token/class names ARE the design intent, so match the content's meaning to the name (success = positive, warning = caution, error/danger = failure/destructive, info = neutral notice + focus, accents-brand = product accent; mains primary→quaternary = most→least important; surfaces = elevation; typography classes = role) rather than picking by appearance. The existing colour/typography rules become the guardrails under this framing.
- **Calendar example pages.** Two new full-page examples under `/examples/` — a month grid with meetings, tasks, and continuous multi-day event bars, and a week view with an hourly time grid, all-day events, and flat colour-coded blocks (tinted fill + left accent, the real-calendar look). Built entirely from Veritheme components and utilities across five named calendars, light + dark.

### Changed
- **Components are now RTL-safe internally.** Physical directional properties in the recipes (padding/margin/border-left/right, text-align, and asymmetric padding/margin shorthands) were converted to logical properties (`padding-inline-start`, `border-inline-end`, `padding-inline`, `text-align: start`…). Identical rendering in LTR; correct mirroring under `dir="rtl"` (verified: sidebar link padding flips). Placement variants (tooltip/popover left/right) and directional positioning remain physical for now.

## [1.0.5] — 2026-07-18

### Fixed
- **Bordered secondary badges used the dark text color as their outline.** `vt-badge-bordered` set `border-color` to `--badge-accent`, which for the neutral `secondary` color is `mains-secondary` (a body-text grey) — so tag-list badges (Astro, React, …) had a heavy dark outline instead of a subtle one. A new `--badge-border` variable defaults to the accent (colored bordered badges keep their intent-colored outline) but `secondary` now maps it to `border-strong`, matching chips and other bordered controls. Also refreshed a stale docs line ("VT Utilities" tag, badge icon now documented as 14px).

## [1.0.4] — 2026-07-18

### Fixed
- **`vt-card` no longer overrides margin/typography utilities on nested `h3`/`p`.** The card's built-in content defaults (`h3 { margin: 0 0 4px }`, `h3 + p { … }`) used a plain descendant selector whose specificity beat utility classes — so `vt-mt-3` and friends on a card title were silently ignored (e.g. the kanban card badge sat flush against its title). The defaults are now wrapped in `:where(.vt-card)` (zero specificity): a bare `<h3>` still gets the default spacing, but any utility on card content now wins. Audit: card was the last recipe with this utility-overriding pattern — badge's forced icon size was fixed in 1.0.3; avatar `img` (100% fill) and select `> svg` (internal chevron) are legitimate and untouched.

## [1.0.3] — 2026-07-18

### Fixed
- **Badge leading icons were oversized (20px), inflating badge height.** `.vt-badge > svg/img` forced 20×20 icons, overriding the demo's utility sizes — so an icon badge rendered 29px tall (full-stadium) instead of 24px, making bordered "Featured"-style badges look inconsistent next to plain ones. Icons are now 14×14, keeping every badge 24px tall; the demo drops its redundant `vt-w-3` overrides (component-first).

### Changed
- **`vt-api-table` restyled to match `vt-table`** — the API Reference / Accessibility tables on every component page now share the standard table look: `radius-xl` container, `surfaces-subtle` header without uppercase, `font-size-sm` cells. The bespoke colored `vt-api-type--*` chips are gone; class types render as `vt-badge vt-badge-soft vt-badge-secondary` (intent colors stay reserved for semantic states).

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
- Utility `vt-self-center` (`align-self: center`); gradient stop `vt-to-accents-brand/70`; `vt-decoration-accents-brand/30`.

### Fixed
- **Brand-vs-blue rule enforced in components**: `vt-tree-view` active item and `vt-resizable` handle hover now use `accents-brand` instead of `info-primary` — interactive/selection states belong to the brand accent; blue `info-*` is reserved for informational states and focus (matches `vt-sidebar-link`, `vt-calendar-day`, `vt-timeline-dot`, `vt-nav-item`).

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
- The blocks compiler validates color tokens against the live token set and reports dead token references found in docs markup (substituted with `surfaces/subtle` on canvas).

## [1.4.4] — 2026-07-04

### Changed
- Sidebar text bumped from 12px (`--font-size-xs`) to 14px (`--font-size-sm`) — nav links, group buttons, section labels, the view toggle, and the search input all move up one step, preserving the size hierarchy (uppercase headers stay bold caps, sub-items stay normal weight). The 10px count badge is unchanged. Single recipe change (`components/sidebar.json`).

## [1.4.3] — 2026-07-04

### Changed
- ExampleBlock (the "Preview / Code" block used on every component and docs page) now matches the `vt-table` container: its header bar uses `surfaces-subtle` (was the darker `surfaces-moderate`) and the block/header/code-panel corner radius is `radius-xl` (was `radius-2xl`), so the header reads as the same light, rounded surface as table headers across the whole site. Single recipe change (`components/example-block.json`) → propagates everywhere.

## [1.4.2] — 2026-07-04

### Changed
- Foundation "token tables" (Size Scale, Token Syntax, color/type/border/effects reference tables on the docs and component foundation pages) now inherit the real `vt-table` component's header styling instead of hand-overriding it. Every table header row dropped its ad-hoc background (`vt-bg-surfaces-moderate`/`-moderate/50`/`-subtle`) and every header cell dropped the utilities that `.vt-table th` already provides identically (`vt-text-left`/`-px-4`/`-py-3`/`-py-2`/`-pr-4`/`-font-semibold`/`-font-medium`/`-text-xs`/`-text-mains-quaternary`) — only structural classes (column widths, right/center alignment) remain. So the reference tables now match the `vt-table` used on component pages instead of carrying a slightly different, hand-built header. Applied across all 10 foundation pages (`docs/{typography,utilities-layout,spacing,design-system,border,colors}`, `components/{spacing,typography,colors,border}`).

## [1.4.1] — 2026-07-04

### Added
- Four new design-system components, promoted from page-local demo markup to real recipes (`components/*.json` → generated CSS, shipped in `system.scss`, shadcn registry `/r/`, MCP specs, Storybook): **Combobox** (`vt-combobox-wrapper` + `-item`/`-group`/`-tags`/`-tag`/`-icon`/`-button-label`/`-empty`), **Command** (`vt-command-wrapper` + `-input`/`-list`/`-group`/`-item`/`-separator`/`-empty`), **Tree View** (`vt-tree` + `-item`/`-toggle`/`-chevron`/`-children`/`-leaf`/`-active`), and **Resizable** (`vt-resize-handle` + `-col`/`-row` orientation). Their pages previously referenced these classes with no CSS behind them (the styling was lost in an earlier refactor), so the demos rendered unstyled; now they're first-class components.
- Utility generator (`generate-vt-utilities.mjs`) filled in ~50 standard utilities the docs pages already used but that were never emitted — so every `vt-*` on the site resolves to our CSS: the `2.5` step across spacing/width/height, width fractions (`1/4`, `4/6`, `5/12`), `vt-flex-row`, `vt-h-screen`/`-auto`/`-px`, `vt-w-px`/`-fit`/`-52`, `vt-max-w-4xl`/`-6xl`, `vt-col-span-1..6`, `vt-mt-auto`, `vt-place-items-center`, `vt-border-0`, `vt-font-black`/`-sans`, `vt-leading-snug`, `vt-break-all`, `vt-list-disc`/`-decimal`/`-inside`, `vt-underline-offset-2`, `vt-rotate-45`, `vt-translate-y-24`, `vt-drop-shadow-md`, `vt-cursor-text`, `vt-bottom-6`/`-right-6`, more responsive (`sm:flex`, `sm:col-span-1`, `md:grid-cols-3`, `lg:flex`, `lg:grid-cols-6`), hover/focus-visible/focus-within/group-hover variants, gradient `from-*`/`to-*` stops, and a batch of arbitrary sizes used on specific cards.

### Changed
- Sitewide pass to make every page reference the design system instead of hand-building visuals with utilities: where a real component/class exists, the markup now uses it. Renamed invented classes to their real equivalents — `form.astro` `vt-form-field`/`-hint`/`-error`/`-message` → `vt-field`/`vt-field-description`/`vt-field-error` (these were taught verbatim in the copy-paste code examples), `vt-chip-btn`/`-selected` → `vt-chip`/`vt-chip-active`, `vt-separator-vertical` → `vt-separator-v`, `vt-nav-link`/`vt-link-external` → `vt-nav-item`/`vt-link`, `vt-tag`/`-selected` → `vt-chip`/`vt-chip-active`. Replaced hand-rolled component visuals with the component class + modifier — showcase's faux segmented buttons → `vt-btn-group` + `vt-btn`, faux chips → `vt-chip`/`vt-chip-active`, pricing-card "Popular" ribbon → `vt-badge vt-badge-primary`, the overview status pill → `vt-chip vt-chip-active`, sidebar-nav notification count → `vt-count-badge`, page-layout's hand-sized buttons → `vt-btn-sm`.

### Fixed
- Page-local helper classes that had no CSS anywhere (rendered unstyled) now reference real CSS: `vt-tabs-content`, `vt-theme-toggle`/`vt-select-wrapper`, `vt-drag-scroll`, `vt-list-check`, `vt-sidebar-overview`, `vt-color-format-btn`, `vt-component-section`, `vt-size-label` got scoped `<style>` blocks; `vt-hover:bg-neutrals-overlay` (no such token) → `vt-hover:bg-surfaces-subtle`; `vt-!p-0` (defined without the `vt-` prefix) → `!p-0`.

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
- Utilities: filled the gaps the docs already relied on — `vt-bg-success-primary` (+ `/10–/50` tints), `vt-border-success-primary/30`, `vt-border-warning-primary/30`, `vt-border-error-primary/30`, `vt-border-input`, `vt-bg-accents-yellow`, `vt-bg-border-strong`, `vt-bg-mains-quaternary/20`, `vt-text-generic-white/70,80`, `vt-text-success-primary/40`, `vt-text-mains-quaternary/20`, `vt-bg-gradient-to-t`. The success-colored chip dot was invisible everywhere because `vt-bg-success-primary` didn't exist.

### Added
- JS bundle: `UCRadioGroup` + `selectRadio(group, el)` global — custom radio groups now work out of the box (the dropdown-menu's radio-item helper was renamed to `selectMenuRadio` to free the name; it was silently shadowing the radio-group handler). `UCToast.show` creates its `#toast-container` host on first use instead of silently doing nothing when the page doesn't provide one.
- Tree View styles (`vt-tree-*`) moved from a docs-page-local `<style>` block into the design-system bundle — bundle consumers used to get unstyled markup.
- Site: Storybook link in the topbar navigation (`/storybook/`; hidden below 960px where the nav runs out of room).

### Fixed
- Border docs (both `/docs/border` and `/components/border`): the radius scale used a stale ad-hoc naming (`micro/tiny/small/medium/large/big/huge`) with values (2px, 6px) that no longer exist in the token set. Both pages now show the canonical scale used by the tokens and the Figma plugin — `none 0 / xs 4 / sm 8 / lg 12 (base) / xl 16 / 2xl 24 / 3xl 32 / 4xl 40 / full` — and preview swatches use the real `vt-rounded-*` utilities instead of hard-coded px classes. Added the missing `vt-rounded-xs` and `vt-rounded-4xl` utilities (`--radius-xs`/`--radius-4xl` already existed as tokens).
- Switch: a `vt-bg-*` color utility on an active switch was overridden by `.vt-switch.vt-active`'s brand background (specificity) — colored switches rendered blue until re-toggled. The brand fill now yields to color utilities.
- Avatar docs: the "lg" example used the `vt-avatar-xl` class, making lg and xl identical (80px); lg is 56px again.
- Progress/File Upload docs: several migrated inline-style classes referenced the removed `--accents-blue` token — fills and icons rendered transparent. Rewritten with semantic utilities (`vt-bg-success-primary`, `vt-bg-accents-yellow`) and the token reference fixed to `--info-primary`.
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
- CSS cascade: `vt-*` utilities now come last in the bundle, so a utility on a component instance wins over the component's base style. Before, `.vt-toolbar-btn`'s fixed 36px width beat `vt-w-auto` (toolbar labels overlapped) and `.vt-avatar`'s grey background beat `vt-bg-info-primary` (initials avatars lost their color) — both visible on the docs site itself, surfaced via Storybook.
- Table: container radius reduced from `radius-2xl` (24px) to `radius-xl` (16px in the default theme; editorial 14px, rounded-sans 18px). Header rows use `surfaces-subtle` instead of `surfaces-moderate` (both `.vt-table thead` and the Data Table examples).

### Changed (Storybook)
- The sidebar now also lists CSS-only components — everything with a docs page that the Figma plugin doesn't generate (Calendar, Carousel, Collapsible, Data Table, Timeline, templates, …) — labeled with a "(css)" suffix; 71 components total.
- All stories render centered; leaf components with recipe axes get an auto-generated "All Variants" grid alongside the docs examples.

### Added
- JS bundle: `UCCalendar` — day selection for `[data-calendar="single|range"]` grids (single click-to-select; range start→end with middle fill, reversed picks swap). Date Picker docs got interactive presets (active state + trigger label update) and an interactive selectable list example.
- Calendar day states `vt-outside`, `vt-range-start/middle/end` — the docs used these classes but they were never styled.
- Gradient utilities `vt-from-info-primary`, `vt-to-info-primary/70` — the transparent-header docs example referenced them; without a backdrop its white text sat on the page background in light mode.

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
- Figma plugin: the UI preview and the canvas generator each kept their own hardcoded copies of component metrics, and they had drifted apart. Shared tables now live in `src/shared/component-metrics.ts` (input/select states, chip, menu-item, alert/banner tones, toast content, progress colors, spacing scale), and the preview reads recipe-covered sizes (button, input, checkbox, radio, switch, avatar, progress) from `component-recipes.json` — the same source the canvas builds from. Drift fixed along the way: preview avatars rendered 32/40/48/64 px instead of the canonical 24/40/56/80; preview buttons used the pre-on-brand color logic (white text + darkening simulation) instead of the real `on/brand` + `brand/hover` tokens, and their spacing keys resolved against an identity map (`'4'` → 4 px instead of 16 px) until the first theme edit patched it; alert/banner tints were simulated with color-mix instead of the real `*/background` tokens; the canvas progress bar was missing the Blue color the preview offered; three separate in-file copies of the button tables (one unreachable, with values that matched nothing) are gone.

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

[Unreleased]: https://github.com/tarasenko-by/veritheme-workspace/compare/v1.0.7...HEAD
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
