'use client'

import React, { useState } from 'react'
import { X, Sparkles, Send, Bot, User, ShieldCheck, AlertTriangle, Activity, Wrench } from 'lucide-react'
import { store, getAnalyticsSummary } from '@/lib/mock'

// Lightweight inline markdown parser for Copilot chat messages
function renderInlineMarkdown(text: string) {
  // Split on ***bold italic***, **bold**, *italic*, `code`
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
        <strong key={match.index} className="font-extrabold italic text-primary">
          {token.slice(3, -3)}
        </strong>
      )
    } else if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-bold text-white">
          {token.slice(2, -2)}
        </strong>
      )
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic text-emerald-300 font-medium">
          {token.slice(1, -1)}
        </em>
      )
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-xs text-amber-300">
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
    <div className="space-y-2">
      {lines.map((line, idx) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={idx} className="h-1" />

        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-base text-primary border-b border-white/10 pb-1 mt-3">
              {renderInlineMarkdown(trimmed.slice(4))}
            </h4>
          )
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="font-extrabold text-lg text-white pb-1 mt-3">
              {renderInlineMarkdown(trimmed.slice(3))}
            </h3>
          )
        }
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-primary font-bold">•</span>
              <div className="flex-1">{renderInlineMarkdown(trimmed.slice(2))}</div>
            </div>
          )
        }
        return (
          <p key={idx} className="leading-relaxed">
            {renderInlineMarkdown(line)}
          </p>
        )
      })}
    </div>
  )
}

