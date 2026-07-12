-- ============================================================
-- TransitOps Phase 1 — Complete Database Schema & Seed Data
-- Odoo x Adamas University Hackathon 2026
-- ============================================================

-- Drop tables if they exist for clean migration
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS fuel_logs CASCADE;
DROP TABLE IF EXISTS maintenance_logs CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ─── 1. users table ──────────────────────────────────────────
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst', 'Admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── 2. vehicles table ───────────────────────────────────────
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_number VARCHAR(50) UNIQUE NOT NULL,
  vehicle_name VARCHAR(255) NOT NULL,
  vehicle_type VARCHAR(100) NOT NULL,
  max_load_capacity DECIMAL(10,2) NOT NULL,
  odometer DECIMAL(12,2) NOT NULL DEFAULT 0,
  acquisition_cost DECIMAL(14,2) NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'On Trip', 'In Shop', 'Retired')),
  region VARCHAR(100) NOT NULL DEFAULT 'West Bengal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── 3. drivers table ────────────────────────────────────────
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  license_number VARCHAR(100) UNIQUE NOT NULL,
  license_category VARCHAR(50) NOT NULL,
  license_expiry_date DATE NOT NULL,
  contact_number VARCHAR(25) NOT NULL,
  safety_score DECIMAL(5,2) NOT NULL DEFAULT 90.0,
  status VARCHAR(50) NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'On Trip', 'Off Duty', 'Suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── 4. trips table ──────────────────────────────────────────
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_code VARCHAR(50) UNIQUE NOT NULL,
  source VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE RESTRICT,
  cargo_weight DECIMAL(10,2) NOT NULL,
  planned_distance DECIMAL(10,2) NOT NULL,
  actual_distance DECIMAL(10,2),
  planned_revenue DECIMAL(12,2) NOT NULL DEFAULT 0,
  actual_revenue DECIMAL(12,2),
  fuel_consumed DECIMAL(10,2),
  start_odometer DECIMAL(12,2),
  end_odometer DECIMAL(12,2),
  status VARCHAR(50) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Dispatched', 'Completed', 'Cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── 5. maintenance_logs table ───────────────────────────────
CREATE TABLE maintenance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  maintenance_type VARCHAR(100) NOT NULL,
  description TEXT,
  cost DECIMAL(12,2) NOT NULL DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── 6. fuel_logs table ──────────────────────────────────────
CREATE TABLE fuel_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  liters DECIMAL(10,2) NOT NULL,
  cost DECIMAL(12,2) NOT NULL,
  fuel_station VARCHAR(255) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── 7. expenses table ───────────────────────────────────────
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Fuel', 'Maintenance', 'Toll', 'Parking', 'Insurance', 'Other')),
  amount DECIMAL(12,2) NOT NULL,
  notes TEXT,
  expense_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── Indexes ──────────────────────────────────────────────────
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_registration ON vehicles(registration_number);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_vehicle_id ON trips(vehicle_id);
CREATE INDEX idx_trips_driver_id ON trips(driver_id);
CREATE INDEX idx_maintenance_vehicle_id ON maintenance_logs(vehicle_id);
CREATE INDEX idx_fuel_vehicle_id ON fuel_logs(vehicle_id);
CREATE INDEX idx_expenses_vehicle_id ON expenses(vehicle_id);

-- ─── Row Level Security (RLS) ─────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_all_users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_vehicles" ON vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_drivers" ON drivers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_trips" ON trips FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_maintenance" ON maintenance_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_fuel" ON fuel_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_expenses" ON expenses FOR ALL USING (true) WITH CHECK (true);

-- ─── Seed Data: Users ────────────────────────────────────────
INSERT INTO users (name, email, password_hash, role) VALUES
('Aditya Banerjee', 'fleet@transitops.io', '$2b$10$demoHashForHackathonPass', 'Fleet Manager'),
('Rohan Sengupta', 'dispatch@transitops.io', '$2b$10$demoHashForHackathonPass', 'Dispatcher'),
('Priya Chatterjee', 'safety@transitops.io', '$2b$10$demoHashForHackathonPass', 'Safety Officer'),
('Sneha Ghosh', 'finance@transitops.io', '$2b$10$demoHashForHackathonPass', 'Financial Analyst');

-- ─── Seed Data: Vehicles ─────────────────────────────────────
INSERT INTO vehicles (id, registration_number, vehicle_name, vehicle_type, max_load_capacity, odometer, acquisition_cost, status, region) VALUES
('11111111-1111-1111-1111-111111111101', 'WB-04-E-1042', 'Tata Signo Heavy Hauler', 'Heavy Truck', 15000.00, 45200.00, 3200000.00, 'Available', 'West Bengal'),
('11111111-1111-1111-1111-111111111102', 'WB-02-AB-8821', 'Mahindra Bolero MaxiTruck', 'Light Commercial', 1800.00, 18450.00, 850000.00, 'On Trip', 'West Bengal'),
('11111111-1111-1111-1111-111111111103', 'MH-12-Q-5510', 'Ashok Leyland Ecomet', 'Medium Truck', 7500.00, 89100.00, 2100000.00, 'Available', 'Maharashtra'),
('11111111-1111-1111-1111-111111111104', 'DL-01-C-9901', 'BharatBenz 2823R', 'Heavy Truck', 20000.00, 112000.00, 4100000.00, 'In Shop', 'Delhi NCR'),
('11111111-1111-1111-1111-111111111105', 'KA-03-HA-3312', 'Eicher Pro 2049', 'Light Commercial', 3500.00, 29800.00, 1250000.00, 'Available', 'Karnataka'),
('11111111-1111-1111-1111-111111111106', 'WB-19-K-7719', 'Tata Prima 3530', 'Heavy Truck', 25000.00, 240000.00, 4800000.00, 'Retired', 'West Bengal'),
('11111111-1111-1111-1111-111111111107', 'TN-09-DE-4411', 'Mahindra Furio 14', 'Medium Truck', 8500.00, 54000.00, 1950000.00, 'Available', 'Tamil Nadu');

