# Changelog

All notable changes to Veritheme are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

_Add entries here as you work. `npm run release` freezes this section into a
dated version block. Use the Keep a Changelog headings: Added / Changed /
Deprecated / Removed / Fixed / Security._

## [1.3.0] — 2026-11-19

### Added

- **Figma plugin: a new window (review 19.11.2026).** A narrow icon rail
  switches between Generate, Check and Settings; each name is the item's
  tooltip and aria-label. Generate gives the whole window to the components:
  each is a card showing the variant its artboard previews, grouped as on
  the Components page. A card's corner control leaves it out of the run (a
  bin) or adds it back (a plus); a component another one needs shows a
  padlock whose tooltip says by whom — glyphs and words, not red against
  green. The whole card opens its detail in the same window: variants,
  properties, sizes, anatomy and what it builds with. A foundation's detail
  is its board as Generate draws it: Palette, Colors, Typography, Sizing &
  Spacing, Border Width, Shadows, Layout and Icons. "Open design system
  builder" and Upload theme sit in the header, a loaded theme is a chip
  there, and a theme file can be dropped anywhere on the window. The count,
  Select all and Clear are in the footer; the Last run note and the error
  boxes take their own row above it instead of covering the list. Settings
  holds One page, Annotations, Rebuild all, Report a problem and the build
  stamp (and, in a testing build, Clear file). The window follows Figma's
  light or dark theme and wears Veritheme's default theme; a loaded system
  shows in the previews only, never in the window's own corners, colors or
  type. Every scrolling region has the custom scrollbar. The "system on a
  page" preview is gone.
- **Figma plugin: back and forward.** The mouse's side buttons, Alt+Left /
  Alt+Right (Cmd+[ / Cmd+] on macOS) step between sections and into a
  detail and back, and the list comes back at the scroll it was left at.
  Escape and the detail's back button step back too. A running Generate is
  left alone.
- **Figma plugin, Check: what it reads and why a rule matters.** A line
  under the title says what Check is for (screens built with the system,
  before code) and what it runs on (the selection, or every frame of the
  page); each step — Prepare, Check, Export — says what it does and what
  comes of it. The status says what a run read ("Checked the whole page: 12
  frames."), and a finding shows, under its rule, why it matters.

- **Breakpoints and opacity are tokens.** `breakpoint` — sm 640, md 768,
  lg 1024, xl 1280 and the new 2xl 1536 — and a short `opacity` scale — 0,
  5, 10, 20, 50, 80, 100 and the role `disabled` (50) — live in
  tokens/base.json and come out as `--vt-breakpoint-*` and `--vt-opacity-*`.
  A media query cannot read a custom property, so the library's own queries
  and the `vt-sm:`/`vt-md:`/`vt-lg:` utilities are written from the same
  tokens at build time (a generated Sass map, `vt-col-2xl-*` included);
  the phone root's switch and the large type's phone step sit on md. The
  `vt-opacity-*` steps of the scale read their token. In Figma they are FLOAT
  variables in 04 Primitives: `breakpoint/*` for a frame's width and
  `opacity/*` for a layer's opacity.
- **Figma: icons from Hugeicons, on the Foundations page.** The plugin's icon
  set is Hugeicons (free, stroke-rounded, MIT license) instead of Lucide; the
  only drawing of Veritheme's own is the Empty placeholder. The icons keep
  the names the components ask for (X, ChevronDown, Check, LoaderCircle…),
  so an instance swap and a rebuild find them as before, and the set gains
  icons a slot can default to — MoreHorizontal, MoreVertical, Search,
  PanelLeft, Settings, Trash, the intents (Info, CircleAlert, TriangleAlert,
  CircleX) and more, 51 in all. The Icons board sits last on the Foundations
  page with the MIT notice under the grid; each icon's description carries
  the credit, so it travels with the component under Annotations: None too.
  In the plugin panel, Icons is a row of the Foundation group.
- **The Icons page shows the library's set.** /docs/icons lists the 54 icons
  the library and the plugin draw, grouped by purpose (controls, actions,
  intents, things), copies an icon's SVG on click, points to hugeicons.com
  for the full free set and carries the MIT notice. The site no longer
  imports Lucide. The MCP server offers Hugeicons (stroke-rounded, 1.5) as
  the default set for a project with no icons of its own, and an icon
  placeholder from Figma takes a 1.5 line when nothing says otherwise.
- **Large type for sites: Heading/XL and Display/SM, MD, LG.** Four text
  styles above Heading/LG, on the font-size steps 5xl–8xl: Heading/XL 48/56,
  Display/SM 60/68, Display/MD 72/80, Display/LG 96/104, weight 600 like the
  headings, tracking −2 % to −3 %. Classes `vt-heading-xl`, `vt-display-sm`,
  `vt-display-md`, `vt-display-lg` (`vt-display` keeps its Heading/LG look).
  On a phone, below the md breakpoint, each drops one step (to 36, 48, 60,
  72 at the 16px root, on top of the phone's 14/16 root) — in CSS through a
  media query on the `--vt-type-*` variables, in Figma through a variable of
  its own in the Rems collection whose Mobile mode points at the smaller
  step. The Rems scale gains 4.25rem and 6.5rem for the display line
  heights. The Display/XL and Display/2XL names, aliases nothing used, are
  gone.
- **Motion tokens for the rest of the library's movement.**
  `--vt-motion-duration-instant` (100ms, a response under the hand), the
  looping durations `--vt-motion-duration-loop-fast|normal|slow|calm` (1s,
  1.5s, 2s, 3s) and the curves `--vt-motion-ease-linear`, `-pulse` and
  `-decelerate` join the motion group, so every duration and curve in the
  components can be a token. A component's `motion` record accepts
  `duration: "instant"` and `ease: "linear"`. Values match what the
  components use today; nothing moves differently yet.
- **Button: an open menu looks pressed.** A button whose menu is open — or
  the one picked in a toolbar — shows its variant's pressed fill (a ghost one
  its primary text color, as a real press does: `:active` comes with
  `:hover`). The trigger of an open menu gets that look from
  `aria-expanded="true"`, which the dropdown (HTML bundle and
  `@veritheme/react`) already sets: no class to add. `vt-active` gives the
  same look by class, in React `active`. In Figma there is no separate
  Active (the owner, 16.11.2026): it is State=Pressed, 200 variants instead
  of 216, and a Pressed instance reads back as `vt-active`. A rebuild moves
  every State=Active instance to Pressed. The master's icons (left, right and
  icon-only) default to Empty, so a button drawn from the set brings no glyph
  of its own.
- **List: the heading as typed, and a row's own divider.**
  `vt-list-section-as-typed` (Heading Case=As Typed in Figma, `headingCase="as-typed"`
  in React) shows a section heading as written, in Caption, instead of the
  uppercase overline — Figma does not keep a text case or style override on
  that layer of an instance, so it is a property now. A row draws its own
  line on top with `vt-list-item-divider` (full width) or
  `vt-list-item-divider-inset` (12px in from each side): Divider on List Item
  in Figma (None by default), `divider` in React, so a row added to a list's
  slot carries its line. Inside `vt-list` such a row drops the list hairline.
  A rebuild keeps old rows on Divider=None and old lists on Upper.
- **Button: an extra-small size.** `vt-btn-xs` (Size XS in Figma, `size="xs"` in
  React) is 24px tall: 8px side padding, a 12px label, a 16px icon, the xs
  radius; an icon-only one is a 24px square. For an action inside a dense row
  or card (a Reset in a usage card).
- **Nav Group: the toggle's end and its state.** The toggle row ends with the
  chevron by default; in `@veritheme/react` `trailing` replaces it (an agent's
  count) or removes it (`null`). The toggle says `aria-expanded` in the markup
  (true when open), as the script and the React group keep it.
- **Nav Group: a rail.** `vt-side-nav-section-rail` (Rail in Figma, `rail` in
  React) draws a 1px line down the center of the group's icon column and moves
  the nested rows so their text lines up with the group's label. Off by
  default: the section looks as before. The Nav Group stylesheet is now part
  of `veritheme.css` (it was empty until now and was left out).
- **Timeline: a compact size.** `vt-timeline-item-sm` (Size SM in Figma, `size="sm"`
  in React) is for dense lists such as an agent's steps: 32px rows, a 16px rail
  with a 1px line, 12px to the text, a plain 16px icon (`vt-timeline-icon`,
  colored by the state) instead of the badge, the title in Body/SM and the
  description in Caption. A link such as Try again goes in the Actions slot, on
  the title's row. Timeline's Size passes to its events; MD stays the default.
- **Figma: a Header takes its own logo, an Empty State any picture.** Header's
  logo is the Media slot before the name: the logo by default, an agent's
  mascot or a picture of one's own instead (Show Logo becomes slot content; a
  rebuild empties the slot where the logo was hidden). Empty State's Media
  slot is open: a project's picture belongs there as much as an IconBadge.
- **Sidebar Nav: actions in the header, a Footer slot.** A button (New chat,
  collapse) in `vt-side-nav-header` goes to the end of the row. In Figma the
  header ends with a Header Actions slot, empty by default (the title takes
  the free space), and the footer's rows are the Footer slot (Help by
  default; an account row or a button of one's own). Show Header stays.
- **Dropdown Menu: placement.** `vt-dropdown-menu-up` opens a menu above its
  trigger (an input at the bottom of the screen) and `vt-dropdown-menu-end`
  aligns it to the trigger's right edge; they combine. The script still
  flips a menu to the other side when it would leave the window, and places a
  menu shared by several triggers by the right edge too when it has -end. In
  Figma the open menu is drawn where it opens, so the side and the edge
  follow from its place next to its trigger, not from a variant.
- **Figma plugin: Prepare for code.** A new button next to Check in Export for
  code looks at the selected frames (or the page) for what the code will
  need, and proposes:
  - a name for each frame Figma named, from what it holds (two buttons are
    "Actions");
  - a component property for each layer that a project component's
    instances edit (a text that differs, a layer shown on some only);
  - an Icon/Name component for each loose icon-sized drawing, one per name;
  - a fill for a project icon whose drawing has none of its own (it showed
    only where an instance colored it): the color an instance gave it,
    bound to its token, or the primary text color;
  - the name "path" for the one drawing of an icon put into a library
    component, so the component colors it.
- **Figma plugin: icons keep their drawings in Export for code.** An icon the
  read left without a drawing gets its main component's drawing (for a
  set, the variant the instance shows). Figma does not export a layer that
  a clipping container hides whole: a row below the fold of a scrolled
  area had empty icons in code.

  Uncheck what you disagree with, then Apply. The code reads better for it: a
  class, a prop or an icon takes the name instead of a hash or a layer path.
- **Figma: a notification dot sits on what it marks.** What NotificationBadge
  marks is the Content slot: the icon button or avatar by default (Anchor),
  or a logo of one's own. The dot and the count are pinned to the corner of
  what is in it, so on a 16px logo the dot is on the logo, not 32px away at
  the corner of a 40px button. A rebuild moves the button or avatar an
  instance had (with its swap and edits) into the slot. Markup and CSS are
  unchanged.
- **Menu Item: a submenu chevron.** `svg.vt-command-item-chevron` ends a row
  that opens a nested menu ("Move to project ›"; give the row
  aria-haspopup="menu"). In Figma it is a ChevronRight icon in the row's
  Trailing slot, and a pin in a NavItem's Trailing slot is accepted the same
  way. An empty slot no longer takes the 100×100 of a new frame and no longer
  squeezes the label beside it.
- **Figma: Nav Group, a collapsible section of a sidebar.** A new Figma
  component for div.vt-side-nav-section[data-vt-sidebar-collapsible]: a
  toggle row (a Nav Item with its icon, label and count or chevron, exposed
  on the instance) and the nested rows as the Items slot. Open=True/False is
  .open, which the Sidebar Nav script already toggles; State=Hover is the
  toggle row's hover. The Sidebar Nav's Content slot offers it (an agent with
  its chats, a project with its pages). Markup and CSS are unchanged; its
  styles live with Sidebar Nav.
- **Figma: Sidebar Nav's body fills the panel.** The panel is drawn 720px
  tall (an example screen, as Page Layout), and its body takes the free
  height (flex: 1 in CSS): the footer sits at the bottom, not right under
  the rows.
- **Figma: Page Layout's main column is a slot.** The main column of each
  layout (Stacked, Sidebar, Holy Grail) is the Content slot: an instance puts
  the page's own content there instead of the placeholder skeletons, and it
  stays when Layout changes. Markup and CSS are unchanged.
- **Figma: more slots — Popover, Empty State, Dialog, Sidebar Nav.**
  - Popover: its buttons are the Actions slot (Show Actions stays).
  - Empty State: the icon is the Media slot (an illustration goes there
    instead), and the buttons the Actions slot. Show Icon is gone: a rebuild
    empties the slot of an instance that hid its icon.
  - Dialog: the footer starts with a More Actions slot, empty by default (a
    third button, a "Don't ask again" checkbox); Show Cancel stays.
  - Sidebar Nav: the groups and rows of its body are the Content slot, for
    NavItems of one's own (top-level and nested).

  Markup and CSS are unchanged.
- **Figma: Header takes its own content.** The links of a Header are the
  Navigation slot inside its nav (the links by default; a Breadcrumb and a
  status Badge for a chat header), and the row of actions starts with the More
  Actions slot, empty by default, for icon buttons or a badge of one's own.
  Show Nav, Show Log In, Show Action, Show Search and the other toggles stay:
  they are on the parts around the slots. Markup and CSS are unchanged.
- **Figma: a Card's actions are a slot.** The footer of a Card (Footer=True)
  is the Actions slot: Cancel and Deploy by default, and an instance takes its
  own buttons or a Button Group there. Markup and CSS are unchanged.
- **NavItem: a chat row without a project component.** A nested row
  (`vt-nav-item-sub`) ends the way a top-level one does: a count, a Badge, a
  Switch or Checkbox take the end of the row, and `vt-nav-item-row` with its
  actions works around a nested link too. New: `svg.vt-nav-item-end-icon`, a
  16px state mark inside the link (a pin), centered on the row;
  `vt-nav-item-actions-hover` shows a row's actions only on hover, keyboard
  focus and on the current row (a More menu); a single action reserves room
  for one button (32px), not two. A nested row gains an 8px gap between the
  label and what ends it. In Figma a row keeps its CSS height (36, nested 32)
  whatever its Trailing slot holds, so a 32px icon button sits centered on it,
  and a nested row's label takes the free space, so what goes into the slot
  sits at the end. The variants stay 12. The count in NavItem and ListItem
  is an exposed instance: its Color (Danger, or Secondary for a quiet count
  without the red fill) is set on the row itself, without digging into it.
- **Badge: a status dot in Figma.** Badge gains Dot=False/True: a StatusDot
  (`vt-dot vt-dot-sm vt-dot-current`) before the label, in the badge's own
  text color — "● Waiting for you". The markup already allowed it; Figma
  could not draw it. 36 variants (18 before); the earlier ones are unchanged.
- **Menu Separator.** `.vt-menu-separator` (role="separator") is the divider
  between groups of rows in a Dropdown Menu or the Combobox list, a component
  in Figma that their slots offer next to MenuItem and MenuLabel — a
  separator could not be added to a menu slot before. `.vt-dropdown-separator`
  looks the same and still works; the menus look the same.
- **NavItem: the Trailing slot on a nested row.** A sub-level row (Level=Sub)
  has the Trailing slot too, empty by default: a pin, a More button or a
  count goes there, as on a top-level row. Its markup and look are unchanged;
  the variants stay 12.
- **Input and Textarea: a plain field; Input: a typed value in Figma.**
  `vt-input-plain` / `vt-textarea-plain` (Appearance=Plain) have no border,
  fill or focus ring of their own, for a field inside a container that draws
  them — a chat composer; the container shows the focus with `:focus-within`.
  In Figma, Input's Content=Value shows what was typed (a Value text in the
  field's own color; in code the `value` attribute) instead of the
  placeholder. Variants: Input 56 (20 before), Textarea 6 (4); the earlier
  ones are unchanged, pixel for pixel. Textarea's typed text waits for the
  translator to write a textarea's content.
- **Count Badge: a quiet count.** `vt-count-badge-secondary` (Color=Secondary
  in Figma) shows an amount that is not an alert — the items in a sidebar
  group: muted text, no fill, the same size. The default count
  (Color=Danger) is unchanged; in Figma CountBadge is now a set of 2 variants.
- **The end of a row is a Figma slot.** NavItem and ListItem take what sits at
  the end of the row in one Trailing slot: by default what they showed before
  (a count, now a CountBadge, a chevron; a value and the selection check in a
  list row), and a Badge, a small Switch or Checkbox or icon buttons fit too.
  Their Show Badge, Count, Show Chevron and icon-swap properties (and Show
  Value, Value on ListItem) are gone: a layer in a slot takes no property.
  Composites keep what they need of a slot with `{keep, parts}` or fill it
  with several instances. A row with actions is new markup:
  `.vt-nav-item-row` holds the link and `.vt-nav-item-actions` beside it, so
  no button sits inside a link; rows without actions are unchanged.
- **More Figma slots.** ButtonGroup (Buttons), Tabs (Triggers), Accordion
  (Items), Toolbar (Items), AvatarGroup (Avatars) and Timeline (Items) take
  their items in a slot whose frame exists only in Figma: the markup, the CSS
  and the canvas look are unchanged. Dialog gains a body slot (Content, in
  .vt-dialog-body) and Popover one between its header and actions, each with
  a sample paragraph; Field is now a Figma component with a Control slot
  (an Input by default; Textarea, Select or Combobox fit too). Each slot
  offers its parts as preferred instances. In Figma the Select component is
  the closed field: an open list is a Combobox or a Dropdown Menu.
- **Figma plugin: Annotations — Full, Compact, Minimal or None.** A new
  choice in the plugin's Settings, next to "One page", sets how much each
  generated artboard says around its components. **Full** (the default, as
  before) is the sidebar with the description, properties and links.
  **Compact** is the component's name and its short description above the
  variant table. **Minimal** is the variant table alone, with its axis and
  state labels and no title. **None** is the components alone: no title, no
  description, and the set without the axis labels around its grid. In a
  column of Compact, Minimal or None cards, a card at least two thirds as
  wide as the widest one takes its width, content on the left, so cards of a
  similar size share an even right edge; a much narrower card keeps its own
  width instead of a wide empty field. The
  component sets, their variants, properties, slots and names are the same in
  all four, so a rebuild with another choice moves instances to the new sets
  as usual and keeps their slot content. The choice is remembered per
  document.
- **Figma slots in containers.** Dropdown Menu (Items), Combobox (Options, the
  List frame), Command (Items, the List frame) and List (Items) are built with
  a Figma slot, the way Card's body already was: an instance takes its own
  rows there — a fourth menu row, a group label — without detaching. The
  slot offers its parts as preferred instances (MenuItem and MenuLabel in the
  menus, ListItem in the list) and asks for at least one; Figma shows that as
  guidance. Its default content is the example each variant had, so the
  components look the same. In markup, Dropdown Menu's rows can sit in
  `.vt-dropdown-items`, a plain column; menus without it work as before.
- **A library rebuild keeps your slot content.** Before the plugin swaps an
  instance to the rebuilt component it copies what the instance holds in its
  slots, when that differs from the default, and puts it back into the slot
  of the same name afterwards — also into a slot the owner made by hand,
  when the rebuilt component now has one on that layer. An instance whose new
  component has no slot of that name keeps its content and its old link, and
  the run's result names it.
- **Menu Item: a switch at the end; Menu Label.** An on/off row carries a
  switch at the very end — `vt-switch vt-switch-sm` as a decorative span
  (`aria-hidden`, `vt-active` when on), the row `role="menuitemcheckbox"`
  with `aria-checked`, so there is no button inside the row.
  `veritheme.toggleCheckbox` turns it; click, Enter and Space work and the
  menu stays open. **Menu Label** (`.vt-menu-label`, `role="presentation"`)
  is the one group heading for Dropdown Menu, Command and the Combobox list;
  `.vt-dropdown-label` and `.vt-command-group-heading` look the same and
  still work. In Figma, MenuItem gains Trailing=Switch Off/On (81 variants,
  from 69), MenuLabel is a component of its own with a Label text property
  and replaces the group labels inside Dropdown Menu, Command and Combobox,
  and Dropdown Menu gains Style=Toggles (5 variants, from 4). Existing
  variants are unchanged to the pixel.
- **Motion for Toast and Select.** A toast shown by `veritheme.showToast` now
  fades in and rises 8px, and closing it — the close button, its action or
  the timer — runs the same motion back and removes it when the transition
  ends (a timer covers a transition that never fires). The Select list fades
  and slides in and out like the Dropdown Menu (from below when it opens
  upward, `data-theme-direction="up"`); it is now hidden with `visibility`
  instead of `display: none`. Both use the motion tokens (150ms, `ease`).
  Keyboard and focus do not wait for the motion. To turn it off, the
  visitor's `prefers-reduced-motion: reduce` already does (the toast then
  appears and goes at once); for every visitor, set
  `--vt-motion-duration-fast: 0ms` on `:root`. The Combobox list was already a
  Dropdown Menu and moves the same way; a Command palette in a Dialog moves
  with the Dialog.