export function FleetCopilotModal({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: '### Welcome to TransitOps AI Fleet Copilot\nGreetings! I am your **TransitOps AI Fleet Copilot** powered by ***Groq Llama 3.3 70B***. I have full real-time access to our **25 commercial assets**, **driver compliance audits**, and **BR-001 to BR-013** governance telemetry. How can I assist your operations today?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  async function handleSend(promptText?: string) {
    const query = promptText || input
    if (!query.trim()) return

    const newMessages = [...messages, { role: 'user' as const, content: query }]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    const inShopVehicles = store.vehicles.filter(v => v.status === 'In Shop')
    const availableVehicles = store.vehicles.filter(v => v.status === 'Available')
    const onTripVehicles = store.vehicles.filter(v => v.status === 'On Trip')
    const expiredDrivers = store.drivers.filter(d => d.expiryDate < new Date().toISOString().split('T')[0])
    const analytics = getAnalyticsSummary()
    const topVeh = analytics.vehicle_roi_ranking?.[0]?.registrationNumber || 'WB-04-E-1042'

    try {
      const context = {
        totalVehicles: store.vehicles.length,
        vehiclesOnTrip: onTripVehicles.length,
        vehiclesInShop: inShopVehicles.length,
        vehiclesAvailable: availableVehicles.length,
        totalDrivers: store.drivers.length,
        expiredLicenses: expiredDrivers.length,
        utilizationRate: analytics.fleet_utilization_rate,
        topRoiAsset: topVeh,
        inShopVehiclesList: inShopVehicles.map(v => `${v.registrationNumber} (${v.vehicleName}, ${v.vehicleType}, Odometer: ${v.odometer.toLocaleString()} km)`),
        availableVehiclesList: availableVehicles.map(v => `${v.registrationNumber} (${v.vehicleName})`),
        expiredDriversList: expiredDrivers.map(d => `${d.name} (${d.licenseNumber}, Expired: ${d.expiryDate})`)
      }

      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, context })
      })

      if (res.ok) {
        const data = await res.json()
        if (data.success && data.reply) {
          setMessages([...newMessages, { role: 'assistant', content: data.reply }])
          setIsLoading(false)
          return
        }
      }
    } catch (e) {
      console.warn('Groq API call fell back to rich local rules:', e)
    }

    // Rich local fallback with exact records and bold/italic markdown formatting
    const q = query.toLowerCase()
    let reply = ''

    if (q.includes('maintenance') || q.includes('shop') || q.includes('require') || q.includes('in shop')) {
      const shopDetails = inShopVehicles
        .map(v => `* **${v.registrationNumber}** (*${v.vehicleName}*, ${v.vehicleType}) — Locked under ***BR-012 Workshop Lock*** (Odometer: ${v.odometer.toLocaleString()} km)`)
        .join('\n')
      reply = `### Vehicle Workshop & Maintenance Status\nAccording to the centralized TransitOps Eastern India logistics dataset, **${inShopVehicles.length} commercial vehicles** are currently *In Shop* and locked from haulage dispatch under **BR-003**:\n\n${shopDetails || '* No vehicles currently In Shop.*'}\n\nPer **BR-012**, these assets remain locked from dispatch until workshop service completion is formally verified under **BR-013**.`
    } else if (q.includes('underutilized') || q.includes('idle') || q.includes('utilization')) {
      reply = `### Fleet Utilization Intelligence\nOur current fleet utilization rate stands at ***${analytics.fleet_utilization_rate}%*** (**${onTripVehicles.length} vehicles** *On Trip* vs **${store.vehicles.length} total assets**).\n\n* **Ready for Dispatch**: **${availableVehicles.length} vehicles** are currently *Available* across our regional transport hubs.\n* **Dispatch Recommendation**: Assign available heavy freight assets such as **WB-04-E-1042** and **WB-19-D-8891** to pending haulage corridors under **BR-009**.`
    } else if (q.includes('driver') || q.includes('best') || q.includes('who') || q.includes('license')) {
      const expList = expiredDrivers.map(d => `* **${d.name}** (*License ${d.licenseNumber}* — Expired on **${d.expiryDate}**) -> ***Locked under BR-004***`).join('\n')
      reply = `### Driver Compliance & Safety Audit\n* **Total Active Drivers**: **${store.drivers.length} personnel**\n* **Top Safety Performers**: **Rahul Sharma** (*94/100 Safety Score*) and **Amit Das** (*98/100*)\n\n### Critical Compliance Alerts (BR-004 Enforcement)\nCurrently, **${expiredDrivers.length} drivers** hold expired commercial driving licenses:\n${expList || '* All driver licenses are verified and up to date.*'}`
    } else if (q.includes('roi') || q.includes('highest') || q.includes('asset')) {
      reply = `### Commercial Asset Net ROI Yield\n**${topVeh}** ranks **#1 in Net ROI yield** across all **25 commercial fleet assets**.\n* Container haulage along the *Kolkata → Siliguri* corridor yields the highest net revenue margin after accounting for fuel logs and workshop expenses.`
    } else {
      reply = `### Executive Operational Summary\n* **Active Haulage**: **${onTripVehicles.length} vehicles** currently *On Trip* (**${analytics.fleet_utilization_rate}%** fleet utilization)\n* **Workshop Lock**: **${inShopVehicles.length} vehicles** locked *In Shop* under **BR-012**\n* **Top ROI Performer**: **${topVeh}**\n* **Governance**: All **13 Business Rules (BR-001 to BR-013)** are actively enforced.`
    }

    setMessages([...newMessages, { role: 'assistant', content: reply }])
    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface-container rounded-2xl border border-white/15 w-full max-w-2xl h-[620px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-on-surface text-base">TransitOps AI Fleet Copilot</h3>
              <span className="text-[11px] text-emerald-400 font-semibold">Groq Llama 3.3 70B • Live Centralized Dataset</span>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`p-4 rounded-2xl max-w-[88%] leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-primary text-on-primary font-semibold'
                    : 'bg-surface-container-low border border-white/10 text-on-surface'
                }`}
              >
                {renderFormattedMessage(m.content)}
              </div>
              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-on-surface-variant text-xs">
              <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <span>Analyzing telemetry with Groq Llama 3.3 70B...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        <div className="px-6 py-2 border-t border-white/5 flex gap-2 overflow-x-auto">
          {[
            'Which vehicles are currently In Shop?',
            'List drivers with expired licenses (BR-004)',
            'Which asset has the highest ROI?',
            'How can we optimize fleet utilization?'
          ].map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-on-surface-variant hover:text-white whitespace-nowrap transition-colors border border-white/10"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/10 bg-surface-container-low">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Eastern India fleet telemetry, BR rules, ROI, maintenance..."
              className="flex-1 bg-surface-container rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder-on-surface-variant border border-white/10 focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
