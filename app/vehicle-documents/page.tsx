'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import {
  VehicleDocument,
  getStoredVehicleDocuments,
  deleteVehicleDocument
} from '@/lib/mock/vehicle-documents'
import { DocumentUploadModal } from '@/components/vehicle-documents/document-upload-modal'
import {
  FileText,
  Upload,
  Search,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Eye,
  Calendar,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react'

export default function VehicleDocumentsPage() {
  const [documents, setDocuments] = useState<VehicleDocument[]>([])
  const [statusFilter, setStatusFilter] = useState<'All' | 'Expiring Soon' | 'Expired' | 'Active'>('All')
  const [typeFilter, setTypeFilter] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<VehicleDocument | null>(null)
  const [sortField, setSortField] = useState<'expiryDate' | 'vehicleRegistration' | 'documentType'>('expiryDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  function loadDocs() {
    setDocuments(getStoredVehicleDocuments())
  }

  useEffect(() => {
    loadDocs()
  }, [])

  function handleDelete(id: string) {
    if (confirm('Are you sure you want to remove this compliance document record?')) {
      deleteVehicleDocument(id)
      loadDocs()
    }
  }

  function handleSort(field: 'expiryDate' | 'vehicleRegistration' | 'documentType') {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const expiredCount = documents.filter(d => d.status === 'Expired').length
  const expiringSoonCount = documents.filter(d => d.status === 'Expiring Soon').length
  const activeCount = documents.filter(d => d.status === 'Active').length

  const filtered = documents
    .filter(doc => statusFilter === 'All' ? true : doc.status === statusFilter)
    .filter(doc => typeFilter === 'All' ? true : doc.documentType === typeFilter)
    .filter(doc => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        doc.vehicleRegistration.toLowerCase().includes(q) ||
        doc.documentNumber.toLowerCase().includes(q) ||
        doc.documentType.toLowerCase().includes(q) ||
        doc.issuingAuthority.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      const valA = a[sortField]
      const valB = b[sortField]
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <main className="flex-1 md:ml-60 p-6 md:p-8 overflow-y-auto">
        {/* Top Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-1 bg-primary/15 text-primary rounded-full border border-primary/30 uppercase">
                Compliance & Asset Registry
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Phase 1.6 Odoo PRD
              </span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">
              Vehicle Document Management
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Complete lifecycle governance across RC, Insurance, PUC, Fitness Certificates, and National Permits.
            </p>
          </div>

          <button
            onClick={() => setShowUpload(true)}
            className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>

        {/* Core KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Total Documents</span>
            <div className="text-3xl font-bold text-on-surface mt-2">{documents.length}</div>
            <div className="text-xs text-on-surface-variant mt-1">Managed across 25 Commercial Assets</div>
          </div>

          <div
            onClick={() => setStatusFilter('Expired')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              statusFilter === 'Expired'
                ? 'bg-rose-500/15 border-rose-500/40'
                : 'bg-surface-container-low border-white/10 hover:border-rose-500/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-400 uppercase">Expired Documents</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-3xl font-bold text-rose-400 mt-2">{expiredCount}</div>
            <div className="text-xs text-rose-300 mt-1">Requires immediate RTO renewal</div>
          </div>

          <div
            onClick={() => setStatusFilter('Expiring Soon')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              statusFilter === 'Expiring Soon'
                ? 'bg-amber-500/15 border-amber-500/40'
                : 'bg-surface-container-low border-white/10 hover:border-amber-500/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400 uppercase">Expiring Within 30 Days</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-amber-400 mt-2">{expiringSoonCount}</div>
            <div className="text-xs text-amber-300 mt-1">Automated alert active</div>
          </div>

          <div
            onClick={() => setStatusFilter('Active')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              statusFilter === 'Active'
                ? 'bg-emerald-500/15 border-emerald-500/40'
                : 'bg-surface-container-low border-white/10 hover:border-emerald-500/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 uppercase">Active Compliance</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-emerald-400 mt-2">{activeCount}</div>
            <div className="text-xs text-emerald-300 mt-1">Verified compliance status</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-white/10 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {(['All', 'Expired', 'Expiring Soon', 'Active'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  statusFilter === tab
                    ? 'bg-primary text-on-primary'
                    : 'bg-white/5 hover:bg-white/10 text-on-surface-variant'
                }`}
              >
                {tab}
              </button>
            ))}

            <div className="h-4 w-px bg-white/10 mx-1" />

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-surface rounded-xl px-3 py-1.5 text-xs text-on-surface border border-white/10 focus:outline-none focus:border-primary"
            >
              <option value="All">All Document Types</option>
              <option value="Registration Certificate (RC)">Registration Certificate (RC)</option>
              <option value="Insurance">Insurance</option>
              <option value="Pollution Certificate (PUC)">Pollution Certificate (PUC)</option>
              <option value="Fitness Certificate">Fitness Certificate</option>
              <option value="National Permit">National Permit</option>
            </select>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search registration, doc #, RTO..."
              className="w-full bg-surface rounded-xl pl-10 pr-4 py-2 text-xs text-on-surface border border-white/10 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Documents Table */}
        <div className="rounded-2xl bg-surface-container-low border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs font-semibold text-on-surface-variant uppercase">
                  <th
                    onClick={() => handleSort('vehicleRegistration')}
                    className="p-4 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      Vehicle Asset <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('documentType')}
                    className="p-4 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      Document Type <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="p-4">Document Number</th>
                  <th
                    onClick={() => handleSort('expiryDate')}
                    className="p-4 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      Expiry Date <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="p-4">Issuing Authority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filtered.map(doc => (
                  <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">
                      {doc.vehicleRegistration}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-on-surface">{doc.documentType}</div>
                      <div className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <FileText className="w-3 h-3 text-primary" /> {doc.fileName}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-on-surface-variant">
                      {doc.documentNumber}
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-xs">{doc.expiryDate}</div>
                      <div className="text-[11px] text-on-surface-variant">Issued: {doc.issueDate}</div>
                    </td>
                    <td className="p-4 text-xs text-on-surface-variant">
                      {doc.issuingAuthority}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                          doc.status === 'Expired'
                            ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                            : doc.status === 'Expiring Soon'
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-on-surface font-medium border border-white/10"
                      >
                        <Eye className="w-3.5 h-3.5 inline mr-1" /> Preview
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload Modal */}
        <DocumentUploadModal
          isOpen={showUpload}
          onClose={() => setShowUpload(false)}
          onUploaded={() => loadDocs()}
        />

        {/* Preview Modal */}
        {previewDoc && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-surface-container rounded-2xl border border-white/15 w-full max-w-md p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-on-surface">Document Details</h3>
                <span className="font-mono text-xs text-primary font-bold">{previewDoc.vehicleRegistration}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div><span className="text-on-surface-variant text-xs block">Document Type</span><strong className="text-white">{previewDoc.documentType}</strong></div>
                <div><span className="text-on-surface-variant text-xs block">Document Number</span><span className="font-mono">{previewDoc.documentNumber}</span></div>
                <div><span className="text-on-surface-variant text-xs block">Issuing Authority</span>{previewDoc.issuingAuthority}</div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div><span className="text-on-surface-variant text-xs block">Issue Date</span>{previewDoc.issueDate}</div>
                  <div><span className="text-on-surface-variant text-xs block">Expiry Date</span>{previewDoc.expiryDate}</div>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <span className="text-on-surface-variant text-xs block mb-1">Attached Digital Scan</span>
                  <div className="p-3 rounded-xl bg-surface border border-white/10 font-mono text-xs text-emerald-400 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> {previewDoc.fileName} (SHA-256 Verified)
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-3">
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
