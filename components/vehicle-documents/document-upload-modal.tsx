'use client'

import React, { useState } from 'react'
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react'
import { VehicleDocument, saveVehicleDocument } from '@/lib/mock/vehicle-documents'
import { store } from '@/lib/mock'

export function DocumentUploadModal({
  isOpen,
  onClose,
  onUploaded
}: {
  isOpen: boolean
  onClose: () => void
  onUploaded: (doc: VehicleDocument) => void
}) {
  const [vehicleId, setVehicleId] = useState('veh-01')
  const [docType, setDocType] = useState<VehicleDocument['documentType']>('Registration Certificate (RC)')
  const [docNumber, setDocNumber] = useState('')
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0])
  const [expiryDate, setExpiryDate] = useState('2027-12-31')
  const [issuingAuthority, setIssuingAuthority] = useState('RTO Kolkata Beltala')
  const [fileName, setFileName] = useState('scanned_document.pdf')
  const [error, setError] = useState('')

  if (!isOpen) return null

  function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!docNumber.trim()) {
      setError('Please provide a valid document number.')
      return
    }

    const veh = store.vehicles.find(v => v.id === vehicleId)
    const vehicleReg = veh ? veh.registrationNumber : 'WB-04-E-1042'

    // Determine status automatically based on expiryDate
    const today = new Date().toISOString().split('T')[0]
    const expDate = new Date(expiryDate)
    const now = new Date()
    const daysLeft = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 3600 * 24))

    let status: 'Active' | 'Expiring Soon' | 'Expired' = 'Active'
    if (expiryDate < today) {
      status = 'Expired'
    } else if (daysLeft <= 30) {
      status = 'Expiring Soon'
    }

    const saved = saveVehicleDocument({
      vehicleId,
      vehicleRegistration: vehicleReg,
      documentType: docType,
      documentNumber: docNumber.trim(),
      issueDate,
      expiryDate,
      issuingAuthority: issuingAuthority.trim() || 'State Transport Authority',
      status,
      fileName
    })

    onUploaded(saved)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface-container rounded-2xl border border-white/15 w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2.5">
            <Upload className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-on-surface text-base">Upload Vehicle Compliance Document</h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleUpload} className="p-6 space-y-4 text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
              Select Fleet Vehicle
            </label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full bg-surface rounded-xl px-3.5 py-2.5 text-on-surface border border-white/10 focus:outline-none focus:border-primary"
            >
              {store.vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.registrationNumber} — {v.vehicleName} ({v.vehicleType})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
              Document Type
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as any)}
              className="w-full bg-surface rounded-xl px-3.5 py-2.5 text-on-surface border border-white/10 focus:outline-none focus:border-primary"
            >
              <option value="Registration Certificate (RC)">Registration Certificate (RC)</option>
              <option value="Insurance">Insurance Policy</option>
              <option value="Pollution Certificate (PUC)">Pollution Certificate (PUC)</option>
              <option value="Fitness Certificate">Fitness Certificate</option>
              <option value="National Permit">National Permit</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
                Document Number
              </label>
              <input
                type="text"
                required
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder="e.g. INS-2026-WB-8811"
                className="w-full bg-surface rounded-xl px-3.5 py-2 text-on-surface border border-white/10 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
                Issuing Authority
              </label>
              <input
                type="text"
                value={issuingAuthority}
                onChange={(e) => setIssuingAuthority(e.target.value)}
                className="w-full bg-surface rounded-xl px-3.5 py-2 text-on-surface border border-white/10 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
                Issue Date
              </label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-surface rounded-xl px-3.5 py-2 text-on-surface border border-white/10 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-surface rounded-xl px-3.5 py-2 text-on-surface border border-white/10 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Mock File Attachment */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase mb-1">
              File Attachment (PDF / PNG / JPG)
            </label>
            <div className="p-4 rounded-xl border border-dashed border-white/20 bg-surface flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <span className="font-mono text-xs block text-on-surface">{fileName}</span>
                  <span className="text-[10px] text-on-surface-variant">Verified Digital Signature (Mock SHA-256)</span>
                </div>
              </div>
              <select
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="bg-white/10 rounded-lg px-2.5 py-1 text-xs text-on-surface border border-white/10"
              >
                <option value="scanned_rc_document.pdf">RC_Book.pdf</option>
                <option value="insurance_policy_commercial.pdf">Insurance_Policy.pdf</option>
                <option value="puc_emission_test.pdf">PUC_Certificate.pdf</option>
                <option value="fitness_inspection_rto.pdf">Fitness_Certificate.pdf</option>
                <option value="national_permit_all_india.pdf">National_Permit.pdf</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-on-surface-variant font-medium text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Document
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
