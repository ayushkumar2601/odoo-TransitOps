import { store } from './helpers'
import { getAnalyticsSummary } from './analytics'

export function getDashboardKPIs() {
  const allVehicles = store.vehicles
  const allDrivers = store.drivers
  const allTrips = store.trips

  const totalVehicles = allVehicles.length
  const availableVehicles = allVehicles.filter(v => v.status === 'Available').length
  const onTripVehicles = allVehicles.filter(v => v.status === 'On Trip').length
  const inShopVehicles = allVehicles.filter(v => v.status === 'In Shop').length
  const retiredVehicles = allVehicles.filter(v => v.status === 'Retired').length

  const totalDrivers = allDrivers.length
  const availableDrivers = allDrivers.filter(d => d.status === 'Available').length
  const onTripDrivers = allDrivers.filter(d => d.status === 'On Trip').length
  const offDutyDrivers = allDrivers.filter(d => d.status === 'Off Duty').length
  const suspendedDrivers = allDrivers.filter(d => d.status === 'Suspended').length

  const totalTrips = allTrips.length
  const activeTrips = allTrips.filter(t => t.status === 'Dispatched').length
  const completedTrips = allTrips.filter(t => t.status === 'Completed').length
  const draftTrips = allTrips.filter(t => t.status === 'Draft').length
  const cancelledTrips = allTrips.filter(t => t.status === 'Cancelled').length

  const analytics = getAnalyticsSummary()

  return {
    total_vehicles: totalVehicles,
    vehicles_available: availableVehicles,
    vehicles_on_trip: onTripVehicles,
    vehicles_in_shop: inShopVehicles,
    vehicles_retired: retiredVehicles,

    total_drivers: totalDrivers,
    drivers_available: availableDrivers,
    drivers_on_trip: onTripDrivers,
    drivers_off_duty: offDutyDrivers,
    drivers_suspended: suspendedDrivers,

    total_trips: totalTrips,
    active_trips: activeTrips,
    completed_trips: completedTrips,
    pending_trips: draftTrips,
    cancelled_trips: cancelledTrips,

    fleet_utilization_rate: analytics.fleet_utilization_rate
  }
}
