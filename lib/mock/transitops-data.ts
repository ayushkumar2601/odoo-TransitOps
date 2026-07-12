export interface Vehicle {
  id: string
  registrationNumber: string
  vehicleName: string
  vehicleType: 'Mini Truck' | 'Light Commercial Vehicle' | 'Container Truck' | 'Refrigerated Truck' | 'Pickup Van'
  maxLoadCapacity: number
  odometer: number
  acquisitionCost: number
  purchaseDate: string
  fuelEfficiency: number
  status: 'Available' | 'On Trip' | 'In Shop' | 'Retired'
  region: string
}

export interface Driver {
  id: string
  name: string
  licenseNumber: string
  licenseCategory: 'LMV' | 'HMV' | 'MCWG' | 'Transport'
  expiryDate: string
  contactNumber: string
  safetyScore: number
  totalTrips: number
  status: 'Available' | 'On Trip' | 'Off Duty' | 'Suspended'
}

export interface Trip {
  id: string
  tripCode: string
  source: string
  destination: string
  vehicleId: string
  driverId: string
  cargoWeight: number
  plannedDistance: number
  actualDistance?: number
  fuelConsumed?: number
  plannedRevenue: number
  actualRevenue?: number
  status: 'Draft' | 'Dispatched' | 'Completed' | 'Cancelled'
  dispatchDate?: string
  completionDate?: string
}

export interface MaintenanceRecord {
  id: string
  vehicleId: string
  maintenanceType: 'Oil Change' | 'Brake Service' | 'Tyre Replacement' | 'Engine Inspection' | 'Transmission Service' | 'AC Repair'
  description: string
  cost: number
  startDate: string
  endDate?: string
  status: 'Open' | 'Closed'
}

export interface FuelLog {
  id: string
  vehicleId: string
  tripId?: string
  liters: number
  cost: number
  station: string
  date: string
}

export interface Expense {
  id: string
  vehicleId: string
  category: 'Fuel' | 'Maintenance' | 'Toll' | 'Parking' | 'Insurance' | 'Other'
  amount: number
  notes: string
  date: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'Fleet Manager' | 'Dispatcher' | 'Safety Officer' | 'Financial Analyst' | 'Admin'
  avatar?: string
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  timestamp: string
  type: 'info' | 'warning' | 'alert' | 'success'
}

