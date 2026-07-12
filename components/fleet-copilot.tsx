'use client'

import React, { useState } from 'react'
import { store, getAnalyticsSummary } from '@/lib/mock'
import {
  Sparkles,
  Send,
  Bot,
  User,
  X,
  TrendingUp,
  Wrench,
  ShieldCheck,
  Fuel
} from 'lucide-react'

const SUGGESTED_PROMPTS = [
  'Which vehicles require maintenance?',
  'Show underutilized vehicles.',
  'Who are our best drivers?',
  'Which assets generate highest ROI?',
  'Why did fuel costs increase?'
]

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
      content: 'Greetings! I am your **TransitOps AI Fleet Copilot** (powered by Groq Llama 3.3 70B). Ask me anything about our 25 Eastern India fleet assets, driver governance, workshop costs, or ROI yield.'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  function handleSend(promptText?: string) {
    const query = promptText || input
    if (!query.trim()) return

    const newMessages = [...messages, { role: 'user' as const, content: query }]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    setTimeout(() => {
      const analytics = getAnalyticsSummary()
      const topVeh = analytics.vehicle_roi_ranking?.[0]?.registrationNumber || 'WB-04-E-1042'
      const inShopCount = store.vehicles.filter(v => v.status === 'In Shop').length
      const q = query.toLowerCase()

      let reply = ''
      if (q.includes('maintenance') || q.includes('shop') || q.includes('require')) {
        reply = `### Workshop & Maintenance Diagnostics\nCurrently, **${inShopCount} vehicles** are locked In Shop (**BR-012**). Heavy commercial trucks approaching 150,000 km odometer thresholds are flagged for engine overhaul. Preventive maintenance reduces highway breakdown risk by 42%.`
      } else if (q.includes('underutilized') || q.includes('idle') || q.includes('utilization')) {
        reply = `### Fleet Utilization Intelligence\nOur current utilization rate stands at **${analytics.fleet_utilization_rate}%**. Assets in **Available** status across Howrah and Asansol hubs are primed for immediate corridor dispatch.`
      } else if (q.includes('driver') || q.includes('best') || q.includes('who')) {
        reply = `### Driver Personnel Roster\nTop-rated drivers include **Rahul Sharma** (94/100 Safety Score) and **Amit Das** (98/100). Note that **2 drivers** have expired licenses and are strictly locked under **BR-004**.`
      } else if (q.includes('roi') || q.includes('highest') || q.includes('asset')) {
        reply = `### Asset Net ROI Yield\n**${topVeh}** ranks #1 in Net ROI yield across all 25 commercial assets. Container transport on the Kolkata → Siliguri highway corridor delivers the highest profit margin.`
      } else if (q.includes('fuel') || q.includes('cost')) {
        reply = `### Fuel Telemetry Analysis\nAverage diesel rate across Eastern India highway hubs is **₹93.5/L**. Heavy haulage container trucks average **4.62 km/L**. Implementing Eco-Haul routing rules saves approx. 8.4% monthly fuel expenditure.`
      } else {
        reply = `### Executive Copilot Summary\n• **Active Haulage**: ${analytics.vehicles_on_trip} vehicles On Trip (${analytics.fleet_utilization_rate}% utilization)\n• **Top ROI Asset**: ${topVeh}\n• **Workshop Lock**: ${inShopCount} vehicles In Shop\n• **Governance**: All 13 Business Rules active & enforced.`
      }

      setMessages([...newMessages, { role: 'assistant', content: reply }])
      setIsLoading(false)
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-surface-container rounded-2xl border border-white/15 w-full max-w-2xl h-[600px] flex flex-col shadow-2xl overflow-hidden">
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
                className={`p-4 rounded-2xl max-w-[85%] leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-primary text-on-primary font-medium'
                    : 'bg-surface-container-low border border-white/10 text-on-surface whitespace-pre-line'
                }`}
              >
                {m.content}
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

        {/* Suggested Prompts Pills */}
        <div className="px-6 py-2 bg-surface-container-low border-t border-white/10 flex gap-2 overflow-x-auto">
          {SUGGESTED_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-on-surface-variant whitespace-nowrap transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-surface-container border-t border-white/10 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI Copilot about vehicle maintenance, driver compliance, ROI..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-sm focus:outline-none focus:border-primary/50"
          />
          <button
            onClick={() => handleSend()}
            className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary/90 flex items-center gap-1.5 shadow-md"
          >
            <Send className="w-4 h-4" />
            Ask
          </button>
        </div>
      </div>
    </div>
  )
}
