import { transitopsStore } from '../utils/transitopsStore.js'

export async function getDashboardSummary(req, res) {
  try {
    const vehicles = transitopsStore.vehicles
    const drivers = transitopsStore.drivers
    const trips = transitopsStore.trips

    const activeVehicles = vehicles.filter(v => v.status === 'On Trip').length
    const availableVehicles = vehicles.filter(v => v.status === 'Available').length
    const inMaintenanceVehicles = vehicles.filter(v => v.status === 'In Shop').length
    const retiredVehicles = vehicles.filter(v => v.status === 'Retired').length
    const totalFleetSize = vehicles.filter(v => v.status !== 'Retired').length || 1

    const fleetUtilization = Number(((activeVehicles / totalFleetSize) * 100).toFixed(2))

    const activeTrips = trips.filter(t => t.status === 'Dispatched').length
    const pendingTrips = trips.filter(t => t.status === 'Draft').length
    const completedTrips = trips.filter(t => t.status === 'Completed').length

    const driversOnDuty = drivers.filter(d => d.status === 'On Trip').length
    const availableDrivers = drivers.filter(d => d.status === 'Available').length
    const suspendedDrivers = drivers.filter(d => d.status === 'Suspended').length

    return res.json({
      success: true,
      data: {
        kpi: {
          active_vehicles: activeVehicles,
          available_vehicles: availableVehicles,
          in_maintenance_vehicles: inMaintenanceVehicles,
          retired_vehicles: retiredVehicles,
          total_vehicles: vehicles.length,
          active_trips: activeTrips,
          pending_trips: pendingTrips,
          completed_trips: completedTrips,
          drivers_on_duty: driversOnDuty,
          available_drivers: availableDrivers,
          suspended_drivers: suspendedDrivers,
          fleet_utilization_percent: fleetUtilization
        }
      }
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

export async function getComprehensiveAnalytics(req, res) {
  try {
    const vehicles = transitopsStore.vehicles
    const trips = transitopsStore.trips
    const fuelLogs = transitopsStore.fuel_logs
    const maintenanceLogs = transitopsStore.maintenance_logs
    const expenses = transitopsStore.expenses

    // 1. Vehicle ROI Ranking
    const vehicleRoiRanking = vehicles.map(v => {
      const vTrips = trips.filter(t => t.vehicle_id === v.id)
      const vFuel = fuelLogs.filter(f => f.vehicle_id === v.id)
      const vMaint = maintenanceLogs.filter(m => m.vehicle_id === v.id)

      const revenue = vTrips.reduce((acc, t) => acc + Number(t.actual_revenue || t.planned_revenue || 0), 0)
      const fuelCost = vFuel.reduce((acc, f) => acc + Number(f.cost || 0), 0)
      const maintCost = vMaint.reduce((acc, m) => acc + Number(m.cost || 0), 0)
      const acqCost = Number(v.acquisition_cost || 1000000)

      const roi = acqCost > 0 ? ((revenue - fuelCost - maintCost) / acqCost) * 100 : 0
      return {
        id: v.id,
        registration_number: v.registration_number,
        vehicle_name: v.vehicle_name,
        revenue,
        fuel_cost: fuelCost,
        maintenance_cost: maintCost,
        roi_percent: Number(roi.toFixed(2))
      }
    }).sort((a, b) => b.roi_percent - a.roi_percent)

    // 2. Fleet Status Distribution
    const fleetStatusDistribution = [
      { name: 'Available', value: vehicles.filter(v => v.status === 'Available').length },
      { name: 'On Trip', value: vehicles.filter(v => v.status === 'On Trip').length },
      { name: 'In Shop', value: vehicles.filter(v => v.status === 'In Shop').length },
      { name: 'Retired', value: vehicles.filter(v => v.status === 'Retired').length }
    ]

    // 3. Trip Status Distribution
    const tripStatusDistribution = [
      { name: 'Completed', value: trips.filter(t => t.status === 'Completed').length },
      { name: 'Dispatched', value: trips.filter(t => t.status === 'Dispatched').length },
      { name: 'Draft', value: trips.filter(t => t.status === 'Draft').length },
      { name: 'Cancelled', value: trips.filter(t => t.status === 'Cancelled').length }
    ]

    // 4. Fuel Efficiency per Vehicle
    const fuelEfficiencyRanking = vehicles.map(v => {
      const vTrips = trips.filter(t => t.vehicle_id === v.id)
      const vFuel = fuelLogs.filter(f => f.vehicle_id === v.id)
      const dist = vTrips.reduce((acc, t) => acc + Number(t.actual_distance || t.planned_distance || 0), 0)
      const liters = vFuel.reduce((acc, f) => acc + Number(f.liters || 0), 0)
      const efficiency = liters > 0 ? Number((dist / liters).toFixed(2)) : 0
      return {
        registration_number: v.registration_number,
        efficiency_km_per_l: efficiency,
        total_km: dist,
        total_liters: liters
      }
    })

    // 5. Monthly Operational Cost Breakdown
    const totalFuelCost = expenses.filter(e => e.category === 'Fuel').reduce((a, b) => a + Number(b.amount), 0)
    const totalMaintCost = expenses.filter(e => e.category === 'Maintenance').reduce((a, b) => a + Number(b.amount), 0)
    const totalOtherCost = expenses.filter(e => !['Fuel', 'Maintenance'].includes(e.category)).reduce((a, b) => a + Number(b.amount), 0)

    const operationalCostBreakdown = [
      { category: 'Fuel', amount: totalFuelCost },
      { category: 'Maintenance', amount: totalMaintCost },
      { category: 'Other Expenses', amount: totalOtherCost }
    ]

    // 6. Utilization Trend (Mocked multi-month progression + current actual)
    const activeVehiclesCount = vehicles.filter(v => v.status === 'On Trip').length
    const activeFleet = vehicles.filter(v => v.status !== 'Retired').length || 1
    const currentUtil = Number(((activeVehiclesCount / activeFleet) * 100).toFixed(2))

    const utilizationTrend = [
      { month: 'Jan', utilization: 68 },
      { month: 'Feb', utilization: 72 },
      { month: 'Mar', utilization: 75 },
      { month: 'Apr', utilization: 81 },
      { month: 'May', utilization: currentUtil }
    ]

    return res.json({
      success: true,
      data: {
        vehicle_roi_ranking: vehicleRoiRanking,
        fleet_status_distribution: fleetStatusDistribution,
        trip_status_distribution: tripStatusDistribution,
        fuel_efficiency_ranking: fuelEfficiencyRanking,
        operational_cost_breakdown: operationalCostBreakdown,
        utilization_trend: utilizationTrend
      }
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}