// ============================================================================
// 1. VEHICLES (25 Total: 14 Available, 6 On Trip, 3 In Shop, 2 Retired)
// ============================================================================
export const vehicles: Vehicle[] = [
  // 6 On Trip
  { id: 'veh-01', registrationNumber: 'WB-04-E-1042', vehicleName: 'Tata Prima 2830.K', vehicleType: 'Container Truck', maxLoadCapacity: 18000, odometer: 112400, acquisitionCost: 3800000, purchaseDate: '2023-01-15', fuelEfficiency: 3.8, status: 'On Trip', region: 'Kolkata' },
  { id: 'veh-02', registrationNumber: 'WB-19-D-8891', vehicleName: 'Ashok Leyland Ecomet 1615', vehicleType: 'Refrigerated Truck', maxLoadCapacity: 11000, odometer: 89300, acquisitionCost: 2900000, purchaseDate: '2023-03-20', fuelEfficiency: 4.5, status: 'On Trip', region: 'Howrah' },
  { id: 'veh-03', registrationNumber: 'JH-01-T-4412', vehicleName: 'BharatBenz 1923C', vehicleType: 'Container Truck', maxLoadCapacity: 15000, odometer: 134000, acquisitionCost: 3500000, purchaseDate: '2022-11-10', fuelEfficiency: 4.1, status: 'On Trip', region: 'Ranchi' },
  { id: 'veh-04', registrationNumber: 'OD-02-Q-1198', vehicleName: 'Eicher Pro 3015', vehicleType: 'Light Commercial Vehicle', maxLoadCapacity: 9500, odometer: 76500, acquisitionCost: 2400000, purchaseDate: '2023-06-12', fuelEfficiency: 5.2, status: 'On Trip', region: 'Bhubaneswar' },
  { id: 'veh-05', registrationNumber: 'WB-11-C-3301', vehicleName: 'Mahindra Furio 14', vehicleType: 'Light Commercial Vehicle', maxLoadCapacity: 8500, odometer: 64200, acquisitionCost: 2200000, purchaseDate: '2023-08-01', fuelEfficiency: 5.8, status: 'On Trip', region: 'Durgapur' },
  { id: 'veh-06', registrationNumber: 'WB-38-F-9102', vehicleName: 'Tata Ultra 1918.T', vehicleType: 'Container Truck', maxLoadCapacity: 13000, odometer: 98100, acquisitionCost: 3100000, purchaseDate: '2023-04-18', fuelEfficiency: 4.6, status: 'On Trip', region: 'Asansol' },

  // 3 In Shop
  { id: 'veh-07', registrationNumber: 'WB-23-A-7741', vehicleName: 'Ashok Leyland Boss 1415', vehicleType: 'Light Commercial Vehicle', maxLoadCapacity: 9000, odometer: 145000, acquisitionCost: 2300000, purchaseDate: '2022-07-14', fuelEfficiency: 4.8, status: 'In Shop', region: 'Kharagpur' },
  { id: 'veh-08', registrationNumber: 'WB-73-M-5520', vehicleName: 'Tata Ace Gold Diesel', vehicleType: 'Mini Truck', maxLoadCapacity: 1500, odometer: 82000, acquisitionCost: 750000, purchaseDate: '2023-05-10', fuelEfficiency: 14.5, status: 'In Shop', region: 'Siliguri' },
  { id: 'veh-09', registrationNumber: 'JH-05-K-8812', vehicleName: 'Mahindra Bolero Maxi Truck', vehicleType: 'Pickup Van', maxLoadCapacity: 2500, odometer: 119000, acquisitionCost: 950000, purchaseDate: '2022-09-05', fuelEfficiency: 11.2, status: 'In Shop', region: 'Jamshedpur' },

  // 14 Available
  { id: 'veh-10', registrationNumber: 'WB-01-B-2041', vehicleName: 'Tata Prima 3530.K', vehicleType: 'Container Truck', maxLoadCapacity: 22000, odometer: 45000, acquisitionCost: 4400000, purchaseDate: '2024-01-10', fuelEfficiency: 3.5, status: 'Available', region: 'Kolkata' },
  { id: 'veh-11', registrationNumber: 'WB-04-H-6612', vehicleName: 'Eicher Pro 6028', vehicleType: 'Refrigerated Truck', maxLoadCapacity: 16000, odometer: 58000, acquisitionCost: 3600000, purchaseDate: '2024-02-14', fuelEfficiency: 4.2, status: 'Available', region: 'Kolkata' },
  { id: 'veh-12', registrationNumber: 'WB-15-P-3390', vehicleName: 'Tata 407 Gold SFC', vehicleType: 'Light Commercial Vehicle', maxLoadCapacity: 4500, odometer: 39000, acquisitionCost: 1450000, purchaseDate: '2024-03-01', fuelEfficiency: 7.5, status: 'Available', region: 'Howrah' },
  { id: 'veh-13', registrationNumber: 'BR-01-G-7711', vehicleName: 'Ashok Leyland Dost+', vehicleType: 'Mini Truck', maxLoadCapacity: 1800, odometer: 51000, acquisitionCost: 820000, purchaseDate: '2023-11-20', fuelEfficiency: 13.8, status: 'Available', region: 'Patna' },
  { id: 'veh-14', registrationNumber: 'WB-40-S-1188', vehicleName: 'Mahindra Jeeto Plus', vehicleType: 'Mini Truck', maxLoadCapacity: 1200, odometer: 42000, acquisitionCost: 610000, purchaseDate: '2024-04-12', fuelEfficiency: 16.2, status: 'Available', region: 'Durgapur' },
  { id: 'veh-15', registrationNumber: 'WB-41-R-9043', vehicleName: 'Tata Intra V30', vehicleType: 'Pickup Van', maxLoadCapacity: 2200, odometer: 38000, acquisitionCost: 890000, purchaseDate: '2024-01-25', fuelEfficiency: 12.5, status: 'Available', region: 'Asansol' },
  { id: 'veh-16', registrationNumber: 'WB-74-T-6641', vehicleName: 'BharatBenz 1217C', vehicleType: 'Refrigerated Truck', maxLoadCapacity: 8000, odometer: 67000, acquisitionCost: 2600000, purchaseDate: '2023-09-15', fuelEfficiency: 5.5, status: 'Available', region: 'Siliguri' },
  { id: 'veh-17', registrationNumber: 'OD-05-N-3321', vehicleName: 'Tata LPT 1918', vehicleType: 'Container Truck', maxLoadCapacity: 14000, odometer: 73000, acquisitionCost: 3200000, purchaseDate: '2023-07-10', fuelEfficiency: 4.4, status: 'Available', region: 'Bhubaneswar' },
  { id: 'veh-18', registrationNumber: 'JH-01-W-9901', vehicleName: 'Eicher Pro 2049', vehicleType: 'Mini Truck', maxLoadCapacity: 3500, odometer: 49000, acquisitionCost: 1250000, purchaseDate: '2023-10-05', fuelEfficiency: 9.2, status: 'Available', region: 'Ranchi' },
  { id: 'veh-19', registrationNumber: 'WB-34-L-8842', vehicleName: 'Ashok Leyland Partner 6 Tyres', vehicleType: 'Light Commercial Vehicle', maxLoadCapacity: 6000, odometer: 56000, acquisitionCost: 1750000, purchaseDate: '2023-08-18', fuelEfficiency: 6.8, status: 'Available', region: 'Kharagpur' },
  { id: 'veh-20', registrationNumber: 'WB-02-X-4419', vehicleName: 'Tata Prima 2830.K LX', vehicleType: 'Container Truck', maxLoadCapacity: 18000, odometer: 41000, acquisitionCost: 3850000, purchaseDate: '2024-03-15', fuelEfficiency: 3.9, status: 'Available', region: 'Kolkata' },
  { id: 'veh-21', registrationNumber: 'WB-05-Y-7730', vehicleName: 'Mahindra Blazo X 28', vehicleType: 'Container Truck', maxLoadCapacity: 19000, odometer: 53000, acquisitionCost: 3950000, purchaseDate: '2023-12-01', fuelEfficiency: 3.7, status: 'Available', region: 'Howrah' },
  { id: 'veh-22', registrationNumber: 'JH-05-Z-2210', vehicleName: 'Tata Yodha 2.0', vehicleType: 'Pickup Van', maxLoadCapacity: 2000, odometer: 34000, acquisitionCost: 920000, purchaseDate: '2024-02-10', fuelEfficiency: 11.8, status: 'Available', region: 'Jamshedpur' },
  { id: 'veh-23', registrationNumber: 'BR-01-M-1155', vehicleName: 'Ashok Leyland Ecomet Star 1415', vehicleType: 'Light Commercial Vehicle', maxLoadCapacity: 8800, odometer: 61000, acquisitionCost: 2150000, purchaseDate: '2023-06-25', fuelEfficiency: 5.4, status: 'Available', region: 'Patna' },

  // 2 Retired
  { id: 'veh-24', registrationNumber: 'WB-01-R-0011', vehicleName: 'Tata SE 1613 Legacy', vehicleType: 'Container Truck', maxLoadCapacity: 10000, odometer: 395000, acquisitionCost: 1800000, purchaseDate: '2016-04-10', fuelEfficiency: 3.1, status: 'Retired', region: 'Kolkata' },
  { id: 'veh-25', registrationNumber: 'WB-19-R-0022', vehicleName: 'Ashok Leyland Comet 1611', vehicleType: 'Light Commercial Vehicle', maxLoadCapacity: 8000, odometer: 412000, acquisitionCost: 1650000, purchaseDate: '2015-08-15', fuelEfficiency: 3.2, status: 'Retired', region: 'Howrah' }
]

// Helper date generator for realistic expiries
const todayStr = new Date().toISOString().split('T')[0]
const getFutureDate = (days: number) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

