---
name: ui-ux-design
description: >-
  Provides comprehensive UI/UX design principles, design tokens, visual hierarchy,
  color theory, typography, accessibility (WCAG AA), responsive layout guidelines,
  and interaction patterns. Use when designing, reviewing, or styling user interfaces,
  components, views, or layouts.
---

# UI/UX Design System & Guidelines

This skill provides open-source, industry-standard UI/UX principles for crafting modern, accessible, and intuitive user interfaces.

## 1. Visual Hierarchy & Layout

1. **Information Chunking**:
   - Group related elements using card surfaces (`border-radius: 0.75rem` to `1rem`, subtle borders, and soft shadows).
   - Maintain clear negative space (whitespace) between sections to reduce cognitive load.
   - Use standard spacing increments (4px, 8px, 12px, 16px, 24px, 32px, 48px).

2. **F-Pattern & Z-Pattern Scanning**:
   - Position primary navigation and branding at the top.
   - Place critical summaries or call-to-action (CTA) buttons where eye movement naturally terminates (e.g., bottom-right of forms/modals or persistent sticky sidebars).

3. **Elevation & Depth**:
   - Use subtle layered shadows rather than harsh borders to indicate depth:
     - Surface: `0 1px 3px rgba(0,0,0,0.05)`
     - Card: `0 4px 12px rgba(15, 23, 42, 0.08)`
     - Popover / Modal: `0 16px 36px rgba(15, 23, 42, 0.16)`

---

## 2. Color Systems & Design Tokens

1. **Semantic Color Roles**:
   - **Primary / Brand**: Key interaction triggers, active tabs, and primary action buttons.
   - **Neutral / Surface**: Dark/light neutral tones for text (`#1e293b` / `#0f172a`), muted subtext (`#64748b`), and surface cards.
   - **Success**: Confirmations, completed sales, in-stock badges (`#10b981` / emerald).
   - **Warning**: Action needed soon, low-stock warnings, pending approval (`#f59e0b` / amber).
   - **Danger / Destructive**: Critical alerts, deletions, out-of-stock indicators (`#ef4444` / red).
   - **Info**: Helper callouts, tips, neutral metadata (`#3b82f6` / blue).

2. **Contrast & WCAG 2.1 Compliance**:
   - Maintain at least **4.5:1** contrast ratio for normal text and **3:1** for large headings and icons.
   - Never rely on color alone to convey meaning (always pair color indicators with text labels or distinct icons).

---

## 3. Typography & Text Hierarchy

1. **Font Scale**:
   - Headings: `h1` (1.75rem - 2rem, 700 bold), `h2` (1.35rem - 1.5rem, 600 semi-bold), `h3` (1.15rem - 1.25rem, 600 semi-bold).
   - Body text: `1rem` (16px base) with `1.5` line-height for readability.
   - Captions / Metadata: `0.85rem - 0.875rem` (13px - 14px) with muted text color.

2. **Data Presentation**:
   - Use tabular numbers (`font-variant-numeric: tabular-nums` or monospace) for numerical tables, currency amounts, and inventory counts so numbers align vertically.

---

## 4. Responsive & Touch-First Design

1. **Touch Targets**:
   - All interactive elements (buttons, quantity pickers, category pills, mobile links) must be at least **44x44px** (preferably 48x48px) on mobile and touch devices.
   - Provide adequate hit-target padding even if the visual icon is smaller.

2. **Breakpoints**:
   - Mobile: `< 768px` (single-column layout, bottom sheets or sticky bars for checkout).
   - Tablet: `768px - 1024px` (adaptive 2-column or collapsable sidebars).
   - Desktop: `> 1024px` (multi-column split layout, master-detail views).

---

## 5. Micro-interactions & State Feedback

1. **Interactive States**:
   - Provide immediate visual feedback for all interaction states: Default, Hover, Active/Pressed, Focus Visible, and Disabled.
   - Use accessible `:focus-visible` outlines (`2px solid currentColor` with `2px offset`).
2. **Smooth Transitions**:
   - Use rapid, natural transitions (`transition: all 0.15s ease-in-out` or `0.2s cubic-bezier(0.4, 0, 0.2, 1)`). Avoid long or sluggish animations in transactional apps.
