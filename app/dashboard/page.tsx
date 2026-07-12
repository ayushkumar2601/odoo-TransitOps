'use client'

import React, { useEffect, useState } from 'react'
import { Sidebar } from '../../components/sidebar'
import { store, getDashboardKPIs, getAnalyticsSummary } from '@/lib/mock'
import {
  Truck,
  Users,
  MapPin,
  Activity,
  Wrench,
  Send,
  ShieldCheck,
  Fuel,
  Plus,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [trips, setTrips] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [userRole, setUserRole] = useState('Fleet Manager')
  const [userName, setUserName] = useState('Aditya Banerjee')

  function loadAllFromCentralStore() {
    setData(getDashboardKPIs())
    setTrips([...store.trips])
    setVehicles([...store.vehicles])
    setDrivers([...store.drivers])
    setNotifications([...store.notifications])
  }

  useEffect(() => {
    const role = localStorage.getItem('user_role') || 'Fleet Manager'
    const name = localStorage.getItem('user_name') || 'Aditya Banerjee'
    setUserRole(role)
    setUserName(name)
    loadAllFromCentralStore()
  }, [])

  function handleDispatchTrip(tripId: string) {
    const result = store.dispatchTrip(tripId)
    if (!result.success) {
      alert(`Dispatch Rule Violation:\n${result.message}`)
      return
    }
    loadAllFromCentralStore()
  }

  if (!data) return null

  const draftTrips = trips.filter(t => t.status === 'Draft')
  const activeTrips = trips.filter(t => t.status === 'Dispatched')
  const availableVehicles = vehicles.filter(v => v.status === 'Available')
  const availableDrivers = drivers.filter(d => d.status === 'Available')

  // Notification badge style helper
  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
      case 'alert': return <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
      default: return <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
    }
  }

  // ==========================================
  // 1. FLEET MANAGER DASHBOARD VIEW
  // ==========================================
  if (userRole === 'Fleet Manager') {
    return (
      <div className="min-h-screen bg-surface flex">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 uppercase tracking-wide">
                Fleet Manager Executive Portal
              </span>
              <h1 className="text-3xl font-bold text-on-surface tracking-tight mt-2">
                Executive Asset Control Tower
              </h1>
              <p className="text-sm text-on-surface-variant mt-1">
                Welcome back, {userName}. Managing {data.total_vehicles} total fleet assets across Eastern India corridors.
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Link
                href="/vehicles"
                className="px-4 py-2.5 bg-primary text-on-primary font-semibold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm"
              >
                <Plus className="w-4 h-4" />
                Register Vehicle
              </Link>
            </div>
          </div>

          {/* Utilization Formula Hero Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-surface-container-low border border-primary/30 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase mb-1">
                <Activity className="w-4 h-4" />
                PRD Operational Formula Metric
              </div>
              <h2 className="text-2xl font-bold text-on-surface">
                Fleet Utilization Rate: {data.fleet_utilization_rate}%
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Formula: (Vehicles On Trip [{data.vehicles_on_trip}] / Total Active Fleet [{data.total_vehicles}]) × 100
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-400">{data.vehicles_available}</div>
                <div className="text-xs text-on-surface-variant">Available Assets</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-amber-400">{data.vehicles_in_shop}</div>
                <div className="text-xs text-on-surface-variant">In Workshop</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-rose-400">{data.vehicles_retired}</div>
                <div className="text-xs text-on-surface-variant">Retired</div>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-on-surface-variant uppercase">Total Fleet Size</span>
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-on-surface">{data.total_vehicles}</div>
              <div className="text-xs text-emerald-400 mt-1 font-medium">WB / JH / OD Registered</div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-on-surface-variant uppercase">Active Dispatches</span>
                <MapPin className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-on-surface">{data.active_trips}</div>
              <div className="text-xs text-blue-400 mt-1 font-medium">Trips currently in transit</div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-on-surface-variant uppercase">Workshop Repairs</span>
                <Wrench className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-bold text-on-surface">{data.vehicles_in_shop}</div>
              <div className="text-xs text-amber-400 mt-1 font-medium">BR-012 locked assets</div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-on-surface-variant uppercase">Fleet Safety Average</span>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold text-on-surface">90.2 / 100</div>
              <div className="text-xs text-emerald-400 mt-1 font-medium">Compliance verified</div>
            </div>
          </div>

          {/* Asset Readiness & Live Notifications Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-2xl bg-surface-container-low border border-white/10">
              <h3 className="text-lg font-bold text-on-surface mb-4">Fleet Asset Status Breakdown</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {vehicles.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <div className="font-mono font-bold text-primary text-sm">{v.registrationNumber}</div>
                      <div className="text-xs text-on-surface-variant">{v.vehicleName} ({v.maxLoadCapacity} kg max)</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      v.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      v.status === 'On Trip' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      v.status === 'In Shop' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {v.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Centralized Notifications Feed */}
            <div className="p-6 rounded-2xl bg-surface-container-low border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Live Operations Feed ({notifications.length})
                </h3>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex gap-3">
                    {getNotifIcon(n.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-on-surface">{n.title}</span>
                        <span className="text-[11px] text-on-surface-variant font-mono">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ==========================================
  // 2. DISPATCHER DASHBOARD VIEW
  // ==========================================
  if (userRole === 'Dispatcher') {
    return (
      <div className="min-h-screen bg-surface flex">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-bold px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 uppercase tracking-wide">
                Dispatcher Operations Center
              </span>
              <h1 className="text-3xl font-bold text-on-surface tracking-tight mt-2">
                Dispatch Command Room (BR-002 to BR-009)
              </h1>
              <p className="text-sm text-on-surface-variant mt-1">
                Route assignment, cargo load validation, and real-time dispatch release.
              </p>
            </div>
            <Link
              href="/trips"
              className="mt-4 md:mt-0 px-4 py-2.5 bg-primary text-on-primary font-semibold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all text-sm shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              Create Route & Dispatch
            </Link>
          </div>

          {/* Dispatcher Queue Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 uppercase">Draft Trips Pending Dispatch</span>
                <MapPin className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-bold text-on-surface">{draftTrips.length}</div>
              <div className="text-xs text-on-surface-variant mt-1">Ready for BR-009 validation</div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 uppercase">Available Fleet Pool</span>
                <Truck className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold text-on-surface">{availableVehicles.length}</div>
              <div className="text-xs text-emerald-400 mt-1">Verified ready assets</div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-400 uppercase">Available Drivers Pool</span>
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-on-surface">{availableDrivers.length}</div>
              <div className="text-xs text-blue-400 mt-1">License & status compliant</div>
            </div>
          </div>

          {/* Pending Dispatch Action Queue */}
          <div className="rounded-2xl bg-surface-container-low border border-white/10 overflow-hidden mb-8">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-bold text-on-surface">Ready For Dispatch Release (BR-009 Action Queue)</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs font-semibold text-on-surface-variant uppercase">
                  <th className="p-4">Trip Code</th>
                  <th className="p-4">Route Corridor</th>
                  <th className="p-4">Assigned Vehicle</th>
                  <th className="p-4">Assigned Driver</th>
                  <th className="p-4">Cargo Weight</th>
                  <th className="p-4 text-right">Dispatch Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {draftTrips.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                      No pending draft trips. Create a trip to initiate dispatch.
                    </td>
                  </tr>
                ) : (
                  draftTrips.map((t) => {
                    const veh = store.getVehicleById(t.vehicleId)
                    const drv = store.getDriverById(t.driverId)
                    return (
                      <tr key={t.id} className="hover:bg-white/5">
                        <td className="p-4 font-mono font-bold text-primary">{t.tripCode}</td>
                        <td className="p-4">{t.source} → {t.destination}</td>
                        <td className="p-4 font-mono">{veh?.registrationNumber || t.vehicleId}</td>
                        <td className="p-4">{drv?.name || t.driverId}</td>
                        <td className="p-4">{t.cargoWeight} kg</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDispatchTrip(t.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-blue-500 text-white font-semibold text-xs hover:bg-blue-600 flex items-center gap-1.5 ml-auto shadow-md"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Release Dispatch (BR-009)
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    )
  }

  // ==========================================
  // 3. SAFETY OFFICER DASHBOARD VIEW
  // ==========================================
  if (userRole === 'Safety Officer') {
    const expiringDrivers = drivers.filter(d => {
      const today = new Date().toISOString().split('T')[0]
      return d.expiryDate >= today && d.expiryDate <= '2026-08-15'
    })
    const expiredDrivers = drivers.filter(d => d.expiryDate < new Date().toISOString().split('T')[0])

    return (
      <div className="min-h-screen bg-surface flex">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-bold px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 uppercase tracking-wide">
                Safety & Compliance Portal
              </span>
              <h1 className="text-3xl font-bold text-on-surface tracking-tight mt-2">
                Driver Compliance & Risk Audit Tower
              </h1>
              <p className="text-sm text-on-surface-variant mt-1">
                Enforcing BR-004 (License Validity) and BR-005 (Suspended Driver Locks).
              </p>
            </div>
            <Link
              href="/drivers"
              className="mt-4 md:mt-0 px-4 py-2.5 bg-amber-500 text-white font-semibold rounded-xl flex items-center gap-2 hover:bg-amber-600 transition-all text-sm shadow-lg shadow-amber-500/20"
            >
              <Users className="w-4 h-4" />
              Manage Driver Roster
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
              <span className="text-xs font-semibold text-on-surface-variant uppercase">Fleet Average Safety Score</span>
              <div className="text-3xl font-bold text-emerald-400 mt-2">90.2 / 100</div>
              <div className="text-xs text-emerald-400 mt-1">Safety Scores Range: 62–98</div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
              <span className="text-xs font-semibold text-on-surface-variant uppercase">BR-004 Expiring Within 30 Days</span>
              <div className="text-3xl font-bold text-amber-400 mt-2">{expiringDrivers.length} Drivers</div>
              <div className="text-xs text-amber-400 mt-1">Needs urgent renewal action</div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
              <span className="text-xs font-semibold text-on-surface-variant uppercase">BR-004 / BR-005 Locked Drivers</span>
              <div className="text-3xl font-bold text-rose-400 mt-2">
                {expiredDrivers.length + drivers.filter(d => d.status === 'Suspended').length} Personnel
              </div>
              <div className="text-xs text-rose-400 mt-1">Locked from trip assignment</div>
            </div>
          </div>

          <div className="rounded-2xl bg-surface-container-low border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-bold text-on-surface">Driver Risk & Safety Telemetry Board</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs font-semibold text-on-surface-variant uppercase">
                  <th className="p-4">Driver Name</th>
                  <th className="p-4">License Number</th>
                  <th className="p-4">License Expiration</th>
                  <th className="p-4">Safety Score (0-100)</th>
                  <th className="p-4">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {drivers.map((d) => (
                  <tr key={d.id} className="hover:bg-white/5">
                    <td className="p-4 font-bold text-on-surface">{d.name}</td>
                    <td className="p-4 font-mono text-primary">{d.licenseNumber}</td>
                    <td className="p-4">{d.expiryDate}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {d.safetyScore} / 100
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        d.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        d.status === 'On Trip' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    )
  }

  // ==========================================
  // 4. FINANCIAL ANALYST DASHBOARD VIEW
  // ==========================================
  if (userRole === 'Financial Analyst') {
    const analytics = getAnalyticsSummary()
    const totalRev = analytics.vehicle_roi_ranking.reduce((acc, v) => acc + v.revenue, 0)
    const totalFuel = analytics.vehicle_roi_ranking.reduce((acc, v) => acc + v.fuelCost, 0)
    const totalMaint = analytics.vehicle_roi_ranking.reduce((acc, v) => acc + v.maintenanceCost, 0)

    return (
      <div className="min-h-screen bg-surface flex">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-bold px-2.5 py-1 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20 uppercase tracking-wide">
                Financial Operations & BI
              </span>
              <h1 className="text-3xl font-bold text-on-surface tracking-tight mt-2">
                Financial Control & ROI Scorecard
              </h1>
              <p className="text-sm text-on-surface-variant mt-1">
                Real-time tracking of Fleet Acquisition ROI, Fuel Consumption, and Workshop Expenses.
              </p>
            </div>
            <Link
              href="/expenses"
              className="mt-4 md:mt-0 px-4 py-2.5 bg-purple-500 text-white font-semibold rounded-xl flex items-center gap-2 hover:bg-purple-600 transition-all text-sm shadow-lg shadow-purple-500/20"
            >
              <Fuel className="w-4 h-4" />
              Log Fuel / Expense
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
              <span className="text-xs font-semibold text-on-surface-variant uppercase">Realized & Active Revenue</span>
              <div className="text-3xl font-bold text-emerald-400 mt-2">₹{totalRev.toLocaleString()}</div>
              <div className="text-xs text-emerald-400 mt-1">Eastern India Corridor Earnings</div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
              <span className="text-xs font-semibold text-on-surface-variant uppercase">Total Fuel Logged</span>
              <div className="text-3xl font-bold text-rose-400 mt-2">₹{totalFuel.toLocaleString()}</div>
              <div className="text-xs text-rose-400 mt-1">120 refueling receipts</div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
              <span className="text-xs font-semibold text-on-surface-variant uppercase">Workshop Repairs</span>
              <div className="text-3xl font-bold text-amber-400 mt-2">₹{totalMaint.toLocaleString()}</div>
              <div className="text-xs text-amber-400 mt-1">BR-012 maintenance tickets</div>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
              <span className="text-xs font-semibold text-on-surface-variant uppercase">Fleet Average ROI</span>
              <div className="text-3xl font-bold text-primary mt-2">4.18%</div>
              <div className="text-xs text-primary mt-1">(Revenue - Fuel - Maint) / Cost</div>
            </div>
          </div>

          <div className="rounded-2xl bg-surface-container-low border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-on-surface">Detailed Asset ROI Leaderboard</h3>
              <Link href="/analytics" className="text-xs text-primary hover:underline font-semibold">
                View Full BI Charts →
              </Link>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs font-semibold text-on-surface-variant uppercase">
                  <th className="p-4">Registration #</th>
                  <th className="p-4">Vehicle Model</th>
                  <th className="p-4">Acquisition Cost</th>
                  <th className="p-4">Revenue Earned</th>
                  <th className="p-4">Calculated ROI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {analytics.vehicle_roi_ranking.slice(0, 10).map((v) => (
                  <tr key={v.id} className="hover:bg-white/5">
                    <td className="p-4 font-mono font-bold text-primary">{v.registrationNumber}</td>
                    <td className="p-4">{v.vehicleName}</td>
                    <td className="p-4 font-semibold text-amber-400">₹{v.acquisitionCost.toLocaleString()}</td>
                    <td className="p-4 font-semibold text-emerald-400">₹{v.revenue.toLocaleString()}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                        {v.roiPercent}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    )
  }

  // ==========================================
  // 5. ADMIN / MASTER OVERVIEW DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs font-bold px-2.5 py-1 bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/20 uppercase tracking-wide">
              Admin Master Control Tower
            </span>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight mt-2">
              TransitOps Unified Command Center
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Complete visibility across Fleet Management, Dispatching, Compliance, and Finance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Total Fleet Size</span>
            <div className="text-3xl font-bold text-on-surface mt-2">{data.total_vehicles}</div>
          </div>
          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Fleet Utilization Rate</span>
            <div className="text-3xl font-bold text-primary mt-2">{data.fleet_utilization_rate}%</div>
          </div>
          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Active Dispatches</span>
            <div className="text-3xl font-bold text-blue-400 mt-2">{data.active_trips}</div>
          </div>
          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Workshop Assets</span>
            <div className="text-3xl font-bold text-amber-400 mt-2">{data.vehicles_in_shop}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-surface-container-low border border-white/10">
            <h3 className="text-lg font-bold text-on-surface mb-3">Quick Navigation by Module</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/vehicles" className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold text-primary">
                → Vehicle Registry
              </Link>
              <Link href="/drivers" className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold text-emerald-400">
                → Driver Governance
              </Link>
              <Link href="/trips" className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold text-blue-400">
                → Trip Dispatching
              </Link>
              <Link href="/analytics" className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold text-purple-400">
                → BI Analytics & ROI
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