// ============================================================================
// 2. DRIVERS (35 Total: 20 Available, 8 On Trip, 4 Off Duty, 3 Suspended)
// ============================================================================
export const drivers: Driver[] = [
  // 8 On Trip (assigned to our active trips)
  { id: 'drv-01', name: 'Rahul Sharma', licenseNumber: 'WB0420180041123', licenseCategory: 'HMV', expiryDate: getFutureDate(320), contactNumber: '+91 98301 11234', safetyScore: 94, totalTrips: 142, status: 'On Trip' },
  { id: 'drv-02', name: 'Amit Das', licenseNumber: 'WB1920170098812', licenseCategory: 'Transport', expiryDate: getFutureDate(180), contactNumber: '+91 98302 22345', safetyScore: 89, totalTrips: 118, status: 'On Trip' },
  { id: 'drv-03', name: 'Subhajit Roy', licenseNumber: 'JH0120190055411', licenseCategory: 'HMV', expiryDate: getFutureDate(410), contactNumber: '+91 98303 33456', safetyScore: 96, totalTrips: 165, status: 'On Trip' },
  { id: 'drv-04', name: 'Arindam Sen', licenseNumber: 'OD0220200011982', licenseCategory: 'LMV', expiryDate: getFutureDate(15), contactNumber: '+91 98304 44567', safetyScore: 88, totalTrips: 92, status: 'On Trip' }, // Expiring within 30 days
  { id: 'drv-05', name: 'Rakesh Kumar', licenseNumber: 'WB1120180033019', licenseCategory: 'HMV', expiryDate: getFutureDate(240), contactNumber: '+91 98305 55678', safetyScore: 91, totalTrips: 134, status: 'On Trip' },
  { id: 'drv-06', name: 'Debashis Chatterjee', licenseNumber: 'WB3820170077610', licenseCategory: 'Transport', expiryDate: getFutureDate(190), contactNumber: '+91 98306 66789', safetyScore: 87, totalTrips: 110, status: 'On Trip' },
  { id: 'drv-07', name: 'Bikramjit Ghosh', licenseNumber: 'WB0120190088911', licenseCategory: 'HMV', expiryDate: getFutureDate(300), contactNumber: '+91 98307 77890', safetyScore: 93, totalTrips: 128, status: 'On Trip' },
  { id: 'drv-08', name: 'Suman Banerjee', licenseNumber: 'WB0420210044190', licenseCategory: 'Transport', expiryDate: getFutureDate(510), contactNumber: '+91 98308 88901', safetyScore: 95, totalTrips: 84, status: 'On Trip' },

  // 4 Expiring within 30 days (1 above + 3 available below)
  { id: 'drv-09', name: 'Priya Mukherjee', licenseNumber: 'WB1520200022314', licenseCategory: 'LMV', expiryDate: getFutureDate(12), contactNumber: '+91 98309 99012', safetyScore: 92, totalTrips: 76, status: 'Available' },
  { id: 'drv-10', name: 'Sourav Ganguly', licenseNumber: 'WB4020190011452', licenseCategory: 'HMV', expiryDate: getFutureDate(22), contactNumber: '+91 98310 00123', safetyScore: 86, totalTrips: 104, status: 'Available' },
  { id: 'drv-11', name: 'Koushik Dutta', licenseNumber: 'BR0120180099410', licenseCategory: 'MCWG', expiryDate: getFutureDate(8), contactNumber: '+91 98311 11234', safetyScore: 84, totalTrips: 68, status: 'Available' },

  // 2 Already Expired
  { id: 'drv-12', name: 'Animesh Paul', licenseNumber: 'WB0120150044120', licenseCategory: 'HMV', expiryDate: getFutureDate(-45), contactNumber: '+91 98312 22345', safetyScore: 78, totalTrips: 140, status: 'Available' },
  { id: 'drv-13', name: 'Manish Tiwari', licenseNumber: 'JH0520160011890', licenseCategory: 'Transport', expiryDate: getFutureDate(-10), contactNumber: '+91 98313 33456', safetyScore: 74, totalTrips: 115, status: 'Available' },

  // 3 Suspended
  { id: 'drv-14', name: 'Prasenjit Mondal', licenseNumber: 'WB2320180055109', licenseCategory: 'HMV', expiryDate: getFutureDate(180), contactNumber: '+91 98314 44567', safetyScore: 62, totalTrips: 89, status: 'Suspended' },
  { id: 'drv-15', name: 'Sanjay Yadav', licenseNumber: 'BR0120170066210', licenseCategory: 'Transport', expiryDate: getFutureDate(210), contactNumber: '+91 98315 55678', safetyScore: 65, totalTrips: 94, status: 'Suspended' },
  { id: 'drv-16', name: 'Tapas Biswas', licenseNumber: 'WB7320190044910', licenseCategory: 'HMV', expiryDate: getFutureDate(160), contactNumber: '+91 98316 66789', safetyScore: 64, totalTrips: 71, status: 'Suspended' },

  // 4 Off Duty
  { id: 'drv-17', name: 'Alok Bhattacharya', licenseNumber: 'WB4120190033101', licenseCategory: 'LMV', expiryDate: getFutureDate(340), contactNumber: '+91 98317 77890', safetyScore: 90, totalTrips: 82, status: 'Off Duty' },
  { id: 'drv-18', name: 'Chandan Halder', licenseNumber: 'OD0520200088102', licenseCategory: 'HMV', expiryDate: getFutureDate(420), contactNumber: '+91 98318 88901', safetyScore: 89, totalTrips: 79, status: 'Off Duty' },
  { id: 'drv-19', name: 'Dipankar Maitra', licenseNumber: 'WB3420180099011', licenseCategory: 'Transport', expiryDate: getFutureDate(290), contactNumber: '+91 98319 99012', safetyScore: 88, totalTrips: 96, status: 'Off Duty' },
  { id: 'drv-20', name: 'Gautam Nandi', licenseNumber: 'JH0120210044810', licenseCategory: 'LMV', expiryDate: getFutureDate(510), contactNumber: '+91 98320 00123', safetyScore: 93, totalTrips: 65, status: 'Off Duty' },

  // Remaining Available Drivers (15 more to complete 20 Available total)
  { id: 'drv-21', name: 'Indranil Bose', licenseNumber: 'WB0220190077102', licenseCategory: 'HMV', expiryDate: getFutureDate(380), contactNumber: '+91 98321 11234', safetyScore: 97, totalTrips: 154, status: 'Available' },
  { id: 'drv-22', name: 'Joydeep Sarkar', licenseNumber: 'WB0520200055410', licenseCategory: 'Transport', expiryDate: getFutureDate(450), contactNumber: '+91 98322 22345', safetyScore: 94, totalTrips: 112, status: 'Available' },
  { id: 'drv-23', name: 'Kalyan Chakraborty', licenseNumber: 'JH0520180033910', licenseCategory: 'HMV', expiryDate: getFutureDate(260), contactNumber: '+91 98323 33456', safetyScore: 91, totalTrips: 138, status: 'Available' },
  { id: 'drv-24', name: 'Laltu Majumdar', licenseNumber: 'WB0120210088210', licenseCategory: 'LMV', expiryDate: getFutureDate(520), contactNumber: '+91 98324 44567', safetyScore: 95, totalTrips: 88, status: 'Available' },
  { id: 'drv-25', name: 'Manoj Sinha', licenseNumber: 'BR0120190066110', licenseCategory: 'Transport', expiryDate: getFutureDate(310), contactNumber: '+91 98325 55678', safetyScore: 89, totalTrips: 105, status: 'Available' },
  { id: 'drv-26', name: 'Nirmal Karmakar', licenseNumber: 'WB0420180022910', licenseCategory: 'HMV', expiryDate: getFutureDate(200), contactNumber: '+91 98326 66789', safetyScore: 87, totalTrips: 119, status: 'Available' },
  { id: 'drv-27', name: 'Parthasarathi Pal', licenseNumber: 'WB1920200011310', licenseCategory: 'HMV', expiryDate: getFutureDate(400), contactNumber: '+91 98327 77890', safetyScore: 98, totalTrips: 170, status: 'Available' },
  { id: 'drv-28', name: 'Ranbir Pradhan', licenseNumber: 'OD0220190099810', licenseCategory: 'Transport', expiryDate: getFutureDate(330), contactNumber: '+91 98328 88901', safetyScore: 92, totalTrips: 125, status: 'Available' },
  { id: 'drv-29', name: 'Siddhartha Guha', licenseNumber: 'WB1120210044610', licenseCategory: 'LMV', expiryDate: getFutureDate(540), contactNumber: '+91 98329 99012', safetyScore: 93, totalTrips: 74, status: 'Available' },
  { id: 'drv-30', name: 'Tanmoy Sengupta', licenseNumber: 'WB3820180077310', licenseCategory: 'HMV', expiryDate: getFutureDate(240), contactNumber: '+91 98330 00123', safetyScore: 90, totalTrips: 116, status: 'Available' },
  { id: 'drv-31', name: 'Utpal Kundu', licenseNumber: 'WB2320190055810', licenseCategory: 'Transport', expiryDate: getFutureDate(360), contactNumber: '+91 98331 11234', safetyScore: 91, totalTrips: 109, status: 'Available' },
  { id: 'drv-32', name: 'Vikramjit Ray', licenseNumber: 'WB7320200033210', licenseCategory: 'LMV', expiryDate: getFutureDate(430), contactNumber: '+91 98332 22345', safetyScore: 88, totalTrips: 91, status: 'Available' },
  { id: 'drv-33', name: 'Wasim Akram', licenseNumber: 'JH0120180088110', licenseCategory: 'HMV', expiryDate: getFutureDate(190), contactNumber: '+91 98333 33456', safetyScore: 94, totalTrips: 133, status: 'Available' },
  { id: 'drv-34', name: 'Yogesh Thakur', licenseNumber: 'BR0120200044910', licenseCategory: 'MCWG', expiryDate: getFutureDate(480), contactNumber: '+91 98334 44567', safetyScore: 86, totalTrips: 62, status: 'Available' },
  { id: 'drv-35', name: 'Zahir Khan', licenseNumber: 'WB0120190011610', licenseCategory: 'Transport', expiryDate: getFutureDate(350), contactNumber: '+91 98335 55678', safetyScore: 95, totalTrips: 144, status: 'Available' }
]

