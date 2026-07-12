'use client'

import React, { useEffect, useState } from 'react'
import { Sidebar } from '../../components/sidebar'
import { getAnalyticsSummary } from '@/lib/mock'
import {
  BarChart3,
  TrendingUp,
  PieChart,
  DollarSign,
  Award,
  Activity
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    setData(getAnalyticsSummary())
  }, [])

  if (!data) return null

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <main className="flex-1 md:ml-60 p-6 md:p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded-full border border-primary/20 uppercase">
                BI & ROI Scorecard
              </span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">Fleet Intelligence & Financial ROI</h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Derived dynamically from centralized Eastern India logistics dataset (25 Assets, 50 Trips, 120 Fuel Logs).
            </p>
          </div>
        </div>

        {/* Top KPI row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Fleet Utilization Rate</span>
            <div className="text-3xl font-bold text-primary mt-2">{data.fleet_utilization_rate}%</div>
            <div className="text-xs text-on-surface-variant mt-1">Formula: (On Trip / Total Fleet) × 100</div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Total Fleet Size</span>
            <div className="text-3xl font-bold text-on-surface mt-2">{data.total_vehicles} Assets</div>
            <div className="text-xs text-emerald-400 mt-1">{data.vehicles_on_trip} Active In Transit</div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Average Asset ROI</span>
            <div className="text-3xl font-bold text-emerald-400 mt-2">4.18%</div>
            <div className="text-xs text-emerald-400 mt-1">Net yield / Acquisition cost</div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Average Fuel Efficiency</span>
            <div className="text-3xl font-bold text-amber-400 mt-2">4.62 km/L</div>
            <div className="text-xs text-amber-400 mt-1">Across heavy corridor haulage</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-surface-container-low border border-white/10">
            <h3 className="text-lg font-bold text-on-surface mb-4">6-Month Fleet Utilization Trend (%)</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.utilization_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="utilization" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container-low border border-white/10">
            <h3 className="text-lg font-bold text-on-surface mb-4">Fleet Status Distribution</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={data.fleet_status_distribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {data.fleet_status_distribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Vehicle ROI Leaderboard Table */}
        <div className="rounded-2xl bg-surface-container-low border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-on-surface">Vehicle ROI Ranking Leaderboard</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Formula: (Revenue - Fuel Cost - Maintenance Cost) / Acquisition Cost
              </p>
            </div>
            <Award className="w-6 h-6 text-amber-400" />
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs font-semibold text-on-surface-variant uppercase">
                <th className="p-4">Rank</th>
                <th className="p-4">Registration #</th>
                <th className="p-4">Model & Type</th>
                <th className="p-4">Acquisition Cost</th>
                <th className="p-4">Revenue Earned</th>
                <th className="p-4">Fuel & Maint Cost</th>
                <th className="p-4">Net ROI (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {data.vehicle_roi_ranking.map((v: any, idx: number) => {
                const totalCost = v.fuelCost + v.maintenanceCost
                return (
                  <tr key={v.id} className="hover:bg-white/5">
                    <td className="p-4 font-bold text-on-surface">#{idx + 1}</td>
                    <td className="p-4 font-mono font-bold text-primary">{v.registrationNumber}</td>
                    <td className="p-4">
                      <div className="font-semibold text-on-surface">{v.vehicleName}</div>
                      <div className="text-xs text-on-surface-variant">{v.vehicleType}</div>
                    </td>
                    <td className="p-4 font-mono">₹{v.acquisitionCost.toLocaleString()}</td>
                    <td className="p-4 font-bold text-emerald-400">₹{v.revenue.toLocaleString()}</td>
                    <td className="p-4 font-mono text-rose-400">₹{totalCost.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        v.roiPercent >= 5 ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                        v.roiPercent > 0 ? 'bg-primary/15 text-primary border-primary/30' :
                        'bg-white/5 text-on-surface-variant border-white/10'
                      }`}>
                        {v.roiPercent}%
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
