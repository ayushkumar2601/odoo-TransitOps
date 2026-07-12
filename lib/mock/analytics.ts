import { store } from './helpers'

export interface VehicleROIMetric {
  id: string
  registrationNumber: string
  vehicleName: string
  vehicleType: string
  acquisitionCost: number
  revenue: number
  fuelCost: number
  maintenanceCost: number
  roiPercent: number
}

export function getAnalyticsSummary() {
  const allVehicles = store.vehicles
  const allTrips = store.trips
  const allFuel = store.fuelLogs
  const allMaint = store.maintenanceLogs
  const allExpenses = store.expenses

  // 1. Fleet Utilization Formula: (Vehicles On Trip / Total Fleet) × 100
  const totalVehicles = allVehicles.length
  const onTripVehicles = allVehicles.filter(v => v.status === 'On Trip').length
  const fleetUtilizationRate = totalVehicles > 0 ? Number(((onTripVehicles / totalVehicles) * 100).toFixed(1)) : 0

  // 2. Vehicle ROI Leaderboard & Rankings
  // Formula: (Revenue - Fuel - Maintenance) / Acquisition Cost
  const vehicleROIRanking: VehicleROIMetric[] = allVehicles.map(veh => {
    // Sum revenue from completed/dispatched trips
    const vehTrips = allTrips.filter(t => t.vehicleId === veh.id && (t.status === 'Completed' || t.status === 'Dispatched'))
    const revenue = vehTrips.reduce((acc, t) => acc + (t.actualRevenue || t.plannedRevenue), 0)

    // Sum fuel cost
    const vehFuel = allFuel.filter(f => f.vehicleId === veh.id)
    const fuelCost = vehFuel.reduce((acc, f) => acc + f.cost, 0)

    // Sum maintenance cost
    const vehMaint = allMaint.filter(m => m.vehicleId === veh.id)
    const maintenanceCost = vehMaint.reduce((acc, m) => acc + m.cost, 0)

    const netYield = revenue - fuelCost - maintenanceCost
    const roiPercent = veh.acquisitionCost > 0 ? Number(((netYield / veh.acquisitionCost) * 100).toFixed(2)) : 0

    return {
      id: veh.id,
      registrationNumber: veh.registrationNumber,
      vehicleName: veh.vehicleName,
      vehicleType: veh.vehicleType,
      acquisitionCost: veh.acquisitionCost,
      revenue,
      fuelCost,
      maintenanceCost,
      roiPercent
    }
  }).sort((a, b) => b.roiPercent - a.roiPercent)

  // 3. Operational Cost Breakdown
  const totalFuelCost = allFuel.reduce((acc, f) => acc + f.cost, 0)
  const totalMaintCost = allMaint.reduce((acc, m) => acc + m.cost, 0)
  const totalOtherExpenses = allExpenses.filter(e => e.category !== 'Fuel' && e.category !== 'Maintenance').reduce((acc, e) => acc + e.amount, 0)

  const operationalCostBreakdown = [
    { category: 'Fuel Haulage', amount: totalFuelCost },
    { category: 'Workshop Maintenance', amount: totalMaintCost },
    { category: 'Toll & Operational', amount: totalOtherExpenses }
  ]

  // 4. Fleet Status Distribution
  const statusCounts = {
    Available: allVehicles.filter(v => v.status === 'Available').length,
    'On Trip': allVehicles.filter(v => v.status === 'On Trip').length,
    'In Shop': allVehicles.filter(v => v.status === 'In Shop').length,
    Retired: allVehicles.filter(v => v.status === 'Retired').length
  }
  const fleetStatusDistribution = [
    { name: 'Available', value: statusCounts.Available },
    { name: 'On Trip', value: statusCounts['On Trip'] },
    { name: 'In Shop', value: statusCounts['In Shop'] },
    { name: 'Retired', value: statusCounts.Retired }
  ]

  // 5. Utilization Trend (6-month simulation derived consistently)
  const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  const utilizationTrend = months.map((m, idx) => ({
    month: m,
    utilization: idx === 5 ? fleetUtilizationRate : Math.min(85, Math.max(18, Math.round(fleetUtilizationRate + (idx - 3) * 3)))
  }))

  return {
    total_vehicles: totalVehicles,
    vehicles_on_trip: onTripVehicles,
    fleet_utilization_rate: fleetUtilizationRate,
    vehicle_roi_ranking: vehicleROIRanking,
    operational_cost_breakdown: operationalCostBreakdown,
    fleet_status_distribution: fleetStatusDistribution,
    utilization_trend: utilizationTrend
  }
}
