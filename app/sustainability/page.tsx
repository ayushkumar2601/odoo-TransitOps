'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import {
  INITIAL_FLEET_TELEMETRY,
  VehicleTelemetry
} from '@/lib/live-tracking'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import {
  Leaf,
  TrendingDown,
  Award,
  Zap,
  Fuel,
  CheckCircle2,
  AlertTriangle,
  Truck
} from 'lucide-react'

export default function SustainabilityPage() {
  const [vehicles, setVehicles] = useState<VehicleTelemetry[]>([])

  useEffect(() => {
    setVehicles([...INITIAL_FLEET_TELEMETRY])
  }, [])

  // 1. Calculations: Diesel Liters x 2.68 kg CO2
  const monthlyFuelData = [
    { month: 'Jan', dieselLiters: 14200, co2Tonnes: 38.05, savedTonnes: 3.2 },
    { month: 'Feb', dieselLiters: 13800, co2Tonnes: 36.98, savedTonnes: 3.6 },
    { month: 'Mar', dieselLiters: 14900, co2Tonnes: 39.93, savedTonnes: 3.8 },
    { month: 'Apr', dieselLiters: 15400, co2Tonnes: 41.27, savedTonnes: 4.1 },
    { month: 'May', dieselLiters: 15100, co2Tonnes: 40.47, savedTonnes: 4.3 },
    { month: 'Jun', dieselLiters: 15970, co2Tonnes: 42.8, savedTonnes: 4.6 }
  ]

  const totalMonthlyDieselLiters = 15970
  const totalFleetEmissionsTonnes = 42.8 // Metric Tonnes CO2
  const carbonSavedTonnes = 4.6 // Saved through Reduced Idle Time + Improved Fuel Efficiency
  const idleReductionHours = 340 // Hours saved across fleet

  // Rank vehicles by CO2 efficiency per km
  const vehicleEmissions = vehicles.map(v => {
    const estimatedMonthlyLiters = Math.round((v.odometer / 100) * 28) // approx 28L/100km
    const co2Kg = Math.round(estimatedMonthlyLiters * 2.68)
    return {
      vehicleId: v.id,
      registrationNumber: v.registrationNumber,
      vehicleName: v.vehicleName,
      vehicleType: v.vehicleType,
      fuelPercent: v.fuelPercent,
      estimatedMonthlyLiters,
      co2Kg,
      co2Tonnes: (co2Kg / 1000).toFixed(2)
    }
  })

  vehicleEmissions.sort((a, b) => a.co2Kg - b.co2Kg) // lowest emissions first

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header Bar */}
        <header className="px-8 py-6 border-b border-white/10 bg-surface flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-full border border-emerald-500/30 uppercase flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" /> ESG & Sustainability Intelligence
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Carbon Emissions Dashboard</h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Statutory Eastern India CO₂ audit, fuel optimization savings, and asset carbon intensity ranking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-2">
              Formula: Diesel Liters × 2.68 kg CO₂
            </span>
          </div>
        </header>

        {/* Top KPI Cards */}
        <div className="p-8 space-y-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-surface-container border border-white/10">
              <span className="text-xs uppercase font-bold text-on-surface-variant">Monthly Diesel Burn</span>
              <div className="text-2xl font-bold text-white font-mono mt-1">
                {totalMonthlyDieselLiters.toLocaleString()} L
              </div>
              <p className="text-xs text-on-surface-variant mt-1">Across 25 commercial haulage assets</p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container border border-white/10">
              <span className="text-xs uppercase font-bold text-on-surface-variant">Direct CO₂ Footprint</span>
              <div className="text-2xl font-bold text-rose-300 font-mono mt-1">
                {totalFleetEmissionsTonnes} Tonnes
              </div>
              <p className="text-xs text-on-surface-variant mt-1">Statutory carbon equivalent</p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-xs uppercase font-bold text-emerald-300">Carbon Saved (Optimization)</span>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                -{carbonSavedTonnes} Tonnes
              </div>
              <p className="text-xs text-emerald-300/80 mt-1">Via route AI & idle cutoffs</p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-container border border-white/10">
              <span className="text-xs uppercase font-bold text-on-surface-variant">Idle Hours Reduced</span>
              <div className="text-2xl font-bold text-sky-400 font-mono mt-1">{idleReductionHours} hrs</div>
              <p className="text-xs text-on-surface-variant mt-1">Equivalent to ₹32,400 diesel savings</p>
            </div>
          </div>

          {/* Monthly Emissions Trend Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-surface-container border border-white/10 space-y-4">
              <div>
                <h3 className="font-bold text-base text-on-surface">Monthly Fleet CO₂ Emissions Trend</h3>
                <p className="text-xs text-on-surface-variant">Gross CO₂ footprint vs Carbon saved via route optimization</p>
              </div>

              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyFuelData}>
                    <defs>
                      <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="savedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} unit="t" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="co2Tonnes"
                      name="Gross CO2 (Tonnes)"
                      stroke="#f43f5e"
                      fillOpacity={1}
                      fill="url(#co2Grad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="savedTonnes"
                      name="Saved CO2 (Tonnes)"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#savedGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-surface-container border border-white/10 space-y-4">
              <div>
                <h3 className="font-bold text-base text-on-surface">Monthly Diesel Volume Burn (Liters)</h3>
                <p className="text-xs text-on-surface-variant">Aggregated fuel logs across East India hubs</p>
              </div>

              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyFuelData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    />
                    <Bar dataKey="dieselLiters" name="Diesel Consumed (L)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Vehicle Carbon Emission Intensity Ranking Table */}
          <div className="p-6 rounded-3xl bg-surface-container border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-on-surface">Vehicle Emission Intensity Ranking</h3>
                <p className="text-xs text-on-surface-variant">
                  Ranked from lowest carbon intensity (greenest) to highest carbon output
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-lg bg-white/5 text-on-surface-variant border border-white/10">
                25 Commercial Assets
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-on-surface-variant uppercase font-bold">
                    <th className="py-3 px-4">Green Rank</th>
                    <th className="py-3 px-4">Registration</th>
                    <th className="py-3 px-4">Asset Profile</th>
                    <th className="py-3 px-4">Est. Monthly Diesel</th>
                    <th className="py-3 px-4">CO₂ Footprint (kg)</th>
                    <th className="py-3 px-4">ESG Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {vehicleEmissions.slice(0, 10).map((ve, idx) => (
                    <tr key={ve.vehicleId} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">#{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-white">{ve.registrationNumber}</td>
                      <td className="py-3 px-4 text-on-surface-variant">{ve.vehicleName}</td>
                      <td className="py-3 px-4 font-mono">{ve.estimatedMonthlyLiters.toLocaleString()} L</td>
                      <td className="py-3 px-4 font-mono font-bold text-white">{ve.co2Kg.toLocaleString()} kg CO₂</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            idx < 4
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {idx < 4 ? 'A+ Green' : 'A Compliant'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
