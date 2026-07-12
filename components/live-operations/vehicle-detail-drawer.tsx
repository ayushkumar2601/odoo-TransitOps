'use client'

import React from 'react'
import { VehicleTelemetry, getVehicleGeoFenceStatus } from '@/lib/live-tracking'
import {
  X,
  MapPin,
  Navigation,
  Gauge,
  Fuel,
  Activity,
  ShieldCheck,
  AlertTriangle,
  User,
  Truck,
  Wrench,
  Clock,
  TrendingUp
} from 'lucide-react'

interface VehicleDetailDrawerProps {
  vehicle: VehicleTelemetry | null
  onClose: () => void
}

export default function VehicleDetailDrawer({
  vehicle,
  onClose
}: VehicleDetailDrawerProps) {
  if (!vehicle) return null

  const geoStatus = getVehicleGeoFenceStatus(vehicle.latitude, vehicle.longitude)

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-surface-container border-l border-white/15 shadow-2xl flex flex-col animate-slide-left">
      {/* Drawer Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between bg-surface">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-on-surface text-base">{vehicle.registrationNumber}</h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  vehicle.status === 'Moving'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : vehicle.status === 'Stopped'
                    ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                    : vehicle.status === 'Idling'
                    ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                    : vehicle.status === 'Breakdown'
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                }`}
              >
                {vehicle.status}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">{vehicle.vehicleName} ({vehicle.vehicleType})</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-on-surface-variant hover:text-white hover:bg-white/5 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        {/* Geofence Hub Badge */}
        <div className="p-3.5 rounded-2xl bg-surface-container-low border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-blue-400" />
            <div>
              <p className="text-[11px] uppercase font-bold text-on-surface-variant">Geofence Status</p>
              <p className="text-xs font-semibold text-white">
                {geoStatus.inside ? `Inside: ${geoStatus.hub?.name}` : 'En Route (Open Corridor)'}
              </p>
            </div>
          </div>
          <span className="font-mono text-xs text-on-surface-variant">
            {vehicle.latitude.toFixed(4)}, {vehicle.longitude.toFixed(4)}
          </span>
        </div>

        {/* Active Trip Section */}
        {vehicle.currentTrip ? (
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-primary tracking-wider">Active Haulage Mission</span>
              <span className="font-mono text-xs font-bold text-white">{vehicle.currentTrip.tripCode}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span>{vehicle.currentTrip.source}</span>
              <span className="text-primary">→</span>
              <span>{vehicle.currentTrip.destination}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                style={{ width: `${Math.min(100, Math.max(10, 100 - (vehicle.currentTrip.distanceRemainingKm / 350) * 100))}%` }}
                className="bg-primary h-full transition-all duration-500"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
              <span>Remaining: <strong className="text-white">{vehicle.currentTrip.distanceRemainingKm} km</strong></span>
              <span>ETA: <strong className="text-emerald-400">{vehicle.currentTrip.etaMins} mins</strong></span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-surface-container-low border border-white/10 text-center">
            <p className="text-xs font-semibold text-on-surface-variant">Vehicle currently idle at depot/yard.</p>
          </div>
        )}

        {/* Operator Personnel Card */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary font-bold text-sm">
              {vehicle.driverName.charAt(0)}
            </div>
            <div>
              <p className="text-[11px] uppercase text-on-surface-variant font-bold">Assigned Operator</p>
              <p className="text-xs font-bold text-white">{vehicle.driverName}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-on-surface-variant block">Safety Score</span>
            <span className="text-xs font-bold text-emerald-400">{vehicle.safetyScore} / 100</span>
          </div>
        </div>

        {/* Telemetry Grid */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">Live Telemetry Metrics</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-white/10">
              <div className="flex items-center gap-2 text-on-surface-variant text-xs mb-1">
                <Gauge className="w-3.5 h-3.5 text-primary" /> Speed
              </div>
              <div className="text-lg font-bold text-white font-mono">{vehicle.speed} km/h</div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-white/10">
              <div className="flex items-center gap-2 text-on-surface-variant text-xs mb-1">
                <Fuel className="w-3.5 h-3.5 text-amber-400" /> Fuel Level
              </div>
              <div className={`text-lg font-bold font-mono ${vehicle.fuelPercent <= 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {vehicle.fuelPercent}%
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-white/10">
              <div className="flex items-center gap-2 text-on-surface-variant text-xs mb-1">
                <Activity className="w-3.5 h-3.5 text-blue-400" /> Engine Health
              </div>
              <div className={`text-lg font-bold font-mono ${vehicle.engineHealth < 70 ? 'text-rose-400' : 'text-white'}`}>
                {vehicle.engineHealth}%
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-white/10">
              <div className="flex items-center gap-2 text-on-surface-variant text-xs mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-purple-400" /> ROI Yield
              </div>
              <div className="text-lg font-bold text-white font-mono">{vehicle.roiScore}%</div>
            </div>
          </div>
        </div>

        {/* Connected Smart Alerts */}
        {vehicle.openAlerts && vehicle.openAlerts.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Active Smart Alerts ({vehicle.openAlerts.length})
            </h4>
            {vehicle.openAlerts.map((alert, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-between"
              >
                <span>{alert.replace(/_/g, ' ')}</span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Triggered
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            No active statutory or telemetry alerts reported.
          </div>
        )}

        {/* Maintenance Audit */}
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-white/10 flex items-center justify-between text-xs">
          <span className="text-on-surface-variant">Last Workshop Inspection</span>
          <span className="font-mono font-bold text-white">{vehicle.lastMaintenance}</span>
        </div>
      </div>
    </div>
  )
}
