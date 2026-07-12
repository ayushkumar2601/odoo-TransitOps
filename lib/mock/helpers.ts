import {
  Vehicle,
  Driver,
  Trip,
  MaintenanceRecord,
  FuelLog,
  Expense,
  NotificationItem,
  vehicles as initialVehicles,
  drivers as initialDrivers,
  trips as initialTrips,
  maintenanceLogs as initialMaintenanceLogs,
  fuelLogs as initialFuelLogs,
  expenses as initialExpenses,
  notifications as initialNotifications
} from './transitops-data'

// Centralized runtime state (single source of truth for the session)
class TransitOpsStore {
  private _vehicles: Vehicle[] = [...initialVehicles]
  private _drivers: Driver[] = [...initialDrivers]
  private _trips: Trip[] = [...initialTrips]
  private _maintenanceLogs: MaintenanceRecord[] = [...initialMaintenanceLogs]
  private _fuelLogs: FuelLog[] = [...initialFuelLogs]
  private _expenses: Expense[] = [...initialExpenses]
  private _notifications: NotificationItem[] = [...initialNotifications]

  // Getters
  get vehicles(): Vehicle[] { return this._vehicles }
  get drivers(): Driver[] { return this._drivers }
  get trips(): Trip[] { return this._trips }
  get maintenanceLogs(): MaintenanceRecord[] { return this._maintenanceLogs }
  get fuelLogs(): FuelLog[] { return this._fuelLogs }
  get expenses(): Expense[] { return this._expenses }
  get notifications(): NotificationItem[] { return this._notifications }

  // Vehicle methods
  getVehicleById(id: string): Vehicle | undefined {
    return this._vehicles.find(v => v.id === id)
  }

  addVehicle(vehicle: Omit<Vehicle, 'id'>): { success: boolean; data?: Vehicle; message?: string } {
    // BR-001 Check
    const exists = this._vehicles.some(v => v.registrationNumber.toLowerCase() === vehicle.registrationNumber.toLowerCase())
    if (exists) {
      return { success: false, message: `BR-001 Violation: Registration number '${vehicle.registrationNumber}' is already registered.` }
    }
    const newVeh: Vehicle = {
      ...vehicle,
      id: `veh-${this._vehicles.length + 1}`
    }
    this._vehicles = [newVeh, ...this._vehicles]
    return { success: true, data: newVeh }
  }

  updateVehicleStatus(id: string, status: Vehicle['status']) {
    this._vehicles = this._vehicles.map(v => v.id === id ? { ...v, status } : v)
  }

  // Driver methods
  getDriverById(id: string): Driver | undefined {
    return this._drivers.find(d => d.id === id)
  }

  updateDriverStatus(id: string, status: Driver['status']) {
    this._drivers = this._drivers.map(d => d.id === id ? { ...d, status } : d)
  }

  // Trip methods
  addTrip(tripData: Omit<Trip, 'id' | 'status'>): { success: boolean; data?: Trip; message?: string } {
    const vehicle = this.getVehicleById(tripData.vehicleId)
    if (!vehicle) return { success: false, message: 'Selected vehicle asset not found.' }

    // BR-008 Check
    if (tripData.cargoWeight > vehicle.maxLoadCapacity) {
      return {
        success: false,
        message: `BR-008 Violation: Cargo weight (${tripData.cargoWeight} kg) exceeds maximum load capacity (${vehicle.maxLoadCapacity} kg) of ${vehicle.registrationNumber}.`
      }
    }

    const newTrip: Trip = {
      ...tripData,
      id: `trp-${this._trips.length + 1}`,
      status: 'Draft'
    }
    this._trips = [newTrip, ...this._trips]
    return { success: true, data: newTrip }
  }

  dispatchTrip(tripId: string): { success: boolean; message?: string } {
    const trip = this._trips.find(t => t.id === tripId)
    if (!trip) return { success: false, message: 'Trip not found.' }

    const vehicle = this.getVehicleById(trip.vehicleId)
    const driver = this.getDriverById(trip.driverId)

    if (!vehicle) return { success: false, message: 'Vehicle not found.' }
    if (!driver) return { success: false, message: 'Driver not found.' }

    // BR-002, BR-003, BR-007
    if (vehicle.status === 'Retired') return { success: false, message: 'BR-002 Violation: Retired vehicle cannot be dispatched.' }
    if (vehicle.status === 'In Shop') return { success: false, message: 'BR-003 Violation: Vehicle currently In Shop cannot be dispatched.' }
    if (vehicle.status === 'On Trip') return { success: false, message: 'BR-007 Violation: Vehicle is already assigned On Trip.' }

    // BR-004, BR-005, BR-006
    const today = new Date().toISOString().split('T')[0]
    if (driver.expiryDate < today) return { success: false, message: `BR-004 Violation: Driver ${driver.name}'s commercial license has expired.` }
    if (driver.status === 'Suspended') return { success: false, message: `BR-005 Violation: Driver ${driver.name} is currently Suspended.` }
    if (driver.status === 'On Trip') return { success: false, message: `BR-006 Violation: Driver ${driver.name} is already assigned On Trip.` }

    // Execute BR-009 state transitions
    this._trips = this._trips.map(t => t.id === tripId ? { ...t, status: 'Dispatched', dispatchDate: today } : t)
    this.updateVehicleStatus(vehicle.id, 'On Trip')
    this.updateDriverStatus(driver.id, 'On Trip')

    return { success: true }
  }

