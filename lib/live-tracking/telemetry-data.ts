import { getPrebuiltRoadRoute } from './route-engine'

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
    primaryHighway?: string
    routeGeometry?: [number, number][]
    currentRouteIndex?: number
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

// Pre-generate authentic road routes for seeded active vehicles
const route1 = getPrebuiltRoadRoute(0) // Kolkata -> Siliguri
const route2 = getPrebuiltRoadRoute(1) // Howrah -> Ranchi
const route3 = getPrebuiltRoadRoute(2) // Durgapur -> Bhubaneswar
const route4 = getPrebuiltRoadRoute(3) // Kharagpur -> Jamshedpur
const route5 = getPrebuiltRoadRoute(4) // Asansol -> Patna
const route6 = getPrebuiltRoadRoute(5) // Kolkata -> Dhanbad

// 2. 25 Seeded Enterprise Fleet Telemetry Assets with Authentic Road Geometry
export const INITIAL_FLEET_TELEMETRY: VehicleTelemetry[] = [
  {
    id: 'veh-01',
    registrationNumber: 'WB-04-E-1042',
    vehicleName: 'Tata Prima 2830.K',
    vehicleType: 'Container Truck',
    driverName: 'Rahul Sharma',
    status: 'Moving',
    latitude: route1.routeGeometry[25][0],
    longitude: route1.routeGeometry[25][1],
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
      sourceCoords: route1.routeGeometry[0],
      destCoords: route1.routeGeometry[route1.routeGeometry.length - 1],
      progressPercent: 32,
      distanceRemainingKm: 380,
      etaMins: 340,
      primaryHighway: route1.primaryHighway,
      routeGeometry: route1.routeGeometry,
      currentRouteIndex: 25
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
    latitude: route2.routeGeometry[18][0],
    longitude: route2.routeGeometry[18][1],
    heading: 310,
    speed: 64,
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
      destination: 'Ranchi Industrial Yard',
      sourceCoords: route2.routeGeometry[0],
      destCoords: route2.routeGeometry[route2.routeGeometry.length - 1],
      progressPercent: 40,
      distanceRemainingKm: 240,
      etaMins: 220,
      primaryHighway: route2.primaryHighway,
      routeGeometry: route2.routeGeometry,
      currentRouteIndex: 18
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
    latitude: route3.routeGeometry[22][0],
    longitude: route3.routeGeometry[22][1],
    heading: 210,
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
      destination: 'Bhubaneswar Coastal Depot',
      sourceCoords: route3.routeGeometry[0],
      destCoords: route3.routeGeometry[route3.routeGeometry.length - 1],
      progressPercent: 48,
      distanceRemainingKm: 230,
      etaMins: 215,
      primaryHighway: route3.primaryHighway,
      routeGeometry: route3.routeGeometry,
      currentRouteIndex: 22
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
    latitude: route4.routeGeometry[12][0],
    longitude: route4.routeGeometry[12][1],
    heading: 290,
    speed: 71,
    fuelPercent: 14,
    engineHealth: 91,
    odometer: 76500,
    cargoWeight: 7800,
    safetyScore: 88,
    roiScore: 84,
    lastMaintenance: '2026-05-20',
    openAlerts: ['LOW_FUEL_ALERT', 'BR-004_EXPIRED_LICENSE_WARNING'],
    currentTrip: {
      tripCode: 'TRP-104',
      source: 'Kharagpur Hub',
      destination: 'Jamshedpur Yard',
      sourceCoords: route4.routeGeometry[0],
      destCoords: route4.routeGeometry[route4.routeGeometry.length - 1],
      progressPercent: 55,
      distanceRemainingKm: 62,
      etaMins: 55,
      primaryHighway: route4.primaryHighway,
      routeGeometry: route4.routeGeometry,
      currentRouteIndex: 12
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
    latitude: route5.routeGeometry[16][0],
    longitude: route5.routeGeometry[16][1],
    heading: 325,
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
      source: 'Asansol Terminal',
      destination: 'Patna Freight Depot',
      sourceCoords: route5.routeGeometry[0],
      destCoords: route5.routeGeometry[route5.routeGeometry.length - 1],
      progressPercent: 50,
      distanceRemainingKm: 170,
      etaMins: 155,
      primaryHighway: route5.primaryHighway,
      routeGeometry: route5.routeGeometry,
      currentRouteIndex: 16
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
    latitude: route6.routeGeometry[14][0],
    longitude: route6.routeGeometry[14][1],
    heading: 310,
    speed: 0,
    fuelPercent: 44,
    engineHealth: 42,
    odometer: 98100,
    cargoWeight: 11000,
    safetyScore: 87,
    roiScore: 71,
    lastMaintenance: '2026-04-10',
    openAlerts: ['ENGINE_OVERHEAT_CRITICAL', 'MAINTENANCE_OVERDUE'],
    currentTrip: {
      tripCode: 'TRP-106',
      source: 'Kolkata Port',
      destination: 'Dhanbad Mining Hub',
      sourceCoords: route6.routeGeometry[0],
      destCoords: route6.routeGeometry[route6.routeGeometry.length - 1],
      progressPercent: 48,
      distanceRemainingKm: 140,
      etaMins: 999,
      primaryHighway: route6.primaryHighway,
      routeGeometry: route6.routeGeometry,
      currentRouteIndex: 14
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
    longitude: 88.3500,
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
    longitude: 87.3200,
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
    longitude: 88.4000,
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
    longitude: 88.3300,
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
    latitude: route1.routeGeometry[38][0],
    longitude: route1.routeGeometry[38][1],
    heading: 10,
    speed: 61,
    fuelPercent: 74,
    engineHealth: 93,
    odometer: 94100,
    cargoWeight: 6500,
    safetyScore: 84,
    roiScore: 86,
    lastMaintenance: '2026-06-12',
    openAlerts: [],
    currentTrip: {
      tripCode: 'TRP-107',
      source: 'Kolkata Port',
      destination: 'Siliguri Gateway',
      sourceCoords: route1.routeGeometry[0],
      destCoords: route1.routeGeometry[route1.routeGeometry.length - 1],
      progressPercent: 55,
      distanceRemainingKm: 260,
      etaMins: 235,
      primaryHighway: route1.primaryHighway,
      routeGeometry: route1.routeGeometry,
      currentRouteIndex: 38
    },
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
    longitude: 85.3200,
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
    longitude: 86.2029,
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
    longitude: 85.1400,
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
    latitude: route2.routeGeometry[30][0],
    longitude: route2.routeGeometry[30][1],
    heading: 295,
    speed: 67,
    fuelPercent: 77,
    engineHealth: 95,
    odometer: 104200,
    cargoWeight: 13000,
    safetyScore: 64,
    roiScore: 85,
    lastMaintenance: '2026-06-14',
    openAlerts: [],
    currentTrip: {
      tripCode: 'TRP-108',
      source: 'Howrah Logistics Park',
      destination: 'Ranchi Industrial Yard',
      sourceCoords: route2.routeGeometry[0],
      destCoords: route2.routeGeometry[route2.routeGeometry.length - 1],
      progressPercent: 65,
      distanceRemainingKm: 145,
      etaMins: 130,
      primaryHighway: route2.primaryHighway,
      routeGeometry: route2.routeGeometry,
      currentRouteIndex: 30
    },
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
    longitude: 87.2320,
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
    latitude: route3.routeGeometry[35][0],
    longitude: route3.routeGeometry[35][1],
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
    currentTrip: {
      tripCode: 'TRP-109',
      source: 'Durgapur Steel Hub',
      destination: 'Bhubaneswar Coastal Depot',
      sourceCoords: route3.routeGeometry[0],
      destCoords: route3.routeGeometry[route3.routeGeometry.length - 1],
      progressPercent: 75,
      distanceRemainingKm: 115,
      etaMins: 105,
      primaryHighway: route3.primaryHighway,
      routeGeometry: route3.routeGeometry,
      currentRouteIndex: 35
    },
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
    longitude: 85.3100,
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
    latitude: route1.routeGeometry[15][0],
    longitude: route1.routeGeometry[15][1],
    heading: 15,
    speed: 63,
    fuelPercent: 83,
    engineHealth: 97,
    odometer: 92300,
    cargoWeight: 14000,
    safetyScore: 97,
    roiScore: 94,
    lastMaintenance: '2026-06-19',
    openAlerts: [],
    currentTrip: {
      tripCode: 'TRP-110',
      source: 'Kolkata Port',
      destination: 'Siliguri Gateway',
      sourceCoords: route1.routeGeometry[0],
      destCoords: route1.routeGeometry[route1.routeGeometry.length - 1],
      progressPercent: 20,
      distanceRemainingKm: 460,
      etaMins: 410,
      primaryHighway: route1.primaryHighway,
      routeGeometry: route1.routeGeometry,
      currentRouteIndex: 15
    },
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
    longitude: 85.8300,
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
    latitude: route5.routeGeometry[24][0],
    longitude: route5.routeGeometry[24][1],
    heading: 275,
    speed: 68,
    fuelPercent: 70,
    engineHealth: 94,
    odometer: 86500,
    cargoWeight: 8900,
    safetyScore: 91,
    roiScore: 89,
    lastMaintenance: '2026-06-16',
    openAlerts: [],
    currentTrip: {
      tripCode: 'TRP-111',
      source: 'Asansol Terminal',
      destination: 'Patna Freight Depot',
      sourceCoords: route5.routeGeometry[0],
      destCoords: route5.routeGeometry[route5.routeGeometry.length - 1],
      progressPercent: 70,
      distanceRemainingKm: 102,
      etaMins: 95,
      primaryHighway: route5.primaryHighway,
      routeGeometry: route5.routeGeometry,
      currentRouteIndex: 24
    },
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
