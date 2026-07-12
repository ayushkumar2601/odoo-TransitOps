'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Sidebar } from '@/components/sidebar'
import {
  INITIAL_FLEET_TELEMETRY,
  VehicleTelemetry,
  simulateTick
} from '@/lib/live-tracking'
import {
  getAllFleetDigitalTwins,
  getPredictedServiceQueue
} from '@/lib/intelligence'
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  Cpu,
  Clock,
  ShieldAlert,
  Wrench,
  DollarSign,
  Maximize2
} from 'lucide-react'

const DynamicFleetMap = dynamic(() => import('@/components/live-operations/fleet-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-3xl bg-surface-container-low border border-white/10 flex items-center justify-center text-on-surface-variant text-sm animate-pulse">
      Initializing Operations War Room Wall Map...
    </div>
  )
})

export default function CommandCenterPage() {
  const [vehicles, setVehicles] = useState<VehicleTelemetry[]>([])
  const [lastRefreshed, setLastRefreshed] = useState<string>('')
  const [refreshCountdown, setRefreshCountdown] = useState<number>(5)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    setVehicles([...INITIAL_FLEET_TELEMETRY])
    setLastRefreshed(new Date().toLocaleTimeString('en-US', { hour12: false }))
  }, [])

  // 5-second Auto Refresh loop
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshCountdown(prev => {
        if (prev <= 1) {
          setVehicles(curr => simulateTick(curr, 1, false))
          setLastRefreshed(new Date().toLocaleTimeString('en-US', { hour12: false }))
          return 5
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const totalAssets = vehicles.length
  const movingCount = vehicles.filter(v => v.status === 'Moving').length
  const utilizationPercent = Math.round((movingCount / Math.max(1, totalAssets)) * 100)

  const twins = getAllFleetDigitalTwins(vehicles)
  const avgHealthScore = Math.round(
    twins.reduce((acc, t) => acc + t.healthScore, 0) / Math.max(1, twins.length)
  )

  // Derived financials & carbon footprint
  const monthlyRevenueINR = 4850000
  const monthlyCostINR = 3120000
  const totalFuelPercent = vehicles.reduce((acc, v) => acc + v.fuelPercent, 0) / vehicles.length
  const carbonEmissionsTonnes = 42.8 // Monthly metric tonnes CO2

  const serviceQueue = getPredictedServiceQueue(vehicles)

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {!isFullscreen && <Sidebar />}

      <main className={`flex-1 flex flex-col h-screen overflow-hidden ${!isFullscreen ? 'md:ml-60' : ''}`}>
        {/* Top Executive KPI Bar */}
        <header className="px-6 py-3.5 border-b border-white/10 bg-slate-900/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white">
                  Executive Operations War Room
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE TV FEED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Eastern India Haulage Command Center • Next Auto-Refresh in {refreshCountdown}s ({lastRefreshed})
              </p>
            </div>
          </div>

          {/* KPI Ticker Cards */}
          <div className="flex items-center gap-3 overflow-x-auto">
            <div className="px-4 py-2 rounded-2xl bg-slate-800/80 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Fleet Utilization</span>
              <span className="text-lg font-extrabold font-mono text-emerald-400">{utilizationPercent}%</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-slate-800/80 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Monthly Revenue</span>
              <span className="text-lg font-extrabold font-mono text-white">
                ₹{(monthlyRevenueINR / 100000).toFixed(2)}L
              </span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-slate-800/80 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Operational Cost</span>
              <span className="text-lg font-extrabold font-mono text-rose-300">
                ₹{(monthlyCostINR / 100000).toFixed(2)}L
              </span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-slate-800/80 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Health Score</span>
              <span className="text-lg font-extrabold font-mono text-sky-400">{avgHealthScore} / 100</span>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-slate-800/80 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">CO₂ Footprint</span>
              <span className="text-lg font-extrabold font-mono text-emerald-300">{carbonEmissionsTonnes} t</span>
            </div>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white transition-all border border-white/15"
              title="Toggle Fullscreen TV Mode"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Center Grid: Map (Left/Center) + Incidents & Shop Feed (Right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 overflow-hidden p-4 gap-4">
          {/* CENTER 3 COLUMNS: Large Live Fleet Map */}
          <div className="lg:col-span-3 h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
            <DynamicFleetMap
              vehicles={vehicles}
              selectedVehicle={null}
              onSelectVehicle={() => {}}
              showGeoFences={true}
              showRoutes={true}
            />
          </div>

          {/* RIGHT COLUMN: Live Incidents, Workshop Queue & Expiring Documents */}
          <div className="h-full bg-slate-900/90 rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/10 bg-slate-900">
              <h3 className="font-bold text-sm flex items-center gap-2 text-rose-400">
                <ShieldAlert className="w-4 h-4" /> Operations War Room Alerts
              </h3>
              <p className="text-xs text-slate-400">Live corridor incidents & shop queue</p>
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
              {/* Critical Incidents Section */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Active Corridor Bottlenecks
                </h4>
                <div className="space-y-2">
                  {vehicles
                    .filter(v => v.status === 'Breakdown' || v.openAlerts.length > 0)
                    .slice(0, 3)
                    .map(v => (
                      <div
                        key={v.id}
                        className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-xs"
                      >
                        <div className="flex justify-between font-bold text-rose-300 mb-1">
                          <span>{v.registrationNumber}</span>
                          <span className="uppercase text-[10px]">{v.status}</span>
                        </div>
                        <p className="text-slate-300 text-[11px]">
                          {v.openAlerts[0]?.replace(/_/g, ' ') || 'Mechanical breakdown reported'}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* High-Risk Predictive Workshop Queue */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-purple-400" /> Predictive Workshop Queue
                </h4>
                <div className="space-y-2">
                  {serviceQueue.slice(0, 3).map(sq => (
                    <div
                      key={sq.vehicleId}
                      className="p-3 rounded-2xl bg-slate-800 border border-white/10 text-xs"
                    >
                      <div className="flex justify-between font-bold text-white mb-0.5">
                        <span>{sq.registrationNumber}</span>
                        <span className="text-amber-400 font-mono">In {sq.predictedServiceDays}d</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{sq.reasons[0]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Top ROI Assets & Delayed Trips */}
        <div className="px-6 py-3 border-t border-white/10 bg-slate-900/90 shrink-0 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6 overflow-x-auto w-full">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] shrink-0">
              Top ROI Yield Assets:
            </span>
            {twins.slice(0, 4).map(t => (
              <div
                key={t.vehicleId}
                className="flex items-center gap-2.5 px-3 py-1 rounded-xl bg-slate-800 border border-white/10 shrink-0"
              >
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                  #{t.roiRank}
                </span>
                <div>
                  <span className="font-bold text-white">{t.registrationNumber}</span>
                  <span className="text-slate-400 block text-[10px]">Health Grade: {t.healthGrade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
