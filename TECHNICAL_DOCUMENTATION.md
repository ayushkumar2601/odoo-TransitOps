# SmartLogistics — Complete Technical Documentation

> **Version**: 1.0.0  
> **Frameworks**: Next.js 16 (App Router) • React 19 • Express 5 • Supabase PostgreSQL • Google Gemini AI  
> **Architecture**: Distributed Full-Stack Logistics & Supply Chain Platform with Multi-Key AI Fallback & Graceful Offline Storage

---

## Table of Contents

1. [Executive Summary & Architectural Overview](#1-executive-summary--architectural-overview)
2. [Technology Stack](#2-technology-stack)
3. [Core Capabilities & Feature Breakdown](#3-core-capabilities--feature-breakdown)
4. [Complete Project Folder Structure](#4-complete-project-folder-structure)
5. [Database Schemas & Data Model (Supabase PostgreSQL)](#5-database-schemas--data-model-supabase-postgresql)
6. [Backend API Reference](#6-backend-api-reference)
7. [AI Engine & Resilience Architecture](#7-ai-engine--resilience-architecture)
8. [Environment & Configuration Guide](#8-environment--configuration-guide)
9. [Testing & Deployment Workflows](#9-testing--deployment-workflows)

---

## 1. Executive Summary & Architectural Overview

**SmartLogistics** is an end-to-end modern supply chain, shipment tracking, and logistics optimization platform. It combines a real-time reactive frontend built on **Next.js 16 / React 19** with a robust decoupled **Node.js / Express 5 API service** and **Supabase (PostgreSQL)** database.

### System Architecture Diagram

```mermaid
graph TD
    subgraph Client Layer [Next.js 16 Frontend - App Router]
        CustomerPortal["Public Tracking Portal (/logistics)"]
        SupplyChainPortal["Supply Chain Dashboard (/supply-chain)"]
        AdminDashboard["Admin & Operations Portal (/admin, /dashboard)"]
        UserDashboard["Client Portal (/user-dashboard)"]
    end

    subgraph API Layer [Express 5 REST API Server - :5001]
        ShipmentRoutes["/api/shipments"]
        EventRoutes["/api/events"]
        SupplyChainRoutes["/api/supply-chain"]
        StatsRoutes["/api/statistics"]
    end

    subgraph Intelligence & Integration Layer
        GeminiService["Gemini AI Router (5-Key Fallback + Round-Robin Cache)"]
        WeatherAPI["Real-Time WeatherAPI.com Client"]
    end

    subgraph Storage Layer [Data & Resilience]
        SupabaseDB[("Supabase PostgreSQL (RLS Enabled)")]
        FallbackStore["In-Memory Graceful Fallback Store (mockStore.js)"]
    end

    CustomerPortal <--> API Layer
    SupplyChainPortal <--> API Layer
    AdminDashboard <--> API Layer
    UserDashboard <--> API Layer

    SupplyChainRoutes <--> GeminiService
    SupplyChainRoutes <--> WeatherAPI

    API Layer <-->|Primary Read/Write| SupabaseDB
    API Layer <-->|Automatic Network Failure Fallback| FallbackStore
```

---

## 2. Technology Stack

### Frontend Ecosystem
- **Core Framework**: Next.js 16.2.0 (App Router), React 19, TypeScript 5.7.
- **Styling & Design System**: Tailwind CSS v4 (`@tailwindcss/postcss`), Glassmorphism UI tokens, CSS variables theme switching (`next-themes`).
- **Component Library**: Radix UI headless primitives (Dialog, Tabs, Dropdown Menu, Select, Hover Card, Scroll Area, Tooltip, Collapsible, Accordion).
- **Animation & Visuals**: Framer Motion 12.x, Tailwind Animate CSS, custom micro-interactions (`flip-card.tsx`, `glass-panel.tsx`).
- **Data Visualization**: Recharts 2.15 (performance metrics, delivery trends, risk distribution).
- **Icons & Notifications**: Lucide React icons, Sonner toast notifications, Vaul accessible bottom sheets/drawers.

### Backend Ecosystem
- **Runtime & Server**: Node.js v22+, Express 5.2 API architecture.
- **Database ORM/Client**: Supabase Client (`@supabase/supabase-js` v2.104+).
- **AI Integration**: Google Gemini Generative AI REST API (`generativelanguage.googleapis.com`) supporting multi-key rotation and multi-model fallback (`gemini-flash-latest`, `gemini-2.0-flash-lite`, `gemini-2.0-flash`, `gemini-2.5-flash`).
- **External Data**: Real-time Weather API integration (`api.weatherapi.com/v1`).
- **Validation & Utility**: Zod v3.24 schema validation, date-fns date formatting.

---

## 3. Core Capabilities & Feature Breakdown

### A. Real-Time Tracking & Shipment Lifecycle
- **End-to-End Traceability**: Unique 15-character tracking identifiers (e.g., `IND202604280001`).
- **Lifecycle Event Timeline**: Interactive step-by-step history tracking milestone events:
  - `CREATED` — Initial booking & dispatch preparation.
  - `PICKUP` — Package picked up from sender by field agent.
  - `HUB_SORT` — Processing and sorting at regional transit hub.
  - `TRANSIT` — Inter-city transport via highway/air freight.
  - `OUT_FOR_DELIVERY` — Last-mile dispatch with assigned courier.
  - `DELIVERED` — Verified recipient signature and geocoded confirmation.
- **Visual Route Mapping**: Interactive map visualization displaying origin, destination, transit hubs, and active shipment coordinates.

### B. AI-Powered Route Recommendation & Optimization
- **Intelligent Route Selector**: Evaluates weather conditions, traffic congestion, shipment weight, and priority level.
- **Real-Time Environmental Input**: Fetches live temperature, rainfall (`precip_mm`), wind speeds (`wind_kph`), and storm warnings for origin/destination hubs.
- **Multi-Factor Savings Calculation**:
  - **Time Saved**: Estimated hours reduced via alternative corridors.
  - **Cost Saved**: Projected fuel and operational savings (in INR ₹).
  - **Risk Reduction**: Percentage decrease in transit vulnerability.
  - **Confidence Score**: AI-computed reliability percentage (80%–99%).

### C. Predictive Risk Assessment
- **Dynamic Risk Scoring Algorithm**: Computes continuous risk scores (`0–100`) classified into `Low`, `Medium`, and `High` alert tiers.
- **Weighted Factor Analysis**:
  - Package weight index (heavy haulage vulnerability factor).
  - Transit stage exposure factor (in-transit vs. hub storage).
  - Simulated/Live weather and traffic hazard indices.

### D. Multi-Portal Enterprise Dashboards
1. **Public Logistics Tracker (`/logistics`)**: Searchable tracking interface for end-users.
2. **Supply Chain Control Tower (`/supply-chain`)**: High-level supply chain visibility, bottleneck alerts, route optimization modals, and fleet performance gauges.
3. **Admin Console (`/admin`, `/dashboard`)**: Full CRUD controls over shipments, manual event injection, driver assignment, and system status telemetry.
4. **Client Portal (`/user-dashboard`)**: Personalized overview of active shipments, billing summaries, and delivery alerts.

---

## 4. Complete Project Folder Structure

```text
Logistics/
├── app/                              # Next.js 16 App Router pages & layouts
│   ├── admin/                        # Admin operations center
│   ├── dashboard/                    # Overview dashboard route
│   ├── logistics/                    # Customer tracking & shipment lookup page
│   ├── signin/                       # Authentication sign-in flow
│   ├── signup/                       # User onboarding & registration
│   ├── supply-chain/                 # Supply chain control tower & AI optimization page
│   ├── user-dashboard/               # Client-facing personalized overview
│   ├── globals.css                   # Tailwind v4 directives & design tokens
│   ├── layout.tsx                    # Root application layout & theme provider
│   └── page.tsx                      # Landing & entry page
│
├── backend/                          # Decoupled Express 5 REST API Server
│   ├── migrations/                   # Supabase database migration scripts
│   │   └── 01_create_shipments.sql   # Shipment tables migration
│   ├── sql/                          # Schema & full seed scripts
│   │   ├── 01_create_shipments_schema.sql
│   │   ├── 01_shipments_schema.sql
│   │   ├── logistics-schema.sql
│   │   └── setup.sql                 # Comprehensive 300-line table + index + seed script
│   ├── src/
│   │   ├── config/                   # Database & third-party API configurations
│   │   │   └── supabase.js           # Supabase client & error classifier
│   │   ├── constants/                # Static assets & fallback objects
│   │   │   └── mockData.js           # 10+ Indian logistics seed datasets
│   │   ├── controllers/              # Request handling & business logic
│   │   │   ├── eventController.js    # Shipment tracking event handlers
│   │   │   ├── healthController.js   # System health probe
│   │   │   ├── shipmentController.js # CRUD handlers for shipments
│   │   │   ├── statisticsController.js # Aggregated analytics queries
│   │   │   └── supplyChainController.js # AI route & risk calculation logic
│   │   ├── middleware/               # HTTP middleware (CORS, error handlers)
│   │   ├── routes/                   # RESTful API route routers
│   │   │   ├── eventRoutes.js
│   │   │   ├── healthRoutes.js
│   │   │   ├── shipmentRoutes.js
│   │   │   ├── statisticsRoutes.js
│   │   │   └── supplyChainRoutes.js
│   │   ├── services/                 # External service integrations
│   │   │   └── geminiService.js      # Multi-key Gemini AI integration + caching
│   │   ├── utils/                    # Shared helper libraries
│   │   │   ├── location.js           # Geocoding & address parser helpers
│   │   │   └── mockStore.js          # In-memory CRUD fallback store
│   │   └── app.js                    # Express application setup
│   ├── server.js                     # HTTP server entry point (Port 5001)
│   └── package.json                  # Backend dependencies
│
├── components/                       # Reusable React UI & visualization modules
│   ├── admin-sidebar.tsx             # Admin navigation sidebar
│   ├── admin-top-bar.tsx             # Admin header & user menu
│   ├── alerts-card.tsx               # Real-time alert feed component
│   ├── flip-card.tsx                 # Interactive 3D flip card component
│   ├── glass-panel.tsx               # Glassmorphic container wrapper
│   ├── loading-spinner.tsx           # Accessible loading indicator
│   ├── map-background.tsx            # Interactive geospatial canvas
│   ├── optimize-modal.tsx            # AI Route recommendation modal
│   ├── performance-ring.tsx          # Circular KPI progress visualizer
│   ├── route-map.tsx                 # Shipment path vector renderer
│   ├── route-visualization.tsx       # Multi-stop route diagram
│   ├── shipment-card.tsx             # Shipment summary card
│   ├── sidebar.tsx                   # Main navigation drawer
│   ├── stat-card.tsx                 # Key Metric display block
│   ├── tracking-timeline.tsx         # Milestone progression component
│   └── ui/                           # Radix UI design system primitives
│
├── lib/                              # Shared frontend utilities & types
│   ├── data.ts                       # Frontend static/fallback datasets
│   ├── types.ts                      # TypeScript interfaces & API response contracts
│   └── utils.ts                      # Tailwind merge & className helpers
│
├── public/                           # Static public web assets
├── test_api.sh                       # End-to-end API test suite script
├── test_frontend.sh                  # Frontend build & route verification script
└── package.json                      # Frontend project dependencies
```

---

## 5. Database Schemas & Data Model (Supabase PostgreSQL)

The platform uses PostgreSQL hosted on **Supabase** with **Row Level Security (RLS)** and cascade deletion integrity.

### Entity Relationship Model

```text
+------------------------------------+          +------------------------------------+
|             SHIPMENTS              |          |          SHIPMENT_EVENTS           |
+------------------------------------+          +------------------------------------+
| PK  id                 UUID        |<--+      | PK  id                 UUID        |
| UQ  tracking_id        VARCHAR(30) |   +------| FK  shipment_id        UUID        |
|     sender_name        VARCHAR(255)|          |     status             VARCHAR(50) |
|     sender_phone       VARCHAR(20) |          |     location           VARCHAR(255)|
|     sender_address     TEXT        |          |     latitude           DECIMAL     |
|     sender_city        VARCHAR(100)|          |     longitude          DECIMAL     |
|     sender_pincode     VARCHAR(10) |          |     event_type         VARCHAR(100)|
|     receiver_name      VARCHAR(255)|          |     description        TEXT        |
|     receiver_phone     VARCHAR(20) |          |     agent_name         VARCHAR(255)|
|     receiver_address   TEXT        |          |     occurred_at        TIMESTAMPTZ |
|     receiver_city      VARCHAR(100)|          |     created_at         TIMESTAMPTZ |
|     receiver_pincode   VARCHAR(10) |          +------------------------------------+
|     package_type       VARCHAR(100)|
|     weight             DECIMAL     |
|     value              DECIMAL     |
|     status             VARCHAR(50) |
|     current_location   VARCHAR(255)|
|     current_lat        DECIMAL     |
|     current_lng        DECIMAL     |
|     assigned_agent     VARCHAR(255)|
|     vehicle_number     VARCHAR(50) |
|     vehicle_type       VARCHAR(50) |
|     estimated_delivery TIMESTAMPTZ |
|     actual_delivery    TIMESTAMPTZ |
|     created_at         TIMESTAMPTZ |
|     updated_at         TIMESTAMPTZ |
+------------------------------------+
```

### 1. Table: `shipments`

Stores primary shipment metadata, sender/receiver addresses, cargo specifications, and active driver assignment.

```sql
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id VARCHAR(30) UNIQUE NOT NULL,

  -- Sender Information
  sender_name VARCHAR(255) NOT NULL,
  sender_phone VARCHAR(20) NOT NULL,
  sender_address TEXT NOT NULL,
  sender_city VARCHAR(100),
  sender_pincode VARCHAR(10) NOT NULL,

  -- Receiver Information
  receiver_name VARCHAR(255) NOT NULL,
  receiver_phone VARCHAR(20) NOT NULL,
  receiver_address TEXT NOT NULL,
  receiver_city VARCHAR(100),
  receiver_pincode VARCHAR(10) NOT NULL,

  -- Package Details
  package_type VARCHAR(100) NOT NULL,
  weight DECIMAL(10,2) NOT NULL,
  value DECIMAL(12,2),
  description TEXT,

  -- Tracking State
  status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  current_location VARCHAR(255),
  current_lat DECIMAL(10,8),
  current_lng DECIMAL(11,8),

  -- Fleet Assignment
  assigned_agent VARCHAR(255),
  vehicle_number VARCHAR(50),
  vehicle_type VARCHAR(50),

  -- Timestamps
  estimated_delivery TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_delivery TIMESTAMP WITH TIME ZONE,
  pickup_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Table: `shipment_events`

Tracks chronological milestone updates and geolocation pings for each shipment.

```sql
CREATE TABLE shipment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  event_type VARCHAR(100),
  description TEXT,
  agent_name VARCHAR(255),
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Database Indexes & Row Level Security (RLS)

```sql
-- Performance Indexes
CREATE INDEX idx_shipments_tracking_id ON shipments(tracking_id);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_created_at ON shipments(created_at DESC);
CREATE INDEX idx_shipments_sender_city ON shipments(sender_city);
CREATE INDEX idx_shipments_receiver_city ON shipments(receiver_city);
CREATE INDEX idx_events_shipment_id ON shipment_events(shipment_id);
CREATE INDEX idx_events_occurred_at ON shipment_events(occurred_at DESC);

-- Row Level Security
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_shipments" ON shipments FOR SELECT USING (true);
CREATE POLICY "public_insert_shipments" ON shipments FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_shipments" ON shipments FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "public_delete_shipments" ON shipments FOR DELETE USING (true);
```

---

## 6. Backend API Reference

All backend endpoints are prefixed with `/api` and hosted by default on `http://localhost:5001`.

| HTTP Method | Endpoint Path | Description | Response Payload Summary |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Service diagnostic health check | `{ status: "healthy", timestamp: ISOString }` |
| **GET** | `/api/shipments` | List shipments (supports query filters) | `{ success: true, data: Shipment[] }` |
| **GET** | `/api/shipments/:id` | Get details for ID or `tracking_id` | `{ success: true, data: ShipmentWithEvents }` |
| **POST** | `/api/shipments` | Create new shipment record | `{ success: true, data: CreatedShipment }` |
| **PUT** | `/api/shipments/:id` | Update shipment details / status | `{ success: true, data: UpdatedShipment }` |
| **DELETE** | `/api/shipments/:id` | Permanently remove shipment | `{ success: true, message: "Deleted" }` |
| **GET** | `/api/events/shipment/:id` | Get tracking history timeline | `{ success: true, data: ShipmentEvent[] }` |
| **POST** | `/api/events` | Create new tracking milestone event | `{ success: true, data: CreatedEvent }` |
| **GET** | `/api/statistics` | Aggregate operations summary | `{ totalShipments, activeDeliveries, deliveredCount }` |
| **GET** | `/api/supply-chain/shipments` | Supply chain formatted shipments | `{ success: true, data: SupplyChainShipment[] }` |
| **GET** | `/api/supply-chain/risk/:id` | Calculate risk score & hazard index | `{ riskScore, riskLevel, weatherImpact, trafficImpact }` |
| **GET** | `/api/supply-chain/optimize/:id` | Heuristic route optimization metrics | `{ timeSaved, costSaved, riskReduction, distance }` |
| **GET** | `/api/supply-chain/ai-route/:id` | Gemini AI route recommendation | `{ recommendedRoute, explanation, weather, confidence }` |

---

## 7. AI Engine & Resilience Architecture

### Multi-Key & Multi-Model Gemini Fallback System (`geminiService.js`)
To guarantee 99.9% uptime during rate-limiting (`429 Quota Exceeded`), API errors, or latency spikes, the system employs an enterprise-grade AI resilience architecture:

1. **5-Key Round-Robin & Cooldown Engine**:
   - Accepts up to 5 individual API keys (`GEMINI_API_KEY_1` through `GEMINI_API_KEY_5`).
   - If a key triggers a rate limit or HTTP `429/403`, that key is placed on a temporary **10-minute cooldown** while the system automatically advances round-robin to the next available key.
2. **Model Priority Hierarchy**:
   - For every key attempt, the service iterates through models in order of speed and stability:
     1. `gemini-flash-latest`
     2. `gemini-2.0-flash-lite`
     3. `gemini-2.0-flash`
     4. `gemini-2.5-flash`
3. **In-Memory Caching (`CACHE_TTL_MS`)**:
   - Responses are cached by a deterministic SHA-like prompt hash for 10 minutes to eliminate redundant API calls for identical origin-destination corridors.
4. **Heuristic Rule-Based Fallback**:
   - If all API keys are exhausted or network connectivity drops completely, a structured heuristic fallback engine generates realistic, weather-aware JSON recommendations seamlessly.

### Automatic Database Graceful Fallback (`mockStore.js`)
When Supabase credentials are missing or database connection timeouts occur (`isNetworkError`), controllers transparently switch to an in-memory transactional store seeded with realistic Indian logistics routes (`Mumbai`, `Delhi`, `Hyderabad`, `Bangalore`, `Chennai`, `Kolkata`).

---

## 8. Environment & Configuration Guide

### Backend Environment File (`backend/.env`)

```ini
# Server Configuration
PORT=5001

# Supabase Database Configuration
SUPABASE_URL=https://your-supabase-id.supabase.co
SUPABASE_KEY=your-supabase-anon-or-service-role-key

# Google Gemini AI Keys (Supports 5-Key Failover)
GEMINI_API_KEY=your_primary_gemini_key
GEMINI_API_KEY_1=your_gemini_key_1
GEMINI_API_KEY_2=your_gemini_key_2
GEMINI_API_KEY_3=your_gemini_key_3
GEMINI_API_KEY_4=your_gemini_key_4
GEMINI_API_KEY_5=your_gemini_key_5

# Real-Time Weather Integration
WEATHER_API_KEY=your_weatherapi_com_key
```

### Frontend Environment File (`.env.local`)

```ini
# Next.js API Base URL targeting Express Server
NEXT_PUBLIC_API_URL=http://localhost:5001
```

---

## 9. Testing & Deployment Workflows

### Running Locally

1. **Start Backend API Server**:
   ```bash
   cd backend
   npm install
   npm run dev
   # API running at http://localhost:5001
   ```
2. **Start Next.js Frontend**:
   ```bash
   # From workspace root
   npm install
   npm run dev
   # Web App running at http://localhost:3000
   ```

### Automated Verification Scripts

- **Backend Integration Test Suite**:
  ```bash
  chmod +x test_api.sh
  ./test_api.sh
  ```
  Runs complete CRUD checks against health, shipment creation, event insertion, supply chain statistics, and AI routes.
- **Frontend Build Verification**:
  ```bash
  chmod +x test_frontend.sh
  ./test_frontend.sh
  ```
  Validates Next.js compilation, TypeScript types, and page routes.
