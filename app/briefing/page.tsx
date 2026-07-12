'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import {
  INITIAL_FLEET_TELEMETRY,
  VehicleTelemetry
} from '@/lib/live-tracking'
import {
  getAllFleetDigitalTwins,
  getPredictedServiceQueue,
  evaluateDriverRisk
} from '@/lib/intelligence'
import { drivers as MOCK_DRIVERS } from '@/lib/mock/transitops-data'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import {
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Leaf,
  DollarSign,
  Truck,
  Users,
  Calendar
} from 'lucide-react'

export default function ExecutiveBriefingPage() {
  const [vehicles, setVehicles] = useState<VehicleTelemetry[]>([])
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState('')

  useEffect(() => {
    setVehicles([...INITIAL_FLEET_TELEMETRY])
  }, [])

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  // 1. Core Fleet Utilization & Financial KPIs
  const totalAssets = vehicles.length
  const movingAssets = vehicles.filter(v => v.status === 'Moving').length
  const utilizationPercent = Math.round((movingAssets / Math.max(1, totalAssets)) * 100)
  const monthlyRevenueINR = 4850000
  const monthlyCostINR = 3120000
  const netMarginINR = monthlyRevenueINR - monthlyCostINR

  // 2. Digital Twin Top Performers
  const twins = getAllFleetDigitalTwins(vehicles)
  const topPerformers = twins.slice(0, 5)

  // 3. Maintenance & Predictive Queue
  const serviceQueue = getPredictedServiceQueue(vehicles)
  const criticalServiceCount = serviceQueue.filter(s => s.maintenanceRisk === 'Critical').length

  // 4. Driver Compliance & Risk Audit
  const driverRisks = MOCK_DRIVERS.map(evaluateDriverRisk)
  const highRiskDrivers = driverRisks.filter(d => d.riskLevel === 'High')

  // 5. Carbon Emissions & Optimization Footprint
  const totalDieselLiters = 15970
  const totalCO2Tonnes = Math.round((totalDieselLiters * 2.68) / 100) / 10 // 42.8 tonnes
  const carbonSavedTonnes = 4.6 // Saved via route optimization & idle cutoffs

  // 6. Generate & Download Professional PDF Briefing via pdf-lib
  async function handleDownloadPdf() {
    try {
      setIsGeneratingPdf(true)
      const pdfDoc = await PDFDocument.create()
      const timesRoman = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const timesBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

      // Page 1
      let page = pdfDoc.addPage([595.28, 841.89]) // A4 dimensions
      const { width, height } = page.getSize()

      // Header Banner
      page.drawRectangle({
        x: 0,
        y: height - 90,
        width,
        height: 90,
        color: rgb(0.06, 0.11, 0.22)
      })

      page.drawText('TRANSITOPS ENTERPRISE INTELLIGENCE', {
        x: 40,
        y: height - 40,
        size: 11,
        font: timesBold,
        color: rgb(0.23, 0.51, 0.96)
      })

      page.drawText('Executive Daily Operational Briefing', {
        x: 40,
        y: height - 65,
        size: 20,
        font: timesBold,
        color: rgb(1, 1, 1)
      })

      page.drawText(`Generated on: ${todayStr} | Eastern India Haulage Corridor`, {
        x: 40,
        y: height - 120,
        size: 10,
        font: timesRoman,
        color: rgb(0.35, 0.4, 0.5)
      })

      // KPI Summary Box
      let currentY = height - 160
      page.drawText('1. EXECUTIVE KPI & FINANCIAL SUMMARY', {
        x: 40,
        y: currentY,
        size: 13,
        font: timesBold,
        color: rgb(0.1, 0.15, 0.25)
      })

      currentY -= 25
      page.drawText(`• Active Fleet Utilization: ${utilizationPercent}% (${movingAssets} / ${totalAssets} commercial vehicles active)`, {
        x: 50,
        y: currentY,
        size: 11,
        font: timesRoman,
        color: rgb(0.2, 0.2, 0.2)
      })

      currentY -= 20
      page.drawText(`• Monthly Gross Freight Revenue: INR ${(monthlyRevenueINR / 100000).toFixed(2)} Lakhs`, {
        x: 50,
        y: currentY,
        size: 11,
        font: timesRoman,
        color: rgb(0.2, 0.2, 0.2)
      })

      currentY -= 20
      page.drawText(`• Monthly Operational Cost: INR ${(monthlyCostINR / 100000).toFixed(2)} Lakhs`, {
        x: 50,
        y: currentY,
        size: 11,
        font: timesRoman,
        color: rgb(0.2, 0.2, 0.2)
      })

      currentY -= 20
      page.drawText(`• Net Corridor Operating Margin: INR ${(netMarginINR / 100000).toFixed(2)} Lakhs (+35.6% margin)`, {
        x: 50,
        y: currentY,
        size: 11,
        font: timesBold,
        color: rgb(0.06, 0.5, 0.25)
      })

      // Section 2: Top Performing Assets
      currentY -= 40
      page.drawText('2. TOP PERFORMING DIGITAL TWIN ASSETS', {
        x: 40,
        y: currentY,
        size: 13,
        font: timesBold,
        color: rgb(0.1, 0.15, 0.25)
      })

      topPerformers.forEach(tp => {
        currentY -= 22
        page.drawText(
          `Rank #${tp.roiRank}: ${tp.registrationNumber} (${tp.vehicleName}) | Grade: ${tp.healthGrade} | Health Score: ${tp.healthScore}/100`,
          {
            x: 50,
            y: currentY,
            size: 10,
            font: timesRoman,
            color: rgb(0.2, 0.2, 0.2)
          }
        )
      })

      // Section 3: Predictive Maintenance & Compliance
      currentY -= 40
      page.drawText('3. PREDICTIVE MAINTENANCE & DRIVER COMPLIANCE', {
        x: 40,
        y: currentY,
        size: 13,
        font: timesBold,
        color: rgb(0.1, 0.15, 0.25)
      })

      currentY -= 25
      page.drawText(`• Critical Predictive Maintenance Alerts: ${criticalServiceCount} assets flagged for urgent workshop inspection.`, {
        x: 50,
        y: currentY,
        size: 11,
        font: timesRoman,
        color: rgb(0.2, 0.2, 0.2)
      })

      currentY -= 20
      page.drawText(`• High-Risk Operator Compliance: Flagged ${highRiskDrivers.length} drivers requiring defensive training review.`, {
        x: 50,
        y: currentY,
        size: 11,
        font: timesRoman,
        color: rgb(0.2, 0.2, 0.2)
      })

      // Section 4: Sustainability & Carbon Footprint
      currentY -= 40
      page.drawText('4. SUSTAINABILITY & CARBON EMISSIONS METRICS', {
        x: 40,
        y: currentY,
        size: 13,
        font: timesBold,
        color: rgb(0.1, 0.15, 0.25)
      })

      currentY -= 25
      page.drawText(`• Total Monthly Diesel Consumption: ${totalDieselLiters.toLocaleString()} Liters`, {
        x: 50,
        y: currentY,
        size: 11,
        font: timesRoman,
        color: rgb(0.2, 0.2, 0.2)
      })

      currentY -= 20
      page.drawText(`• Direct Fleet Carbon Footprint: ${totalCO2Tonnes} Metric Tonnes CO2`, {
        x: 50,
        y: currentY,
        size: 11,
        font: timesRoman,
        color: rgb(0.2, 0.2, 0.2)
      })

      currentY -= 20
      page.drawText(`• Carbon Saved via Route Optimization: ${carbonSavedTonnes} Metric Tonnes CO2`, {
        x: 50,
        y: currentY,
        size: 11,
        font: timesBold,
        color: rgb(0.06, 0.5, 0.25)
      })

      // Footer
      page.drawText('Confidential • TransitOps AI Platform • Approved for Board Review', {
        x: 40,
        y: 40,
        size: 9,
        font: timesRoman,
        color: rgb(0.5, 0.5, 0.5)
      })

      // Serialize & trigger download
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `TransitOps_Executive_Briefing_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setIsGeneratingPdf(false)
      setPdfSuccessMessage('Executive Daily Briefing PDF downloaded successfully!')
      setTimeout(() => setPdfSuccessMessage(''), 5000)
    } catch (err) {
      setIsGeneratingPdf(false)
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <main className="flex-1 md:ml-60 flex flex-col h-screen overflow-y-auto">
        {/* Header Bar */}
        <header className="px-8 py-6 border-b border-white/10 bg-surface flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 bg-primary/15 text-primary rounded-full border border-primary/30 uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> {todayStr}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Executive Daily Briefing</h1>
            <p className="text-sm text-on-surface-variant mt-1">
              AI-compiled strategic operational report for TransitOps leadership & stakeholders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-sm shadow-xl flex items-center gap-2.5 transition-all border border-white/20 hover:scale-105 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Briefing'}
            </button>
          </div>
        </header>

        {pdfSuccessMessage && (
          <div className="mx-8 mt-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-bold flex items-center gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{pdfSuccessMessage}</span>
          </div>
        )}

        {/* Briefing Body Grid */}
        <div className="p-8 space-y-8 max-w-7xl">
          {/* Section 1: Fleet Utilization & Financial Health */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> 1. Fleet Utilization & Financial Health
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-surface-container border border-white/10">
                <span className="text-xs uppercase font-bold text-on-surface-variant">Active Utilization</span>
                <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">{utilizationPercent}%</div>
                <p className="text-xs text-on-surface-variant mt-1">
                  {movingAssets} of {totalAssets} vehicles en route
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-surface-container border border-white/10">
                <span className="text-xs uppercase font-bold text-on-surface-variant">Monthly Revenue</span>
                <div className="text-2xl font-bold text-white font-mono mt-1">
                  ₹{(monthlyRevenueINR / 100000).toFixed(2)}L
                </div>
                <p className="text-xs text-emerald-400 font-semibold mt-1">+12.4% vs last quarter</p>
              </div>

              <div className="p-5 rounded-2xl bg-surface-container border border-white/10">
                <span className="text-xs uppercase font-bold text-on-surface-variant">Operational OPEX</span>
                <div className="text-2xl font-bold text-rose-300 font-mono mt-1">
                  ₹{(monthlyCostINR / 100000).toFixed(2)}L
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Fuel, tolls, and maintenance</p>
              </div>

              <div className="p-5 rounded-2xl bg-surface-container border border-white/10">
                <span className="text-xs uppercase font-bold text-on-surface-variant">Net Margin</span>
                <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                  ₹{(netMarginINR / 100000).toFixed(2)}L
                </div>
                <p className="text-xs text-emerald-400 font-semibold mt-1">+35.6% operational margin</p>
              </div>
            </div>
          </section>

          {/* Section 2: Top Performing Digital Twin Assets */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Cpu className="w-5 h-5 text-sky-400" /> 2. Top Performing Digital Twin Assets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {topPerformers.map(tp => (
                <div key={tp.vehicleId} className="p-4 rounded-2xl bg-surface-container border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-primary uppercase">Rank #{tp.roiRank}</span>
                    <span className="px-2 py-0.5 rounded font-bold text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      {tp.healthGrade}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-on-surface">{tp.registrationNumber}</h3>
                  <p className="text-xs text-on-surface-variant">{tp.vehicleName}</p>
                  <div className="mt-3 pt-2 border-t border-white/10 flex justify-between text-xs">
                    <span className="text-on-surface-variant">Health Score</span>
                    <strong className="text-white font-mono">{tp.healthScore}/100</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Predictive Maintenance & Driver Compliance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="p-6 rounded-3xl bg-surface-container border border-white/10 space-y-4">
              <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" /> 3. Predictive Maintenance Alerts
              </h3>
              <p className="text-xs text-on-surface-variant">
                Identified <strong className="text-white">{criticalServiceCount} assets</strong> at critical risk of corridor
                stoppage based on thermal and wear telematics.
              </p>
              <div className="space-y-2.5">
                {serviceQueue.slice(0, 3).map(sq => (
                  <div
                    key={sq.vehicleId}
                    className="p-3.5 rounded-xl bg-surface border border-white/10 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{sq.registrationNumber}</span>
                      <span className="text-on-surface-variant text-[11px]">{sq.reasons[0]}</span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg font-mono font-bold ${
                        sq.maintenanceRisk === 'Critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      In {sq.predictedServiceDays} Days
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="p-6 rounded-3xl bg-surface-container border border-white/10 space-y-4">
              <h3 className="font-bold text-base text-on-surface flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" /> 4. Driver Compliance & Risk Audit
              </h3>
              <p className="text-xs text-on-surface-variant">
                Audited <strong className="text-white">{MOCK_DRIVERS.length} Eastern India operators</strong> across safety
                score, harsh braking, and checkpost compliance.
              </p>
              <div className="space-y-2.5">
                {driverRisks.slice(0, 3).map(dr => (
                  <div
                    key={dr.driverId}
                    className="p-3.5 rounded-xl bg-surface border border-white/10 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{dr.driverName}</span>
                      <span className="text-on-surface-variant text-[11px]">{dr.riskFactors[0]}</span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg font-bold uppercase text-[10px] ${
                        dr.riskLevel === 'High'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      Risk: {dr.riskLevel}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Section 5: Carbon Footprint Summary Card */}
          <section className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Direct Sustainability & CO₂ Audit</h3>
                <p className="text-xs text-emerald-300/80 mt-0.5">
                  Direct emissions: {totalCO2Tonnes} tonnes CO₂ ({totalDieselLiters.toLocaleString()} L diesel). Carbon
                  saved via route optimization: <strong className="text-white">{carbonSavedTonnes} tonnes CO₂</strong>.
                </p>
              </div>
            </div>
            <span className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shrink-0 shadow-lg">
              Statutory Green Certified
            </span>
          </section>
        </div>
      </main>
    </div>
  )
}
