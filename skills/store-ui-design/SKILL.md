---
name: store-ui-design
description: >-
  Specialized UI/UX design and styling standards for the Sari-Sari Store Management
  System. Use when modifying or creating views, Bootstrap 5 components, POS screens,
  inventory cards, modals, or customer-facing receipt designs.
---

# Sari-Sari Store Management System - UI/UX Design Standards

This skill guides design decisions, layout structures, and UI styling specific to the Sari-Sari Store POS and inventory application.

## 1. Project Design Tokens & Theme Alignment

The application uses Bootstrap 5 coupled with custom CSS properties defined in `public/css/app.css`:

```css
--brand-emerald: #10b981;  /* Primary brand & in-stock indicator */
--brand-teal: #0d9488;     /* Secondary accents & gradients */
--brand-cyan: #06b6d4;     /* Tertiary accent & hover states */
--text-strong: #13312d;    /* High contrast primary text */
--text-muted: #66807b;     /* Secondary / helper text */
--surface-card: rgba(255, 255, 255, 0.92); /* Frosted card surface */
--surface-soft: rgba(15, 23, 42, 0.035);    /* Table & item hover backgrounds */
--shadow-card: 0 1rem 2.75rem rgba(15, 23, 42, 0.1);
```

### Rule:
When creating or modifying styling:
- Always leverage the existing CSS custom properties and Bootstrap 5 utilities instead of hardcoding random hex values or ad-hoc margins.
- Maintain the glassmorphism/soft-surface aesthetic (`backdrop-filter: blur(8px)`, rounded corners, soft shadows).

---

## 2. Point of Sale (POS) Ergonomics

The POS screen (`views/sales.ejs`) requires high-speed cashier interactions:

1. **Card-Based Product Grid**:
   - Product cards must display: Item Name, Price (prominently), and Status indicator.
   - Cards should have tactile press states (`transform: scale(0.98)` on `:active`) for rapid tap-to-add feedback.
2. **Category Navigation**:
   - Keep category tabs horizontally scrollable with hide-scrollbar CSS for compact mobile screens.
   - Active category button must clearly contrast with inactive categories.
3. **Cart Panel**:
   - Always display item quantity controls with large `+` and `-` buttons (minimum 36px touch targets).
   - Prominently display the running Total at the bottom with a clear, full-width "Charge / Complete Sale" button.
   - Support fast keyboard interactions (Enter to search, Barcode scan modal shortcut).

---

## 3. Inventory Stock Status Design Rules

The store system uses **Manual Status Labels** rather than strict stock deduction:

- **`In Stock`**:
  - Badge style: `bg-success` or emerald tone (`#10b981`).
  - Item is active and selectable in the Sales grid.
- **`Low Stock`**:
  - Badge style: `bg-warning` or amber tone (`#f59e0b`).
  - Item remains selectable, but visually signals cashier/admin to restock.
- **`Out of Stock`**:
  - Badge style: `bg-danger` or red tone (`#ef4444`).
  - **Crucial Rule**: Out of stock items must be hidden or disabled in the quick sales view to prevent invalid transactions.

---

## 4. Digital Services (eLoad & GCash) Design

For digital services (`views/eload.ejs`):
- Maintain the 4-step visual flow (1: Provider/Network, 2: Customer Phone, 3: Amount, 4: Reference Number).
- Use distinct visual badges for **Cash In** vs **Cash Out** to prevent cashier handling errors.
- Ensure phone number inputs are formatted clearly (`09XX XXX XXXX`) with a numeric keypad trigger (`inputmode="numeric"`).

---

## 5. Modal and Form Best Practices

- Modals should use `var(--surface-card)` or `var(--input-bg)` with clear header titles and prominent close buttons.
- Form fields must have visible, descriptive `<label>` elements and clear placeholder text.
- Save / Submit actions should always be placed on the bottom right of the modal footer, with cancel/dismiss actions on the left.
