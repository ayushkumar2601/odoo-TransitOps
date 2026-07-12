export interface HubGeoFence {
  id: string
  name: string
  center: [number, number]
  radiusMeters: number
  code: string
}

export interface ActiveRouteCorridor {
  id: string
  code: string
  source: string
  destination: string
  sourceCoords: [number, number]
  destCoords: [number, number]
  waypoints: [number, number][]
  totalDistanceKm: number
}

export interface VehicleTelemetry {
  id: string
  registrationNumber: string
  vehicleName: string
  vehicleType: string
  driverName: string
  status: 'Moving' | 'Stopped' | 'Idling' | 'Breakdown' | 'Maintenance' | 'Offline'
  latitude: number
  longitude: number
  heading: number
  speed: number
  fuelPercent: number
  engineHealth: number
  odometer: number
  cargoWeight: number
  safetyScore: number
  roiScore: number
  lastMaintenance: string
  openAlerts: string[]
  currentTrip?: {
    tripCode: string
    source: string
    destination: string
    sourceCoords: [number, number]
    destCoords: [number, number]
    progressPercent: number
    distanceRemainingKm: number
    etaMins: number
  }
  lastUpdated: string
}

// 1. Eastern India Logistics Geofenced Hubs
export const EASTERN_INDIA_HUBS: HubGeoFence[] = [
  {
    id: 'hub-kolkata',
    name: 'Kolkata Central Port Hub',
    center: [22.5726, 88.3639],
    radiusMeters: 15000,
    code: 'CCU-01'
  },
  {
    id: 'hub-durgapur',
    name: 'Durgapur Industrial Corridor Hub',
    center: [23.5204, 87.3119],
    radiusMeters: 12000,
    code: 'DGP-02'
  },
  {
    id: 'hub-siliguri',
    name: 'Siliguri North-East Gateway Hub',
    center: [26.7271, 88.3953],
    radiusMeters: 14000,
    code: 'SGU-03'
  },
  {
    id: 'hub-ranchi',
    name: 'Ranchi Mineral Express Hub',
    center: [23.3441, 85.3096],
    radiusMeters: 12000,
    code: 'RNC-04'
  },
  {
    id: 'hub-bhubaneswar',
    name: 'Bhubaneswar Coastal Freight Hub',
    center: [20.2961, 85.8245],
    radiusMeters: 15000,
    code: 'BBI-05'
  }
]

// 2. 10 Active Corridors across Eastern India
export const LOGISTICS_CORRIDORS: ActiveRouteCorridor[] = [
  {
    id: 'cor-01',
    code: 'TRP-101',
    source: 'Kolkata Port',
    destination: 'Siliguri Gateway',
    sourceCoords: [22.5726, 88.3639],
    destCoords: [26.7271, 88.3953],
    waypoints: [
      [22.5726, 88.3639],
      [23.8103, 88.2560],
      [25.0108, 88.1411],
      [26.7271, 88.3953]
    ],
    totalDistanceKm: 580
  },
  {
    id: 'cor-02',
    code: 'TRP-102',
    source: 'Howrah Logistics Park',
    destination: 'Durgapur Steel Hub',
    sourceCoords: [22.5958, 88.2636],
    destCoords: [23.5204, 87.3119],
    waypoints: [
      [22.5958, 88.2636],
      [23.1042, 87.8920],
      [23.5204, 87.3119]
    ],
    totalDistanceKm: 175
  },
  {
    id: 'cor-03',
    code: 'TRP-103',
    source: 'Durgapur Steel Hub',
    destination: 'Ranchi Industrial Yard',
    sourceCoords: [23.5204, 87.3119],
    destCoords: [23.3441, 85.3096],
    waypoints: [
      [23.5204, 87.3119],
      [23.6739, 86.9524],
      [23.3441, 85.3096]
    ],
    totalDistanceKm: 210
  },
  {
    id: 'cor-04',
    code: 'TRP-104',
    source: 'Kolkata Port',
    destination: 'Bhubaneswar Coastal Depot',
    sourceCoords: [22.5726, 88.3639],
    destCoords: [20.2961, 85.8245],
    waypoints: [
      [22.5726, 88.3639],
      [21.4934, 86.9333],
      [20.2961, 85.8245]
    ],
    totalDistanceKm: 440
  },
  {
    id: 'cor-05',
    code: 'TRP-105',
    source: 'Ranchi Industrial Yard',
    destination: 'Patna Terminal',
    sourceCoords: [23.3441, 85.3096],
    destCoords: [25.5941, 85.1376],
    waypoints: [
      [23.3441, 85.3096],
      [24.1800, 85.4200],
      [25.5941, 85.1376]
    ],
    totalDistanceKm: 330
  }
]

