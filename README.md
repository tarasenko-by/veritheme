<p align="center">
  <a href="https://veritheme.com">
    <img src="https://veritheme.com/og-image.png" alt="Veritheme — one source of truth for Figma, code &amp; AI" width="800">
  </a>
</p>

# Veritheme

**75 beautifully designed UI components.** Pure CSS utility classes, semantic design tokens, dark mode, and a vanilla JS bundle — no framework, no build step required.

**[veritheme.com](https://veritheme.com)** · [Docs & live demos](https://veritheme.com) · [Theme Generator](https://veritheme.com/themes/)

---

## What is Veritheme?

Veritheme is a framework-agnostic UI component library delivered as plain CSS and vanilla JavaScript. You style your markup with `vt-` utility classes and drop in `data-*` attributes for interactive behavior — the JS bundle wires everything up automatically. No React, no Tailwind runtime, no bundler needed.

It's built around a **2-layer design token system** (raw palette → semantic tokens) that keeps colors, spacing, typography, and radii consistent across light/dark modes and across three shipped themes. The exact same token format powers the website, the Figma plugin, and exported custom themes — so design and code never drift apart.

## Install

```bash
npm install veritheme
```

Or use it straight from a CDN with no install at all:

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/veritheme/veritheme.min.css">

<!-- JS (auto-initializes interactive components on DOMContentLoaded) -->
<script src="https://cdn.jsdelivr.net/npm/veritheme/veritheme.min.js"></script>
```

With a bundler:

```js
import 'veritheme/veritheme.min.css';
import 'veritheme'; // initializes interactive components
```

## What's in this package

| File | Description |
|------|-------------|
| `veritheme.min.css` / `veritheme.css` | All components + vt- utility classes + design tokens (minified / readable) |
| `veritheme.min.js` / `veritheme.js` | Vanilla JS for interactive components, zero dependencies |
| `themes/*.json` | Theme token files — `default`, `editorial`, `rounded-sans` |
| `theme-manifest.json` | Index of available themes (name, label, font, dark-mode support) |

Package exports: `veritheme/css`, `veritheme/js/unminified`, `veritheme/themes/*`, `veritheme/theme-manifest`.

## Usage

### Utility classes

Every utility uses the `vt-` prefix:

```html
<div class="vt-flex vt-items-center vt-gap-4 vt-p-4 vt-rounded-lg vt-bg-neutrals-surface">
  <span class="vt-text-fg-primary vt-text-sm vt-font-medium">Hello</span>
</div>
```

### Dark mode

Add `.dark` to `<html>`:

```html
<html class="dark">
```

### Themes

Add `data-theme` to `<html>` — choose `default`, `editorial`, or `rounded-sans`:

```html
<html data-theme="editorial">
```

### Interactive components

Markup uses `data-*` attributes as hooks; the JS bundle initializes them automatically:

```html
<div data-accordion="single">
  <div data-accordion-item>
    <button data-accordion-trigger>Title</button>
    <div data-accordion-content>Content</div>
  </div>
</div>
```

## Themes & the Theme Generator

Three themes ship in the box (each with a light and dark variant):

- **Default** — Inter, clean and neutral
- **Editorial** — Source Serif 4, editorial / long-form
- **Rounded Sans** — Manrope, soft and friendly

Want your own? The **[Theme Generator](https://veritheme.com/themes/)** lets you pick colors (light + dark), font, border radius, border width, and spacing scale — and watch every component restyle live. Export a ready-to-use CSS + JS bundle, or download a `theme.json` that drops straight into the Figma plugin so your design files re-theme to match. One file drives both code and design.

## Figma plugin

**[Veritheme — Design Tokens & UI Components](https://www.figma.com/community/plugin/1610343587499165100)** is a design system generator for Figma. Select the components you need, customize your theme, and generate production-ready design tokens and UI components directly into your file.

**What it does:**

- Generates Figma Variables — colors, typography, spacing, radius, borders, shadows
- Creates Light and Dark mode collections automatically
- Includes 45 UI components: buttons, form controls, navigation, feedback, and data display
- Lets you customize the theme — brand color, neutrals, typography, and semantic tokens — before generating
- Outputs a structured, token-driven component library ready to use in your designs

**Who it's for:** Designers and product teams who want a consistent, token-driven foundation without building a design system from scratch.

It shares the same `theme.json` format as the Theme Generator, so a theme designed in code re-themes your Figma library to match.

## Use with AI agents (MCP)

Veritheme ships an official MCP server, **[`@veritheme/mcp-server`](https://www.npmjs.com/package/@veritheme/mcp-server)** — AI assistants (Claude Code, Cursor, any MCP client) can query real components, design tokens, themes, and HTML snippets instead of guessing class names:

```bash
# Claude Code
claude mcp add veritheme -- npx -y @veritheme/mcp-server
```

```json
// any MCP client config
{ "mcpServers": { "veritheme": { "command": "npx", "args": ["-y", "@veritheme/mcp-server"] } } }
```

Tools: `list_components`, `get_component`, `get_tokens`, `get_theme`, `get_snippet`, `search`.

The site also serves [veritheme.com/llms.txt](https://veritheme.com/llms.txt) — a compact, LLM-friendly map of the library for web-browsing agents.

## The Veritheme ecosystem

| Package / repo | What it is |
|----------------|-----------|
| [`veritheme`](https://www.npmjs.com/package/veritheme) | This package — the CSS + JS distribution bundle |
| [`@veritheme/mcp-server`](https://www.npmjs.com/package/@veritheme/mcp-server) | MCP server exposing components/tokens/themes to AI agents |
| [Veritheme Figma plugin](https://www.figma.com/community/plugin/1610343587499165100) | Generate design tokens + 45 UI components into Figma |
| [veritheme.com](https://veritheme.com) | Docs, live demos, and the Theme Generator |

## License

MIT © Siarhei Tarasenko
