'use client'

import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { VehicleTelemetry, EASTERN_INDIA_HUBS } from '@/lib/live-tracking'

interface FleetMapProps {
  vehicles: VehicleTelemetry[]
  selectedVehicle: VehicleTelemetry | null
  onSelectVehicle: (v: VehicleTelemetry) => void
  showGeoFences: boolean
  showRoutes: boolean
}

function AutoCenterMap({ selectedVehicle }: { selectedVehicle: VehicleTelemetry | null }) {
  const map = useMap()
  useEffect(() => {
    if (selectedVehicle) {
      map.setView([selectedVehicle.latitude, selectedVehicle.longitude], 13, {
        animate: true
      })
    }
  }, [selectedVehicle, map])
  return null
}

function getMarkerColor(status: VehicleTelemetry['status']): string {
  switch (status) {
    case 'Moving':
      return '#10b981' // Green
    case 'Stopped':
      return '#f97316' // Orange
    case 'Idling':
      return '#eab308' // Yellow
    case 'Breakdown':
      return '#ef4444' // Red
    case 'Maintenance':
      return '#a855f7' // Purple
    case 'Offline':
    default:
      return '#6b7280' // Gray
  }
}

function createVehicleDivIcon(v: VehicleTelemetry, isSelected: boolean) {
  const color = getMarkerColor(v.status)
  const ringStyle = isSelected
    ? 'ring-4 ring-white shadow-[0_0_15px_rgba(255,255,255,0.8)] scale-125 z-50'
    : 'shadow-lg hover:scale-110'

  const html = `
    <div class="relative flex items-center justify-center">
      <div style="background-color: ${color};" class="w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center text-white font-bold text-xs transition-all ${ringStyle}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(${v.heading}deg);">
          <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
        </svg>
      </div>
      <div class="absolute -bottom-5 px-1.5 py-0.5 rounded bg-slate-900/90 text-white font-mono text-[10px] whitespace-nowrap border border-white/20 shadow">
        ${v.registrationNumber.split('-').slice(0, 2).join('-')}
      </div>
    </div>
  `

  return L.divIcon({
    html,
    className: 'custom-vehicle-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  })
}

function createPinIcon(color: string, label: string) {
  const html = `
    <div class="relative flex flex-col items-center">
      <div style="background-color: ${color};" class="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-[10px] shadow-lg">
        ${label}
      </div>
      <div style="border-top-color: ${color};" class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px]"></div>
    </div>
  `
  return L.divIcon({
    html,
    className: 'custom-pin-marker',
    iconSize: [24, 30],
    iconAnchor: [12, 30],
    popupAnchor: [0, -28]
  })
}

export default function FleetMap({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
  showGeoFences,
  showRoutes
}: FleetMapProps) {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
      <MapContainer
        center={[23.6, 86.8]}
        zoom={7}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | TransitOps Control Tower'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AutoCenterMap selectedVehicle={selectedVehicle} />

        {/* 1. Geofenced Logistics Hub Circles */}
        {showGeoFences &&
          EASTERN_INDIA_HUBS.map(hub => (
            <Circle
              key={hub.id}
              center={hub.center}
              radius={hub.radiusMeters}
              pathOptions={{
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.12,
                weight: 2,
                dashArray: '6, 6'
              }}
            >
              <Popup>
                <div className="p-1 text-slate-900 font-sans">
                  <h4 className="font-bold text-xs uppercase text-blue-600">{hub.code}</h4>
                  <p className="font-semibold text-sm">{hub.name}</p>
                  <p className="text-xs text-slate-600 mt-1">Geofence Radius: {hub.radiusMeters / 1000} km</p>
                </div>
              </Popup>
            </Circle>
          ))}

        {/* 2. All Active Trip Road Corridors */}
        {showRoutes &&
          vehicles.map((v, idx) => {
            if (!v.currentTrip?.routeGeometry) return null
            const isSelected = selectedVehicle?.id === v.id
            // Distinct road highway palette
            const palette = ['#0284c7', '#059669', '#7c3aed', '#d97706', '#db2777', '#2563eb']
            const color = isSelected ? '#3b82f6' : palette[idx % palette.length]

            return (
              <Polyline
                key={`route-${v.id}`}
                positions={v.currentTrip.routeGeometry}
                pathOptions={{
                  color,
                  weight: isSelected ? 5 : 3,
                  opacity: isSelected ? 0.95 : 0.45
                }}
              />
            )
          })}

        {/* 3. Selected Vehicle Origin & Destination Pins */}
        {selectedVehicle && selectedVehicle.currentTrip && selectedVehicle.currentTrip.routeGeometry && (
          <>
            <Marker
              position={selectedVehicle.currentTrip.routeGeometry[0]}
              icon={createPinIcon('#10b981', 'A')}
            >
              <Popup>
                <div className="p-1 text-slate-900 font-sans text-xs">
                  <strong>Origin:</strong> {selectedVehicle.currentTrip.source}
                </div>
              </Popup>
            </Marker>

            <Marker
              position={selectedVehicle.currentTrip.routeGeometry[selectedVehicle.currentTrip.routeGeometry.length - 1]}
              icon={createPinIcon('#ef4444', 'B')}
            >
              <Popup>
                <div className="p-1 text-slate-900 font-sans text-xs">
                  <strong>Destination:</strong> {selectedVehicle.currentTrip.destination}
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* 4. Fleet Markers */}
        {vehicles.map(v => {
          const isSelected = selectedVehicle?.id === v.id

          return (
            <Marker
              key={v.id}
              position={[v.latitude, v.longitude]}
              icon={createVehicleDivIcon(v, isSelected)}
              eventHandlers={{
                click: () => onSelectVehicle(v)
              }}
            >
              <Popup>
                <div className="p-2 text-slate-900 font-sans min-w-[200px]">
                  <div className="flex items-center justify-between border-b pb-1.5 mb-1.5">
                    <span className="font-bold text-sm text-slate-900">{v.registrationNumber}</span>
                    <span
                      style={{ backgroundColor: getMarkerColor(v.status) }}
                      className="text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                    >
                      {v.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-slate-800">{v.vehicleName} ({v.vehicleType})</p>
                    <p className="text-slate-600">Operator: <strong className="text-slate-900">{v.driverName}</strong></p>
                    <p className="text-slate-600">Speed: <strong className="text-emerald-700">{v.speed} km/h</strong></p>
                    {v.currentTrip && (
                      <div className="mt-1.5 pt-1.5 border-t text-[11px] bg-slate-100 p-1.5 rounded">
                        <p className="font-semibold text-blue-700">{v.currentTrip.tripCode}: {v.currentTrip.source} → {v.currentTrip.destination}</p>
                        {v.currentTrip.primaryHighway && (
                          <p className="text-[10px] text-slate-500 font-semibold">{v.currentTrip.primaryHighway}</p>
                        )}
                        <p className="text-slate-600 mt-1">ETA: {v.currentTrip.etaMins} mins | {v.currentTrip.distanceRemainingKm} km left</p>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-white/15 rounded-xl p-3 text-white text-xs shadow-xl space-y-2">
        <div className="font-bold text-[11px] uppercase tracking-wider text-slate-300 border-b border-white/10 pb-1">
          Road Telemetry Status Legend
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-1.5 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Moving
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Stopped
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> Idling
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Breakdown
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Maintenance
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-500"></span> Offline
          </div>
        </div>
      </div>
    </div>
  )
}
