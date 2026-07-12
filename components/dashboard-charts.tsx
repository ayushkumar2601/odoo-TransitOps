'use client'

import React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts'

const tripTrendData = [
  { month: 'Feb', trips: 142, onTime: 98.2 },
  { month: 'Mar', trips: 168, onTime: 99.1 },
  { month: 'Apr', trips: 155, onTime: 98.8 },
  { month: 'May', trips: 189, onTime: 99.4 },
  { month: 'Jun', trips: 210, onTime: 99.5 },
  { month: 'Jul', trips: 235, onTime: 99.7 }
]

const costTrendData = [
  { month: 'Feb', fuel: 13.2, workshop: 2.4 },
  { month: 'Mar', fuel: 14.1, workshop: 1.8 },
  { month: 'Apr', fuel: 13.8, workshop: 3.1 },
  { month: 'May', fuel: 14.5, workshop: 2.0 },
  { month: 'Jun', fuel: 13.9, workshop: 1.5 },
  { month: 'Jul', fuel: 14.2, workshop: 1.9 }
]

const driverRiskData = [
  { cohort: '90-100 (Optimal)', count: 24, fill: '#22C55E' },
  { cohort: '80-89 (Standard)', count: 8, fill: '#3B82F6' },
  { cohort: '70-79 (Monitor)', count: 2, fill: '#F59E0B' },
  { cohort: '<70 (Critical Risk)', count: 1, fill: '#EF4444' }
]

const healthDistributionData = [
  { name: 'Excellent (A+)', value: 16, color: '#22C55E' },
  { name: 'Good (A)', value: 6, color: '#3B82F6' },
  { name: 'Average (B)', value: 2, color: '#F59E0B' },
  { name: 'Workshop Lock (BR-012)', value: 2, color: '#EF4444' }
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#18181B] border border-white/10 rounded-xl p-3 shadow-2xl text-xs">
        <p className="font-bold text-[#FAFAFA] mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <span style={{ color: entry.color || entry.fill }}>{entry.name}:</span>
            <span className="font-mono font-bold text-[#FAFAFA]">
              {entry.value} {entry.name.includes('fuel') || entry.name.includes('workshop') ? 'L INR' : ''}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function ActiveTripTrendChart() {
  return (
    <div className="h-48 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={tripTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="tripGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF5A36" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#FF5A36" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="trips"
            name="Dispatches"
            stroke="#FF5A36"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#tripGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function MonthlyCostTrendChart() {
  return (
    <div className="h-48 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={costTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="fuel" name="fuel (L INR)" fill="#FF5A36" radius={[4, 4, 0, 0]} barSize={16} />
          <Bar dataKey="workshop" name="workshop (L INR)" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function DriverRiskStackedChart() {
  return (
    <div className="h-48 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={driverRiskData} layout="vertical" margin={{ top: 5, right: 15, left: 35, bottom: 0 }}>
          <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis dataKey="cohort" type="category" stroke="#A1A1AA" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" name="Drivers" radius={[0, 4, 4, 0]} barSize={14}>
            {driverRiskData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function FleetHealthDonutChart() {
  return (
    <div className="h-44 w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={healthDistributionData}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={68}
            paddingAngle={4}
            dataKey="value"
          >
            {healthDistributionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CircularUtilizationChart({ percentage }: { percentage: number }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 128 128">
        {/* Background Track */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="12"
          fill="transparent"
        />
        {/* Progress Value */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="#FF5A36"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold text-[#FAFAFA] tracking-tight">{percentage}%</span>
        <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Active Rate</span>
      </div>
    </div>
  )
}
