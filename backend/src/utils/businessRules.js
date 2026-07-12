/**
 * TransitOps Phase 1 — Business Rules Engine (BR-001 to BR-013)
 * Enforces mandatory business logic and state transitions across Vehicles, Drivers, Trips, and Maintenance.
 */

export const BusinessRules = {
  /**
   * BR-001: Vehicle Registration Number must be unique.
   */
  validateUniqueRegistration(registrationNumber, vehicles, excludeId = null) {
    const existing = vehicles.find(
      v => v.registration_number.toLowerCase() === registrationNumber.toLowerCase() && v.id !== excludeId
    )
    if (existing) {
      throw new Error(`BR-001 Violation: Vehicle registration number '${registrationNumber}' is already registered.`)
    }
  },

  /**
   * BR-002: Retired vehicles cannot be assigned.
   * BR-003: In Shop vehicles cannot be assigned.
   * BR-007: Vehicle already On Trip cannot be assigned.
   */
  validateVehicleForDispatch(vehicle) {
    if (!vehicle) {
      throw new Error('Dispatch Validation Error: Vehicle not found.')
    }
    if (vehicle.status === 'Retired') {
      throw new Error('BR-002 Violation: Retired vehicles cannot be assigned to trips.')
    }
    if (vehicle.status === 'In Shop') {
      throw new Error('BR-003 Violation: Vehicles currently In Shop for maintenance cannot be assigned.')
    }
    if (vehicle.status === 'On Trip') {
      throw new Error('BR-007 Violation: Vehicle is already On Trip and cannot be dispatched simultaneously.')
    }
  },

  /**
   * BR-004: Expired license drivers cannot be assigned.
   * BR-005: Suspended drivers cannot be assigned.
   * BR-006: Driver already On Trip cannot be assigned.
   */
  validateDriverForDispatch(driver) {
    if (!driver) {
      throw new Error('Dispatch Validation Error: Driver not found.')
    }
    if (driver.status === 'Suspended') {
      throw new Error('BR-005 Violation: Suspended drivers cannot be assigned to trips.')
    }
    if (driver.status === 'On Trip') {
      throw new Error('BR-006 Violation: Driver is already On Trip.')
    }
    const expiry = new Date(driver.license_expiry_date)
    if (isNaN(expiry.getTime()) || expiry < new Date()) {
      throw new Error(`BR-004 Violation: Driver license (${driver.license_number}) expired on ${driver.license_expiry_date}. Cannot assign to trip.`)
    }
  },

  /**
   * BR-008: Cargo Weight <= Vehicle Capacity.
   */
  validateCargoCapacity(cargoWeight, vehicleMaxLoadCapacity) {
    if (Number(cargoWeight) > Number(vehicleMaxLoadCapacity)) {
      throw new Error(`BR-008 Violation: Cargo Weight (${cargoWeight} kg) exceeds Vehicle Max Load Capacity (${vehicleMaxLoadCapacity} kg).`)
    }
  },

  /**
   * BR-009: Dispatching Trip transitions Vehicle -> On Trip and Driver -> On Trip.
   */
  applyDispatchTransitions(vehicle, driver) {
    vehicle.status = 'On Trip'
    vehicle.updated_at = new Date().toISOString()
    driver.status = 'On Trip'
    driver.updated_at = new Date().toISOString()
  },

  /**
   * BR-010: Completing Trip transitions Vehicle -> Available and Driver -> Available.
   * Also updates odometer and revenue metrics.
   */
  applyCompletionTransitions(vehicle, driver, endOdometer) {
    vehicle.status = 'Available'
    if (endOdometer && Number(endOdometer) > Number(vehicle.odometer)) {
      vehicle.odometer = Number(endOdometer)
    }
    vehicle.updated_at = new Date().toISOString()
    driver.status = 'Available'
    driver.updated_at = new Date().toISOString()
  },

  /**
   * BR-011: Cancelling Trip restores Vehicle -> Available and Driver -> Available.
   */
  applyCancellationTransitions(vehicle, driver) {
    if (vehicle && vehicle.status === 'On Trip') {
      vehicle.status = 'Available'
      vehicle.updated_at = new Date().toISOString()
    }
    if (driver && driver.status === 'On Trip') {
      driver.status = 'Available'
      driver.updated_at = new Date().toISOString()
    }
  },

  /**
   * BR-012: Creating Maintenance transitions Vehicle -> In Shop.
   */
  applyMaintenanceCreation(vehicle) {
    if (vehicle && vehicle.status !== 'Retired') {
      vehicle.status = 'In Shop'
      vehicle.updated_at = new Date().toISOString()
    }
  },

  /**
   * BR-013: Closing Maintenance transitions Vehicle -> Available unless Retired.
   */
  applyMaintenanceClosure(vehicle) {
    if (vehicle && vehicle.status !== 'Retired') {
      vehicle.status = 'Available'
      vehicle.updated_at = new Date().toISOString()
    }
  }
}
