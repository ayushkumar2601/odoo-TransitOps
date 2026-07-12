# TransitOps 🚀🚚
### Smart Transport Operations Platform

<div align="center">
  
  ![Landing Page](./public/ss1.png)
  
  <p align="center">
    <strong>Centralized Fleet & Transport Operations Operating System</strong>
  </p>
  
  <p align="center">
    Digitizing the complete lifecycle of fleet assets, drivers, trip dispatching, workshop maintenance, fuel consumption, and financial ROI.
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
    <img src="https://img.shields.io/badge/RBAC-Multi--Role-8B5CF6?style=for-the-badge" alt="RBAC" />
  </p>

  <p align="center">
    <a href="#1-business-context">Business Context</a> •
    <a href="#2-target-users--role-based-access">Target Users</a> •
    <a href="#3-core-modules--features">Features</a> •
    <a href="#4-mandatory-business-rules">Business Rules</a> •
    <a href="#5-screenshots">Screenshots</a> •
    <a href="#6-getting-started">Getting Started</a>
  </p>

</div>

---

## 1. Business Context

Many logistics companies still rely on spreadsheets and manual logbooks to manage their transport operations. This often leads to scheduling conflicts, underutilized vehicles, missed maintenance, expired driver licenses, inaccurate expense tracking, and poor operational visibility.

**TransitOps** is built as a centralized platform that allows organizations to manage the complete lifecycle of their transport operations—from vehicle onboarding and driver compliance to dispatching, maintenance locking, fuel logging, and financial ROI analytics.

### 🌟 Key Highlights
- **Centralized Single Source of Truth (`lib/mock/`)**: Powered by a highly realistic Eastern India logistics dataset (25 commercial vehicles, 35 drivers, 50 trips, 120 fuel logs, 150 operational expenses) with zero broken external dependencies.
- **Enforced Business Rules Engine (BR-001 to BR-013)**: Hard programmatic validation preventing overloaded cargo, expired driver licenses, suspended personnel assignments, or dispatching vehicles currently in workshop maintenance.
- **Automatic Lifecycle State Transitions**: Dispatching a trip locks both vehicle and driver to `On Trip`; completing or cancelling restores them to `Available`. Opening a maintenance ticket locks the vehicle to `In Shop`.

---

## 2. Target Users & Role-Based Access Control (RBAC)

TransitOps implements secure Role-Based Access Control (RBAC) with tailored workspaces and navigation profiles for each operational role:

| Role | Key Responsibility | Allotted Operational Modules |
| :--- | :--- | :--- |
| **Fleet Manager** | Oversees fleet assets, maintenance, vehicle lifecycle, and operational efficiency. | Executive Control Tower, Vehicle Registry, Workshop Maintenance, BI Analytics |
| **Dispatcher** | Creates trips, assigns vehicles & drivers, validates cargo loads, and releases active dispatches. | Dispatch Command Room, Trip Lifecycle, Vehicle Readiness Pool, Driver Readiness Pool |
| **Safety Officer** | Ensures driver compliance, tracks license validity (BR-004), and monitors safety scores. | Safety & Compliance Tower, Driver Governance, License Audit Board |
| **Financial Analyst** | Reviews operational expenses, fuel consumption, workshop costs, and vehicle net ROI. | Financial & ROI Scorecard, Expense & Fuel Logging, BI Analytics |
| **Admin** | Full master oversight across all operational towers. | All modules and master views |

---

## 3. Core Modules & Features

### 3.1 Authentication & Role Switching
- Secure login portal with role-based credentials.
- Instant demo role switcher in `/signin` and via the bottom action bar on the sidebar.

