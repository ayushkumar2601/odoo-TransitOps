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
  ActiveTripTrendChart,
  MonthlyCostTrendChart,
  DriverRiskStackedChart,
  FleetHealthDonutChart,
  CircularUtilizationChart
} from '@/components/dashboard-charts'
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
  ShieldCheck,
  Cpu,
  MonitorPlay,
  ChevronRight
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

  const utilizationRate = data.fleet_utilization_rate || 19.2

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 relative z-10">
      {/* Radial Depth Texture */}
      <div className="absolute top-0 left-1/3 w-[900px] h-[550px] bg-gradient-to-br from-[#FF5A36]/[0.03] via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

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

        {/* 1. Executive Hero Command Banner */}
        <section className="bg-gradient-to-r from-[#0E0E11] to-[#16161A] border border-[rgba(255,255,255,0.05)] rounded-2xl p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all duration-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-[#A1A1AA]">
                Good Morning, {userName.split(' ')[0]}.
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FF5A36]/30 text-[10px] font-bold uppercase tracking-wider">
                {userRole}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#FAFAFA] leading-tight">
              Intelligent Fleet Operations
            </h1>
            <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#FF5A36] mt-0.5">
              Across Eastern India
            </div>
            <p className="text-sm font-medium text-[#A1A1AA] mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-white font-bold">{data.total_vehicles || 26} vehicles</span> •{' '}
              <span className="text-white font-bold">{data.active_trips || 19} active corridors</span> •{' '}
              <span className="text-amber-400 font-bold">{data.vehicles_in_shop || 3} assets require attention today</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowSearch(true)}
              className="px-4 py-2.5 rounded-xl bg-[#18181B] border border-[rgba(255,255,255,0.08)] hover:border-[#3F3F46] text-[#A1A1AA] hover:text-[#FAFAFA] text-xs font-semibold flex items-center gap-2 transition-all duration-200 shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              Search
              <kbd className="px-1.5 py-0.5 rounded bg-[#111113] text-[10px] font-mono text-[#A1A1AA]">⌘K</kbd>
            </button>

            <Link
              href="/trips"
              className="px-4 py-2.5 rounded-xl bg-[#18181B] border border-[rgba(255,255,255,0.08)] hover:border-[#3F3F46] text-[#FAFAFA] text-xs font-semibold flex items-center gap-2 transition-all duration-200 shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Dispatch Trip
            </Link>

            <Link
              href="/command-center"
              className="px-4 py-2.5 rounded-xl bg-[#18181B] border border-[rgba(255,255,255,0.08)] hover:border-[#3F3F46] text-[#FAFAFA] text-xs font-semibold flex items-center gap-2 transition-all duration-200 shadow-sm"
            >
              <MonitorPlay className="w-3.5 h-3.5 text-[#FF5A36]" />
              Open War Room
            </Link>

            <button
              onClick={() => setShowCopilot(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#FF5A36]/20 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4" />
              AI Copilot
            </button>

            <Link
              href="/vehicles"
              className="px-4 py-2.5 bg-[#FAFAFA] text-[#09090B] font-bold rounded-xl flex items-center gap-2 hover:bg-[#E5E7EB] hover:-translate-y-0.5 transition-all duration-200 shadow-sm text-xs"
            >
              <Plus className="w-4 h-4" />
              Register Asset
            </Link>
          </div>
        </section>

        {/* 2. Primary KPI Cards Row (4 cards, single row, equal width, h-220px) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Fleet Assets */}
          <div className="h-[220px] p-6 rounded-2xl bg-[#111113] border border-[rgba(255,255,255,0.05)] hover:-translate-y-0.5 transition-all duration-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
                Fleet Assets
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Ready for Dispatch
              </span>
            </div>
            <div className="my-2">
              <div className="text-5xl font-extrabold text-[#FAFAFA] tracking-tight">{data.total_vehicles || 26}</div>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+8.4% vs last quarter</span>
              </div>
            </div>
            <div className="pt-3 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between text-xs text-[#A1A1AA]">
              <span>Active Haulage Fleet</span>
              <span className="font-bold text-[#FAFAFA]">{data.vehicles_available || 14} available</span>
            </div>
          </div>

          {/* Card 2: Haulage Corridors */}
          <div className="h-[220px] p-6 rounded-2xl bg-[#111113] border border-[rgba(255,255,255,0.05)] hover:-translate-y-0.5 transition-all duration-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
                Active Trips & Corridors
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FF5A36]/30">
                SLA On-Time
              </span>
            </div>
            <div className="my-2">
              <div className="text-5xl font-extrabold text-[#FAFAFA] tracking-tight">{data.active_trips || 19}</div>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>99.4% Corridor SLA</span>
              </div>
            </div>
            <div className="pt-3 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between text-xs text-[#A1A1AA]">
              <span>Draft Corridors Pending</span>
              <span className="font-bold text-[#FAFAFA]">{data.pending_trips || 3} corridors</span>
            </div>
          </div>

          {/* Card 3: Driver Governance */}
          <div className="h-[220px] p-6 rounded-2xl bg-[#111113] border border-[rgba(255,255,255,0.05)] hover:-translate-y-0.5 transition-all duration-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
                Driver Safety Average
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                Grade A+
              </span>
            </div>
            <div className="my-2">
              <div className="text-5xl font-extrabold text-[#FAFAFA] tracking-tight">
                {data.average_safety_score || 88.5}<span className="text-xl font-normal text-[#A1A1AA]">/100</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Critical Infractions</span>
              </div>
            </div>
            <div className="pt-3 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between text-xs text-[#A1A1AA]">
              <span>Roster On-Duty</span>
              <span className="font-bold text-[#FAFAFA]">{data.drivers_on_duty || 20} / {data.total_drivers || 35}</span>
            </div>
          </div>

          {/* Card 4: Monthly Fuel & Ops */}
          <div className="h-[220px] p-6 rounded-2xl bg-[#111113] border border-[rgba(255,255,255,0.05)] hover:-translate-y-0.5 transition-all duration-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
                Monthly Expenditure
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FF5A36]/30">
                AI Optimized
              </span>
            </div>
            <div className="my-2">
              <div className="text-5xl font-extrabold text-[#FAFAFA] tracking-tight">
                ₹{((data.monthly_fuel_cost || 1420000) / 100000).toFixed(1)}L
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#A1A1AA]">
                <span>Total Ops: ₹{((data.monthly_expenses_total || 2400000) / 100000).toFixed(1)}L INR</span>
              </div>
            </div>
            <div className="pt-3 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between text-xs text-[#A1A1AA]">
              <span>Route Fuel Efficiency</span>
              <span className="font-bold text-emerald-400">-4.1% fuel savings</span>
            </div>
          </div>
        </section>

        {/* 3. Centerpiece Operations Overview & Fleet Intelligence Center (Grid) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Executive Fleet Utilization Panel */}
          <div className="lg:col-span-5 bg-[#111113] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-semibold text-[#FF5A36] uppercase tracking-wider">
                    PRD Operational Formula
                  </span>
                  <h2 className="text-2xl font-bold text-[#FAFAFA] mt-1 tracking-tight">Fleet Utilization Panel</h2>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Live Active Rate
                </span>
              </div>

              <div className="flex items-center justify-around py-4 border-y border-[rgba(255,255,255,0.05)]">
                <CircularUtilizationChart percentage={utilizationRate} />
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-[#A1A1AA]">Available Ready:</span>
                    <span className="font-bold text-[#FAFAFA] ml-auto">{data.vehicles_available || 14}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A36]" />
                    <span className="text-[#A1A1AA]">On Trip Dispatch:</span>
                    <span className="font-bold text-[#FAFAFA] ml-auto">{data.vehicles_on_trip || 6}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-[#A1A1AA]">Workshop Lock (BR-012):</span>
                    <span className="font-bold text-amber-400 ml-auto">{data.vehicles_in_shop || 3}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#64748B]" />
                    <span className="text-[#A1A1AA]">Retired Assets:</span>
                    <span className="font-bold text-[#FAFAFA] ml-auto">3</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs text-[#A1A1AA]">
              <span>Formula: (Vehicles On Trip / Total Active Fleet) × 100</span>
              <Link href="/analytics" className="text-[#FF5A36] font-semibold hover:underline flex items-center gap-1">
                Full Telemetry <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Fleet Intelligence Center (Digital Twin Flagship Panel) */}
          <div className="lg:col-span-7 bg-[#111113] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FF5A36]/15 border border-[#FF5A36]/30 text-[#FF5A36] flex items-center justify-center">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
                      Digital Twin AI Brain
                    </span>
                    <h2 className="text-2xl font-bold text-[#FAFAFA] tracking-tight">Fleet Intelligence Center</h2>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-xl bg-[#FF5A36]/15 text-[#FF5A36] font-mono font-bold text-sm border border-[#FF5A36]/30">
                  Grade A+ Optimal
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-2">
                <div className="md:col-span-5">
                  <FleetHealthDonutChart />
                </div>
                <div className="md:col-span-7 space-y-3">
                  <div className="p-3.5 rounded-xl bg-[#18181B] border border-[rgba(255,255,255,0.05)] flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#A1A1AA] block">Composite Health Score</span>
                      <span className="text-2xl font-extrabold text-[#FAFAFA]">82.4 / 100</span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-500/15 text-emerald-400">
                      Low Risk Engine
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#18181B] border border-[rgba(255,255,255,0.05)]">
                      <span className="text-[#A1A1AA] block">Predicted Service Queue</span>
                      <span className="font-bold text-amber-400 text-sm mt-0.5 block">3 Workshop Assets</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#18181B] border border-[rgba(255,255,255,0.05)]">
                      <span className="text-[#A1A1AA] block">Top Net Yield Margin</span>
                      <span className="font-bold text-emerald-400 text-sm mt-0.5 block">WB-04-E-1042</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between text-xs">
              <span className="text-[#A1A1AA]">Real-time telemetry monitored via Groq Llama 3.3 70B</span>
              <button
                onClick={() => setShowCopilot(true)}
                className="text-[#FF5A36] font-semibold hover:underline flex items-center gap-1"
              >
                Launch AI War Room →
              </button>
            </div>
          </div>
        </section>

        {/* 4. Operations Overview & Intelligence Layer (Grid of 4 Core Widgets) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FleetHealthWidget />
          <CriticalVehiclesWidget />
          <ExpiringLicensesWidget />
          <TopROIWidget />
        </section>

        {/* 5. Analytics & Visualizations Snapshot (3 Recharts Panels) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Active Trip Trend */}
          <div className="bg-[#111113] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 shadow-sm hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
                  Corridor Dispatches
                </span>
                <h3 className="text-lg font-bold text-[#FAFAFA] tracking-tight">Active Trip Trend</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400">+12.8% MoM</span>
            </div>
            <ActiveTripTrendChart />
          </div>

          {/* Chart 2: Monthly Cost Trend */}
          <div className="bg-[#111113] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 shadow-sm hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
                  Expenditure Breakdown
                </span>
                <h3 className="text-lg font-bold text-[#FAFAFA] tracking-tight">Monthly Cost Trend</h3>
              </div>
              <span className="text-xs font-mono text-[#FF5A36]">Fuel vs Workshop</span>
            </div>
            <MonthlyCostTrendChart />
          </div>

          {/* Chart 3: Driver Risk Distribution */}
          <div className="bg-[#111113] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 shadow-sm hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
                  Driver Governance
                </span>
                <h3 className="text-lg font-bold text-[#FAFAFA] tracking-tight">Driver Risk Distribution</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400">94% Optimal Cohort</span>
            </div>
            <DriverRiskStackedChart />
          </div>
        </section>

        {/* 6. Smart Alert Engine Feed */}
        {smartAlerts.length > 0 && (
          <section className="bg-[#111113] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#FF5A36]" />
                <h3 className="text-base font-bold text-[#FAFAFA]">Smart Alert Engine Feed ({smartAlerts.length})</h3>
              </div>
              <span className="text-xs text-[#A1A1AA] font-mono">Severity Graded: Critical / High / Medium</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {smartAlerts.slice(0, 4).map((alt) => (
                <div
                  key={alt.id}
                  className={`p-4 rounded-xl border flex items-start justify-between transition-all ${
                    alt.severity === 'Critical'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      : alt.severity === 'High'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-[#18181B] border-[rgba(255,255,255,0.05)] text-[#FAFAFA]'
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
          </section>
        )}

        {/* 7. Hackathon Demo Scenario Automation & Instant CSV Export Bar */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-5 rounded-2xl bg-[#111113] border border-[rgba(255,255,255,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Play className="w-5 h-5 text-[#FF5A36] shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-[#FAFAFA]">Demo Automation Controls</h4>
                <p className="text-xs text-[#A1A1AA]">Live test enterprise business rules (BR-004, BR-009, BR-012) or reset seed state</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleRunScenario(runDispatchScenario)}
                className="px-3 py-1.5 rounded-xl bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FF5A36]/30 text-xs font-semibold hover:bg-[#FF5A36]/25 transition-all"
              >
                Dispatch (BR-009)
              </button>
              <button
                onClick={() => handleRunScenario(runMaintenanceScenario)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/25 transition-all"
              >
                Workshop (BR-012)
              </button>
              <button
                onClick={() => handleRunScenario(runLicenseExpiryScenario)}
                className="px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-semibold hover:bg-rose-500/25 transition-all"
              >
                Expiry (BR-004)
              </button>
              <button
                onClick={() => handleRunScenario(runResetScenario)}
                className="px-3 py-1.5 rounded-xl bg-[#18181B] text-[#FAFAFA] hover:bg-[#27272A] border border-[rgba(255,255,255,0.08)] text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#111113] border border-[rgba(255,255,255,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-2.5">
              <Download className="w-4 h-4 text-[#FF5A36]" />
              <span className="text-xs font-bold text-[#FAFAFA] uppercase tracking-wider">CSV Data Export Suite</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={exportVehiclesCSV} className="px-3 py-1.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-[rgba(255,255,255,0.08)] text-xs text-[#FAFAFA] font-medium transition-all">
                Vehicles
              </button>
              <button onClick={exportDriversCSV} className="px-3 py-1.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-[rgba(255,255,255,0.08)] text-xs text-[#FAFAFA] font-medium transition-all">
                Drivers
              </button>
              <button onClick={exportTripsCSV} className="px-3 py-1.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-[rgba(255,255,255,0.08)] text-xs text-[#FAFAFA] font-medium transition-all">
                Trips
              </button>
              <button onClick={exportMaintenanceCSV} className="px-3 py-1.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-[rgba(255,255,255,0.08)] text-xs text-[#FAFAFA] font-medium transition-all">
                Maintenance
              </button>
            </div>
          </div>
        </section>

        {/* Modals */}
        <GlobalSearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
        <FleetCopilotModal isOpen={showCopilot} onClose={() => setShowCopilot(false)} />
    </div>
  )
}
