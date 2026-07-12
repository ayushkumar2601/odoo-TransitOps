'use client'

import React, { useEffect, useState } from 'react'
import { Sidebar } from '../../components/sidebar'
import { store, getDashboardKPIs, getAnalyticsSummary } from '@/lib/mock'
import {
  getStoredDashboardFilters,
  saveDashboardFilters,
  FilterCriteria
} from '@/lib/filtering/filter-engine'
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
  exportFuelLogsCSV
} from '@/lib/export/csv'
import { generateSmartAlerts, SmartAlert } from '@/lib/alerts/alert-engine'
import {
  Truck,
  Users,
  MapPin,
  Activity,
  Wrench,
  Fuel,
  Plus,
  AlertTriangle,
  Search,
  Sparkles,
  Download,
  Play,
  RotateCcw,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [smartAlerts, setSmartAlerts] = useState<SmartAlert[]>([])
  const [userRole, setUserRole] = useState('Fleet Manager')
  const [userName, setUserName] = useState('Aditya Banerjee')

  // Modals & Filters
  const [showSearch, setShowSearch] = useState(false)
  const [showCopilot, setShowCopilot] = useState(false)
  const [scenarioToast, setScenarioToast] = useState<{ title: string; message: string } | null>(null)
  const [filters, setFilters] = useState<FilterCriteria>({ vehicleType: 'All', status: 'All', region: 'All', dateRange: 'All' })

  function loadDashboardState() {
    setData(getDashboardKPIs())
    setSmartAlerts(generateSmartAlerts())
  }

  useEffect(() => {
    const savedRole = localStorage.getItem('user_role') || 'Fleet Manager'
    const savedName = localStorage.getItem('user_name') || 'Aditya Banerjee'
    setUserRole(savedRole)
    setUserName(savedName)
    setFilters(getStoredDashboardFilters())
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
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-6 md:p-10 max-w-[1600px] mx-auto overflow-x-hidden">
        {/* Scenario Toast */}
        {scenarioToast && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#18181B] border border-[#FF5A36] shadow-2xl flex items-center gap-3 animate-fadeIn">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A36]" />
            <div>
              <h4 className="font-bold text-xs text-[#FAFAFA]">{scenarioToast.title}</h4>
              <p className="text-xs text-[#A1A1AA]">{scenarioToast.message}</p>
            </div>
          </div>
        )}

        {/* Executive Header Band */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-[#27272A]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FF5A36]/30 text-[11px] font-bold uppercase tracking-wider">
                Enterprise Intelligence Layer
              </span>
              <span className="text-xs text-[#A1A1AA] font-mono">• Active Corridor Network</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#FAFAFA] tracking-tight">
              Executive Fleet Control Center
            </h1>
            <p className="text-sm text-[#A1A1AA] mt-1">
              Welcome back, <span className="font-semibold text-[#FAFAFA]">{userName}</span> ({userRole}). Real-time telemetry and AI dispatch oversight across 25 active assets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowSearch(true)}
              className="px-3.5 py-2 rounded-xl bg-[#111113] border border-[#27272A] hover:border-[#3F3F46] text-[#A1A1AA] hover:text-[#FAFAFA] text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              Global Search
              <kbd className="px-1.5 py-0.5 rounded bg-[#18181B] text-[10px] font-mono text-[#A1A1AA]">⌘K</kbd>
            </button>

            <button
              onClick={() => setShowCopilot(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#FF5A36]/20 hover:opacity-90 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              AI Copilot
            </button>

            <Link
              href="/vehicles"
              className="px-4 py-2 bg-[#FAFAFA] text-[#09090B] font-bold rounded-xl flex items-center gap-2 hover:bg-[#E5E7EB] transition-all shadow-sm text-xs"
            >
              <Plus className="w-4 h-4" />
              Register Asset
            </Link>
          </div>
        </div>

        {/* Stripe / Linear Enterprise KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Card 1: Fleet Assets */}
          <div className="p-6 rounded-2xl bg-[#111113] border border-[#27272A] hover:border-[#3F3F46] transition-all shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
                Total Fleet Assets
              </span>
              <span className="p-2 rounded-xl bg-[#18181B] border border-[#27272A] text-[#FF5A36]">
                <Truck className="w-4 h-4" />
              </span>
            </div>
            <div className="my-4">
              <div className="text-3xl font-black text-[#FAFAFA] tracking-tight">{data.total_vehicles}</div>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+8.4% vs last quarter</span>
              </div>
            </div>
            <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-xs text-[#A1A1AA]">
              <span>Ready for Dispatch</span>
              <span className="font-bold text-[#FAFAFA]">{data.vehicles_available} vehicles</span>
            </div>
          </div>

          {/* Card 2: Haulage Dispatches */}
          <div className="p-6 rounded-2xl bg-[#111113] border border-[#27272A] hover:border-[#3F3F46] transition-all shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
                Active Trips & Corridors
              </span>
              <span className="p-2 rounded-xl bg-[#18181B] border border-[#27272A] text-emerald-400">
                <MapPin className="w-4 h-4" />
              </span>
            </div>
            <div className="my-4">
              <div className="text-3xl font-black text-[#FAFAFA] tracking-tight">{data.active_trips}</div>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>99.4% SLA On-Time</span>
              </div>
            </div>
            <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-xs text-[#A1A1AA]">
              <span>Draft Corridors Pending</span>
              <span className="font-bold text-[#FAFAFA]">{data.pending_trips || 3} trips</span>
            </div>
          </div>

          {/* Card 3: Driver Governance */}
          <div className="p-6 rounded-2xl bg-[#111113] border border-[#27272A] hover:border-[#3F3F46] transition-all shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
                Driver Safety Average
              </span>
              <span className="p-2 rounded-xl bg-[#18181B] border border-[#27272A] text-blue-400">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="my-4">
              <div className="text-3xl font-black text-[#FAFAFA] tracking-tight">
                {data.average_safety_score || 88.5}<span className="text-lg font-normal text-[#A1A1AA]">/100</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Critical Infractions</span>
              </div>
            </div>
            <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-xs text-[#A1A1AA]">
              <span>Roster On-Duty</span>
              <span className="font-bold text-[#FAFAFA]">{data.drivers_on_duty || 20} / {data.total_drivers || 35}</span>
            </div>
          </div>

          {/* Card 4: Monthly Fuel & Ops */}
          <div className="p-6 rounded-2xl bg-[#111113] border border-[#27272A] hover:border-[#3F3F46] transition-all shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
                Monthly Fuel Expenditure
              </span>
              <span className="p-2 rounded-xl bg-[#18181B] border border-[#27272A] text-[#FF5A36]">
                <Fuel className="w-4 h-4" />
              </span>
            </div>
            <div className="my-4">
              <div className="text-3xl font-black text-[#FAFAFA] tracking-tight">
                ₹{((data.monthly_fuel_cost || 1420000) / 100000).toFixed(2)}L
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-[#A1A1AA]">
                <span>Optimized via AI Route Haulage</span>
              </div>
            </div>
            <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-xs text-[#A1A1AA]">
              <span>Total Monthly Ops</span>
              <span className="font-bold text-[#FAFAFA]">₹{((data.monthly_expenses_total || 2400000) / 100000).toFixed(2)}L</span>
            </div>
          </div>
        </div>

        {/* PRD Operational Formula Strip */}
        <div className="p-6 rounded-2xl bg-[#111113] border border-[#27272A] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#FF5A36] uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4" />
              PRD Operational Formula Verification
            </div>
            <h2 className="text-2xl font-black text-[#FAFAFA] tracking-tight">
              Fleet Utilization Rate: {data.fleet_utilization_rate}%
            </h2>
            <p className="text-xs text-[#A1A1AA] mt-1 font-mono">
              Formula: (Vehicles On Trip [{data.vehicles_on_trip}] / Total Active Fleet [{data.total_vehicles}]) × 100
            </p>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <span className="text-xs text-[#A1A1AA] block">Available Ready</span>
              <span className="text-2xl font-black text-emerald-400">{data.vehicles_available}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#A1A1AA] block">Workshop Locked</span>
              <span className="text-2xl font-black text-amber-400">{data.vehicles_in_shop}</span>
            </div>
          </div>
        </div>

        {/* Command Center Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <FleetHealthWidget />
          <CriticalVehiclesWidget />
          <ExpiringLicensesWidget />
          <TopROIWidget />
        </div>

        {/* Smart Alert Engine Feed */}
        {smartAlerts.length > 0 && (
          <div className="p-6 rounded-2xl bg-[#111113] border border-[#27272A] mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#FF5A36]" />
                <h3 className="text-base font-bold text-[#FAFAFA]">Smart Alert Engine Feed ({smartAlerts.length})</h3>
              </div>
              <span className="text-xs text-[#A1A1AA] font-mono">Real-time Rule Enforcement</span>
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
                      : 'bg-[#18181B] border-[#27272A] text-[#FAFAFA]'
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

        {/* Hackathon Demo Scenario Automation Bar */}
        <div className="p-5 rounded-2xl bg-[#111113] border border-[#27272A] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Play className="w-5 h-5 text-[#FF5A36] shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-[#FAFAFA]">Hackathon Demo Automation Controls</h4>
              <p className="text-xs text-[#A1A1AA]">Live test enterprise business rules (BR-004, BR-009, BR-012) or reset seed state</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleRunScenario(runDispatchScenario)}
              className="px-3 py-1.5 rounded-xl bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FF5A36]/30 text-xs font-semibold hover:bg-[#FF5A36]/25 transition-all"
            >
              Dispatch Scenario (BR-009)
            </button>
            <button
              onClick={() => handleRunScenario(runMaintenanceScenario)}
              className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/25 transition-all"
            >
              Workshop Lock (BR-012)
            </button>
            <button
              onClick={() => handleRunScenario(runLicenseExpiryScenario)}
              className="px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-semibold hover:bg-rose-500/25 transition-all"
            >
              Simulate Expired License (BR-004)
            </button>
            <button
              onClick={() => handleRunScenario(runResetScenario)}
              className="px-3 py-1.5 rounded-xl bg-[#18181B] text-[#FAFAFA] hover:bg-[#27272A] border border-[#27272A] text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Seed Data
            </button>
          </div>
        </div>

        {/* CSV Export Quick Action Suite */}
        <div className="p-5 rounded-2xl bg-[#111113] border border-[#27272A] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Download className="w-4 h-4 text-[#FF5A36]" />
            <span className="text-xs font-bold text-[#FAFAFA] uppercase tracking-wider">Instant CSV Data Export Suite</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={exportVehiclesCSV} className="px-3 py-1.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs text-[#FAFAFA] font-medium transition-all">
              Vehicles CSV
            </button>
            <button onClick={exportDriversCSV} className="px-3 py-1.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs text-[#FAFAFA] font-medium transition-all">
              Drivers CSV
            </button>
            <button onClick={exportTripsCSV} className="px-3 py-1.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs text-[#FAFAFA] font-medium transition-all">
              Trips CSV
            </button>
            <button onClick={exportMaintenanceCSV} className="px-3 py-1.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs text-[#FAFAFA] font-medium transition-all">
              Maintenance CSV
            </button>
            <button onClick={exportFuelLogsCSV} className="px-3 py-1.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs text-[#FAFAFA] font-medium transition-all">
              Fuel Logs CSV
            </button>
          </div>
        </div>

        {/* Modals */}
        <GlobalSearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
        <FleetCopilotModal isOpen={showCopilot} onClose={() => setShowCopilot(false)} />
      </main>
    </div>
  )
}
