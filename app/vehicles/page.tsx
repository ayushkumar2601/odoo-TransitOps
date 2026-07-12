'use client'

import React, { useEffect, useState } from 'react'
import { Sidebar } from '../../components/sidebar'
import { store, Vehicle } from '@/lib/mock'
import {
  Truck,
  Plus,
  TrendingUp,
  AlertCircle,
  X,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react'

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filter, setFilter] = useState<string>('All')
  const [showAddModal, setShowAddModal] = useState(false)

  // New vehicle form state
  const [regNum, setRegNum] = useState('WB-25-P-9001')
  const [vName, setVName] = useState('Tata Prima 2830.K')
  const [vType, setVType] = useState<Vehicle['vehicleType']>('Container Truck')
  const [cap, setCap] = useState('18000')
  const [odo, setOdo] = useState('12000')
  const [cost, setCost] = useState('3800000')
  const [region, setRegion] = useState('Kolkata')
  const [err, setErr] = useState('')

  function loadVehicles() {
    setVehicles([...store.vehicles])
  }

  useEffect(() => {
    loadVehicles()
  }, [])

  function handleCreateVehicle(e: React.FormEvent) {
    e.preventDefault()
    setErr('')

    const res = store.addVehicle({
      registrationNumber: regNum,
      vehicleName: vName,
      vehicleType: vType,
      maxLoadCapacity: Number(cap),
      odometer: Number(odo),
      acquisitionCost: Number(cost),
      purchaseDate: new Date().toISOString().split('T')[0],
      fuelEfficiency: 4.0,
      status: 'Available',
      region
    })

    if (!res.success) {
      setErr(res.message || 'BR-001 Violation')
      return
    }

    setShowAddModal(false)
    loadVehicles()
  }

  const filteredVehicles = filter === 'All'
    ? vehicles
    : vehicles.filter(v => v.status === filter)

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded-full border border-primary/20 uppercase">
                Fleet Assets
              </span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">Vehicle Asset Registry</h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Enforces BR-001 unique registration verification across Eastern India fleet. Total: {vehicles.length} Assets.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 md:mt-0 px-4 py-2.5 bg-primary text-on-primary font-semibold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm"
          >
            <Plus className="w-4 h-4" />
            Register New Vehicle
          </button>
        </div>

        {/* Status Filter Bar */}
        <div className="flex gap-2 mb-6">
          {(['All', 'Available', 'On Trip', 'In Shop', 'Retired'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                filter === st
                  ? 'bg-primary/20 text-primary border-primary/40'
                  : 'bg-surface-container-low text-on-surface-variant border-white/10 hover:border-white/20'
              }`}
            >
              {st} ({st === 'All' ? vehicles.length : vehicles.filter(v => v.status === st).length})
            </button>
          ))}
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((v) => (
            <div
              key={v.id}
              className="p-5 rounded-2xl bg-surface-container-low border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-mono font-bold text-primary text-base tracking-wide">
                      {v.registrationNumber}
                    </span>
                    <h3 className="text-sm font-bold text-on-surface mt-0.5">{v.vehicleName}</h3>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      v.status === 'Available'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : v.status === 'On Trip'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : v.status === 'In Shop'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {v.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/5 text-xs">
                  <div>
                    <span className="text-on-surface-variant block">Type</span>
                    <span className="font-medium text-on-surface">{v.vehicleType}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block">Max Capacity</span>
                    <span className="font-semibold text-emerald-400">{v.maxLoadCapacity.toLocaleString()} kg</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block">Odometer</span>
                    <span className="font-mono text-on-surface">{v.odometer.toLocaleString()} km</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block">Region Hub</span>
                    <span className="font-medium text-blue-400">{v.region}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 text-xs">
                <span className="text-on-surface-variant">Acquisition Cost</span>
                <span className="font-bold text-amber-400">₹{v.acquisitionCost.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Vehicle Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface-container rounded-2xl border border-white/10 w-full max-w-lg p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <h3 className="text-lg font-bold text-on-surface">Register Vehicle (BR-001 Check)</h3>
                <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {err && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {err}
                </div>
              )}

              <form onSubmit={handleCreateVehicle} className="space-y-4">
                <div>
                  <label className="text-xs text-on-surface-variant font-semibold block mb-1">
                    Registration Number (Unique BR-001)
                  </label>
                  <input
                    required
                    type="text"
                    value={regNum}
                    onChange={(e) => setRegNum(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-on-surface-variant font-semibold block mb-1">Model Name</label>
                    <input
                      required
                      type="text"
                      value={vName}
                      onChange={(e) => setVName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-on-surface-variant font-semibold block mb-1">Region Hub</label>
                    <input
                      required
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-on-surface-variant font-semibold block mb-1">Vehicle Category</label>
                    <select
                      value={vType}
                      onChange={(e) => setVType(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm"
                    >
                      <option value="Mini Truck">Mini Truck</option>
                      <option value="Light Commercial Vehicle">Light Commercial Vehicle</option>
                      <option value="Container Truck">Container Truck</option>
                      <option value="Refrigerated Truck">Refrigerated Truck</option>
                      <option value="Pickup Van">Pickup Van</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-on-surface-variant font-semibold block mb-1">Max Load Capacity (kg)</label>
                    <input
                      required
                      type="number"
                      value={cap}
                      onChange={(e) => setCap(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-on-surface-variant font-semibold block mb-1">Current Odometer (km)</label>
                    <input
                      required
                      type="number"
                      value={odo}
                      onChange={(e) => setOdo(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-on-surface-variant font-semibold block mb-1">Acquisition Cost (₹)</label>
                    <input
                      required
                      type="number"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
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
                    Register Asset
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
