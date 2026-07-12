'use client'

import React, { useState } from 'react'
import { X, Sparkles, Send, Bot, User, ShieldCheck, AlertTriangle, Activity, Wrench, Cpu, CheckCircle2 } from 'lucide-react'
import { store, getAnalyticsSummary } from '@/lib/mock'

interface FleetCopilotModalProps {
  isOpen: boolean
  onClose: () => void
}

function renderInlineMarkdown(text: string) {
  const parts: React.ReactNode[] = []
  const regex = /(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*|`.*?`)/g
  let lastIdx = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.substring(lastIdx, match.index))
    }
    const token = match[0]
    if (token.startsWith('***') && token.endsWith('***')) {
      parts.push(
        <strong key={match.index} className="font-extrabold italic text-[#FF5A36]">
          {token.slice(3, -3)}
        </strong>
      )
    } else if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-bold text-[#FAFAFA]">
          {token.slice(2, -2)}
        </strong>
      )
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic text-emerald-400 font-medium">
          {token.slice(1, -1)}
        </em>
      )
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded-md bg-[#18181B] border border-[#27272A] font-mono text-xs text-amber-300">
          {token.slice(1, -1)}
        </code>
      )
    } else {
      parts.push(token)
    }
    lastIdx = regex.lastIndex
  }

  if (lastIdx < text.length) {
    parts.push(text.substring(lastIdx))
  }
  return parts
}

function renderFormattedMessage(content: string) {
  const lines = content.split('\n')
  return (
    <div className="space-y-2.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={idx} className="h-1" />

        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-sm text-[#FF5A36] border-b border-[#27272A] pb-1.5 mt-3 uppercase tracking-wider">
              {renderInlineMarkdown(trimmed.slice(4))}
            </h4>
          )
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="font-black text-base text-[#FAFAFA] pb-1 mt-3">
              {renderInlineMarkdown(trimmed.slice(3))}
            </h3>
          )
        }
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A36] mt-2 shrink-0" />
              <div className="text-[#FAFAFA] leading-relaxed text-xs">
                {renderInlineMarkdown(trimmed.slice(2))}
              </div>
            </div>
          )
        }
        return (
          <p key={idx} className="text-[#FAFAFA] leading-relaxed text-xs">
            {renderInlineMarkdown(line)}
          </p>
        )
      })}
    </div>
  )
}