-- ─── Seed Data: Drivers ──────────────────────────────────────
INSERT INTO drivers (id, name, license_number, license_category, license_expiry_date, contact_number, safety_score, status) VALUES
('22222222-2222-2222-2222-222222222201', 'Rajesh Sharma', 'DL-1420110012345', 'HMV (Heavy Motor Vehicle)', '2028-11-15', '+91-9830112233', 94.5, 'Available'),
('22222222-2222-2222-2222-222222222202', 'Vikram Das', 'WB-0220160098765', 'LMV (Light Motor Vehicle)', '2027-08-20', '+91-9163445566', 91.0, 'On Trip'),
('22222222-2222-2222-2222-222222222203', 'Subir Mukherjee', 'WB-0120150043210', 'HMV (Heavy Motor Vehicle)', '2029-05-10', '+91-9831009988', 88.0, 'Available'),
('22222222-2222-2222-2222-222222222204', 'Manoj Yadav', 'UP-8020120055432', 'HMV (Heavy Motor Vehicle)', '2024-01-10', '+91-9998887766', 76.5, 'Available'),
('22222222-2222-2222-2222-222222222205', 'Arunava Roy', 'WB-0420180066778', 'LMV (Light Motor Vehicle)', '2028-12-01', '+91-9830223344', 65.0, 'Suspended');

-- ─── Seed Data: Trips ────────────────────────────────────────
INSERT INTO trips (id, trip_code, source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, actual_distance, planned_revenue, actual_revenue, fuel_consumed, start_odometer, end_odometer, status) VALUES
('33333333-3333-3333-3333-333333333301', 'TRP-2026-001', 'Kolkata Port Hub', 'Durgapur Industrial Center', '11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222202', 1500.00, 175.00, NULL, 28000.00, NULL, NULL, 18275.00, NULL, 'Dispatched'),
('33333333-3333-3333-3333-333333333302', 'TRP-2026-002', 'Haldia Refinery Terminal', 'Asansol Logistics Park', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201', 12000.00, 240.00, 245.00, 65000.00, 65000.00, 62.00, 44955.00, 45200.00, 'Completed'),
('33333333-3333-3333-3333-333333333303', 'TRP-2026-003', 'Siliguri Tea Terminal', 'Kolkata Wholesale Hub', '11111111-1111-1111-1111-111111111105', '22222222-2222-2222-2222-222222222203', 3000.00, 580.00, NULL, 85000.00, NULL, NULL, NULL, NULL, 'Draft');

-- ─── Seed Data: Maintenance Logs ─────────────────────────────
INSERT INTO maintenance_logs (id, vehicle_id, maintenance_type, description, cost, status) VALUES
('44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111104', 'Engine & Transmission Overhaul', 'Routine 100k km inspection and transmission belt replacement.', 45000.00, 'Open'),
('44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111101', 'Brake Pad Replacement', 'Front and rear air brakes service.', 12500.00, 'Closed');

-- ─── Seed Data: Fuel Logs ────────────────────────────────────
INSERT INTO fuel_logs (id, vehicle_id, trip_id, liters, cost, fuel_station, date) VALUES
('55555555-5555-5555-5555-555555555501', '11111111-1111-1111-1111-111111111101', '33333333-3333-3333-3333-333333333302', 62.00, 5890.00, 'IndianOil Highway Plaza NH-19', NOW() - INTERVAL '2 days'),
('55555555-5555-5555-5555-555555555502', '11111111-1111-1111-1111-111111111102', '33333333-3333-3333-3333-333333333301', 35.00, 3325.00, 'Bharat Petroleum Dankuni Hub', NOW() - INTERVAL '1 day');

-- ─── Seed Data: Expenses ─────────────────────────────────────
INSERT INTO expenses (id, vehicle_id, category, amount, notes, expense_date) VALUES
('66666666-6666-6666-6666-666666666601', '11111111-1111-1111-1111-111111111101', 'Fuel', 5890.00, 'Refueling for trip TRP-2026-002', NOW() - INTERVAL '2 days'),
('66666666-6666-6666-6666-666666666602', '11111111-1111-1111-1111-111111111101', 'Toll', 1450.00, 'NH-19 Toll Plaza Fees', NOW() - INTERVAL '2 days'),
('66666666-6666-6666-6666-666666666603', '11111111-1111-1111-1111-111111111104', 'Maintenance', 45000.00, 'Engine & Transmission Overhaul', NOW() - INTERVAL '1 day'),
('66666666-6666-6666-6666-666666666604', '11111111-1111-1111-1111-111111111101', 'Insurance', 38000.00, 'Annual Comprehensive Commercial Policy', NOW() - INTERVAL '15 days');