### 3.2 Dynamic Role-Tailored Dashboards (`/dashboard`)
- **Executive Asset Control Tower (Fleet Manager)**: Displays the PRD Fleet Utilization Rate formula `(Vehicles On Trip / Total Active Fleet) × 100`, fleet status breakdown (`14 Available`, `6 On Trip`, `3 In Shop`, `2 Retired`), and live operations feed.
- **Dispatch Command Room (Dispatcher)**: Highlights the **BR-009 Action Queue** with one-click dispatch release directly from the dashboard.
- **Driver Compliance & Risk Audit Tower (Safety Officer)**: Tracks fleet average safety score (`90.2/100`), licenses expiring within 30 days, and locked personnel.
- **Financial Control & ROI Scorecard (Financial Analyst)**: Summarizes gross planned revenue, total fuel expenditure, workshop repair expenses, and top vehicle ROI rankings.

### 3.3 Vehicle Asset Registry (`/vehicles`)
- Master registry of 25 commercial vehicles with realistic Indian registration numbers (`WB-04-E-1042`, `WB-19-D-8891`, `JH-01-T-4412`, `OD-02-Q-1198`).
- Enforces **BR-001** unique registration verification on asset creation.
- Real-time status filtering: `Available`, `On Trip`, `In Shop`, `Retired`.

### 3.4 Driver Personnel Governance (`/drivers`)
- Roster of 35 drivers with safety scores ranging from **62–98** and Indian commercial licenses (`LMV`, `HMV`, `MCWG`, `Transport`).
- Highlights **4 licenses expiring within 30 days** and enforces **BR-004 / BR-005** locks on expired or suspended personnel.

### 3.5 Trip Dispatching & Haulage Lifecycle (`/trips`)
- Full lifecycle management across Eastern India logistics corridors (`Kolkata → Siliguri`, `Howrah → Ranchi`, `Asansol → Patna`, `Durgapur → Bhubaneswar`, `Kharagpur → Jamshedpur`).
- **BR-008 Cargo Validation**: Prevents trip creation if cargo weight exceeds the assigned vehicle's maximum load capacity.
- **Interactive Lifecycle Actions**: Draft → Dispatched (BR-009) → Completed (BR-010) / Cancelled (BR-011).

### 3.6 Workshop & Maintenance Control (`/maintenance`)
- Complete workshop ticket tracking across `Oil Change`, `Brake Service`, `Tyre Replacement`, `Engine Inspection`, `Transmission Service`, and `AC Repair`.
- **BR-012 Enforcement**: Opening a ticket automatically switches vehicle status to `In Shop` and removes it from dispatch pools.
- **BR-013 Enforcement**: Closing a ticket restores the asset to `Available`.

### 3.7 Fuel & Operational Expense Management (`/expenses`)
- Tracks **120 Fuel Logs** covering 6 months of corridor haulage at realistic diesel pricing (**₹88–₹98/L**).
- Tracks **150 Operational Expenses** across `Fuel`, `Maintenance`, `Toll`, `Parking`, `Insurance`, and `Other`.

### 3.8 BI Analytics & Financial ROI (`/analytics`)
- Dynamic Recharts visualizations for **6-Month Utilization Trend (%)** and **Fleet Status Distribution**.
- **Vehicle ROI Leaderboard Table**: Computes exact net yield per asset using:
  $$\text{Vehicle ROI (\%)} = \frac{\text{Revenue} - (\text{Fuel Cost} + \text{Maintenance Cost})}{\text{Acquisition Cost}} \times 100$$

---

## 4. Mandatory Business Rules (BR-001 to BR-013)

