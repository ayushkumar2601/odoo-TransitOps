import { VehicleTelemetry } from '@/lib/live-tracking'

export interface VehicleDigitalTwin {
  vehicleId: string
  registrationNumber: string
  vehicleName: string
  vehicleType: string
  healthScore: number // 0 - 100
  healthGrade: 'A+' | 'A' | 'B' | 'C' | 'D'
  roiRank: number
  maintenanceRisk: 'Low' | 'Moderate' | 'Critical'
  breakdownRiskPercent: number
  nextServiceDays: number
  efficiencyTrend: number // e.g. +3.2% or -1.8%
  lifecycleStage: 'New Asset' | 'Peak Efficiency' | 'Mature Asset' | 'High Maintenance' | 'Retirement Candidate'
  odometerKm: number
  fuelPercent: number
  engineHealth: number
  safetyScore: number
}

export function generateVehicleDigitalTwin(
  v: VehicleTelemetry,
  rank = 1
): VehicleDigitalTwin {
  // 1. Calculate Health Score based on odometer, engineHealth, safetyScore, and openAlerts
  let baseScore = v.engineHealth * 0.45 + v.safetyScore * 0.35 + (v.roiScore || 85) * 0.2
  // Penalize for open alerts or breakdown status
  if (v.status === 'Breakdown') baseScore -= 28
  if (v.status === 'Maintenance') baseScore -= 15
  if (v.openAlerts && v.openAlerts.length > 0) baseScore -= v.openAlerts.length * 4
  // Age/odometer penalty
  if (v.odometer > 130000) baseScore -= 8
  else if (v.odometer > 90000) baseScore -= 4

  const healthScore = Math.max(10, Math.min(100, Math.round(baseScore)))

  // 2. Derive Letter Grade
  let healthGrade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'A'
  if (healthScore >= 95) healthGrade = 'A+'
  else if (healthScore >= 88) healthGrade = 'A'
  else if (healthScore >= 78) healthGrade = 'B'
  else if (healthScore >= 65) healthGrade = 'C'
  else healthGrade = 'D'

  // 3. Derive Lifecycle Stage
  let lifecycleStage: VehicleDigitalTwin['lifecycleStage'] = 'Peak Efficiency'
  if (v.odometer < 35000) {
    lifecycleStage = 'New Asset'
  } else if (v.odometer < 85000) {
    lifecycleStage = 'Peak Efficiency'
  } else if (v.odometer < 120000) {
    lifecycleStage = 'Mature Asset'
  } else if (healthScore < 65 || v.odometer >= 140000) {
    lifecycleStage = 'Retirement Candidate'
  } else {
    lifecycleStage = 'High Maintenance'
  }

  // 4. Derive Maintenance & Breakdown Risk
  let maintenanceRisk: 'Low' | 'Moderate' | 'Critical' = 'Low'
  if (healthScore < 65 || v.status === 'Breakdown') maintenanceRisk = 'Critical'
  else if (healthScore < 82 || v.openAlerts.length > 0) maintenanceRisk = 'Moderate'

  const breakdownRiskPercent = Math.max(
    3,
    Math.min(96, Math.round(100 - v.engineHealth + (v.openAlerts.length * 12)))
  )

  // 5. Next Service Days calculation
  const nextServiceDays = Math.max(
    1,
    Math.round(45 - (v.odometer % 15000) / 350 - (100 - healthScore) * 0.3)
  )

  // 6. Fuel Efficiency Trend %
  const efficiencyTrend = Math.round((v.roiScore - 85) * 10) / 10

  return {
    vehicleId: v.id,
    registrationNumber: v.registrationNumber,
    vehicleName: v.vehicleName,
    vehicleType: v.vehicleType,
    healthScore,
    healthGrade,
    roiRank: rank,
    maintenanceRisk,
    breakdownRiskPercent,
    nextServiceDays,
    efficiencyTrend,
    lifecycleStage,
    odometerKm: v.odometer,
    fuelPercent: v.fuelPercent,
    engineHealth: v.engineHealth,
    safetyScore: v.safetyScore
  }
}

export function getAllFleetDigitalTwins(vehicles: VehicleTelemetry[]): VehicleDigitalTwin[] {
  // Sort by healthScore desc to assign roiRank
  const twins = vehicles.map((v, i) => generateVehicleDigitalTwin(v, i + 1))
  twins.sort((a, b) => b.healthScore - a.healthScore)
  return twins.map((t, index) => ({
    ...t,
    roiRank: index + 1
  }))
}
