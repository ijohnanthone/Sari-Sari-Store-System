# Project Skills Directory

This folder holds project-level skills discovered and loaded by Antigravity and open-source agent environments.

## Available Skills

| Skill | Path | Description |
| :--- | :--- | :--- |
| **`store-ui-design`** | `skills/store-ui-design/SKILL.md` | Sari-Sari Store Management System specific UI/UX rules, Bootstrap 5 theme tokens, manual inventory badges, and eLoad/GCash flows. |
| **`ui-ux-design`** | `skills/ui-ux-design/SKILL.md` | Universal UI/UX design standards: visual hierarchy, color systems, WCAG 2.1 AA accessibility, typography, and micro-interactions. |
| **`responsive-pos-layout`** | `skills/responsive-pos-layout/SKILL.md` | Cashier ergonomics, mobile vs. desktop POS screen split layouts, touch targets, and barcode scanner workflows. |
| **`dashboard-analytics-design`** | `skills/dashboard-analytics-design/SKILL.md` | KPI metric cards, Chart.js palettes, financial number formatting, and analytics visualization standards. |

## Directory Structure

Each skill lives in its own subdirectory containing a `SKILL.md` file:

```text
skills/
├── store-ui-design/
│   └── SKILL.md
├── ui-ux-design/
│   └── SKILL.md
├── responsive-pos-layout/
│   └── SKILL.md
├── dashboard-analytics-design/
│   └── SKILL.md
└── <your-custom-skill>/
    ├── SKILL.md            # Required: Skill prompt with YAML frontmatter
    ├── scripts/            # Optional: Shell or Node.js automation scripts
    ├── references/         # Optional: Documentation and checklists
    └── examples/           # Optional: Code snippets and patterns
```

## How to Add Open-Source Skills

To import any open-source skill (e.g., from community agent skill repositories):

1. Create a new folder inside `skills/`, for example: `skills/modern-css/`.
2. Add a `SKILL.md` file inside that folder with valid YAML frontmatter:

```markdown
---
name: modern-css
description: >-
  Guidelines and techniques for modern CSS features (Grid, Flexbox, custom properties, container queries).
---

# Modern CSS Guidelines

Your step-by-step instructions and references here...
```

3. Antigravity will automatically discover the skill on session startup via `.agents/skills.json`.
