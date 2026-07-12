'use client'

import React, { useEffect, useState } from 'react'
import { Sidebar } from '../../components/sidebar'
import { store, getDashboardKPIs, getAnalyticsSummary } from '@/lib/mock'
import {
  FleetHealthWidget,
  CriticalVehiclesWidget,
  ExpiringLicensesWidget,
  TopROIWidget
} from '@/components/dashboard-widgets'
import { GlobalSearchModal } from '@/components/global-search'
import { FleetCopilotModal } from '@/components/fleet-copilot'
import {
  runDispatchScenario,
  runMaintenanceScenario,
  runLicenseExpiryScenario,
  runResetScenario
} from '@/lib/demo-scenarios'
import {
  exportVehiclesCSV,
  exportDriversCSV,
  exportTripsCSV,
  exportMaintenanceCSV,
  exportFuelLogsCSV,
  exportExpensesCSV
} from '@/lib/export/csv'
import { generateSmartAlerts, SmartAlert } from '@/lib/alerts/alert-engine'
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
  Info,
  Search,
  Sparkles,
  Download,
  Play,
  RotateCcw
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [trips, setTrips] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [smartAlerts, setSmartAlerts] = useState<SmartAlert[]>([])
  const [userRole, setUserRole] = useState('Fleet Manager')
  const [userName, setUserName] = useState('Aditya Banerjee')

  // Phase 1.5 Modals
  const [showSearch, setShowSearch] = useState(false)
  const [showCopilot, setShowCopilot] = useState(false)
  const [scenarioToast, setScenarioToast] = useState<{ title: string; message: string } | null>(null)

  function loadDashboardState() {
    setData(getDashboardKPIs())
    setTrips([...store.trips])
    setVehicles([...store.vehicles])
    setDrivers([...store.drivers])
    setNotifications([...store.notifications])
    setSmartAlerts(generateSmartAlerts())
  }

  useEffect(() => {
    const savedRole = localStorage.getItem('user_role') || 'Fleet Manager'
    const savedName = localStorage.getItem('user_name') || 'Aditya Banerjee'
    setUserRole(savedRole)
    setUserName(savedName)
    loadDashboardState()
  }, [])

  function handleRunScenario(scenarioFn: () => { success: boolean; title: string; message: string }) {
    const res = scenarioFn()
    setScenarioToast({ title: res.title, message: res.message })
    loadDashboardState()
    setTimeout(() => {
      setScenarioToast(null)
    }, 4500)
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Scenario Toast Alert */}
        {scenarioToast && (
          <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-surface-container border border-primary/40 shadow-2xl flex items-center gap-3 animate-fade-in max-w-md">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h4 className="font-bold text-on-surface text-sm">{scenarioToast.title}</h4>
              <p className="text-xs text-on-surface-variant mt-0.5">{scenarioToast.message}</p>
            </div>
          </div>
        )}

        {/* Phase 1.5 Top Command Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-1 bg-primary/15 text-primary rounded-full border border-primary/30 uppercase tracking-wide">
                {userRole} Workspace
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                Phase 1.5 Enterprise
              </span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">
              TransitOps Command Center
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Welcome back, {userName}. Managing {data.total_vehicles} commercial assets across Eastern India logistics corridors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Global Search Button */}
            <button
              onClick={() => setShowSearch(true)}
              className="px-3.5 py-2 rounded-xl bg-surface-container-low border border-white/15 text-on-surface-variant hover:text-white text-xs font-semibold flex items-center gap-2"
            >
              <Search className="w-3.5 h-3.5" />
              Search
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">CMD+K</kbd>
            </button>

            {/* AI Fleet Copilot Button */}
            <button
              onClick={() => setShowCopilot(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-4 h-4" />
              AI Fleet Copilot (Groq)
            </button>

            {/* Register Asset */}
            <Link
              href="/vehicles"
              className="px-4 py-2 bg-primary text-on-primary font-semibold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-xs"
            >
              <Plus className="w-4 h-4" />
              Register Asset
            </Link>
          </div>
        </div>

        {/* Hackathon Demo Scenario Automation Bar */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-white/10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Play className="w-5 h-5 text-primary shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-on-surface">Hackathon Demo Automation Controls</h4>
              <p className="text-xs text-on-surface-variant">Trigger live business rule scenarios or reset to original seed dataset</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleRunScenario(runDispatchScenario)}
              className="px-3 py-1.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 text-xs font-semibold hover:bg-blue-500/25"
            >
              Dispatch Scenario (BR-009)
            </button>
            <button
              onClick={() => handleRunScenario(runMaintenanceScenario)}
              className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/25"
            >
              Workshop Lock (BR-012)
            </button>
            <button
              onClick={() => handleRunScenario(runLicenseExpiryScenario)}
              className="px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-semibold hover:bg-rose-500/25"
            >
              Simulate Expired License (BR-004)
            </button>
            <button
              onClick={() => handleRunScenario(runResetScenario)}
              className="px-3 py-1.5 rounded-xl bg-white/10 text-on-surface hover:bg-white/15 border border-white/20 text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Seed Data
            </button>
          </div>
        </div>

        {/* Command Center Widgets Grid (Task 4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <FleetHealthWidget />
          <CriticalVehiclesWidget />
          <ExpiringLicensesWidget />
          <TopROIWidget />
        </div>

        {/* Smart Alert Engine Feed (Task 3) */}
        {smartAlerts.length > 0 && (
          <div className="p-6 rounded-2xl bg-surface-container-low border border-white/10 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-on-surface">Smart Alert Engine Feed ({smartAlerts.length})</h3>
              </div>
              <span className="text-xs text-on-surface-variant font-mono">Severity Graded: Critical / High / Medium</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {smartAlerts.slice(0, 4).map((alt) => (
                <div
                  key={alt.id}
                  className={`p-4 rounded-xl border flex items-start justify-between ${
                    alt.severity === 'Critical'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      : alt.severity === 'High'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-white/5 border-white/10 text-on-surface'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase bg-black/30">
                        {alt.severity} • {alt.category}
                      </span>
                      <span className="text-[10px] opacity-70">{alt.createdAt}</span>
                    </div>
                    <h4 className="font-bold text-xs">{alt.title}</h4>
                    <p className="text-[11px] opacity-85 mt-0.5">{alt.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRD Operational Formula Metric Banner */}
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
              <span className="text-xs text-on-surface-variant block">Vehicles Available</span>
              <span className="text-xl font-bold text-emerald-400">{data.vehicles_available}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-on-surface-variant block">Vehicles In Shop</span>
              <span className="text-xl font-bold text-amber-400">{data.vehicles_in_shop}</span>
            </div>
          </div>
        </div>

        {/* Core KPIs Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Active Fleet Assets</span>
            <div className="text-3xl font-bold text-on-surface mt-2">{data.total_vehicles}</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              {data.vehicles_available} Ready for Dispatch
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Haulage Dispatches</span>
            <div className="text-3xl font-bold text-primary mt-2">{data.active_trips}</div>
            <div className="text-xs text-on-surface-variant mt-1">
              {data.pending_trips} Draft Corridors Pending
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Driver Roster Ratios</span>
            <div className="text-3xl font-bold text-on-surface mt-2">{data.drivers_on_duty} / {data.total_drivers}</div>
            <div className="text-xs text-emerald-400 mt-1">
              Average Safety Score: {data.average_safety_score}/100
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Monthly Fuel Logs</span>
            <div className="text-3xl font-bold text-rose-400 mt-2">₹{data.monthly_fuel_cost.toLocaleString()}</div>
            <div className="text-xs text-on-surface-variant mt-1">
              {data.monthly_expenses_total.toLocaleString()} INR total monthly ops
            </div>
          </div>
        </div>

        {/* CSV Export Quick Action Suite (Task 5) */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-white/10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-on-surface uppercase">Instant CSV Data Export Suite</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={exportVehiclesCSV} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-on-surface font-medium">
              Export Vehicles CSV
            </button>
            <button onClick={exportDriversCSV} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-on-surface font-medium">
              Export Drivers CSV
            </button>
            <button onClick={exportTripsCSV} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-on-surface font-medium">
              Export Trips CSV
            </button>
            <button onClick={exportMaintenanceCSV} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-on-surface font-medium">
              Export Maintenance CSV
            </button>
            <button onClick={exportFuelLogsCSV} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-on-surface font-medium">
              Export Fuel Logs CSV
            </button>
          </div>
        </div>

        {/* Global Search & AI Copilot Modals */}
        <GlobalSearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
        <FleetCopilotModal isOpen={showCopilot} onClose={() => setShowCopilot(false)} />
      </main>
    </div>
  )
}
