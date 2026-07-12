'use client'

import React, { useEffect, useState } from 'react'
import { Sidebar } from '../../components/sidebar'
import { store, Trip, Vehicle, Driver } from '@/lib/mock'
import { INITIAL_FLEET_TELEMETRY } from '@/lib/live-tracking'
import { getDispatchRecommendations, DispatchRecommendation } from '@/lib/intelligence'
import {
  MapPin,
  Send,
  CheckCircle2,
  XCircle,
  Plus,
  AlertTriangle,
  X,
  Truck,
  Users,
  Zap,
  Brain
} from 'lucide-react'

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [filter, setFilter] = useState<string>('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [err, setErr] = useState('')

  // New trip form state
  const [tripCode, setTripCode] = useState('TRP-1078')
  const [source, setSource] = useState('Kolkata')
  const [dest, setDest] = useState('Siliguri')
  const [vehicleId, setVehicleId] = useState('')
  const [driverId, setDriverId] = useState('')
  const [weight, setWeight] = useState('12000')
  const [dist, setDist] = useState('560')
  const [revenue, setRevenue] = useState('78000')

  // Smart Dispatch Recommendations (derived from source/dest when modal opens)
  const [dispatchRecs, setDispatchRecs] = useState<DispatchRecommendation[]>([])

  function loadAll() {
    setTrips([...store.trips])
    setVehicles([...store.vehicles])
    setDrivers([...store.drivers])
    if (!vehicleId && store.vehicles.length > 0) {
      setVehicleId(store.vehicles[0].id)
    }
    if (!driverId && store.drivers.length > 0) {
      setDriverId(store.drivers[0].id)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  function handleCreateTrip(e: React.FormEvent) {
    e.preventDefault()
    setErr('')

    const res = store.addTrip({
      tripCode,
      source,
      destination: dest,
      vehicleId,
      driverId,
      cargoWeight: Number(weight),
      plannedDistance: Number(dist),
      plannedRevenue: Number(revenue)
    })

    if (!res.success) {
      setErr(res.message || 'Validation Violation')
      return
    }

    setShowAddModal(false)
    setTripCode(`TRP-${Math.floor(Math.random() * 900) + 1100}`)
    loadAll()
  }

  function handleDispatch(id: string) {
    const res = store.dispatchTrip(id)
    if (!res.success) {
      alert(`Dispatch Rule Violation:\n${res.message}`)
      return
    }
    loadAll()
  }

  function handleComplete(id: string) {
    const res = store.completeTrip(id)
    if (!res.success) {
      alert(res.message)
      return
    }
    loadAll()
  }

  function handleCancel(id: string) {
    store.cancelTrip(id)
    loadAll()
  }

  const filteredTrips = filter === 'All'
    ? trips
    : trips.filter(t => t.status === filter)

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 uppercase">
                Dispatch Lifecycle
              </span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">Trip Dispatch & Haulage Operations</h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Enforcing BR-002 to BR-011 lifecycle transitions. Total: {trips.length} Trips.
            </p>
          </div>

          <button
            onClick={() => {
              setShowAddModal(true)
              setDispatchRecs(getDispatchRecommendations(source, dest, [...INITIAL_FLEET_TELEMETRY]))
            }}
            className="mt-4 md:mt-0 px-4 py-2.5 bg-primary text-on-primary font-semibold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm"
          >
            <Plus className="w-4 h-4" />
            Create New Trip
          </button>
        </div>

        {/* Status Filter Bar */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['All', 'Draft', 'Dispatched', 'Completed', 'Cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                filter === st
                  ? 'bg-primary/20 text-primary border-primary/40'
                  : 'bg-surface-container-low text-on-surface-variant border-white/10 hover:border-white/20'
              }`}
            >
              {st} ({st === 'All' ? trips.length : trips.filter(t => t.status === st).length})
            </button>
          ))}
        </div>

        {/* Trips Table */}
        <div className="rounded-2xl bg-surface-container-low border border-white/10 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs font-semibold text-on-surface-variant uppercase">
                <th className="p-4">Trip Code</th>
                <th className="p-4">Route Corridor</th>
                <th className="p-4">Assigned Vehicle</th>
                <th className="p-4">Assigned Driver</th>
                <th className="p-4">Cargo Weight</th>
                <th className="p-4">Planned Rev</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Lifecycle Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredTrips.map((t) => {
                const veh = store.getVehicleById(t.vehicleId)
                const drv = store.getDriverById(t.driverId)

                return (
                  <tr key={t.id} className="hover:bg-white/5">
                    <td className="p-4 font-mono font-bold text-primary">{t.tripCode}</td>
                    <td className="p-4 font-semibold text-on-surface">
                      {t.source} → {t.destination}
                    </td>
                    <td className="p-4 font-mono text-xs">
                      {veh ? `${veh.registrationNumber} (${veh.vehicleName})` : t.vehicleId}
                    </td>
                    <td className="p-4 text-xs font-medium">
                      {drv ? drv.name : t.driverId}
                    </td>
                    <td className="p-4">{t.cargoWeight.toLocaleString()} kg</td>
                    <td className="p-4 font-semibold text-emerald-400">
                      ₹{t.plannedRevenue.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          t.status === 'Draft'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : t.status === 'Dispatched'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : t.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {t.status === 'Draft' && (
                          <button
                            onClick={() => handleDispatch(t.id)}
                            className="px-3 py-1.5 rounded-lg bg-blue-500 text-white font-semibold text-xs hover:bg-blue-600 flex items-center gap-1 shadow-md"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Dispatch (BR-009)
                          </button>
                        )}
                        {t.status === 'Dispatched' && (
                          <button
                            onClick={() => handleComplete(t.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-semibold text-xs hover:bg-emerald-600 flex items-center gap-1 shadow-md"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Complete (BR-010)
                          </button>
                        )}
                        {(t.status === 'Draft' || t.status === 'Dispatched') && (
                          <button
                            onClick={() => handleCancel(t.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Add Trip Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface-container rounded-2xl border border-white/10 w-full max-w-lg p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <h3 className="text-lg font-bold text-on-surface">Create Draft Trip (BR-008 Cargo Check)</h3>
                <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {err && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {err}
                </div>
              )}

              {/* Smart Dispatch AI Recommendations Panel */}
              {dispatchRecs.length > 0 && (
                <div className="mb-5 p-4 rounded-2xl bg-primary/10 border border-primary/25">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-xs font-bold uppercase text-primary tracking-wider">AI Smart Dispatch Recommendations</span>
                  </div>
                  <div className="space-y-2">
                    {dispatchRecs.map((rec, idx) => (
                      <div
                        key={rec.vehicleId}
                        onClick={() => setVehicleId(store.vehicles.find(v => v.registrationNumber === rec.registrationNumber)?.id || vehicleId)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${idx === 0 ? 'bg-primary/15 border-primary/40' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-sm text-white">{rec.registrationNumber}</span>
                            <span className="text-xs text-on-surface-variant ml-2">{rec.vehicleName}</span>
                          </div>
                          <span className="font-bold text-xs text-emerald-400 font-mono">{rec.matchScorePercent}% Match</span>
                        </div>
                        <div className="text-[11px] text-on-surface-variant mt-1">
                          {rec.reasoning.slice(0, 2).join(' · ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleCreateTrip} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-on-surface-variant font-semibold block mb-1">Source Origin</label>
                    <input
                      required
                      type="text"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-on-surface-variant font-semibold block mb-1">Destination Hub</label>
                    <input
                      required
                      type="text"
                      value={dest}
                      onChange={(e) => setDest(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-on-surface-variant font-semibold block mb-1">Assign Vehicle</label>
                    <select
                      value={vehicleId}
                      onChange={(e) => setVehicleId(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm"
                    >
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.registrationNumber} ({v.maxLoadCapacity}kg max) - {v.status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-on-surface-variant font-semibold block mb-1">Assign Driver</label>
                    <select
                      value={driverId}
                      onChange={(e) => setDriverId(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm"
                    >
                      {drivers.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.licenseCategory}) - {d.status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-on-surface-variant font-semibold block mb-1">Cargo Weight (kg)</label>
                    <input
                      required
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-on-surface-variant font-semibold block mb-1">Distance (km)</label>
                    <input
                      required
                      type="number"
                      value={dist}
                      onChange={(e) => setDist(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-on-surface-variant font-semibold block mb-1">Planned Rev (₹)</label>
                    <input
                      required
                      type="number"
                      value={revenue}
                      onChange={(e) => setRevenue(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary/90"
                  >
                    Save Draft Trip
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
