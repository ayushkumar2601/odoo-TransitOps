import {
  VehicleTelemetry,
  EASTERN_INDIA_HUBS,
  INITIAL_FLEET_TELEMETRY,
  HubGeoFence
} from './telemetry-data'
import {
  getHeadingFromWaypoints,
  getDynamicSpeed,
  getPrebuiltRoadRoute
} from './route-engine'

// Helper: Haversine distance between two lat/lng coordinates in km
export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
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
export function getVehicleGeoFenceStatus(
  lat: number,
  lon: number
): { inside: boolean; hub?: HubGeoFence } {
  for (const hub of EASTERN_INDIA_HUBS) {
    const distKm = getDistanceKm(lat, lon, hub.center[0], hub.center[1])
    if (distKm * 1000 <= hub.radiusMeters) {
      return { inside: true, hub }
    }
  }
  return { inside: false }
}

// Helper: Calculate total remaining km along remaining road waypoints
export function calculateRemainingRoadDistance(
  geom: [number, number][],
  currentIndex: number
): number {
  if (!geom || currentIndex >= geom.length - 1) return 0
  let total = 0
  for (let i = currentIndex; i < geom.length - 1; i++) {
    total += getDistanceKm(geom[i][0], geom[i][1], geom[i + 1][0], geom[i + 1][1])
  }
  return Math.round(total * 10) / 10
}

// 1. Simulate 1 Tick of Authentic Road Geometry Playback
export function simulateTick(
  vehicles: VehicleTelemetry[],
  speedMultiplier = 1,
  isTrafficDelay = false
): VehicleTelemetry[] {
  return vehicles.map(v => {
    if (v.status !== 'Moving' || !v.currentTrip || !v.currentTrip.routeGeometry) {
      return {
        ...v,
        lastUpdated: new Date().toLocaleTimeString('en-US', { hour12: false })
      }
    }

    const geom = v.currentTrip.routeGeometry
    const currIdx = v.currentTrip.currentRouteIndex ?? 0

    // Step advancement based on speed multiplier (1x -> 1 point, 2x -> 2 points, 5x -> 4 points, 10x -> 8 points)
    const stepAdvance = Math.max(1, Math.round(speedMultiplier * (isTrafficDelay ? 0.4 : 1)))
    let nextIdx = currIdx + stepAdvance

    if (nextIdx >= geom.length - 1) {
      // Reached destination corridor point -> loop back to origin or reverse smoothly for continuous demo
      nextIdx = 1
    }

    const currentPoint = geom[currIdx]
    const nextPoint = geom[nextIdx]
    const headingDeg = getHeadingFromWaypoints(currentPoint, nextPoint)
    const progressRatio = nextIdx / geom.length
    const dynamicSpeed = getDynamicSpeed(v.status, progressRatio, isTrafficDelay)

    const remainingKm = calculateRemainingRoadDistance(geom, nextIdx)
    const etaMins = Math.max(2, Math.round((remainingKm / Math.max(15, dynamicSpeed)) * 60))

    return {
      ...v,
      latitude: nextPoint[0],
      longitude: nextPoint[1],
      heading: headingDeg,
      speed: dynamicSpeed,
      currentTrip: {
        ...v.currentTrip,
        currentRouteIndex: nextIdx,
        progressPercent: Math.round(progressRatio * 100),
        distanceRemainingKm: remainingKm,
        etaMins
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
      // Find first Stopped vehicle and dispatch it on NH-12 / NH-27 Kolkata -> Siliguri corridor
      const stoppedIdx = vehicles.findIndex(v => v.status === 'Stopped')
      if (stoppedIdx === -1) {
        return { updatedVehicles: vehicles, message: 'All available vehicles are already dispatched or in shop.' }
      }
      const clone = [...vehicles]
      const target = clone[stoppedIdx]
      const roadRoute = getPrebuiltRoadRoute(0)
      clone[stoppedIdx] = {
        ...target,
        status: 'Moving',
        speed: 62,
        latitude: roadRoute.routeGeometry[0][0],
        longitude: roadRoute.routeGeometry[0][1],
        currentTrip: {
          tripCode: `TRP-SIM-${Math.floor(100 + Math.random() * 900)}`,
          source: 'Kolkata Port',
          destination: 'Siliguri Gateway',
          sourceCoords: roadRoute.routeGeometry[0],
          destCoords: roadRoute.routeGeometry[roadRoute.routeGeometry.length - 1],
          progressPercent: 2,
          distanceRemainingKm: roadRoute.totalDistanceKm,
          etaMins: roadRoute.estimatedDurationMins,
          primaryHighway: roadRoute.primaryHighway,
          routeGeometry: roadRoute.routeGeometry,
          currentRouteIndex: 1
        },
        openAlerts: [],
        lastUpdated: 'Live'
      }
      return {
        updatedVehicles: clone,
        message: `Simulated Road Dispatch: ${target.registrationNumber} dispatched on ${roadRoute.primaryHighway} (${roadRoute.totalDistanceKm} km).`
      }
    }

    case 'breakdown': {
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
        engineHealth: 29,
        openAlerts: ['ENGINE_OVERHEAT_CRITICAL', 'IMMEDIATE_ROADSIDE_ASSISTANCE'],
        lastUpdated: 'Live'
      }
      return {
        updatedVehicles: clone,
        message: `Simulated Breakdown: ${target.registrationNumber} engine overheated along ${target.currentTrip?.primaryHighway || 'Highway'}. Critical alert raised!`
      }
    }

    case 'traffic': {
      const clone = vehicles.map(v => {
        if (v.status === 'Moving' && v.currentTrip) {
          return {
            ...v,
            speed: Math.floor(8 + Math.random() * 7),
            currentTrip: {
              ...v.currentTrip,
              etaMins: Math.round(v.currentTrip.etaMins * 1.8)
            }
          }
        }
        return v
      })
      return {
        updatedVehicles: clone,
        message: 'Simulated Highway Congestion: Severe traffic bottleneck across NH-19 & NH-12. Speeds dropped to 8-15 km/h.'
      }
    }

    case 'fuel_drop': {
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
        message: 'Simulation reset to default 25-asset Eastern India road telemetry.'
      }
  }
}
