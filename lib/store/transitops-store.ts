'use client'

import {
  Vehicle,
  Driver,
  Trip,
  MaintenanceRecord,
  FuelLog,
  Expense,
  NotificationItem,
  vehicles as SEED_VEHICLES,
  drivers as SEED_DRIVERS,
  trips as SEED_TRIPS,
  maintenanceLogs as SEED_MAINTENANCE,
  fuelLogs as SEED_FUEL,
  expenses as SEED_EXPENSES,
  notifications as SEED_NOTIFICATIONS
} from '@/lib/mock/transitops-data'

const STORAGE_KEY = 'transitops_demo_state_v1_5'

export interface PersistentState {
  vehicles: Vehicle[]
  drivers: Driver[]
  trips: Trip[]
  maintenanceLogs: MaintenanceRecord[]
  fuelLogs: FuelLog[]
  expenses: Expense[]
  notifications: NotificationItem[]
}

class TransitOpsPersistentStore {
  private state: PersistentState

  constructor() {
    this.state = this.loadFromStorage()
  }

  private loadFromStorage(): PersistentState {
    if (typeof window === 'undefined') {
      return this.getSeedState()
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed.vehicles) && Array.isArray(parsed.drivers)) {
          return parsed
        }
      }
    } catch (e) {
      console.warn('Failed to parse TransitOps localStorage state, reverting to seed:', e)
    }

    const initial = this.getSeedState()
    this.saveToStorage(initial)
    return initial
  }

  private getSeedState(): PersistentState {
    return {
      vehicles: [...SEED_VEHICLES],
      drivers: [...SEED_DRIVERS],
      trips: [...SEED_TRIPS],
      maintenanceLogs: [...SEED_MAINTENANCE],
      fuelLogs: [...SEED_FUEL],
      expenses: [...SEED_EXPENSES],
      notifications: [...SEED_NOTIFICATIONS],
    }
  }

  private saveToStorage(nextState?: PersistentState) {
    if (nextState) {
      this.state = nextState
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state))
      } catch (e) {
        console.error('Failed to save TransitOps state to localStorage:', e)
      }
    }
  }

  public getState(): PersistentState {
    if (typeof window !== 'undefined') {
      // Re-hydrate in browser if needed
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          this.state = JSON.parse(raw)
        } catch (e) {}
      }
    }
    return this.state
  }

  public get vehicles() { return this.getState().vehicles }
  public get drivers() { return this.getState().drivers }
  public get trips() { return this.getState().trips }
  public get maintenanceLogs() { return this.getState().maintenanceLogs }
  public get fuelLogs() { return this.getState().fuelLogs }
  public get expenses() { return this.getState().expenses }
  public get notifications() { return this.getState().notifications }

  public resetDemoData(): void {
    const fresh = this.getSeedState()
    this.state = fresh
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
    }
    this.addNotification(
      'Demo Environment Reset',
      'Original seed dataset (25 vehicles, 35 drivers, 50 trips) has been restored.',
      'info'
    )
  }

  public getVehicleById(id: string): Vehicle | undefined {
    return this.vehicles.find(v => v.id === id)
  }

  public getDriverById(id: string): Driver | undefined {
    return this.drivers.find(d => d.id === id)
  }

  public addNotification(title: string, message: string, type: 'info' | 'warning' | 'alert' | 'success' = 'info') {
    const s = this.getState()
    const item: NotificationItem = {
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title,
      message,
      timestamp: 'Just now',
      type
    }
    s.notifications = [item, ...s.notifications.slice(0, 49)]
    this.saveToStorage(s)
  }

  // CRUDS & Business Rules
  public addVehicle(vehicle: Omit<Vehicle, 'id'>): { success: boolean; message?: string; vehicle?: Vehicle } {
    const s = this.getState()
    // BR-001 Unique Registration Check
    const exists = s.vehicles.some(
      v => v.registrationNumber.toLowerCase().trim() === vehicle.registrationNumber.toLowerCase().trim()
    )
    if (exists) {
      return { success: false, message: `BR-001 Violation: Registration number '${vehicle.registrationNumber}' already exists.` }
    }

    const newVehicle: Vehicle = {
      ...vehicle,
      id: `VEH-${Date.now()}`
    }

    s.vehicles = [newVehicle, ...s.vehicles]
    this.saveToStorage(s)
    this.addNotification('Vehicle Registered', `Asset ${newVehicle.registrationNumber} added to fleet registry.`, 'success')
    return { success: true, vehicle: newVehicle }
  }

  public addDriver(driver: Omit<Driver, 'id'>): { success: boolean; driver: Driver } {
    const s = this.getState()
    const newDriver: Driver = {
      ...driver,
      id: `DRV-${Date.now()}`
    }
    s.drivers = [newDriver, ...s.drivers]
    this.saveToStorage(s)
    this.addNotification('Driver Onboarded', `Personnel ${newDriver.name} (${newDriver.licenseNumber}) added.`, 'success')
    return { success: true, driver: newDriver }
  }

  public addTrip(trip: Omit<Trip, 'id' | 'status'>): { success: boolean; message?: string; trip?: Trip } {
    const s = this.getState()
    const veh = s.vehicles.find(v => v.id === trip.vehicleId)
    if (!veh) {
      return { success: false, message: 'Assigned vehicle does not exist.' }
    }

    // BR-008 Cargo Weight vs Max Load Capacity
    if (trip.cargoWeight > veh.maxLoadCapacity) {
      return {
        success: false,
        message: `BR-008 Violation: Cargo Weight (${trip.cargoWeight}kg) exceeds vehicle max capacity (${veh.maxLoadCapacity}kg).`
      }
    }

    const newTrip: Trip = {
      ...trip,
      id: `TRP-${Date.now()}`,
      status: 'Draft'
    }

    s.trips = [newTrip, ...s.trips]
    this.saveToStorage(s)
    this.addNotification('Draft Trip Created', `Trip ${newTrip.tripCode} created (${newTrip.source} → ${newTrip.destination}).`, 'info')
    return { success: true, trip: newTrip }
  }

  public dispatchTrip(tripId: string): { success: boolean; message?: string } {
    const s = this.getState()
    const tripIdx = s.trips.findIndex(t => t.id === tripId)
    if (tripIdx === -1) return { success: false, message: 'Trip not found.' }
    const trip = s.trips[tripIdx]

    const vehIdx = s.vehicles.findIndex(v => v.id === trip.vehicleId)
    const drvIdx = s.drivers.findIndex(d => d.id === trip.driverId)

    if (vehIdx === -1 || drvIdx === -1) {
      return { success: false, message: 'Assigned Vehicle or Driver not found.' }
    }

    const veh = s.vehicles[vehIdx]
    const drv = s.drivers[drvIdx]

    // Check BR-002: Retired Vehicle Lock
    if (veh.status === 'Retired') {
      return { success: false, message: `BR-002 Violation: Vehicle ${veh.registrationNumber} is Retired.` }
    }
    // Check BR-003: In Shop Lock
    if (veh.status === 'In Shop') {
      return { success: false, message: `BR-003 Violation: Vehicle ${veh.registrationNumber} is In Shop.` }
    }
    // Check BR-007: Vehicle Already On Trip
    if (veh.status === 'On Trip') {
      return { success: false, message: `BR-007 Violation: Vehicle ${veh.registrationNumber} is already On Trip.` }
    }
    // Check BR-004: Expired License Lock
    const today = new Date().toISOString().split('T')[0]
    if (drv.expiryDate < today) {
      return { success: false, message: `BR-004 Violation: Driver ${drv.name} has expired license (${drv.expiryDate}).` }
    }
    // Check BR-005: Suspended Lock
    if (drv.status === 'Suspended') {
      return { success: false, message: `BR-005 Violation: Driver ${drv.name} is Suspended.` }
    }
    // Check BR-006: Driver Already On Trip
    if (drv.status === 'On Trip') {
      return { success: false, message: `BR-006 Violation: Driver ${drv.name} is already On Trip.` }
    }

    // BR-009 Transition
    s.trips[tripIdx].status = 'Dispatched'
    s.vehicles[vehIdx].status = 'On Trip'
    s.drivers[drvIdx].status = 'On Trip'

    this.saveToStorage(s)
    this.addNotification(
      'Trip Dispatched (BR-009)',
      `Trip ${trip.tripCode} dispatched. Asset ${veh.registrationNumber} & Driver ${drv.name} marked On Trip.`,
      'alert'
    )
    return { success: true }
  }

  public completeTrip(tripId: string): { success: boolean; message?: string } {
    const s = this.getState()
    const tripIdx = s.trips.findIndex(t => t.id === tripId)
    if (tripIdx === -1) return { success: false, message: 'Trip not found.' }
    const trip = s.trips[tripIdx]

    const vehIdx = s.vehicles.findIndex(v => v.id === trip.vehicleId)
    const drvIdx = s.drivers.findIndex(d => d.id === trip.driverId)

    // BR-010 Transition
    s.trips[tripIdx].status = 'Completed'
    if (vehIdx !== -1) s.vehicles[vehIdx].status = 'Available'
    if (drvIdx !== -1) s.drivers[drvIdx].status = 'Available'
    if (drvIdx !== -1) s.drivers[drvIdx].totalTrips += 1

    this.saveToStorage(s)
    this.addNotification(
      'Trip Completed (BR-010)',
      `Trip ${trip.tripCode} completed successfully. Asset & Driver restored to Available.`,
      'success'
    )
    return { success: true }
  }

  public cancelTrip(tripId: string): { success: boolean; message?: string } {
    const s = this.getState()
    const tripIdx = s.trips.findIndex(t => t.id === tripId)
    if (tripIdx === -1) return { success: false, message: 'Trip not found.' }
    const trip = s.trips[tripIdx]

    const vehIdx = s.vehicles.findIndex(v => v.id === trip.vehicleId)
    const drvIdx = s.drivers.findIndex(d => d.id === trip.driverId)

    s.trips[tripIdx].status = 'Cancelled'
    if (vehIdx !== -1 && s.vehicles[vehIdx].status === 'On Trip') s.vehicles[vehIdx].status = 'Available'
    if (drvIdx !== -1 && s.drivers[drvIdx].status === 'On Trip') s.drivers[drvIdx].status = 'Available'

    this.saveToStorage(s)
    this.addNotification('Trip Cancelled (BR-011)', `Trip ${trip.tripCode} cancelled.`, 'warning')
    return { success: true }
  }

  public openMaintenance(vehicleId: string, maintenanceType: MaintenanceRecord['maintenanceType'], description: string, cost: number): MaintenanceRecord {
    const s = this.getState()
    const newLog: MaintenanceRecord = {
      id: `MAINT-${Date.now()}`,
      vehicleId,
      maintenanceType,
      description,
      startDate: new Date().toISOString().split('T')[0],
      cost,
      status: 'Open'
    }

    s.maintenanceLogs = [newLog, ...s.maintenanceLogs]

    const vehIdx = s.vehicles.findIndex(v => v.id === vehicleId)
    if (vehIdx !== -1) {
      s.vehicles[vehIdx].status = 'In Shop'
    }

    this.saveToStorage(s)
    const vehReg = vehIdx !== -1 ? s.vehicles[vehIdx].registrationNumber : vehicleId
    this.addNotification(
      'Maintenance Opened (BR-012)',
      `Asset ${vehReg} locked to In Shop for ${maintenanceType}.`,
      'warning'
    )
    return newLog
  }

  public closeMaintenance(logId: string): { success: boolean } {
    const s = this.getState()
    const logIdx = s.maintenanceLogs.findIndex(l => l.id === logId)
    if (logIdx === -1) return { success: false }

    const log = s.maintenanceLogs[logIdx]
    s.maintenanceLogs[logIdx].status = 'Closed'
    s.maintenanceLogs[logIdx].endDate = new Date().toISOString().split('T')[0]

    const vehIdx = s.vehicles.findIndex(v => v.id === log.vehicleId)
    if (vehIdx !== -1 && s.vehicles[vehIdx].status !== 'Retired') {
      s.vehicles[vehIdx].status = 'Available'
    }

    this.saveToStorage(s)
    this.addNotification(
      'Maintenance Closed (BR-013)',
      `Workshop record completed. Vehicle restored to Available.`,
      'success'
    )
    return { success: true }
  }

  public addFuelLog(vehicleId: string, liters: number, cost: number, station: string): FuelLog {
    const s = this.getState()
    const newLog: FuelLog = {
      id: `FUEL-${Date.now()}`,
      vehicleId,
      liters,
      cost,
      date: new Date().toISOString().split('T')[0],
      station
    }
    s.fuelLogs = [newLog, ...s.fuelLogs]
    this.saveToStorage(s)
    return newLog
  }

  public addExpense(vehicleId: string, category: Expense['category'], amount: number, notes: string): Expense {
    const s = this.getState()
    const newExp: Expense = {
      id: `EXP-${Date.now()}`,
      vehicleId,
      category,
      amount,
      date: new Date().toISOString().split('T')[0],
      notes
    }
    s.expenses = [newExp, ...s.expenses]
    this.saveToStorage(s)
    return newExp
  }
}

export const persistentStore = new TransitOpsPersistentStore()
