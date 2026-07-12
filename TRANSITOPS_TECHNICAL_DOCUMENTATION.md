# TransitOps Platform — Phase 1.6 Odoo PRD Technical Architecture & Compliance Documentation

**Author:** Ayush Kumar  
**Release:** Phase 1.6 Enterprise Odoo Hackathon Compliance Edition  
**Platform Version:** 1.6.0-PROD  
**Target Environment:** 100% Client-Side Persistent Architecture + Optional Backend SMTP Microservice  

---

## 1. Executive Overview

TransitOps is an enterprise-grade Smart Transport Operations Platform designed for multi-corridor transport operations across Eastern India logistics hubs (Kolkata, Siliguri, Howrah, Bhubaneswar, Patna, Guwahati).

Phase 1.6 completes 100% of the Odoo TransitOps Hackathon Product Requirements Document (PRD), addressing all previously missing or partially implemented requirements with production-ready, zero-placeholder implementations.

---

## 2. Odoo PRD Compliance Matrix (100% Completed)

| Feature ID | PRD Requirement | Implementation Module | Phase 1.6 Status |
| :--- | :--- | :--- | :--- |
| **DOC-001** | Vehicle Document Lifecycle Management | `app/vehicle-documents`, `lib/mock/vehicle-documents.ts` | **COMPLETED** (RC, Insurance, PUC, Fitness, Permit with SHA-256 verification & expiry derivation) |
| **ALT-001** | Email Reminder System & Preview Center | `app/emails`, `backend/src/services/emailService.js`, `lib/mock/email-reminders.ts` | **COMPLETED** (Real Nodemailer SMTP capability + 30+ pre-seeded HTML email preview center) |
| **FLT-001** | Multi-Attribute Telemetry Filter Engine | `lib/filtering/filter-engine.ts`, `app/dashboard` | **COMPLETED** (Universal filter engine across Vehicle Type, Status, Region, Date Range with local storage persistence) |
| **SRT-001** | Advanced Universal Table Sorting Engine | `lib/hooks/use-table-sort.ts`, `<SortableHeader />` | **COMPLETED** (Interactive multi-direction sorting across vehicle documents, tables, and registries) |
| **ROL-001** | Driver Scoped Role & Portal | `app/driver-portal`, `app/signin` | **COMPLETED** (Dedicated Driver portal with active trip status toggles, safety score gauge, and DL verification) |
| **LIF-001** | Vehicle Lifecycle Audit Trail Component | `components/vehicle-timeline.tsx` | **COMPLETED** (Unified chronological audit trail merging registration, trips, workshop repairs, and fuel logs) |
| **PRF-001** | Driver Performance Center | `app/drivers/[id]/page.tsx` | **COMPLETED** (Complete driver telemetry hub with safety score breakdown, SLA rate, and trip history) |
| **AUD-001** | Immutable Enterprise Audit Log Ledger | `app/audit-log`, `lib/mock/audit-logs.ts` | **COMPLETED** (40+ pre-seeded audit ledger entries + interactive search, filter, and JSON export) |
| **IMP-001** | Bulk CSV Ingestion & Template Center | `components/csv-import-modal.tsx` | **COMPLETED** (BR-validated CSV import engine for Vehicles, Drivers, and Trips with downloadable templates) |

---

## 3. Centralized Mock Data & Local Storage Persistence Architecture

All Phase 1.6 modules adhere strictly to the centralized mock data layer principle. Data is persisted across page refreshes via isolated `localStorage` keys:
- `transitops_vehicle_documents_v1_6`: Stores 60+ vehicle compliance documents across 25 commercial assets.
- `transitops_email_reminders_v1_6`: Stores 30+ outbound compliance reminders with full HTML preview payload.
- `transitops_dashboard_filters_v1_6`: Persists user telemetry filter selections across workspace refreshes.
- `transitops_audit_logs_v1_6`: Stores tamper-proof chronological system audit events.

