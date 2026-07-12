# TransitOps — Enterprise Design System Audit & Verification Architecture

**Version**: 2.4.0  
**Design Standard**: Airtable SaaS / Linear Workflow / Stripe Analytics Executive Interface  
**Primary Brand Accent**: `#FF5A36` (International Logistics Orange)  
**Neutral Canvas Base**: `#09090B` (Deep Studio Obsidian) / `#FAFAFA` (High-Contrast Clean White)

---

## 1. Executive Summary & Design System Philosophy

TransitOps has transitioned from standard admin templates into a unified, high-density enterprise SaaS platform. Drawing visual grammar from **Airtable**, **Linear**, and **Stripe Analytics**, the interface prioritizes editorial workflow hierarchy, sharp data density, full-bleed signature surfaces, and immediate operational clarity.

Every interactive element—from dashboard KPI cards to real-time live telemetry drawers—adheres to a strict design token hierarchy.

---

## 2. Typography System (`Inter` & Variable Scale)

We utilize clean geometric sans-serif typography (`Inter`) with strict optical kerning and tabular figures for numerical telemetry.

| Category Scale | Font Size / Weight | Line Height | Tracking | Usage Context |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | `72px–96px` (`900 Black`) | `1.02` | `-0.035em` | Landing page hero statements & impact metrics |
| **Page Executive Title** | `32px–40px` (`800 Extrabold`) | `1.15` | `-0.025em` | Main dashboard & module headers (`Executive Control Center`) |
| **Section Card Header** | `18px–20px` (`700 Bold`) | `1.30` | `-0.015em` | KPI card titles, table card headers, modal titles |
| **Tabular Data / Telemetry** | `13px–14px` (`600 Semibold Mono`) | `1.40` | `0em` | Vehicle registration IDs (`WB-04-E-1042`), GPS coordinates, odometer |
| **Body / Workflow Label** | `13px` (`500 Medium`) | `1.50` | `0em` | Table rows, drawer property pairs, navigation links |
| **Status Badge & Metadata** | `10px–11px` (`700 Bold uppercase`) | `1.20` | `+0.06em` | Severity chips (`CRITICAL`, `BR-012 LOCKED`, `GRADE A+`) |

---

## 3. Comprehensive Color Token Palette

Our color tokens are formulated for WCAG AAA/AA visual contrast across dark and light surfaces.

```
┌───────────────────────────────────────────────────────────────────────────┐
│ PRIMARY BRAND ACCENTS                                                     │
│   #FF5A36 — Core Signature Orange (Active state, CTAs, Hero Badges)       │
│   #FF7A59 — Hover & Secondary Accent Gradient                             │
├───────────────────────────────────────────────────────────────────────────┤
│ NEUTRAL LAYER SYSTEM (DARK STUDIO MODE)                                   │
│   #09090B — Base Studio Canvas (Full-bleed viewport background)           │
│   #111113 — Component Surface Level 1 (.air-card, tables, widgets)        │
│   #18181B — Component Surface Level 2 (Nested rows, input bars)           │
│   #27272A — Precision Structural Border (Separators, table rules)         │
│   #3F3F46 — Hover Border Focus Indicator                                  │
├───────────────────────────────────────────────────────────────────────────┤
│ SEMANTIC TELEMETRY INDICATORS                                             │
│   #22C55E — Emerald Success (Available assets, Grade A+, SLA On-Time)     │
│   #F59E0B — Amber Warning (In Shop workshop lock BR-012, idling)          │
│   #EF4444 — Rose Critical Danger (Expired driver license BR-004, breakdown)│
│   #3B82F6 — Sky Blue Haulage Corridor (Active trip dispatch BR-009)       │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Spacing, Geometry & Component Tokens

### Utility Geometry Tokens
- **Surface Elevation (`.air-card`)**:
  - `bg-[#111113] border border-[#27272A] rounded-2xl p-6 shadow-sm hover:border-[#3F3F46] transition-all`
- **Data Table Architecture (`.air-table`)**:
  - Compact `40px` row heights, border separators (`#27272A`), tabular numerical alignment.
- **Enterprise Pill Badges (`.air-badge`)**:
  - `px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider`
- **Primary Actions & CTA Pills**:
  - `bg-[#FF5A36] hover:bg-[#D84315] text-white font-bold rounded-xl px-4 py-2 transition-all shadow-md`

---

## 5. UI Component & Page Architecture Audit Checklist

| Module Page | Component / Surface | Token & Visual Verification Status | Notes |
| :--- | :--- | :--- | :--- |
| **Navigation System** | `Sidebar` (`components/sidebar.tsx`) | `VERIFIED` (Airtable group headers, active `#FF5A36` badge, collapsible mode) | Grouped hierarchy: Operations, Fleet Management, Finance |
| **Top Executive Band** | `TopBar` (`components/top-bar.tsx`) | `VERIFIED` (Clean role pill, quick search `⌘K`, notification indicator) | Consistent dark border architecture |
| **Executive Control Center** | `DashboardPage` (`app/dashboard/page.tsx`) | `VERIFIED` (4 large Stripe/Linear KPI cards, formula verification strip) | Includes live scenario controls & smart alert feed |
| **Dashboard Widgets Grid** | `DashboardWidgets` (`components/dashboard-widgets.tsx`) | `VERIFIED` (High-contrast composite scores, ROI ranking, workshop lock) | Grade A+ badge & crisp typography |
| **Live Operations Console** | `LiveOperationsPage` (`app/live-operations/page.tsx`) | `VERIFIED` (70/30 Samsara split view, floating glass scenario bar) | OSM road tracking + speed multiplier pills |
| **AI Copilot Intelligence** | `FleetCopilotModal` (`components/fleet-copilot.tsx`) | `VERIFIED` (Neural engine header, telemetry confidence chips, quick prompts) | Markdown formatting with `#FF5A36` highlighting |
| **Commercial Asset Registry**| `VehiclesPage` (`app/vehicles/page.tsx`) | `VERIFIED` (Card grid aligned to `#111113` surface, status pills, CSV export) | Zero syntax conflicts, clean full-width canvas |

---

## 6. Screenshot & Review Checklist for Hackathon Presentation

When presenting TransitOps to judges, execute the following UI verification checklist:
1. [x] **Landing Page & Hero Overlap**: Confirm full-bleed `/hero.png` composition with bold `TransitOps` typography and `#FF5A36` primary action button.
2. [x] **Sidebar Navigation**: Show grouped Airtable navigation headers (`OPERATIONS`, `ASSETS & ROSTER`, `FINANCE & GOVERNANCE`).
3. [x] **Executive Dashboard KPI Row**: Highlight the 4 large enterprise cards showing `Total Fleet Assets`, `Active Trips & Corridors`, `Driver Safety Average (88.5/100)`, and `Monthly Fuel Expenditure`.
4. [x] **PRD Operational Formula Strip**: Point out the live formula calculation: `(Vehicles On Trip / Total Active Fleet) × 100 = Fleet Utilization Rate`.
5. [x] **Live Operations Command Map**: Open `/app/live-operations` to display the Samsara-style floating header, speed controls (`1x`, `2x`, `5x`, `10x`), and real-time asset console drawer.
6. [x] **AI Fleet Copilot Console**: Open AI Copilot to showcase Groq Neural Engine telemetry responses with confidence chips (`99.4% Confidence`).
