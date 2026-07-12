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
  Gauge,
  RotateCcw
} from 'lucide-react'

const DynamicFleetMap = dynamic(() => import('@/components/live-operations/fleet-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-2xl bg-[#111113] border border-[#27272A] flex items-center justify-center text-[#A1A1AA] text-sm animate-pulse">
      Initializing OpenStreetMap Live Haulage GPS & Telemetry Engine...
    </div>
  )
})

export default function LiveOperationsPage() {
  const [vehicles, setVehicles] = useState<VehicleTelemetry[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleTelemetry | null>(null)

  // Simulation Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1)
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

  useEffect(() => {
    setVehicles([...INITIAL_FLEET_TELEMETRY])
  }, [])

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

  const filteredVehicles = vehicles.filter(v => {
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter
    const matchesSearch =
      v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.destination.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const totalCount = vehicles.length
  const movingCount = vehicles.filter(v => v.status === 'Moving').length
  const stoppedCount = vehicles.filter(v => v.status === 'Stopped').length
  const idlingCount = vehicles.filter(v => v.status === 'Idling').length
  const breakdownCount = vehicles.filter(v => v.status === 'Breakdown').length
  const maintenanceCount = vehicles.filter(v => v.status === 'Maintenance').length
  const offlineCount = vehicles.filter(v => v.status === 'Offline').length

  return (
    <div className="flex h-screen bg-[#09090B] text-[#FAFAFA] overflow-hidden">
      <Sidebar />

      <main className="flex-1 md:ml-64 flex flex-col h-full overflow-hidden">
        {/* Top Header & Telemetry Status Pill Strip */}
        <header className="px-6 py-4 border-b border-[#27272A] bg-[#111113] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FF5A36]/30 text-[10px] font-bold uppercase tracking-wider">
                Live Operations Center
              </span>
              <span className="text-xs text-[#A1A1AA] font-mono">• OSM Road Navigation</span>
            </div>
            <h1 className="text-2xl font-black text-[#FAFAFA] tracking-tight">
              Samsara / Uber Fleet Live Map Console
            </h1>
          </div>

          {/* KPI Pills */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-[#18181B] border border-[#27272A] flex items-center gap-2">
              <span className="text-[#A1A1AA] font-semibold">Total Assets:</span>
              <span className="font-bold text-[#FAFAFA] font-mono">{totalCount}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Moving: {movingCount}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-orange-500" /> Stopped: {stoppedCount}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-yellow-500" /> Idling: {idlingCount}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Breakdown: {breakdownCount}
            </div>
          </div>
        </header>

        {/* Floating Scenario Toolbar & Playback Controls */}
        <div className="px-6 py-2.5 border-b border-[#27272A] bg-[#111113] flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#A1A1AA] uppercase text-[10px] tracking-wider mr-1">
              Scenarios:
            </span>
            <button
              onClick={() => handleDemoScenario('dispatch')}
              className="px-3 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 font-semibold transition-all"
            >
              Simulate Dispatch
            </button>
            <button
              onClick={() => handleDemoScenario('breakdown')}
              className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-semibold transition-all"
            >
              Simulate Breakdown
            </button>
            <button
              onClick={() => handleDemoScenario('traffic')}
              className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-semibold transition-all"
            >
              Traffic Delay
            </button>
            <button
              onClick={() => handleDemoScenario('reset')}
              className="px-3 py-1.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] text-[#FAFAFA] border border-[#27272A] font-semibold transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Speed Controls */}
            <div className="flex items-center gap-1 bg-[#18181B] rounded-xl p-1 border border-[#27272A]">
              <span className="text-[10px] font-bold uppercase text-[#A1A1AA] px-1.5 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-[#FF5A36]" /> Speed:
              </span>
              {[1, 2, 5, 10].map(mult => (
                <button
                  key={mult}
                  onClick={() => setSpeedMultiplier(mult)}
                  className={`px-2 py-0.5 rounded-lg font-mono text-[11px] font-bold transition-all ${
                    speedMultiplier === mult
                      ? 'bg-[#FF5A36] text-white shadow-sm'
                      : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
                  }`}
                >
                  {mult}x
                </button>
              ))}
            </div>

            {/* Play/Pause */}
            <div className="flex items-center gap-1 bg-[#18181B] rounded-xl p-1 border border-[#27272A]">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  isPlaying
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-[#111113] text-[#A1A1AA]'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? 'Live GPS Running' : 'Paused'}
              </button>
            </div>

            {/* Map Layers */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGeoFences(!showGeoFences)}
                className={`px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 border transition-all ${
                  showGeoFences
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    : 'bg-[#18181B] text-[#A1A1AA] border-[#27272A]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" /> Geofences
              </button>
              <button
                onClick={() => setShowRoutes(!showRoutes)}
                className={`px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 border transition-all ${
                  showRoutes
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    : 'bg-[#18181B] text-[#A1A1AA] border-[#27272A]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Corridors
              </button>
            </div>
          </div>
        </div>

        {toastMessage && (
          <div className="absolute top-28 right-8 z-50 px-4 py-3 rounded-2xl bg-[#111113] border border-[#FF5A36] text-[#FAFAFA] font-bold text-xs shadow-2xl flex items-center gap-2.5 animate-fadeIn">
            <Zap className="w-4 h-4 text-[#FF5A36] shrink-0 animate-pulse" />
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
          <div className="lg:w-[30%] w-full h-[45vh] lg:h-full bg-[#111113] border border-[#27272A] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#27272A] bg-[#18181B] space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#FAFAFA] text-sm flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#FF5A36]" /> Active Asset Console ({filteredVehicles.length})
                </h3>
                {selectedVehicle && (
                  <button
                    onClick={() => setSelectedVehicle(null)}
                    className="text-[11px] text-[#FF5A36] hover:underline font-semibold"
                  >
                    Clear Selection
                  </button>
                )}
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#A1A1AA]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search asset, driver, or city..."
                    className="w-full bg-[#111113] border border-[#27272A] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#FAFAFA] placeholder-[#A1A1AA] focus:outline-none focus:border-[#FF5A36]"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="bg-[#111113] border border-[#27272A] rounded-xl px-2.5 py-1.5 text-xs text-[#FAFAFA] focus:outline-none"
                >
                  <option value="All">All Status</option>
                  <option value="Moving">Moving</option>
                  <option value="Stopped">Stopped</option>
                  <option value="Idling">Idling</option>
                  <option value="Breakdown">Breakdown</option>
                  <option value="Maintenance">Shop</option>
                </select>
              </div>
            </div>

            {/* Asset List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredVehicles.map(v => {
                const isSelected = selectedVehicle?.id === v.id
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVehicle(v)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-[#FF5A36]/15 border-[#FF5A36] text-[#FAFAFA]'
                        : 'bg-[#18181B] border-[#27272A] hover:border-[#3F3F46]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#FF5A36]">{v.registrationNumber}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                          v.status === 'Moving' ? 'bg-emerald-500/20 text-emerald-400' :
                          v.status === 'Breakdown' ? 'bg-rose-500/20 text-rose-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          {v.status}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-semibold">{v.speed} km/h</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
                      <span>{v.driverName}</span>
                      <span>→ {v.destination}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Drawers */}
        <VehicleDetailDrawer
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onOpenCopilot={() => setIsCopilotOpen(true)}
        />
        <CopilotDrawer
          isOpen={isCopilotOpen}
          onClose={() => setIsCopilotOpen(false)}
          vehicle={selectedVehicle}
        />
      </main>
    </div>
  )
}
