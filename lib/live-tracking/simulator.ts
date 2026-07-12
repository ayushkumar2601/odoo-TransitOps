import { VehicleTelemetry, EASTERN_INDIA_HUBS, LOGISTICS_CORRIDORS, INITIAL_FLEET_TELEMETRY, HubGeoFence } from './telemetry-data'

// Helper: Distance between two lat/lng coordinates in km (Haversine formula)
export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10
}

// Helper: Determine if vehicle is inside any Eastern India hub geofence
export function getVehicleGeoFenceStatus(lat: number, lon: number): { inside: boolean; hub?: HubGeoFence } {
  for (const hub of EASTERN_INDIA_HUBS) {
    const distKm = getDistanceKm(lat, lon, hub.center[0], hub.center[1])
    if (distKm * 1000 <= hub.radiusMeters) {
      return { inside: true, hub }
    }
  }
  return { inside: false }
}

// 1. Simulate 1 Tick (approx 3 seconds of high-precision movement along route)
export function simulateTick(vehicles: VehicleTelemetry[]): VehicleTelemetry[] {
  return vehicles.map(v => {
    if (v.status !== 'Moving' || !v.currentTrip) {
      return {
        ...v,
        lastUpdated: new Date().toLocaleTimeString('en-US', { hour12: false })
      }
    }

    const dest = v.currentTrip.destCoords
    const currentLat = v.latitude
    const currentLon = v.longitude

    // Step size ~ 0.015 deg per tick for visible demo movement
    const dLat = dest[0] - currentLat
    const dLon = dest[1] - currentLon
    const distanceToDest = Math.sqrt(dLat * dLat + dLon * dLon)

    if (distanceToDest < 0.02) {
      // Reached destination corridor point -> swap or bounce back slightly to keep active
      return {
        ...v,
        latitude: dest[0] - 0.1,
        longitude: dest[1] - 0.1,
        lastUpdated: new Date().toLocaleTimeString('en-US', { hour12: false })
      }
    }

    const stepFactor = 0.008
    const nextLat = currentLat + dLat * stepFactor
    const nextLon = currentLon + dLon * stepFactor

    // Heading calculation
    const angleRad = Math.atan2(dLon, dLat)
    let headingDeg = Math.round((angleRad * 180) / Math.PI)
    if (headingDeg < 0) headingDeg += 360

    const remainingKm = getDistanceKm(nextLat, nextLon, dest[0], dest[1])
    const eta = Math.max(5, Math.round((remainingKm / Math.max(1, v.speed)) * 60))

    return {
      ...v,
      latitude: Math.round(nextLat * 10000) / 10000,
      longitude: Math.round(nextLon * 10000) / 10000,
      heading: headingDeg,
      currentTrip: {
        ...v.currentTrip,
        distanceRemainingKm: remainingKm,
        etaMins: eta
      },
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour12: false })
    }
  })
}

// 2. Demo Scenario Execution
export type DemoScenarioType = 'dispatch' | 'breakdown' | 'traffic' | 'fuel_drop' | 'reset'

export function applyDemoScenario(
  vehicles: VehicleTelemetry[],
  scenario: DemoScenarioType
): { updatedVehicles: VehicleTelemetry[]; message: string } {
  switch (scenario) {
    case 'dispatch': {
      // Find first Stopped vehicle and dispatch it on Corridor 1
      const stoppedIdx = vehicles.findIndex(v => v.status === 'Stopped')
      if (stoppedIdx === -1) {
        return { updatedVehicles: vehicles, message: 'All available vehicles are already dispatched or in shop.' }
      }
      const clone = [...vehicles]
      const target = clone[stoppedIdx]
      const corridor = LOGISTICS_CORRIDORS[0]
      clone[stoppedIdx] = {
        ...target,
        status: 'Moving',
        speed: 65,
        latitude: corridor.sourceCoords[0],
        longitude: corridor.sourceCoords[1],
        currentTrip: {
          tripCode: `TRP-SIM-${Math.floor(100 + Math.random() * 900)}`,
          source: corridor.source,
          destination: corridor.destination,
          sourceCoords: corridor.sourceCoords,
          destCoords: corridor.destCoords,
          progressPercent: 5,
          distanceRemainingKm: corridor.totalDistanceKm,
          etaMins: Math.round((corridor.totalDistanceKm / 65) * 60)
        },
        openAlerts: [],
        lastUpdated: 'Live'
      }
      return {
        updatedVehicles: clone,
        message: `Simulated Dispatch: ${target.registrationNumber} (${target.vehicleName}) dispatched on ${corridor.source} → ${corridor.destination}.`
      }
    }

    case 'breakdown': {
      // Pick first Moving vehicle and trigger immediate engine breakdown
      const movingIdx = vehicles.findIndex(v => v.status === 'Moving')
      if (movingIdx === -1) {
        return { updatedVehicles: vehicles, message: 'No moving vehicle found to simulate breakdown.' }
      }
      const clone = [...vehicles]
      const target = clone[movingIdx]
      clone[movingIdx] = {
        ...target,
        status: 'Breakdown',
        speed: 0,
        engineHealth: 31,
        openAlerts: ['ENGINE_OVERHEAT_CRITICAL', 'IMMEDIATE_ROADSIDE_ASSISTANCE'],
        lastUpdated: 'Live'
      }
      return {
        updatedVehicles: clone,
        message: `Simulated Breakdown: ${target.registrationNumber} engine overheated near ${target.currentTrip?.destination || 'Corridor'}. Critical alert raised!`
      }
    }

    case 'traffic': {
      // Slow down all moving vehicles by 50%
      const clone = vehicles.map(v => {
        if (v.status === 'Moving' && v.currentTrip) {
          const newSpeed = Math.max(25, Math.round(v.speed * 0.5))
          return {
            ...v,
            speed: newSpeed,
            currentTrip: {
              ...v.currentTrip,
              etaMins: Math.round(v.currentTrip.etaMins * 1.6)
            }
          }
        }
        return v
      })
      return {
        updatedVehicles: clone,
        message: 'Simulated Traffic Delay: Highway congestion detected across National Highway NH-19. Speeds reduced and ETAs adjusted.'
      }
    }

    case 'fuel_drop': {
      // Pick vehicle 01 or first moving vehicle and drop fuel to 11%
      const clone = [...vehicles]
      clone[0] = {
        ...clone[0],
        fuelPercent: 11,
        openAlerts: ['LOW_FUEL_ALERT', 'REFUEL_REQUIRED_URGENT']
      }
      return {
        updatedVehicles: clone,
        message: `Simulated Fuel Drop: ${clone[0].registrationNumber} fuel level dropped to 11%. Smart Alert triggered!`
      }
    }

    case 'reset':
    default:
      return {
        updatedVehicles: INITIAL_FLEET_TELEMETRY.map(v => ({ ...v })),
        message: 'Simulation reset to default 25-asset Eastern India fleet telemetry.'
      }
  }
}
