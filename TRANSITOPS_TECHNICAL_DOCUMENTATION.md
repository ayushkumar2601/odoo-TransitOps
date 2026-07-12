# TRANSITOPS — TECHNICAL ARCHITECTURE & ENTERPRISE DOCUMENTATION
**Version:** 2.0.0 (Phase 1.5 Enterprise Hardening & Demo Optimization Release)  
**Hackathon:** Odoo x Adamas University Hackathon 2026  
**Lead Author & Architect:** Ayush Kumar  
**Target Platform:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS + Recharts + Express 5 + Groq Llama 3.3 70B  

---

## 1. EXECUTIVE SUMMARY & PLATFORM VISION

TransitOps is an enterprise-grade, centralized transport and fleet operations platform engineered to digitize the complete lifecycle of heavy commercial freight and haulage operations. Built specifically to eliminate fragmented spreadsheet logbooks and uncoordinated manual dispatching, TransitOps unifies asset registry, driver governance, dispatch lifecycle management, workshop maintenance locking, fuel consumption telemetry, and multi-hub financial ROI yield analytics under a single deterministic command architecture.

```
+----------------------------------------------------------------------------------------------------+
|                                    TRANSITOPS CENTRAL COMMAND TOWER                                |
+------------------------------------+-----------------------------------+---------------------------+
|      ASSET GOVERNANCE MODULE       |     DISPATCH & CORRIDOR MODULE    |     MAINTENANCE & FINANCIAL|
|  - 25 Heavy Commercial Vehicles    |  - Automated Capacity Verification|  - BR-012 Workshop Lock   |
|  - BR-001 Unique Registration Check|  - BR-009/BR-010 State Transitions  |  - Net ROI Yield Formula  |
|  - BR-004 License Compliance Audit |  - Live Eastern India Corridors   |  - 120+ Diesel Log Engine |
+------------------------------------+-----------------------------------+---------------------------+
|                                    SHARED DATA PERSISTENCE LAYER                                   |
|               (Client-Side Hydrated LocalStorage Store + Runtime Deterministic Seed)               |
+----------------------------------------------------------------------------------------------------+
|                                      AI FLEET COPILOT ENGINE                                       |
|                  (Groq Llama 3.3 70B Versatile Telemetry Analysis & Telemetry Chat)                |
+----------------------------------------------------------------------------------------------------+
```

---

## 2. BUSINESS RULES (BR-001 THROUGH BR-013) ENFORCEMENT MATRIX

TransitOps guarantees programmatic enforcement of 13 critical transport operations rules across all user interactions and automated scenario runs:

| Rule ID | Rule Name | Specification & Programmatic Enforcement Point |
| :--- | :--- | :--- |
| **BR-001** | Unique Registration Verification | Enforced in `persistentStore.addVehicle()`. Rejects duplicate registration plates (case-insensitive trim check). |
| **BR-002** | Retired Vehicle Dispatch Lock | Enforced in `persistentStore.dispatchTrip()`. Prevents dispatch assignment if asset status is `Retired`. |
| **BR-003** | In Shop Dispatch Lock | Enforced in `persistentStore.dispatchTrip()`. Prevents dispatch assignment if asset status is `In Shop`. |
| **BR-004** | Expired License Compliance Audit | Enforced in `persistentStore.dispatchTrip()` and `alert-engine.ts`. Locks drivers with `expiryDate < today`. |
| **BR-005** | Suspended Driver Safeguard | Enforced in `persistentStore.dispatchTrip()`. Prevents assignment of drivers marked `Suspended`. |
| **BR-006** | Single Driver Trip Assignment | Enforced in `persistentStore.dispatchTrip()`. Prevents simultaneous assignment if driver is `On Trip`. |
| **BR-007** | Single Asset Trip Assignment | Enforced in `persistentStore.dispatchTrip()`. Prevents assigning an asset that is already `On Trip`. |
| **BR-008** | Cargo vs. Capacity Check | Enforced in `persistentStore.addTrip()`. Validates `trip.cargoWeight <= vehicle.maxLoadCapacity`. |
| **BR-009** | Dispatch Lifecycle Transition | Executed in `persistentStore.dispatchTrip()`. Atomically transitions Trip to `Dispatched`, Asset & Driver to `On Trip`. |
| **BR-010** | Trip Completion Restitution | Executed in `persistentStore.completeTrip()`. Transitions Trip to `Completed`, Asset & Driver back to `Available`. |
| **BR-011** | Trip Cancellation Rollback | Executed in `persistentStore.cancelTrip()`. Restores active assets and personnel back to `Available`. |
| **BR-012** | Workshop Maintenance Lock | Executed in `persistentStore.openMaintenance()`. Locks asset to `In Shop` for the duration of repair. |
| **BR-013** | Maintenance Release Restitution | Executed in `persistentStore.closeMaintenance()`. Closes service record and restores asset to `Available`. |

---

## 3. PERSISTENT DEMO STATE ARCHITECTURE (`lib/store/transitops-store.ts`)

To support live hackathon judging, continuous interactive testing, and multi-page workflow demonstration, TransitOps implements a state persistence engine (`TransitOpsPersistentStore`) that synchronizes memory state with HTML5 `localStorage` while guaranteeing zero Server-Side Rendering (SSR) hydration mismatches.

```ts
const STORAGE_KEY = 'transitops_demo_state_v1_5'
```