// ============================================================================
// 3. TRIPS (50 Total: 20 Active/Dispatched, 15 Completed, 10 Draft, 5 Cancelled)
// Corridors: Kolkata → Siliguri, Howrah → Ranchi, Asansol → Patna,
//            Durgapur → Bhubaneswar, Kharagpur → Jamshedpur
// ============================================================================
export const trips: Trip[] = [
  // 20 Active (Dispatched) — assigned to our 6 On Trip vehicles and 8 On Trip drivers rotating realistically
  { id: 'trp-01', tripCode: 'TRP-1048', source: 'Kolkata', destination: 'Siliguri', vehicleId: 'veh-01', driverId: 'drv-01', cargoWeight: 14500, plannedDistance: 560, plannedRevenue: 85000, status: 'Dispatched', dispatchDate: '2026-07-11' },
  { id: 'trp-02', tripCode: 'TRP-1049', source: 'Howrah', destination: 'Ranchi', vehicleId: 'veh-02', driverId: 'drv-02', cargoWeight: 9200, plannedDistance: 410, plannedRevenue: 62000, status: 'Dispatched', dispatchDate: '2026-07-11' },
  { id: 'trp-03', tripCode: 'TRP-1050', source: 'Asansol', destination: 'Patna', vehicleId: 'veh-03', driverId: 'drv-03', cargoWeight: 13000, plannedDistance: 330, plannedRevenue: 54000, status: 'Dispatched', dispatchDate: '2026-07-11' },
  { id: 'trp-04', tripCode: 'TRP-1051', source: 'Durgapur', destination: 'Bhubaneswar', vehicleId: 'veh-04', driverId: 'drv-04', cargoWeight: 8000, plannedDistance: 480, plannedRevenue: 71000, status: 'Dispatched', dispatchDate: '2026-07-12' },
  { id: 'trp-05', tripCode: 'TRP-1052', source: 'Kharagpur', destination: 'Jamshedpur', vehicleId: 'veh-05', driverId: 'drv-05', cargoWeight: 7500, plannedDistance: 140, plannedRevenue: 28000, status: 'Dispatched', dispatchDate: '2026-07-12' },
  { id: 'trp-06', tripCode: 'TRP-1053', source: 'Kolkata', destination: 'Siliguri', vehicleId: 'veh-06', driverId: 'drv-06', cargoWeight: 11500, plannedDistance: 560, plannedRevenue: 82000, status: 'Dispatched', dispatchDate: '2026-07-12' },
  { id: 'trp-07', tripCode: 'TRP-1054', source: 'Howrah', destination: 'Ranchi', vehicleId: 'veh-01', driverId: 'drv-07', cargoWeight: 15000, plannedDistance: 410, plannedRevenue: 64000, status: 'Dispatched', dispatchDate: '2026-07-12' },
  { id: 'trp-08', tripCode: 'TRP-1055', source: 'Asansol', destination: 'Patna', vehicleId: 'veh-02', driverId: 'drv-08', cargoWeight: 9500, plannedDistance: 330, plannedRevenue: 51000, status: 'Dispatched', dispatchDate: '2026-07-12' },
  { id: 'trp-09', tripCode: 'TRP-1056', source: 'Durgapur', destination: 'Bhubaneswar', vehicleId: 'veh-03', driverId: 'drv-01', cargoWeight: 12800, plannedDistance: 480, plannedRevenue: 73000, status: 'Dispatched', dispatchDate: '2026-07-12' },
  { id: 'trp-10', tripCode: 'TRP-1057', source: 'Kharagpur', destination: 'Jamshedpur', vehicleId: 'veh-04', driverId: 'drv-02', cargoWeight: 8200, plannedDistance: 140, plannedRevenue: 29000, status: 'Dispatched', dispatchDate: '2026-07-12' },
  { id: 'trp-11', tripCode: 'TRP-1058', source: 'Kolkata', destination: 'Siliguri', vehicleId: 'veh-05', driverId: 'drv-03', cargoWeight: 7800, plannedDistance: 560, plannedRevenue: 81000, status: 'Dispatched', dispatchDate: '2026-07-12' },
  { id: 'trp-12', tripCode: 'TRP-1059', source: 'Howrah', destination: 'Ranchi', vehicleId: 'veh-06', driverId: 'drv-04', cargoWeight: 12000, plannedDistance: 410, plannedRevenue: 63000, status: 'Dispatched', dispatchDate: '2026-07-12' },
  { id: 'trp-13', tripCode: 'TRP-1060', source: 'Asansol', destination: 'Patna', vehicleId: 'veh-01', driverId: 'drv-05', cargoWeight: 16500, plannedDistance: 330, plannedRevenue: 56000, status: 'Dispatched', dispatchDate: '2026-07-12' },
  { id: 'trp-14', tripCode: 'TRP-1061', source: 'Durgapur', destination: 'Bhubaneswar', vehicleId: 'veh-02', driverId: 'drv-06', cargoWeight: 9800, plannedDistance: 480, plannedRevenue: 72000, status: 'Dispatched', dispatchDate: '2026-07-12' },
  { id: 'trp-15', tripCode: 'TRP-1062', source: 'Kharagpur', destination: 'Jamshedpur', vehicleId: 'veh-03', driverId: 'drv-07', cargoWeight: 13500, plannedDistance: 140, plannedRevenue: 30000, status: 'Dispatched', dispatchDate: '2026-07-12' },
  { id: 'trp-16', tripCode: 'TRP-1063', source: 'Kolkata', destination: 'Siliguri', vehicleId: 'veh-04', driverId: 'drv-08', cargoWeight: 8400, plannedDistance: 560, plannedRevenue: 84000, status: 'Dispatched', dispatchDate: '2026-07-12' },
  { id: 'trp-17', tripCode: 'TRP-1064', source: 'Howrah', destination: 'Ranchi', vehicleId: 'veh-05', driverId: 'drv-01', cargoWeight: 7600, plannedDistance: 410, plannedRevenue: 61000, status: 'Dispatched', dispatchDate: '2026-07-12' },
  { id: 'trp-18', tripCode: 'TRP-1065', source: 'Asansol', destination: 'Patna', vehicleId: 'veh-06', driverId: 'drv-02', cargoWeight: 11800, plannedDistance: 330, plannedRevenue: 53000, status: 'Dispatched', dispatchDate: '2026-07-12' },
  { id: 'trp-19', tripCode: 'TRP-1066', source: 'Durgapur', destination: 'Bhubaneswar', vehicleId: 'veh-01', driverId: 'drv-03', cargoWeight: 16000, plannedDistance: 480, plannedRevenue: 74000, status: 'Dispatched', dispatchDate: '2026-07-12' },
  { id: 'trp-20', tripCode: 'TRP-1067', source: 'Kharagpur', destination: 'Jamshedpur', vehicleId: 'veh-02', driverId: 'drv-04', cargoWeight: 9400, plannedDistance: 140, plannedRevenue: 28500, status: 'Dispatched', dispatchDate: '2026-07-12' },

  // 15 Completed
  { id: 'trp-21', tripCode: 'TRP-1033', source: 'Kolkata', destination: 'Siliguri', vehicleId: 'veh-10', driverId: 'drv-21', cargoWeight: 18000, plannedDistance: 560, actualDistance: 565, fuelConsumed: 160, plannedRevenue: 88000, actualRevenue: 88000, status: 'Completed', dispatchDate: '2026-07-01', completionDate: '2026-07-02' },
  { id: 'trp-22', tripCode: 'TRP-1034', source: 'Howrah', destination: 'Ranchi', vehicleId: 'veh-11', driverId: 'drv-22', cargoWeight: 14000, plannedDistance: 410, actualDistance: 412, fuelConsumed: 98, plannedRevenue: 65000, actualRevenue: 65000, status: 'Completed', dispatchDate: '2026-07-02', completionDate: '2026-07-03' },
  { id: 'trp-23', tripCode: 'TRP-1035', source: 'Asansol', destination: 'Patna', vehicleId: 'veh-12', driverId: 'drv-23', cargoWeight: 4000, plannedDistance: 330, actualDistance: 331, fuelConsumed: 44, plannedRevenue: 42000, actualRevenue: 42000, status: 'Completed', dispatchDate: '2026-07-03', completionDate: '2026-07-04' },
  { id: 'trp-24', tripCode: 'TRP-1036', source: 'Durgapur', destination: 'Bhubaneswar', vehicleId: 'veh-13', driverId: 'drv-24', cargoWeight: 1500, plannedDistance: 480, actualDistance: 485, fuelConsumed: 35, plannedRevenue: 38000, actualRevenue: 38000, status: 'Completed', dispatchDate: '2026-07-04', completionDate: '2026-07-05' },
  { id: 'trp-25', tripCode: 'TRP-1037', source: 'Kharagpur', destination: 'Jamshedpur', vehicleId: 'veh-14', driverId: 'drv-25', cargoWeight: 1100, plannedDistance: 140, actualDistance: 140, fuelConsumed: 9, plannedRevenue: 18000, actualRevenue: 18000, status: 'Completed', dispatchDate: '2026-07-04', completionDate: '2026-07-05' },
  { id: 'trp-26', tripCode: 'TRP-1038', source: 'Kolkata', destination: 'Siliguri', vehicleId: 'veh-15', driverId: 'drv-26', cargoWeight: 2000, plannedDistance: 560, actualDistance: 560, fuelConsumed: 45, plannedRevenue: 52000, actualRevenue: 52000, status: 'Completed', dispatchDate: '2026-07-05', completionDate: '2026-07-06' },
  { id: 'trp-27', tripCode: 'TRP-1039', source: 'Howrah', destination: 'Ranchi', vehicleId: 'veh-16', driverId: 'drv-27', cargoWeight: 7500, plannedDistance: 410, actualDistance: 415, fuelConsumed: 75, plannedRevenue: 58000, actualRevenue: 58000, status: 'Completed', dispatchDate: '2026-07-05', completionDate: '2026-07-06' },
  { id: 'trp-28', tripCode: 'TRP-1040', source: 'Asansol', destination: 'Patna', vehicleId: 'veh-17', driverId: 'drv-28', cargoWeight: 12000, plannedDistance: 330, actualDistance: 330, fuelConsumed: 75, plannedRevenue: 55000, actualRevenue: 55000, status: 'Completed', dispatchDate: '2026-07-06', completionDate: '2026-07-07' },
  { id: 'trp-29', tripCode: 'TRP-1041', source: 'Durgapur', destination: 'Bhubaneswar', vehicleId: 'veh-18', driverId: 'drv-29', cargoWeight: 3200, plannedDistance: 480, actualDistance: 482, fuelConsumed: 52, plannedRevenue: 44000, actualRevenue: 44000, status: 'Completed', dispatchDate: '2026-07-07', completionDate: '2026-07-08' },
  { id: 'trp-30', tripCode: 'TRP-1042', source: 'Kharagpur', destination: 'Jamshedpur', vehicleId: 'veh-19', driverId: 'drv-30', cargoWeight: 5500, plannedDistance: 140, actualDistance: 142, fuelConsumed: 21, plannedRevenue: 26000, actualRevenue: 26000, status: 'Completed', dispatchDate: '2026-07-07', completionDate: '2026-07-08' },
  { id: 'trp-31', tripCode: 'TRP-1043', source: 'Kolkata', destination: 'Siliguri', vehicleId: 'veh-20', driverId: 'drv-31', cargoWeight: 16500, plannedDistance: 560, actualDistance: 562, fuelConsumed: 144, plannedRevenue: 86000, actualRevenue: 86000, status: 'Completed', dispatchDate: '2026-07-08', completionDate: '2026-07-09' },
  { id: 'trp-32', tripCode: 'TRP-1044', source: 'Howrah', destination: 'Ranchi', vehicleId: 'veh-21', driverId: 'drv-32', cargoWeight: 17000, plannedDistance: 410, actualDistance: 411, fuelConsumed: 110, plannedRevenue: 68000, actualRevenue: 68000, status: 'Completed', dispatchDate: '2026-07-08', completionDate: '2026-07-09' },
  { id: 'trp-33', tripCode: 'TRP-1045', source: 'Asansol', destination: 'Patna', vehicleId: 'veh-22', driverId: 'drv-33', cargoWeight: 1800, plannedDistance: 330, actualDistance: 330, fuelConsumed: 28, plannedRevenue: 34000, actualRevenue: 34000, status: 'Completed', dispatchDate: '2026-07-09', completionDate: '2026-07-10' },
  { id: 'trp-34', tripCode: 'TRP-1046', source: 'Durgapur', destination: 'Bhubaneswar', vehicleId: 'veh-23', driverId: 'drv-34', cargoWeight: 8200, plannedDistance: 480, actualDistance: 480, fuelConsumed: 88, plannedRevenue: 69000, actualRevenue: 69000, status: 'Completed', dispatchDate: '2026-07-09', completionDate: '2026-07-10' },
  { id: 'trp-35', tripCode: 'TRP-1047', source: 'Kharagpur', destination: 'Jamshedpur', vehicleId: 'veh-10', driverId: 'drv-35', cargoWeight: 15000, plannedDistance: 140, actualDistance: 140, fuelConsumed: 40, plannedRevenue: 31000, actualRevenue: 31000, status: 'Completed', dispatchDate: '2026-07-10', completionDate: '2026-07-11' },

  // 10 Draft
  { id: 'trp-36', tripCode: 'TRP-1068', source: 'Kolkata', destination: 'Siliguri', vehicleId: 'veh-10', driverId: 'drv-21', cargoWeight: 18000, plannedDistance: 560, plannedRevenue: 87000, status: 'Draft' },
  { id: 'trp-37', tripCode: 'TRP-1069', source: 'Howrah', destination: 'Ranchi', vehicleId: 'veh-11', driverId: 'drv-22', cargoWeight: 14000, plannedDistance: 410, plannedRevenue: 64000, status: 'Draft' },
  { id: 'trp-38', tripCode: 'TRP-1070', source: 'Asansol', destination: 'Patna', vehicleId: 'veh-12', driverId: 'drv-23', cargoWeight: 4000, plannedDistance: 330, plannedRevenue: 43000, status: 'Draft' },
  { id: 'trp-39', tripCode: 'TRP-1071', source: 'Durgapur', destination: 'Bhubaneswar', vehicleId: 'veh-13', driverId: 'drv-24', cargoWeight: 1500, plannedDistance: 480, plannedRevenue: 39000, status: 'Draft' },
  { id: 'trp-40', tripCode: 'TRP-1072', source: 'Kharagpur', destination: 'Jamshedpur', vehicleId: 'veh-14', driverId: 'drv-25', cargoWeight: 1100, plannedDistance: 140, plannedRevenue: 19000, status: 'Draft' },
  { id: 'trp-41', tripCode: 'TRP-1073', source: 'Kolkata', destination: 'Siliguri', vehicleId: 'veh-15', driverId: 'drv-26', cargoWeight: 2000, plannedDistance: 560, plannedRevenue: 53000, status: 'Draft' },
  { id: 'trp-42', tripCode: 'TRP-1074', source: 'Howrah', destination: 'Ranchi', vehicleId: 'veh-16', driverId: 'drv-27', cargoWeight: 7500, plannedDistance: 410, plannedRevenue: 59000, status: 'Draft' },
  { id: 'trp-43', tripCode: 'TRP-1075', source: 'Asansol', destination: 'Patna', vehicleId: 'veh-17', driverId: 'drv-28', cargoWeight: 12000, plannedDistance: 330, plannedRevenue: 54000, status: 'Draft' },
  { id: 'trp-44', tripCode: 'TRP-1076', source: 'Durgapur', destination: 'Bhubaneswar', vehicleId: 'veh-18', driverId: 'drv-29', cargoWeight: 3200, plannedDistance: 480, plannedRevenue: 45000, status: 'Draft' },
  { id: 'trp-45', tripCode: 'TRP-1077', source: 'Kharagpur', destination: 'Jamshedpur', vehicleId: 'veh-19', driverId: 'drv-30', cargoWeight: 5500, plannedDistance: 140, plannedRevenue: 27000, status: 'Draft' },

  // 5 Cancelled
  { id: 'trp-46', tripCode: 'TRP-1028', source: 'Kolkata', destination: 'Siliguri', vehicleId: 'veh-20', driverId: 'drv-31', cargoWeight: 15000, plannedDistance: 560, plannedRevenue: 85000, status: 'Cancelled' },
  { id: 'trp-47', tripCode: 'TRP-1029', source: 'Howrah', destination: 'Ranchi', vehicleId: 'veh-21', driverId: 'drv-32', cargoWeight: 16000, plannedDistance: 410, plannedRevenue: 63000, status: 'Cancelled' },
  { id: 'trp-48', tripCode: 'TRP-1030', source: 'Asansol', destination: 'Patna', vehicleId: 'veh-22', driverId: 'drv-33', cargoWeight: 1800, plannedDistance: 330, plannedRevenue: 34000, status: 'Cancelled' },
  { id: 'trp-49', tripCode: 'TRP-1031', source: 'Durgapur', destination: 'Bhubaneswar', vehicleId: 'veh-23', driverId: 'drv-34', cargoWeight: 8000, plannedDistance: 480, plannedRevenue: 68000, status: 'Cancelled' },
  { id: 'trp-50', tripCode: 'TRP-1032', source: 'Kharagpur', destination: 'Jamshedpur', vehicleId: 'veh-10', driverId: 'drv-35', cargoWeight: 14000, plannedDistance: 140, plannedRevenue: 30000, status: 'Cancelled' }
]

