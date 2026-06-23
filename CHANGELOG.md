# Changelog

All notable changes to uicraft are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

_Add entries here as you work. `npm run release` freezes this section into a
dated version block. Use the Keep a Changelog headings: Added / Changed /
Deprecated / Removed / Fixed / Security._

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
- Vanilla JS bundle (`uicraft.min.js` + `uicraft.min.css`) published as `@uicraft/core` to npm and `tarasenko-by/uicraft-core` on GitHub.
- `@layer uicraft` cascade — any unlayered consumer CSS automatically wins without `!important`.
- `prefers-reduced-motion` a11y block.
- Logical CSS properties throughout (RTL-ready).
- CI: `uc-` prefix check, no-inline-styles check, token tests, full build.

### Known issues
- **WCAG contrast**: 32 token pairs fall below AA across editorial/rounded-sans themes. Default theme addressed; remaining themes queued for v1.1.
- **Scope**: 18 components (Dialog, Accordion, Slider, Button Group, Popover, Sheet, Sidebar, mini-variants) remain in `main.scss` pending recipe-engine extensions (`rawRules`, `@keyframes`, `[data-*]` selectors). Scheduled for v1.1.

[Unreleased]: https://github.com/tarasenko-by/uicraft/compare/v1.2.1...HEAD
[1.2.1]: https://github.com/tarasenko-by/uicraft/releases/tag/v1.2.1
[1.0.0]: https://github.com/tarasenko-by/uicraft/releases/tag/v1.0.0
