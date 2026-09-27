# Foliant — Urban Plant Studio

A responsive front-end website built for the Inovegen Internship Task 2 brief
(Interactive Website with JavaScript). Foliant is a fictional neighbourhood
plant studio: a filterable plant collection, a care-notes accordion, a
testimonial carousel, and a reservation form with client-side validation.

## Live preview

Open `index.html` directly in a browser — no build step, no dependencies to
install. If you deploy it (e.g. GitHub Pages), just publish the project
folder as-is; `index.html` is the entry point.

To run it with a local server instead of opening the file directly (useful
for testing on a phone on the same network):

```bash
cd foliant
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Project structure

```
foliant/
├── index.html        Markup: header/nav, hero, collection, care notes,
│                      workshops, visit/reserve form, footer, modal
├── css/
│   └── styles.css     Design tokens (CSS variables), layout, responsive
│                      breakpoints, light/dark theme rules
├── js/
│   └── script.js      All interactivity (see below)
└── README.md
```

There are no external JS dependencies. The only external assets are two
Google Fonts (Fraunces for headings, Work Sans for body text), loaded via
`<link>` in `index.html`.

## JavaScript interactions

The brief asked for at least 3 meaningful interactions plus a validated
form. This build has six:

1. **Plant collection filter** — the four filter chips (`All`, `Low light`,
   `Pet-safe`, `Statement size`) re-render the plant grid from a JS data
   array (`PLANTS` in `script.js`) instead of hiding/showing static markup.
2. **Plant quick-view modal** — clicking (or pressing Enter/Space on) a
   plant card opens a modal with the full description. Closes on the ✕
   button, a backdrop click, or `Escape`, and returns focus to the card
   that opened it.
3. **Care-notes accordion** — single-open accordion for the four most
   common care questions, built with `aria-expanded` state rather than the
   native `<details>` element, so the open/close animation is controllable.
4. **Testimonial carousel** — prev/next buttons and clickable dots cycle
   through three workshop testimonials; the region is `aria-live="polite"`
   so screen readers announce the change.
5. **Mobile nav menu** — hamburger button toggles the nav below 720px,
   with `aria-expanded` kept in sync and the menu auto-closing after a link
   is tapped.
6. **Theme toggle (light/dark)** — persisted to `localStorage`, and falls
   back to the visitor's OS-level `prefers-color-scheme` on first visit if
   nothing is stored yet.

## Form validation

The reservation form (`#reserve-form`) validates on blur and again on
submit, with no native browser validation bubbles (`novalidate` is set so
the custom messages are consistent):

- **Name** — required, minimum 2 characters.
- **Email** — required, checked against a standard email pattern.
- **Workshop** — required select; must choose a session.
- **Note** — optional, capped at 240 characters via `maxlength`.

Invalid fields get a red outline and an inline error message tied to the
input with `aria-invalid`; the first invalid field receives focus on a
failed submit. A valid submit shows a personalised confirmation message and
resets the form. Nothing is actually sent anywhere — there's no backend in
this task, so the "submission" is simulated client-side.

## Responsive behaviour

Breakpoints at 900px, 720px, and 560px take the layout from a 3-column
plant grid and side-by-side hero down to a single column, and swap the
horizontal nav for the hamburger menu at 720px. Layout uses CSS Grid for
the hero, plant grid, and visit/form sections, and Flexbox for the header,
filter bar, and form rows.

## Design notes

- **Palette**: warm paper background, deep forest green as the primary
  brand color, and a berry-red accent (used sparingly, for tags and the
  eyebrow text) instead of the more expected terracotta/orange pairing.
- **Type**: Fraunces (serif) for display headings, Work Sans for body copy
  and UI — two typefaces with a clear contrast in role.
- **Dark theme**: implemented by swapping CSS variable values under
  `:root[data-theme="dark"]` rather than a separate stylesheet, so every
  component inherits it automatically.

## Bonus items included

- Modal component (plant quick view)
- Mobile menu component
- Theme toggle with `localStorage`
- Small, purposeful transitions (accordion expand, modal fade, hover
  states) — no animation on page load

## Screenshots

Not included in this export — capture desktop (e.g. 1440×900) and mobile
(e.g. 390×844) screenshots of the running page in your own browser before
submitting, per the task's deliverables list.

## Known limitations

- The reservation form doesn't send data anywhere; it's a front-end-only
  simulation, as no backend was in scope for this task.
- Content (plant descriptions, testimonials, studio address) is placeholder
  copy written for this brief, not a real business.