// ============================================================================
// 4. MAINTENANCE RECORDS (12 Total: 4 Open matching vehicles In Shop, 8 Closed)
// ============================================================================
export const maintenanceLogs: MaintenanceRecord[] = [
  // 4 Open (assigned to veh-07, veh-08, veh-09)
  { id: 'maint-01', vehicleId: 'veh-07', maintenanceType: 'Engine Inspection', description: 'Scheduled 150,000 km full engine overhaul & turbo check', cost: 38500, startDate: '2026-07-08', status: 'Open' },
  { id: 'maint-02', vehicleId: 'veh-08', maintenanceType: 'Transmission Service', description: 'Clutch plate replacement and gearbox fluid flush', cost: 18200, startDate: '2026-07-09', status: 'Open' },
  { id: 'maint-03', vehicleId: 'veh-09', maintenanceType: 'AC Repair', description: 'Compressor overhaul and cabin filtration replacement', cost: 14500, startDate: '2026-07-10', status: 'Open' },
  { id: 'maint-04', vehicleId: 'veh-07', maintenanceType: 'Brake Service', description: 'Brake drum machining and pneumatic line testing', cost: 12000, startDate: '2026-07-11', status: 'Open' },

  // 8 Closed
  { id: 'maint-05', vehicleId: 'veh-10', maintenanceType: 'Oil Change', description: 'Routine 40,000 km synthetic engine oil change', cost: 8500, startDate: '2026-06-15', endDate: '2026-06-16', status: 'Closed' },
  { id: 'maint-06', vehicleId: 'veh-11', maintenanceType: 'Tyre Replacement', description: 'Replaced 6 rear radial drive axle tyres', cost: 92000, startDate: '2026-06-18', endDate: '2026-06-19', status: 'Closed' },
  { id: 'maint-07', vehicleId: 'veh-12', maintenanceType: 'Brake Service', description: 'Front brake pad replacement and rotor skimming', cost: 11500, startDate: '2026-06-20', endDate: '2026-06-21', status: 'Closed' },
  { id: 'maint-08', vehicleId: 'veh-16', maintenanceType: 'AC Repair', description: 'Reefer container cooling coil sanitization', cost: 16800, startDate: '2026-06-22', endDate: '2026-06-23', status: 'Closed' },
  { id: 'maint-09', vehicleId: 'veh-17', maintenanceType: 'Transmission Service', description: 'Diff oil flush and driveshaft lubrication', cost: 14200, startDate: '2026-06-25', endDate: '2026-06-26', status: 'Closed' },
  { id: 'maint-10', vehicleId: 'veh-20', maintenanceType: 'Oil Change', description: 'Standard preventive service & oil change', cost: 9000, startDate: '2026-06-28', endDate: '2026-06-29', status: 'Closed' },
  { id: 'maint-11', vehicleId: 'veh-21', maintenanceType: 'Engine Inspection', description: 'BS6 emission system calibration and DEF injector check', cost: 21000, startDate: '2026-07-01', endDate: '2026-07-02', status: 'Closed' },
  { id: 'maint-12', vehicleId: 'veh-23', maintenanceType: 'Tyre Replacement', description: 'Front steer axle tyre balancing and alignment', cost: 18500, startDate: '2026-07-05', endDate: '2026-07-06', status: 'Closed' }
]

