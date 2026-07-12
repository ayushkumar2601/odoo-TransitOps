'use client'

import { store } from '@/lib/mock'

function downloadCSV(filename: string, content: string) {
  if (typeof window === 'undefined') return
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function escapeCSV(field: any): string {
  if (field === null || field === undefined) return '""'
  const str = String(field).replace(/"/g, '""')
  return `"${str}"`
}

export function exportVehiclesCSV() {
  const headers = [
    'ID',
    'Registration Number',
    'Model Name',
    'Type',
    'Max Load Capacity (kg)',
    'Odometer (km)',
    'Acquisition Cost (INR)',
    'Purchase Date',
    'Status',
    'Region Hub'
  ]
  const rows = store.vehicles.map(v => [
    v.id,
    v.registrationNumber,
    v.vehicleName,
    v.vehicleType,
    v.maxLoadCapacity,
    v.odometer,
    v.acquisitionCost,
    v.purchaseDate,
    v.status,
    v.region
  ])

  const csv = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n')

  downloadCSV(`transitops_vehicles_${new Date().toISOString().split('T')[0]}.csv`, csv)
}

export function exportDriversCSV() {
  const headers = [
    'ID',
    'Name',
    'License Number',
    'License Category',
    'Expiry Date',
    'Contact Number',
    'Safety Score',
    'Total Trips',
    'Status'
  ]
  const rows = store.drivers.map(d => [
    d.id,
    d.name,
    d.licenseNumber,
    d.licenseCategory,
    d.expiryDate,
    d.contactNumber,
    d.safetyScore,
    d.totalTrips,
    d.status
  ])

  const csv = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n')

  downloadCSV(`transitops_drivers_${new Date().toISOString().split('T')[0]}.csv`, csv)
}

export function exportTripsCSV() {
  const headers = [
    'ID',
    'Trip Code',
    'Source Hub',
    'Destination Hub',
    'Vehicle ID',
    'Driver ID',
    'Cargo Weight (kg)',
    'Planned Distance (km)',
    'Planned Revenue (INR)',
    'Status'
  ]
  const rows = store.trips.map(t => [
    t.id,
    t.tripCode,
    t.source,
    t.destination,
    t.vehicleId,
    t.driverId,
    t.cargoWeight,
    t.plannedDistance,
    t.plannedRevenue,
    t.status
  ])

  const csv = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n')

  downloadCSV(`transitops_trips_${new Date().toISOString().split('T')[0]}.csv`, csv)
}

export function exportMaintenanceCSV() {
  const headers = [
    'ID',
    'Vehicle ID',
    'Service Category',
    'Description',
    'Start Date',
    'End Date',
    'Cost (INR)',
    'Status'
  ]
  const rows = store.maintenanceLogs.map(m => [
    m.id,
    m.vehicleId,
    m.maintenanceType,
    m.description,
    m.startDate,
    m.endDate || 'N/A',
    m.cost,
    m.status
  ])

  const csv = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n')

  downloadCSV(`transitops_maintenance_${new Date().toISOString().split('T')[0]}.csv`, csv)
}

export function exportFuelLogsCSV() {
  const headers = [
    'ID',
    'Vehicle ID',
    'Liters',
    'Cost (INR)',
    'Date',
    'Fuel Station Hub'
  ]
  const rows = store.fuelLogs.map(f => [
    f.id,
    f.vehicleId,
    f.liters,
    f.cost,
    f.date,
    f.station
  ])

  const csv = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n')

  downloadCSV(`transitops_fuel_logs_${new Date().toISOString().split('T')[0]}.csv`, csv)
}

export function exportExpensesCSV() {
  const headers = [
    'ID',
    'Vehicle ID',
    'Category',
    'Amount (INR)',
    'Date',
    'Notes'
  ]
  const rows = store.expenses.map(e => [
    e.id,
    e.vehicleId,
    e.category,
    e.amount,
    e.date,
    e.notes
  ])

  const csv = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n')

  downloadCSV(`transitops_expenses_${new Date().toISOString().split('T')[0]}.csv`, csv)
}
