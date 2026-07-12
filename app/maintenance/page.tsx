'use client'

import React, { useEffect, useState } from 'react'
import { Sidebar } from '../../components/sidebar'
import { store, MaintenanceRecord, Vehicle } from '@/lib/mock'
import { INITIAL_FLEET_TELEMETRY } from '@/lib/live-tracking'
import { getPredictedServiceQueue, PredictiveServiceForecast } from '@/lib/intelligence'
import {
  Wrench,
  CheckCircle2,
  Plus,
  AlertTriangle,
  X,
  Truck,
  Calendar,
  Brain,
  ShieldAlert
} from 'lucide-react'

export default function MaintenancePage() {
  const [logs, setLogs] = useState<MaintenanceRecord[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filter, setFilter] = useState<string>('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [predictedQueue] = useState<PredictiveServiceForecast[]>(
    () => getPredictedServiceQueue([...INITIAL_FLEET_TELEMETRY])
  )

  // Form state
  const [vehicleId, setVehicleId] = useState('')
  const [type, setType] = useState<MaintenanceRecord['maintenanceType']>('Engine Inspection')
  const [desc, setDesc] = useState('Scheduled preventive overhaul and diagnostics')
  const [cost, setCost] = useState('18500')

  function loadData() {
    setLogs([...store.maintenanceLogs])
    setVehicles([...store.vehicles])
    if (!vehicleId && store.vehicles.length > 0) {
      setVehicleId(store.vehicles[0].id)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function handleOpenTicket(e: React.FormEvent) {
    e.preventDefault()
    store.openMaintenance(vehicleId, type, desc, Number(cost))
    setShowAddModal(false)
    loadData()
  }

  function handleCloseTicket(logId: string) {
    store.closeMaintenance(logId)
    loadData()
  }

  const filteredLogs = filter === 'All'
    ? logs
    : logs.filter(l => l.status === filter)

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 uppercase">
                Workshop & Fleet Care
              </span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">Maintenance & Workshop Control</h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Enforces BR-012 (Vehicle locked In Shop) and BR-013 (Restored Available on Close). Total: {logs.length} Records.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 md:mt-0 px-4 py-2.5 bg-primary text-on-primary font-semibold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm"
          >
            <Plus className="w-4 h-4" />
            Open Workshop Ticket
          </button>
        </div>

        {/* AI Predictive Service Queue */}
        <div className="mb-8 p-5 rounded-2xl bg-surface-container border border-amber-500/20">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="font-bold text-base text-on-surface">AI Predictive Service Queue</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold">
              {predictedQueue.filter(q => q.maintenanceRisk === 'Critical').length} Critical
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {predictedQueue.slice(0, 6).map((sq) => (
              <div
                key={sq.vehicleId}
                className={`p-4 rounded-xl border flex flex-col gap-2 ${
                  sq.maintenanceRisk === 'Critical'
                    ? 'bg-rose-500/10 border-rose-500/30'
                    : sq.maintenanceRisk === 'Moderate'
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-surface border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{sq.registrationNumber}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      sq.maintenanceRisk === 'Critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {sq.maintenanceRisk}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">{sq.vehicleName}</p>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                  <span className="text-on-surface-variant">Predicted: <strong className="text-amber-300 font-mono">{sq.predictedServiceDate}</strong></span>
                  <span className="text-emerald-400 font-semibold">{sq.confidencePercent}% conf.</span>
                </div>
                <p className="text-[11px] text-on-surface-variant">{sq.reasons[0]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {(['All', 'Open', 'Closed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                filter === st
                  ? 'bg-primary/20 text-primary border-primary/40'
                  : 'bg-surface-container-low text-on-surface-variant border-white/10 hover:border-white/20'
              }`}
            >
              {st} ({st === 'All' ? logs.length : logs.filter(l => l.status === st).length})
            </button>
          ))}
        </div>

        {/* Maintenance Table */}
        <div className="rounded-2xl bg-surface-container-low border border-white/10 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs font-semibold text-on-surface-variant uppercase">
                <th className="p-4">Vehicle Asset</th>
                <th className="p-4">Service Category</th>
                <th className="p-4">Description</th>
                <th className="p-4">Start Date</th>
                <th className="p-4">End Date</th>
                <th className="p-4">Cost</th>
                <th className="p-4">Ticket Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredLogs.map((l) => {
                const veh = store.getVehicleById(l.vehicleId)

                return (
                  <tr key={l.id} className="hover:bg-white/5">
                    <td className="p-4 font-mono font-bold text-primary">
                      {veh ? `${veh.registrationNumber}` : l.vehicleId}
                    </td>
                    <td className="p-4 font-semibold text-on-surface">{l.maintenanceType}</td>
                    <td className="p-4 text-xs text-on-surface-variant max-w-xs">{l.description}</td>
                    <td className="p-4 font-mono text-xs">{l.startDate}</td>
                    <td className="p-4 font-mono text-xs">{l.endDate || '—'}</td>
                    <td className="p-4 font-bold text-amber-400">₹{l.cost.toLocaleString()}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          l.status === 'Open'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {l.status === 'Open' && (
                        <button
                          onClick={() => handleCloseTicket(l.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-white font-semibold text-xs hover:bg-emerald-600 flex items-center gap-1.5 ml-auto shadow-md"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Close Ticket (BR-013)
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface-container rounded-2xl border border-white/10 w-full max-w-lg p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <h3 className="text-lg font-bold text-on-surface">Open Workshop Ticket (BR-012 Lock)</h3>
                <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleOpenTicket} className="space-y-4">
                <div>
                  <label className="text-xs text-on-surface-variant font-semibold block mb-1">Select Vehicle Asset</label>
                  <select
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm"
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.registrationNumber} ({v.vehicleName}) - Current: {v.status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-on-surface-variant font-semibold block mb-1">Service Category</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm"
                    >
                      <option value="Engine Inspection">Engine Inspection</option>
                      <option value="Transmission Service">Transmission Service</option>
                      <option value="AC Repair">AC Repair</option>
                      <option value="Brake Service">Brake Service</option>
                      <option value="Oil Change">Oil Change</option>
                      <option value="Tyre Replacement">Tyre Replacement</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-on-surface-variant font-semibold block mb-1">Estimated Cost (₹)</label>
                    <input
                      required
                      type="number"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-on-surface-variant font-semibold block mb-1">Repair Notes / Scope</label>
                  <textarea
                    rows={3}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm"
                  />
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
                    className="px-5 py-2 rounded-xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600"
                  >
                    Open Ticket & Lock Asset
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