// ============================================================================
// 5. FUEL LOGS (120 Logs across last 6 months, ₹88–₹98/L diesel pricing)
// ============================================================================
const fuelStations = [
  'IndianOil NH-19 Highway Hub, Dankuni',
  'BPCL COCO Fuel Station, Asansol Bypass',
  'HPCL Mega Highway Pump, Durgapur Expressway',
  'IndianOil NH-16 Hub, Kharagpur',
  'BPCL Highway Services, Siliguri Corridor'
]

export const fuelLogs: FuelLog[] = Array.from({ length: 120 }, (_, i) => {
  const vehIndex = (i % 23) + 1
  const vehId = `veh-${vehIndex < 10 ? '0' + vehIndex : vehIndex}`
  const liters = Math.floor(Math.random() * 80) + 40 // 40 to 120 liters
  const pricePerL = Math.floor(Math.random() * 11) + 88 // ₹88 to ₹98 per liter
  const cost = liters * pricePerL
  const monthOffset = Math.floor(i / 20) // 0 to 5 months ago
  const dateObj = new Date()
  dateObj.setMonth(dateObj.getMonth() - monthOffset)
  dateObj.setDate((i % 28) + 1)

  return {
    id: `fuel-${100 + i}`,
    vehicleId: vehId,
    liters,
    cost,
    station: fuelStations[i % fuelStations.length],
    date: dateObj.toISOString().split('T')[0]
  }
})

