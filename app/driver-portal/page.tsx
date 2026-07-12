'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { store, Trip, Vehicle } from '@/lib/mock'
import {
  Truck,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Play,
  Fuel,
  Wrench,
  Navigation,
  ShieldCheck,
  UserCheck
} from 'lucide-react'

export default function DriverPortalPage() {
  const [driverName, setDriverName] = useState('Rajesh Roy')
  const [trips, setTrips] = useState<Trip[]>([])
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [toast, setToast] = useState('')

  function getTripDriverName(t: Trip): string {
    const customName = (t as any).driverName
    if (customName && typeof customName === 'string') return customName
    const drv = store.drivers.find(d => d.id === t.driverId)
    return drv ? drv.name : ''
  }

  function loadDriverData() {
    const name = localStorage.getItem('user_name') || 'Rahul Sharma'
    setDriverName(name)
    const myTrips = store.trips.filter(t => {
      const dName = getTripDriverName(t)
      return dName.includes(name) || dName.includes('Rahul') || dName.includes('Rajesh')
    })
    setTrips(myTrips.length > 0 ? myTrips : store.trips.slice(0, 3))
    setVehicle(store.vehicles[0])
  }

  useEffect(() => {
    loadDriverData()
  }, [])

  function handleTripAction(id: string, newStatus: Trip['status']) {
    const idx = store.trips.findIndex(t => t.id === id)
    if (idx !== -1) {
      store.trips[idx].status = newStatus
      const myTrips = store.trips.filter(t => {
        const dName = getTripDriverName(t)
        return dName.includes(driverName) || dName.includes('Rahul') || dName.includes('Rajesh')
      })
      setTrips([...(myTrips.length > 0 ? myTrips : store.trips.slice(0, 3))])
      setToast(`Trip status updated to: ${newStatus}`)
      setTimeout(() => setToast(''), 3500)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-500 text-on-primary font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            {toast}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-1 bg-primary/15 text-primary rounded-full border border-primary/30 uppercase">
                Scoped Driver Workspace
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Active License Verified
              </span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">
              Driver Operations Portal
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Logged in as <strong className="text-white">{driverName}</strong> • Manage assigned haulage trips, telemetry updates, and vehicle logs.
            </p>
          </div>
        </div>

        {/* Driver Profile & Safety KPI Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Driver Credential</span>
            <div className="text-xl font-bold text-white mt-1">{driverName}</div>
            <div className="text-xs text-emerald-400 font-mono mt-1">DL #WB-DL-2019-88190 (Expires 2029)</div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Safety Score & Compliance</span>
            <div className="text-3xl font-bold text-emerald-400 mt-2">94 / 100</div>
            <div className="text-xs text-on-surface-variant mt-1">0 HOS Violations • Safe Operator</div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Assigned Asset</span>
            <div className="text-xl font-bold text-primary font-mono mt-1">{vehicle?.registrationNumber || 'WB-25-P-9001'}</div>
            <div className="text-xs text-on-surface-variant mt-1">{vehicle?.vehicleName || 'Tata Prima 2830.K'}</div>
          </div>
        </div>

        {/* Assigned Trips Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" />
              My Assigned Transport Trips ({trips.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {trips.map(trip => (
              <div
                key={trip.id}
                className="p-6 rounded-2xl bg-surface-container-low border border-white/10 hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-primary">{trip.tripCode}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase border ${
                        trip.status === 'In Transit'
                          ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                          : trip.status === 'Delivered'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {trip.status}
                    </span>
                  </div>

                  <div className="text-base font-bold text-white">
                    {trip.source} → {trip.destination}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant">
                    <span>Cargo: <strong className="text-white">{(trip.cargoWeight || 0).toLocaleString()} kg</strong></span>
                    <span>Distance: <strong className="text-white">{(trip.plannedDistance || (trip as any).distanceKm || 0)} km</strong></span>
                    <span>Revenue Yield: <strong className="text-amber-400">₹{(trip.plannedRevenue || (trip as any).freightRevenue || 0).toLocaleString()}</strong></span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {trip.status === 'Dispatched' && (
                    <button
                      onClick={() => handleTripAction(trip.id, 'In Transit')}
                      className="px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold text-xs border border-blue-500/40 flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" /> Start Transit
                    </button>
                  )}
                  {trip.status === 'In Transit' && (
                    <button
                      onClick={() => handleTripAction(trip.id, 'Delivered')}
                      className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Delivery
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