// 3. 25 Seeded Enterprise Fleet Telemetry Assets
export const INITIAL_FLEET_TELEMETRY: VehicleTelemetry[] = [
  {
    id: 'veh-01',
    registrationNumber: 'WB-04-E-1042',
    vehicleName: 'Tata Prima 2830.K',
    vehicleType: 'Container Truck',
    driverName: 'Rahul Sharma',
    status: 'Moving',
    latitude: 24.3102,
    longitude: 88.2104,
    heading: 14,
    speed: 68,
    fuelPercent: 78,
    engineHealth: 96,
    odometer: 112400,
    cargoWeight: 14500,
    safetyScore: 94,
    roiScore: 92,
    lastMaintenance: '2026-06-10',
    openAlerts: [],
    currentTrip: {
      tripCode: 'TRP-101',
      source: 'Kolkata Port',
      destination: 'Siliguri Gateway',
      sourceCoords: [22.5726, 88.3639],
      destCoords: [26.7271, 88.3953],
      progressPercent: 42,
      distanceRemainingKm: 336,
      etaMins: 295
    },
    lastUpdated: 'Live'
  },
  {
    id: 'veh-02',
    registrationNumber: 'WB-19-D-8891',
    vehicleName: 'Ashok Leyland Ecomet 1615',
    vehicleType: 'Refrigerated Truck',
    driverName: 'Amit Das',
    status: 'Moving',
    latitude: 23.0511,
    longitude: 87.9812,
    heading: 310,
    speed: 62,
    fuelPercent: 64,
    engineHealth: 94,
    odometer: 89300,
    cargoWeight: 9200,
    safetyScore: 89,
    roiScore: 88,
    lastMaintenance: '2026-06-15',
    openAlerts: [],
    currentTrip: {
      tripCode: 'TRP-102',
      source: 'Howrah Logistics Park',
      destination: 'Durgapur Steel Hub',
      sourceCoords: [22.5958, 88.2636],
      destCoords: [23.5204, 87.3119],
      progressPercent: 55,
      distanceRemainingKm: 78,
      etaMins: 75
    },
    lastUpdated: 'Live'
  },
  {
    id: 'veh-03',
    registrationNumber: 'JH-01-T-4412',
    vehicleName: 'BharatBenz 1923C',
    vehicleType: 'Container Truck',
    driverName: 'Subhajit Roy',
    status: 'Moving',
    latitude: 23.5901,
    longitude: 86.8123,
    heading: 265,
    speed: 58,
    fuelPercent: 82,
    engineHealth: 98,
    odometer: 134000,
    cargoWeight: 15000,
    safetyScore: 96,
    roiScore: 95,
    lastMaintenance: '2026-06-01',
    openAlerts: [],
    currentTrip: {
      tripCode: 'TRP-103',
      source: 'Durgapur Steel Hub',
      destination: 'Ranchi Industrial Yard',
      sourceCoords: [23.5204, 87.3119],
      destCoords: [23.3441, 85.3096],
      progressPercent: 65,
      distanceRemainingKm: 73,
      etaMins: 72
    },
    lastUpdated: 'Live'
  },
  {
    id: 'veh-04',
    registrationNumber: 'OD-02-Q-1198',
    vehicleName: 'Eicher Pro 3015',
    vehicleType: 'Light Commercial Vehicle',
    driverName: 'Arindam Sen',
    status: 'Moving',
    latitude: 21.4110,
    longitude: 86.8900,
    heading: 210,
    speed: 71,
    fuelPercent: 14, // Low Fuel Trigger
    engineHealth: 91,
    odometer: 76500,
    cargoWeight: 7800,
    safetyScore: 88,
    roiScore: 84,
    lastMaintenance: '2026-05-20',
    openAlerts: ['LOW_FUEL_ALERT', 'BR-004_EXPIRED_LICENSE_WARNING'],
    currentTrip: {
      tripCode: 'TRP-104',
      source: 'Kolkata Port',
      destination: 'Bhubaneswar Coastal Depot',
      sourceCoords: [22.5726, 88.3639],
      destCoords: [20.2961, 85.8245],
      progressPercent: 50,
      distanceRemainingKm: 220,
      etaMins: 185
    },
    lastUpdated: 'Live'
  },
  {
    id: 'veh-05',
    registrationNumber: 'WB-11-C-3301',
    vehicleName: 'Mahindra Furio 14',
    vehicleType: 'Light Commercial Vehicle',
    driverName: 'Rakesh Kumar',
    status: 'Moving',
    latitude: 24.5100,
    longitude: 85.2800,
    heading: 350,
    speed: 65,
    fuelPercent: 71,
    engineHealth: 92,
    odometer: 64200,
    cargoWeight: 8100,
    safetyScore: 91,
    roiScore: 89,
    lastMaintenance: '2026-06-18',
    openAlerts: [],
    currentTrip: {
      tripCode: 'TRP-105',
      source: 'Ranchi Industrial Yard',
      destination: 'Patna Terminal',
      sourceCoords: [23.3441, 85.3096],
      destCoords: [25.5941, 85.1376],
      progressPercent: 60,
      distanceRemainingKm: 132,
      etaMins: 120
    },
    lastUpdated: 'Live'
  },
  {
    id: 'veh-06',
    registrationNumber: 'WB-38-F-9102',
    vehicleName: 'Tata Ultra 1918.T',
    vehicleType: 'Container Truck',
    driverName: 'Debashis Chatterjee',
    status: 'Breakdown',
    latitude: 23.4100,
    longitude: 87.8200,
    heading: 0,
    speed: 0,
    fuelPercent: 44,
    engineHealth: 42, // Breakdown Alert
    odometer: 98100,
    cargoWeight: 11000,
    safetyScore: 87,
    roiScore: 71,
    lastMaintenance: '2026-04-10',
    openAlerts: ['ENGINE_OVERHEAT_CRITICAL', 'MAINTENANCE_OVERDUE'],
    currentTrip: {
      tripCode: 'TRP-106',
      source: 'Kolkata Port',
      destination: 'Asansol Terminal',
      sourceCoords: [22.5726, 88.3639],
      destCoords: [23.6739, 86.9524],
      progressPercent: 48,
      distanceRemainingKm: 110,
      etaMins: 999
    },
    lastUpdated: 'Live'
  },
  {
    id: 'veh-07',
    registrationNumber: 'WB-01-A-4491',
    vehicleName: 'Ashok Leyland Partner',
    vehicleType: 'Pickup Van',
    driverName: 'Bikramjit Ghosh',
    status: 'Stopped',
    latitude: 22.5800,
    longitude: 88.3500, // Inside Kolkata Hub
    heading: 0,
    speed: 0,
    fuelPercent: 88,
    engineHealth: 97,
    odometer: 43200,
    cargoWeight: 2400,
    safetyScore: 93,
    roiScore: 91,
    lastMaintenance: '2026-06-25',
    openAlerts: [],
    lastUpdated: 'Live'
  },
  {
    id: 'veh-08',
    registrationNumber: 'WB-04-G-7712',
    vehicleName: 'BharatBenz 2823R',
    vehicleType: 'Refrigerated Truck',
    driverName: 'Suman Banerjee',
    status: 'Idling',
    latitude: 23.5150,
    longitude: 87.3200, // Inside Durgapur Hub
    heading: 90,
    speed: 0,
    fuelPercent: 58,
    engineHealth: 90,
    odometer: 118400,
    cargoWeight: 0,
    safetyScore: 95,
    roiScore: 87,
    lastMaintenance: '2026-05-30',
    openAlerts: ['IDLING_EXCESSIVE_ALERT'],
    lastUpdated: 'Live'
  },
  {
    id: 'veh-09',
    registrationNumber: 'WB-15-H-1182',
    vehicleName: 'Tata Ace Gold',
    vehicleType: 'Mini Truck',
    driverName: 'Priya Mukherjee',
    status: 'Stopped',
    latitude: 26.7300,
    longitude: 88.4000, // Inside Siliguri Hub
    heading: 0,
    speed: 0,
    fuelPercent: 91,
    engineHealth: 95,
    odometer: 31000,
    cargoWeight: 0,
    safetyScore: 92,
    roiScore: 94,
    lastMaintenance: '2026-06-20',
    openAlerts: [],
    lastUpdated: 'Live'
  },
  {
    id: 'veh-10',
    registrationNumber: 'WB-40-K-9910',
    vehicleName: 'Mahindra Bolero Maxi Truck',
    vehicleType: 'Mini Truck',
    driverName: 'Sourav Ganguly',
    status: 'Maintenance',
    latitude: 22.5600,
    longitude: 88.3300, // Kolkata Workshop
    heading: 0,
    speed: 0,
    fuelPercent: 62,
    engineHealth: 68,
    odometer: 71200,
    cargoWeight: 0,
    safetyScore: 86,
    roiScore: 79,
    lastMaintenance: '2026-07-10',
    openAlerts: ['BR-012_WORKSHOP_LOCKOUT'],
    lastUpdated: 'Live'
  },
  {
    id: 'veh-11',
    registrationNumber: 'BR-01-L-5541',
    vehicleName: 'Tata LPT 1412',
    vehicleType: 'Light Commercial Vehicle',
    driverName: 'Koushik Dutta',
    status: 'Moving',
    latitude: 25.1000,
    longitude: 85.3000,
    heading: 10,
    speed: 55,
    fuelPercent: 74,
    engineHealth: 93,
    odometer: 94100,
    cargoWeight: 6500,
    safetyScore: 84,
    roiScore: 86,
    lastMaintenance: '2026-06-12',
    openAlerts: [],
    lastUpdated: 'Live'
  },
  {
    id: 'veh-12',
    registrationNumber: 'WB-01-M-2210',
    vehicleName: 'Eicher Pro 2049',
    vehicleType: 'Mini Truck',
    driverName: 'Animesh Paul',
    status: 'Idling',
    latitude: 23.3500,
    longitude: 85.3200, // Inside Ranchi Hub
    heading: 180,
    speed: 0,
    fuelPercent: 66,
    engineHealth: 88,
    odometer: 58200,
    cargoWeight: 0,
    safetyScore: 78,
    roiScore: 82,
    lastMaintenance: '2026-05-15',
    openAlerts: ['IDLING_EXCESSIVE_ALERT'],
    lastUpdated: 'Live'
  },
  {
    id: 'veh-13',
    registrationNumber: 'JH-05-N-8819',
    vehicleName: 'Tata Prima 3530.K',
    vehicleType: 'Container Truck',
    driverName: 'Manish Tiwari',
    status: 'Maintenance',
    latitude: 23.6800,
    longitude: 86.9600,
    heading: 0,
    speed: 0,
    fuelPercent: 49,
    engineHealth: 61,
    odometer: 145000,
    cargoWeight: 0,
    safetyScore: 74,
    roiScore: 73,
    lastMaintenance: '2026-07-11',
    openAlerts: ['BR-012_WORKSHOP_LOCKOUT'],
    lastUpdated: 'Live'
  },
  {
    id: 'veh-14',
    registrationNumber: 'WB-23-P-3310',
    vehicleName: 'Ashok Leyland Boss 1415',
    vehicleType: 'Light Commercial Vehicle',
    driverName: 'Prasenjit Mondal',
    status: 'Offline',
    latitude: 22.8046,
    longitude: 86.2029, // Jamshedpur Yard
    heading: 0,
    speed: 0,
    fuelPercent: 53,
    engineHealth: 89,
    odometer: 81400,
    cargoWeight: 0,
    safetyScore: 62,
    roiScore: 76,
    lastMaintenance: '2026-05-01',
    openAlerts: ['GPS_SIGNAL_OFFLINE_4H'],
    lastUpdated: 'Offline'
  },
  {
    id: 'veh-15',
    registrationNumber: 'BR-01-R-6621',
    vehicleName: 'BharatBenz 1217C',
    vehicleType: 'Light Commercial Vehicle',
    driverName: 'Sanjay Yadav',
    status: 'Stopped',
    latitude: 25.5900,
    longitude: 85.1400, // Patna Depot
    heading: 0,
    speed: 0,
    fuelPercent: 81,
    engineHealth: 94,
    odometer: 67100,
    cargoWeight: 0,
    safetyScore: 65,
    roiScore: 81,
    lastMaintenance: '2026-06-08',
    openAlerts: [],
    lastUpdated: 'Live'
  },
  {
    id: 'veh-16',
    registrationNumber: 'WB-73-S-4491',
    vehicleName: 'Mahindra Furio 16',
    vehicleType: 'Container Truck',
    driverName: 'Tapas Biswas',
    status: 'Moving',
    latitude: 24.8100,
    longitude: 88.2900,
    heading: 18,
    speed: 64,
    fuelPercent: 77,
    engineHealth: 95,
    odometer: 104200,
    cargoWeight: 13000,
    safetyScore: 64,
    roiScore: 85,
    lastMaintenance: '2026-06-14',
    openAlerts: [],
    lastUpdated: 'Live'
  },
  {
    id: 'veh-17',
    registrationNumber: 'WB-41-T-3310',
    vehicleName: 'Tata Intra V30',
    vehicleType: 'Pickup Van',
    driverName: 'Alok Bhattacharya',
    status: 'Stopped',
    latitude: 22.3460,
    longitude: 87.2320, // Kharagpur Hub
    heading: 0,
    speed: 0,
    fuelPercent: 85,
    engineHealth: 96,
    odometer: 48900,
    cargoWeight: 0,
    safetyScore: 90,
    roiScore: 90,
    lastMaintenance: '2026-06-22',
    openAlerts: [],
    lastUpdated: 'Live'
  },
  {
    id: 'veh-18',
    registrationNumber: 'OD-05-U-8810',
    vehicleName: 'Eicher Pro 6028',
    vehicleType: 'Container Truck',
    driverName: 'Chandan Halder',
    status: 'Moving',
    latitude: 20.8000,
    longitude: 86.4000,
    heading: 215,
    speed: 66,
    fuelPercent: 69,
    engineHealth: 93,
    odometer: 129000,
    cargoWeight: 16500,
    safetyScore: 89,
    roiScore: 89,
    lastMaintenance: '2026-06-05',
    openAlerts: [],
    lastUpdated: 'Live'
  },
  {
    id: 'veh-19',
    registrationNumber: 'WB-34-V-9901',
    vehicleName: 'Ashok Leyland Dost+',
    vehicleType: 'Mini Truck',
    driverName: 'Dipankar Maitra',
    status: 'Offline',
    latitude: 22.5700,
    longitude: 88.3600,
    heading: 0,
    speed: 0,
    fuelPercent: 72,
    engineHealth: 91,
    odometer: 52100,
    cargoWeight: 0,
    safetyScore: 88,
    roiScore: 88,
    lastMaintenance: '2026-05-28',
    openAlerts: ['GPS_SIGNAL_OFFLINE_4H'],
    lastUpdated: 'Offline'
  },
  {
    id: 'veh-20',
    registrationNumber: 'JH-01-W-4481',
    vehicleName: 'Tata Prima 2830.K',
    vehicleType: 'Container Truck',
    driverName: 'Gautam Nandi',
    status: 'Maintenance',
    latitude: 23.3300,
    longitude: 85.3100, // Ranchi Workshop
    heading: 0,
    speed: 0,
    fuelPercent: 55,
    engineHealth: 65,
    odometer: 138000,
    cargoWeight: 0,
    safetyScore: 93,
    roiScore: 78,
    lastMaintenance: '2026-07-09',
    openAlerts: ['BR-012_WORKSHOP_LOCKOUT'],
    lastUpdated: 'Live'
  },
  {
    id: 'veh-21',
    registrationNumber: 'WB-02-X-7710',
    vehicleName: 'BharatBenz 1923C',
    vehicleType: 'Container Truck',
    driverName: 'Indranil Bose',
    status: 'Moving',
    latitude: 24.1000,
    longitude: 88.2400,
    heading: 15,
    speed: 61,
    fuelPercent: 83,
    engineHealth: 97,
    odometer: 92300,
    cargoWeight: 14000,
    safetyScore: 97,
    roiScore: 94,
    lastMaintenance: '2026-06-19',
    openAlerts: [],
    lastUpdated: 'Live'
  },
  {
    id: 'veh-22',
    registrationNumber: 'WB-05-Y-5541',
    vehicleName: 'Mahindra Bolero Pickup',
    vehicleType: 'Pickup Van',
    driverName: 'Joydeep Sarkar',
    status: 'Stopped',
    latitude: 20.3000,
    longitude: 85.8300, // Inside Bhubaneswar Hub
    heading: 0,
    speed: 0,
    fuelPercent: 89,
    engineHealth: 96,
    odometer: 38400,
    cargoWeight: 0,
    safetyScore: 94,
    roiScore: 92,
    lastMaintenance: '2026-06-24',
    openAlerts: [],
    lastUpdated: 'Live'
  },
  {
    id: 'veh-23',
    registrationNumber: 'JH-05-Z-3391',
    vehicleName: 'Eicher Pro 3019',
    vehicleType: 'Light Commercial Vehicle',
    driverName: 'Kalyan Chakraborty',
    status: 'Moving',
    latitude: 23.4500,
    longitude: 86.1000,
    heading: 275,
    speed: 67,
    fuelPercent: 70,
    engineHealth: 94,
    odometer: 86500,
    cargoWeight: 8900,
    safetyScore: 91,
    roiScore: 89,
    lastMaintenance: '2026-06-16',
    openAlerts: [],
    lastUpdated: 'Live'
  },
  {
    id: 'veh-24',
    registrationNumber: 'WB-01-AA-8821',
    vehicleName: 'Tata Ace Gold',
    vehicleType: 'Mini Truck',
    driverName: 'Laltu Majumdar',
    status: 'Stopped',
    latitude: 22.5750,
    longitude: 88.3680,
    heading: 0,
    speed: 0,
    fuelPercent: 93,
    engineHealth: 98,
    odometer: 24100,
    cargoWeight: 0,
    safetyScore: 95,
    roiScore: 95,
    lastMaintenance: '2026-06-26',
    openAlerts: [],
    lastUpdated: 'Live'
  },
  {
    id: 'veh-25',
    registrationNumber: 'BR-01-AB-6611',
    vehicleName: 'Ashok Leyland Ecomet 1615',
    vehicleType: 'Refrigerated Truck',
    driverName: 'Manoj Sinha',
    status: 'Idling',
    latitude: 25.6000,
    longitude: 85.1500,
    heading: 0,
    speed: 0,
    fuelPercent: 67,
    engineHealth: 92,
    odometer: 99800,
    cargoWeight: 0,
    safetyScore: 89,
    roiScore: 87,
    lastMaintenance: '2026-06-09',
    openAlerts: ['IDLING_EXCESSIVE_ALERT'],
    lastUpdated: 'Live'
  }
]