- **Motion tokens.** The theme gains motion steps: `--vt-motion-duration-fast`
  (150ms), `-normal` (200ms), `-slow` (300ms), `--vt-motion-ease-standard`
  (`ease`) and `--vt-motion-ease-fade` (`ease-out`), next to the existing
  `--vt-motion-ease-out`. Button, Checkbox, Radio, Select, Switch, Popover,
  Dropdown Menu and Dialog now read their durations and curves from them
  instead of literals; every transition keeps the same properties, durations
  and curves, so nothing looks different. `--vt-transition-*` stay as they are.
  Dropdown Menu and Dialog describe how they appear and disappear in one
  `motion` record in their contract.
- **Menu Item: description and an end check.** A row can carry a title over
  a short muted description (`.vt-command-item-content` with
  `.vt-command-item-title` and `.vt-command-item-description`; the icon and
  the check line up with the first line) and a check at the very end
  (`.vt-command-item-check.vt-command-item-check-end`, after a shortcut) for a
  pick-one row: `role="menuitemradio"` with `aria-checked`. The bundle keeps
  that role and `veritheme.selectMenuRadio` moves the check. In Figma, MenuItem
  gains the Description (False/True) and Trailing (None/Check Off/Check On)
  properties — 69 variants, from 48 — and Dropdown Menu a Style=Mode example
  (Appearance: Light, Dark, System). Existing rows and their markup are
  unchanged.
- **Figma → code:** `figma build <snapshot> --out <dir> --target react` writes
  the same page as a Vite + React + TypeScript project. It reads the markup the
  HTML build makes (the same walk, the same calls), so every state renders the
  DOM the HTML page renders. A project component is one `.tsx`: its instances in
  all the states merged into one tree, what differs between them a prop, a
  variant a union of the values the design shows, a layer one variant draws
  shown by that variant. The library components the design uses are written
  from their contract (`src/library/`); Progress and Switch carry their own
  behavior, and the vanilla bundle is not part of the project. The overrides
  the HTML build numbers by call (`fo-<call>-<n>`) are named by component,
  library component and rules, so a new artboard renames none of them. Each
  state opens with `?state=`.
  `index.html`, `public/vt/`, `src/states.ts`, `src/main.tsx` and
  `src/library/` are written on every build; `src/page.tsx`,
  `src/components/`, `src/data/` and the project files once, then they are the
  team's. The HTML build without the flag is unchanged, byte for byte.
- **Figma → code, React:** the prototype's transitions work in the React
  project, with no bundle: the page's state is React's. A project component
  does not know the page's states. An element of it that leads somewhere calls
  an event of its own, named by the layer in Figma (`onToggleSidebar`,
  `onSend`; the root's own is `onClick`, a hover `on…Hover`), and the events of
  the components it holds are passed on under the layer's name (`onAccount`).
  `src/states.ts` says what each component's events lead to in each state
  (`FLOW`), and `src/page.tsx` binds them with `{...events("sidebar")}`; a
  layer of the page itself leads there directly. As on the HTML page: the
  address follows the state (a click is a history entry, so back and forward
  work); the innermost element of a click inside a click wins; an element that
  is no link, button or field becomes a button for the keyboard (Enter, Space)
  while its event is bound; a hover lasts while the pointer stays where the
  element was; a frame that moves on by itself does after its pause, and
  `?hold` keeps it; a click in a field that leads to another state leaves the
  cursor in that state's field. The design's drawings are one sprite file,
  `public/vt/sprite.svg` (`<use href="/vt/sprite.svg#…">`), written on every
  build; `--sprite inline` puts it in `index.html` instead. The HTML build keeps
  its inline sprite by default.
- **Alert, Banner:** with `data-vt-dismiss` on the close button the bundle
  closes it: `vt-dismiss` fires on the alert or banner first (cancelable), then
  it is removed, and focus that was inside moves to the next control after it
  (or the one before) instead of falling to the page. `veritheme.dismiss(el)`
  does it from script. A close button without the attribute is the page's own,
  as before. Markup from Figma and from `get_component` carries the attribute.
- **Rating:** with `data-vt-rating` a rating is an input: one control with
  `role="slider"` (0 to the number of stars, `aria-valuenow`,
  `aria-valuetext`), hover previews, a click and the arrow keys (Home, End) set
  the value, `vt-rating-change` fires with `detail.value`,
  `veritheme.setRating(el, 4)` sets it from script; `data-vt-rating-half` moves
  by halves, drawn as `.vt-rating-half`. The filled and empty stars are taken
  from the markup (a heart rating stays hearts). Without the attribute a rating
  is a picture of a value, as before.
- **File upload:** with `data-vt-file-upload` (and an `<input type="file">`
  inside) the zone highlights while files are dragged over it (`.vt-dragover`),
  opens the picker on a click and on Enter or Space, and fires
  `vt-file-upload-change` with `detail.files` for a drop or a choice;
  `veritheme.openFileUpload(el)` opens the picker. The chosen files are the
  page's to show. Without the attribute the zone is the page's own, as before.
- **Figma → code:** a progress bar's value comes from the design. The reader
  measures how much of its track the bar fills (`progress-value`) and the
  engine writes it as `data-vt-progress` instead of the anatomy's example 60%;
  a snapshot without it keeps the example. The plugin builds Progress with its
  bar scaling horizontally, so a stretched instance keeps its share. **Figma
  files built before keep the fixed bar (144 px on a 240 px track) until the
  library is synced again from the plugin**; the library's fingerprints do not
  include it, so the plugin does not report Progress as changed: sync to get it.
- **Tests:** a contract test in `bundle-contracts.spec.js` for every bundle
  module that had none (accordion, carousel, chip, collapsible, number input,
  popover, resizable, scroll view, sidebar nav, slider, tabs, tree view); two of
  them mark known bugs of their module as expected failures.
- **Switch:** with `data-vt-switch` the bundle toggles a switch itself: a click
  flips `.vt-active` and `aria-checked` and fires `vt-switch-change`
  (`event.detail.checked`); `veritheme.setSwitch(el, true)` sets it from script.
  A switch without the attribute is left to the page's own script, as before.
  Markup from Figma and from `get_component` carries the attribute.

- **Figma → code:** the prototype comes with the markup. The reader reads each
  layer's transitions to another frame (click, hover, after a delay), and the
  element they start from gets `data-vt-go="<state>"`, `data-vt-go-hover` or
  `data-vt-go-after` with `data-vt-go-delay`; a new report section, “Prototype
  transitions”, lists them and says what the page's script has to do. A
  transition to a frame outside the read is named, not guessed.

- **Figma → code:** a project component of the design is a component in the
  markup too. Its root carries its class (the Figma name in kebab case, with an
  optional `componentPrefix`) and its variant as `data-` attributes
  (`State=Typing` → `data-state="typing"`); its layers are named inside it
  (`data-layer="composer.box"`), and what it looks like by itself comes in a new
  report section, “CSS of project components”, one rule per variant. Where an
  instance sits and how wide it is there stays with the place around it.

- **MCP, Figma → code:** `figma_to_markup` takes `parts`. Inside a project
  component every layer the translator draws (a frame, a text, a drawn field, a
  free icon) gets one class of the component, `<component>__<layer>`, instead of
  layout utilities and a `data-layer`; the declarations of those utilities and
  the exact values go to that class's rule in “CSS of project components”, in
  the order the stylesheet gives them. A layer that looks different in two
  variants keeps one class, with a rule per variant
  (`.aw-composer[data-state="typing"] .aw-composer__box`), and what every variant
  shares is hoisted into the rule without one, for the component's root too.
  Type classes, library components with their overrides, and the page's own
  layout keep their classes; `parts` implies `raw`, and without it the output is
  unchanged. The server ships the table it expands from, `data/utilities.json`
  (built by `sync-data`: one-rule utilities only), and exports
  `hoistComponentCss` for a caller that puts several calls together. On the
  Agents Web test page the markup goes from 7,727 utility classes to 1,280 and
  renders pixel for pixel the same.

- **Figma → code:** a check before handoff. One shared module,
  `handoff-check.mjs`, says what to fix in Figma (`fix`) and what to review:
  an instance drawn in Hover/Focus/Pressed, each frame the prototype never
  reaches from the first frame (one line each: "reached only from X, which
  nothing leads to"; or "the only frame with StepsToggle Expanded; closest
  reachable frame is Chat · Answer (33 differences)"; or what differs from the
  closest reachable frame, naming where the transition probably starts only
  when three things or fewer differ), what the project's system lacks, an image the
  reader cannot read; then values set as numbers (the most repeated first),
  text without a style, a layer left at Figma's
  default pin, a variant added to a library component, a frame made a field by
  its name. `figma_to_markup` opens its report with “Before handoff”; the
  plugin's Export for code card has a Check button that lists the same
  findings, and a click on a place selects the layer. Export stays possible
  either way.
- **States:** a new bundle module, `states.js`, shows one page in several
  states: a container with `data-vt-states="a b c"` (the first shown at load;
  `data-vt-states-url` follows `?state=`), elements with `data-vt-show="a b"`,
  `data-vt-go="b"` for a click (Enter on a non-control), `data-vt-go-hover` while the
  pointer stays, and a direct child with `data-vt-go-after` / `data-vt-go-delay` for a
  state that moves on by itself. `veritheme.showState(name)` from script; each
  change fires `vt-state-change` on the container and sets `data-vt-state` on it
  and on `<html>`. A `<select data-vt-states-select>` and a
  `<button data-vt-states-theme>` make a review switcher.
- **MCP, Figma → code:** the page builder is part of the server.
  `veritheme-mcp-server figma build <snapshot.json> --out <dir> [--prefix aw-]
  [--sprite inline|file] [--debug]` and the tool `figma_to_page` turn the
  plugin's Export for code of one screen's artboards into one page: regions
  drawn the same are written once, the rest per state with `data-vt-show`; project
  components get their classes and CSS (`components.css`), the design's
  drawings one sprite, the prototype `data-vt-go`. It writes `index.html`,
  `components.css`, `page.css` and the library files the page links (shipped
  with the server, `data/library/`), only inside the project directory, and
  links the project's theme named in `veritheme.system.json`. The page loads no
  script of its own. `--debug` adds a State select and a Dark button.
- **Figma → code:** elements that mean what they are, in `figma build` and
  `figma_to_page` (`--no-semantics` turns it off; `figma_to_markup` leaves it
  off). A project component named Sidebar, Header, Footer or Nav is an `aside`,
  `header`, `footer` or `nav`; a layer that leads somewhere on a click and holds
  nothing clickable is a `<button type="button">`, reached with Tab and
  activated with Enter and Space, its browser look reset in the library's base
  layer so it looks exactly as the div did. A new check before handoff,
  `click-inside-click`, names a layer with a click of its own inside a library
  link or button.
- **MCP, Figma → code:** `veritheme-mcp-server figma diff <old.json> <new.json>`
  and the tool `figma_diff` say what changed between two exports of one design:
  frames added, removed and renamed; per layer, components, variants, texts,
  transitions, least and most sizes, placement, layout, fills and type; the
  library's components and the theme. One line per kind with a count, then each
  kind one line per layer with the frames it is on. When the new snapshot's
  reader reads more than the old one's, the report says so first and marks the
  kinds that may only be read for the first time.
- **Figma → code:** two more checks before handoff: `text-style-drift` (fix),
  a text style of the file that is not the system's (server), and
  `resized-control` (review), a library control drawn at another size than its
  own; the reader says a resized control's own size (`over-size`). Findings
  name components without the library's service underscore.
- **Figma → code:** what the first verify of a whole design found. The reader
  reads five more things (`READER_CAPS`): the file's text styles
  (`text-styles`; the report compares them with the system's type and writes
  the differences as theme changes, `--vt-type-heading-md-weight: 700` …), text
  cut with an ellipsis (`text-truncate`: `vt-truncate`, or a line clamp), text
  centered in a taller box (`text-align-vertical`), bold words and links inside
  one text (`text-runs`: `<strong>`, `<a class="vt-underline">`), and images in
  fills (`images`, the plugin's export only, up to 1.5 MB each and 8 MB in all:
  a `background-image`, with `figma build` writing the file to `images/`).
  The engine draws a tooltip that is on the artboard open, where it is drawn,
  and a filled circle (a status dot) as a round element instead of dropping it.
  `figma verify` renders text in grays, as Figma does, and compares `images/`
  too.
- **MCP, Figma → code:** `veritheme-mcp-server figma verify <dir>` says whether
  a page built by `figma build` has drifted. It builds the page again from the
  snapshot handoff.json names and compares the folder file by file (exit 1,
  naming the file, the line and both versions, on any edit or extra file).
  With `--shots <folder>`, Figma's PNG export of the artboards (one file per
  artboard, named as it), it renders each state in Chromium when the project
  has Playwright (otherwise “skipped”, exit 0) and reports per state the share
  of pixels that differ, the share drawn differently (dense where one image is
  flat: a missing tooltip, an empty image, not text drawn by another
  rasterizer), and the regions where to look; pictures of the differences go
  beside the folder. Pixels fail the check only with `--max-diff <percent>`.
