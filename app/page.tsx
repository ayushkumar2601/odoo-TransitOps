'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import {
  Truck,
  BarChart3,
  Zap,
  ArrowRight,
  Play,
  CheckCircle,
  Users,
  Wrench,
  Fuel,
  ShieldCheck,
  Brain,
  Radio,
  MapPin,
  RotateCcw,
  Leaf,
  FileBarChart
} from 'lucide-react'

// Lazy-load WorldMap so it never blocks initial paint
const WorldMap = dynamic(
  () => import('@/components/ui/world-map').then((m) => m.WorldMap),
  { ssr: false }
)

const FLEET_ROUTES = [
  { start: { lat: 22.57, lng: 88.36 }, end: { lat: 26.71, lng: 88.43 } },
  { start: { lat: 22.59, lng: 88.31 }, end: { lat: 23.34, lng: 85.30 } },
  { start: { lat: 23.68, lng: 86.99 }, end: { lat: 25.59, lng: 85.13 } },
  { start: { lat: 23.52, lng: 87.32 }, end: { lat: 20.29, lng: 85.82 } },
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
          className="absolute inset-0 rounded-2xl bg-white/5 p-6 flex flex-col justify-between border border-white/10 hover:border-white/20 transition-colors"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-[#e25c2e]">{front.icon}</div>
          <div>
            <h4 className="text-lg font-bold text-white mb-2">{front.title}</h4>
            <p className="text-sm text-white/60">{front.description}</p>
          </div>
          <span className="text-xs text-white/30">Hover for details</span>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between border border-[#e25c2e]/30 bg-[#e25c2e]/5"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <ul className="space-y-3 flex-1">
            {items.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-white">
                <CheckCircle className="w-4 h-4 text-[#e25c2e] shrink-0" />
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
          'AI Risk Badges: Low / Medium / High per driver',
        ],
      },
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'AI Smart Trip Dispatching',
      description: 'BR-008 cargo capacity verification with AI-ranked dispatch recommendations and automated lifecycle transitions.',
      back: {
        benefits: [
          'AI scores Top 3 vehicles per trip (Match %)',
          'Automated On Trip assignment transitions',
          'Instant trip release & completion records',
        ],
      },
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: 'Predictive Maintenance Queue',
      description: 'BR-012 workshop locks plus AI-ranked failure forecast — know which vehicle will break down before it does.',
      back: {
        benefits: [
          'AI predicts service date with 82–96% confidence',
          'Critical → Moderate → Low risk ranking',
          'Prevents dispatching vehicles under repair',
        ],
      },
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Fleet Digital Twin Engine',
      description: 'Every vehicle gets a live digital health profile — Health Score, Letter Grade, Lifecycle Stage, and Breakdown Risk %.',
      back: {
        benefits: [
          'Health Score = Engine × Safety × ROI formula',
          'Grades A+ to D with lifecycle stage tracking',
          'Breakdown risk % and next service date prediction',
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

  const wowFeatures = [
    { icon: <Radio className="w-5 h-5" />, label: 'Live Fleet Operations Map', href: '/live-operations' },
    { icon: <RotateCcw className="w-5 h-5" />, label: 'Fleet Replay Mode', href: '/replay' },
    { icon: <Brain className="w-5 h-5" />, label: 'Digital Twin Engine', href: '/vehicles' },
    { icon: <MapPin className="w-5 h-5" />, label: 'Operations War Room', href: '/command-center' },
    { icon: <Leaf className="w-5 h-5" />, label: 'Carbon Sustainability', href: '/sustainability' },
    { icon: <FileBarChart className="w-5 h-5" />, label: 'Executive PDF Briefing', href: '/briefing' },
  ]

  const partners = [
    { label: 'TATA', sub: 'Motors' },
    { label: 'Mahindra', sub: 'Logistics' },
    { label: 'VRL', sub: 'Logistics' },
    { label: 'TCI', sub: 'Leaders in Logistics' },
    { label: 'GATI', sub: 'KWE' },
  ]

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#0d0d0d]">

      {/* ═══════════════════════════════════════════════════════════
          NAVBAR — transparent, floating over hero
      ═══════════════════════════════════════════════════════════ */}
      <header className="absolute top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-lg">
            <Truck className="w-5 h-5 text-[#c94c1e]" />
          </div>
          <span className="font-extrabold text-xl text-white tracking-tight">TransitOps</span>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          <a href="#features" className="hover:text-white transition-colors">Platform</a>
          <a href="#intelligence" className="hover:text-white transition-colors">Intelligence</a>
          <a href="#corridors" className="hover:text-white transition-colors">Corridors</a>
          <Link href="/signin" className="hover:text-white transition-colors">Sign In</Link>
        </nav>

        {/* CTA */}
        <Link
          href="/dashboard"
          className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/80 text-white font-semibold text-sm hover:bg-white hover:text-[#c94c1e] transition-all"
        >
          Get Started <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      {/* ═══════════════════════════════════════════════════════════
          HERO — full viewport, background image
      ═══════════════════════════════════════════════════════════ */}
      <section
        className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Gradient overlay — left side readable, right side shows truck */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, rgba(30,10,5,0.82) 0%, rgba(30,10,5,0.60) 40%, rgba(30,10,5,0.08) 70%, transparent 100%)',
          }}
        />

        {/* Content — left aligned */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-8 pt-32 pb-24 flex flex-col items-start">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider mb-8"
          >
            <Zap className="w-3.5 h-3.5 text-[#ff8a65]" />
            Odoo × Adamas University Hackathon 2026
          </motion.div>

          {/* Main headline — three lines like inspiration */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-white leading-[1.05] tracking-tight max-w-2xl"
          >
            Intelligent Fleet.<br />
            Efficient Operations.<br />
            Stronger Business.
          </motion.h1>

          {/* Sub-copy with left border accent */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mt-7 text-base md:text-lg text-white/80 max-w-md leading-relaxed pl-4 border-l-2 border-white/40"
          >
            TransitOps is the all-in-one fleet intelligence platform
            that helps you monitor, predict, and optimize every
            mile of your operations — powered by AI.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#1a1a1a] hover:bg-black text-white font-bold text-sm transition-all shadow-2xl hover:scale-105"
            >
              Explore Platform <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/live-operations"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl border border-white/40 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold text-sm transition-all"
            >
              <span className="w-6 h-6 rounded-full border border-white/50 flex items-center justify-center">
                <Play className="w-3 h-3 fill-white text-white ml-0.5" />
              </span>
              Live Fleet Map
            </Link>
          </motion.div>

          {/* Trusted by strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16"
          >
            <p className="text-xs text-white/40 uppercase tracking-widest mb-4 font-semibold">
              Trusted by forward-thinking businesses
            </p>
            <div className="flex flex-wrap items-center gap-8">
              {partners.map((p) => (
                <div key={p.label} className="flex flex-col opacity-60 hover:opacity-100 transition-opacity">
                  <span className="font-extrabold text-white text-base leading-tight">{p.label}</span>
                  <span className="text-white/50 text-[10px] uppercase tracking-wide">{p.sub}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Live platform stats strip — floating at bottom of hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.62 }}
            className="mt-14 flex flex-wrap gap-6"
          >
            {[
              { val: '25', label: 'Fleet Vehicles' },
              { val: '35', label: 'Drivers' },
              { val: '56+', label: 'Features' },
              { val: '7', label: 'AI Engines' },
              { val: '279K', label: 'Lines of Code' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-2xl font-extrabold text-white leading-none">{stat.val}</span>
                <span className="text-xs text-white/50 mt-0.5">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          INTELLIGENCE FEATURES — dark section
      ═══════════════════════════════════════════════════════════ */}
      <section id="intelligence" className="bg-[#0d0d0d] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <span className="text-[#e25c2e] text-xs font-bold uppercase tracking-widest">Enterprise Intelligence</span>
              <h2 className="text-4xl font-extrabold text-white mt-2 tracking-tight leading-tight">
                Not a CRUD app.<br />An intelligence platform.
              </h2>
            </div>
            <p className="text-white/50 text-sm max-w-xs md:text-right leading-relaxed">
              7 proprietary algorithmic engines built on top of live fleet telemetry.
            </p>
          </div>

          {/* Wow feature chips */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-14">
            {wowFeatures.map((f) => (
              <Link
                key={f.label}
                href={f.href}
                className="group flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-[#e25c2e]/50 hover:bg-[#e25c2e]/5 transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-[#e25c2e]/10 border border-[#e25c2e]/20 flex items-center justify-center text-[#e25c2e] group-hover:bg-[#e25c2e]/20 transition-colors">
                  {f.icon}
                </div>
                <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{f.label}</span>
                <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#e25c2e] ml-auto transition-colors" />
              </Link>
            ))}
          </div>

          {/* Feature flip cards grid */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <LandingFlipCard key={idx} front={feat} back={feat.back} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CORRIDOR MAP — Eastern India haulage network
      ═══════════════════════════════════════════════════════════ */}
      <section id="corridors" className="bg-[#0a0a0a] py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[#e25c2e] text-xs font-bold uppercase tracking-widest">Eastern India Corridors</span>
            <h2 className="text-3xl font-extrabold text-white mt-2">Live Dispatch Network</h2>
            <p className="text-white/40 text-sm mt-2">
              Real-time GPS flows across Kolkata, Siliguri, Howrah, Ranchi, Patna & Bhubaneswar
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden p-4 md:p-8">
            <div className="h-64 md:h-96 w-full">
              <WorldMap dots={FLEET_ROUTES} lineColor="#e25c2e" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════ */}
      <footer className="bg-[#0d0d0d] border-t border-white/10 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#e25c2e]/20 border border-[#e25c2e]/30 flex items-center justify-center">
              <Truck className="w-4 h-4 text-[#e25c2e]" />
            </div>
            <span className="font-bold text-white/50">TransitOps</span>
            <span>© 2026 — Odoo × Adamas University Hackathon</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Built by Ayush Kumar</span>
            <span className="text-white/20">•</span>
            <span>Next.js 16 + React 19 + TypeScript + Groq AI</span>
            <span className="text-white/20">•</span>
            <Link href="/dashboard" className="text-[#e25c2e] hover:text-[#ff7043] transition-colors font-semibold">
              Launch Platform →
            </Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
