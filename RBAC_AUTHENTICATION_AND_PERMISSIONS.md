# TransitOps — Role-Based Access Control (RBAC), Authentication & Permissions Guide

**Platform Version:** 1.6.0-PROD  
**Document Classification:** System Security & Access Architecture  
**Author:** Ayush Kumar  

---

## 1. Executive Summary

TransitOps enforces a strict **Role-Based Access Control (RBAC)** architecture that governs user authentication, navigation visibility, and capability authorization across all enterprise transport operations modules.

Every user logs in with an explicit organizational role that determines their operational perimeter—preventing unauthorized dispatching, financial exposure, or compliance bypasses.

---

## 2. Authentication & Instant Role Switching

### 2.1 Login Credentials & Quick-Select Cards (`app/signin/page.tsx`)
For demonstration, audit, and rapid testing during operations, the platform provides **instant role credentials** on the authentication portal (`/signin`):

| Role | Default Email | Password | Primary Color Badge | Scope Description |
| :--- | :--- | :--- | :--- | :--- |
| **Fleet Manager** | `fleet@transitops.io` | `transit2026` | Emerald (`bg-emerald-500/10`) | Complete operational & asset oversight |
| **Dispatcher** | `dispatch@transitops.io` | `transit2026` | Blue (`bg-blue-500/10`) | Haulage trip planning & route dispatching |
| **Safety Officer** | `safety@transitops.io` | `transit2026` | Amber (`bg-amber-500/10`) | Statutory compliance, DL audits & audit log |
| **Financial Analyst** | `finance@transitops.io` | `transit2026` | Purple (`bg-purple-500/10`) | Fleet ROI, fuel vouchers & revenue yield |
| **Driver** | `driver@transitops.io` | `transit2026` | Rose (`bg-rose-500/10`) | Scoped field operator portal & trip execution |

### 2.2 Client-Side Persistent Session State
Upon authentication, the user session is stored securely in browser `localStorage`:
```json
{
  "user_email": "fleet@transitops.io",
  "user_name": "Aditya Banerjee",
  "user_role": "Fleet Manager"
}
```
* **Driver Routing Logic**: When authenticated as `Driver`, the platform automatically routes the operator directly to the scoped `/driver-portal` rather than the administrative dashboard.

---

## 3. Module Access & Navigation Matrix (`components/sidebar.tsx`)

The navigation sidebar dynamically filters visible modules based on the authenticated user's role:

| Module / Page Route | Fleet Manager | Dispatcher | Safety Officer | Financial Analyst | Driver | Admin |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Dashboard (`/dashboard`)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Vehicles Registry (`/vehicles`)** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Vehicle Documents (`/vehicle-documents`)** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Driver Governance (`/drivers`)** | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Driver Scoped Portal (`/driver-portal`)** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Trip Dispatching (`/trips`)** | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Workshop & Maintenance (`/maintenance`)** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Fuel & Expenses (`/expenses`)** | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Email Reminders (`/emails`)** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **BI Analytics & ROI (`/analytics`)** | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Enterprise Audit Log (`/audit-log`)** | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |

---

## 4. Role-Specific Capabilities & Business Rule Permissions

### 🧑‍💼 4.1 Fleet Manager (`Fleet Manager`)
* **Core Mandate:** Total operational management of fleet assets, driver governance, maintenance scheduling, and business rules.
* **Exclusive Capabilities:**
  * Register new vehicles (`BR-001` unique registration check) in `app/vehicles/page.tsx`.
  * Upload compliance documents (RC, Insurance, PUC, Fitness, Permit) in `app/vehicle-documents/page.tsx`.
  * Send vehicles to Workshop (`BR-012` Maintenance Lockout enforcement) in `app/maintenance/page.tsx`.
  * Perform batch CSV ingestion across Vehicles, Drivers, and Trips (`components/csv-import-modal.tsx`).
  * Access full immutable system audit logs (`app/audit-log/page.tsx`).

---

### 🚛 4.2 Dispatcher (`Dispatcher`)
* **Core Mandate:** Freight assignment, route corridor optimization, and haulage trip execution.
* **Exclusive Capabilities:**
  * Create and dispatch haulage trips (`app/trips/page.tsx`).
  * Enforce **BR-004 License Expiry Lockout** (blocked from selecting drivers whose commercial DL is expired).
  * Enforce **BR-009 Vehicle Load Capacity Verification** (blocked from dispatching cargo exceeding vehicle max capacity).
  * View active vehicle documents and compliance email reminders.

---

### 🛡️ 4.3 Safety Officer (`Safety Officer`)
* **Core Mandate:** Statutory compliance oversight, driver safety audits, and regulatory inspection.
* **Exclusive Capabilities:**
  * Audit driver safety scores and medical fitness certificates (`app/drivers/page.tsx`).
  * Inspect tamper-proof enterprise audit log ledger (`app/audit-log/page.tsx`).
  * Trigger compliance alerts and inspect outbound email reminder payloads (`app/emails/page.tsx`).
  * Review vehicle document expiries across Eastern India corridors (`app/vehicle-documents/page.tsx`).

---

### 📊 4.4 Financial Analyst (`Financial Analyst`)
* **Core Mandate:** Fleet profitability, fuel expense auditing, asset depreciation, and yield management.
* **Exclusive Capabilities:**
  * Full access to BI Analytics & ROI dashboards (`app/analytics/page.tsx`).
  * Audit fuel logs, refill stations, and expense vouchers (`app/expenses/page.tsx`).
  * Review freight revenue yields per corridor and asset acquisition costs.
  * Restricted from modifying driver statuses or trip dispatching queues.

---

### 🧑‍✈️ 4.5 Driver (`Driver`)
* **Core Mandate:** Commercial heavy vehicle execution and live field telemetry updates.
* **Exclusive Capabilities:**
  * Access dedicated **Driver Operations Portal (`/driver-portal`)**.
  * View personal assigned vehicle asset details, safety scorecard (out of 100), and DL validity.
  * Progress assigned haulage trips (`Start Transit` → `Confirm Delivery`).
  * Restricted from viewing fleet registry, financial ROI, or other driver records.

---

## 5. Security & Business Rule Enforcement Summary

1. **BR-004 (License Governance):** Expired drivers are locked out of the dispatching selection dropdown across all roles.
2. **BR-007 & BR-012 (Maintenance Lockout):** Vehicles marked `In Shop` cannot be selected for haulage trips by any Dispatcher or Fleet Manager.
3. **Immutable Audit Ledger:** All critical RBAC and business rule actions are automatically written to `transitops_audit_logs_v1_6` and visible only to `Fleet Manager`, `Safety Officer`, and `Admin`.