- **MCP, Figma → code:** `figma build` (and `figma_to_page`) also writes the
  handoff package next to the page. `handoff.json` (schema:
  `data/handoff.schema.json`) holds the snapshot it came from and the command
  that builds it again; the states (`data-vt-state` names and artboard titles)
  and every prototype transition, with the layer it starts from; each project
  component with its class, variant attributes and the values seen, its
  `<class>__<layer>` elements, its uses and states; the library components with
  counts; `repeats`, the design's sample data (three or more siblings of one
  component that differ only in text, icon or variant, row by row); `open`, the
  check before handoff and the translation's notes in three kinds: not on the
  page (`notTranslated`), on the page as one-off CSS (`oneOffCss`), on the page
  as something close (`otherwise`); and `coverage`,
  the share of the design's layers translated as library components, project
  components, plain layout, and not translated. `HANDOFF.md` is written from it
  for people and agents: the folder is generated and not to be edited, how to
  build and check it again, where hand-written code goes (outside, by class and
  variant attribute), how `data-vt-state` (the page's state) differs from
  `data-state` (a component's Figma variant), and the questions open with the
  designer. No path of the machine goes into the package: the snapshot is
  named relative to the project, or by its file name when it lies outside.
  `get_starter` and `get_guidelines` state the folder rule.
- **Figma → code:** a snapshot says what its reader read. The reader stamps
  `caps`, the sorted list of what it reads beyond the first format
  (`READER_CAPS` in `figma-reader.mjs`: `abs`, `art`, `go`, `limits`, `near-pin`,
  `over-height`, `over-main`, `own-variant`, `stroke-sides`, `stroke-weight`,
  `text-align`, `tint`), and `exported`, the date of the read; `art` is listed
  only when the drawings were asked for, as the plugin does. `figma_to_markup`
  compares the list with its own and, for an export from an older plugin, opens
  the report with “This snapshot is older than the engine”: one line per missing
  capability with what will be wrong in the output, and how to get a new export.
  A snapshot with no list is taken to have none; a bare frame is not judged. The
  server's test fails when the reader writes a field no capability accounts for.
- **MCP, Figma → code:** `figma_to_markup` takes `icons: "sprite"`. Each
  drawing of the design (icon, mascot, service logo) comes once, as a
  `<symbol>` in a new report section, “Icon sprite”, and where it is used the
  markup has `<svg …><use href="#i-<name>-<n>"/></svg>`, with the same classes,
  tint, placement and `data-vt-go` on the outer element as before. A symbol's id
  is the icon's name and the drawing's index, so it is the same in every call
  over one snapshot; the ids inside a drawing (gradients, clip paths) are
  renamed once, after it. The sprite is taken out of the flow at zero size,
  never hidden: a browser does not paint the gradients of a hidden SVG. With
  `spriteHref: "./icons.svg"` the references point at a file of its own, and the
  section gives that file. The default, `inline`, is unchanged. On the Agents
  Web test page `index.html` goes from 1,013 KB to 380 KB (528 drawings, 50
  symbols) and renders pixel for pixel the same.

- **Tokens:** two neutral state roles, `--vt-state-hover` (foreground-primary
  at 3 %) and `--vt-state-selected` (foreground-primary at 5 %), for the hover
  and the selected row of navigation and lists. They are emitted in every light
  and dark theme block, in the generator's `theme.css` too, and are used like
  any other role: `hsl(var(--vt-state-hover))`. Do not add a second alpha to them.
- **Figma plugin:** `state/hover` and `state/selected` in the Palette collection,
  scoped to frame and shape fills. Each is an alias of `foreground/primary` at
  3 % and 5 %, like the `brand/fill/alpha-*` tints. `_NavItem`, `_ListItem` and
  `_TreeItem` bind their Hover and Active/Selected fills to them, so the next
  sync keeps a file where they were added by hand.
- **MCP, Figma → code:** a screen built from the project's own components
  (Sidebar, Composer) is translated now. `figma_to_markup` walks into a project
  component and translates the library components inside it; before, it left a
  comment and stopped. A component registered with `register_project_component`
  and its new `figma` field (`{ component: "Composer", variants: { "State":
  "data-state" } }`) is placed as registered, with the variant as an attribute.
  An unregistered one comes out as a draft, listed under "Project components".
- **MCP, Figma → code:** `get_figma_reader` takes several frames or a page id.
  Frames of one screen are reported as states of the first: which variant
  changed, what appeared (with its markup), what text differs.
- **MCP, Figma → code:** `figma_to_markup` takes `path`, a file that holds the
  reader's result, bare or as a client saved the tool result.
- **MCP, Figma → code:** the reader reads gradients (with the variables of their
  stops), effect styles, text sizes, the file's fonts and shadow styles.
  `Shadow/SM` on a frame becomes `vt-shadow-sm`.
- **MCP:** a project names its icon set in `veritheme.system.json`
  (`"icons": { "set": "hugeicons", "style": "stroke-rounded", "strokeWidth":
  1.5 }`). `figma_to_markup` draws icon placeholders with that stroke width and
  `get_starter` names that set; Lucide stays the default.
- **MCP, Figma → code:** a new report section, "In Figma, not in the system":
  variables the design uses and the system does not define, palette ramps the
  system lacks, a font that differs and shadow styles where the system has
  `none`. Variables the library ships and an older project package lacks are
  listed apart, with "download the package again".
- **MCP:** `validate_markup` reads the stylesheets a page links with a relative
  path (`path` names the page's file or directory; the CLI and the hook use the
  file's own directory). Custom properties and `vt-` classes they define are no
  longer reported as unknown.
- **Toast:** `veritheme.showToast({ title, description, kind, action, duration })`
  shows a toast with your own copy and returns its element. The copy is set as
  text, never as HTML. `showToast('success')` still shows the demo toast.
- **Dropdown menu:** one menu can have many triggers. It opens at the trigger
  that was used, and focus returns to that trigger. A menu that is not next to
  its trigger in the markup is placed by the trigger's position, and any menu
  opens upward when there is no room below.
- **Dropdown menu:** `data-vt-dropdown-close-on-select` on the menu closes it on
  a checkbox or radio item too. `data-vt-dropdown-bubble` on a trigger lets its
  click reach handlers on its ancestors.
- **Progress:** `data-vt-progress="64"` on `.vt-progress` and
  `veritheme.setProgress(element, 80)` set the bar's value, with the ARIA of a
  progressbar.
- **Utilities:** `vt-text-on-brand`, `vt-text-on-info`, `vt-text-on-success`,
  `vt-text-on-warning` and `vt-text-on-error`, with the matching `vt-bg-on-*`
  and `vt-border-on-*`. Only `on-neutral` had them, so text on a brand fill
  outside a component had no class.
- **Figma plugin:** Export for code. Select the frames to build, or nothing for
  the whole page, and the plugin saves one JSON file. Give its path to the MCP
  server (`figma_to_markup` with `path`) and it returns the markup with the
  states of each screen. This is the way for a page of artboards: an AI agent
  reading Figma itself gets 48 KB per call and a page is several times that.
- **Utilities:** `vt-text-{info,success,warning,error}-text`,
  `vt-border-{info,success,warning,error}-border` and `vt-bg-success-surface`:
  an intent's text, border and surface for a block that is not a component.
- **MCP, Figma → code:** `figma_to_markup` with `raw: true` writes CSS for
  values the design sets as numbers: a fixed width, a gradient, text with no
  style, a role the library has no class for. The element gets a `data-layer`
  and the exact value goes into a "CSS for values set as numbers" section.
  Without the option such values are only listed, as before.
- **MCP, Figma → code:** a stroke on some sides only becomes `vt-border-r` (and
  the like) instead of a border all around, and centered or right-aligned text
  keeps its alignment. Both need a snapshot from the current reader.
- **Figma plugin, Export for code:** the export carries the design's own
  drawings. Every icon and vector graphic (a mascot, a service logo) is saved
  as SVG once, and `figma_to_markup` puts it in place: a one-color drawing
  takes the text color, a multi-color one keeps its colors. Nothing is left
  to fill from an icon set.

### Changed

- **Tabs (Pill): the open tab is lighter than its track in both themes (the
  owner, 19.11.2026).** The track takes `surface-page` and the open tab stays
  `surface-card` — the same pair as a card on the page. The track was
  `surface-subtle`, which in dark themes is a step lighter than the card
  (grey.800 over grey.900), so the open tab looked sunk into it. Light: track
  98% → open tab 100% (the track was 96%); dark: 4% → 9% (was 15% → 9%).
  The Figma recipe follows: Generate fills the Pill track with
  `surface/page`. Theme tokens are unchanged.
- **Figma: Checkbox, Radio, Switch and CheckLabel have Checked and State
  (review 19.11.2026).** The value and the state are two properties —
  Checked=False/True and State=Default/Focus/Disabled (CheckLabel:
  Default/Disabled) — so a checked disabled box, a focused checked one or a
  switch that is on and disabled is picked without detaching. Composites
  that hold a toggle say both. A rebuild moves existing instances: Unchecked
  and Off → Checked=False, Checked and On → Checked=True; Focus and Disabled
  stay. Export reads the new properties and still reads a file from before
  (State=Checked/On). The table's labels read the word and its opposite —
  Checked/Unchecked (a switch: On/Off), Open/Closed, Compact/Regular,
  Half/Whole — instead of "No checked". CSS, DOM and tokens are unchanged;
  anything outside the plugin that reads `State=Checked` from a file needs
  the new names.
- **Figma: descriptions come from the docs.** Every component set gets its
  docs line as its description (none where the docs have none) and every
  color role its purpose; a description a designer wrote is kept. The
  plugin's text is American English ("color", "Generation canceled").
- **Figma: brand roles alias the brand scale.** When several scales hold the
  same color (the default brand ramp repeats Blue step for step), a role
  aliases the scale of its own family: `brand/fill` → `brand/500`, not
  `blue/500`. The Colors board names the same step.
- **Figma: numbers through variables.** A dimmed layer binds
  `opacity/disabled` (it was a raw 0.5 on 47 layers); a focus ring's stroke
  binds the new `focus-ring/width` (04 Primitives, the theme's
  `focusRing.width`, 3px by default); a current step's halo binds Sizing &
  Spacing/1. 05 Typography variables carry one scope each (font family,
  style, size, line height, weight) instead of all scopes, and are written
  only when they change.
- **Figma: the Palette board reads the file.** A scale a designer added to
  01 Palette as variables keeps its row on every Generate, and a step edited
  by hand shows its own HEX and contrast. They never join the role matching.
- **Figma: an artboard follows its text.** Each artboard carries a print of
  what it says (docs, description, page, links, version). When only that
  moved, the artboard is drawn anew around the same set — not rebuilt, not
  relinked, an icon fixed by hand stays. The Icons set's print covers only
  the code that draws the icons and their data, so an edit elsewhere in the
  plugin no longer redraws them. The first Generate after this update
  rebuilds every set once: the renderer changed.
- **Docs: "Requires veritheme.js" where a component has a JS module.**
  Calendar, Chip, File Upload, OTP Input, Progress, Radio Group, Rating,
  Sidebar, Slider and Switch gain the badge; Auth, which has no module of
  its own, loses it. The shadcn registry items and `llms-full.txt` say
  "Interactive: include veritheme.min.js" for the same components.
- **Builder: Customize is built from the library.** Its "?" and remove
  buttons, "+ Add token" and "Show N", the number fields, the "custom" mark,
  the toast and the picker's close button are Button, Input, Badge and
  Toast; six option lists are List and ListItem.
- **Every role fills from the 500 of its scale (the owner, 16.11.2026).**
  `brand`, `info`, `success`, `warning` and `danger` fill with step 500 in
  both themes (was 600, 600, 700, 500, 600); hover is 600 and pressed 700,
  derived from it as before. The text on every role fill is white, warning
  included (it was dark orange). Role text is one step from the fill: 600 in
  light, 400 in dark (was 700 / 300). Surfaces, borders, disabled and neutral
  are unchanged. A brand color is now the 500 of the ramp built from it
  (`derive_theme`, theme CSS, the plugin, the builder), with the ramp's
  lightness rebased around it. Contrast is shown, not decided by: the pairs
  this turned under AA are reported with their number by `audit:contrast`
  and the plugin's import, and fail nothing (`shown` in lib/contrast.mjs);
  the importer no longer replaces white on a role fill.

- **Figma: the Palette board in two sections, as Untitled UI's palette.**
  Base colors — Base (white and black) and Brand with a "Default brand"
  badge — then Tailwind CSS colors: Neutral, Red, Orange, Yellow, Green, Blue
  and any scale a theme adds. A scale a role fills from wears its badge
  ("Default danger", "Default info"…); Brand keeps its own row even where it
  repeats Blue. The main step, 500, is drawn wider.

- **Figma: the dot on a Palette swatch marks the scale's main colour, 500.**
  In every scale, grey included, as Untitled UI's palette does — no longer
  the step a role fills with (the Colors board names that step). The layer is
  `Main`.

- **Figma plugin: testing mode keeps Clear file in every build.** While
  `figma-plugin/testing-mode.json` says `"on": true` (it does now), every
  build of the plugin — `build`, `build:dev`, the root's `build:plugin` and
  `test:plugin`, in any checkout — carries Clear file and stamps `testing` in
  the footer, so an ordinary rebuild no longer takes the button away. The
  build checks that the UI holds the button exactly when it should, and
  `npm run release` refuses to start while testing mode is on (RELEASING.md).

- **Figma: the text on a Palette swatch follows the scale, not the contrast.**
  On Foundations → Palette, steps 50–100 carry step 700 of their own scale,
  200–300 step 900, and 400 and up white — in every scale, grey included
  (the Untitled UI rule). The contrast on the swatch is that text's, as it
  is, and AA/AAA appear only where it passes. Scale values are unchanged:
  they already are Tailwind's. See docs/audits/PALETTE-TEXT-RULE.md.
- **Figma: the active pill tab's frame is an outside stroke, not a "Ring"
  layer.** A ring that is a permanent frame — `0 0 0 var(--vt-border-width-*)
  hsl(var(--vt-border-*))`, not a focus ring — draws as an OUTSIDE stroke of
  the node, bound to the border colour and width variables. TabsTrigger and
  the tabs in Tabs (Style=Pill) lose their extra layer; the picture is the
  same.

- **Badge has one leading place in Figma: the icon.** The Dot layer and Show
  Dot are gone; a dot is a StatusDot swapped into Icon, which offers StatusDot
  beside the icons. A rebuild turns an old badge whose dot showed without its
  icon (or an old Dot=True variant) into Show Icon on with a StatusDot of the
  dot's color in Icon (Current: the badge's own color). FeatureSection,
  PricingCard and Table no longer switch a badge dot off. The HTML is
  unchanged: `vt-badge` still draws a dot or an icon.
- **Rows that sit together are 2px apart.** A row under the pointer next to
  a selected one no longer merges with it (the owner, 16.11.2026). Rows in
  DropdownMenu (and a checkbox or radio group inside it), the Combobox list
  and its groups, Command groups, the Select list and TreeView (rows,
  branches and nested rows) are now `--vt-spacing-0_5` apart, in code and in
  Figma (the frames' gap is bound to spacing/0.5). SidebarNav, NavGroup,
  Tabs, Pagination, Toolbar and the Header nav already had a gap. The label
  of a group (MenuLabel, `vt-dropdown-label`, `vt-command-group-heading`) has
  4px instead of 6 below it, so it stays 6px from its rows; the Select
  separator has 2px instead of 4 above and below, so the line stays 4px from
  the rows. A menu separator, which sat right against its rows, is 2px from
  them now. Menus grow by 2px per row; Command's list still fits its 288px.
- **Select and Combobox: their own label, hint and error.** Like Input: Show
  Label / Show Helper Text with Label and the hint (on in the main), and
  State=Error — the trigger `aria-invalid="true"` (Select), the field
  `vt-input-error` or the tag field `vt-combobox-tags-error` (Combobox), danger
  border and the hint as `vt-field-error`. Select: Size × State (Default, Hover,
  Focus, Error, Disabled) = 10 variants; Combobox: Variant × State (Default,
  Error) = 8. They stay two components, as in most systems.
- **Components on the new tokens.** `--vt-error-*` / `--vt-on-error` →
  `--vt-danger-*` / `--vt-on-danger` in 23 components (the classes and the
  Figma State=Error stay). Border widths by role: a container's line
  `--vt-border-width-line`, a control's `--vt-border-width-control`, an
  emphasis `--vt-border-width-strong` (code-block's highlighted line 1px → 2px).
  Motion only through tokens: select's option and slider's thumb `instant`,
  spinner / notification-badge / dot / skeleton on the `loop-*` steps and their
  curves; the sidebar's group now opens with motion (two curves in a row made
  the browser drop the transition). Opacity through the scale: disabled
  `--vt-opacity-disabled`, the pings 0.75 → 0.8, alphas 0.08 / 0.12 → 0.1, focus
  rings 0.15 → 0.2, the calendar's range 0.15 → 0.1. The Figma plan reads an
  opacity token at the default theme's value.
- **Figma: the Palette board explains its scales.** One row per scale: on the
  left its name, the roles the theme takes from it (Danger · 600) and what it is
  for; on the right a column per step with the swatch, the contrast of the text
  that reads on it (white or black, whichever is higher) with two decimals and
  its WCAG level (AAA from 7, AA from 4.5), the step and the HEX. The step a role
  fills with is marked with a dot. All of it is read from the loaded theme; the
  scales' descriptions live in `foundation-colors.mjs` (`PALETTE_SCALES`).
- **Figma: the Colors board explains its groups.** Each group of roles
  (Foreground, Surfaces, Border…) has a Heading/SM title with the Variables mark —
  the same heading as the Palette rows — and a line or two on what its roles are
  for (`COLOR_GROUP_DOCS` in `foundation-colors.mjs`, for the site as well).
- **Figma: layout grids and a Layout board.** `tokens/base.json` gets `grid`:
  desktop 1280 (breakpoint xl), 12 columns, gutter 24, margin 32; tablet 768
  (breakpoint md), 8 columns, gutter 24, margin 24; mobile 375 (a frame size, not a
  breakpoint), 4 columns, gutter 16, margin 16 — the gutters and margins as steps
  of the spacing scale. The plugin writes them as `grid/…` variables in 04
  Primitives and as the layout grid styles Grid/Desktop, Grid/Tablet and
  Grid/Mobile (stretched columns, count, gutter and margin bound to the
  variables). A new Layout board on Foundations shows a frame per size with its
  grid on (Shift+G), a ruler (margin, content, full width) and the breakpoints.
  Figma only: the CSS has no grid classes and gains no variables; the resolved
  grid travels in the theme files (themes/default.json, the presets).
- **Figma: the Typography board says which fonts the system uses.** It opens
  with a card per typeface (the main family, and the mono one when styles use
  it): the family's name, a large Ag, the alphabet in three lines and the
  weights the text styles really use, each as Aa with its name and number. Every
  text on the card wears one of the system's text styles, so a new font in the
  theme redraws it; a font Figma does not have is drawn in Inter and named in the
  Generate report. Each group of styles (Display now included) has the Palette
  and Colors heading with the Text styles mark and a line on where its text goes
  (`TYPE_GROUP_DOCS` in `typography.mjs`); the Figma text styles take the same
  line as their description when theirs is empty.
- **Figma: colour swatches without the grey outline.** On the Colors and
  Palette boards a swatch is outlined only when it is as white as its card
  (within 1.01:1 of surface/card, read from the loaded theme): Generic-0, and
  in Colors the white roles (surface/card, on-brand and the other white
  on-colors). The near-white tints (grey-50, the 50 steps) are not outlined.
- **Figma: every component's card is as wide as its content.** A card was
  stretched to the widest card of its column when it was at least 2/3 of it,
  which left an empty field on the right (CheckLabel next to Input); now none is
  stretched. Its height follows the content too: a card put into its section kept a
  fixed height (Card's board: W hug, H 501); it hugs now, in every annotations mode.
- **Avatars show one letter.** The initials in Avatar's default, AvatarGroup,
  Header, Page Layout, Testimonial and every example on the site are one
  letter (A, J…), not two; "+3" in a group stays.
- **No repeated placeholder icon in a main.** A composite's rows show their own
  icons, the ones the site's examples show: Toolbar Bold, Italic, Underline,
  Strikethrough, Align left / center / right, Link, Image; Timeline Package,
  Check, Truck, Home; Feature Section, Command, Combobox, List, Sidebar Nav,
  Page Layout, Header, Footer, Table, Tree View and Auth by what each row says
  (31 icons added to the plugin's Hugeicons set). Empty — the placeholder —
  draws in foreground primary like every icon, not muted. `audit:icon-repeats`
  (in `audit:all`) fails when a component's default icon repeats in another's
  main. The site's editor toolbar example shows the main's nine buttons; its
  Align right button had the align-left icon.
  Two icons are renamed so they are not read as components in markup: Link →
  Hyperlink, Calendar → CalendarDays; a rebuild of Icons moves their instances,
  and the audit fails on an icon named like a component. The Icons page lists
  every icon of the set.
- **Meaningful icons in the mains.** No Empty placeholder where a component
  has an obvious icon: Alert, Dialog and Toast show their intent's icon (Info,
  CircleCheck, TriangleAlert, CircleX — per variant, so these three have no Icon
  swap property any more; swap the nested icon instead), Button Plus on the left
  and as the icon-only glyph and ChevronDown on the right, Input Search and X,
  a menu row Settings, a nav row Home, a list row User, a tree row Folder, a tab
  Home, Link ChevronRight, Media Image, FileUpload Upload, a file row File,
  IconBadge Star, Badge CircleCheck, Command Search, StatsCard TrendingUp,
  Testimonial Quote and NavItem Pin.
- **NavItem: one way to set the icon.** The Icon swap property is gone: it was
  bound to the main's icon, not to what an instance holds in its Leading slot,
  so changing it left the slot as it was. The icon is the Leading slot's
  content (Home by default) and is swapped right there. A rebuild puts an icon
  picked through the old property into the slot; a row left at the old Empty
  gets the new default. A rebuild also no longer puts back the old component of
  a layer inside a slot (slot content moves on its own), which overwrote a new
  default icon with the old one.
- **Badge's dot takes the badge's meaning.** On a bordered or soft badge the
  dot is a StatusDot of the same meaning (Primary → Brand, Secondary → Neutral,
  intents the same), with no fill override, so the dot's Color picked on an
  instance changes it (`vt-dot-brand`, `vt-dot-success`… in the markup). On a
  filled badge the dot keeps the badge's text color (`vt-dot-current`).

- **Figma: Palette is the scales, Colors the roles — in that order.** The
  plugin's variable collections are named and ordered as in other design
  systems: **01 Palette** holds the raw scales (blue/500, grey/50), the first
  layer, and **02 Colors** the semantic roles with Light and Dark modes that
  alias them (the ones to bind to). Until now the roles were "01 Palette"
  and the scales "02 Colors". A file built earlier keeps its collections:
  the plugin tells them apart by what they hold (the roles have a Light or
  Dark mode) and renames them in place, so every variable keeps its id and
  every layer stays bound. The Foundations boards follow — Palette (the
  scales) first, then Colors (the roles), in a file built earlier too — and
  so do the plugin panel and the home page.
- **One name for the danger colour.** The colour role that paints a
  destructive button, an error banner and an invalid field is `danger`, as
  the classes and variants already were: `--vt-danger-fill`, `-fill-hover`,
  `-fill-pressed`, `-fill-disabled`, `-surface`, `-border`, `-text` and
  `--vt-on-danger`, utilities such as `vt-bg-danger-fill` and
  `vt-text-danger-text`, and the theme keys `dangerFill`… The scale stays
  `red` (a hue), and a field's or a step's error state stays `State=Error`
  / `vt-input-error` (a state, not a colour). For one release the old names
  still work: `--vt-error-*` and `--vt-on-error` point at the new
  variables, the `vt-*-error-*` utilities are aliases, and a theme, a saved
  system or a tokens.json that says `error*` is read as `danger*`. In Figma
  the variables are renamed in place (`error/fill` → `danger/fill`,
  `error/on-error` → `danger/on-danger`, the alpha steps too), so every
  layer stays bound.
- **Border widths are named by what they draw.** `--vt-border-width-line`
  (dividers, panel and card edges, table rows; a theme can make it a
  hairline), `--vt-border-width-control` (the border of an input, a bordered
  button, a checkbox; the theme sets it, 1px in Default) and
  `--vt-border-width-strong` (2px: the active tab, a selection). `thin`,
  `default` and `thick` still work for one release and point at the new
  names; `medium` (1.5px) is gone and reads as `control`. In Figma the
  variables are renamed in place (`border-width/thin` → `/line`, `/default`
  → `/control`, `/thick` → `/strong`, so strokes stay bound), an old
  `/medium` now follows `/control`, and the Border Width board shows each
  width with what it is for and a specimen in its own colour. tokens.json
  exports `border-width.line / control / strong`; older files with `thin`
  and `default` still import.
- **Figma: five shadows.** A file gets Shadow/SM, Default, MD, LG and XL, and
  the Shadows board and the plugin panel show those five. Shadow/Control,
  its Pressed and Bordered forms and the inset styles are no longer
  published for any theme, an imported one included; one an earlier run
  made is removed on the next run (a layer that used it keeps its effects,
  detached from the style).
- **Figma: the compact Timeline is drawn compact.** Size=SM on Timeline Item
  was drawn as MD in Figma: the size property was not tied to the size axis, so
  `vt-timeline-item-sm` never reached the variant. Now SM has 12 to the text, a
  16 rail with a plain 16 icon (no badge) and a 1px line, 6/6 around the text,
  the title in Body/SM and the description in Caption, as the CSS draws it. The
  icon is a check by default, swapped per step.
- **Input and Textarea: no Plain variant.** The owner: Plain came from one project;
  the library's field is the base one, and a field inside a container that draws
  the border is the base field with its fill and stroke removed on the instance.
  Figma drops the Appearance axis (Input 56 → 40, Textarea 6 → 4 variants); a
  rebuild moves a Plain field to the base one without its fill and stroke, so the
  layout does not change. `vt-input-plain` and `vt-textarea-plain` stay in CSS,
  deprecated, for one cycle.
- **Card: the footer is a toggle.** The owner: Footer was a variant axis; it is
  Show Footer now (on in the main), so Card has two variants, MD and SM. A rebuild
  turns Footer=False into Show Footer off. The header was a toggle already.
- **Scroll View: a 4px bar.** The bar is 4px wide instead of 6 (owner: a little
  thinner), in the component, its Figma recipe and the site's overlay scrollbar.
- **Timeline: 12 between a compact step's marker and its text.** The owner found the
  text pressed against the marker at 8.
- **Button: no control shadows.** The owner: the Control and inset shadows are not
  needed anywhere. Button and Button Group lose the depth machinery built on them
  (the highlight, the bottom edge, the press offset and their slots); the focus ring
  stays. The four control shadow tokens are gone from the base theme.
- **Figma: a progress bar's value is set on the instance.** The Bar lies in a Value
  slot across the track: Figma does not let an instance resize a layer of a
  plain frame ("size cannot be overridden in an instance"), slot content it
  does. Select the Bar in an instance and drag its width, or type W; the share
  of the track is the value. A rebuild keeps the width; no new variants.
- **Figma: an action slot shows its default in the main.** The owner's rule: in
  the main component every layer shows and no slot is empty. Dialog's More
  Actions has a "Don't ask again" CheckLabel, Header's More Actions a More
  icon button, Sidebar Nav's Header Actions Search and Collapse icon buttons,
  Timeline Item's Actions a Retry button — each with a Show toggle the
  compositions switch off where no action is needed (Timeline, Page Layout). A
  rebuild switches the slot off on an instance that had it empty, so nothing
  appears there; an action of its own stays.
- **Figma: an icon slot is switched off, never left empty.** A slot that takes
  an icon (Leading and Trailing on Nav Item, List Item and
  Menu Item; the Media of Empty State and Header) has its icon by default and a
  Show toggle bound to the slot itself: switched off, it takes no width and no
  gap (an empty slot that is shown still takes the row's gap — the hole left of
  a button's label). The library's compositions that had no icon say Show …
  off instead of an empty slot. A rebuild moves an instance that emptied the
  slot, or hid its old icon, to the toggle off with the icon inside; content of
  its own stays. Code is unchanged: a hidden or empty slot draws nothing.
- **Badge: no dot variants.** The owner's decision: a dot is its own component.
  Figma's Badge drops Dot and Dot Color (44 variants → 18): the dot is a
  StatusDot before the label, shown by Show Dot (on in the main, off where a badge has none), its
  color picked on it — the text's color by default. A rebuild turns Dot=True
  into Show Dot on and Dot Color into the dot's Color. In `@veritheme/react`
  `dot` and `dotColor` stay (`current`, the text's color, by default); the
  markup is unchanged.
- **Button: an icon left and right, no slot.** The owner's decision: a button
  has no slot. In Figma it has Show Left Icon and Show Right Icon, on in the
  main component (every layer shows there) and off where a button has no icon, with Left Icon and Right
  Icon to swap the glyph; the icon keeps its own size, set on the instance or
  bound to a variable. A rebuild moves a button that had the Leading slot: an
  icon in it becomes the left icon, an emptied or hidden slot no icon — no
  hole; what is not an icon (the dot beside a connector's logo) is named in Not
  put back. The library's compositions show no icon unless they mean one (sign
  in with GitHub or Figma, Create document). In `@veritheme/react` `leftIcon` and
  `rightIcon` stay; `leading` is gone.
- **Nav Item: what leads the row is a slot.** In Figma the 20px icon (an
  instance swap with Show Icon) is now the default content of a Leading slot:
  an avatar (the account row in a sidebar's footer, a menu trigger), an
  agent's mascot or nothing goes there instead, with the row's hover, radius
  and label color. A rebuild moves the old instances: a hidden icon leaves the
  slot empty, a swapped icon stays. Nav Group's toggle row takes it too. In
  `@veritheme/react` `icon` becomes `leading` (Nav Item, Nav Group).
- **Menu Separator: one divider.** `vt-dropdown-separator` drew the same line
  as `vt-menu-separator`; the docs use `vt-menu-separator` (Menu Separator in
  React), and the old class stays an alias.
- **React: a menu row says how it shows its state.** `MenuItem` takes
  `control`: `"checkbox"` (the default for an on/off row) or `"switch"` — a
  decorative switch at the end, the row is the `menuitemcheckbox` — and, in a
  `MenuRadioGroup`, `"radio"` (the default) or `"check"` (a check mark at the
  end, a pick-one menu of modes). On/off rows take `defaultChecked` and radio
  groups `defaultValue` too (uncontrolled); checked rows keep the menu open.
  The docs' React tab now shows every dropdown example as
  `<DropdownMenu trigger={…}>` with these rows.
- **Input: plain is bare text.** `vt-input-plain` (Appearance=Plain) drops,
  besides its border, fill and focus ring, its own padding and fixed height:
  it is as tall as its line, and its size sets only the type. The container
  around it gives the room (a chat composer in a small card: the text 16px
  from the card's edge instead of 32, the card 102px tall instead of 134).
  The docs' composer gives its container `vt-pl-4 vt-py-2` and looks the same.
- **Input: the field wrapper only with a label or a helper text.** The
  contract's markup (and `@veritheme/react`) draws `div.vt-field` around the
  input only when it holds a label or a helper text; alone, the field is the
  bare `input.vt-input`, as the docs write it (a header's search, a footer's
  form). The look is the same. A new contract field, `bare`, says which part
  stands for its wrapper. An empty slot with an element of its own (a
  timeline step's actions) is no longer drawn either.
- **Dialog: the icon in a large badge is 24px, as in Figma.** `.vt-dialog-icon
  > svg` (20px) now sizes only an icon without the part's class; an icon with
  `vt-icon-badge-icon` takes its size from the Icon Badge — 20px in the
  regular badge (as before), 24px in `vt-icon-badge-lg` (was 20). The docs'
  dialog icons carry the class; the icon's place and the heading's gap stay.
- **No class for a default that means nothing.** The contract's markup (and
  `@veritheme/react`) no longer writes a default axis class no rule uses —
  `vt-btn-md`, `vt-link-default`, `vt-timeline-dot-default` and 42 more:
  the base class draws the default. Classes a rule does use stay
  (`vt-btn-primary`, `vt-avatar-md`, `vt-badge-primary`).
- **File Upload Item: the tile's icon carries `vt-icon-badge-icon`,** as in
  Icon Badge (16px in the small tile, as before).
- **Sidebar Nav: the logo letter is a property.** In Figma the mark in
  `vt-side-nav-logo` is the Logo text property ("A" by default), so each
  product sets its own; in `@veritheme/react` it is the `logo` prop.
- **React: a heading's level is a prop.** The title of Empty State, Dialog
  and Card's header renders `h3` by default and takes `titleAs` (`h1`–`h6` or
  `p`) for the page's outline; the look stays, the class sets it.
- **Dropdown Menu is one component in Figma, not five variants.** The Style
  variant (Default, Checkboxes, Radio, Mode, Toggles) is gone: the menu is a
  shell with the Items slot, and the ready menus are samples of its content
  (on the docs page and in the contract). A rebuild moves an instance of any
  old Style to the shell with the rows of its Items slot as they were — the
  ones the variant drew and the designer's own. The Toggles sample shows the
  row as the control (`menuitemcheckbox`) and the switch as its state only.
- **Card: the body spaces its content with a gap, as Figma auto layout
  does.** `vt-card-body` is a column with a 12px gap instead of a 12px
  margin on every child after the first. A gap set on the body (a utility
  such as `vt-gap-1`, or a gap the designer changes in the slot) is now the
  one spacing; before, the 12px margin came on top of it (a body with
  `vt-gap-2` spaced its content 20px). A button, badge, chip or link in the
  body keeps its own width; an `h3` in the body has no bottom margin (the
  gap does it). A child's own top margin now adds to the gap: the site's
  examples moved theirs onto the body (`vt-gap-1`) or shortened them. In
  Figma the Body frame has a 12px gap.
- **Badge: a dot excludes an icon.** A badge shows a status dot or an icon,
  not both. In Figma the variants with Dot=True have no icon layer, so Show
  Icon turns nothing on there (a rebuild drops an icon a dotted badge
  carried). In `@veritheme/react` the icon is not drawn with `dot`, and the
  types refuse `<Badge dot icon={…}>`.
- **List Item: what leads a row is a slot.** In Figma, List Item had a Leading
  variant (None, Icon, Avatar) next to its State: 12 variants. Leading is now
  a slot, like a menu row's: an icon by default, or an avatar, an icon badge,
  or nothing. List Item has 4 variants (State) and List 1 (it had a Leading
  of its own, passed to its rows). A rebuild moves an instance of an old
  variant without losing what it showed: an icon stays (with the icon swapped
  in), Avatar puts an avatar in the slot, None leaves it empty. The markup is
  unchanged.
- **Dialog: the description right under the title.** The title and the
  description were 6px apart; they now sit with no gap between them, in code
  and in Figma. The icon keeps its place.
- **Chip: Disabled works on every chip.** It was the `:disabled` pseudo-class,
  which a chip drawn as a tag (a span or a div) never takes. A disabled chip
  is now `aria-disabled="true"` (a filter chip that is a button may still use
  `disabled`): half opacity, no pointer. Figma's Disabled variant is
  unchanged.
- **Nav item: one line, its label cut with an ellipsis.** A long label wrapped
  the row onto a second line. A nav item (top level, sub level and compact)
  now stays on one line, and its label, `vt-nav-item-label` (new), is cut
  with an ellipsis; in Figma the label truncates the same way. Markup without
  the label element still stays on one line.
- **Nav row actions shown on hover lie over the label.** The row no longer
  keeps room for buttons that only show on hover (a chat's More menu): the
  label takes the full width, and the buttons, when shown, sit over its end on
  the row's own background, faded in from the left, so the label does not
  show through. Actions that are always shown still keep their room.
- **Icon-only buttons inside components have a name.** Card's close button
  (`aria-label="Close"`), a file upload's Retry and Remove, a chip's remove
  button and the Notification Badge example's button were drawn with only an
  icon and nothing a screen reader could say. The contract now names them;
  the look and the Figma layers are unchanged.
- **NavGroup: its row is a button.** The row that opens and closes a group
  was drawn as the NavItem link (`a.vt-nav-item`) in the component's own
  markup, while the sidebar example used a button. It is now
  `button.vt-nav-item`: a control that toggles, reachable from the keyboard.
  A part that is another component can name its own element (`"el":
  "button"` on a `use` part); only the tag changes, the classes and the
  Figma layers stay.
- **Timeline: a step's actions at the end of its row.** vt-timeline-actions
  after the content holds a step's buttons (Retry on a failed step), 8px
  apart. In Figma TimelineItem gains the Actions slot at the end of the row,
  empty by default: in the row an empty slot adds no space between events.
  Not for vt-timeline-alternate.
- **Figma plugin: Prepare for code says when a frame lost prototype links.**
  Generate writes each frame's link count on it; Prepare compares and lists
  the frames that have fewer links now ("Composer · Typing: 3 prototype
  links before, 1 now"), once. Switching a variant of an instance inside a
  main resets the links on its layers in every frame, and Figma does not
  say so. A rebuild also keeps the names of a slot's children that the
  instance made its own (a removed sibling turns them into the instance's
  nodes, their names overrides): after every move, a slot with as many
  children as before gets their names back ("More", not "Button").
- **States: a prototype behaves like the app — Escape, a click elsewhere,
  focus, Enter.** In a page of states (data-vt-states), a menu drawn open
  (.vt-dropdown-menu.vt-open[data-vt-keep-open] in a .vt-dropdown-wrap) takes
  the focus on its first row, moves with the arrows, Home and End, and
  closes on Escape, a click elsewhere or Tab out of it to the state its
  button goes to, the focus back on that button. A dialog drawn open
  (.vt-dialog-overlay.vt-open) takes the focus, keeps Tab inside, and
  Escape or a click on its backdrop runs its Cancel (a [data-vt-cancel]
  button with data-vt-go, else .vt-dialog-close, else a button that reads
  Cancel or Close). data-vt-submit="<selector or id>" on a field: Enter (not
  Shift+Enter) presses that button.
- **Dropdown Menu: every menu gets its rows' roles and keys, and switch and
  check rows turn by themselves.** A menu with no data-vt-dropdown-trigger
  (drawn open in the markup) is prepared and bound too, and placed at its
  button (the wrap's first child) at load and when a state shows it. A
  click on a menuitemcheckbox or menuitemradio row turns it without an
  onclick in the markup (an existing onclick="veritheme.toggleCheckbox(this)"
  still works, once). A menu with data-vt-keep-open is never closed by the
  menu itself.
- **Nav Item: the row's actions are centered without a transform.**
  .vt-nav-item-actions spans the row's height (top: 0; bottom: 0) and
  centers its buttons with flex instead of translateY(-50%). It looks the
  same; a menu opened from it inside a scrolling sidebar can now be fixed to
  the window instead of being clipped by the sidebar.
- **File Upload Item: a failed upload.** vt-file-upload-item-failed puts the
  error color on the frame and the file tile; vt-file-upload-item-error
  shows the reason ("Upload failed") in place of the size, and a Retry icon
  button comes before Remove. In Figma FileUploadItem gains State=Failed;
  the plugin's icon set gains RotateCcw for Retry.
- **Timeline: how a step ended — failed, canceled, nothing found.** New
  states for a step that ran: vt-timeline-item-error (the title in the
  error color) with vt-timeline-dot-error, vt-timeline-item-cancelled (a
  muted, struck-through title) with vt-timeline-dot-cancelled (gray), and
  vt-timeline-item-empty with vt-timeline-dot-empty (an empty ring) for a
  step that found nothing. In Figma TimelineItem and TimelineDot gain
  State=Error, Canceled and Nothing Found (the classes keep their
  `-cancelled` spelling; an instance drawn as Cancelled during this cycle
  moves to Canceled on a rebuild, and Export reads both); a strikethrough in
  CSS is now drawn as one in Figma.
- **Badge: a status dot in its own color on a neutral badge.** A gray badge
  (vt-badge-secondary, bordered or soft) can show its dot in a status color:
  vt-dot-info, vt-dot-success, vt-dot-warning or vt-dot-danger in place of
  vt-dot-current — "● Running" in gray with a green dot. This is new markup
  for that case; a dot in the badge's own text color stays vt-dot-current.
  In Figma the Badge set gains Dot Color (Current first, so a rebuilt badge
  keeps its dot; a colored dot only on Secondary, Bordered or Soft: 8 more
  variants, 44 in all).
- **Card: the small card has a small title, and a Size in Figma.** In
  vt-card-sm the title is Label/MD (14px, medium) instead of Heading/SM, to
  match its 12/16 header and 16 body. In Figma the Card set gains
  Size=MD/SM (MD first: a rebuilt card stays MD); Size=SM is vt-card-sm in
  code.
- **Dropdown Menu: an open menu inside a clipping container is fixed to its
  trigger.** This changes how menus behave in your pages, not only in code
  built from Figma. Before, a menu placed next to its trigger (inside
  .vt-dropdown-wrap) stayed in the flow, so any ancestor with overflow other
  than visible cut it off: a chat's menu in a scrolling sidebar, a row menu
  in a table that scrolls sideways, a menu in a card with overflow: hidden.
  Now, when such an ancestor exists, the open menu gets position: fixed
  (inline styles, removed when it closes), is placed at its trigger with the
  same -up / -end and flip rules, and follows the trigger when the container
  scrolls or the window resizes. A transformed or filtered ancestor (an
  animated drawer) is taken as the origin. The side and the edge your own
  CSS gave the menu are kept: a menu your styles align to the right of its
  wrap, or open above the trigger, is fixed the same way. Menus with no
  clipping ancestor are placed by the stylesheet as before.
- **Figma plugin: Generate leaves unchanged sets alone.** Each component's
  artboard carries a print of what its drawing depends on: the recipe, the
  variants and properties chosen, the component's rebinds, the font, the
  annotations, the layout, the theme's sizes, radii, widths, type and shadows
  (not its colour values, which are variables), and the plugin's renderer. A
  set with the same print is not rebuilt and not relinked: its id, its
  instances' overrides and prototype links stay as they were. The run says how
  many sets it left alone and which it rebuilt. A file made before prints is
  rebuilt once and printed. Settings has a Rebuild all switch for one run.
  The run's summary (left alone, rebuilt, how the move went) stays in the
  plugin window under Generate until the next run. The print is in shared
  plugin data too (`veritheme` / `print`), readable from use_figma.
- **Figma: a pressed Button is State=Pressed.** Button's State=Active meant
  pressed (`:active`), while Active means selected on NavItem, Tabs, Page
  Button, Tree Item and Chip; an agent drew the button of an open menu as
  Active. The value is Pressed now (the owner's call); code draws it by
  itself, like Hover and Focus. A rebuild moves State=Active instances to
  Pressed, and the CSS is unchanged.
- **Figma: Menu Item is one row with Leading and Trailing slots.** The start
  of the row is the Leading slot (the icon by default; a check mark, a small
  Checkbox or Radio, an Avatar) and its end the Trailing slot (empty by
  default; a check mark, a small Switch, a Badge or a count). The Leading and
  Trailing variant properties, Show Icon and the Icon swap are gone: 15
  variants instead of 81; Size, Intent (Danger), State, Description and Show
  Shortcut stay. New part: **Menu Check** (`_MenuCheck`, State Off/On,
  Position Start/End), the row's check mark. A rebuild moves the instances of
  the old variants to the new row and puts into its slots what they drew (a
  checked checkbox, an on switch, the icon they had, or none if it was
  hidden); files drawn before read as before. The markup and the CSS of menu
  rows are unchanged.
- **Count Badge and the notification dot lose their ring.** `vt-count-badge`
  and `vt-notification-dot` no longer draw a 2px ring in the page color
  (`box-shadow`): on any background but the page the ring showed as a
  dirty edge. The count and the dot keep their size and color; in Figma
  their recipes lose the ring as well. If you relied on the ring to separate
  a dot from a busy avatar, add your own `box-shadow` in your styles.

- **Switch:** the thumb is a plain circle — a white fill with a thin border in
  `--vt-switch-thumb-ring`, placed 2px from the track edge — instead of a radial
  gradient drawing the circle, the gap and the ring inside a larger square. It
  looks the same (only the edge is smoother), the slot and its values are
  unchanged, and the Figma plugin now draws the ring as the thumb's stroke. CSS
  of your own that set the thumb's `background` now changes the fill only.
- **Figma plugin, Check:** the list reads as a list. Each rule is a line of its
  own (Fix or Review, a short name, how many rows) with a short text under it;
  the report keeps the full one. A layer drawn on several frames is one row,
  "on N frames", and each click selects it on the next frame; the count is the
  number of rows. A layer with no name of its own is said with where it sits
  (`Button in Composer › Toolbar`). A rule shows eight rows and "Show N more".
- **Tooltip:** shows on keyboard focus inside its trigger too
  (`.vt-tooltip-wrap:focus-within`), as its docs promised, not only on hover.
  **This changes existing pages:** a tooltip now appears when Tab reaches a
  control inside `.vt-tooltip-wrap`, with no change to the markup.
- **Toolbar, Button group:** their docs say that `.vt-active` is the page's to
  set: the bundle does not toggle a pressed tool or a selected segment.
- **NavItem, ListItem, TreeItem:** hover and selected rows are neutral now and
  do not follow the brand color. Hover was `surface-subtle` and the current row
  was `brand-fill / 0.1`, so with a colored brand a gray hover sat next to a
  tinted selection, and in dark mode the two went in opposite directions. Hover
  is now `--vt-state-hover`; `vt-active`, `aria-current` and (in ListItem)
  `vt-selected` / `aria-selected="true"` are `--vt-state-selected`. The label
  and the leading icon of the selected row are `foreground-primary`, Medium,
  instead of the brand color. ListItem's check mark stays in the brand color.
- **MCP, Figma → code:** the reader's answer is smaller and comes in parts.
  `use_figma` returns at most 48 KB, so a read that does not fit is split:
  `figma_to_markup` stores each part and answers with the markup on the last.
  A subtree drawn more than once is sent once per part. Snapshots of the first
  reader still translate.
- **MCP, Figma → code:** the report no longer offers theme CSS to paste after
  `theme.css`. Tokens come from the system's package, as `get_starter` says: the
  differences are listed as values to set in Studio.
- **MCP:** `one-primary` does not count a primary button inside a block shown by
  state: `aria-hidden="true"`, an inline `display: none`, or an attribute a
  script switches on (`data-show`, `data-…-show`, `data-when`). Its message
  says how to mark such a block.
- **MCP, icons:** a project's own icons come first. `figma_to_markup` reads how
  the design's icons are drawn (line weight and grid) and draws placeholders
  to match; its report says to use the design's icons by name. Lucide is
  offered only when neither the project nor the design has icons. `get_starter`
  and the guidelines say the same.
- **MCP, Figma → code:** the plugin and the server read Figma with one function
  (`figma-plugin/src/shared/figma-reader.mjs`). `get_figma_reader` sends its
  source as the script, without comments, and names the plugin's export as the
  way for a whole page.
- **MCP, Figma → code:** "Not translated" groups the same remark on many layers
  into one line that names them (200 sizes set as numbers were 200 lines).

### Deprecated

- **NavItem:** `vt-active-neutral`. `vt-active` is neutral now, so the modifier
  is just an alias of it, kept for existing markup. Use `vt-active`.

### Removed
- **Banner.** The owner: a banner is an Alert. The Banner component, its page
  (it redirects to Alert) and its Figma set are gone; a rebuild of Alert moves
  Banner instances to the Alert of the same intent and removes the Banner
  artboard. `vt-banner` and its parts stay in CSS, deprecated, for one cycle.

- **What was added for one project's mockup.** The owner (16.11.2026): new
  components and options made for a single project belong to that project, not
  to the library. Gone: Button's XS size (`vt-btn-xs`), NavGroup's rail
  (`vt-side-nav-section-rail`), TimelineItem's compact size
  (`vt-timeline-item-sm`, `vt-timeline-icon`; its Actions slot stays), List's
  Heading Case (`vt-list-section-as-typed`),
  ListItem's Divider (`vt-list-item-divider`, `-inset`) and the deprecated
  `vt-input-plain` / `vt-textarea-plain`. A rebuild moves Figma instances to the
  nearest value the set still has: Button XS → SM, a NavGroup with a rail → the
  same group without it, TimelineItem SM → the event of the same Marker and
  State, a row with a Divider → the row of its state, an As Typed list → List.

- **Collapsible.** A single section that shows or hides its content is an
  Accordion with one AccordionItem. Collapsible's set, page (it redirects to
  Accordion) and registry entry are gone; `vt-collapsible` and
  `data-vt-collapsible` still draw and work for one cycle, deprecated. A rebuild
  of Accordion replaces each Collapsible on a layout with an Accordion holding
  one item of the same State — the title in its Trigger slot, the rows in its
  Content slot — and removes the Collapsible artboard. AccordionItem's title and
  chevron are now the Trigger slot and the open panel's body the Content slot
  (a neutral "Section title" and content line by default); the Question and
  Answer text properties are gone, and a rebuild carries their words into the
  slots.

- **Field.** Input, Textarea, Select and Combobox carry their own label and hint
  (Show Label, Show Helper Text), so the Field wrapper is gone as a component.
  `.vt-field`, `.vt-field-description`, `-error`, `-success` stay (they live
  with Input now). A rebuild of Input replaces each Field on a layout with the
  control from its slot, the Field's label and hint on it, and removes the Field
  artboard.

- **MenuSeparator.** One divider for everything: a dropdown menu and a combobox
  list divide their groups with `Separator` (`.vt-separator.vt-separator-h`,
  right against the rows, as in Figma). A rebuild of Separator moves
  MenuSeparator instances to the horizontal Separator and removes the
  MenuSeparator artboard. `vt-menu-separator` and `vt-dropdown-separator` stay
  in CSS, deprecated, for one cycle.

- **`@veritheme/react`.** The owner's decision (16.11.2026): Veritheme is a design
  system and an HTML component library; the React layer is not developed further.
  `packages/react` (the components, the generator, its tests and showcase),
  `packages/react-spike`, the React tab on the docs' examples and the
  behaviour functions only it used (`src/scripts/behaviour/dom.js`) are gone; the
  plans are in `docs/archive/`. Nothing was published. Restorable from the tag
  `archive/react-line-2026-11-16`.
- **APCA.** The builder's "Label contrast" question, its APCA option (the
  default until now) and the APCA score are gone from the builder, Studio, the
  color editor, `audit_contrast` in the MCP server and the Figma plugin.
  Contrast is the WCAG 2.x ratio everywhere: a label on a fill is white while
  white holds 3:1, otherwise the fill's own dark tone.
  - **What changes:** on bright fills a new builder system gets a dark label
    where APCA kept white: the orange warning fill (`--vt-on-warning`) in every
    system, and the brand fill (`--vt-on-brand`) of bright mid-tone brands such
    as Sky, Orange and Teal. Scales, the site's Default theme and every other
    token stay the same.
  - **Saved systems:** a system or a builder link that chose APCA opens without
    an error, as WCAG 2.x; the `system.json` format is unchanged, and the old
    `contrast` field is ignored and no longer written.
  - **Want white back?** In Customize colors → Roles, set On brand (or On
    warning) to Generic white for the theme you want. A label you set there is
    kept as is.
  - Versions 1.2.x of `@veritheme/mcp-server` already on npm still report APCA
    Lc in `audit_contrast`.

### Fixed

- **Nested corners count the border too (concentric radii, owner,
  19.11.2026).** A plate inset in a bordered container takes the container's
  radius less the padding *and* the border between their edges, so the two
  corners run parallel. The open Pill tab was a pixel rounder than its track:
  8px in a 12px track with 4px padding and a 1px border, now
  `calc(radius-md − spacing-1 − border-width-control)` = 7px; the small list
  5px instead of 6px (8 − 2 − 1). The same pixel came off the select's
  options (7px), the toolbar's buttons (7px), and the dropdown menu's and
  combobox's items (11px). Written from the same tokens, the rule holds under
  every Corners shape: Soft 8/3px, a 2px Bold border 12/6px, and on Sharp the
  difference goes below zero and the corner is square. Figma variables hold
  no expressions and the radius scale's steps are even, so with a 1px border
  no step gives the exact value: Generate keeps binding the nearest step
  (radius-sm 8px for the tab, radius-md 12px for the menu items) and the
  recipe says so. The MCP spec's Tabs sizes now read the code (radius-md,
  not `vt-rounded-lg`; the small list; a 2px `border-width-strong`
  underline).
- **Figma: Overline texts keep their text style.** SidebarNav's group labels
  and List's heading came out with no text style: Generate bound Overline,
  then wrote the uppercase the style already sets, and Figma unlinks a text
  from its style on any direct write of a style field. A style field is now
  written only when the text does not already show that value.
- **Figma, Check: "Frame 12" and "Group 3" are caught again.** The
  unnamed-frame rule had lost the backslash of `\d`, so only a bare "Frame"
  or "Group" was caught and Figma's numbered defaults passed as names. The
  MCP server's handoff check shares the rule and is fixed with it.
- **Figma: icons keep the line ends and corners of their Hugeicons glyph.**
  The Icons board forced round caps and joins on every path; 22 icons whose
  glyph says otherwise now have flat ends and mitered corners where the glyph
  has them (Mail's flap no longer sticks out past the envelope).
- **Figma: the Icons board says "Hugeicons stroke-rounded icon set."**, not
  Lucide; the Icons spec and its usage line in the MCP data and
  `llms-full.txt` say the same.
- **Figma: Generate after a collection was deleted with the plugin open.**
  A deleted 05 Typography (or one of its variables) failed the whole run
  until the plugin was reopened; all five collections are now forgotten
  together before a run.
- **Figma: a rebuild replaces only its own artboards.** A component's
  artboard pasted on a working page, or a designer's own frame of the same
  name, was removed by the next rebuild. An artboard now counts only in the
  plugin's sections or top-level on the plugin's pages.
- **Figma: under Full annotations Icons stays in the file.** Every
  artboard's sidebar uses its CircleCheck chips; when Icons was not asked
  for, it was built and removed after the run, leaving the chips as
  instances of a deleted main.
- **Copied examples carry working markup.** The Progress, Resizable, File
  Upload, Stats Card and Empty State examples held hashed `vt-inline-<hash>`
  classes that exist only in the site's CSS — in the shadcn registry and the
  MCP snippets too — so a copied bar had no width and a copied panel no
  size. Progress bars take the library's `data-vt-progress`; a Resizable
  panel's start size stays inline, where the library reads it. The check
  now fails on any `vt-inline-*` in what is built for users. The API tables
  list only classes that are in `veritheme.min.css` or are a `veritheme.js`
  hook: `progress-animated` and `vt-stats-card-up`, documented but never in
  the stylesheet, are gone from the docs.
- **Docs, utilities: the Prefixes table lists only the classes that
  exist.** It promised that a prefix works in front of any utility and
  showed examples the stylesheet does not have (`vt-hover:bg-surface-subtle`,
  `vt-lg:flex-row`…); it now lists, per prefix, the classes the stylesheet
  holds, read at build time.
- **Site: no text below 12px, no system scrollbars.** The builder,
  Customize, the top bar, search and the footer take the caption size
  instead of a hardcoded 11px, so text stays at 12px on phones too. The
  Google font list, Customize's wide tables, the Studio list, the docs
  search results, the mobile navigation drawer, every code block and the
  docs' own scrolling boxes use the custom scrollbar.
- **Builder: Download says "copied" only when it was.** The Download window
  wrote "AI instructions copied." whatever happened; it now shows the real
  outcome under its buttons. Customize and Download are non-modal panels, so
  they no longer claim `aria-modal`.
- **Figma: the Foundations boards are laid out by auto layout again.** A
  frame was resized after it was told to hug its content, and Figma's resize
  fixes both sides: the Palette's description column came out 10px tall and
  ran into the next row, the step and HEX under each swatch spilled below the
  board. Every board now sizes first and hugs after (`wrapText`, `fixWidth`,
  `fixBox` for a swatch or a sample of a set size), and so do the component
  frames (a hugging width set before a fixed height) and the variant table's
  state labels. The Palette: rows 32px apart with no rule across the swatches,
  a card per step (the swatch with its contrast, then the step and the HEX),
  the role's dot in the swatch's top right corner, no mark and no role chips.
  A scale that repeats another step for step is one row: Brand · Blue in the
  default theme. Colors, Typography and Layout lose their marks ("Variables",
  "Text styles" with the count, "Grid styles"); Layout has one heading. The
  typeface cards are one width, the large "Ag" and "Aa" have a line as tall as
  they are (they ran over the family's name and the alphabet), the alphabet
  sits in its own group. A test checks every board: no layer placed
  absolutely, no text with a fixed box, auto layout everywhere, every frame
  that holds layers hugs them in height unless it is a marked specimen. The
  Figma stub's resize now fixes both axes and a text's box, as Figma does.
- **Figma: no "Properties removed from layers in this slot" on Generate.**
  Figma takes a property binding off a layer that sits in a slot, so two
  properties never worked: AvatarGroup's Show More (the +N counter lay in the
  Avatars slot) and SidebarNav's Group 1 Label and Group 2 Label (the group
  labels are text in the Content slot). The counter now sits after the slot —
  the markup is unchanged, it is still the group's last child — and Show More
  works; a rebuild leaves an old counter out of the slot and carries its text
  and whether it was shown onto the new one. The two label properties are
  gone: the labels are edited in the slot. A contract can no longer put a
  visible, text or swap property inside a slot (the build says so), and a
  test fails if Generate binds any layer inside a slot.
- **Figma: Globe's circle sits on its stand.** The plugin turns each icon's SVG
  into paths and skipped the `transform` attribute, so Globe's circle
  (`matrix(-1 0 0 1 20.5 2)`) was drawn in the top-left corner. The converter
  applies matrix, translate, scale, rotate, skewX/skewY and a group's transform;
  only Globe's paths change. `audit:icon-bounds` (in `audit:all`) fails on a
  contour outside the 24 box or pinned to its top-left corner.

- **Figma: Generate no longer stops on "Cannot insert node at a negative
  index".** Moving a Collapsible to an Accordion (and a Field to its control)
  looked its layer up by object, and Figma hands out another wrapper of the same
  node, so the index was −1. The place is found by id now; a layer inside another
  instance (where nothing can be put) is left and named. A step that fails on one
  set no longer stops the run: the other sets are placed and moved, and the
  report names the set and the step; if placing stops as a whole, no draft is left
  on the page. The Prepare panel's icon swap takes the same care.

- **An imported theme's contrast is checked, both modes.** The importer
  (plugin, site, MCP) scores every pair the components put together in light
  and dark. An accent label under 3:1 on its fill — unreadable at any size — is
  replaced by one that reads at 4.5:1: white where white does, else the
  family's dark tone, darkened until it does. A label between 3 and 4.5:1
  stays as authored (the builder keeps white on a bright fill on purpose) and,
  with every other pair under WCAG AA, is listed on the theme's card in the
  plugin. `npm run audit:contrast -- path/to/theme.tokens.json` scores a theme
  file the same way.

- **Figma: overrides inside a slot of another instance survive a rebuild.** A
  library row in a project instance's slot (a Thread's rows) and project cards
  in a slot (PresetCards in EmptyChat) lost their texts, toggles, swapped
  components and names when a swap in a main reset them — all to the main's
  first values, silently. The rebuild finds such instances again (an instance in
  a slot counts as holding a moved one), finds a layer whose name was itself an
  override by its place when the name is gone, puts the name back, and names
  every property it cannot put back (layer, property, what it was).

- **Figma: opacity variables hold percent.** `opacity/*` in 04 Primitives
  held 0–1, and Figma reads a variable bound to a layer's opacity as 0–100, so
  `opacity/50` gave a layer 0.5%. They hold 0, 5, 10, 20, 50, 80, 100 (and
  `disabled` 50) now; a variable already in a file gets its new value in
  place, same id. The tokens and the CSS keep 0–1. The Figma → code
  translator turns a layer's opacity on the scale into `vt-opacity-*`; off the
  scale it stays a note.
- **Figma: the danger status ramp is `danger/*` in 01 Palette.** The colour
  role became danger, but a theme's status ramp kept arriving as `error/*`
  beside info, success and warning. A file's `scale.error` and its
  `scaleFamilies.error` now import as `danger`, and an `error/*` ramp already
  in a file is renamed in place, so aliases and bound layers follow it. The
  hue stays `red`.
- **A theme file written before the large type still gets Heading/XL and
  Display.** A `tokens.json` with typography lists every style its system
  keeps, so one it leaves out was read as deleted — and a file exported before
  16.11.2026 left out the four new styles it had never heard of. The export's
  typography group now carries `$extensions["com.veritheme"].styles`, the
  styles its contract knew; on import only a style in that list (or, for an
  older file, among the styles before the large type) is taken as deleted. A
  style added since arrives with the library's values in the theme's font.
- **Sidebar Nav: two header actions sit together at the end.** Every action
  in `vt-side-nav-header` took `margin-inline-start: auto`, so two buttons
  (search, collapse) were split 40px apart; now only the first is pushed to
  the end and the next follows 8px on, as the Header Actions slot in Figma.
- **A compact sidebar no longer scrolls sideways.** A `vt-nav-item-compact`
  square was 44px (12px around a 20px icon) in a 64px rail whose body kept
  12px on each side and a 1px border: 64px of content in 63. The square is
  now 40px, as Figma draws the rail's button, and the compact rail's body
  and footer have no side padding: the squares sit centered (Figma: the
  Compact item is 40×40, the Compact body pads 12 top and bottom only).
- **A section toggle in a Sidebar Nav is a button in the contract.** The
  first row of a collapsible section (`projects-toggle`) is `<button>`, as
  the docs and NavGroup already wrote it.
- **Page states return the focus to what opened a menu or a dialog.** After
  Escape (or a click elsewhere) the focus went to the first element leading
  back to the closed state, or to the body when there was none. In an HTML
  build each state draws its own copy of the region, so the opener is another
  node. The script now remembers the opener (its `data-vt-go`, label, place
  among its like and position) and focuses its copy; failing that, the element
  nearest to where it was, never the body. A row's "More" menu and the delete
  dialog it opens return to that row's "More".
- **Page states keep an element's role.** The states script made every
  element with `data-vt-go` a `role="button"`, so a menu row that leads to a
  dialog lost `role="menuitem"`. An element that has a role keeps it, and its
  tabindex.
- **Figma: a finished upload shows its check.** FileUploadItem State=Done drew
  the Empty placeholder where code shows a CircleCheck in the success color;
  the plugin draws the check now (a glyph of the state, like a checkbox's).
- **Figma plugin: a rebuild keeps prototype links.** Swapping an instance to
  the new component dropped the interactions set on its layers (Delete on a
  chat menu's row no longer opened the dialog). They are read before the
  swap, on the instance and every layer in it, and set again after; the run
  counts them ("Prototype links put back"). The same for what else a swap
  drops on the layers inside: texts, visibility, component properties and
  which component a nested instance is of, slot content and the project's
  instances in it included (five agents of a sidebar came back as "Inbox").
  When a swap leaves an instance without layers its new main has (a hidden
  Header and Footer that gained slots), its overrides are reset to bring
  them back, and what it held and showed is put back after.
  Instances that are not moved but hold one that is (a project component's
  instance on every artboard, whose main holds library rows) keep their
  overrides and links too: a swap in their main renews their layers, so what
  is set on them is read before any swap and put back after the run. The run
  says how many of how many it put back, and counts the layers with links
  before and after; it no longer says "content kept" when anything was lost.
  A slot whose children an instance changed (one taken out, one added) gets
  them back; an instance whose slot is put back from copies is found again by
  its place when its id is gone (the agents in a project Sidebar's main). The
  run counts prototype links summed over the file, and names each override it
  could not put back.
  The colour set on an icon's vector, the name given to an instance ("More"
  on a Button), and a slot child an instance only hides are kept too.
  An icon a button swaps in by its Icon Glyph property comes back through
  the property (it came back as the Empty glyph under Icon Glyph = ArrowUp,
  without the button's colour), and a library icon's vector is named "path",
  as the placeholder's and a project icon's are, so the colour a component
  gives its icon carries to whichever is swapped in.
- **Figma plugin: old copies nothing uses are removed.** A copy an earlier
  run kept as "(old, still used)" goes on the next run once no instance
  outside it uses its components, whether or not that run rebuilt it
  ("Old copies nothing uses any more, removed: …").
- **Figma plugin: a rebuild no longer breaks instances it did not reach.**
  Three kinds were left on the old components, which were then removed:
  - a variant swapped inside an instance of a project component (a sidebar's
    active row);
  - library instances in a project component's slot (a chat header's
    buttons);
  - every icon but the first, since one component per artboard was paired
    and the Icons artboard holds hundreds.

  Every component of a replaced artboard is now paired by name; instances
  inside other instances move too; instance-swap defaults outside the run
  point at the new icon. Before anything is removed, the whole file is
  checked: an old component still in use is kept, and the run lists each
  instance left on it ("Still on old components"). A layer that a swap above
  it replaced is skipped, not fatal: one such layer stopped the whole relink
  in a large file; an instance whose layers a swap nearby renewed is read
  again by its id and moved on the next pass, and no walk throws from its
  callback (Figma showed those as plugin errors); a layer no read can reach
  even then (an override of a layer the new component lacks) is skipped on
  the second try and counted, and an instance left behind is listed with
  where it sits and what it is an instance of. A slot is found by the
  layers an instance has now, not by findAll, which on an instance whose slot
  the designer filled with something else still hands out the main's default
  content (a NotificationBadge with its own button in Content). The next Generate on a file where a relink stopped
  finishes the move and removes the copies kept as "(old, still used)",
  instead of adding a third one.
- **Figma: a tab in Tabs is 30px tall again.** In the Triggers slot the open
  tab hugged its label and came out 20px tall: the track takes away a tab's
  vertical padding, and the plugin passed that on to the instance but not the
  height that replaces it. An instance now takes a height the composite sets,
  as it already took a width. Tabs was the only component it changed.
- **Check on a library component:** the canvas width of a library component
  checked on its own page (its example width) no longer shows up under
  "Numbers, not variables"; two layers alike in one frame (two options
  "Remix") are one row that says "2 layers", and a click selects each in
  turn — the second could not be selected before. The Combobox field in
  Figma is drawn in its default state, not focused.
- **Reduced motion:** with `prefers-reduced-motion: reduce` a closed Dropdown
  Menu, Popover, Dialog or Select is hidden at once; it used to turn
  transparent at once but stay visible, and clickable, for another 150–200ms.
- **Dialog:** a dialog inside an overlay no longer also carries the
  `vt-dialog-in` keyframes (they played once, hidden, on page load); it moves
  by its transition only. A dialog placed open on the page keeps the keyframes.
- **Right-to-left:** the mini switch thumb moves to the start of the track
  instead of out of it, and the shifted accordion animates its
  `padding-inline-start`.
- **Switch, right-to-left:** in an RTL page the thumb of a switch that is on
  now sits at the track's left end, 2px from the edge, in all three sizes and
  with the same animation; it used to slide out past the track. Left-to-right
  switches are unchanged to the pixel.
- **Builder on phones and tablets:** every control on `/start/` is at least
  44px to tap at phone width, in portrait and landscape and on touch tablets;
  the site header keeps its look and grows only its tap area. Customize and
  Download open full screen on a phone. The preview switches wrap instead of
  being cut off at 768px. Desktop with a mouse is unchanged.
- **Customize colors:** the scale and role tables scroll sideways with their own
  scrollbar and a fading edge where more columns wait; every hex reads in full
  (at 1280 and 1440px the 950 column and some hex codes were cut off).
- **Funnel counting:** opening the builder for a new system, the first edit,
  opening Customize, every download (click and file handed over, by format),
  copying the share link and saving a system now reach the counter. Only the
  event name and a short label are sent, never the system or its values.
- **Generated theme, component parameters:** a Shadow parameter no longer
  takes the keyboard focus ring away. The parameter sets the component at
  rest; in the states its recipe styles itself (focus and pressed for the
  button; focus for inputs, selects, textareas, checkboxes, radios, switches
  and OTP cells) the library's own style stands, as in Figma. Works with the
  current library and with older ones.
  - If your theme sets a shadow on the button, input, checkbox or switch,
    download the theme again to get the focus ring back: a `theme.css`
    downloaded before this release keeps hiding it with any library version.
- **Tailwind, SCSS and Style Dictionary exports** now carry what `theme.css`
  carries: component parameters (radius, height, padding, gap, shadow, font
  size), per-component rebinds, and the control heights and paddings a density
  other than Regular sets. They used to fall back to the library's radii,
  heights and paddings. Style Dictionary lists parameters and rebinds under
  `component.*` as references to the file's own tokens, and rebinds are typed
  by what they point at (a radius is no longer called a color).
- **tokens.json** tells the Figma plugin which states keep the recipe's value
  (`$states`) even for a system saved without them, so Figma and CSS leave the
  same states alone.
- **Number input:** − and + step by the input's `step`, as the docs promised
  (they always stepped by 1), counted from `min` as the browser's own stepper
  does, within `min` and `max`, and without floating-point noise (0.1 + 0.2
  shows 0.3). A step now fires `input` and `change` on the field.
- **Scroll view:** the edge indicators show as soon as the content overflows,
  not only after the first scroll, and follow the box and its content when
  they change size.
- **Docs (component specs):** Accordion, Tabs and Tree view name the classes
  the bundle and the CSS use (`.open` on the accordion panel and the tree
  branch, `.vt-active` on the tab). File upload no longer names a
  `.vt-file-upload-disabled` class that had no style: `aria-disabled="true"`
  on the zone turns it off.
- **Figma → code:** a frame named Input or Textarea around one text is a field
  the design draws itself, and becomes a real `<input>` / `<textarea>`: muted
  text is its placeholder, ordinary text its value.
- **Figma → code:** the library's Input stripped to a bare field (no fill, no
  border, small paddings) kept the control's full height, and text typed into it
  came out as a placeholder. The changed height now follows the paddings, and a
  hint repainted in the text color is the field's value.
- **Figma → code:** a size bound to a variable outside the spacing scale (a
  separator line as tall as `border-width/thin`) was dropped, and the line with
  it; it is now that variable in CSS. A fill removed from a part takes along the
  ring the library draws around it (the count in a nav item), and keeps the
  focus ring.
- **Figma → code:** a layer's least and most size (`min-height` of a row of
  steps, `max-width` of a message) was not read, so a rail between two icons
  collapsed to nothing. A child stretched across a row no longer costs the row
  its alignment.
- **Figma → code:** a layer laid on the artboard itself with Figma's default
  pin (top left) is pinned to the edge it is nearer to: a menu drawn just above
  the bottom edge no longer hangs in the middle of a taller window.
- **Figma → code:** layers placed out of the flow keep their place. A menu over
  the field it opens from, a status dot on the corner of a logo, a divider
  stretched under a row: the reader sends where each sits and which edges it is
  pinned to, and the markup gets `vt-absolute` in a `vt-relative` parent (the
  numbers go to CSS with `raw`, or are named in the report without it).
- **Figma → code:** a variant the designer added to a library component
  (CountBadge with a new Type and a green dot as Type=Connected) is read in full
  as the project's own, instead of being written as the library's class with the
  wrong look.
- **Figma → code:** an icon keeps the color it is painted with in the design
  (`tint` → `vt-text-…`), a line drawn outside its box becomes a ring instead of
  a border, and a line's weight is read.
- **Figma → code:** a color changed on a text that has no element of its own (the
  count in a nav item's badge) was dropped; an icon swapped into a slot produced a
  meaningless radius rule on every instance.
- **Figma → code:** two copies of one drawing shared the ids Figma exports
  (`paint0_linear…`), so the second took the first one's gradient, and vanished
  when the first was hidden. Ids are now unique per drawing (`idPrefix` for a
  caller that joins several translations into one page).

- **Builder:** Pill corners now reach the downloads. The guided builder showed
  fully round buttons, fields and selects, but `tokens.json` and `theme.css`
  were exported without those component radii, so Figma built the buttons with
  the regular `radius/xl`.
- **Figma plugin:** Hairline lines are 0.5px in Figma. Before, Apply theme set
  `border-width/default` to 1px, and `border-width/thin` (cards, dividers,
  table rows) always stayed at 1px. The plugin now reads the theme's line width
  from `tokens.json` and writes it into `border-width/thin`; a theme without one
  gets the control width capped at 1px, as in the exported CSS.
- **Figma plugin:** the theme preview shows a component's own radius, so Pill
  buttons and fields look round there too.
- **MCP, Figma → code:** an icon is told from a component by what its main
  component is, not by its name. An icon called Calendar was read as the
  Calendar component.
- **MCP, Figma → code:** a gradient fill is no longer reported as a removed
  fill. The library report wrote `background: transparent` for a gradient
  Avatar. A paint the reader cannot read is named and gives no CSS.
- **MCP, Figma → code:** an icon button is named after its layer ("Search"),
  not its component ("Button"). An icon where the component has no slot
  (a pin in a sub-item of NavItem) stays in the markup as a plain icon.
- **Dropdown menu:** a menu with several triggers bound its keyboard and click
  handlers once per trigger. With 14 triggers one arrow key moved the focus by
  14 items. They are bound once per menu.
- **MCP, Figma → code:** a change made to a library component inside a project
  component was not seen: Figma lists no override for it. The reader now
  compares each layer with the main component's. In the test file the sidebar
  strips the fill of its items' count badges; they came out red.
- **MCP, Figma → code:** a fill or stroke that was removed on an instance is
  written as `transparent` instead of being dropped.
- **MCP, Figma → code:** a library change drawn in the default state no longer
  repaints the disabled one (a gradient on Button covered the disabled gray),
  and a change in the Disabled variant applies to `:disabled` only.

## [1.2.4] — 2026-11-10

### Fixed

- **MCP / Figma plugin:** a variant value the component does not have
  (`Variant: Outline` on a button) is now listed under "Not translated" with
  the values that do exist. Before, the instance came out with no variant class
  and nothing said so.
- **MCP:** `validate_markup` has a `component-structure` rule for components
  whose classes are all real but whose markup is broken: a block element inside
  `vt-btn`, a `vt-field` with no control, a `vt-check-label` with no
  checkbox, radio or switch. Before, such markup passed as clean.

## [1.2.3] — 2026-11-09

### Changed

- **MCP:** `list_components` and `search` now show each component's "when to
  use" line, which names the look-alike to take instead (toast vs alert,
  switch vs checkbox, spinner vs skeleton). Before, an agent saw it only in
  `get_component`, after it had already picked. `search` also matches that
  line, with the words of a query in any order, so "transient feedback" finds
  Toast. A test keeps every component's line and the look-alike pairs in place.
- **MCP / llms-full.txt:** "when to use" lines say only when to pick a
  component; the how-to advice that was mixed into some of them is now in the
  component's gotchas, which llms-full.txt now includes too.
- **Examples:** every example now uses Hugeicons (stroke-rounded, the free set),
  like the docs. Before, most of them still drew Lucide icons, so neighboring
  pages such as Blog and its post looked different.
- **Examples:** each downloadable archive has a LICENSES.txt with the full
  Veritheme and Hugeicons MIT notices and a note on the Unsplash photos; the
  README points to it.

### Fixed

- **MCP:** eight component parts (Tabs Trigger, Accordion Item, Stepper Step,
  Timeline Item, Tree Item, Page Button, File Upload Item, Feature Section
  Item) were listed by `list_components` as "— undefined"; they now have a
  description and say which component they live in.
- **Examples:** the Dashboard and Analytics examples share one sidebar. Analytics
  had kept the old icon set and had no account entry at the bottom; both now
  show the same Hugeicons icons and the Jane Doe account row.
- **Examples:** Mail and Compose share one folder sidebar; Compose had lost the
  Labels group.
- **MCP:** patterns built from the examples include markup from shared example
  parts and items styled with `class:list`, so `get_pattern` no longer drops
  the sidebar or components such as stats cards and pricing cards.

## [1.2.2] — 2026-11-08

### Added

- **Sidebar Nav:** `vt-side-nav-floating` — the inset panel with a full border
  and the card radius, for a sidebar that stands off the screen edge.
- **Docs:** code in the Code tabs and code blocks is highlighted (tags,
  attributes and values in theme colors, dark mode included), and every copy
  button shows a check once it has copied.
- **Docs:** Layout and Utilities pages under Foundation, in place of Utilities &
  Layout (the old address redirects). Utilities lists every class in one table
  with search and group filters.
- **Site:** the home page has a "Design to code" section. It shows a Figma frame
  drawn with the library, the MCP server turning it into HTML, and the resulting
  page, with Code and Preview tabs to compare the markup with the frame. The
  server's thinking animation is drawn with
  [thinking-orbs](https://github.com/Jakubantalik/thinking-orbs) (MIT, Jakub Antalik).
- **Docs: MCP Server page** (`/docs/mcp/`): setup for Claude Code and other MCP
  clients, using your own system, the Figma-to-code flow and every tool the
  server has. The home page's "Set up MCP" buttons now open it.
- **MCP: a command line and a Claude Code hook.** `npx @veritheme/mcp-server
  validate <files or folders>` lints HTML, Astro, Vue, Svelte, JSX and TSX with
  the `validate_markup` rules and exits with 1 on an error, so it can fail CI.
  `npx @veritheme/mcp-server hook`, set as a PostToolUse hook, lints every file
  the AI writes and hands the errors back before it moves on. The MCP Server
  page shows both. With no command the binary is the MCP server, as before.
- **Docs: Getting Started page** (`/docs/getting-started/`): the whole path in
  order — create a system in the builder, add its package to the project,
  generate the library in Figma, load it in code, connect your AI, build a
  screen from a frame or a spec, and keep all of it in sync. Introduction and
  the home page's fifth step link to it.
- **Docs: Installation** covers your own theme (`theme.css` from the builder's
  package, right after the library) and dark mode (the `.dark` class, a
  no-flash script and a toggle).

### Changed

- **Builder (`/start`):** a new system that was changed and not yet saved asks
  before you leave the page, so closing the tab or following a link no longer
  drops it silently. The download window says it lives only in this tab until
  it is saved.
- **MCP `get_starter`:** with your system's package in the project, the page
  skeleton links its `theme.css` right after the library, instead of telling
  the AI to inline `get_theme_css`.
- **MCP `figma_to_markup`:** compares the Figma file's variables with your
  project's system when one is installed, not with the Default theme. A file
  generated from your system reports no theme changes, and a real difference
  names the system and its revision.

- **Florin 1.1.0:** the template runs on the published veritheme 1.2.1, built
  on its components (Sidebar Nav, Header, Dropdown Menu, Table, Stats Card,
  Dialog, Select, List, Auth); what the library does not ship stays inside
  Florin. The removed Editorial and Rounded Sans presets give way to Florin's
  own Mint theme, and the demo previews on /examples/florin/ are reshot.
- **Theme:** `warning-fill` is orange-500 in both modes, with a dark label
  chosen by contrast. It was orange-700, a burnt orange that read as a second
  red next to `error-fill`, especially for color-blind readers.
- **Sidebar Nav:** `vt-side-nav` sits on the screen edge by default — one
  border, on the side facing the content, and no corners, the way Page Layout
  already drew it. Add `vt-side-nav-floating` to keep the old card look.
- **Rating:** filled stars are yellow (yellow-400) instead of the warning
  orange.
- **Site:** the menu reads Studio · Docs · Examples, and Docs stays lit on every
  docs page. The sidebar's first group is "Get started". The hero keeps one
  call to action.
- **Docs:** pages are shorter and built from the library: the example frame
  uses Tabs and Code Block, Introduction and Design Principles use cards and an
  accordion, Design System is seven sections instead of nineteen, and the
  Colors token table works like Studio's (light and dark per role, state
  colors behind a switch, a note on what each role is for).
- **Site:** the tagline is now "Design systems, generated for Figma, code & AI"
  (page title, search and social descriptions, footer), in place of "One source of
  truth for Figma, code & AI". The home page's "How it works" block says the same:
  the system, in numbers, generated for Figma, code and AI.
- **Site:** the home page's steps follow the design-to-code path — Theme, Library,
  Screens, Code, and a fifth step, Sync — as a row of equal cards that scrolls
  sideways, with arrows and the site's own scrollbar. The CTA banner spans the
  content width over an even blue veil, and the footer lines up with the content.
- **Site:** Storybook moved from the header to the footer's Tools column. The
  header keeps the Figma Plugin as its one outside link.

### Fixed

- **Site:** the home page and the FAQ no longer say the Figma plugin exports
  tokens; it imports them, and the builder stays the source. The home page's
  fourth step shows the full `claude mcp add` command, which works as typed.
- **Page reset:** a page built from the system package, from Getting Started,
  from Installation or from MCP `get_starter` had the browser's 8px margin
  around it and the browser's fonts on its body. The reset lives in its own
  file, `veritheme-base.min.css`, so the library can join any page untouched,
  and nothing loaded it. The package now ships it and its demo page, README and
  AI.md load it first; the docs and `get_starter` do too, and say when to leave
  it out.
- **System package:** carries the system's name. The manifest, README, AI.md
  and the demo page said "My design system" whatever you called it. The demo
  page is rebuilt from the library's own card and dialog the way they are
  documented, so the first Veritheme page a newcomer opens passes
  `validate_markup`.
- **Pricing Card:** one Monthly/Yearly switch now updates every price and
  description in its `[data-vt-pricing]` group, so a row of plans can share
  one switch. Before, only the first card changed. A single card works as it
  did.
- **MCP:** `get_starter` with your system's package in the project links the
  library files from the package, the version your theme was built on, instead
  of whatever the CDN serves. `validate_markup` no longer counts a dialog's
  primary button as a second one on the page: a modal is a view of its own,
  and so is a hidden step or an inactive tab panel (`hidden`, `vt-hidden`).
  `get_component` also finds a component by its
  class (`btn-group`, `vt-btn-group`), and "no project system" points to the
  builder at `/studio/` instead of `/create`.
- **Figma plugin and system package:** "Open the wizard" and the package's
  README point to the builder at `/studio/` instead of the old `/create`
  address, and the README says where to drop `system.json` to revise.
- **MCP `validate_markup`:** a split button (an action and its menu trigger
  joined in one button group, both primary) counts as one primary action, so
  the documented pattern no longer trips `one-primary`.
- **MCP `validate_markup`:** reads framework source, not only HTML. JSX
  `className`, including `{"…"}` and template literals, is checked like `class`;
  Vue's bound `:class` is skipped instead of misread; `onClick`, `@click` and
  `on:click` count as handlers; `<Table>` and other capitalized tags are taken
  as components rather than hand-built HTML; an arrow function inside a tag no
  longer cuts it short.
- **Examples:** Compose sends from a primary split button, as the Button
  Group documents, and its sidebar Compose steps down to bordered so Send is
  the one primary action; Landing, Contact and Blog Post divide sections with
  the Separator component instead of hand-drawn borders.
- **Studio screens:** layout is spelled with library utilities instead of
  private classes; bars on the brand tile use the on-brand token instead of
  hardcoded white, and the product page's first spec no longer sits higher
  than the rest.
- **Tabs:** the default tab list is 40px tall, border included, like every
  other control of that size. It was 41.6px, because the tabs did not subtract
  the track's border.
- **Color Swatch:** hovering or selecting a swatch no longer shifts its
  neighbors in a row. The ring is drawn with shadows; the border keeps its
  width.
- **Docs:** the Code tab of an example switches again. Since the attribute was
  renamed, the code appeared under the preview instead of replacing it, on
  every page.
- **Tabs:** in the small tab list (`vt-tabs-list-sm`) the tabs no longer
  overflow the track by its border. The open tab sat 1px from the top and
  bottom edges and 2px from the sides, and the track clipped its shadow. The
  tab height now subtracts the border too.
- **Site:** the footer's light/dark switch shows the current mode from the
  first frame. It used to appear with no mode selected and light up a moment
  later.
- **Site:** the GitHub star count in the header stays after moving between
  pages. The header is redrawn on every page change and the count was only
  fetched on the first one. The count is now built into the page, and the
  browser keeps the last value for an hour, so hitting GitHub's limit of 60
  requests an hour no longer empties it.
- **Storybook:** stories use the exact markup from the docs pages again. The
  generator stopped finding the example panels once they gained a
  `data-theme` attribute and silently fell back to shortened markup. It now
  fails the build if that happens.

## [1.2.1] — 2026-11-07

### Breaking

Released as a patch, 1.2.1, by the owner's decision: nobody builds on the renamed
tokens and selectors yet. Update your markup and CSS as listed here.

- **Every custom property now starts with `--vt-`:** `--brand-fill` is
  `--vt-brand-fill`, `--radius-md` is `--vt-radius-md`, `--btn-bg` is
  `--vt-btn-bg`. A host application's own `--radius-md` no longer restyles
  Veritheme, and Veritheme no longer overwrites it. To migrate your CSS, replace
  `var(--name` and `--name:` for Veritheme's tokens, and export your theme again:
  a `theme.css` from an earlier version sets the old names, which nothing reads.
  Saved systems keep working, because they store token names without the prefix.
  Figma variable names (`brand/fill`) and utility classes (`vt-bg-brand-fill`) do
  not change. The Tailwind export keeps Tailwind's own `@theme` names, such as
  `--color-brand-fill` and `--radius-md`, and reads `--vt-*` behind them.
- **`veritheme.css` no longer touches markup it doesn't own.** The global reset
  and the root `font-size` moved to the new optional `veritheme-base.css`. A page
  built on Veritheme should load it first; a `vt-*` component looks the same
  with or without it. Without it, the root stays at the browser's size, so rem
  tokens are not stepped down to 14px on small screens.
- **Slider:** `input[type="range"]` is no longer styled globally. Add the class:
  `<input class="vt-slider" type="range">`. The script now reads `.vt-slider`.
- **Every data attribute the script reads now starts with `data-vt-`:**
  `data-accordion*`, `data-tab-group`, `data-tab`, `data-panel`,
  `data-dropdown-trigger`, `data-popover-trigger`, `data-collapsible*`, `data-tree`,
  `data-carousel*`, `data-calendar*` and the rest. Your own `data-tree` or
  `data-group` no longer wakes up Veritheme's behavior. Add the prefix to your markup.
- **`veritheme.js` leaves one global, `window.veritheme`.** Call
  `veritheme.openDialog()`, `veritheme.closeDialog()`, `veritheme.showToast()` and the
  other functions on it, including in `onclick`. Bare `openDialog()` and `UCDialog`
  are gone, so they no longer overwrite your own functions of those names.
- **Removed legacy classes** `.dialog-overlay`, `.dialog-content`,
  `.popover-content`, `.popover-wrapper` and `.popover-{top,right,bottom,left,…}`.
  Use their `.vt-` versions with `.vt-open`.
- **Removed** the unused `[&::-webkit-slider-thumb]:*` utilities. `.!block` and
  `.!bg-transparent` are now `.vt-!block` and `.vt-!bg-transparent`.
- **Keyframes** `dialogIn` and `popFadeIn` are now `vt-dialog-in` and
  `vt-pop-fade-in`.
- **Cascade layers:** the library is in `veritheme.components` and
  `veritheme.base` instead of `veritheme`. `@layer veritheme` still orders both.

### Removed

- **`vt-btn-link`** (use `vt-link`) and the show/hide password button
  `[data-vt-password-toggle]` (a password field is a plain `vt-input`).
- **The older combobox markup:** `.vt-combobox-tag`, `.vt-combobox-tag-remove`,
  `.vt-combobox-trigger` and `.vt-combobox-button-label`.
- **Three things Figma did not have, so that code and Figma match:**
  `.vt-carousel-nav-btn` (use `vt-btn vt-btn-bordered vt-btn-icon vt-btn-sm vt-carousel-nav`),
  `.vt-notification-btn` (use an icon-only `vt-btn` with `vt-notification-badge`) and the
  Not Found page (build a 404 from Empty State; its page shows how). `npm run audit:all` now
  fails on anything in the library that Figma does not have.
- **About 250 one-off utilities nothing used**, such as `vt-from-info-fill/30` and
  `vt-hover:bg-black/5`, and `vt-bg-purple-500`, which no token backs. The spacing
  and sizing scales stay complete.
- **The refusal of theme files with pre-September 2026 token names.**
- **`/themes-legacy` and `/wizard`**, three one-off migration scripts and the
  `palette-shots` folder.

### Fixed

- **Text keeps its color on a dark page.** The Auth, Card, EmptyState and StatsCard titles,
  Avatar, Chip and Table cells had no color of their own and took the page's, so a project
  that sets none got black text on the dark theme. They now use `foreground-primary`, as
  their Figma layers do.
- **Overlays stack by the `--vt-z-*` tokens.** Dialog, dropdown, select, calendar,
  popover and tooltip all sat at `z-index: 50`, so DOM order decided which was on top.
- **Color utilities follow the tokens:** `vt-bg-blue-500`, `vt-bg-white`,
  `vt-text-white` and their kin were fixed colors.
- **Focus stays visible in forced-colors mode.** Focus rings used `outline: none`
  plus a `box-shadow`, which forced-colors mode removes, so a focused button
  looked unfocused.
- **Focus rings meet 3:1 contrast.** Button, button group, checkbox, radio and
  switch rings were 25% opaque, about 1.3:1 on the page background.
- **The slider and the number input now show focus.**
- **The studio's own editor opens on Colors again.** A rename of the `colours`
  section id left it on an empty "Overview". Its 17 browser tests had been failing
  since `/start/` took over the path, which also hid this; they run again.
- **Reduced motion no longer stops the host page's animations**, and no longer
  overrides the spinner's own reduced version.
- **`veritheme.min.css` is fully minified**, about 17% smaller: component files
  used to be inlined after compression.
- **Removed `@charset` from inside the layer block**, where it is invalid, and the
  Astro view-transition styles, which only the docs site needs.

### Added

- **`npm run check:js-isolation`** runs the bundle and fails on any global but
  `veritheme`, an unprefixed data attribute, or a document-wide selector outside the
  library.
- **`npm run check:css-isolation`** fails the build on a global selector, a root
  `font-size`, an unprefixed `@keyframes` or custom property in the main bundle,
  and on a focus rule that hides focus in forced-colors mode.
- **`browserslist`** in `package.json` states the supported browsers.
- **Type checks cover the whole project.** `npm run typecheck` runs on the site,
  every `.astro` file, the Figma plugin and the MCP server. All of them are at zero
  errors, and `npm test` keeps them there.
- **A contract for every component.** `get_component` now says what an agent may
  change: axes and defaults, the custom properties a component exposes, and the nested
  components it restyles, with the Figma layer each setting paints. A component with none
  says so. `validate_markup` warns about a
  `--vt-*` variable nothing reads, and `audit:contract` fails on a component that sets
  custom properties without declaring them.
- **Figma to code through MCP.** `get_figma_reader` gives a read-only script for the Figma
  MCP, and `figma_to_markup` turns its result into HTML with Veritheme classes: instances
  become components, a changed layer becomes a contract slot, and whatever cannot be
  translated is listed, not guessed. A change to a main component or a theme variable in the
  Figma file comes back as CSS for the project's stylesheet. The `figma-to-page` prompt does
  all of it from one link, and `audit:figma-markup` checks every variant of every component.
  `get_snippet` now serves every example on a docs page.
- **Keyboard for select, combobox and radio groups.** Arrow keys, Enter and Escape work, with
  the roles and states assistive technology reads.
- **ESLint.** `npm run lint` checks the whole repository at zero findings, and
  `npm test` runs it. Unused code the first run found is gone.
- **CI and one command for every check.** `npm test` builds the project and runs
  type checks, audits, unit and browser tests; `npm run verify` skips the build
  and the browser. The GitHub Actions workflow runs them when started by hand, and
  fails when generated files were not committed. It can compare screenshots on macOS too.
- **A browser test of the path visitors take:** naming a system in the studio,
  building it in `/start/`, saving it and downloading its `theme.css`.

### Changed

- **New social preview.** `og-image.png` (the card shown when a Veritheme link
  is shared) is now a light, tilted board of real components — color scales,
  corner radius, dark mode, charts, chips, forms — with the logo, the
  "Design systems, generated." headline and the feature tags on a frosted
  panel. The panel sits in the middle 630×630, so apps that crop previews to
  a square (Slack, WhatsApp, Telegram) still show all of it. It replaces the
  dark text-only card and its stale "66 Components". The image URL now
  carries a hash of the file (`og-image.png?v=…`), so social networks that
  cache previews by URL pick up a new image as soon as it changes.

## [1.2.0] — 2026-11-03

### Added

- **Button labels sit on the optical center, in any font.** A label in a plain
  `<span>` inside `vt-btn` or a `vt-btn-group` button is centered by cap
  height (`text-box: trim-both cap alphabetic`), not by the font box: with
  Onest, labels without descenders sat about 1px high. Raw text in a button
  renders as before, so existing markup keeps working; the site's buttons now
  wrap their labels.

- **Studio audit: every component checked against its spec, with a report.**
  `npm run audit:studio` (`scripts/studio-audit.mjs`) opens Studio in its own
  browser with a fresh "Audit" system and checks each component and block
  against `components/<name>.json` — its Figma variants and states, the
  anatomy's state map (`anatomy.is`), its boolean properties — on six points:
  preview, variants, states, properties, inspector, logic. The result is
  `test-results/studio-audit/report.html`: a component × check table with a
  snapshot of each canvas. The same checks run as a Playwright test
  (`npm run test:studio-audit`, its own config — not part of `test:visual`),
  and the checklist with the order of
  work is the `/studio-audit` skill; each new kind of bug found becomes a new
  check there. Beyond the spec it catches what broke the canvas itself: a
  component cut off and scrolling inside its cell, a canvas that scrolls
  sideways, and icons of the same part at different sizes across cells.
  What only shows on a pseudo-element (Scroll view's scrollbar) or in
  another variant than the one on the canvas is listed as a note to check
  by eye, not as a problem.

- **Studio keeps as many systems as you like, in your browser.** Each system
  has its own place in local storage, so creating or duplicating one no longer
  overwrites the last; Studio's home says where they are kept, and an empty
  name becomes "Design system N". Accounts, saving to the cloud and releases
  are built but switched off (`ACCOUNTS` in `src/lib/features.mjs`) until the
  cloud launches: there is no Sign in, and nothing leaves the browser.

- **A 4px radius step of its own: `--radius-2xs` and `vt-rounded-2xs`.** See
  the `--radius-xs` change below.

- **Remove a component straight from the Studio overview.** Each component card
  has the same ⋯ menu as a system card: Customize, and Remove. A component that
  another one uses shows Remove greyed out with the reason ("Used by …").
  Removing doesn't ask for the name, unlike deleting a system — the component
  comes back from the catalogue with its settings intact.

- **A component in Studio opens on a canvas: variants across, states down.**
  Like editing a component in Framer — columns are the values of one axis
  (Variant by default, switchable), rows are Default, Hover, Active, Focus and
  Disabled, all at once. The other axes (Size, Shape) are switches above the
  canvas. The canvas is a preview: the inspector on the right sets the whole
  component. A column's × takes the value out of the system; the "+" tile
  brings it back.

- **The component builder follows how a designer actually works.**
  - What you look at and what the system is are apart: Show (icons, label)
    moved to the bar above the canvas next to Size and Shape; Properties in
    the inspector are switches that decide whether the component has the part
    at all. Axes are named as in Figma (Variant, not Intent).
  - A button is never empty. Its label and icons are its content, and the last
    one showing can't be switched off — neither in Show nor from the system;
    take the label out and an icon shows by itself. Show is a set of toggle
    chips (several at once), not a segmented control like Size and Shape, and
    it steps aside for the Icon shape, which draws its one icon anyway.
  - A component's own logic shapes what can be switched off: a component that
    has an icon-only shape (Button's Shape: Icon) always keeps its label in
    the other shapes — turning the label off would just be the icon shape a
    second way, so it has no toggle in Show or Properties.
  - Each parameter shows the token that is in effect — `md · 12px`, `body-sm ·
    14px` — muted while inherited, instead of a raw value; the list holds only
    tokens, and the × next to a set value takes it back. The token is found by
    result, not by guessing: the instance's computed value is compared with
    every token of the family, and a rebound ladder shows the step it was
    moved to. A recipe's own shadow reads "Recipe shadow".
  - Colors groups the component's roles by what they paint — Fill, Text,
    Border, Focus — and hides a group the component doesn't use.
  - Every list in the inspector is the library's dropdown menu, not a native
    select; clicking its field again closes it, as it does the color picker in
    Colors.
  - The inspector can be widened by its left edge, from 20rem to 32rem; the
    width is remembered in this browser. Labels line up with section titles.
  - Which sizes, shapes and other axis values go into the system is chosen
    right above the canvas: next to each axis a "3/4" button opens a checklist
    ("Sizes in the system"), and the segments show only what is checked. Any
    value can be left out, the default too — a button set of LG only — as
    long as one stays; the canvas columns take a × on the default as well.
    The Variants section at the bottom of the inspector is gone, and Columns
    uses the library dropdown.
  - "Colours" is "Colors" throughout Studio.
  - Adding a component opens it.
  - A guest system changed in another tab stops saving here and says so,
    instead of the last tab silently overwriting the other one's work.
- **Figma gets the parameters.** Generate gives the component's values to
  every variant of its set: radius, height, padding and gap bind to the
  system's variables, shadow to its effect style and font size to the text
  style's size. What the recipe itself changes in a state (the button's hover
  shadow) stays the recipe's there, as in the CSS.

- **The Studio inspector reads like Framer's.** Sections — Layout, Style,
  Type, Properties, Variants — with a label on the left and a filled field on
  the right; a value set for the component carries a dot and a × to reset it,
  and variant values are chips. Properties are two
  columns of checkboxes, Show and In system, instead of a button labelled
  with its state. The blocks below follow the same system: Composition as
  rows of links, Colours as filled rows with a swatch and the role's name
  (the state strip is gone — the canvas row sets the state), HTML and CSS as
  compact code with a text Copy, and neutral chips for variant values.

- **Component parameters in Studio — through tokens, for the whole
  component.** The component page in Studio is now a builder: the canvas of
  variants and states in the middle, an inspector on the right where the live
  preview used to be. It sets the component's corner radius, height, padding,
  gap, shadow and font size — choosing from the system's own tokens — once
  for all its variants and states. Radius and Height shift the whole size
  ladder (SM stays smaller than MD). Colours are roles: Colors rebinds the
  roles the component reads, and a role brings its own hover, pressed and
  disabled shades, so a variant can't end up with a hover lighter than its
  base. The parameters are ours and fixed per component — the ones its root
  rule actually sets. In the exported CSS they are one rule of fixed weight
  (0,2,0): above the recipe's variants, below its own states.

- **Boolean properties can be previewed and removed.** Left icon, Label, Right
  icon on a button (and Show Icon, Show Helper Text… elsewhere) can be shown
  on the canvas, and kept in or taken out of the system. A removed property is
  not created in Figma and its layer goes with it — unless another component
  being generated turns it on (Auth's button keeps its leading icon).

- **Filter the Studio catalogue by complexity.** Next to search: All, Basic
  (one element — button, checkbox), Composite (built from basic ones — tabs,
  pagination, card) and Complex (a whole interaction — dialog, combobox,
  command). It combines with the category chips, and each card names its
  level. The level is the component's `$mcp.level`, the same one the MCP
  server gives agents.

- **Adding a composite component asks first.** When a component brings
  simpler ones that aren't in the system yet — Stats Card brings Card and Icon
  Badge — a dialog names them before anything is added. What a component
  includes is shown on its catalogue card as badges.

### Changed

- **Builder: Customize colors is quieter and lines up.** The expanded scale
  row follows the table grid (charts span the ramp, the picker spans Base and
  Name) and opens with the same animation it closes with. Swatches lose their
  ring except near-white ones; scale and role names read as row headings; the
  Lightness, Chroma and Hue drift summaries are worded ("97% → 28%", "peak
  0.22 at 700", "−11° to +5°") and the white-text line is labeled. The hint,
  the white-text line and the step labels follow the Label contrast method
  (APCA Lc or WCAG). Show state colors is a switch next to the Roles tab, the
  all-clear contrast banner is gone (problems still show), remove buttons are
  a trash icon, the pencil of the block being edited stays highlighted, and
  Custom colors shows up as soon as you edit, with your palette as dots. The
  sidebar keeps only section titles.

- **The palette is Tailwind CSS v3's.** `tokens/palette.json` now holds
  Tailwind's ramps converted to HSL (grey = neutral, brand = blue), so every
  step changes value in CSS, the exported tokens and the Figma variables
  alike. Filled colours moved a step darker to keep white text readable:
  brand and info fill 500 → 600, success and warning fill 600 → 700; in dark
  mode, disabled text is grey.500 instead of grey.600. Primary hover and press
  follow the fill (brand 700 / 800).

- **Accordion titles use the Label/LG style** instead of Body/SM, so a title
  reads as a heading for its panel.

- **The home page opens on a live builder.** The hero starts where `/start/`
  starts — pick a project, the corners and a colour and the example screen
  repaints. The preview screens are shared (`/screens/…`, `noindex`) rather
  than part of the beginner flow.

- **Figma plugin: the panel wears the site theme.** The plugin's chrome is now
  `data-theme="site"` — the same `tokens/site.json` theme as the stage site
  (violet brand, 0.5px hairlines, pill buttons), compiled by
  `scripts/build-plugin.mjs` into `figma-plugin/src/generated/site-theme.css`.
  The previews stay `data-theme="default"` specimens. The preset chips are
  hidden (Default is the only preset); the demo card in the preview is a
  "New project" form instead of a sign-in screen.

- **Lines: shell and content are two variables.** A system now carries
  `lineWidth` (content lines — cards, dividers, table rows →
  `--border-width-thin`) beside `borderWidth` (controls and the app shell →
  `--border-width-default`), in CSS, DTCG and the canonical theme; without it
  the old min(width, 1px) rule stands. The shell recipes — `page-layout`,
  `sidebar-nav`, `header` — draw their dividers with the default line, like
  `sidebar` already did (identical at the default 1px). A Hairline (0.5px)
  system draws its lines at half strength below 2dppx, where browsers round
  0.5px up to a full pixel.
- **Bordered and ghost buttons: lighter hover and press.** Hover is
  `neutral-fill` (grey.50), press `neutral-fill-hover` (grey.100); the grey
  secondary button keeps 100/200.
- **Dark mode: black page, grey.950 cards** in the default theme.
- **Density moves control heights** by 4px a step (36 / 40 / 44px at
  0.75 / 1 / 1.25) and scales button padding; density 1 output is unchanged.
- **Guided builder (`/start`, behind the beginner flag):** one scroll instead
  of steps, options as rows with true-size samples, Tailwind brand palette,
  Untitled UI shadow scale (None / Small / Medium / Large / Extra large = md / lg / xl / 2xl), line thickness (None /
  Hairline / Regular / Bold) and colour (Light / Strong), 65 Google fonts, a
  Simple / Pro switch; Studio's create dialog offers Simple first.

- **Button group sizes the whole group.** `vt-btn-group-sm`, `-lg` and `-xl`
  used to change only the corners of the `vt-btn` buttons inside (and the
  height of bare `<button>`s), so a group of `vt-btn`s looked the same at
  every size — unlike Figma, where the group's Size is passed to its
  buttons. Now every button in a sized group takes that size: height,
  padding, type, shadow depth and corners, the same set as `vt-btn-sm/-lg/-xl`
  (an icon-only `vt-btn-icon` keeps its zero side padding).
  A group without a size class (MD) leaves its buttons' own size alone, so
  existing markup keeps working; the docs' Sizes example now sets the size on
  the group.

- **Studio's inspector edits the whole component only.** Cells, columns and
  rows of the canvas are no longer selected and edited one by one: every
  parameter is set once for the component, colours go through roles in
  Colors. Fewer ways to break a system, and the CSS, the preview and Figma
  agree by construction.
  - Layout is a grid of compact number fields, as in Figma: a glyph, the value
    in px, and a menu of tokens behind the chevron. A typed number
    snaps to the nearest step of the system's ladder, ↑/↓ step along it, and an
    empty field or a click on the (brand-coloured) glyph of a set value resets
    it. Radius moved here from Style, so every number sits in one place.
  - Systems saved by the builder before this keep their component-wide
    values; edits made on a variant, a state or a cell, and colour
    parameters, are dropped when the system is opened (Studio schema 3) —
    the generator no longer reads them either.
  - The inspector's explanatory notes are gone: the "reaches the code only"
    note and the hints under Radius steps and Density.
  - A component's parts (the button's left and right icons) are always part of
    it now — in the code and in Figma, where they stay a boolean property. The
    Properties switches only show or hide them on the canvas, like toggling
    the property on a Figma instance, and replace the "Show" chips above the
    canvas. Parts a system had removed under the old rule come back: the
    export no longer carries `props`, and Studio drops them when the system
    is opened (in memory — opening a system is not a new revision).
  - The colour axis is the one whose values have their own colours:
    intent/variant, otherwise color, tone or style — Badge and Dot colour by
    `color`, Link by `style`, and their columns follow it.
  - The axes moved from above the canvas into the inspector, a Variants
    section above Layout that lists every axis — the one in columns too, as
    "In columns", whose menu only switches values in or out of the system
    (on the canvas they are all shown already). Each is a dropdown showing
    the value on the canvas and how many are in the system (4/4). In its menu
    a click on a value shows it on the canvas, and the switch beside it takes
    the value in or out of the system — the old "4/4" checklist, in one place.
    The last value can't be switched off, a value that's off can't be shown,
    and the menu stays open while you switch several.
  - The bar above the canvas is gone. Columns are always the main axis
    (Variant); the other axes are picked in the Variants panel.
  - Radius and Height live in one place, Layout, for every component. The
    field moves the whole size ladder (what "Radius steps" and "Density" in a
    separate Scale section did). Button group, whose radius
    lives in its parts, used to have only "Radius steps" — it now has the same
    Radius field as Button. The Scale section is gone.
  - A reset in a component's root rule is not a parameter: `padding: 0` on
    the breadcrumb's list (items in one line), switch, stepper, timeline and
    list no longer offers Padding X / Y. A value already set stays as a field,
    so it can still be reset.
  - The stage's light/dark preview is a segmented control of two icons (sun,
    moon) instead of a "Dark"/"Light" text button — in Studio and in the
    `/create` wizard, which share the stage.

- **The site and Studio draw their own interface with Iconly icons.** Top
  bar, sidebar, Studio, account, docs frames and the site's own pages use
  Iconly Pro (Outline, Regular). The components, their examples, `/examples`
  and the product demos on the home page keep Lucide — the icons a system's
  users actually get. An interface icon is never smaller than 16×16: CSS
  holds the floor, and `npm run check:min-icon-size` (part of `check:all`)
  rejects smaller size classes in the markup. In the Studio sidebar the
  active item's icon turns filled (the same Iconly glyph in Bold).

- **Ten components now declare their complexity level.** Accordion, Alert,
  Banner, Button Group, Card, Empty State, Toast and Toolbar are level 2;
  Chip and Slider level 1. Before, they had none, and MCP reported all ten as
  level 1.

- **Studio thumbnails show each component as it is meant to be seen.** They are
  centred in the card; small controls (checkbox, radio, switch, rating, badges)
  are drawn larger; popover, dropdown, combobox and select are shown open with
  the panel in frame, and the tooltip is visible. Stats card shows one card and
  the table three rows, so neither is cut off; tall previews align to the top.
  Media shows a single frame; Dialog and Command sit on a backdrop that covers
  the whole thumbnail. Among blocks, Pricing Card shows the highlighted plan
  and Testimonial a single quote; Header and Footer run full width along the
  top and bottom edge, the way they sit on a page.

- **`--radius-xs` is 6px; 4px is now `--radius-2xs`.** The scale gains a 6px
  step, inserted by renaming: `--radius-xs` / `vt-rounded-xs` used to be 4px
  and are now 6px, and the old 4px corner is `--radius-2xs` /
  `vt-rounded-2xs`. The library's own 4px corners moved to 2xs, so components
  look the same; markup of your own that uses `vt-rounded-xs` or
  `var(--radius-xs)` gets 2px rounder — switch it to 2xs to keep 4px. The
  themed scale from `sm` up is unchanged. A wizard system or tokens file saved
  before the step is migrated on load (its 4px `xs` is read as `2xs`).
- **Textarea has one size.** Its height is the user's (resizable, `rows`), so
  the size axis is gone: `vt-textarea-sm` / `-lg` / `-xl` still exist but draw
  the default field (see Deprecated). In Figma the Textarea set has no Size
  property.
- **DatePicker is part of Calendar.** Its classes (`vt-date-picker-field`,
  `-trigger`, `-placeholder`, `-floating`, `-presets`) and the
  `data-calendar` behaviour are unchanged and now live in the Calendar recipe;
  the page is the Date Picker section of the Calendar page
  (`/components/date-picker/` redirects there). See Removed for the separate
  entries that went.

- **Label and Section Label are text styles, not components.** Each was a Figma
  component holding one line of text. The typography grows an eleventh style
  instead — **Overline** (12/16, regular, set in capitals by the style) with the
  class `vt-overline` — and the two classes stay as its names: `vt-label` is
  Body/SM in the primary colour (`vt-label vt-label-sm` is Caption) and
  `vt-section-label` is Overline in the muted colour. Markup does not change.
  In Figma the Label and SectionLabel sets are gone: an Input's or Textarea's
  label, a List's heading and a Sidebar Nav's group headings are text layers
  bound to the style, and their text is a property of the component (Label,
  Heading, Group 1/2 Label). The field wrapper (`vt-field`, its description,
  error and success lines) is its own CSS recipe, Field.
- **`vt-overline` is the Overline style.** It used to be a text-decoration
  utility (a line over the text) while the docs and the MCP guidelines already
  called it the uppercase eyebrow; it now is one. Nothing in the library drew
  a line over text.

### Deprecated

- **`vt-btn-link` is deprecated — use the Link component (`vt-link`).** A
  button that looks like a link is a link: `<a class="vt-link">`. The
  `.vt-btn-link` rule stays in the package so existing markup keeps working,
  but it is gone from the Button docs, the Figma plugin (the Button set no
  longer has a Link variant) and the MCP server, whose `validate_markup` now
  warns on it. It will be removed in the next major version.
- **`[data-password-toggle]` is deprecated — a password field is a plain
  `<input type="password" class="vt-input">`.** The show/hide button is gone
  from the Input and Auth docs, the Figma plugin (Input no longer has a
  Type=Password variant; Auth's password fields are plain inputs) and the MCP
  server, whose `validate_markup` now warns on it. The bundle still wires the
  attribute, so 1.x markup keeps working; it will be removed in the next major
  version.
- **`vt-textarea-sm`, `vt-textarea-lg` and `vt-textarea-xl` are deprecated.**
  They draw the one Textarea size; drop them from markup. They will be removed
  in the next major version.

### Removed

- **Figma plugin: no account, no sync.** Sign-in (device flow), the
  project/release picker, the "new version" banner and three-way review, the
  audit's "Propose" upload, the document's link to a release, the stored
  account token and the Supabase domain in `manifest.json` are gone, with
  their tests (`plugin-cloud.spec.js`, `three-way`, `sha256`, `var-map`).

- **The standalone wizard is gone; the editor lives only in Studio.**
  `/wizard` — the service copy of the old `/create` wizard — now forwards
  to `/studio` the same way `/create` does, carrying a `#s=` share link
  along (`StudioRedirect`). With no second host, the editor dropped what only
  the wizard used: its top stepper, its own Save / Release / sign-in and
  conflict dialogs, the leave-page warning, the `#step-N` address and the
  "From your Figma file" proposals block (hidden in Studio all along). Studio
  saves the system itself, so a typography-only edit now survives a reload
  instead of asking to leave. The editor's contract tests run against a Studio
  guest system.

- **Kbd and Pill.** `vt-kbd` and `vt-pill` (`vt-pill-sm`, `vt-pill-lg`) are
  gone from the CSS, the shadcn registry (`/r/kbd.json`, `/r/pill.json`) and
  the MCP server. Use Badge for a static tag, Chip for a removable one, and
  `vt-code-inline` for a key or a shortcut.
- **The docs site's own chrome is no longer in `veritheme.min.css`** (−32 KB).
  The public bundle used to carry the site's sidebar, table of contents,
  top bar, example blocks, API tables, mode buttons, anatomy blocks,
  component cards, colour swatches and the generated rules of the site's
  pages: `vt-sidebar-*`, `vt-toc-*`, `vt-topbar-*`, `vt-example-*`,
  `vt-api-table`, `vt-mode-btn`, `vt-anatomy*`, `vt-component-card`,
  `vt-color-swatch`, `vt-theme-toggle`, `vt-search-input`, `vt-list-check`,
  `vt-inline-*` and the like. None of them was a library component; they now
  load only on veritheme.com. Their shadcn registry items (`/r/anatomy.json`,
  `/r/api-table.json`, `/r/color-swatch.json`, `/r/component-card.json`,
  `/r/example-block.json`, `/r/mode-btn.json`, `/r/sidebar.json`,
  `/r/toc.json`) and MCP specs went with them.
- **Stale MCP specs and registry items.** `label` and `section-label` (text
  styles now, see Changed), `dropdown-wrap` and `feature-item` are no longer
  offered by `get_component` or the shadcn registry; `vt-dropdown-wrap` and
  `vt-feature-item` stay in the CSS as parts of Dropdown Menu and Feature
  Section. The MCP build now drops
  any spec whose component is not in the library, instead of keeping it
  forever.
- **The separate DatePicker component:** its registry entry, Figma set, MCP
  spec and `/r/date-picker.json`. Everything it did is in Calendar (see
  Changed).
- **Figma variants for removed or deprecated looks:** Button's Link variant,
  Input's Type=Password, Textarea's Size, and the Label and SectionLabel sets.

### Fixed

- **A color picked for a pure-gray scale tints the whole ramp.** On a family
  whose saturation curve is 0 (Grays "pure"), only the anchor step took the
  color and every other step stayed gray; the ramp now carries the picked
  saturation throughout. A gray stays gray.

- **Dragging a scale's color no longer drags roles along.** Roles followed
  the anchor step and were collected on the way: pulling Neutral to black
  moved the neutral fill, surfaces and disabled text onto step 950 and the
  preview turned black. Neutral roles no longer follow the anchor; on other
  scales only the roles that sat on the anchor move with it.

- **Accordion opens in one smooth slide.** The panel used to pop open by its
  16px padding first and only then slide; padding and height now grow
  together.

- **A composite's rebind stops at its nested components, in code as in
  Figma.** A rebind is a custom property on the component, and custom
  properties inherit: a calendar's `radius-md → radius-full` also turned its
  prev/next buttons into pills, while in Figma the nested Button instances
  kept their own bindings. Now nested components get the system value back
  (`:where(.vt-calendar .vt-btn)`, zero specificity, so a Button rebind of its
  own still applies). A nested component the composite styles itself —
  Button group's buttons, Tabs' triggers — is its part: the rebind still
  reaches it, as the plugin overrides those instances
  (`packages/generator/data/component-nested.mjs`).

- **Studio colours reach Figma.** A background, text or stroke colour set in
  Studio is a CSS role (`success-fill`); the plugin looked it up as is, missed
  its own name (`success/fill`) and left the recipe's colour in place — the
  CSS changed, the Figma component did not. Shadow (the theme's effect style)
  and font size (the text style's size variable) now reach Figma as well.

- **Studio: parameter edits show on components without a variant canvas.**
  Breadcrumb, Dialog and the other components shown as a plain example took
  the change (the field updated) but the preview stayed the same — only the
  canvas applied the parameter CSS. The example now gets it too.

- **Studio: Pagination, List, Timeline, Carousel and Tree view take their
  parameters.** Their live previews came from a stale docs build whose demos
  were utilities without the component's root class (`.vt-pagination`…), so
  a gap or padding set in Studio had nothing to land on. The previews are
  rebuilt from the current docs pages, which use the root class.

- **Studio shows every Figma variant, drawn the way Figma draws it.** The
  canvas used to take one docs example and swap the code's axis classes on
  it, so anything Figma varies another way never reached Studio: Tabs'
  Underline style, Table's Compact density, Chip's SM size, Breadcrumb's "/"
  separator, Pagination's four styles and 30-odd more. Each cell is now the
  markup of its Figma variant, built by the same anatomy engine that builds
  the component set (`anatomyMarkup` in `scripts/lib/anatomy-engine.mjs`,
  `scripts/lib/studio-variants.mjs`) — axis classes, parts per variant,
  repeats, fixed states, nested components with their properties, Lucide
  icons by name. A Figma property the code has no axis for becomes a Studio
  axis of its own; it can be shown and put in columns, and switching its
  values off is left disabled until the plugin can skip them. A parameter
  edit on a value that has no class (Breadcrumb's Slash) applies to the whole
  component and says so. Components without an anatomy keep the docs example.

- **Studio canvas rows are the Figma states.** Rows used to come only from
  pseudo-classes in the component's CSS, so a state the code sets with a class
  never showed: Checkbox had no Checked or Disabled, Chip no Active, Switch no
  On, Collapsible no Open. Now the rows are the component set's State values,
  in Figma's order and with Figma's names (Unchecked, Checked, Focus,
  Disabled), each shown the way the anatomy's state map says —
  `"State=Checked": ".checked"` puts the class on the instance,
  `"State=Hover": ":hover"` uses the state's CSS as before. A colour set on
  such a row is its own level (`is`), exported as `.vt-checkbox.checked…`
  with the strength of an explicit state; the Figma plugin applies it to the
  variant in that state. Components with states but no variants (Check label,
  Collapsible, Select) get a canvas too.

- **Studio canvas: parts that are other components are drawn.** A property
  whose part is a nested component or a group — the ghost × button that
  closes Alert, Banner and Card, Alert's actions, Carousel's dots — did
  nothing or showed its name as text. The part is now built from the anatomy:
  the nested component with its Figma property classes (Ghost, SM, icon
  only), its label or icon from `set`, repeats and fixed states.

- **Studio: the inspector reads components without a canvas.** Dialog,
  Command, Check label and the like showed "system" in their fields — the
  inspector looked for an instance only in canvas cells. It now reads the
  example on the stage. Properties are offered only where there is a canvas
  for them to change.

- **Studio: an open menu in a preview stays open.** The library's bundle
  closes every open dropdown and popover on any click on the page, so the
  Combobox and Dropdown menu examples collapsed at the first click anywhere
  in Studio. The bundle itself now leaves alone what is shown open on
  purpose — a docs example's `open` class, a preview inside `[inert]` (the
  Studio canvas), or `data-keep-open` — on an outside click and on Escape.
  Menus a person opens close as before. This also keeps the examples in the
  `/wizard` stage open.

- **Studio canvas: what the Figma variants leave out is still drawn.**
  - A property set on a nested component (Close on Alert, Banner, Card and
    Toast; Avatar, Rating and Logo on Testimonial; More on Avatar group) now
    marks it in the variant markup, so its switch hides and shows it.
  - A part the variant markup cannot hold — the icons of a text field, which
    sit next to `<input>`, not inside it — is drawn as before.
  - An axis value Figma has no variant for (Card's SM, Dot's Current and
    Pulse, Skeleton's Default, Scroll view's Autohide, Stats card's Down
    trend) gets its class on the cell; it used to repeat the base variant.
  - A status icon with no name in the anatomy follows the variant: Success
    shows a check, Warning a triangle, Danger a cross (Alert, Dialog, Toast),
    not the docs example's "i" or a "+". A checked checkbox shows its check.
  - An open menu from a variant (Combobox, Dropdown menu) stays open after a
    click in the inspector.

- **Studio: the canvas is just the components, on dotted paper.** The stage
  header (name and class — the code is in the inspector) and the section's
  intro text are gone; the light/dark and color-vision controls sit
  in the page header, left of Remove. The canvas has no card of its own: it
  spans the whole width between the sidebars, the components sit centred at
  its top, and in light mode the work area is Studio's warm paper with faint
  dots; in dark mode it is the system's dark surface with dots to match.
  Cells in a row line up at the top, not around the row's middle (Combobox's
  variants of different heights). A grid wider than the canvas (Dialog's four
  intents) is scaled to fit, down to 50%, instead of scrolling sideways. A
  docs example on a backdrop (Command) gets the same padding at the sides
  as at the top, instead of a narrow strip.

- **Studio: Variants is a panel on the canvas.** It used to be a row of
  dropdowns in the inspector, so the other sizes and shapes were hidden
  behind a click. Now a small panel in the canvas's top-left corner lists
  every value of every axis: click a value to show it on the canvas, tick
  the checkbox on its left to keep it in the system or untick it to drop
  it. The axis in columns (or rows) shows only the checkboxes — all its
  values are on the canvas already. The panel folds to its title, and the
  canvas moves right while it is open so it covers nothing.

- **Studio: one layout for every canvas — components in columns, blocks in
  rows.** Combobox, Dialog and Dropdown menu spread their variants across,
  like Breadcrumb and every other component. A block is too wide for
  columns, so its main axis goes down in rows — Header's Marketing and App
  (the axis that decides its parts: Search, Notifications and Avatar are
  App's, so every property is on the canvas), Footer's layouts, Auth's
  screens. The axis reads "In rows" in the inspector.

- **Studio: small inspector and canvas fixes.**
  - Combobox's Groups items show their own 16px icons (Calendar, Search,
    Settings — a Lucide icon named like the item) instead of 24px checks
    borrowed from the docs example; an icon taken from the example keeps the
    part's own class and size.
  - Combobox's menu sits under its field inside the cell; the field shows its
    placeholder (a `::placeholder` layer becomes the `placeholder`
    attribute in the variant markup — Input and Textarea too).
  - Selecting Slash in Breadcrumb and changing Gap changes every separator:
    Slash has no class of its own in code. Layout now says so ("All
    separators") instead of "Component".
  - Gap's icon follows the layout: vertical for a column (CTA, Card),
    horizontal for a row. Height's icon was a width icon; it is vertical now.
  - Scroll view is shorter than its content on the canvas, so the scrollbar
    shows: Default has it, Hidden doesn't, Autohide shows it on Hover.

- **Studio canvas rows: every Figma state, shown the way the code shows it.**
  A state with no entry in the anatomy's state map was dropped: Input and
  Textarea had no Error or Success, Check label no Checked, Resizable no
  Hover. A row now takes the class the variant adds to the component
  (`.vt-input-error`), a pseudo-class the CSS has by name (Focus →
  `:focus-visible`, including a part's own — `.vt-resize-handle:hover`), or
  the variant's markup as is. The code axis that is the same thing as the
  Figma state (Input's and OTP input's `state`) is no longer a second
  control in the inspector.

- **Studio: Dialog, Combobox, Dropdown menu and the blocks have a canvas.**
  They showed only the docs example, so their Figma variants (Dialog's
  intents, Header's layouts and types, Footer's layouts, Auth's screens) were
  out of reach. They now show one cell, and the variant is picked in the
  inspector.

- **Studio canvas: cells take their size from the Figma frame.** Progress
  is 240 px, Skeleton's Line 240 and Card 320, Scroll view 320 — the
  anatomy's `figma.width/height`, as on the Figma canvas — instead of a
  12rem guess after layout. Icons in the variant markup travel once per page
  (a map of Lucide outlines) rather than inline in every variant.

- **Studio: Calendar offers Gap and Padding.** Its root
  rule is a list (`.vt-calendar, .vt-date-picker`), and Studio read only
  single-selector rules.

- **Studio: Radius on Calendar works; Height is gone from Tabs.** Calendar's
  first CSS rule is a list (`.vt-calendar, .vt-date-picker`), so its rebinds
  went to the next single selector, `.vt-calendar-cell`. Tabs offered Height
  for a token only its SM modifier reads, while Tabs has no size axis.

- **A component's rebinds reach its whole anatomy root.** When the root of
  the anatomy is another element that reads tokens itself — Table's
  `.vt-table-wrap` holds its corners, List's `.vt-list-section`, Spinner's
  `.vt-spinner-status` — rebinds were written on the inner class and never
  reached it: Radius did nothing on a table. The rebind scope is now both
  (`.vt-table-wrap, .vt-table`), in Studio and in the export alike
  (`scripts/lib/rebind-scope.mjs`).

- **Studio canvas: every component shows up in its cell.**
  - Popover (and anything else placed from a trigger — tooltip, menu, toast)
    is positioned absolutely off its trigger; on the canvas there is no
    trigger, so it slid out of its cell and left an empty space. The
    instance now sits in the cell's flow, like a component on a Figma canvas.
  - Tooltip showed only its target button — the bubble is transparent until
    the wrapper is hovered. A component the anatomy marks as always shown in
    one state (`is: { "*": ":hover" }` — Tooltip; `.vt-open` — Popover,
    Dropdown menu) is now drawn in that state, and a hover-shown one without
    its target: the bubble alone for each placement, as on the Figma canvas.
  - Progress, Separator and Skeleton stretch to their container and came out
    0 px wide in a cell that fits its content; such a cell now gets a width
    (and Skeleton a line's height).
  - A part turned on by a property is taken from the example when it has one
    (the chip's real × button from its "Removable" chip) or built from the
    anatomy with its icon — the chip used to show the word "Remove" instead.

- **Studio: canvas rows are the component's own states only.** A state was
  a row whenever its pseudo-class appeared anywhere in the component's CSS,
  so Button group showed Hover, Active and Focus rows that all looked the same
  — the hover belongs to the buttons inside it, not to the group. Now a state
  counts only when it sits on the root or one of its modifiers
  (`.vt-btn:hover`, `.vt-btn-primary:hover`). This drops the child-only rows
  of 14 components (Button group, Accordion, Breadcrumb, Card, Combobox,
  File upload, Header, Resizable, Slider, Table, Toolbar, Tooltip…); Number
  input keeps Focus and Disabled, which are its own.

- **Studio: the preview no longer drives Studio.** A link inside a component
  preview (the breadcrumb's `href="#"`) sent Studio's hash router to Colors,
  and a form could reload the page. Clicks on links and form submits inside
  the stage now do nothing; selecting a canvas cell works as before.

- **Studio thumbnails no longer fold up on a click.** Any click on the page
  closed every open popover and dropdown, including the ones drawn in the
  thumbnails, leaving a bare button in the card.

- **Corner radius keeps a different radius for each size.** Choosing a radius
  used to put every size of a button on that one value. Now it sets the default
  size and moves the others by the same number of steps, so SM stays smaller
  than MD; each size can also be tuned on its own from the canvas.

- **Component rebinds no longer chain in CSS.** `--radius-sm: var(--radius-md)`
  resolved against the component's own, also rebound `--radius-md`, so a
  shifted ladder sent SM two steps up. A target rebound in the same component
  is now read from a copy of the system value (`--rebind-base-*` on `:root`),
  in the exported CSS, the MCP exports and every Studio preview — the same
  result Figma, which binds variables directly, already gave.

- **Density shows real heights.** The Size control (now Density) labelled
  System from a constant and could offer "Comfortable · 36 px" below
  "System · 40 px"; both now come from the system's own values.

- **Removed properties and component parameters reach the Figma plugin.**
  The plugin's token import kept only the extension fields it knew
  (`components`, `variants`), so `props` and `params` from Studio were dropped
  on the way in.

- **Input's properties show on the canvas.** Its example is a bare `<input>`:
  the label and helper text had no field to go into, and the icons, which
  can't sit inside an input, did nothing. The canvas now builds the field and
  the input group the way the docs mark them up, and the right icon is placed
  on the right.

- **Radio Group's thumbnail is centred.**

- **The Disabled state shows in the component preview.** A rule written as
  `.vt-btn:disabled, .vt-btn.vt-disabled` was read as a combination of states
  and dropped, so Disabled looked like Default.

- **The component column in Studio reads as one list.** Composition; Shape,
  size and variants; Colours it reads; HTML; Scoped overrides — all five
  headings now share one style (HTML and Scoped overrides were smaller,
  sentence-case sub-headings), and every block has its own divider, so two
  folded blocks in a row are no longer run together.

- **Check Label's example shows the check mark.** Its snippet had a
  placeholder `<svg>…</svg>` where the icon goes; the preview dropped it and
  drew an empty "checked" box, and agents got the placeholder too. It is now a
  real check icon.

- **DTCG import reads every 2025.10 file the official test suite covers.**
  Checked against the Design Tokens Community Group's own fixtures: 72 of 93
  valid files lost data, now all 93 import — in the site, the Figma plugin and
  the MCP server alike. References inside shadows and typography resolve
  instead of landing in CSS as `{colors.black}`; `$extends`, `$root` tokens and
  JSON Pointer `$ref` are understood; colours in any of the fourteen DTCG
  colour spaces convert (Tailwind v4's oklch themes used to import empty), with
  the author's `hex` preferred when a colour falls outside sRGB.

- **Deleting an account no longer fails for anyone who published a release.**
  Clearing `releases.created_by` is an ordinary UPDATE, which the immutability
  guard rejected, so Supabase answered `Database error deleting user`. The
  guard now allows exactly one change — an author becoming nobody — and the
  RLS test covers both outcomes: an owner's own project goes with them, while a
  release they made in someone else's project stays, minus its author.

- **Creating a cloud project no longer fails its own RLS check.** The row-level
  check for `RETURNING` runs before the `AFTER INSERT` trigger that grants the
  creator membership, so `insert().select()` on `projects` answered `42501`
  while the row was in fact created. Projects are now created through the
  `create_project` RPC, which writes the project and the membership in one
  transaction and takes `created_by` from `auth.uid()`; the direct insert path
  is gone. `npm run test:rls` is green.

### Security

- **The site bundle no longer carries the whole `package.json`.** The
  editor imported it to read the version, and with it went the package's
  repository and issue links into the public JavaScript; it now imports
  `version` alone.

- **Auth settings for the cloud project come from `supabase/config.toml`.**
  `site_url` points at the staging site rather than `localhost`, so a sign-in
  that falls back to it cannot be redirected to a developer machine; the signup
  email throttle stays at one minute instead of the CLI's one second, and TOTP
  enrolment is left enabled.

## [1.1.1] — 2026-09-13

### Added

- **The JS bundle wires more components from markup alone.** Password
  visibility toggles, the pricing period switch and one-time-code groups
  (`data-password-toggle`, `data-pricing`, `data-otp`), the command palette
  (Enter runs the highlighted item and fires `vt:commandselect`) and
  collapsible sidebar sections are now part of `veritheme.min.js`.
- **Calendar navigation and selection.** `[data-calendar]` cards switch months,
  select a date or a range, and move by keyboard (arrows, Home, End);
  selection is tracked by date and fires `vt:datechange`.
- **MCP reads the project's own system.** `get_project_system` loads
  `veritheme.system.json` (or `VERITHEME_PROJECT_DIR`) with its revision and
  whether the tokens were edited since export; `get_tokens` and `get_theme`
  answer from it when present.
- **/create exports one ZIP** with the system source, `tokens.json`,
  `theme.css`, the library CSS and JS, a working demo page, README, AI
  instructions and a SHA-256 revision manifest, and shows a before/after
  review before an import replaces the current system.

### Fixed

- **The generator's dark preview stops borrowing the page's light colours.**
  Intent text and the intent fill states are derived, not authored, and the
  preview never wrote them — so a dark preview on a light page painted the
  alert's text with the light `--error-text`, dark red on the dark red tint at
  2.35:1, and its disabled state with a pale tint that was the brightest thing
  on the panel. The preview now derives them for the mode it is showing, with
  the same function that writes `theme.css` and the DTCG export.
- **The contrast audit scores intent text on its own tint.** The alert and
  banner pair was the one combination nothing checked, in the generator's audit
  step, `npm run audit:contrast` and the MCP `audit_contrast` alike — all three
  reported every pair passing while that text was unreadable. All four intents
  are now scored against their surface, in the mode they are shown in.
- **Dropdown menus follow the menu keyboard contract.** Arrow keys, Home,
  End, Escape and Tab work; the trigger reports `aria-expanded`; checkbox
  items keep their indicator and `aria-checked` in agreement.
- **Tabs inside another tab group no longer open two panels at once.**
- **Themes survive the round trip between Figma, /create and code.** Custom
  scales and sizes, typography, shadows, dark colours, states, aliases and
  component rebinds are kept on export and re-import, and size units agree
  across CSS, SCSS, Tailwind and Style Dictionary, including a 20px root.
- **The Figma plugin keeps each file's theme to itself.** The applied theme
  and the draft are stored per document; a failed Apply keeps the draft,
  Reset clears both, partial generation failures are reported as errors, and
  border width applies and reads back correctly.
- **MCP returns valid CSS or a clear error.** Theme JSON, DTCG and system
  snapshots are normalised; objects, unitless sizes, legacy and unknown colour
  roles no longer produce `[object Object]` or silently wrong variables. The
  validator flags Tabs missing `data-tab`/`data-panel`.
- **Snippets match the documentation.** MCP, the shadcn registry,
  `llms-full.txt` and the plugin share the examples rendered on the site;
  Button Group, Empty State, Number Input, OTP Input and Tree View have their
  usage examples back, and interactive components say they need the JS bundle.

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

## 1.3.0 (old numbering) — 2026-07-02

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

## 1.2.1 (old numbering) — 2026-06-24

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

[Unreleased]: https://github.com/tarasenko-by/veritheme/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/tarasenko-by/veritheme/releases/tag/v1.3.0
[1.2.4]: https://github.com/tarasenko-by/veritheme/releases/tag/v1.2.4
[1.2.3]: https://github.com/tarasenko-by/veritheme/releases/tag/v1.2.3
[1.2.2]: https://github.com/tarasenko-by/veritheme/releases/tag/v1.2.2
[1.2.1]: https://github.com/tarasenko-by/veritheme/releases/tag/v1.2.1
[1.2.0]: https://github.com/tarasenko-by/veritheme/releases/tag/v1.2.0
[1.1.1]: https://github.com/tarasenko-by/veritheme/releases/tag/v1.1.1
[1.1.0]: https://github.com/tarasenko-by/veritheme/releases/tag/v1.1.0
[1.0.7]: https://github.com/tarasenko-by/veritheme/releases/tag/v1.0.7
[1.0.6]: https://github.com/tarasenko-by/veritheme/releases/tag/v1.0.6
[1.0.5]: https://github.com/tarasenko-by/veritheme/releases/tag/v1.0.5
[1.0.4]: https://github.com/tarasenko-by/veritheme/releases/tag/v1.0.4
[1.0.3]: https://github.com/tarasenko-by/veritheme/releases/tag/v1.0.3
[1.0.2]: https://github.com/tarasenko-by/veritheme/releases/tag/v1.0.2
[1.0.1]: https://github.com/tarasenko-by/veritheme/releases/tag/v1.0.1
[1.0.0]: https://github.com/tarasenko-by/veritheme/releases/tag/v1.0.0
