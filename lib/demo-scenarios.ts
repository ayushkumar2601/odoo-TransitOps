'use client'

import { store } from '@/lib/mock'
import { persistentStore } from '@/lib/store/transitops-store'

export interface ScenarioResult {
  success: boolean
  title: string
  message: string
}

export function runDispatchScenario(): ScenarioResult {
  const availVeh = store.vehicles.find(v => v.status === 'Available')
  const availDrv = store.drivers.find(d => d.status === 'Available')

  if (!availVeh || !availDrv) {
    return {
      success: false,
      title: 'Scenario Failed',
      message: 'No available vehicle or driver found to dispatch.'
    }
  }

  const tripRes = store.addTrip({
    tripCode: `TRP-DEMO-${Math.floor(Math.random() * 900) + 100}`,
    source: 'Kolkata Hub',
    destination: 'Siliguri Terminal',
    vehicleId: availVeh.id,
    driverId: availDrv.id,
    cargoWeight: Math.min(availVeh.maxLoadCapacity - 500, 12000),
    plannedDistance: 560,
    plannedRevenue: 85000
  })

  if (!tripRes.success || !tripRes.trip) {
    return {
      success: false,
      title: 'Dispatch Failed',
      message: tripRes.message || 'Validation error during scenario.'
    }
  }

  const dispatchRes = store.dispatchTrip(tripRes.trip.id)
  if (!dispatchRes.success) {
    return {
      success: false,
      title: 'Dispatch Transition Error',
      message: dispatchRes.message || 'BR-009 transition failed.'
    }
  }

  return {
    success: true,
    title: 'Automated Dispatch Scenario Executed',
    message: `Created & Dispatched ${tripRes.trip.tripCode}. Asset ${availVeh.registrationNumber} & Driver ${availDrv.name} locked to On Trip (BR-009).`
  }
}

export function runMaintenanceScenario(): ScenarioResult {
  const availVeh = store.vehicles.find(v => v.status === 'Available')
  if (!availVeh) {
    return {
      success: false,
      title: 'Scenario Failed',
      message: 'No available vehicle found to send to workshop.'
    }
  }

  store.openMaintenance(
    availVeh.id,
    'Engine Inspection',
    'Automated Enterprise Demo Scenario — preventive overhaul lock',
    24500
  )

  return {
    success: true,
    title: 'Automated Workshop Scenario Executed',
    message: `Asset ${availVeh.registrationNumber} locked to In Shop status (BR-012). Removed from dispatch pool.`
  }
}

export function runLicenseExpiryScenario(): ScenarioResult {
  const availDrv = store.drivers.find(d => d.status === 'Available')
  if (!availDrv) {
    return {
      success: false,
      title: 'Scenario Failed',
      message: 'No available driver found.'
    }
  }

  const s = persistentStore.getState()
  const idx = s.drivers.findIndex(d => d.id === availDrv.id)
  if (idx !== -1) {
    s.drivers[idx].expiryDate = '2026-06-15' // Expired yesterday/last month
    persistentStore.addNotification(
      'License Expiry Simulated',
      `Driver ${availDrv.name} commercial license set to expired. BR-004 lock active.`,
      'alert'
    )
  }

  return {
    success: true,
    title: 'Automated License Expiry Scenario Executed',
    message: `Driver ${availDrv.name} license expired. Smart Alert Engine triggered Critical BR-004 Lock.`
  }
}

export function runResetScenario(): ScenarioResult {
  store.resetDemoData()
  return {
    success: true,
    title: 'Demo Environment Reset',
    message: 'Original seed dataset (25 vehicles, 35 drivers, 50 trips) restored cleanly.'
  }
}
