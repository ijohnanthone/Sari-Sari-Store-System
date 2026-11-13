---
name: responsive-pos-layout
description: >-
  Ergonomics and responsive layout patterns for Point of Sale (POS) touchscreens,
  handheld mobile devices, and desktop terminals. Use when designing cashier
  interfaces, product grids, cart drawers, or barcode scanning layouts.
---

# Responsive POS Layout & Ergonomics Guidelines

This skill defines responsive layout structures, touch targets, and cashier ergonomics for Point of Sale (POS) workstations and mobile phones.

## 1. Cashier Ergonomics & Speed

1. **Rapid Touch & Click Interactions**:
   - Product selection buttons/cards must have active feedback (`active: scale(0.97)`).
   - Touch targets must be at least **48x48px** for primary buttons (Add to Cart, Increment/Decrement Quantity, Pay/Complete Sale).
   - Critical action buttons ("Charge / Complete Sale") should be full-width or anchor the bottom-right corner of the viewport.

2. **Keyboard & Barcode Scanner Workflows**:
   - The primary search input (`#quickItemSearch`) should autofocus on page load or when barcode scanning modal closes.
   - Use `autocomplete="off"` and `autocorrect="off"` on search inputs to prevent browser overlay dropdowns from obscuring products.
   - For payment and amount inputs, use `inputmode="decimal"` or `inputmode="numeric"` so touchscreens open numeric keypads.

---

## 2. Responsive Viewport Adaptations

1. **Desktop / Tablet Terminal (Landscape or > 992px)**:
   - Split layout:
     - Left / Center column (60-70% width): Search bar, category pill scrollbar, and product cards grid.
     - Right column (30-40% width): Sticky cart drawer, itemized line totals, payment method toggles, and total checkout button.
   - Product grid: 3 to 4 columns of cards with high visual contrast for prices and stock status badges.

2. **Mobile Device (Portrait / Cashier Phone < 768px)**:
   - Full-width product search and horizontally scrollable category pills.
   - 2-column product grid with compact card padding (`p-2`).
   - Sticky bottom checkout bar showing item count and total sum, opening a slide-up modal / bottom sheet for cart adjustments and final payment.

---

## 3. Product Card Anatomy

Each card in the product grid should follow a strict hierarchy:

```text
+------------------------------------+
| [Status Badge: In Stock / Low]     |
|                                    |
| Item Name (Truncated to 2 lines)   |
| Category Tag (Muted mini-note)     |
|                                    |
| Price: ₱XX.XX (Bold & Large)      |
| [ + Tap to Add ]                   |
+------------------------------------+
```

- When an item is marked `Out of Stock`:
  - Show a disabled state (`opacity: 0.5`, `pointer-events: none`).
  - Badge clearly displays `Out of Stock` (Red/Rose badge).
