import { Vehicle, Driver, Trip, MaintenanceRecord, Expense } from '@/lib/mock'

export interface FilterCriteria {
  vehicleType?: string
  status?: string
  region?: string
  searchQuery?: string
  dateRange?: 'All' | 'Today' | 'Last 7 Days' | 'Last 30 Days'
}

const STORAGE_KEY = 'transitops_dashboard_filters_v1_6'

export function getStoredDashboardFilters(): FilterCriteria {
  if (typeof window === 'undefined') {
    return { vehicleType: 'All', status: 'All', region: 'All', dateRange: 'All' }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { vehicleType: 'All', status: 'All', region: 'All', dateRange: 'All' }
    return JSON.parse(raw)
  } catch {
    return { vehicleType: 'All', status: 'All', region: 'All', dateRange: 'All' }
  }
}

export function saveDashboardFilters(filters: FilterCriteria): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
  }
}

export function filterVehicles(vehicles: Vehicle[], criteria: FilterCriteria): Vehicle[] {
  return vehicles.filter(v => {
    if (criteria.vehicleType && criteria.vehicleType !== 'All' && v.vehicleType !== criteria.vehicleType) {
      return false
    }
    if (criteria.status && criteria.status !== 'All' && v.status !== criteria.status) {
      return false
    }
    if (criteria.region && criteria.region !== 'All' && !v.region.toLowerCase().includes(criteria.region.toLowerCase())) {
      return false
    }
    if (criteria.searchQuery && criteria.searchQuery.trim() !== '') {
      const q = criteria.searchQuery.toLowerCase()
      const matches =
        v.registrationNumber.toLowerCase().includes(q) ||
        v.vehicleName.toLowerCase().includes(q) ||
        v.region.toLowerCase().includes(q)
      if (!matches) return false
    }
    return true
  })
}

export function filterDrivers(drivers: Driver[], criteria: FilterCriteria): Driver[] {
  return drivers.filter(d => {
    if (criteria.status && criteria.status !== 'All' && d.status !== criteria.status) {
      return false
    }
    if (criteria.searchQuery && criteria.searchQuery.trim() !== '') {
      const q = criteria.searchQuery.toLowerCase()
      const matches =
        d.name.toLowerCase().includes(q) ||
        d.licenseNumber.toLowerCase().includes(q)
      if (!matches) return false
    }
    return true
  })
}

export function filterTrips(trips: Trip[], criteria: FilterCriteria): Trip[] {
  return trips.filter(t => {
    if (criteria.status && criteria.status !== 'All' && t.status !== criteria.status) {
      return false
    }
    if (criteria.searchQuery && criteria.searchQuery.trim() !== '') {
      const q = criteria.searchQuery.toLowerCase()
      const matches =
        t.tripCode.toLowerCase().includes(q) ||
        t.source.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q)
      if (!matches) return false
    }
    return true
  })
}
