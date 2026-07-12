'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Truck,
  ArrowRight,
  Play,
  ArrowUpRight,
  Star,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Activity,
  FileText,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

export default function LandingPage() {
  const partners = [
    { label: 'TATA', sub: 'Motors' },
    { label: 'Mahindra', sub: 'Logistics' },
    { label: 'VRL', sub: 'Logistics' },
    { label: 'TCI', sub: 'Leaders in Logistics' },
    { label: 'GATI', sub: 'KWE' },
  ]

  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0)

  const testimonials = [
    {
      quote:
        'TransitOps streamlined our entire Eastern India supply chain. Fast execution, accurate tracking, and consistently reliable service.',
      author: 'Arif Mahmud',
      role: 'Project Manager, Logistics Ops',
      avatar: 'AM',
    },
    {
      quote:
        'The Digital Twin health scores and predictive maintenance queue eliminated unexpected roadside breakdowns completely across our 25 commercial haulage trucks.',
      author: 'Rajesh Roy',
      role: 'Fleet Operations Lead, Eastern Corridor',
      avatar: 'RR',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden font-sans">
      {/* ═══════════════════════════════════════════════════════════
          NAVBAR — Transparent, floating over hero
      ═══════════════════════════════════════════════════════════ */}
      <header className="absolute top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-lg">
            <Truck className="w-5 h-5 text-[#e25c2e]" />
          </div>
          <span className="font-extrabold text-xl text-white tracking-tight">TransitOps</span>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/85">
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
          <Link href="/signin" className="hover:text-white transition-colors">Sign In</Link>
        </nav>

        {/* CTA */}
        <Link
          href="/dashboard"
          className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/80 text-white font-semibold text-sm hover:bg-white hover:text-[#e25c2e] transition-all"
        >
          Get Started <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      {/* ═══════════════════════════════════════════════════════════
          HERO — Full viewport, hero.png background, left-aligned
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
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(22,9,4,0.85) 0%, rgba(22,9,4,0.64) 42%, rgba(22,9,4,0.12) 72%, transparent 100%)',
          }}
        />

        {/* Content */}
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

          {/* Main headline */}
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
            className="mt-7 text-base md:text-lg text-white/85 max-w-md leading-relaxed pl-4 border-l-2 border-white/40"
          >
            TransitOps is the all-in-one fleet intelligence platform that helps you monitor, predict, and optimize every mile of your operations — powered by AI.
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
            <p className="text-xs text-white/50 uppercase tracking-widest mb-4 font-semibold">
              Trusted by forward-thinking businesses
            </p>
            <div className="flex flex-wrap items-center gap-8">
              {partners.map((p) => (
                <div key={p.label} className="flex flex-col opacity-65 hover:opacity-100 transition-opacity">
                  <span className="font-extrabold text-white text-base leading-tight">{p.label}</span>
                  <span className="text-white/60 text-[10px] uppercase tracking-wide">{p.sub}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Stats strip floating at bottom of hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.62 }}
            className="mt-14 flex flex-wrap gap-8"
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
                <span className="text-xs text-white/60 mt-1">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: WHITE BACKGROUND — "Holistic Transport & Logistics"
          Exact structure of TruckNex Image 1
      ═══════════════════════════════════════════════════════════ */}
      <section id="services" className="bg-white text-neutral-900 py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left text column */}
            <div className="lg:col-span-5 flex flex-col items-start pt-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
                Our Services
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.12] text-neutral-900">
                <span className="inline-block bg-[#ffc6b6] px-2.5 py-0.5 rounded-lg mr-2">
                  Holistic
                </span>
                Transport &amp;
                <br />
                Logistics
              </h2>
              <p className="mt-6 text-neutral-600 text-sm md:text-base leading-relaxed">
                Our comprehensive fleet intelligence services are designed to govern every stage of your haulage lifecycle with precision. From AI predictive maintenance to automated BR-008 dispatch validation.
              </p>
              <Link
                href="/dashboard"
                className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-sm transition-all shadow-lg"
              >
                Explore Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right column: 2 Tall showcase feature cards */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="group relative h-[380px] rounded-3xl overflow-hidden bg-neutral-900 shadow-xl flex flex-col justify-between p-7 border border-neutral-800">
                {/* Background visual overlay */}
                <div
                  className="absolute inset-0 opacity-40 group-hover:scale-105 transition-transform duration-700 bg-cover bg-center"
                  style={{ backgroundImage: 'url(/hero.png)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />

                {/* Top right circular button badge */}
                <div className="relative z-10 flex justify-end">
                  <div className="w-10 h-10 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white group-hover:text-neutral-900 transition-all">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>

                {/* Bottom text overlay */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Predictive Maintenance
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Prevent unexpected roadside breakdowns with AI degradation forecasts and BR-012 workshop locks.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative h-[380px] rounded-3xl overflow-hidden bg-neutral-900 shadow-xl flex flex-col justify-between p-7 border border-neutral-800">
                {/* Background visual overlay */}
                <div
                  className="absolute inset-0 opacity-40 group-hover:scale-105 transition-transform duration-700 bg-cover bg-center"
                  style={{ backgroundImage: 'url(/hero.png)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />

                {/* Top right circular button badge */}
                <div className="relative z-10 flex justify-end">
                  <div className="w-10 h-10 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white group-hover:text-neutral-900 transition-all">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>

                {/* Bottom text overlay */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-2">
                    OSRM Haulage Dispatch
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Real-road GPS simulation across Eastern India highways with automated BR-009 dispatch locks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: WHITE BACKGROUND — STATS ROW
          4 clean columns with subtle vertical borders
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white text-neutral-900 pb-24 px-8 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
            <div className="flex flex-col items-start pr-8">
              <span className="text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight">
                25+
              </span>
              <span className="text-xs text-neutral-500 font-medium mt-2">
                Commercial Fleet Assets
              </span>
            </div>

            <div className="flex flex-col items-start px-0 md:px-8 md:border-l border-neutral-200">
              <span className="text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight">
                13+
              </span>
              <span className="text-xs text-neutral-500 font-medium mt-2">
                Enforced Business Rules
              </span>
            </div>

            <div className="flex flex-col items-start px-0 md:px-8 md:border-l border-neutral-200">
              <span className="text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight">
                7+
              </span>
              <span className="text-xs text-neutral-500 font-medium mt-2">
                AI &amp; Digital Twin Engines
              </span>
            </div>

            <div className="flex flex-col items-start px-0 md:px-8 md:border-l border-neutral-200">
              <span className="text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight">
                99.4%
              </span>
              <span className="text-xs text-neutral-500 font-medium mt-2">
                Compliance Reliability
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: WHITE BACKGROUND — "End-To-End Logistics & Management Solutions"
          3 Showcase cards grid
      ═══════════════════════════════════════════════════════════ */}
      <section id="solutions" className="bg-white text-neutral-900 py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900 leading-tight">
              End-To-End{' '}
              <span className="inline-block bg-[#ffc6b6] px-2.5 py-0.5 rounded-lg">
                Logistics
              </span>{' '}
              &amp;
              <br />
              Management Solutions
            </h2>
          </div>

          {/* 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="flex flex-col">
              <div className="h-72 rounded-3xl bg-neutral-100 border border-neutral-200 overflow-hidden relative p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-900 text-white">
                    Digital Twin
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
                    A+ Grade Asset
                  </span>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-md border border-neutral-200/80">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-neutral-800">Health Score</span>
                    <span className="font-bold text-emerald-600">94/100</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[94%]" />
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-3 leading-relaxed">
                    Weighted 5-factor scoring covering engine telemetry, safety history, and ROI yield.
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm font-bold text-neutral-800">
                Driving Efficiency Across Every Supply Chain.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col">
              <div className="h-72 rounded-3xl bg-neutral-900 text-white border border-neutral-800 overflow-hidden relative p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white">
                    War Room TV
                  </span>
                  <span className="text-xs font-semibold text-[#ff8a65] bg-[#ff8a65]/20 px-2.5 py-1 rounded-full">
                    5s Auto-Refresh
                  </span>
                </div>

                <div className="bg-neutral-800/80 rounded-2xl p-4 border border-neutral-700">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-white">Eastern India Map</span>
                    <span className="text-neutral-400">25 Active Assets</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    Live OpenStreetMap haulage visualizer with regional hub thermal heatmaps.
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm font-bold text-neutral-800">
                Real-Time Haulage &amp; Operations Command Tower.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col">
              <div className="h-72 rounded-3xl bg-neutral-100 border border-neutral-200 overflow-hidden relative p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-900 text-white">
                    Carbon Audit
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
                    Statutory Ready
                  </span>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-md border border-neutral-200/80">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-neutral-800">CO₂ Footprint</span>
                    <span className="font-bold text-neutral-900">2.68 kg / Liter</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    One-click board-ready PDF briefing exports and IPCC statutory carbon tracking.
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm font-bold text-neutral-800">
                Statutory Compliance &amp; ESG Executive Reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: PURE BLACK BACKGROUND — TESTIMONIALS & CLIENTS
          Matches Image 2 dark section exactly
      ═══════════════════════════════════════════════════════════ */}
      <section id="testimonials" className="bg-[#080808] text-white py-24 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Top heading row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-16">
            <p className="text-xs md:text-sm text-neutral-400 max-w-xs leading-relaxed">
              Our clients trust us for reliable, efficient logistics solutions. Their success stories reflect our commitment to timely delivery.
            </p>

            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              See What Our Happy
              <br />
              <span className="inline-block bg-[#ffc6b6] text-neutral-950 px-2.5 py-0.5 rounded-lg">
                Clients
              </span>{' '}
              Are Saying
            </h2>

            {/* Arrows */}
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setActiveTestimonialIdx((prev) =>
                    prev === 0 ? testimonials.length - 1 : prev - 1
                  )
                }
                className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center hover:border-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setActiveTestimonialIdx((prev) =>
                    prev === testimonials.length - 1 ? 0 : prev + 1
                  )
                }
                className="w-10 h-10 rounded-full bg-white text-neutral-950 flex items-center justify-center hover:bg-neutral-200 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Testimonial card block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-8 border-y border-neutral-800">
            {/* Left avatars profile */}
            <div className="lg:col-span-5 flex items-center gap-4">
              <div className="w-36 h-44 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 flex flex-col justify-end p-4 shadow-2xl">
                <div className="w-10 h-10 rounded-full bg-[#ffc6b6] text-neutral-900 font-extrabold flex items-center justify-center mb-3">
                  {testimonials[activeTestimonialIdx].avatar}
                </div>
                <span className="font-bold text-sm text-white">
                  {testimonials[activeTestimonialIdx].author}
                </span>
                <span className="text-[10px] text-neutral-400">
                  {testimonials[activeTestimonialIdx].role}
                </span>
                <div className="flex items-center gap-1 mt-2 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>

            {/* Quote block */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <span className="text-6xl text-neutral-700 font-serif leading-none">“</span>
              <p className="text-lg md:text-2xl font-medium text-white/90 leading-relaxed mt-2">
                {testimonials[activeTestimonialIdx].quote}
              </p>
            </div>
          </div>

          {/* Brand logos row in dark rounded boxes */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-16">
            {[
              'TATA MOTORS',
              'MAHINDRA LOGISTICS',
              'VRL LOGISTICS',
              'TCI SUPPLY CHAIN',
              'GATI KWE',
              'ADAMAS LOGISTICS',
            ].map((logo) => (
              <div
                key={logo}
                className="bg-neutral-900/80 border border-neutral-800 rounded-xl px-4 py-4 flex items-center justify-center text-center font-extrabold text-white/60 tracking-wider text-xs"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: PURE WHITE BACKGROUND — CTA SECTION
          Matches Image 2 bottom section exactly
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white text-neutral-900 py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left text column */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-neutral-900">
                Ready To Redefine Your
                <br />
                <span className="inline-block bg-[#ffc6b6] px-2.5 py-0.5 rounded-lg mt-1">
                  Logistics Strategy?
                </span>
              </h2>
              <p className="mt-6 text-neutral-600 text-sm md:text-base leading-relaxed">
                Partner With Us For Reliable, Transparent, And Efficient Fleet Operations Tailored To Your Enterprise Business Needs.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/dashboard"
                  className="px-7 py-3.5 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-sm transition-all shadow-lg"
                >
                  Launch Command Center &gt;
                </Link>
                <Link
                  href="/signin"
                  className="px-7 py-3.5 rounded-xl border border-neutral-300 hover:border-neutral-400 text-neutral-800 font-semibold text-sm transition-all"
                >
                  Test RBAC Portal
                </Link>
              </div>
            </div>

            {/* Right collage decorative column */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="relative w-full max-w-md h-80 flex items-center justify-center">
                {/* Decorative accent blocks */}
                <div className="absolute top-2 left-10 w-12 h-12 rounded-2xl bg-[#ffbe0b] shadow-md" />
                <div className="absolute bottom-6 right-20 w-10 h-10 rounded-xl bg-[#ff3b30] shadow-md" />

                {/* Main truck card */}
                <div className="relative z-10 w-64 h-48 rounded-3xl bg-neutral-900 text-white p-5 shadow-2xl flex flex-col justify-between border border-neutral-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#ffc6b6]">TransitOps AI</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-lg font-extrabold text-white">25 Active Trucks</span>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Eastern India Haulage Telemetry
                    </p>
                  </div>
                </div>

                {/* Overlapping smaller card */}
                <div className="absolute bottom-4 left-6 z-20 w-44 h-28 rounded-2xl bg-white border border-neutral-200 p-4 shadow-xl flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">
                    Health Audit
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-extrabold text-neutral-900">99.4%</span>
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 6: BLACK FOOTER SECTION
          Exact structure of Image 2 footer
      ═══════════════════════════════════════════════════════════ */}
      <footer className="bg-[#080808] text-white/70 pt-20 pb-12 px-8 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          {/* Top row: Newsletter + Contact */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-neutral-800/80">
            {/* Left Newsletter */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <h3 className="text-lg font-extrabold text-white">
                Subscribe To Our Newsletter
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Join our community for exclusive news and smart deals.
              </p>

              <div className="mt-6 flex items-center border-b border-neutral-700 w-full max-w-md pb-2">
                <input
                  type="email"
                  placeholder="Enter your Mail..."
                  className="bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none flex-1"
                />
                <button className="text-white/60 hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Contact Info */}
            <div className="lg:col-span-6 flex flex-col lg:items-end justify-center text-left lg:text-right space-y-1">
              <span className="text-sm font-bold text-white">
                (033) 555-0116
              </span>
              <span className="text-xs text-neutral-400">
                operations@transitops.ai
              </span>
              <span className="text-xs text-neutral-400">
                Sector V, Salt Lake, Kolkata, India 700091
              </span>
            </div>
          </div>

          {/* Bottom links & Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 text-xs text-neutral-500 gap-4">
            <div className="flex items-center gap-6">
              <Link href="#services" className="hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="#solutions" className="hover:text-white transition-colors">
                Careers
              </Link>
              <Link href="#testimonials" className="hover:text-white transition-colors">
                Blog
              </Link>
              <Link href="/signin" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>

            <span>
              © 2026 TransitOps Platform — Odoo × Adamas University Hackathon
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
