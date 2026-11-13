---
name: dashboard-analytics-design
description: >-
  Design guidelines for dashboards, analytics cards, Chart.js visualizations,
  KPI metric indicators, and tabular reporting. Use when designing, reviewing,
  or styling admin dashboards, charts, and financial reports.
---

# Dashboard & Analytics Design Guidelines

This skill guides the design, layout, and visual presentation of KPI metric cards, data charts, and business analytics.

## 1. Metric Cards (KPI Cards)

1. **Card Hierarchy & Anatomy**:
   - **Label**: Uppercase mini-note or caption (`0.75rem - 0.8rem`, `font-weight: 700`, muted color).
   - **Hero Value**: Large and prominent (`font-size: 1.75rem - 2rem`, `font-weight: 800`).
   - **Subtext / Trend Context**: Explains timeframe or delta (e.g., "Rolling 30-day revenue", "Need attention soon").
   - **Semantic Accent**: Subtle left border or indicator pill matching status:
     - Revenue / In-Stock: Success emerald (`--brand-emerald`, `#10b981`)
     - Warning / Attention: Amber (`#f59e0b`)
     - Urgent / Stockout: Red (`#ef4444`)
     - Info / Volume: Cyan or Blue (`#06b6d4` / `#3b82f6`)

2. **Responsive Metric Grid**:
   - On small/mobile screens: show compact 2-column or 3-column tiles focusing on the hero value and icon.
   - On desktop: show full multi-column grid with detailed metadata notes.

---

## 2. Chart.js & Data Visualizations

1. **Color Palette & Theme Consistency**:
   - Use theme CSS variables or coordinated translucent fills rather than random bright colors.
   - Line chart fills: Use `rgba(16, 185, 129, 0.1)` with solid line strokes (`#10b981`, `2px` width) for positive growth.
   - Bar charts: Use rounded bar corners (`borderRadius: 4` to `6`) for a modern feel.

2. **Readability & Tooltips**:
   - Clean grid lines: Set chart grid lines to subtle light borders (`rgba(0, 0, 0, 0.05)` or transparent).
   - Tooltips: Use custom styled or dark pill tooltips with currency formatting (`₱XX.XX`).
   - Maintain a minimum chart canvas height (`height="110"` to `height="180"`) to avoid vertical squishing.

---

## 3. Tabular Data & Financial Numbers

1. **Numeric Alignment**:
   - Always right-align currency amounts, quantities, and numerical values so decimal points align vertically.
   - Use `font-variant-numeric: tabular-nums` or monospace font family for transaction tables and revenue columns.
2. **Empty & Loading States**:
   - If a date range has no sales, render a friendly empty state illustration or clear badge rather than an empty, broken canvas.