// ============================================================================
// 6. EXPENSES (150 Total across categories)
// ============================================================================
const expenseCategories: Expense['category'][] = ['Fuel', 'Maintenance', 'Toll', 'Parking', 'Insurance', 'Other']
const expenseDescriptions: Record<Expense['category'], string> = {
  Fuel: 'Refueling receipt for highway haulage corridor',
  Maintenance: 'Scheduled workshop service parts & labor',
  Toll: 'FASTag NHAI Expressway corridor toll charges',
  Parking: 'Terminal holding yard and secure parking fee',
  Insurance: 'Annual comprehensive commercial fleet insurance premium',
  Other: 'Weighbridge compliance and interstate entry permits'
}

export const expenses: Expense[] = Array.from({ length: 150 }, (_, i) => {
  const vehIndex = (i % 23) + 1
  const vehId = `veh-${vehIndex < 10 ? '0' + vehIndex : vehIndex}`
  const category = expenseCategories[i % expenseCategories.length]
  let amount = 1500
  if (category === 'Fuel') amount = 5800 + (i % 2000)
  else if (category === 'Maintenance') amount = 12000 + (i % 5000)
  else if (category === 'Toll') amount = 1450 + (i % 400)
  else if (category === 'Parking') amount = 450 + (i % 200)
  else if (category === 'Insurance') amount = 32000
  else amount = 1100 + (i % 300)

  const monthOffset = Math.floor(i / 25)
  const dateObj = new Date()
  dateObj.setMonth(dateObj.getMonth() - monthOffset)
  dateObj.setDate((i % 28) + 1)

  return {
    id: `exp-${200 + i}`,
    vehicleId: vehId,
    category,
    amount,
    notes: expenseDescriptions[category],
    date: dateObj.toISOString().split('T')[0]
  }
})