### Core Capabilities:
1. **Hydration-Safe Initialization**: On first load or SSR render, defaults to deterministic seed data (`SEED_VEHICLES`, `SEED_DRIVERS`, `SEED_TRIPS`, `SEED_MAINTENANCE`, `SEED_FUEL`, `SEED_EXPENSES`, `SEED_NOTIFICATIONS`).
2. **Atomic Write Synchronization**: Every state transition (`dispatchTrip`, `completeTrip`, `openMaintenance`, etc.) commits immediately to `localStorage`.
3. **One-Click Demo Reset**: `resetDemoData()` instantly flushes modified state and restores pristine seed data for judging presentations.

---

## 4. SMART ALERT ENGINE SPECIFICATION (`lib/alerts/alert-engine.ts`)

The Smart Alert Engine evaluates live telemetry across four distinct operational dimensions and assigns standardized severity grades:

```
                  +-----------------------------------+
                  |      TRANSITOPS ALERT ENGINE      |
                  +-----------------+-----------------+
                                    |
     +------------------------------+------------------------------+
     |                              |                              |
+----v-----+                  +-----v----+                   +-----v----+
| CRITICAL |                  |   HIGH   |                   |  MEDIUM  |
+----+-----+                  +-----+----+                   +-----+----+
     |                              |                              |
     +-- BR-004 Expired License     +-- Assets > 150,000 km        +-- Active BR-012 In Shop Lock
     +-- License Expiry <= 7 days   +-- Workshop Spike > ₹200,000  +-- License Expiry <= 30 days
                                    +-- License Expiry <= 14 days
```

---

## 5. AI FLEET COPILOT ARCHITECTURE (GROQ LLAMA 3.3 70B)

TransitOps integrates a real-time conversational and analytical AI Copilot powered by **Groq Llama 3.3 70B Versatile** API (`https://api.groq.com/openai/v1/chat/completions`) with a deterministic local analytical fallback engine.

### AI Context Injector Payload:
When a query is dispatched, the Copilot injects live telemetry:
- Active asset ratios (`vehiclesOnTrip` vs `vehiclesAvailable` vs `vehiclesInShop`)
- Real-time Fleet Utilization Rate (`fleet_utilization_rate%`)
- Financial ROI yield leaderboard rankings (`topRoiAsset`, `bottomRoiAsset`)
- Compliance audit summaries (`expiredLicenses`)

---

## 6. ROLE-BASED ACCESS CONTROL (RBAC) GOVERNANCE

TransitOps provides 5 tailored operational roles accessible via the Command Center login portal:
1. **Fleet Manager (`usr-01`)**: Complete administrative command over vehicles, acquisition logs, and lifecycle control.
2. **Dispatcher (`usr-02`)**: Specialist dispatch authority governing trip creation, corridor assignment, and BR-008 capacity verification.
3. **Safety Officer (`usr-03`)**: Governance overseer responsible for driver safety telemetry, BR-004 license audit locks, and BR-005 suspensions.
4. **Financial Analyst (`usr-04`)**: Expense auditor tracking fuel consumption logs, toll expenditures, maintenance costs, and asset ROI yield.
5. **Admin (`usr-05`)**: Full system-wide access across all command towers and operational settings.

---

## 7. FINANCIAL ANALYTICS & ROI YIELD FORMULAS

### Fleet Utilization Rate Formula:
$$\text{Fleet Utilization Rate (\%)} = \left( \frac{\text{Vehicles Currently On Trip}}{\text{Total Fleet Assets}} \right) \times 100$$

### Commercial Asset Net ROI Yield Formula:
$$\text{Net ROI (\%)} = \left( \frac{\text{Total Trip Revenue Earned} - (\text{Fuel Cost} + \text{Maintenance Cost} + \text{Tolls})}{\text{Asset Acquisition Cost}} \right) \times 100$$

---

## 8. HACKATHON DEMO AUTOMATION RUNNER

For live presentation to judges, TransitOps includes interactive 1-click scenario controls in the dashboard command bar:
- **Dispatch Scenario (BR-009)**: Instantly dispatches a heavy freight trip from Kolkata to Siliguri and locks asset + driver to `On Trip`.
- **Workshop Lock (BR-012)**: Opens an Engine Inspection ticket for an available vehicle and locks asset to `In Shop`.
- **Simulate Expired License (BR-004)**: Sets a commercial driver license to expired, immediately activating the Critical Smart Alert Lock.
- **Reset Seed Data**: Restores pristine seed state in under 100ms.

---

## 9. CSV EXPORT SUITE & GLOBAL COMMAND PALETTE

- **Universal CSV Download**: Every operational module supports instant client-side CSV export (`transitops_vehicles.csv`, `transitops_drivers.csv`, `transitops_trips.csv`, `transitops_maintenance.csv`, `transitops_fuel_logs.csv`, `transitops_expenses.csv`).
- **Global Search (`CMD+K`)**: Instant command palette search across registration numbers, vehicle models, driver names, trip codes, and workshop tickets.

---

## 10. PRODUCTION BUILD & DEPLOYMENT VERIFICATION

TransitOps compiles cleanly under zero-error strict TypeScript checking:
```bash
npm run build
npm run start
```
All Phase 1.5 enterprise enhancements are verified for production deployment across Vercel, AWS Amplify, and Docker container environments.
