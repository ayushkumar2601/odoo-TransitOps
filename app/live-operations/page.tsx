'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Sidebar } from '@/components/sidebar'
import {
  INITIAL_FLEET_TELEMETRY,
  VehicleTelemetry,
  simulateTick,
  applyDemoScenario,
  DemoScenarioType
} from '@/lib/live-tracking'
import VehicleDetailDrawer from '@/components/live-operations/vehicle-detail-drawer'
import CopilotDrawer from '@/components/live-operations/copilot-drawer'
import {
  Play,
  Pause,
  Sparkles,
  Search,
  Layers,
  MapPin,
  Zap,
  Radio,
  Gauge
} from 'lucide-react'

const DynamicFleetMap = dynamic(() => import('@/components/live-operations/fleet-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-2xl bg-surface-container-low border border-white/10 flex items-center justify-center text-on-surface-variant text-sm animate-pulse">
      Initializing OpenStreetMap Road Routing & Telemetry Engine...
    </div>
  )
})

export default function LiveOperationsPage() {
  const [vehicles, setVehicles] = useState<VehicleTelemetry[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleTelemetry | null>(null)

  // Simulation Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1) // 1x, 2x, 5x, 10x
  const [isTrafficDelay, setIsTrafficDelay] = useState<boolean>(false)

  const [showGeoFences, setShowGeoFences] = useState<boolean>(true)
  const [showRoutes, setShowRoutes] = useState<boolean>(true)
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false)

  // Console Filtering
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')

  // Copilot Drawer
  const [isCopilotOpen, setIsCopilotOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Load Seeded Telemetry
  useEffect(() => {
    setVehicles([...INITIAL_FLEET_TELEMETRY])
  }, [])

  // Live 3-second authentic road geometry simulation interval
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setVehicles(prev => {
        const next = simulateTick(prev, speedMultiplier, isTrafficDelay)
        if (selectedVehicle) {
          const updatedSel = next.find(v => v.id === selectedVehicle.id)
          if (updatedSel) setSelectedVehicle(updatedSel)
        }
        return next
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isPlaying, speedMultiplier, isTrafficDelay, selectedVehicle])

  function handleDemoScenario(scenario: DemoScenarioType) {
    if (scenario === 'traffic') {
      setIsTrafficDelay(true)
    } else if (scenario === 'reset') {
      setIsTrafficDelay(false)
      setSpeedMultiplier(1)
    }
    const { updatedVehicles, message } = applyDemoScenario(vehicles, scenario)
    setVehicles(updatedVehicles)
    if (selectedVehicle) {
      const updatedSel = updatedVehicles.find(v => v.id === selectedVehicle.id)
      setSelectedVehicle(updatedSel || null)
    }
    setToastMessage(message)
    setTimeout(() => setToastMessage(''), 4500)
  }

  // Filtered list for right panel
  const filteredVehicles = vehicles.filter(v => {
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter
    const matchesSearch =
      v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // KPI Counters
  const totalCount = vehicles.length
  const movingCount = vehicles.filter(v => v.status === 'Moving').length
  const stoppedCount = vehicles.filter(v => v.status === 'Stopped').length
  const idlingCount = vehicles.filter(v => v.status === 'Idling').length
  const breakdownCount = vehicles.filter(v => v.status === 'Breakdown').length
  const maintenanceCount = vehicles.filter(v => v.status === 'Maintenance').length
  const offlineCount = vehicles.filter(v => v.status === 'Offline').length

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header & KPI Bar */}
        <header className="px-6 py-4 border-b border-white/10 bg-surface flex flex-col xl:flex-row xl:items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                OSRM Road Network Engine
              </span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">Live Fleet Operations Center</h1>
          </div>

          {/* Top KPI Bar */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-surface-container-low border border-white/10 flex items-center gap-2">
              <span className="text-on-surface-variant font-medium">Total Assets:</span>
              <span className="font-bold text-white font-mono">{totalCount}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Moving: {movingCount}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span> Stopped: {stoppedCount}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Idling: {idlingCount}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Breakdown: {breakdownCount}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span> Shop: {maintenanceCount}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-gray-500/10 border border-gray-500/20 text-gray-400 flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-gray-500"></span> Offline: {offlineCount}
            </div>
          </div>
        </header>

        {/* Demo Scenario Toolbar & Playback Controls */}
        <div className="px-6 py-2.5 border-b border-white/10 bg-surface-container-low flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-on-surface-variant uppercase text-[10px] tracking-wider mr-1">
              Judge Demo Scenarios:
            </span>
            <button
              onClick={() => handleDemoScenario('dispatch')}
              className="px-3 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 font-semibold transition-all"
            >
              Simulate Dispatch
            </button>
            <button
              onClick={() => handleDemoScenario('breakdown')}
              className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-semibold transition-all"
            >
              Simulate Breakdown
            </button>
            <button
              onClick={() => handleDemoScenario('traffic')}
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-semibold transition-all"
            >
              Simulate Traffic Delay
            </button>
            <button
              onClick={() => handleDemoScenario('fuel_drop')}
              className="px-3 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 font-semibold transition-all"
            >
              Simulate Fuel Drop
            </button>
            <button
              onClick={() => handleDemoScenario('reset')}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-on-surface border border-white/10 font-semibold transition-all"
            >
              Reset Simulation
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Simulation Speed Multiplier Controls (1x, 2x, 5x, 10x) */}
            <div className="flex items-center gap-1 bg-surface rounded-xl p-1 border border-white/10">
              <span className="text-[10px] font-bold uppercase text-on-surface-variant px-1.5 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-primary" /> Speed:
              </span>
              {[1, 2, 5, 10].map(mult => (
                <button
                  key={mult}
                  onClick={() => setSpeedMultiplier(mult)}
                  className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold transition-all ${
                    speedMultiplier === mult
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  {mult}x
                </button>
              ))}
            </div>

            {/* Play/Pause Simulation */}
            <div className="flex items-center gap-1 bg-surface rounded-xl p-1 border border-white/10">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  isPlaying
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/5 text-on-surface-variant'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? 'Live Road GPS Running' : 'Paused'}
              </button>
            </div>

            {/* Map Layer Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGeoFences(!showGeoFences)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1 border transition-all ${
                  showGeoFences
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    : 'bg-white/5 text-on-surface-variant border-white/10'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" /> Geofences
              </button>
              <button
                onClick={() => setShowRoutes(!showRoutes)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1 border transition-all ${
                  showRoutes
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    : 'bg-white/5 text-on-surface-variant border-white/10'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Corridors
              </button>
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1 border transition-all ${
                  showHeatmap
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-white/5 text-on-surface-variant border-white/10'
                }`}
              >
                🔥 Hub Heatmap
              </button>
            </div>
          </div>
        </div>

        {toastMessage && (
          <div className="absolute top-28 right-8 z-50 px-4 py-3 rounded-xl bg-slate-900 border border-primary/40 text-white font-bold text-xs shadow-2xl flex items-center gap-2.5 animate-slide-left">
            <Zap className="w-4 h-4 text-primary shrink-0 animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 70% / 30% Split Operations Command Center */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-6 gap-6">
          {/* LEFT PANEL: 70% Interactive Map */}
          <div className="lg:w-[70%] w-full h-[55vh] lg:h-full flex flex-col">
            <DynamicFleetMap
              vehicles={vehicles}
              selectedVehicle={selectedVehicle}
              onSelectVehicle={v => setSelectedVehicle(v)}
              showGeoFences={showGeoFences}
              showRoutes={showRoutes}
              showHeatmap={showHeatmap}
            />
          </div>

          {/* RIGHT PANEL: 30% Fleet Asset Console */}
          <div className="lg:w-[30%] w-full h-[45vh] lg:h-full bg-surface-container-low border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 bg-surface space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
                  <Radio className="w-4 h-4 text-primary" /> Active Asset Console ({filteredVehicles.length})
                </h3>
                {selectedVehicle && (
                  <button
                    onClick={() => setSelectedVehicle(null)}
                    className="text-[11px] text-primary hover:underline font-semibold"
                  >
                    Clear Selection
                  </button>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search registration, asset, operator..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface border border-white/10 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
                {(['All', 'Moving', 'Stopped', 'Idling', 'Breakdown', 'Maintenance', 'Offline'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg font-semibold border shrink-0 transition-all ${
                      statusFilter === st
                        ? 'bg-primary/20 text-primary border-primary/40'
                        : 'bg-white/5 text-on-surface-variant border-white/10 hover:border-white/20'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Asset List Scrollable */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {filteredVehicles.map(v => {
                const isSelected = selectedVehicle?.id === v.id
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVehicle(v)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary/15 border-primary/50 shadow-md scale-[1.01]'
                        : 'bg-surface hover:bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-on-surface">{v.registrationNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          v.status === 'Moving'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : v.status === 'Stopped'
                            ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                            : v.status === 'Idling'
                            ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                            : v.status === 'Breakdown'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                        }`}
                      >
                        {v.status}
                      </span>
                    </div>

                    <p className="text-xs text-on-surface-variant font-medium">
                      {v.vehicleName} • <strong className="text-white">{v.driverName}</strong>
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[11px]">
                      <span className="text-on-surface-variant">Speed: <strong className="text-emerald-400 font-mono">{v.speed} km/h</strong></span>
                      <span className="text-on-surface-variant">Fuel: <strong className="text-white font-mono">{v.fuelPercent}%</strong></span>
                      <span className="font-mono text-on-surface-variant">{v.lastUpdated}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Floating AI Fleet Copilot Action Button */}
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-5 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-2xl flex items-center gap-2 transition-all border border-white/20 hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          Ask Fleet Copilot
        </button>

        {/* Slide-Over Vehicle Detail Drawer */}
        <VehicleDetailDrawer
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />

        {/* AI Copilot Interactive Drawer */}
        <CopilotDrawer
          isOpen={isCopilotOpen}
          onClose={() => setIsCopilotOpen(false)}
          vehicles={vehicles}
          onSelectVehicle={v => setSelectedVehicle(v)}
        />
      </main>
    </div>
  )
}
