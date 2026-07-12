'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import {
  EmailReminderRecord,
  getStoredEmailReminders,
  logEmailReminder
} from '@/lib/mock/email-reminders'
import {
  Mail,
  Send,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Search,
  ShieldCheck,
  X,
  Calendar,
  User,
  Truck
} from 'lucide-react'

export default function EmailsPage() {
  const [reminders, setReminders] = useState<EmailReminderRecord[]>([])
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'License Expiry' | 'Document Expiry' | 'Maintenance Due'>('All')
  const [search, setSearch] = useState('')
  const [previewItem, setPreviewItem] = useState<EmailReminderRecord | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [toast, setToast] = useState('')

  function loadEmails() {
    setReminders(getStoredEmailReminders())
  }

  useEffect(() => {
    loadEmails()
  }, [])

  function handleTriggerTestReminder(cat: 'License Expiry' | 'Document Expiry' | 'Maintenance Due') {
    setIsSending(true)
    setTimeout(() => {
      let subject = ''
      let recipient = 'safety@transitops.io'
      let bodyPreview = ''
      let target = ''

      if (cat === 'License Expiry') {
        subject = 'Driver License Expiry Notice — Arindam Sen (Immediate BR-004 Enforcement)'
        recipient = 'safety@transitops.io'
        bodyPreview = 'Driver license expired. Automated BR-004 lockout active.'
        target = 'Arindam Sen'
      } else if (cat === 'Document Expiry') {
        subject = 'Vehicle Document Expiry Alert — WB-04-E-1042 (Pollution Certificate - PUC)'
        recipient = 'fleet@transitops.io'
        bodyPreview = 'PUC Certificate expired. Scheduled for RTO emission testing.'
        target = 'WB-04-E-1042'
      } else {
        subject = 'Vehicle Maintenance Due — WB-23-A-7741 (Scheduled Service Required)'
        recipient = 'fleet@transitops.io'
        bodyPreview = 'Vehicle odometer reached maintenance threshold under BR-012.'
        target = 'WB-23-A-7741'
      }

      const rec = logEmailReminder({
        recipient,
        subject,
        category: cat,
        status: 'Delivered (Demo Preview)',
        bodyPreview,
        targetAssetOrPerson: target
      })

      loadEmails()
      setIsSending(false)
      setToast(`Dispatched reminder: ${subject}`)
      setTimeout(() => setToast(''), 4000)
    }, 600)
  }

  const filtered = reminders
    .filter(r => categoryFilter === 'All' ? true : r.category === categoryFilter)
    .filter(r => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        r.recipient.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q) ||
        r.targetAssetOrPerson.toLowerCase().includes(q)
      )
    })

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-500 text-on-primary font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            {toast}
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-1 bg-primary/15 text-primary rounded-full border border-primary/30 uppercase">
                Outbound Reminder System
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Nodemailer SMTP + Preview Mode
              </span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">
              Email Reminder System & Preview Center
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Live audit feed and preview center for outbound compliance reminders (License Expiry, Document Expiry, Maintenance Due).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={isSending}
              onClick={() => handleTriggerTestReminder('License Expiry')}
              className="px-3.5 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              Send License Reminder
            </button>
            <button
              disabled={isSending}
              onClick={() => handleTriggerTestReminder('Document Expiry')}
              className="px-3.5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              Send Document Alert
            </button>
          </div>
        </div>

        {/* Core KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Total Reminders Logged</span>
            <div className="text-3xl font-bold text-on-surface mt-2">{reminders.length}</div>
            <div className="text-xs text-on-surface-variant mt-1">Stored in persistent audit queue</div>
          </div>

          <div
            onClick={() => setCategoryFilter('License Expiry')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              categoryFilter === 'License Expiry'
                ? 'bg-rose-500/15 border-rose-500/40'
                : 'bg-surface-container-low border-white/10 hover:border-rose-500/30'
            }`}
          >
            <span className="text-xs font-semibold text-rose-400 uppercase">License Expiry Notices</span>
            <div className="text-3xl font-bold text-rose-400 mt-2">
              {reminders.filter(r => r.category === 'License Expiry').length}
            </div>
            <div className="text-xs text-rose-300 mt-1">BR-004 Lockout governance</div>
          </div>

          <div
            onClick={() => setCategoryFilter('Document Expiry')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              categoryFilter === 'Document Expiry'
                ? 'bg-amber-500/15 border-amber-500/40'
                : 'bg-surface-container-low border-white/10 hover:border-amber-500/30'
            }`}
          >
            <span className="text-xs font-semibold text-amber-400 uppercase">Document Expiry Alerts</span>
            <div className="text-3xl font-bold text-amber-400 mt-2">
              {reminders.filter(r => r.category === 'Document Expiry').length}
            </div>
            <div className="text-xs text-amber-300 mt-1">RC, Insurance, PUC, Permit alerts</div>
          </div>

          <div
            onClick={() => setCategoryFilter('Maintenance Due')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              categoryFilter === 'Maintenance Due'
                ? 'bg-blue-500/15 border-blue-500/40'
                : 'bg-surface-container-low border-white/10 hover:border-blue-500/30'
            }`}
          >
            <span className="text-xs font-semibold text-blue-400 uppercase">Maintenance Reminders</span>
            <div className="text-3xl font-bold text-blue-400 mt-2">
              {reminders.filter(r => r.category === 'Maintenance Due').length}
            </div>
            <div className="text-xs text-blue-300 mt-1">BR-012 workshop service notices</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-white/10 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {(['All', 'License Expiry', 'Document Expiry', 'Maintenance Due'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setCategoryFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  categoryFilter === tab
                    ? 'bg-primary text-on-primary'
                    : 'bg-white/5 hover:bg-white/10 text-on-surface-variant'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipient, subject, asset..."
              className="w-full bg-surface rounded-xl pl-10 pr-4 py-2 text-xs text-on-surface border border-white/10 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Email Reminders Table */}
        <div className="rounded-2xl bg-surface-container-low border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs font-semibold text-on-surface-variant uppercase">
                  <th className="p-4">Recipient Email</th>
                  <th className="p-4">Subject / Target Entity</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Delivery Status</th>
                  <th className="p-4 text-right">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-xs text-primary font-bold">
                      {item.recipient}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">{item.subject}</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">
                        Target: <span className="text-amber-300 font-semibold">{item.targetAssetOrPerson}</span> — {item.bodyPreview}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                          item.category === 'License Expiry'
                            ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                            : item.category === 'Document Expiry'
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-on-surface-variant">
                      {item.timestamp}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setPreviewItem(item)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white font-semibold border border-white/10 flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5 text-primary" /> Inspect Email
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Full HTML Email Preview Modal */}
        {previewItem && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-surface-container rounded-2xl border border-white/15 w-full max-w-xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-bold text-on-surface text-base">Outbound Email Preview</h3>
                    <span className="text-[11px] text-emerald-400 font-mono">Status: {previewItem.status}</span>
                  </div>
                </div>
                <button onClick={() => setPreviewItem(null)} className="text-on-surface-variant hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Rendered HTML Mockup Frame */}
              <div className="p-6 bg-[#0f172a]">
                <div className="border border-white/15 rounded-xl overflow-hidden bg-white text-slate-800 shadow-2xl text-sm">
                  {/* Header */}
                  <div className="bg-[#1e1b4b] p-5 text-white flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-base">TransitOps Operations Compliance Notice</h4>
                      <span className="text-xs text-purple-300">Automated Enterprise Fleet Notification</span>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-white">BR Governance</span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="border-b border-slate-200 pb-3 text-xs space-y-1 text-slate-500">
                      <div><strong>To:</strong> <span className="text-slate-900 font-mono">{previewItem.recipient}</span></div>
                      <div><strong>From:</strong> <span className="text-slate-900 font-mono">alerts@transitops.io (Nodemailer Service)</span></div>
                      <div><strong>Subject:</strong> <span className="text-slate-900 font-bold">{previewItem.subject}</span></div>
                      <div><strong>Timestamp:</strong> {previewItem.timestamp}</div>
                    </div>

                    <div className="space-y-3 leading-relaxed">
                      <p>Dear Operations Controller,</p>
                      <p>
                        This is an official automated notification regarding asset/driver compliance under TransitOps Eastern India operations.
                      </p>

                      <div className="p-4 rounded-lg bg-slate-100 border-l-4 border-red-600 space-y-1">
                        <div className="font-bold text-slate-900">Entity: {previewItem.targetAssetOrPerson}</div>
                        <div className="text-slate-700">{previewItem.bodyPreview}</div>
                      </div>

                      <p className="text-xs text-slate-600">
                        Please review the compliance registry or workshop portal to perform the required restitution action.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-200 text-center text-[11px] text-slate-400">
                      TransitOps Smart Transport Operations Platform • Automated SMTP Service
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end p-4 border-t border-white/10 bg-surface">
                <button
                  onClick={() => setPreviewItem(null)}
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs"
                >
                  Close Email Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
