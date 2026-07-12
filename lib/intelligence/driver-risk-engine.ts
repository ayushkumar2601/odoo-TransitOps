import { Driver } from '@/lib/mock/transitops-data'

export interface DriverRiskProfile {
  driverId: string
  driverName: string
  licenseNumber: string
  safetyScore: number
  riskScore: number // 0 (safest) to 100 (highest risk)
  riskLevel: 'Low' | 'Medium' | 'High'
  riskFactors: string[]
  recommendedActions: string[]
}

export function evaluateDriverRisk(driver: Driver): DriverRiskProfile {
  const factors: string[] = []
  const actions: string[] = []

  // Calculate base risk score inversely from safetyScore (100 - safetyScore)
  let riskScore = Math.max(5, 100 - driver.safetyScore)

  if (driver.safetyScore < 75) {
    factors.push('Habitual harsh braking and acceleration events logged')
    actions.push('Enroll operator in defensive driving refresher course')
    riskScore += 15
  }
  if (driver.status === 'Suspended') {
    factors.push('Statutory license suspension or regulatory disciplinary hold')
    actions.push('Complete compliance review prior to dispatch reinstatement')
    riskScore += 40
  }
  if (driver.totalTrips < 5) {
    factors.push('Probationary operator with limited Eastern India corridor experience')
    actions.push('Assign supervisory buddy driver on night highway transit')
    riskScore += 10
  }

  if (factors.length === 0) {
    factors.push('Exemplary safety record across 25+ corridor haulage missions')
    actions.push('Maintain quarterly safety compliance incentive bonus')
  }

  riskScore = Math.max(5, Math.min(98, Math.round(riskScore)))

  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low'
  if (riskScore >= 60 || driver.status === 'Suspended') riskLevel = 'High'
  else if (riskScore >= 35) riskLevel = 'Medium'

  return {
    driverId: driver.id,
    driverName: driver.name,
    licenseNumber: driver.licenseNumber,
    safetyScore: driver.safetyScore,
    riskScore,
    riskLevel,
    riskFactors: factors,
    recommendedActions: actions
  }
}
