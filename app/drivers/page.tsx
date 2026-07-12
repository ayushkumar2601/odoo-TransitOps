'use client'

import React, { useEffect, useState } from 'react'
import { Sidebar } from '../../components/sidebar'
import { store, Driver } from '@/lib/mock'
import {
  Users,
  ShieldAlert,
  ShieldCheck,
  Phone,
  Calendar,
  Award
} from 'lucide-react'

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [filter, setFilter] = useState<string>('All')

  function loadDrivers() {
    setDrivers([...store.drivers])
  }

  useEffect(() => {
    loadDrivers()
  }, [])

  const filteredDrivers = filter === 'All'
    ? drivers
    : drivers.filter(d => d.status === filter)

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10">
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
        </div>

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
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-base font-bold text-on-surface">{d.name}</h3>
                      <span className="font-mono text-xs text-primary block mt-0.5">{d.licenseNumber}</span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        d.status === 'Available'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : d.status === 'On Trip'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : d.status === 'Off Duty'
                          ? 'bg-white/10 text-on-surface-variant border-white/20'
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
                  <span className="text-on-surface-variant flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    Contact Number
                  </span>
                  <span className="font-mono text-on-surface">{d.contactNumber}</span>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
