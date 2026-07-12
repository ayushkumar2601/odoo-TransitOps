'use client'

import React from 'react'
import { store } from '@/lib/mock'
import { getAnalyticsSummary } from '@/lib/mock'
import {
  Wrench,
  ShieldAlert,
  Truck,
  Award,
  Activity,
  ArrowRight,
  CheckCircle2,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

export function FleetHealthWidget() {
  const analytics = getAnalyticsSummary()

  // Calculate composite 0-100 Fleet Health Score
  const totalVehicles = store.vehicles.length || 1
  const inShopCount = store.vehicles.filter(v => v.status === 'In Shop').length
  const maintScore = Math.max(0, 25 * (1 - inShopCount / totalVehicles))

  const utilRate = analytics.fleet_utilization_rate || 0
  const utilScore = Math.min(25, (utilRate / 100) * 25 * 1.5)

  const avgSafety = store.drivers.reduce((a, b) => a + b.safetyScore, 0) / (store.drivers.length || 1)
  const safetyScore = Math.min(25, (avgSafety / 100) * 25)

  const expiredLicenses = store.drivers.filter(d => d.expiryDate < new Date().toISOString().split('T')[0]).length
  const compliancePenalty = expiredLicenses * 3

  const rawScore = Math.round(Math.max(10, Math.min(100, maintScore + utilScore + safetyScore + 22 - compliancePenalty)))

  const grade = rawScore >= 90 ? 'A+' : rawScore >= 80 ? 'A' : rawScore >= 70 ? 'B+' : 'B'

  return (
    <div className="p-6 rounded-2xl bg-surface-container-low border border-white/10 relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
            Composite Score
          </span>
          <h3 className="text-lg font-bold text-on-surface mt-2">Fleet Health Score</h3>
        </div>
        <span className="px-3 py-1 rounded-xl bg-primary/20 text-primary font-mono font-bold text-lg border border-primary/40">
          Grade {grade}
        </span>
      </div>

      <div className="flex items-end gap-3 my-2">
        <span className="text-5xl font-extrabold text-on-surface tracking-tight">{rawScore}</span>
        <span className="text-sm font-semibold text-emerald-400 mb-2">/ 100 Optimal</span>
      </div>

      <div className="space-y-2 mt-4 pt-4 border-t border-white/5 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-on-surface-variant">Asset Availability Index</span>
          <span className="font-semibold text-on-surface">{((1 - inShopCount / totalVehicles) * 100).toFixed(0)}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-on-surface-variant">Driver Safety Average</span>
          <span className="font-semibold text-emerald-400">{avgSafety.toFixed(1)} / 100</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-on-surface-variant">Active Corridor Utilization</span>
          <span className="font-semibold text-blue-400">{utilRate}%</span>
        </div>
      </div>
    </div>
  )
}

export function CriticalVehiclesWidget() {
  const inShopVehicles = store.vehicles.filter(v => v.status === 'In Shop')

  return (
    <div className="p-6 rounded-2xl bg-surface-container-low border border-white/10 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-on-surface">Critical Workshop Assets</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          BR-012 Locked
        </span>
      </div>

      <div className="space-y-3 flex-1">
        {inShopVehicles.length === 0 ? (
          <div className="text-xs text-emerald-400 py-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            No vehicles currently in workshop maintenance.
          </div>
        ) : (
          inShopVehicles.map((v) => {
            const log = store.maintenanceLogs.find(l => l.vehicleId === v.id && l.status === 'Open')
            return (
              <div key={v.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-primary block">{v.registrationNumber}</span>
                  <span className="text-on-surface-variant">{log?.maintenanceType || 'Workshop Service'}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-amber-400 block">₹{(log?.cost || 0).toLocaleString()}</span>
                  <span className="text-on-surface-variant text-[10px]">{log?.startDate || 'Recent'}</span>
                </div>
              </div>
            )
          })
        )}
      </div>

      <Link href="/maintenance" className="mt-4 pt-3 border-t border-white/5 text-xs text-primary font-semibold flex items-center justify-between hover:underline">
        Manage Workshop Control
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  )
}

export function ExpiringLicensesWidget() {
  const today = new Date().toISOString().split('T')[0]
  const urgentDrivers = store.drivers.filter(d => {
    return d.expiryDate < today || d.expiryDate <= '2026-08-30'
  }).slice(0, 3)

  return (
    <div className="p-6 rounded-2xl bg-surface-container-low border border-white/10 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <h3 className="text-base font-bold text-on-surface">Compliance & License Audit</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          BR-004 Enforcement
        </span>
      </div>

      <div className="space-y-3 flex-1">
        {urgentDrivers.map((d) => {
          const isExpired = d.expiryDate < today
          return (
            <div key={d.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-on-surface block">{d.name}</span>
                <span className="font-mono text-on-surface-variant">{d.licenseNumber}</span>
              </div>
              <div className="text-right">
                <span className={`font-semibold px-2 py-0.5 rounded-md ${
                  isExpired ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {isExpired ? 'EXPIRED' : d.expiryDate}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <Link href="/drivers" className="mt-4 pt-3 border-t border-white/5 text-xs text-primary font-semibold flex items-center justify-between hover:underline">
        Inspect Driver Governance
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  )
}

export function TopROIWidget() {
  const analytics = getAnalyticsSummary()
  const topVehicles = (analytics.vehicle_roi_ranking || []).slice(0, 3)

  return (
    <div className="p-6 rounded-2xl bg-surface-container-low border border-white/10 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-on-surface">Top Yielding Assets (ROI)</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Net Yield %
        </span>
      </div>

      <div className="space-y-3 flex-1">
        {topVehicles.map((v: any, index: number) => (
          <div key={v.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">
                #{index + 1}
              </span>
              <div>
                <span className="font-mono font-bold text-primary block">{v.registrationNumber}</span>
                <span className="text-on-surface-variant">{v.vehicleName}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-emerald-400 block">{v.roiPercent}% ROI</span>
              <span className="text-on-surface-variant">₹{v.revenue.toLocaleString()} rev</span>
            </div>
          </div>
        ))}
      </div>

      <Link href="/analytics" className="mt-4 pt-3 border-t border-white/5 text-xs text-primary font-semibold flex items-center justify-between hover:underline">
        Full ROI Scorecard
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  )
}
