---
name: modern-ui-design
description: Guidelines and design standards for creating modern, minimalist user interfaces, custom layouts, colors, and typography.
---
# Skill: Modern Minimalist UI Design Guide

## Purpose
Enables the agent to generate code for modern, polished, ultra-minimal web interfaces. This skill prevents cluttered layouts, poor contrast, and amateur visual hierarchies by enforcing strict mathematical design principles.

## Core Directives

### 1. The 60-30-10 Color Rule
Enforce a clean, intentional color distribution to maintain minimalism and focus:
*   **60% Dominant (Background):** Pure white, ultra-light gray, or deep midnight black/slate.
*   **30% Secondary (Structure/Text):** High-contrast text colors and muted borders (e.g., slate, zinc, or cool gray).
*   **10% Accent (Action):** Exactly ONE vibrant color (e.g., electric blue, violet, or emerald) reserved strictly for primary buttons, active states, and critical highlights.

### 2. Strict Mathematical Spacing (The 4px/8px Grid)
Never guess margins or paddings. All spatial values must be multiples of 8px (or 4px for tight micro-elements).
*   **Component Padding:** Use explicit steps like `16px`, `24px`, or `32px`.
*   **Section Gaps:** Use `64px` or `96px` to give elements breathing room. Minimalist design relies heavily on whitespace to look premium.

### 3. Typography & Hierarchy
Limit the interface to one premium, highly legible variable sans-serif font family (e.g., Inter, SF Pro, or Geist Sans). Enforce contrast through scale and weight, not color variations:
*   **Headings:** Bold or Semi-Bold, tight letter-spacing (`tracking-tight`), large scale.
*   **Body:** Regular weight, slightly muted color, generous line-height (`leading-relaxed`).
*   **Interactive:** Medium weight, always explicitly mapped to tap/click targets.

### 4. Component Refinement Guardrails
When building or modifying components, strictly enforce these structural constraints:
*   **Borders & Shadows:** Use ultra-thin `1px` borders with low opacity or soft, diffused ambient shadows. Avoid heavy borders or harsh, dark drop-shadows.
*   **Border Radii:** Keep corners sharp (`2px` to `4px`) for a tech/brutalist look, or moderately rounded (`8px` to `12px`) for an approachable, modern SaaS aesthetic. Never mix both styles in one interface.
*   **Layouts:** Prioritize asymmetrical CSS Grid layouts or clean, centered Flexbox rows over traditional, blocky bootstrap-style grids.

### 5. Coding Standards
When writing, editing and updating the HTML, CSS or JS files, follow these standards:
*   **Frameworks** Avoid using large frameworks for component creation. The website is a simple blog and should avoid using large CSS, JS or other web frameworks.
*   **Complexity** The code should be kept minimal, easy to understand and free from cleverness. All patterns used should be understandable to a typical software engineer, but not so basic as to limit the intended functionality.
*   **Brevity** Write as much code as necessary, but value short and pithy over long and verbose.
*   **Cleanliness** Do not work around broken functions. Avoid creating confusion when a refactor would be the cleanest path. All code needs to remain maintainable.

## Verification Checklist
Before outputting code, verify that:
1. [ ] The layout uses no more than three colors total (Background, Text, Accent).
2. [ ] Every margin, padding, and gap utility cleanly maps to an 8px grid system.
3. [ ] No decorative elements (like unnecessary lines, background patterns, or emojis) exist purely to "fill space."
4. [ ] Coding Standards are adhered to.