| Rule ID | Rule Name | Description & System Action |
| :--- | :--- | :--- |
| **BR-001** | **Unique Registration** | Every vehicle registration number must be strictly unique across the system. |
| **BR-002** | **Retired Vehicle Lock** | Vehicles marked `Retired` can never be assigned to or dispatched on any trip. |
| **BR-003** | **In Shop Vehicle Lock** | Vehicles currently undergoing maintenance (`In Shop`) cannot be selected for dispatch. |
| **BR-004** | **Expired License Lock** | Drivers with expired commercial driving licenses cannot be assigned to any trip. |
| **BR-005** | **Suspended Driver Lock** | Drivers marked `Suspended` are locked from active dispatch assignments. |
| **BR-006** | **Driver Single Assignment** | A driver already marked `On Trip` cannot be dispatched on a concurrent second trip. |
| **BR-007** | **Vehicle Single Assignment** | A vehicle already marked `On Trip` cannot be dispatched on a concurrent second trip. |
| **BR-008** | **Max Load Capacity Check** | Cargo weight ($kg$) must never exceed the assigned vehicle's `maxLoadCapacity`. |
| **BR-009** | **Dispatch Status Transition** | Dispatching a trip automatically transitions both Vehicle and Driver status to `On Trip`. |
| **BR-010** | **Trip Completion Transition** | Completing a trip restores both Vehicle and Driver status back to `Available`. |
| **BR-011** | **Trip Cancellation Transition** | Cancelling an active trip restores both Vehicle and Driver status back to `Available`. |
| **BR-012** | **Maintenance Open Lock** | Opening an active workshop record automatically switches Vehicle status to `In Shop`. |
| **BR-013** | **Maintenance Close Release** | Closing a workshop ticket automatically restores Vehicle status to `Available` (unless Retired). |

---

## 5. Example Workflow Walkthrough

1. **Step 1**: Register vehicle `WB-25-P-9001` (`Container Truck`) with a maximum load capacity of `18,000 kg`. Status initializes as `Available`.
2. **Step 2**: Verify driver `Rahul Sharma` (`HMV` commercial license valid till 2027, Safety Score `94/100`). Status = `Available`.
3. **Step 3**: Create a draft trip (`TRP-1078`) on the `Kolkata → Siliguri` corridor with Cargo Weight = `14,500 kg`.
4. **Step 4**: System validates that `14,500 kg ≤ 18,000 kg` (**BR-008 PASS**) and allows dispatch.
5. **Step 5**: Click **Dispatch (BR-009)**. Vehicle and Driver statuses automatically transition to `On Trip`.
6. **Step 6**: Click **Complete (BR-010)** after haulage arrival. System logs realized revenue and automatically restores Vehicle and Driver statuses to `Available`.
7. **Step 7**: Open a workshop ticket for `WB-25-P-9001` (`Engine Inspection`). Vehicle automatically transitions to `In Shop` (**BR-012**) and is locked from dispatch pools.
8. **Step 8**: BI Analytics update operational cost and net ROI dynamically based on all completed trips and fuel receipts.

---

## 6. Screenshots

<div align="center">

### 🏠 Landing & Command Overview
![Landing Page](./public/ss1.png)
*Modern transport operations command center with real-time operational telemetry*

### 📊 Role-Tailored Executive Dashboard
![Dashboard](./public/ss2.png)
*Role-specific dashboard displaying KPIs, utilization formulas, and live operations feed*

### 🚚 Fleet & Haulage Lifecycle Management
![Supply Chain](./public/ss3.png)
*Trip dispatching, route corridor allocation, and BR-008 cargo load verification*

### 📈 BI Analytics & Financial ROI Scorecard
![Analytics](./public/ss4.png)
*Recharts utilization charts and detailed Vehicle ROI Ranking Leaderboard*

</div>

---

## 7. Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** package manager

### 1️⃣ Clone & Setup
```bash
git clone https://github.com/ayushkumar2601/odoo-TransitOps.git
cd odoo-TransitOps

# Install dependencies
npm install
```

### 2️⃣ Run Development Server
```bash
npm run dev
```

The application will be live at **http://localhost:3000**.
Use the `/signin` portal to instantly test **Fleet Manager**, **Dispatcher**, **Safety Officer**, **Financial Analyst**, or **Admin** workspaces!

---

## 👨‍💻 Author

**Ayush Kumar**

- GitHub: [@ayushkumar2601](https://github.com/ayushkumar2601)
- Repository: [https://github.com/ayushkumar2601/odoo-TransitOps](https://github.com/ayushkumar2601/odoo-TransitOps)

---

<div align="center">
  <p>Built for the <strong>Odoo Hackathon 2026</strong></p>
  <p>⭐ Star this repository if you find TransitOps helpful!</p>
</div>
