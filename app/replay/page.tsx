'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Sidebar } from '@/components/sidebar'
import {
  INITIAL_FLEET_TELEMETRY,
  VehicleTelemetry,
  getPrebuiltRoadRoute
} from '@/lib/live-tracking'
import {
  Play,
  Pause,
  RotateCcw,
  Navigation,
  Fuel,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  MapPin,
  Gauge
} from 'lucide-react'

const DynamicReplayMap = dynamic(() => import('@/components/live-operations/fleet-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-2xl bg-surface-container-low border border-white/10 flex items-center justify-center text-on-surface-variant text-sm animate-pulse">
      Loading Fleet Historical Replay Map...
    </div>
  )
})

export default function FleetReplayPage() {
  const [selectedTripIdx, setSelectedTripIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedMultiplier, setSpeedMultiplier] = useState(2) // 1x, 2x, 5x, 10x

  // Replay progression state
  const [currentWaypointIdx, setCurrentWaypointIdx] = useState(0)
  const [fuelConsumedLiters, setFuelConsumedLiters] = useState(0)
  const [stopsLogged, setStopsLogged] = useState<string[]>([])
  const [isCompleted, setIsCompleted] = useState(false)

  const candidateTrips = [
    {
      id: 'trp-01',
      code: 'TRP-101',
      source: 'Kolkata Port',
      destination: 'Siliguri Gateway',
      route: getPrebuiltRoadRoute(0),
      vehicle: INITIAL_FLEET_TELEMETRY[0],
      stops: [
        { waypointIdx: 12, name: 'Krishnanagar Toll Checkpost (18 min stoppage)' },
        { waypointIdx: 28, name: 'Malda IOCL Refueling Station (14 min stoppage)' }
      ]
    },
    {
      id: 'trp-02',
      code: 'TRP-102',
      source: 'Howrah Logistics Park',
      destination: 'Ranchi Industrial Yard',
      route: getPrebuiltRoadRoute(1),
      vehicle: INITIAL_FLEET_TELEMETRY[1],
      stops: [
        { waypointIdx: 15, name: 'Purulia Border Transit Checkpoint (22 min stoppage)' }
      ]
    },
    {
      id: 'trp-03',
      code: 'TRP-103',
      source: 'Durgapur Steel Hub',
      destination: 'Bhubaneswar Coastal Depot',
      route: getPrebuiltRoadRoute(2),
      vehicle: INITIAL_FLEET_TELEMETRY[2],
      stops: [
        { waypointIdx: 20, name: 'Balasore Highway Inspection Bay (12 min stoppage)' }
      ]
    }
  ]

  const currentScenario = candidateTrips[selectedTripIdx]
  const geom = currentScenario.route.routeGeometry
  const maxIdx = geom.length - 1

  function handleReset() {
    setIsPlaying(false)
    setCurrentWaypointIdx(0)
    setFuelConsumedLiters(0)
    setStopsLogged([])
    setIsCompleted(false)
  }

  // Handle Trip Selection Change
  function handleSelectTrip(idx: number) {
    setSelectedTripIdx(idx)
    setIsPlaying(false)
    setCurrentWaypointIdx(0)
    setFuelConsumedLiters(0)
    setStopsLogged([])
    setIsCompleted(false)
  }

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentWaypointIdx(prevIdx => {
        const nextIdx = Math.min(maxIdx, prevIdx + Math.max(1, Math.round(speedMultiplier * 0.7)))

        // Accumulate Fuel burn (~0.35 L per waypoint step)
        setFuelConsumedLiters(prevFuel => Math.round((prevFuel + (nextIdx - prevIdx) * 0.38) * 10) / 10)

        // Check if passed any checkpost stops
        currentScenario.stops.forEach(stop => {
          if (nextIdx >= stop.waypointIdx && !stopsLogged.includes(stop.name)) {
            setStopsLogged(prev => [...prev, stop.name])
          }
        })

        if (nextIdx >= maxIdx) {
          setIsCompleted(true)
          setIsPlaying(false)
        }

        return nextIdx
      })
    }, 1200)

    return () => clearInterval(interval)
  }, [isPlaying, speedMultiplier, maxIdx, currentScenario, stopsLogged])

  // Create single mock replay vehicle telemetry object at current waypoint
  const currentCoords = geom[currentWaypointIdx]
  const replayVehicle: VehicleTelemetry = {
    ...currentScenario.vehicle,
    latitude: currentCoords[0],
    longitude: currentCoords[1],
    speed: isCompleted ? 0 : 64,
    status: isCompleted ? 'Stopped' : 'Moving',
    currentTrip: {
      tripCode: currentScenario.code,
      source: currentScenario.source,
      destination: currentScenario.destination,
      sourceCoords: geom[0],
      destCoords: geom[maxIdx],
      progressPercent: Math.round((currentWaypointIdx / maxIdx) * 100),
      distanceRemainingKm: Math.round(((maxIdx - currentWaypointIdx) / maxIdx) * currentScenario.route.totalDistanceKm),
      etaMins: Math.round(((maxIdx - currentWaypointIdx) / maxIdx) * currentScenario.route.estimatedDurationMins),
      primaryHighway: currentScenario.route.primaryHighway,
      routeGeometry: geom,
      currentRouteIndex: currentWaypointIdx
    }
  }

  const progressPercent = Math.round((currentWaypointIdx / maxIdx) * 100)

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <main className="flex-1 md:ml-60 flex flex-col h-screen overflow-hidden">
        {/* Header Bar */}
        <header className="px-6 py-4 border-b border-white/10 bg-surface flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 bg-primary/15 text-primary rounded-full border border-primary/30 uppercase">
                Historical Telemetry Playback Engine
              </span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">Fleet Replay Mode</h1>
          </div>

          {/* Trip Selector Dropdown & Toolbar */}
          <div className="flex items-center gap-3 flex-wrap text-xs">
            <span className="text-on-surface-variant font-bold uppercase text-[11px]">Select Haulage Mission:</span>
            <div className="flex gap-2">
              {candidateTrips.map((trip, idx) => (
                <button
                  key={trip.id}
                  onClick={() => handleSelectTrip(idx)}
                  className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                    selectedTripIdx === idx
                      ? 'bg-primary text-on-primary border-primary shadow-lg'
                      : 'bg-white/5 text-on-surface-variant border-white/10 hover:border-white/20'
                  }`}
                >
                  {trip.code}: {trip.source} → {trip.destination}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Playback Controls & Progress Toolbar */}
        <div className="px-6 py-3 border-b border-white/10 bg-surface-container-low flex flex-wrap items-center justify-between gap-4 shrink-0 text-xs">
          {/* Left Controls: Play/Pause/Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isCompleted) handleReset()
                setIsPlaying(!isPlaying)
              }}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                isPlaying
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 shadow'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause Replay' : isCompleted ? 'Replay Finished (Click Play)' : 'Play Historical Route'}
            </button>

            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-on-surface border border-white/10 font-semibold flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>

          {/* Center Playback Speed Multiplier (1x, 2x, 5x, 10x) */}
          <div className="flex items-center gap-1.5 bg-surface rounded-xl p-1 border border-white/10">
            <span className="text-[10px] font-bold uppercase text-on-surface-variant px-2 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-primary" /> Speed:
            </span>
            {[1, 2, 5, 10].map(mult => (
              <button
                key={mult}
                onClick={() => setSpeedMultiplier(mult)}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold transition-all ${
                  speedMultiplier === mult
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-white'
                }`}
              >
                {mult}x
              </button>
            ))}
          </div>

          {/* Right Progress % Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Replay Progression</span>
              <span className="font-bold text-white font-mono">{progressPercent}% Completed</span>
            </div>
          </div>
        </div>

        {/* Completion Banner */}
        {isCompleted && (
          <div className="px-6 py-3 bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Replay Complete! Mission {currentScenario.code} successfully reached {currentScenario.destination}. Total
                Fuel Consumed: {fuelConsumedLiters}L.
              </span>
            </div>
            <button
              onClick={handleReset}
              className="px-3 py-1 rounded-lg bg-emerald-500/30 hover:bg-emerald-500/40 text-white transition-all"
            >
              Replay Again
            </button>
          </div>
        )}

        {/* 70% / 30% Replay Command Center */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-6 gap-6">
          {/* LEFT: 70% Replay Map */}
          <div className="lg:w-[70%] w-full h-[55vh] lg:h-full flex flex-col">
            <DynamicReplayMap
              vehicles={[replayVehicle]}
              selectedVehicle={replayVehicle}
              onSelectVehicle={() => {}}
              showGeoFences={true}
              showRoutes={true}
            />
          </div>

          {/* RIGHT: 30% Replay Audit Feed */}
          <div className="lg:w-[30%] w-full h-[45vh] lg:h-full bg-surface-container-low border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 bg-surface">
              <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
                <Navigation className="w-4 h-4 text-primary" /> Mission Replay Telemetry
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Asset: <strong className="text-white">{currentScenario.vehicle.registrationNumber}</strong> (
                {currentScenario.vehicle.driverName})
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Telemetry KPI Boxes */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-surface border border-white/10">
                  <div className="flex items-center gap-1.5 text-on-surface-variant text-xs mb-1">
                    <Fuel className="w-3.5 h-3.5 text-amber-400" /> Fuel Burn
                  </div>
                  <div className="text-base font-bold text-white font-mono">{fuelConsumedLiters} L</div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-white/10">
                  <div className="flex items-center gap-1.5 text-on-surface-variant text-xs mb-1">
                    <Clock className="w-3.5 h-3.5 text-sky-400" /> Replay Speed
                  </div>
                  <div className="text-base font-bold text-sky-300 font-mono">{speedMultiplier}x Playback</div>
                </div>
              </div>

              {/* Progress Slider Bar */}
              <div className="p-4 rounded-xl bg-surface border border-white/10 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">Corridor Progress</span>
                  <span className="text-white font-mono">{progressPercent}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className="bg-primary h-full transition-all duration-300"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-on-surface-variant">
                  <span>{currentScenario.source}</span>
                  <span>{currentScenario.destination}</span>
                </div>
              </div>

              {/* Stoppage Event Log */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  Corridor Event & Checkpost Log
                </h4>
                {stopsLogged.length > 0 ? (
                  <div className="space-y-2">
                    {stopsLogged.map((stopName, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-white flex items-center gap-2.5 animate-slide-left"
                      >
                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                        <span>{stopName}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-surface border border-white/10 text-on-surface-variant text-xs">
                    No stoppage checkpoints passed yet in current replay segment.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
