'use client'

import React from 'react'
import { VehicleDigitalTwin } from '@/lib/intelligence/digital-twin-engine'
import {
  X,
  Cpu,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Gauge,
  Layers,
  Award,
  Truck
} from 'lucide-react'

interface VehicleTwinModalProps {
  twin: VehicleDigitalTwin | null
  isOpen: boolean
  onClose: () => void
}

export default function VehicleTwinModal({
  twin,
  isOpen,
  onClose
}: VehicleTwinModalProps) {
  if (!isOpen || !twin) return null

  function getGradeColor(grade: VehicleDigitalTwin['healthGrade']) {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
      case 'B':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40'
      case 'C':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
      case 'D':
      default:
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-surface-container rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-surface">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-bold">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-on-surface">{twin.registrationNumber}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-primary/20 text-primary border border-primary/40">
                  Digital Twin Asset
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {twin.vehicleName} • {twin.vehicleType}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-on-surface-variant hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Grade & Health Score Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Letter Grade Hero Box */}
            <div className="p-5 rounded-2xl bg-surface border border-white/10 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] uppercase font-bold tracking-wider text-on-surface-variant mb-1">
                Asset Health Grade
              </span>
              <div
                className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center text-4xl font-extrabold shadow-lg ${getGradeColor(
                  twin.healthGrade
                )}`}
              >
                {twin.healthGrade}
              </div>
              <span className="text-xs text-on-surface-variant mt-2 font-semibold">
                Rank #{twin.roiRank} in ROI Yield
              </span>
            </div>

            {/* Health Score Gauge */}
            <div className="md:col-span-2 p-5 rounded-2xl bg-surface border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-on-surface-variant">
                    Composite Health Score
                  </span>
                  <div className="text-3xl font-extrabold text-white mt-0.5 font-mono">
                    {twin.healthScore} <span className="text-base text-on-surface-variant font-normal">/ 100</span>
                  </div>
                </div>
                <Gauge className="w-8 h-8 text-primary" />
              </div>

              <div className="space-y-1.5 mt-3">
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    style={{ width: `${twin.healthScore}%` }}
                    className={`h-full transition-all duration-700 ${
                      twin.healthScore >= 85
                        ? 'bg-emerald-500'
                        : twin.healthScore >= 70
                        ? 'bg-blue-500'
                        : twin.healthScore >= 55
                        ? 'bg-yellow-500'
                        : 'bg-rose-500'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-on-surface-variant">
                  <span>Critical Risk</span>
                  <span>Moderate</span>
                  <span>Peak Condition</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lifecycle & Predictive Risk Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-surface border border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
                <Layers className="w-3.5 h-3.5 text-blue-400" /> Lifecycle Stage
              </div>
              <div className="font-bold text-sm text-white">{twin.lifecycleStage}</div>
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Next Service Due
              </div>
              <div className="font-bold text-sm text-amber-300 font-mono">In {twin.nextServiceDays} Days</div>
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Breakdown Risk
              </div>
              <div
                className={`font-bold text-sm font-mono ${
                  twin.breakdownRiskPercent > 30 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {twin.breakdownRiskPercent}%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-white/10">
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
                {twin.efficiencyTrend >= 0 ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                )}
                Efficiency Trend
              </div>
              <div
                className={`font-bold text-sm font-mono ${
                  twin.efficiencyTrend >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {twin.efficiencyTrend >= 0 ? `+${twin.efficiencyTrend}%` : `${twin.efficiencyTrend}%`}
              </div>
            </div>
          </div>

          {/* Deep Telemetry Sub-System Diagnostics */}
          <div className="p-5 rounded-2xl bg-surface border border-white/10 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Telemetry & Sub-System Diagnostics
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-1">
              <div>
                <span className="text-on-surface-variant block">Odometer Wear</span>
                <strong className="text-white font-mono text-sm">{twin.odometerKm.toLocaleString()} km</strong>
              </div>
              <div>
                <span className="text-on-surface-variant block">Engine Diagnostics</span>
                <strong className="text-white font-mono text-sm">{twin.engineHealth}%</strong>
              </div>
              <div>
                <span className="text-on-surface-variant block">Fuel Reserve</span>
                <strong className="text-white font-mono text-sm">{twin.fuelPercent}%</strong>
              </div>
              <div>
                <span className="text-on-surface-variant block">Safety Rating</span>
                <strong className="text-emerald-400 font-mono text-sm">{twin.safetyScore} / 100</strong>
              </div>
            </div>
          </div>

          {/* Digital Twin Recommendation Badge */}
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-white uppercase">AI Digital Twin Assessment</h5>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {twin.healthScore >= 80
                    ? 'Asset certified for priority long-haul East India freight corridors.'
                    : 'Recommend preventative inspection prior to remote highway dispatch.'}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-lg bg-primary text-on-primary font-bold text-xs">
              Live Twin
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-surface flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all"
          >
            Close Digital Twin
          </button>
        </div>
      </div>
    </div>
  )
}
