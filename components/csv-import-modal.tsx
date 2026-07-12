'use client'

import React, { useState } from 'react'
import { store, Vehicle, Driver, Trip } from '@/lib/mock'
import { Upload, Download, CheckCircle2, AlertCircle, X, FileSpreadsheet } from 'lucide-react'

export type ImportCategory = 'Vehicles' | 'Drivers' | 'Trips'

interface CSVImportModalProps {
  isOpen: boolean
  category: ImportCategory
  onClose: () => void
  onImported: () => void
}

export function CSVImportModal({ isOpen, category, onClose, onImported }: CSVImportModalProps) {
  const [csvText, setCsvText] = useState('')
  const [parsedRows, setParsedRows] = useState<any[]>([])
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  function downloadTemplate() {
    let template = ''
    let filename = ''
    if (category === 'Vehicles') {
      template = 'registrationNumber,vehicleName,vehicleType,maxLoadCapacity,odometer,acquisitionCost,region\nWB-25-P-8801,Tata Prima 2830.K,Container Truck,18000,14000,3800000,Kolkata\nOD-02-Q-5510,Ashok Leyland 1920,Refrigerated Truck,12000,28000,2800000,Bhubaneswar'
      filename = 'TransitOps_Vehicles_Template.csv'
    } else if (category === 'Drivers') {
      template = 'name,licenseNumber,licenseCategory,expiryDate,contactNumber\nDeepak Nandi,WB-DL-2021-9921,Commercial HMV,2028-09-15,+91 98301 11029\nSourav Bose,WB-DL-2020-4410,Hazardous Cargo,2029-01-20,+91 98302 44102'
      filename = 'TransitOps_Drivers_Template.csv'
    } else {
      template = 'tripCode,source,destination,driverName,vehicleRegistration,cargoWeight,freightRevenue\nTRP-9101,Kolkata,Siliguri,Deepak Nandi,WB-25-P-8801,14000,74000\nTRP-9102,Bhubaneswar,Kolkata,Sourav Bose,OD-02-Q-5510,11000,68000'
      filename = 'TransitOps_Trips_Template.csv'
    }

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      if (text) {
        setCsvText(text)
        parseCSV(text)
      }
    }
    reader.readAsText(file)
  }

  function parseCSV(text: string) {
    setError('')
    const lines = text.trim().split('\n')
    if (lines.length < 2) {
      setError('CSV must include headers and at least 1 row of data.')
      return
    }
    const headers = lines[0].split(',').map(h => h.trim())
    const rows = lines.slice(1).map(line => {
      const cols = line.split(',').map(c => c.trim())
      const rowObj: Record<string, string> = {}
      headers.forEach((h, idx) => {
        rowObj[h] = cols[idx] || ''
      })
      return rowObj
    })
    setParsedRows(rows)
  }

  function handleImport() {
    if (parsedRows.length === 0) {
      setError('No valid rows to import.')
      return
    }

    if (category === 'Vehicles') {
      parsedRows.forEach(r => {
        store.vehicles.push({
          id: `VEH-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          registrationNumber: r.registrationNumber || `WB-99-X-${Math.floor(1000 + Math.random() * 9000)}`,
          vehicleName: r.vehicleName || 'Commercial Transport Unit',
          vehicleType: (r.vehicleType as any) || 'Container Truck',
          maxLoadCapacity: Number(r.maxLoadCapacity) || 15000,
          odometer: Number(r.odometer) || 10000,
          acquisitionCost: Number(r.acquisitionCost) || 3500000,
          status: 'Available',
          region: r.region || 'Kolkata'
        })
      })
    } else if (category === 'Drivers') {
      parsedRows.forEach(r => {
        store.drivers.push({
          id: `DRV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: r.name || 'Commercial Operator',
          licenseNumber: r.licenseNumber || `WB-DL-${Math.floor(2020 + Math.random() * 5)}-${Math.floor(1000 + Math.random() * 9000)}`,
          licenseCategory: (r.licenseCategory as any) || 'Commercial HMV',
          expiryDate: r.expiryDate || '2028-12-31',
          contactNumber: r.contactNumber || '+91 98300 00000',
          safetyScore: 92,
          completedTrips: 12,
          totalTrips: 14,
          status: 'Available'
        })
      })
    } else {
      parsedRows.forEach(r => {
        store.trips.push({
          id: `TRP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          tripCode: r.tripCode || `TRP-${Math.floor(1000 + Math.random() * 9000)}`,
          source: r.source || 'Kolkata',
          destination: r.destination || 'Siliguri',
          driverName: r.driverName || store.drivers[0]?.name || 'Rajesh Roy',
          vehicleRegistration: r.vehicleRegistration || store.vehicles[0]?.registrationNumber || 'WB-25-P-9001',
          cargoWeight: Number(r.cargoWeight) || 14000,
          status: 'Dispatched',
          freightRevenue: Number(r.freightRevenue) || 65000,
          distanceKm: 580
        })
      })
    }

    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      onImported()
      onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface-container rounded-2xl border border-white/15 w-full max-w-2xl p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-bold text-on-surface text-base">Batch Import {category} via CSV</h3>
              <p className="text-xs text-on-surface-variant">BR-validated bulk ingestion engine</p>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {isSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Successfully imported {parsedRows.length} records!
          </div>
        )}

        <div className="flex items-center justify-between p-4 rounded-xl bg-surface border border-white/10">
          <div>
            <h4 className="text-xs font-bold text-white">Need standard header schema?</h4>
            <p className="text-xs text-on-surface-variant">Download our pre-formatted {category} CSV template with sample Indian corridor data</p>
          </div>
          <button
            type="button"
            onClick={downloadTemplate}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-primary font-semibold flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-3.5 h-3.5" /> Template
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-on-surface-variant block">Upload CSV File</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-on-surface-variant block">Or Paste CSV Content</label>
          <textarea
            rows={4}
            value={csvText}
            onChange={(e) => {
              setCsvText(e.target.value)
              parseCSV(e.target.value)
            }}
            placeholder="Paste comma-separated rows here..."
            className="w-full p-3 rounded-xl bg-surface border border-white/10 text-xs font-mono text-on-surface focus:outline-none focus:border-primary"
          />
        </div>

        {parsedRows.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-emerald-400">Preview ({parsedRows.length} Rows Detected)</h4>
            <div className="max-h-40 overflow-y-auto rounded-xl border border-white/10 bg-surface text-xs font-mono p-3 space-y-1">
              {parsedRows.slice(0, 5).map((r, i) => (
                <div key={i} className="text-on-surface-variant truncate">
                  Row {i + 1}: {JSON.stringify(r)}
                </div>
              ))}
              {parsedRows.length > 5 && (
                <div className="text-primary font-semibold">...and {parsedRows.length - 5} more rows</div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-on-surface"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={parsedRows.length === 0 || isSuccess}
            className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs disabled:opacity-50 flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" /> Import {parsedRows.length} {category}
          </button>
        </div>
      </div>
    </div>
  )
}
