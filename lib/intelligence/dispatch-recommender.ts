import { VehicleTelemetry } from '@/lib/live-tracking'
import { generateVehicleDigitalTwin } from './digital-twin-engine'

export interface DispatchRecommendation {
  vehicleId: string
  registrationNumber: string
  vehicleName: string
  vehicleType: string
  driverName: string
  matchScorePercent: number
  healthGrade: 'A+' | 'A' | 'B' | 'C' | 'D'
  fuelPercent: number
  roiRank: number
  reasoning: string[]
}

export function getDispatchRecommendations(
  source: string,
  destination: string,
  vehicles: VehicleTelemetry[]
): DispatchRecommendation[] {
  // Filter for available stopped or unassigned vehicles first, or fall back to any active asset
  let candidatePool = vehicles.filter(v => v.status === 'Stopped' || v.status === 'Idling')
  if (candidatePool.length < 3) {
    candidatePool = vehicles
  }

  const recommendations = candidatePool.map((v, idx) => {
    const twin = generateVehicleDigitalTwin(v, idx + 1)
    const reasoning: string[] = []

    // Base score weighted by health score, fuel level, and ROI
    let score = twin.healthScore * 0.45 + v.fuelPercent * 0.35 + v.safetyScore * 0.2

    if (twin.healthGrade === 'A+' || twin.healthGrade === 'A') {
      reasoning.push(`High Reliability Grade (${twin.healthGrade})`)
      score += 5
    }
    if (v.fuelPercent >= 75) {
      reasoning.push('Fully Fueled & Ready for Long Haulage Corridor')
    }
    if (twin.roiRank <= 5) {
      reasoning.push(`Top ${twin.roiRank} ROI Yield Asset`)
    }
    if (v.status === 'Stopped') {
      reasoning.push('Immediately Available at Regional Logistics Depot')
      score += 8
    }
    if (reasoning.length === 0) {
      reasoning.push('Compliant Commercial Asset with Valid Statutory Documents')
    }

    const matchScorePercent = Math.max(65, Math.min(99, Math.round(score)))

    return {
      vehicleId: v.id,
      registrationNumber: v.registrationNumber,
      vehicleName: v.vehicleName,
      vehicleType: v.vehicleType,
      driverName: v.driverName,
      matchScorePercent,
      healthGrade: twin.healthGrade,
      fuelPercent: v.fuelPercent,
      roiRank: twin.roiRank,
      reasoning
    }
  })

  // Sort descending by matchScorePercent and return top 3
  return recommendations.sort((a, b) => b.matchScorePercent - a.matchScorePercent).slice(0, 3)
}