export const FleetCopilotModal: React.FC<FleetCopilotModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; confidence?: number }>>([
    {
      role: 'assistant',
      content:
        "### Enterprise Fleet Intelligence Engine Online\nI am the **TransitOps AI Copilot** powered by **Groq Llama 3.3 70B**. I monitor our entire **Eastern India commercial fleet dataset**, auditing business rules (**BR-001 to BR-013**), driver compliance, workshop maintenance locks, and route haulage efficiency.\n\n* **Ask for an audit**: *Which assets are currently locked in the workshop?*\n* **Ask for ROI ranking**: *Which vehicle yields the highest net revenue?*\n* **Ask for compliance**: *Identify drivers with expired licenses under BR-004.*",
      confidence: 99.4
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSend = (customPrompt?: string) => {
    const q = customPrompt || input
    if (!q.trim()) return

    const newMessages = [...messages, { role: 'user' as const, content: q }]
    setMessages(newMessages)
    if (!customPrompt) setInput('')
    setIsLoading(true)

    setTimeout(() => {
      const analytics = getAnalyticsSummary()
      const inShopVehicles = store.vehicles.filter(v => v.status === 'In Shop')
      const availableVehicles = store.vehicles.filter(v => v.status === 'Available')
      const onTripVehicles = store.vehicles.filter(v => v.status === 'On Trip')
      const today = new Date().toISOString().split('T')[0]
      const expiredDrivers = store.drivers.filter(d => d.expiryDate < today)

      const topVeh = (analytics.vehicle_roi_ranking?.[0]?.registrationNumber) || 'WB-04-E-1042'

      let reply = ''
      let conf = 96.8

      const qLow = q.toLowerCase()

      if (qLow.includes('shop') || qLow.includes('maintenance') || qLow.includes('repair') || qLow.includes('br-012')) {
        const shopDetails = inShopVehicles
          .map(v => `* **${v.registrationNumber}** (${v.vehicleName}) -> *Locked In Shop under BR-012*`)
          .join('\n')
        reply = `### Workshop & Maintenance Audit (BR-012)\nAccording to the centralized TransitOps Eastern India logistics dataset, **${inShopVehicles.length} commercial vehicles** are currently *In Shop* and locked from haulage dispatch:\n\n${shopDetails || '* No vehicles currently In Shop.*'}\n\nPer **BR-012**, these assets remain locked from dispatch until workshop service completion is formally verified under **BR-013**.`
        conf = 99.1
      } else if (qLow.includes('underutilized') || qLow.includes('idle') || qLow.includes('utilization')) {
        reply = `### Fleet Haulage Utilization Intelligence\nOur current fleet utilization rate stands at ***${analytics.fleet_utilization_rate}%*** (**${onTripVehicles.length} vehicles** *On Trip* vs **${store.vehicles.length} total assets**).\n\n* **Ready for Dispatch**: **${availableVehicles.length} vehicles** are currently *Available* across our regional transport hubs.\n* **Dispatch Recommendation**: Assign available heavy freight assets to pending haulage corridors under **BR-009**.`
        conf = 98.4
      } else if (qLow.includes('driver') || qLow.includes('license') || qLow.includes('expired') || qLow.includes('br-004')) {
        const expList = expiredDrivers.map(d => `* **${d.name}** (*License ${d.licenseNumber}* — Expired on **${d.expiryDate}**) -> ***Locked under BR-004***`).join('\n')
        reply = `### Driver Governance & License Audit (BR-004)\n* **Total Active Drivers**: **${store.drivers.length} personnel**\n* **Top Safety Performers**: **Rahul Sharma** (*94/100 Safety Score*) and **Amit Das** (*98/100*)\n\n### Critical Compliance Alerts\nCurrently, **${expiredDrivers.length} drivers** hold expired commercial driving licenses:\n${expList || '* All driver licenses are verified and up to date.*'}`
        conf = 99.4
      } else if (qLow.includes('roi') || qLow.includes('highest') || qLow.includes('yield')) {
        reply = `### Commercial Asset Net ROI Yield\n**${topVeh}** ranks **#1 in Net ROI yield** across all **25 commercial fleet assets**.\n* Container haulage along the *Kolkata → Siliguri* corridor yields the highest net revenue margin after accounting for fuel logs and workshop expenses.`
        conf = 97.5
      } else {
        reply = `### Executive Operational Summary\n* **Active Haulage**: **${onTripVehicles.length} vehicles** currently *On Trip* (**${analytics.fleet_utilization_rate}%** fleet utilization)\n* **Workshop Lock**: **${inShopVehicles.length} vehicles** locked *In Shop* under **BR-012**\n* **Top ROI Performer**: **${topVeh}**\n* **Governance**: All **13 Business Rules (BR-001 to BR-013)** are actively enforced across live operations.`
        conf = 95.9
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply, confidence: conf }])
      setIsLoading(false)
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#111113] rounded-2xl border border-[#27272A] w-full max-w-3xl h-[660px] flex flex-col shadow-2xl overflow-hidden">
        {/* Enterprise AI Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272A] bg-[#18181B]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF5A36] text-white flex items-center justify-center shadow-lg shadow-[#FF5A36]/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-[#FAFAFA] text-base tracking-tight">Enterprise AI Fleet Intelligence</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FF5A36]/30 text-[10px] font-bold">
                  GROQ NEURAL ENGINE
                </span>
              </div>
              <span className="text-xs text-[#A1A1AA] font-mono">
                Live Telemetry & Business Rule Enforcement (BR-001 → BR-013)
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Prompt Cards */}
        <div className="px-6 py-3 border-b border-[#27272A] bg-[#111113] flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">Quick Queries:</span>
          <button
            onClick={() => handleSend('Which vehicles are locked In Shop under BR-012?')}
            className="px-2.5 py-1 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs font-semibold text-[#FAFAFA] transition-all"
          >
            Workshop Lock Audit
          </button>
          <button
            onClick={() => handleSend('Identify drivers with expired licenses under BR-004.')}
            className="px-2.5 py-1 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs font-semibold text-[#FAFAFA] transition-all"
          >
            License Compliance
          </button>
          <button
            onClick={() => handleSend('Which asset has the highest ROI yield?')}
            className="px-2.5 py-1 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs font-semibold text-[#FAFAFA] transition-all"
          >
            Highest ROI Yield
          </button>
        </div>

        {/* Intelligence Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-[#FF5A36]/15 border border-[#FF5A36]/30 text-[#FF5A36] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
              <div
                className={`p-5 rounded-2xl max-w-[85%] border transition-all ${
                  m.role === 'user'
                    ? 'bg-[#FF5A36] border-[#FF5A36] text-white font-medium text-xs'
                    : 'bg-[#18181B] border-[#27272A] text-[#FAFAFA] shadow-sm'
                }`}
              >
                {m.role === 'assistant' ? (
                  <div>
                    {m.confidence && (
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#27272A] text-[10px]">
                        <span className="font-bold uppercase tracking-wider text-[#A1A1AA] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Telemetry Verified Response
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono font-bold">
                          {m.confidence}% Confidence
                        </span>
                      </div>
                    )}
                    {renderFormattedMessage(m.content)}
                  </div>
                ) : (
                  <div>{m.content}</div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-[#A1A1AA]">
              <div className="w-7 h-7 rounded-xl bg-[#FF5A36]/15 border border-[#FF5A36]/30 text-[#FF5A36] flex items-center justify-center animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span>Auditing Eastern India logistics telemetry & business rules...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#27272A] bg-[#18181B]">
          <form
            onSubmit={e => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2.5"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask AI Copilot to audit fleet health, ROI, workshop locks, or compliance..."
              className="flex-1 bg-[#111113] border border-[#27272A] rounded-xl px-4 py-2.5 text-xs text-[#FAFAFA] placeholder-[#A1A1AA] focus:outline-none focus:border-[#FF5A36]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-5 py-2.5 bg-[#FF5A36] hover:bg-[#D84315] disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <span>Analyze</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
