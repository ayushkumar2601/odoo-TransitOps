'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sidebar } from '../../components/sidebar'
import { store, Driver } from '@/lib/mock'
import { CSVImportModal } from '@/components/csv-import-modal'
import {
  Users,
  ShieldAlert,
  ShieldCheck,
  Phone,
  Calendar,
  Award,
  Plus,
  Upload,
  X,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [filter, setFilter] = useState<string>('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [error, setError] = useState('')
  const [successToast, setSuccessToast] = useState('')

  // Form State
  const [name, setName] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [licenseCategory, setLicenseCategory] = useState<'HMV' | 'Transport' | 'LMV'>('HMV')
  const [expiryDate, setExpiryDate] = useState('2029-12-31')
  const [contactNumber, setContactNumber] = useState('+91 ')

  function loadDrivers() {
    setDrivers([...store.drivers])
  }

  useEffect(() => {
    loadDrivers()
  }, [])

  const today = new Date().toISOString().split('T')[0]

  const filteredDrivers = filter === 'All'
    ? drivers
    : drivers.filter(d => d.status === filter)

  function handleCreateDriver(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!name.trim() || !licenseNumber.trim() || !expiryDate || !contactNumber.trim()) {
      setError('Please fill in all required driver personnel fields.')
      return
    }

    // BR-004 Validation: License Expiry Check
    if (expiryDate < today) {
      setError('BR-004 Violation: Cannot register commercial driver with an already expired driving license.')
      return
    }

    // Duplicate license check
    const duplicate = store.drivers.find(d => d.licenseNumber.toLowerCase() === licenseNumber.trim().toLowerCase())
    if (duplicate) {
      setError(`BR-004 Violation: License number ${licenseNumber} is already registered under ${duplicate.name}.`)
      return
    }

    const newDriver: Driver = {
      id: `DRV-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      licenseNumber: licenseNumber.trim().toUpperCase(),
      licenseCategory,
      expiryDate,
      contactNumber: contactNumber.trim(),
      safetyScore: 92,
      completedTrips: 0,
      totalTrips: 0,
      status: 'Available'
    }

    store.drivers.unshift(newDriver)
    loadDrivers()
    setShowAddModal(false)

    // Reset Form
    setName('')
    setLicenseNumber('')
    setExpiryDate('2029-12-31')
    setContactNumber('+91 ')

    setSuccessToast(`Driver ${newDriver.name} (${newDriver.id}) registered successfully!`)
    setTimeout(() => setSuccessToast(''), 4000)
  }

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {successToast && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-500 text-on-primary font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            {successToast}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 uppercase">
                Personnel Governance
              </span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">Driver Roster & Compliance Audit</h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Enforcing BR-004 (License Validity Lock) & BR-005 (Suspended Personnel Lock). Total: {drivers.length} Drivers.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowImport(true)}
              className="px-4 py-2.5 bg-surface-container-low hover:bg-white/10 border border-white/15 text-white font-semibold rounded-xl flex items-center gap-2 transition-all text-sm"
            >
              <Upload className="w-4 h-4 text-primary" />
              Import CSV
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-primary text-on-primary font-semibold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm"
            >
              <Plus className="w-4 h-4" />
              Onboard New Driver
            </button>
          </div>
        </div>

        <CSVImportModal
          isOpen={showImport}
          category="Drivers"
          onClose={() => setShowImport(false)}
          onImported={() => loadDrivers()}
        />

        {/* Status Filter Bar */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['All', 'Available', 'On Trip', 'Off Duty', 'Suspended'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                filter === st
                  ? 'bg-primary/20 text-primary border-primary/40'
                  : 'bg-surface-container-low text-on-surface-variant border-white/10 hover:border-white/20'
              }`}
            >
              {st} ({st === 'All' ? drivers.length : drivers.filter(d => d.status === st).length})
            </button>
          ))}
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrivers.map((d) => {
            const isExpired = d.expiryDate < today
            const isExpiringSoon = !isExpired && d.expiryDate <= '2026-08-15'

            return (
              <div
                key={d.id}
                className="p-5 rounded-2xl bg-surface-container-low border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                        {d.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-on-surface">{d.name}</h3>
                        <p className="text-xs font-mono text-on-surface-variant">{d.licenseNumber}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase border ${
                        d.status === 'Available'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : d.status === 'On Trip'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : d.status === 'Off Duty'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>

                  {/* License Expiry Banner if expired or expiring */}
                  {isExpired && (
                    <div className="px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs mb-3 flex items-center gap-1.5 font-semibold">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                      EXPIRED LICENSE ({d.expiryDate}) — BR-004 Locked
                    </div>
                  )}

                  {isExpiringSoon && (
                    <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs mb-3 flex items-center gap-1.5 font-semibold">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      Expiring Soon ({d.expiryDate})
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/5 text-xs">
                    <div>
                      <span className="text-on-surface-variant block">Category</span>
                      <span className="font-semibold text-on-surface">{d.licenseCategory}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">Safety Score</span>
                      <span className="font-bold text-emerald-400">{d.safetyScore} / 100</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">Total Trips</span>
                      <span className="font-medium text-on-surface">{d.totalTrips}</span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant block">License Expiry</span>
                      <span className="font-mono text-on-surface">{d.expiryDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 text-xs">
                  <Link
                    href={`/drivers/${d.id}`}
                    className="text-primary hover:underline font-semibold"
                  >
                    Performance Center →
                  </Link>
                  <span className="font-mono text-on-surface">{d.contactNumber}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Add Driver Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-surface-container rounded-2xl border border-white/15 w-full max-w-lg p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-bold text-on-surface text-base">Onboard Commercial Driver</h3>
                    <p className="text-xs text-on-surface-variant">Enforces BR-004 License Expiry Verification</p>
                  </div>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateDriver} className="space-y-4">
                <div>
                  <label className="block text-xs text-on-surface-variant font-semibold uppercase mb-1">
                    Driver Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Soumitra Chatterjee"
                    className="w-full px-4 py-2.5 bg-surface rounded-xl border border-white/10 text-on-surface text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-on-surface-variant font-semibold uppercase mb-1">
                      License Number
                    </label>
                    <input
                      type="text"
                      required
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="WB-DL-2022-99120"
                      className="w-full px-4 py-2.5 bg-surface rounded-xl border border-white/10 text-on-surface text-xs font-mono uppercase focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-on-surface-variant font-semibold uppercase mb-1">
                      License Category
                    </label>
                    <select
                      value={licenseCategory}
                      onChange={(e) => setLicenseCategory(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-surface rounded-xl border border-white/10 text-on-surface text-xs focus:outline-none focus:border-primary"
                    >
                      <option value="HMV">HMV (Heavy Commercial)</option>
                      <option value="Transport">Transport</option>
                      <option value="LMV">LMV (Light Commercial)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-on-surface-variant font-semibold uppercase mb-1">
                      License Expiry Date
                    </label>
                    <input
                      type="date"
                      required
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-surface rounded-xl border border-white/10 text-on-surface text-xs font-mono focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-on-surface-variant font-semibold uppercase mb-1">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      required
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="+91 98300 11000"
                      className="w-full px-4 py-2.5 bg-surface rounded-xl border border-white/10 text-on-surface text-xs font-mono focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-on-surface"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-lg shadow-primary/20"
                  >
                    Onboard Driver
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
