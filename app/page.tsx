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
          NAVBAR — Compact executive bar masking only the top 56px
      ═══════════════════════════════════════════════════════════ */}
      <header className="absolute top-0 left-0 right-0 z-50 h-14 bg-[#0B0F19] border-b border-white/15 px-6 md:px-12 flex items-center justify-between shadow-2xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FF5A36] text-white flex items-center justify-center shadow-md shadow-[#FF5A36]/25">
            <Truck className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-lg text-white tracking-tight leading-none">TransitOps</span>
            <span className="text-[9px] font-bold tracking-widest text-[#FF5A36] uppercase">Enterprise OS</span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-white/85">
          <a href="#services" className="hover:text-[#FF5A36] transition-colors">Services</a>
          <a href="#solutions" className="hover:text-[#FF5A36] transition-colors">Solutions</a>
          <a href="#testimonials" className="hover:text-[#FF5A36] transition-colors">Testimonials</a>
          <Link href="/live-operations" className="hover:text-[#FF5A36] transition-colors">Live Map</Link>
          <Link href="/command-center" className="hover:text-[#FF5A36] transition-colors">War Room</Link>
        </nav>

        {/* Working CTA & Sign In Buttons */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/signin"
            className="px-4 py-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/15 text-white font-semibold text-xs transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-1.5 rounded-lg bg-[#FF5A36] hover:bg-[#E04826] text-white font-bold text-xs shadow-lg shadow-[#FF5A36]/30 transition-all flex items-center gap-1.5"
          >
            Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════
          HERO — Video background (carArea.mp4) with masked navbar
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full h-screen min-h-[640px] flex flex-col justify-end overflow-hidden bg-[#0A0E1A]">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/prompts%20(i've%20added%20them%20to%20the%20motionsites)/carArea.mp4"
        />

        {/* Compact top mask layer covering only top 56px so BEYOND is fully visible */}
        <div className="absolute top-0 left-0 right-0 h-14 bg-[#0B0F19] z-20 pointer-events-none" />
        <div className="absolute top-14 left-0 right-0 h-4 bg-gradient-to-b from-[#0B0F19] to-transparent z-20 pointer-events-none" />

        {/* Subtle dark gradient at bottom for floating console readability */}
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/40 to-transparent z-10 pointer-events-none" />

        {/* Interactive Floating Executive Control Bar over bottom of hero */}
        <div className="relative z-30 max-w-7xl mx-auto w-full px-6 md:px-12 pb-10">
          <div className="p-5 md:p-6 rounded-2xl bg-[#0B0F19]/85 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Live Eastern India Corridor Telemetry Active
                </span>
                <p className="text-sm text-white/80 font-medium mt-0.5">
                  AI predictive routing, digital twins, and real-time haulage monitoring online.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/live-operations"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs flex items-center gap-2 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                Live Fleet Map
              </Link>

              <Link
                href="/dashboard"
                className="px-6 py-2.5 rounded-xl bg-[#FF5A36] hover:bg-[#E04826] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-[#FF5A36]/30"
              >
                Launch Enterprise Dashboard
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
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
              © 2026 TransitOps Enterprise OS — All Rights Reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
