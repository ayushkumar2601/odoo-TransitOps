'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import {
  AuditLogRecord,
  getStoredAuditLogs
} from '@/lib/mock/audit-logs'
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Download,
  Filter,
  FileText,
  AlertTriangle,
  Info
} from 'lucide-react'

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [severityFilter, setSeverityFilter] = useState<string>('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLogs(getStoredAuditLogs())
  }, [])

  function handleExportJSON() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `TransitOps_Audit_Log_${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const filtered = logs
    .filter(l => categoryFilter === 'All' ? true : l.category === categoryFilter)
    .filter(l => severityFilter === 'All' ? true : l.severity === severityFilter)
    .filter(l => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        l.action.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q) ||
        l.user.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q)
      )
    })

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-1 bg-primary/15 text-primary rounded-full border border-primary/30 uppercase">
                Compliance & Security Feed
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Tamper-Proof Ledger
              </span>
            </div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">
              Enterprise System Audit Log
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Complete chronological audit ledger tracking user actions, BR locks, document uploads, and system automations.
            </p>
          </div>

          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-white/10 border border-white/15 text-white font-bold text-xs flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-primary" />
            Export Audit Feed (JSON)
          </button>
        </div>

        {/* Core KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10">
            <span className="text-xs font-semibold text-on-surface-variant uppercase">Total Audit Events</span>
            <div className="text-3xl font-bold text-on-surface mt-2">{logs.length}</div>
            <div className="text-xs text-on-surface-variant mt-1">Immutable ledger entries</div>
          </div>

          <div
            onClick={() => setSeverityFilter('Critical')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              severityFilter === 'Critical'
                ? 'bg-rose-500/15 border-rose-500/40'
                : 'bg-surface-container-low border-white/10 hover:border-rose-500/30'
            }`}
          >
            <span className="text-xs font-semibold text-rose-400 uppercase">Critical & Lockout Actions</span>
            <div className="text-3xl font-bold text-rose-400 mt-2">
              {logs.filter(l => l.severity === 'Critical').length}
            </div>
            <div className="text-xs text-rose-300 mt-1">BR-004 / BR-012 enforcements</div>
          </div>

          <div
            onClick={() => setCategoryFilter('Dispatch')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              categoryFilter === 'Dispatch'
                ? 'bg-blue-500/15 border-blue-500/40'
                : 'bg-surface-container-low border-white/10 hover:border-blue-500/30'
            }`}
          >
            <span className="text-xs font-semibold text-blue-400 uppercase">Dispatch Actions</span>
            <div className="text-3xl font-bold text-blue-400 mt-2">
              {logs.filter(l => l.category === 'Dispatch').length}
            </div>
            <div className="text-xs text-blue-300 mt-1">Trip assignments & routing</div>
          </div>

          <div
            onClick={() => setCategoryFilter('Asset Mgmt')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              categoryFilter === 'Asset Mgmt'
                ? 'bg-emerald-500/15 border-emerald-500/40'
                : 'bg-surface-container-low border-white/10 hover:border-emerald-500/30'
            }`}
          >
            <span className="text-xs font-semibold text-emerald-400 uppercase">Asset & Document Changes</span>
            <div className="text-3xl font-bold text-emerald-400 mt-2">
              {logs.filter(l => l.category === 'Asset Mgmt').length}
            </div>
            <div className="text-xs text-emerald-300 mt-1">Vehicle registrations & maintenance</div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-white/10 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {(['All', 'Security & BR', 'Dispatch', 'Asset Mgmt', 'System'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  categoryFilter === cat
                    ? 'bg-primary text-on-primary'
                    : 'bg-white/5 hover:bg-white/10 text-on-surface-variant'
                }`}
              >
                {cat}
              </button>
            ))}

            <div className="h-4 w-px bg-white/10 mx-1" />

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-surface rounded-xl px-3 py-1.5 text-xs text-on-surface border border-white/10 focus:outline-none focus:border-primary"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical Only</option>
              <option value="Warning">Warning Only</option>
              <option value="Info">Info Only</option>
            </select>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search action, user, details..."
              className="w-full bg-surface rounded-xl pl-10 pr-4 py-2 text-xs text-on-surface border border-white/10 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-surface-container-low border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs font-semibold text-on-surface-variant uppercase">
                  <th className="p-4">Audit ID</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">User & Role</th>
                  <th className="p-4">Action & Category</th>
                  <th className="p-4">Detailed Description</th>
                  <th className="p-4 text-right">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filtered.map(log => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono font-bold text-xs text-primary">
                      {log.id}
                    </td>
                    <td className="p-4 font-mono text-xs text-on-surface-variant">
                      {log.timestamp}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white text-xs">{log.user}</div>
                      <div className="text-[11px] text-on-surface-variant">{log.role}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-on-surface">{log.action}</div>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/5 text-on-surface-variant mt-1 inline-block border border-white/10">
                        {log.category}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-on-surface-variant max-w-md leading-relaxed">
                      {log.details}
                    </td>
                    <td className="p-4 text-right">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase border inline-flex items-center gap-1 ${
                          log.severity === 'Critical'
                            ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                            : log.severity === 'Warning'
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
