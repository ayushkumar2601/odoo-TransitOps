'use client'

import { persistentStore } from '@/lib/store/transitops-store'
import {
  Vehicle,
  Driver,
  Trip,
  MaintenanceRecord,
  FuelLog,
  Expense,
  NotificationItem
} from './transitops-data'

class TransitOpsStore {
  // Getters proxying to persistent store
  get vehicles(): Vehicle[] { return persistentStore.vehicles }
  get drivers(): Driver[] { return persistentStore.drivers }
  get trips(): Trip[] { return persistentStore.trips }
  get maintenanceLogs(): MaintenanceRecord[] { return persistentStore.maintenanceLogs }
  get fuelLogs(): FuelLog[] { return persistentStore.fuelLogs }
  get expenses(): Expense[] { return persistentStore.expenses }
  get notifications(): NotificationItem[] { return persistentStore.notifications }

  public resetDemoData(): void {
    persistentStore.resetDemoData()
  }

  public getVehicleById(id: string): Vehicle | undefined {
    return persistentStore.getVehicleById(id)
  }

  public getDriverById(id: string): Driver | undefined {
    return persistentStore.getDriverById(id)
  }

  public addNotification(title: string, message: string, type: 'info' | 'warning' | 'alert' | 'success' = 'info') {
    return persistentStore.addNotification(title, message, type)
  }

  public addVehicle(vehicle: Omit<Vehicle, 'id'>) {
    return persistentStore.addVehicle(vehicle)
  }

  public addDriver(driver: Omit<Driver, 'id'>) {
    return persistentStore.addDriver(driver)
  }

  public addTrip(trip: Omit<Trip, 'id' | 'status'>) {
    return persistentStore.addTrip(trip)
  }

  public dispatchTrip(tripId: string) {
    return persistentStore.dispatchTrip(tripId)
  }

  public completeTrip(tripId: string) {
    return persistentStore.completeTrip(tripId)
  }

  public cancelTrip(tripId: string) {
    return persistentStore.cancelTrip(tripId)
  }

  public openMaintenance(
    vehicleId: string,
    maintenanceType: MaintenanceRecord['maintenanceType'],
    description: string,
    cost: number
  ): MaintenanceRecord {
    return persistentStore.openMaintenance(vehicleId, maintenanceType, description, cost)
  }

  public closeMaintenance(logId: string) {
    return persistentStore.closeMaintenance(logId)
  }

  public addFuelLog(vehicleId: string, liters: number, cost: number, station: string): FuelLog {
    return persistentStore.addFuelLog(vehicleId, liters, cost, station)
  }

  public addExpense(vehicleId: string, category: Expense['category'], amount: number, notes: string): Expense {
    return persistentStore.addExpense(vehicleId, category, amount, notes)
  }
}

export const store = new TransitOpsStore()
