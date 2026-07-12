import { EASTERN_INDIA_ROAD_ROUTES, densifyRoadGeometry, RoadRouteGeometry } from './prebuilt-routes'

export interface RoadRouteResult {
  routeId: string
  routeCode: string
  primaryHighway: string
  routeGeometry: [number, number][] // Full densified road waypoints [lat, lng]
  totalDistanceKm: number
  estimatedDurationMins: number
}

// Calculate true compass heading (0-360 deg) between two coordinate points
export function getHeadingFromWaypoints(p1: [number, number], p2: [number, number]): number {
  const dLat = p2[0] - p1[0]
  const dLon = p2[1] - p1[1]
  const angleRad = Math.atan2(dLon, dLat)
  let headingDeg = Math.round((angleRad * 180) / Math.PI)
  if (headingDeg < 0) headingDeg += 360
  return headingDeg
}

// Dynamic realistic speed generator based on road segment type & traffic scenario
export function getDynamicSpeed(
  status: string,
  progressRatio: number,
  isTrafficDelay = false
): number {
  if (status === 'Stopped' || status === 'Idling' || status === 'Breakdown' || status === 'Maintenance') {
    return 0
  }
  if (isTrafficDelay) {
    return Math.floor(8 + Math.random() * 8) // 8 - 15 km/h traffic jam
  }
  // City departure / arrival segments (first 15% or last 15% of corridor)
  if (progressRatio <= 0.15 || progressRatio >= 0.85) {
    return Math.floor(25 + Math.random() * 20) // 25 - 45 km/h city navigation
  }
  // Expressway / National Highway open cruise
  return Math.floor(55 + Math.random() * 20) // 55 - 75 km/h highway speed
}

// Fetch real road route geometry from OSRM or fallback to prebuilt highway corridor
export async function generateRoadRoute(params: {
  sourceLat: number
  sourceLng: number
  destinationLat: number
  destinationLng: number
  fallbackRouteIndex?: number
}): Promise<RoadRouteResult> {
  const fallbackIdx = params.fallbackRouteIndex ?? 0
  const prebuilt =
    EASTERN_INDIA_ROAD_ROUTES[fallbackIdx % EASTERN_INDIA_ROAD_ROUTES.length]

  try {
    // Attempt live OSRM public API fetch for true road geometry
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${params.sourceLng},${params.sourceLat};${params.destinationLng},${params.destinationLat}?overview=full&geometries=geojson`
    const res = await fetch(osrmUrl, { signal: AbortSignal.timeout(3500) })
    if (res.ok) {
      const data = await res.json()
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0]
        const coords: [number, number][] = route.geometry.coordinates.map(
          (c: [number, number]) => [c[1], c[0]] // OSRM returns [lon, lat] -> convert to [lat, lon]
        )
        const distKm = Math.round((route.distance / 1000) * 10) / 10
        const durMins = Math.round(route.duration / 60)
        return {
          routeId: `osrm-${Math.floor(100 + Math.random() * 900)}`,
          routeCode: prebuilt.code,
          primaryHighway: 'OSRM Live Highway Network',
          routeGeometry: densifyRoadGeometry(coords, 3),
          totalDistanceKm: distKm,
          estimatedDurationMins: durMins
        }
      }
    }
  } catch (err) {
    // Silently fall back to cached authentic road geometries if OSRM times out
  }

  return {
    routeId: prebuilt.id,
    routeCode: prebuilt.code,
    primaryHighway: prebuilt.primaryHighway,
    routeGeometry: densifyRoadGeometry(prebuilt.roadPath, 8),
    totalDistanceKm: prebuilt.totalDistanceKm,
    estimatedDurationMins: prebuilt.estimatedDurationMins
  }
}

// Synchronous road route loader for seeded telemetry
export function getPrebuiltRoadRoute(index: number): RoadRouteResult {
  const prebuilt = EASTERN_INDIA_ROAD_ROUTES[index % EASTERN_INDIA_ROAD_ROUTES.length]
  return {
    routeId: prebuilt.id,
    routeCode: prebuilt.code,
    primaryHighway: prebuilt.primaryHighway,
    routeGeometry: densifyRoadGeometry(prebuilt.roadPath, 8),
    totalDistanceKm: prebuilt.totalDistanceKm,
    estimatedDurationMins: prebuilt.estimatedDurationMins
  }
}
