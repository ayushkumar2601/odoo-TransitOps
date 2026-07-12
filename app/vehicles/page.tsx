'use client'

import React, { useEffect, useState } from 'react'
import { Sidebar } from '../../components/sidebar'
import Link from 'next/link'
import { store, Vehicle } from '@/lib/mock'
import { getStoredVehicleDocuments } from '@/lib/mock/vehicle-documents'
import { VehicleTimeline } from '@/components/vehicle-timeline'
import { CSVImportModal } from '@/components/csv-import-modal'
import {
  Truck,
  Plus,
  Upload,
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
  const [showImport, setShowImport] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

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
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-6 md:p-10 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#27272A]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FF5A36]/30 text-[10px] font-bold uppercase tracking-wider">
                Asset Registry
              </span>
              <span className="text-xs text-[#A1A1AA] font-mono">• Centralized Fleet DB</span>
            </div>
            <h1 className="text-3xl font-black text-[#FAFAFA] tracking-tight">
              Commercial Fleet Registry
            </h1>
            <p className="text-sm text-[#A1A1AA] mt-1">
              Manage commercial assets, load capacities, acquisition costs, and compliance documents.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowImport(true)}
              className="px-3.5 py-2 bg-[#18181B] border border-[#27272A] hover:border-[#3F3F46] text-[#FAFAFA] font-semibold rounded-xl flex items-center gap-2 transition-all text-xs"
            >
              <Upload className="w-4 h-4 text-[#FF5A36]" />
              Import CSV
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#FF5A36] text-white font-bold rounded-xl flex items-center gap-2 hover:bg-[#D84315] transition-all shadow-md text-xs"
            >
              <Plus className="w-4 h-4" />
              Register New Asset
            </button>
          </div>
        </div>

        {err && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{err}</span>
            </div>
            <button onClick={() => setErr('')}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {['All', 'Available', 'On Trip', 'In Shop', 'Retired'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === st
                  ? 'bg-[#FF5A36] text-white shadow-sm'
                  : 'bg-[#111113] border border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]'
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
              onClick={() => setSelectedVehicle(v)}
              className="bg-[#111113] border border-[#27272A] rounded-2xl p-6 flex flex-col justify-between hover:border-[#FF5A36]/60 transition-all shadow-sm group cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-mono font-bold text-[#FF5A36] text-base tracking-wide group-hover:text-[#FF7A59] transition-colors">
                      {v.registrationNumber}
                    </span>
                    <h3 className="text-sm font-bold text-[#FAFAFA] mt-0.5">{v.vehicleName}</h3>
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
                <span className="text-primary hover:underline font-semibold flex items-center gap-1">
                  View Docs & Profile →
                </span>
                <span className="font-bold text-amber-400">₹{v.acquisitionCost.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Vehicle Profile & Compliance Documents Drawer */}
        {selectedVehicle && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-surface-container rounded-2xl border border-white/15 w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-bold text-primary">{selectedVehicle.registrationNumber}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-on-surface">{selectedVehicle.status}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedVehicle.vehicleName} — {selectedVehicle.vehicleType}</h3>
                </div>
                <button onClick={() => setSelectedVehicle(null)} className="text-on-surface-variant hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-b border-white/10 text-xs">
                <div className="p-3 rounded-xl bg-surface">
                  <span className="text-on-surface-variant block">Region Hub</span>
                  <strong className="text-sm text-white">{selectedVehicle.region}</strong>
                </div>
                <div className="p-3 rounded-xl bg-surface">
                  <span className="text-on-surface-variant block">Odometer</span>
                  <strong className="text-sm font-mono text-white">{selectedVehicle.odometer.toLocaleString()} km</strong>
                </div>
                <div className="p-3 rounded-xl bg-surface">
                  <span className="text-on-surface-variant block">Acquisition Cost</span>
                  <strong className="text-sm font-bold text-amber-400">₹{selectedVehicle.acquisitionCost.toLocaleString()}</strong>
                </div>
              </div>

              <div className="py-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sm text-white">Compliance Documents (RC, Insurance, PUC, Fitness, Permit)</h4>
                  <Link
                    href="/vehicle-documents"
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    Open Document Registry →
                  </Link>
                </div>

                <div className="space-y-2">
                  {getStoredVehicleDocuments()
                    .filter(d => d.vehicleId === selectedVehicle.id || d.vehicleRegistration === selectedVehicle.registrationNumber)
                    .map(doc => (
                      <div
                        key={doc.id}
                        className="p-3.5 rounded-xl bg-surface border border-white/10 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-white">{doc.documentType}</div>
                          <div className="text-on-surface-variant font-mono mt-0.5">
                            #{doc.documentNumber} • Expires: {doc.expiryDate}
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] border ${
                            doc.status === 'Expired'
                              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                              : doc.status === 'Expiring Soon'
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  {getStoredVehicleDocuments().filter(d => d.vehicleId === selectedVehicle.id || d.vehicleRegistration === selectedVehicle.registrationNumber).length === 0 && (
                    <div className="p-4 rounded-xl bg-surface border border-white/10 text-center text-xs text-on-surface-variant">
                      No documents currently uploaded. Visit Document Registry to upload RC, Insurance, or PUC.
                    </div>
                  )}
                </div>
              </div>

              <div className="py-4 border-t border-white/10">
                <VehicleTimeline vehicleRegistration={selectedVehicle.registrationNumber} />
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        )}

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
