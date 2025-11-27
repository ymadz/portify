# Design Guide — Modern Minimal Components

**Purpose:** A compact, practical design spec to build neat, modern, and minimal UI components using component libraries (Tailwind + component primitives). Use this as the single-file source of truth when implementing the Portfolio Generator Platform UI.

---

## 1. Design Principles

* **Minimalism:** reduce visual noise — generous whitespace, restrained color, limited type scale.
* **Hierarchy by spacing & weight:** use spacing and font-weight rather than heavy colors.
* **Consistency:** tokens for color, spacing, radius, and elevation.
* **Accessible by default:** focus states, contrast, semantic markup, keyboard interactions.
* **Composable:** build small primitives (Button, Input, Card) and compose larger components.

---

## 2. Technology & Libraries (Recommended)

* **Tailwind CSS** — base utility framework.
* **shadcn/ui (Radix primitives)** or **Headless UI** — unstyled accessible components to style with Tailwind.
* **Radix UI** — for low-level accessible primitives (optional).
* **Lucide / Heroicons** — lightweight icon set.
* **Recharts** — charts for dashboard.

*Why:* Tailwind + unstyled component primitives gives complete visual control while keeping accessibility and interactive behavior handled by battle-tested libraries.

---

## 3. Design Tokens (Tailwind-first)

Add these to `tailwind.config.js` under `theme.extend`:

* **Color palette (neutral + accent):**

  * `--bg: #0F1724` (dark variant) / `#ffffff` (light)
  * `--surface: #ffffff` (cards)
  * `--muted: #6B7280` (muted text)
  * `--accent: #7C3AED` (primary)
  * `--accent-weak: #EDE9FE` (subtle)

* **Radius**

  * `sm: 6px`, `md: 12px`, `lg: 20px`

* **Shadow / Elevation**

  * subtle: `0 1px 2px rgba(16,24,40,0.04)`
  * card: `0 6px 18px rgba(16,24,40,0.08)`

* **Spacing scale** — use Tailwind's 4/8/12 rhythm (e.g., `p-4`, `p-6`, `p-8`).

* **Type scale**

  * `xs` 12px, `sm` 14px, `base` 16px, `lg` 20px, `xl` 24px, `2xl` 32px.

---

## 4. Core Primitives (What to build first)

1. **Button** (variants: primary, ghost, outline, destructive)
2. **Input / Textarea / Select** (with label, helper text, error) — accessible forms
3. **Card** (header, body, footer) — used heavily across dashboard and projects
4. **Badge / Chip** — for skills and tags
5. **Progress / Gauge** — profile strength (use radial or simple bar)
6. **Modal / Drawer** — for forms (create/edit)
7. **Toast** — ephemeral feedback
8. **Avatar** — initials fallback + image
9. **Timeline** — experience view
10. **Grid / Masonry** — project cards

---

## 5. Component Patterns & Examples

> These snippets are design guidance. Implement using your chosen component primitives.

### Card (Project)

* Use subtle elevation, left-aligned content, title, small meta row, description, and actions.
* Visual cues: small tag chips for tech stack, secondary text color for dates.

### Skill Chip

* Rounded pill, small text, subtle background (`accent-weak`), borderless.
* If proficiency exists, show a small circular progress or 1–10 dots.

### Profile Strength (Gauge)

* Use a compact radial gauge for dashboard header.
* Alternative: horizontal progress bar with percentage and breakdown tooltip.

### Timeline (Experience)

* Vertical list with year markers, subtle separators, company + role + date range.
* Current position: emphasize with accent border or dot.

### Forms (Add Project / Add Experience)

* Two-column layout on wide screens: 2/3 content | 1/3 sidebar for meta (dates, tags)
* Clear error states (underline or small error message) and accessible labels.

---

## 6. Visual Specification (Spacing & Layout)

* **Page container:** `max-w-6xl mx-auto px-6`.
* **Dashboard grid:** `grid grid-cols-1 lg:grid-cols-3 gap-6`. Left column: summary card (Profile Strength). Right columns: charts and lists.
* **Card padding:** `p-6` for primary cards, `p-4` for compact cards.
* **Icon size:** `h-5 w-5` for inline icons, `h-8 w-8` for avatar icons.

---

## 7. Accessibility & Interaction

* All interactive elements must be focusable and have visible focus styles: `focus:outline-none focus:ring-2 focus:ring-offset-2`.
* Use semantic HTML (`<form>`, `<button>`, `<header>`, `<section>`) and ARIA where necessary (e.g., `role=dialog` for modals).
* Support keyboard navigation for modal/drawer and list items.

---

## 8. Branding & Color Usage

* Keep palette limited: neutrals + 1 accent + 1 success + 1 destructive.
* Use accent for primary CTAs only; secondary actions should be ghost/outline.
* For charts, use different tints of accent and neutral palette to maintain minimalism.

---

## 9. Example Component Variants (Naming & Use)

* `Button/Primary` — main CTA.
* `Button/Secondary (Ghost)` — low emphasis.
* `Card/Default` — default container for content.
* `Form/Input/Inline` — small inputs used in lists.
* `Chip/Skill` — used in project and profile pages.

---

## 10. Implementation Checklist

* [x] Create Tailwind tokens and extend config.
* [x] Build primitive components (Button, Input, Card, Modal).
* [x] Create layout templates (Dashboard, Project Grid, Timeline, Public Portfolio).
* [ ] Integrate shadcn/ui or Headless UI primitives for accessibility.
* [x] Add Recharts components for dashboard visualizations.
* [x] Build small CSS utility classes for consistent spacing and card elevation.

---

## 11. Code Snippets & Starter Tips

* **Use a single `components/` folder** with subfolders per component and an `index.ts` barrel.
* **Prefer composition**: provide `Card.Header`, `Card.Body`, `Card.Footer` slots.
* **Storybook** (optional) — add stories for each component to speed development and QA.

---

## 12. Appendix: Example Tailwind config fragment

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        accent: 'var(--accent)',
        'accent-weak': 'var(--accent-weak)',
        muted: 'var(--muted)'
      },
      borderRadius: {
        md: '12px',
        lg: '20px'
      }
    }
  }
}
```

---

## Final notes

This file is intended to be a concise design-to-dev bridge: minimal tokens, accessible patterns, and practical component list. If you want, I can also produce React+Tailwind component templates for each core primitive (Button, Card, Input, Modal) ready to drop into your Next.js app.
