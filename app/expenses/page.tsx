'use client'

import React, { useEffect, useState } from 'react'
import { Sidebar } from '../../components/sidebar'
import { store, FuelLog, Expense, Vehicle } from '@/lib/mock'
import {
  Receipt,
  Fuel,
  DollarSign,
  Plus,
  Calendar,
  X,
  Truck
} from 'lucide-react'

export default function ExpensesPage() {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [tab, setTab] = useState<'fuel' | 'expenses'>('fuel')
  const [showModal, setShowModal] = useState(false)

  // Form state
  const [vehId, setVehId] = useState('')
  const [liters, setLiters] = useState('65')
  const [cost, setCost] = useState('6100')
  const [station, setStation] = useState('IndianOil NH-19 Highway Hub, Dankuni')
  const [category, setCategory] = useState<Expense['category']>('Toll')
  const [notes, setNotes] = useState('FASTag NHAI Expressway corridor toll charges')

  function loadData() {
    setFuelLogs([...store.fuelLogs])
    setExpenses([...store.expenses])
    setVehicles([...store.vehicles])
    if (!vehId && store.vehicles.length > 0) {
      setVehId(store.vehicles[0].id)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function handleAddRecord(e: React.FormEvent) {
    e.preventDefault()
    if (tab === 'fuel') {
      store.addFuelLog(vehId, Number(liters), Number(cost), station)
    } else {
      store.addExpense(vehId, category, Number(cost), notes)
    }
    setShowModal(false)
    loadData()
  }

  const totalFuelCost = fuelLogs.reduce((a, b) => a + b.cost, 0)
  const totalFuelLiters = fuelLogs.reduce((a, b) => a + b.liters, 0)
  const totalExpenseCost = expenses.reduce((a, b) => a + b.amount, 0)

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20 uppercase">
                Financial Telemetry
              </span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">Fuel & Operational Expenditure</h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Tracking 120 Fuel Logs (₹88–₹98/L Diesel) & 150 Corridor Operational Expenses.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="mt-4 md:mt-0 px-4 py-2.5 bg-primary text-on-primary font-semibold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm"
          >
            <Plus className="w-4 h-4" />
            Log {tab === 'fuel' ? 'Refueling Receipt' : 'Expense Record'}
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Total Fuel Expenditure</span>
            <div className="text-3xl font-bold text-rose-400 mt-2">₹{totalFuelCost.toLocaleString()}</div>
            <div className="text-xs text-on-surface-variant mt-1">{totalFuelLiters.toLocaleString()} Liters Logged</div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Total Operational Expenses</span>
            <div className="text-3xl font-bold text-amber-400 mt-2">₹{totalExpenseCost.toLocaleString()}</div>
            <div className="text-xs text-on-surface-variant mt-1">Toll, Parking, Insurance, Maintenance</div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Average Diesel Rate</span>
            <div className="text-3xl font-bold text-emerald-400 mt-2">₹93.5 / L</div>
            <div className="text-xs text-emerald-400 mt-1">Eastern India Corridor average</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setTab('fuel')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 border ${
              tab === 'fuel'
                ? 'bg-primary/20 text-primary border-primary/40 shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant border-white/10 hover:border-white/20'
            }`}
          >
            <Fuel className="w-4 h-4" />
            Fuel Logs ({fuelLogs.length})
          </button>
          <button
            onClick={() => setTab('expenses')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 border ${
              tab === 'expenses'
                ? 'bg-primary/20 text-primary border-primary/40 shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant border-white/10 hover:border-white/20'
            }`}
          >
            <Receipt className="w-4 h-4" />
            General Expenses ({expenses.length})
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-surface-container-low border border-white/10 overflow-hidden">
          {tab === 'fuel' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs font-semibold text-on-surface-variant uppercase">
                  <th className="p-4">Vehicle Asset</th>
                  <th className="p-4">Fuel Station / Hub</th>
                  <th className="p-4">Liters Dispensed</th>
                  <th className="p-4">Rate per Liter</th>
                  <th className="p-4">Total Cost</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {fuelLogs.map((f) => {
                  const veh = store.getVehicleById(f.vehicleId)
                  const rate = Math.round(f.cost / f.liters)
                  return (
                    <tr key={f.id} className="hover:bg-white/5">
                      <td className="p-4 font-mono font-bold text-primary">
                        {veh ? veh.registrationNumber : f.vehicleId}
                      </td>
                      <td className="p-4 text-xs font-medium text-on-surface">{f.station}</td>
                      <td className="p-4">{f.liters} L</td>
                      <td className="p-4 font-mono text-xs">₹{rate}/L</td>
                      <td className="p-4 font-bold text-rose-400">₹{f.cost.toLocaleString()}</td>
                      <td className="p-4 font-mono text-xs">{f.date}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs font-semibold text-on-surface-variant uppercase">
                  <th className="p-4">Vehicle Asset</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Notes / Description</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {expenses.map((ex) => {
                  const veh = store.getVehicleById(ex.vehicleId)
                  return (
                    <tr key={ex.id} className="hover:bg-white/5">
                      <td className="p-4 font-mono font-bold text-primary">
                        {veh ? veh.registrationNumber : ex.vehicleId}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10">
                          {ex.category}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-on-surface-variant">{ex.notes}</td>
                      <td className="p-4 font-bold text-amber-400">₹{ex.amount.toLocaleString()}</td>
                      <td className="p-4 font-mono text-xs">{ex.date}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Add Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface-container rounded-2xl border border-white/10 w-full max-w-lg p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <h3 className="text-lg font-bold text-on-surface">
                  {tab === 'fuel' ? 'Log Refueling Receipt' : 'Record Fleet Expense'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddRecord} className="space-y-4">
                <div>
                  <label className="text-xs text-on-surface-variant font-semibold block mb-1">Select Vehicle Asset</label>
                  <select
                    value={vehId}
                    onChange={(e) => setVehId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm"
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.registrationNumber} ({v.vehicleName})
                      </option>
                    ))}
                  </select>
                </div>

                {tab === 'fuel' ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-on-surface-variant font-semibold block mb-1">Liters Dispensed</label>
                        <input
                          required
                          type="number"
                          value={liters}
                          onChange={(e) => setLiters(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-on-surface-variant font-semibold block mb-1">Total Amount (₹)</label>
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
                      <label className="text-xs text-on-surface-variant font-semibold block mb-1">Fuel Station / Location</label>
                      <input
                        required
                        type="text"
                        value={station}
                        onChange={(e) => setStation(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-on-surface-variant font-semibold block mb-1">Expense Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as any)}
                          className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm"
                        >
                          <option value="Toll">Toll</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="Parking">Parking</option>
                          <option value="Insurance">Insurance</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-on-surface-variant font-semibold block mb-1">Amount (₹)</label>
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
                      <label className="text-xs text-on-surface-variant font-semibold block mb-1">Description / Notes</label>
                      <input
                        required
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm"
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary/90"
                  >
                    Save Record
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