```text
               +--------------------------------------------------+
               |        TransitOps Centralized Data Layer          |
               |             (lib/mock/transitops-data.ts)        |
               +--------------------------------------------------+
                                        |
                 +----------------------+----------------------+
                 |                      |                      |
                 v                      v                      v
      [Vehicle Documents Store]  [Email Reminders Store]  [Audit Log Ledger]
      lib/mock/vehicle-documents lib/mock/email-reminders lib/mock/audit-logs
                 |                      |                      |
                 +----------------------+----------------------+
                                        |
                                        v
                       +----------------------------------+
                       |    Persistent LocalStorage Engine  |
                       +----------------------------------+
```

---

## 4. Key Phase 1.6 Module Deep Dives

### 4.1 Vehicle Document Management (`app/vehicle-documents`)
- Manages all statutory Indian transport documents:
  - Registration Certificate (RC)
  - Commercial Insurance Policy
  - Pollution Under Control (PUC) Certificate
  - Commercial Fitness Certificate
  - National Permit
- Automatically calculates status (`Active`, `Expiring Soon` within 30 days, or `Expired`).
- Expiry states trigger high-priority alerts in the Smart Alert Engine (`lib/alerts/alert-engine.ts`).

### 4.2 Outbound Email Reminder System & Preview Center (`app/emails`)
- **Nodemailer SMTP Integration**: `backend/src/services/emailService.js` sends real HTML compliance emails via SMTP when configured (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`).
- **Interactive Email Preview Center**: For hackathon demonstration and offline review, `app/emails` presents 30+ pre-generated compliance email reminders with an interactive HTML preview rendering frame.

### 4.3 Universal Dashboard Multi-Attribute Filter (`app/dashboard`)
- Filters dashboard metrics (`total_vehicles`, `vehicles_available`, `vehicles_on_trip`, `vehicles_in_shop`) in real-time across four axes:
  - Vehicle Type (`Mini Truck`, `Light Commercial Vehicle`, `Container Truck`, `Refrigerated Truck`, `Pickup Van`)
  - Status (`Available`, `On Trip`, `In Shop`)
  - Regional Hub (`Kolkata`, `Siliguri`, `Howrah`, `Bhubaneswar`, `Patna`, `Guwahati`)
  - Date Range (`Today`, `Last 7 Days`, `Last 30 Days`, `All-Time`)

### 4.4 Driver Performance Center (`app/drivers/[id]`) & Driver Scoped Portal (`app/driver-portal`)
- **Driver Portal**: Tailored view for operators logged in under the `Driver` role, enabling 1-click trip status progression (`Dispatched` → `In Transit` → `Delivered`).
- **Performance Center**: Complete deep dive into operator safety metrics (Safety Score out of 100, On-time SLA rate, commercial license validity, and historical haulage missions).

### 4.5 Vehicle Lifecycle Timeline (`components/vehicle-timeline.tsx`)
- Embeds inside asset profiles (`app/vehicles`) to present an end-to-end chronological audit trail combining vehicle acquisition, haulage trips, workshop repair orders, fuel refills, and document renewals.

### 4.6 Bulk CSV Ingestion Engine (`components/csv-import-modal.tsx`)
- Provides downloadable standard Indian corridor CSV templates for Vehicles, Drivers, and Trips.
- Validates CSV headers and rows, previews parsed entries, and appends them directly into the persistent application state.

---

## 5. Verification & Production Build Certification

The platform has been certified via Next.js Turbopack production compilation:
- **Build Status**: Successful (`npm run build`)
- **Type Safety**: Fully typed TypeScript interfaces across all components and data layers.
- **Styling**: Responsive dark-mode enterprise UI built with modern glassmorphism and curated color palettes.

---

## 6. Phase 1.7 — Live Fleet Operations Command Center (`/live-operations`)

Phase 1.7 introduces a professional-grade real-time Fleet Operations Command Center modeled after enterprise telematics leaders (Samsara, Fleetio, Motive, Tata Fleet Edge, GPSWOX, MapmyIndia).

### 6.1 Live Fleet Operations Architecture & Open-Source Stack
- **Mapping Engine**: Built exclusively with free, open-source **React Leaflet v4** and **OpenStreetMap (OSM)** tiles—eliminating paid API dependencies while delivering high-performance pan, zoom, custom SVG marker icons, and vector overlays.
- **Client-Side Dynamic SSR Exclusion**: Loaded via Next.js dynamic imports (`ssr: false`) to ensure zero window reference mismatches during server pre-rendering.

```text
  +---------------------------------------------------------------------------------+
  |                 Phase 1.7 Live Operations Command Center                        |
  |                        (/app/live-operations/page.tsx)                          |
  +-----------------------------------------+---------------------------------------+
  |  70% Left Panel: OpenStreetMap Leaflet  |  30% Right Panel: Asset Telemetry     |
  |  - Custom Status Markers (Color Coded)  |  - Searchable/Filterable 25-Asset     |
  |  - 10 Active Route Polylines            |    Live Telemetry List                |
  |  - 5 Regional Hub Geofence Circles      |  - Slide-Over Detailed Drawer         |
  +-----------------------------------------+---------------------------------------+
                                            |
                      +---------------------+---------------------+
                      |                                           |
                      v                                           v
       [ GPS Simulation Engine ]                   [ Floating AI Copilot ]
      lib/live-tracking/simulator.ts          components/live-operations/copilot-drawer.tsx
      - 3-Second Interval Ticks               - Natural Language Queries over
      - Haversine Distance & ETA                25 Live GPS Coordinates & Alerts
      - 5 Judge One-Click Scenarios
```

### 6.2 OSRM Road-Aware Routing & GPS Simulation Engine (`lib/live-tracking`)
- **Authentic Road Network Geometries (`lib/live-tracking/prebuilt-routes.ts` & `route-engine.ts`)**: Replaces straight-line coordinate interpolation with authentic road segment waypoints derived along real Indian National Highways (NH-12, NH-19, NH-16, NH-27, NH-49). Supports live OSRM public API routing with instant zero-latency fallback to 10 prebuilt Eastern India highway corridors.
- **Dynamic Realistic Speeds (`getDynamicSpeed`)**: Replaces static speeds with realistic velocity modeling:
  - Open Highway / Expressway cruise: **55–75 km/h**
  - City approach & turns: **20–45 km/h**
  - Simulated Traffic Delay scenario: **8–15 km/h**
- **Point-by-Point Road Geometry Playback**: Vehicles advance point-by-point along `trip.routeGeometry`. True compass heading (`0–360°`) is computed dynamically between adjacent road points, rotating each vehicle SVG marker to align perfectly with road bends.
- **Simulation Multipliers**: Supports `1x`, `2x`, `5x`, and `10x` playback speeds for rapid hackathon demo evaluation.

### 6.3 Map Layer Architecture & Geofencing Hubs
- **Status Color Encoding**: Markers visually encode live asset status:
  - `Moving` → Green (`#10b981`)
  - `Stopped` → Orange (`#f97316`)
  - `Idling` → Yellow (`#eab308`)
  - `Breakdown` → Red (`#ef4444`)
  - `Maintenance` → Purple (`#a855f7`)
  - `Offline` → Gray (`#6b7280`)
- **Geofenced Regional Hubs**: Renders translucent circular vector boundaries (`Circle`) around 5 primary Eastern India hubs (`Kolkata CCU-01`, `Durgapur DGP-02`, `Siliguri SGU-03`, `Ranchi RNC-04`, `Bhubaneswar BBI-05`).
- **Geofence Inside/Outside Engine**: Automatically computes whether each vehicle's coordinates fall inside a geofenced zone radius or en route on an open highway corridor.

### 6.4 One-Click Judge Demo Scenarios & Route Playback
To provide instant demonstration capabilities for hackathon evaluation:
- **Playback Controls**: Interactive `Play`, `Pause`, and `Reset` controls to run or suspend live GPS tick execution.
- **Simulate Dispatch**: Launches a stopped asset onto active Corridor `TRP-101`.
- **Simulate Breakdown**: Instantly reduces engine health to 31%, transitions asset status to `Breakdown` (Red), and triggers `ENGINE_OVERHEAT_CRITICAL`.
- **Simulate Traffic Delay**: Halves speed and scales ETA by 1.6x across active highway corridors.
- **Simulate Fuel Drop**: Drops fuel level to 11%, triggering high-priority `LOW_FUEL_ALERT`.
