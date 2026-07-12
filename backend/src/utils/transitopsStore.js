/**
 * TransitOps In-Memory Transactional Fallback Store
 * Ensures 100% functional fallback during Supabase network errors or offline hackathon demo mode.
 */

export const transitopsStore = {
  users: [
    { id: 'u1', name: 'Aditya Banerjee', email: 'fleet@transitops.io', role: 'Fleet Manager' },
    { id: 'u2', name: 'Rohan Sengupta', email: 'dispatch@transitops.io', role: 'Dispatcher' },
    { id: 'u3', name: 'Priya Chatterjee', email: 'safety@transitops.io', role: 'Safety Officer' },
    { id: 'u4', name: 'Sneha Ghosh', email: 'finance@transitops.io', role: 'Financial Analyst' },
    { id: 'u5', name: 'Admin User', email: 'admin@transitops.io', role: 'Admin' }
  ],

  vehicles: [
    {
      id: '11111111-1111-1111-1111-111111111101',
      registration_number: 'WB-04-E-1042',
      vehicle_name: 'Tata Signo Heavy Hauler',
      vehicle_type: 'Heavy Truck',
      max_load_capacity: 15000,
      odometer: 45200,
      acquisition_cost: 3200000,
      status: 'Available',
      region: 'West Bengal',
      created_at: new Date().toISOString()
    },
    {
      id: '11111111-1111-1111-1111-111111111102',
      registration_number: 'WB-02-AB-8821',
      vehicle_name: 'Mahindra Bolero MaxiTruck',
      vehicle_type: 'Light Commercial',
      max_load_capacity: 1800,
      odometer: 18450,
      acquisition_cost: 850000,
      status: 'On Trip',
      region: 'West Bengal',
      created_at: new Date().toISOString()
    },
    {
      id: '11111111-1111-1111-1111-111111111103',
      registration_number: 'MH-12-Q-5510',
      vehicle_name: 'Ashok Leyland Ecomet',
      vehicle_type: 'Medium Truck',
      max_load_capacity: 7500,
      odometer: 89100,
      acquisition_cost: 2100000,
      status: 'Available',
      region: 'Maharashtra',
      created_at: new Date().toISOString()
    },
    {
      id: '11111111-1111-1111-1111-111111111104',
      registration_number: 'DL-01-C-9901',
      vehicle_name: 'BharatBenz 2823R',
      vehicle_type: 'Heavy Truck',
      max_load_capacity: 20000,
      odometer: 112000,
      acquisition_cost: 4100000,
      status: 'In Shop',
      region: 'Delhi NCR',
      created_at: new Date().toISOString()
    },
    {
      id: '11111111-1111-1111-1111-111111111105',
      registration_number: 'KA-03-HA-3312',
      vehicle_name: 'Eicher Pro 2049',
      vehicle_type: 'Light Commercial',
      max_load_capacity: 3500,
      odometer: 29800,
      acquisition_cost: 1250000,
      status: 'Available',
      region: 'Karnataka',
      created_at: new Date().toISOString()
    },
    {
      id: '11111111-1111-1111-1111-111111111106',
      registration_number: 'WB-19-K-7719',
      vehicle_name: 'Tata Prima 3530',
      vehicle_type: 'Heavy Truck',
      max_load_capacity: 25000,
      odometer: 240000,
      acquisition_cost: 4800000,
      status: 'Retired',
      region: 'West Bengal',
      created_at: new Date().toISOString()
    },
    {
      id: '11111111-1111-1111-1111-111111111107',
      registration_number: 'TN-09-DE-4411',
      vehicle_name: 'Mahindra Furio 14',
      vehicle_type: 'Medium Truck',
      max_load_capacity: 8500,
      odometer: 54000,
      acquisition_cost: 1950000,
      status: 'Available',
      region: 'Tamil Nadu',
      created_at: new Date().toISOString()
    }
  ],

  drivers: [
    {
      id: '22222222-2222-2222-2222-222222222201',
      name: 'Rajesh Sharma',
      license_number: 'DL-1420110012345',
      license_category: 'HMV (Heavy Motor Vehicle)',
      license_expiry_date: '2028-11-15',
      contact_number: '+91-9830112233',
      safety_score: 94.5,
      status: 'Available',
      created_at: new Date().toISOString()
    },
    {
      id: '22222222-2222-2222-2222-222222222202',
      name: 'Vikram Das',
      license_number: 'WB-0220160098765',
      license_category: 'LMV (Light Motor Vehicle)',
      license_expiry_date: '2027-08-20',
      contact_number: '+91-9163445566',
      safety_score: 91.0,
      status: 'On Trip',
      created_at: new Date().toISOString()
    },
    {
      id: '22222222-2222-2222-2222-222222222203',
      name: 'Subir Mukherjee',
      license_number: 'WB-0120150043210',
      license_category: 'HMV (Heavy Motor Vehicle)',
      license_expiry_date: '2029-05-10',
      contact_number: '+91-9831009988',
      safety_score: 88.0,
      status: 'Available',
      created_at: new Date().toISOString()
    },
    {
      id: '22222222-2222-2222-2222-222222222204',
      name: 'Manoj Yadav',
      license_number: 'UP-8020120055432',
      license_category: 'HMV (Heavy Motor Vehicle)',
      license_expiry_date: '2024-01-10',
      contact_number: '+91-9998887766',
      safety_score: 76.5,
      status: 'Available',
      created_at: new Date().toISOString()
    },
    {
      id: '22222222-2222-2222-2222-222222222205',
      name: 'Arunava Roy',
      license_number: 'WB-0420180066778',
      license_category: 'LMV (Light Motor Vehicle)',
      license_expiry_date: '2028-12-01',
      contact_number: '+91-9830223344',
      safety_score: 65.0,
      status: 'Suspended',
      created_at: new Date().toISOString()
    }
  ],

  trips: [
    {
      id: '33333333-3333-3333-3333-333333333301',
      trip_code: 'TRP-2026-001',
      source: 'Kolkata Port Hub',
      destination: 'Durgapur Industrial Center',
      vehicle_id: '11111111-1111-1111-1111-111111111102',
      driver_id: '22222222-2222-2222-2222-222222222202',
      cargo_weight: 1500,
      planned_distance: 175,
      actual_distance: null,
      planned_revenue: 28000,
      actual_revenue: null,
      fuel_consumed: null,
      start_odometer: 18275,
      end_odometer: null,
      status: 'Dispatched',
      created_at: new Date().toISOString()
    },
    {
      id: '33333333-3333-3333-3333-333333333302',
      trip_code: 'TRP-2026-002',
      source: 'Haldia Refinery Terminal',
      destination: 'Asansol Logistics Park',
      vehicle_id: '11111111-1111-1111-1111-111111111101',
      driver_id: '22222222-2222-2222-2222-222222222201',
      cargo_weight: 12000,
      planned_distance: 240,
      actual_distance: 245,
      planned_revenue: 65000,
      actual_revenue: 65000,
      fuel_consumed: 62,
      start_odometer: 44955,
      end_odometer: 45200,
      status: 'Completed',
      created_at: new Date().toISOString()
    },
    {
      id: '33333333-3333-3333-3333-333333333303',
      trip_code: 'TRP-2026-003',
      source: 'Siliguri Tea Terminal',
      destination: 'Kolkata Wholesale Hub',
      vehicle_id: '11111111-1111-1111-1111-111111111105',
      driver_id: '22222222-2222-2222-2222-222222222203',
      cargo_weight: 3000,
      planned_distance: 580,
      actual_distance: null,
      planned_revenue: 85000,
      actual_revenue: null,
      fuel_consumed: null,
      start_odometer: null,
      end_odometer: null,
      status: 'Draft',
      created_at: new Date().toISOString()
    }
  ],

  maintenance_logs: [
    {
      id: '44444444-4444-4444-4444-444444444401',
      vehicle_id: '11111111-1111-1111-1111-111111111104',
      maintenance_type: 'Engine & Transmission Overhaul',
      description: 'Routine 100k km inspection and transmission belt replacement.',
      cost: 45000,
      start_date: new Date().toISOString(),
      end_date: null,
      status: 'Open'
    },
    {
      id: '44444444-4444-4444-4444-444444444402',
      vehicle_id: '11111111-1111-1111-1111-111111111101',
      maintenance_type: 'Brake Pad Replacement',
      description: 'Front and rear air brakes service.',
      cost: 12500,
      start_date: new Date(Date.now() - 86400000 * 5).toISOString(),
      end_date: new Date(Date.now() - 86400000 * 3).toISOString(),
      status: 'Closed'
    }
  ],

  fuel_logs: [
    {
      id: '55555555-5555-5555-5555-555555555501',
      vehicle_id: '11111111-1111-1111-1111-111111111101',
      trip_id: '33333333-3333-3333-3333-333333333302',
      liters: 62,
      cost: 5890,
      fuel_station: 'IndianOil Highway Plaza NH-19',
      date: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: '55555555-5555-5555-5555-555555555502',
      vehicle_id: '11111111-1111-1111-1111-111111111102',
      trip_id: '33333333-3333-3333-3333-333333333301',
      liters: 35,
      cost: 3325,
      fuel_station: 'Bharat Petroleum Dankuni Hub',
      date: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ],

  expenses: [
    {
      id: '66666666-6666-6666-6666-666666666601',
      vehicle_id: '11111111-1111-1111-1111-111111111101',
      category: 'Fuel',
      amount: 5890,
      notes: 'Refueling for trip TRP-2026-002',
      expense_date: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: '66666666-6666-6666-6666-666666666602',
      vehicle_id: '11111111-1111-1111-1111-111111111101',
      category: 'Toll',
      amount: 1450,
      notes: 'NH-19 Toll Plaza Fees',
      expense_date: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: '66666666-6666-6666-6666-666666666603',
      vehicle_id: '11111111-1111-1111-1111-111111111104',
      category: 'Maintenance',
      amount: 45000,
      notes: 'Engine & Transmission Overhaul',
      expense_date: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
      id: '66666666-6666-6666-6666-666666666604',
      vehicle_id: '11111111-1111-1111-1111-111111111101',
      category: 'Insurance',
      amount: 38000,
      notes: 'Annual Comprehensive Commercial Policy',
      expense_date: new Date(Date.now() - 86400000 * 15).toISOString()
    }
  ]
}
