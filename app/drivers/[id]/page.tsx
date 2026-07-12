'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from '@/components/sidebar'
import { store, Driver, Trip } from '@/lib/mock'
import {
  User,
  Award,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Phone,
  Truck,
  ArrowLeft,
  Activity,
  CheckCircle2,
  Navigation
} from 'lucide-react'

export default function DriverProfileDetail() {
  const params = useParams()
  const router = useRouter()
  const driverId = typeof params?.id === 'string' ? params.id : ''

  const [driver, setDriver] = useState<Driver | null>(null)
  const [driverTrips, setDriverTrips] = useState<Trip[]>([])

  function getTripDriverName(t: Trip): string {
    const customName = (t as any).driverName
    if (customName && typeof customName === 'string') return customName
    const drv = store.drivers.find(d => d.id === t.driverId)
    return drv ? drv.name : ''
  }

  useEffect(() => {
    const found = store.drivers.find(d => d.id === driverId) || store.drivers[0]
    setDriver(found)
    if (found) {
      const trips = store.trips.filter(t => {
        const dName = getTripDriverName(t)
        return dName === found.name || dName.includes(found.name.split(' ')[0])
      })
      setDriverTrips(trips)
    }
  }, [driverId])

  if (!driver) return null

  const isExpired = new Date(driver.expiryDate) < new Date()

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <main className="flex-1 md:ml-60 p-6 md:p-8 overflow-y-auto">
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            href="/drivers"
            className="inline-flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Driver Registry
          </Link>
        </div>

        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-1 bg-primary/15 text-primary rounded-full border border-primary/30 uppercase">
                Driver Performance Center
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-on-surface">
                ID: {driver.id}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight flex items-center gap-3">
              {driver.name}
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold uppercase border ${
                  driver.status === 'On Trip'
                    ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                    : driver.status === 'Available'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                }`}
              >
                {driver.status}
              </span>
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Commercial Heavy Transport Operator • License #{driver.licenseNumber} • Assigned Hub: Eastern India
            </p>
          </div>
        </div>

        {/* BR-004 Governance Alert Box */}
        {isExpired && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-white">BR-004 License Expiry Lockout Active</h4>
                <p className="text-xs text-rose-200">
                  Driving license expired on {driver.expiryDate}. Dispatch assignment blocked automatically.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-lg bg-rose-500/30 text-xs font-bold text-white uppercase">
              Locked
            </span>
          </div>
        )}

        {/* Core KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Driver Safety Score</span>
            <div className="text-3xl font-bold text-emerald-400 mt-2">{driver.safetyScore} / 100</div>
            <div className="text-xs text-emerald-300 mt-1">Top Tier Safety Governance</div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Total Trips Completed</span>
            <div className="text-3xl font-bold text-white mt-2">{driver.completedTrips}</div>
            <div className="text-xs text-on-surface-variant mt-1">Verified haulage missions</div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">On-Time Delivery Rate</span>
            <div className="text-3xl font-bold text-blue-400 mt-2">97.8%</div>
            <div className="text-xs text-blue-300 mt-1">Consistently meets SLA windows</div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">License Expiry</span>
            <div className={`text-2xl font-bold font-mono mt-2 ${isExpired ? 'text-rose-400' : 'text-amber-400'}`}>
              {driver.expiryDate}
            </div>
            <div className="text-xs text-on-surface-variant mt-1">License #{driver.licenseNumber}</div>
          </div>
        </div>

        {/* Driver Trip History Table */}
        <div className="rounded-2xl bg-surface-container-low border border-white/10 overflow-hidden">
          <div className="p-5 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-primary" />
              Assigned & Completed Haulage Trips
            </h3>
            <span className="text-xs font-mono text-on-surface-variant">Showing {driverTrips.length} trips</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs font-semibold text-on-surface-variant uppercase">
                  <th className="p-4">Trip Code</th>
                  <th className="p-4">Route Corridors</th>
                  <th className="p-4">Assigned Vehicle</th>
                  <th className="p-4">Cargo Weight</th>
                  <th className="p-4">Revenue Yield</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {driverTrips.map(trip => (
                  <tr key={trip.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-primary">
                      {trip.tripCode}
                    </td>
                    <td className="p-4 font-semibold text-white">
                      {trip.source} → {trip.destination}
                    </td>
                    <td className="p-4 font-mono text-xs text-on-surface-variant">
                      {(trip as any).vehicleRegistration || trip.vehicleId}
                    </td>
                    <td className="p-4 text-emerald-400 font-semibold">
                      {(trip.cargoWeight || 0).toLocaleString()} kg
                    </td>
                    <td className="p-4 font-bold text-amber-400">
                      ₹{(trip.plannedRevenue || (trip as any).freightRevenue || 0).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase border ${
                          trip.status === 'Delivered'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                        }`}
                      >
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
