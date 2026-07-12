'use client'

import React, { useMemo } from 'react'
import { store } from '@/lib/mock'
import { getStoredVehicleDocuments } from '@/lib/mock/vehicle-documents'
import {
  Truck,
  Wrench,
  Fuel,
  FileText,
  Navigation,
  Calendar,
  CheckCircle2,
  DollarSign,
  Clock
} from 'lucide-react'

export interface LifecycleEvent {
  id: string
  date: string
  type: 'Acquisition' | 'Trip' | 'Maintenance' | 'Fuel' | 'Document'
  title: string
  subtitle: string
  cost?: number
  badgeColor: string
}

export function VehicleTimeline({ vehicleRegistration }: { vehicleRegistration: string }) {
  const events = useMemo(() => {
    const list: LifecycleEvent[] = []
    const vehicle = store.vehicles.find(v => v.registrationNumber === vehicleRegistration)

    if (vehicle) {
      list.push({
        id: `acq-${vehicle.id}`,
        date: '2024-01-15',
        type: 'Acquisition',
        title: `Asset Registered: ${vehicle.vehicleName}`,
        subtitle: `Initial RTO registration for Eastern India corridor • Region Hub: ${vehicle.region}`,
        cost: vehicle.acquisitionCost,
        badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30'
      })
    }

    // Trips
    store.trips
      .filter(t => t.vehicleRegistration === vehicleRegistration)
      .forEach(t => {
        list.push({
          id: `trip-${t.id}`,
          date: t.departureDate || '2026-07-10',
          type: 'Trip',
          title: `Haulage Trip ${t.tripCode}: ${t.source} → ${t.destination}`,
          subtitle: `Driver: ${t.driverName} • Cargo: ${t.cargoWeight} kg • Status: ${t.status}`,
          badgeColor:
            t.status === 'Delivered'
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
        })
      })

    // Maintenance
    store.maintenanceLogs
      .filter(m => m.vehicleRegistration === vehicleRegistration)
      .forEach(m => {
        list.push({
          id: `maint-${m.id}`,
          date: m.date,
          type: 'Maintenance',
          title: `Workshop Repair — ${m.description}`,
          subtitle: `Workshop Hub: ${m.workshopName} • Status: ${m.status}`,
          cost: m.cost,
          badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30'
        })
      })

    // Fuel Logs
    store.fuelLogs
      .filter(f => f.vehicleRegistration === vehicleRegistration)
      .slice(0, 3)
      .forEach(f => {
        list.push({
          id: `fuel-${f.id}`,
          date: f.date,
          type: 'Fuel',
          title: `Fuel Logged: ${f.quantityLiters} Liters @ ${f.stationName}`,
          subtitle: `Recorded Odometer: ${f.odometer.toLocaleString()} km`,
          cost: f.cost,
          badgeColor: 'bg-sky-500/15 text-sky-400 border-sky-500/30'
        })
      })

    // Documents
    getStoredVehicleDocuments()
      .filter(d => d.vehicleRegistration === vehicleRegistration)
      .forEach(d => {
        list.push({
          id: `doc-${d.id}`,
          date: d.issueDate,
          type: 'Document',
          title: `Compliance Document Issued: ${d.documentType}`,
          subtitle: `Doc #${d.documentNumber} • Authority: ${d.issuingAuthority} • Expires: ${d.expiryDate}`,
          badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
        })
      })

    // Sort chronologically descending
    return list.sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [vehicleRegistration])

  if (events.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-surface border border-white/10 text-center text-xs text-on-surface-variant">
        No recorded lifecycle events found for asset {vehicleRegistration}.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <h4 className="text-xs font-bold uppercase text-on-surface-variant tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-primary" />
          Complete Operational Lifecycle Audit Trail ({events.length} Events)
        </h4>
      </div>

      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
        {events.map((ev, idx) => (
          <div key={ev.id} className="relative flex flex-col gap-1.5">
            {/* Timeline node icon */}
            <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-surface-container border border-white/20 flex items-center justify-center">
              {ev.type === 'Acquisition' && <Truck className="w-2.5 h-2.5 text-purple-400" />}
              {ev.type === 'Trip' && <Navigation className="w-2.5 h-2.5 text-blue-400" />}
              {ev.type === 'Maintenance' && <Wrench className="w-2.5 h-2.5 text-amber-400" />}
              {ev.type === 'Fuel' && <Fuel className="w-2.5 h-2.5 text-sky-400" />}
              {ev.type === 'Document' && <FileText className="w-2.5 h-2.5 text-emerald-400" />}
            </div>

            <div className="p-4 rounded-xl bg-surface border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${ev.badgeColor}`}>
                    {ev.type}
                  </span>
                  <span className="text-xs font-mono text-on-surface-variant">{ev.date}</span>
                </div>
                <h5 className="font-bold text-sm text-white mt-1">{ev.title}</h5>
                <p className="text-xs text-on-surface-variant mt-0.5">{ev.subtitle}</p>
              </div>

              {ev.cost !== undefined && (
                <div className="text-right sm:shrink-0">
                  <span className="text-[10px] text-on-surface-variant block uppercase">Expenditure</span>
                  <strong className="text-sm font-bold text-amber-400">₹{ev.cost.toLocaleString()}</strong>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
