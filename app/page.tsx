'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import {
  Truck,
  BarChart3,
  Lock,
  Zap,
  ArrowRight,
  CheckCircle,
  Users,
  Wrench,
  Fuel,
  ShieldCheck
} from 'lucide-react'

// Lazy-load WorldMap so it never blocks initial paint
const WorldMap = dynamic(
  () => import('@/components/ui/world-map').then((m) => m.WorldMap),
  { ssr: false }
)

const FLEET_ROUTES = [
  // Kolkata → Siliguri
  { start: { lat: 22.57, lng: 88.36 }, end: { lat: 26.71, lng: 88.43 } },
  // Howrah → Ranchi
  { start: { lat: 22.59, lng: 88.31 }, end: { lat: 23.34, lng: 85.30 } },
  // Asansol → Patna
  { start: { lat: 23.68, lng: 86.99 }, end: { lat: 25.59, lng: 85.13 } },
  // Durgapur → Bhubaneswar
  { start: { lat: 23.52, lng: 87.32 }, end: { lat: 20.29, lng: 85.82 } },
  // Kharagpur → Jamshedpur
  { start: { lat: 22.34, lng: 87.23 }, end: { lat: 22.80, lng: 86.20 } },
]

function LandingFlipCard({
  front,
  back,
}: {
  front: { icon?: React.ReactNode; title: string; description: string }
  back: { benefits?: string[]; items?: string[]; content?: React.ReactNode }
}) {
  const [flipped, setFlipped] = useState(false)
  const items = back.benefits ?? back.items ?? []

  return (
    <div
      className="relative h-64 cursor-pointer"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(f => !f)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl bg-surface-container-low p-6 flex flex-col justify-between border border-white/10"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-primary">{front.icon}</div>
          <div>
            <h4 className="text-lg font-bold text-on-surface mb-2">{front.title}</h4>
            <p className="text-sm text-on-surface-variant">{front.description}</p>
          </div>
          <span className="text-xs text-on-surface-variant/50">Hover for details</span>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between border border-primary/30 bg-primary/5"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <ul className="space-y-3 flex-1">
            {items.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-on-surface">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          {back.content}
        </div>
      </motion.div>
    </div>
  )
}

export default function LandingPage() {
  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Centralized Fleet Asset Registry',
      description: 'Enforce BR-001 unique registration verification across 25+ commercial heavy vehicles and mini trucks.',
      back: {
        benefits: [
          'Enforces BR-001 unique registration numbers',
          'Tracks capacity, odometer & acquisition cost',
          'Status control: Available, On Trip, In Shop, Retired',
        ],
      },
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: 'Driver Compliance Governance',
      description: 'Automated BR-004 license expiry audit locks and BR-005 suspended personnel safeguards.',
      back: {
        benefits: [
          'Tracks driver safety scores (62–98/100)',
          'Automated license expiry locks (BR-004)',
          'Single assignment enforcement (BR-006)',
        ],
      },
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Trip Dispatching Lifecycle',
      description: 'BR-008 cargo capacity verification with automated BR-009 to BR-011 lifecycle state transitions.',
      back: {
        benefits: [
          'Strict cargo vs. vehicle max capacity check',
          'Automated On Trip assignment transitions',
          'Instant trip release & completion records',
        ],
      },
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: 'Workshop & Maintenance Lock',
      description: 'BR-012 In Shop vehicle locks during active service and BR-013 release upon completion.',
      back: {
        benefits: [
          'Automatic vehicle status lock to In Shop',
          'Prevents dispatching vehicles under repair',
          'Tracks preventive maintenance expenses',
        ],
      },
    },
    {
      icon: <Fuel className="w-8 h-8" />,
      title: 'Fuel & Expense Telemetry',
      description: 'Real-time diesel refueling rate tracking and multi-category highway operational cost logs.',
      back: {
        benefits: [
          '120+ historical diesel logs (₹88–₹98/L)',
          'Toll, parking, insurance & service expense tracking',
          'Calculates total operational expenditure per asset',
        ],
      },
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'BI Analytics & Asset ROI',
      description: 'Dynamic fleet utilization rate metrics and exact net ROI yield leaderboard per asset.',
      back: {
        benefits: [
          'Real-time Fleet Utilization Rate formula',
          'Net ROI yield ranking per commercial asset',
          'Interactive Recharts distribution analytics',
        ],
      },
    },
  ]

  return (
    <div className="min-h-screen bg-surface flex flex-col overflow-x-hidden">
      {/* Top Header Bar */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-bold text-on-primary shadow-lg shadow-primary/20">
            TO
          </div>
          <span className="font-bold text-lg text-on-surface tracking-tight">TransitOps</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 font-semibold uppercase tracking-wider">
            Enterprise Fleet Platform
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/signin"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface-variant hover:text-white transition-colors"
          >
            RBAC Login Portal
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Launch Command Center
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
          <Zap className="w-3.5 h-3.5" />
          Odoo x Adamas University Hackathon 2026
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-on-surface tracking-tight max-w-4xl mx-auto leading-tight">
          Centralized Operating System for <span className="text-primary">Transport Operations</span>
        </h1>

        <p className="mt-5 text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          Transform spreadsheet chaos into unified fleet intelligence. Digitizing vehicle assets, driver governance, haulage dispatch, workshop maintenance, fuel consumption, and financial ROI.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-2"
          >
            Launch Command Center
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/signin"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-surface-container-low border border-white/10 text-on-surface font-semibold text-sm hover:border-white/20 transition-all flex items-center justify-center"
          >
            Test 5 RBAC Workspace Roles
          </Link>
        </div>
      </section>

      {/* World Map Section */}
      <section className="px-6 max-w-6xl mx-auto mb-20 w-full">
        <div className="rounded-3xl border border-white/10 bg-surface-container-low overflow-hidden p-4 md:p-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-on-surface">Eastern India & National Corridor Telemetry</h3>
            <p className="text-xs text-on-surface-variant mt-1">Live dispatch flows across Kolkata, Siliguri, Howrah, Ranchi, Patna & Bhubaneswar</p>
          </div>
          <div className="h-64 md:h-80 w-full">
            <WorldMap dots={FLEET_ROUTES} lineColor="#0ea5e9" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 max-w-6xl mx-auto mb-24 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-on-surface">Core Fleet Operations Modules</h2>
          <p className="text-sm text-on-surface-variant mt-2">Strict programmatic enforcement of Business Rules BR-001 through BR-013</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <LandingFlipCard key={idx} front={feat} back={feat.back} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-on-surface-variant">
          <div>© 2026 TransitOps Platform — Odoo x Adamas University Hackathon</div>
          <div className="mt-4 md:mt-0 flex items-center gap-6">
            <span>Built by Ayush Kumar</span>
            <span>Next.js 16 + React 19 + TypeScript</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