  completeTrip(tripId: string, actualRev?: number, endOdo?: number, fuelUsed?: number): { success: boolean; message?: string } {
    const trip = this._trips.find(t => t.id === tripId)
    if (!trip) return { success: false, message: 'Trip not found.' }

    const vehicle = this.getVehicleById(trip.vehicleId)
    const driver = this.getDriverById(trip.driverId)
    const today = new Date().toISOString().split('T')[0]

    // BR-010 state transition
    this._trips = this._trips.map(t => t.id === tripId ? {
      ...t,
      status: 'Completed',
      completionDate: today,
      actualRevenue: actualRev || t.plannedRevenue,
      fuelConsumed: fuelUsed || 45
    } : t)

    if (vehicle && vehicle.status !== 'Retired') this.updateVehicleStatus(vehicle.id, 'Available')
    if (driver && driver.status !== 'Suspended') this.updateDriverStatus(driver.id, 'Available')

    return { success: true }
  }

  cancelTrip(tripId: string): { success: boolean; message?: string } {
    const trip = this._trips.find(t => t.id === tripId)
    if (!trip) return { success: false, message: 'Trip not found.' }

    // BR-011 state transition
    this._trips = this._trips.map(t => t.id === tripId ? { ...t, status: 'Cancelled' } : t)
    const vehicle = this.getVehicleById(trip.vehicleId)
    const driver = this.getDriverById(trip.driverId)
    if (vehicle && vehicle.status === 'On Trip') this.updateVehicleStatus(vehicle.id, 'Available')
    if (driver && driver.status === 'On Trip') this.updateDriverStatus(driver.id, 'Available')

    return { success: true }
  }

  // Maintenance methods
  openMaintenance(vehicleId: string, type: MaintenanceRecord['maintenanceType'], desc: string, cost: number): { success: boolean; data?: MaintenanceRecord } {
    const newLog: MaintenanceRecord = {
      id: `maint-${this._maintenanceLogs.length + 1}`,
      vehicleId,
      maintenanceType: type,
      description: desc,
      cost,
      startDate: new Date().toISOString().split('T')[0],
      status: 'Open'
    }
    this._maintenanceLogs = [newLog, ...this._maintenanceLogs]
    // BR-012 Vehicle transition -> In Shop
    this.updateVehicleStatus(vehicleId, 'In Shop')
    return { success: true, data: newLog }
  }

  closeMaintenance(logId: string): { success: boolean } {
    const log = this._maintenanceLogs.find(l => l.id === logId)
    if (!log) return { success: false }

    this._maintenanceLogs = this._maintenanceLogs.map(l => l.id === logId ? {
      ...l,
      status: 'Closed',
      endDate: new Date().toISOString().split('T')[0]
    } : l)

    // BR-013 Vehicle transition -> Available unless retired
    const vehicle = this.getVehicleById(log.vehicleId)
    if (vehicle && vehicle.status !== 'Retired') {
      this.updateVehicleStatus(vehicle.id, 'Available')
    }
    return { success: true }
  }

  // Fuel methods
  addFuelLog(vehicleId: string, liters: number, cost: number, station: string): { success: boolean; data: FuelLog } {
    const newLog: FuelLog = {
      id: `fuel-${this._fuelLogs.length + 100}`,
      vehicleId,
      liters,
      cost,
      station,
      date: new Date().toISOString().split('T')[0]
    }
    this._fuelLogs = [newLog, ...this._fuelLogs]
    return { success: true, data: newLog }
  }

  // Expense methods
  addExpense(vehicleId: string, category: Expense['category'], amount: number, notes: string): { success: boolean; data: Expense } {
    const newExp: Expense = {
      id: `exp-${this._expenses.length + 200}`,
      vehicleId,
      category,
      amount,
      notes,
      date: new Date().toISOString().split('T')[0]
    }
    this._expenses = [newExp, ...this._expenses]
    return { success: true, data: newExp }
  }
}

export const store = new TransitOpsStore()