// ============================================================================
// 7. USERS (5 Core Roles)
// ============================================================================
export const users: User[] = [
  { id: 'usr-01', name: 'Aditya Banerjee', email: 'fleet@transitops.io', role: 'Fleet Manager' },
  { id: 'usr-02', name: 'Rohan Sengupta', email: 'dispatch@transitops.io', role: 'Dispatcher' },
  { id: 'usr-03', name: 'Priya Chatterjee', email: 'safety@transitops.io', role: 'Safety Officer' },
  { id: 'usr-04', name: 'Sneha Ghosh', email: 'finance@transitops.io', role: 'Financial Analyst' },
  { id: 'usr-05', name: 'Admin Master', email: 'admin@transitops.io', role: 'Admin' }
]

// ============================================================================
// 8. NOTIFICATIONS FEED (25 Realistic Events)
// ============================================================================
export const notifications: NotificationItem[] = [
  { id: 'notif-01', title: 'Vehicle Dispatched', message: 'Vehicle WB-04-E-1042 dispatched to Siliguri under Trip TRP-1048.', timestamp: '10 mins ago', type: 'info' },
  { id: 'notif-02', title: 'Trip Completed', message: 'Driver Rahul Sharma completed Trip TRP-1033 ahead of schedule.', timestamp: '35 mins ago', type: 'success' },
  { id: 'notif-03', title: 'Workshop Ticket Opened', message: 'Maintenance ticket opened for WB-23-A-7741 (Engine Inspection). Status: In Shop.', timestamp: '1 hr ago', type: 'warning' },
  { id: 'notif-04', title: 'License Expiry Alert', message: 'BR-004 Alert: License for Arindam Sen expires in 15 days.', timestamp: '2 hrs ago', type: 'alert' },
  { id: 'notif-05', title: 'Fuel Efficiency Threshold', message: 'Fuel efficiency warning on WB-73-M-5520 dropped below expected range.', timestamp: '3 hrs ago', type: 'warning' },
  { id: 'notif-06', title: 'New Trip Dispatched', message: 'Vehicle WB-19-D-8891 dispatched on Howrah → Ranchi corridor.', timestamp: '4 hrs ago', type: 'info' },
  { id: 'notif-07', title: 'FASTag Toll Logged', message: 'Toll expense ₹1,450 automatically synced for WB-01-B-2041.', timestamp: '5 hrs ago', type: 'info' },
  { id: 'notif-08', title: 'Safety Telemetry High Score', message: 'Driver Subhajit Roy maintained 96/100 safety score over last 30 days.', timestamp: '6 hrs ago', type: 'success' },
  { id: 'notif-09', title: 'Vehicle Service Completed', message: 'Workshop ticket closed for WB-01-B-2041. Vehicle restored to Available.', timestamp: '8 hrs ago', type: 'success' },
  { id: 'notif-10', title: 'Expired License Locked', message: 'BR-004 Enforcement: Animesh Paul locked from dispatch assignments.', timestamp: '9 hrs ago', type: 'alert' },
  { id: 'notif-11', title: 'Refueling Receipt Synced', message: 'Fuel receipt 65L logged at IndianOil NH-19 Hub for WB-04-E-1042.', timestamp: '11 hrs ago', type: 'info' },
  { id: 'notif-12', title: 'Driver Roster Audit', message: 'Monthly driver compliance verification completed by Safety Officer.', timestamp: '12 hrs ago', type: 'success' },
  { id: 'notif-13', title: 'Trip TRP-1050 Dispatched', message: 'Asansol → Patna heavy freight corridor dispatched successfully.', timestamp: '14 hrs ago', type: 'info' },
  { id: 'notif-14', title: 'Workshop Parts Arrived', message: 'Transmission replacement parts received for WB-73-M-5520.', timestamp: '16 hrs ago', type: 'info' },
  { id: 'notif-15', title: 'Insurance Premium Recorded', message: 'Annual commercial fleet insurance policy renewed for 5 assets.', timestamp: '18 hrs ago', type: 'info' },
  { id: 'notif-16', title: 'Trip TRP-1034 Sign-Off', message: 'Realized revenue ₹65,000 verified and closed for Howrah → Ranchi trip.', timestamp: '20 hrs ago', type: 'success' },
  { id: 'notif-17', title: 'Driver Suspension Locked', message: 'BR-005 Enforcement: Prasenjit Mondal suspended due to safety infraction.', timestamp: '1 day ago', type: 'alert' },
  { id: 'notif-18', title: 'Reefer Temperature Verified', message: 'Cold chain temperature log verified for Refrigerated Truck WB-19-D-8891.', timestamp: '1 day ago', type: 'success' },
  { id: 'notif-19', title: 'New Vehicle Registered', message: 'Tata Prima 3530.K (WB-01-B-2041) onboarded into fleet registry.', timestamp: '2 days ago', type: 'info' },
  { id: 'notif-20', title: 'Trip TRP-1035 Completed', message: 'Asansol → Patna haulage completed with 0 delays.', timestamp: '2 days ago', type: 'success' },
  { id: 'notif-21', title: 'Brake Pad Replacement', message: 'Preventive brake service logged for Light Commercial Vehicle OD-02-Q-1198.', timestamp: '3 days ago', type: 'info' },
  { id: 'notif-22', title: 'Driver License Renewed', message: 'Driver Indranil Bose renewed HMV commercial license valid till 2027.', timestamp: '3 days ago', type: 'success' },
  { id: 'notif-23', title: 'Expressway Route Optimized', message: 'Durgapur → Bhubaneswar transit corridor savings of 45 mins achieved.', timestamp: '4 days ago', type: 'success' },
  { id: 'notif-24', title: 'Monthly ROI Scorecard', message: 'Eastern India Fleet ROI performance ranked at 4.2% net yield.', timestamp: '5 days ago', type: 'info' },
  { id: 'notif-25', title: 'System Backup Complete', message: 'TransitOps centralized operations snapshot archived successfully.', timestamp: '6 days ago', type: 'info' }
]
