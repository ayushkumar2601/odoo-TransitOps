'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { store } from '@/lib/mock'
import {
  Search,
  Truck,
  Users,
  MapPin,
  Wrench,
  X,
  ArrowRight
} from 'lucide-react'

export function GlobalSearchModal({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) {
          onClose()
        } else {
          setQuery('')
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const q = query.toLowerCase().trim()

  const matchedVehicles = q
    ? store.vehicles.filter(v =>
        v.registrationNumber.toLowerCase().includes(q) ||
        v.vehicleName.toLowerCase().includes(q) ||
        v.region.toLowerCase().includes(q)
      ).slice(0, 4)
    : []

  const matchedDrivers = q
    ? store.drivers.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.licenseNumber.toLowerCase().includes(q)
      ).slice(0, 4)
    : []

  const matchedTrips = q
    ? store.trips.filter(t =>
        t.tripCode.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
        t.source.toLowerCase().includes(q)
      ).slice(0, 4)
    : []

  const matchedMaintenance = q
    ? store.maintenanceLogs.filter(m =>
        m.maintenanceType.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
      ).slice(0, 3)
    : []

  function handleSelect(url: string) {
    onClose()
    router.push(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-surface-container rounded-2xl border border-white/15 w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-on-surface-variant" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search Fleet Assets, Drivers, Trips, Corridors (CMD+K)..."
            className="w-full bg-transparent text-on-surface text-sm focus:outline-none placeholder:text-on-surface-variant"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {!q && (
            <div className="text-center py-8 text-on-surface-variant">
              <span className="block mb-1 font-semibold text-on-surface">TransitOps Global Search Engine</span>
              Type registration numbers (e.g. WB-04), driver names (e.g. Rahul), or trip codes (e.g. TRP-1001).
            </div>
          )}

          {q &&
            matchedVehicles.length === 0 &&
            matchedDrivers.length === 0 &&
            matchedTrips.length === 0 &&
            matchedMaintenance.length === 0 && (
              <div className="text-center py-8 text-on-surface-variant">
                No matching fleet assets, personnel, or dispatches found for &quot;{query}&quot;.
              </div>
            )}

          {matchedVehicles.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase text-primary px-2 block mb-1">
                Fleet Vehicles ({matchedVehicles.length})
              </span>
              <div className="space-y-1">
                {matchedVehicles.map(v => (
                  <button
                    key={v.id}
                    onClick={() => handleSelect('/vehicles')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 flex items-center justify-between text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Truck className="w-4 h-4 text-primary" />
                      <div>
                        <span className="font-mono font-bold text-on-surface block">{v.registrationNumber}</span>
                        <span className="text-on-surface-variant">{v.vehicleName} — Hub: {v.region}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-on-surface-variant">
                      {v.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedDrivers.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-400 px-2 block mb-1">
                Driver Personnel ({matchedDrivers.length})
              </span>
              <div className="space-y-1">
                {matchedDrivers.map(d => (
                  <button
                    key={d.id}
                    onClick={() => handleSelect('/drivers')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 flex items-center justify-between text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="font-bold text-on-surface block">{d.name}</span>
                        <span className="font-mono text-on-surface-variant">{d.licenseNumber} ({d.licenseCategory})</span>
                      </div>
                    </div>
                    <span className="font-semibold text-emerald-400">{d.safetyScore}/100</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedTrips.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase text-blue-400 px-2 block mb-1">
                Dispatch Trips ({matchedTrips.length})
              </span>
              <div className="space-y-1">
                {matchedTrips.map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleSelect('/trips')}
                    className="w-full p-2.5 rounded-xl hover:bg-white/5 flex items-center justify-between text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <div>
                        <span className="font-mono font-bold text-primary block">{t.tripCode}</span>
                        <span className="text-on-surface font-medium">{t.source} → {t.destination}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400">
                      {t.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-3 bg-surface-container-low border-t border-white/10 flex items-center justify-between text-[11px] text-on-surface-variant">
          <span>Navigate across 25 Assets, 35 Drivers, 50 Trips</span>
          <span className="font-mono">ESC to close</span>
        </div>
      </div>
    </div>
  )
}
