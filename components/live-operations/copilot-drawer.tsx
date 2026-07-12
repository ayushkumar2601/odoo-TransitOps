'use client'

import React, { useState } from 'react'
import { VehicleTelemetry, EASTERN_INDIA_HUBS } from '@/lib/live-tracking'
import {
  Sparkles,
  Bot,
  Send,
  X,
  Radio,
  MapPin,
  AlertTriangle,
  Fuel,
  CheckCircle2
} from 'lucide-react'

interface CopilotDrawerProps {
  isOpen: boolean
  onClose: () => void
  vehicles: VehicleTelemetry[]
  onSelectVehicle: (v: VehicleTelemetry) => void
}

export default function CopilotDrawer({
  isOpen,
  onClose,
  vehicles,
  onSelectVehicle
}: CopilotDrawerProps) {
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; text: string; relatedVehicles?: VehicleTelemetry[] }[]
  >([
    {
      role: 'assistant',
      text: 'Hello! I am your real-time TransitOps Fleet Copilot. Ask me anything about our 25 Eastern India commercial vehicles, live corridor ETAs, idling assets, or fuel health.'
    }
  ])
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  function answerQuery(question: string) {
    const q = question.toLowerCase()
    let text = ''
    let matched: VehicleTelemetry[] = []

    if (q.includes('idle') || q.includes('idling')) {
      matched = vehicles.filter(v => v.status === 'Idling')
      text = `Currently, there are **${matched.length} vehicles idling**: ${matched
        .map(m => `**${m.registrationNumber}** (${m.driverName})`)
        .join(', ')}. Excessive idling increases fuel burn by ~1.8L/hr.`
    } else if (q.includes('durgapur')) {
      matched = vehicles.filter(
        v =>
          Math.abs(v.latitude - 23.52) < 0.3 && Math.abs(v.longitude - 87.31) < 0.3
      )
      text = `There are **${matched.length} vehicles near Durgapur Industrial Corridor**: ${matched
        .map(m => `**${m.registrationNumber}** (${m.status}, ${m.speed} km/h)`)
        .join(', ')}.`
    } else if (q.includes('low fuel') || q.includes('fuel')) {
      matched = vehicles.filter(v => v.fuelPercent <= 20)
      text = `Alert: **${matched.length} vehicles have critically low fuel (≤20%)**: ${matched
        .map(m => `**${m.registrationNumber}** (${m.fuelPercent}%)`)
        .join(', ')}. Immediate refueling voucher is recommended.`
    } else if (q.includes('breakdown') || q.includes('repair')) {
      matched = vehicles.filter(v => v.status === 'Breakdown' || v.status === 'Maintenance')
      text = `We have **${matched.length} assets offline for breakdown/maintenance**: ${matched
        .map(m => `**${m.registrationNumber}** (${m.status})`)
        .join(', ')}.`
    } else if (q.includes('moving') || q.includes('active')) {
      matched = vehicles.filter(v => v.status === 'Moving')
      text = `There are currently **${matched.length} commercial vehicles moving** across Eastern India haulage routes at an average speed of **${Math.round(
        matched.reduce((acc, v) => acc + v.speed, 0) / Math.max(1, matched.length)
      )} km/h**.`
    } else {
      matched = vehicles.slice(0, 3)
      text = `Based on live Eastern India telemetry: Total Fleet = **${vehicles.length} assets** (${
        vehicles.filter(v => v.status === 'Moving').length
      } Moving, ${
        vehicles.filter(v => v.status === 'Stopped').length
      } Stopped, ${
        vehicles.filter(v => v.status === 'Idling').length
      } Idling). All statutory compliance documents and corridor SLAs are actively tracked.`
    }

    setMessages(prev => [
      ...prev,
      { role: 'user', text: question },
      { role: 'assistant', text, relatedVehicles: matched }
    ])

    if (matched && matched.length > 0 && onSelectVehicle) {
      onSelectVehicle(matched[0])
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    const q = query
    setQuery('')
    setLoading(true)
    setTimeout(() => {
      answerQuery(q)
      setLoading(false)
    }, 400)
  }

  const promptSuggestions = [
    'Which vehicles are currently idle?',
    'Show vehicles near Durgapur',
    'Which assets have low fuel?',
    'Which vehicles are in breakdown or workshop?'
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-surface-container rounded-2xl border border-white/15 w-full max-w-xl h-[560px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-surface">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-on-surface text-sm">Live Operations AI Fleet Copilot</h3>
              <p className="text-[11px] text-on-surface-variant">Real-time natural language query over 25 GPS profiles</p>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestions Bar */}
        <div className="p-3 border-b border-white/10 bg-surface-container-low flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant shrink-0">Ask:</span>
          {promptSuggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => answerQuery(s)}
              className="px-2.5 py-1 rounded-lg bg-surface hover:bg-white/10 border border-white/10 text-on-surface text-xs shrink-0 transition-all"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-primary text-on-primary rounded-br-none font-medium'
                    : 'bg-surface-container-low text-on-surface border border-white/10 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                {m.relatedVehicles && m.relatedVehicles.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase text-primary">Matching Fleet Assets (Click to Inspect on Map):</p>
                    <div className="flex flex-wrap gap-1.5">
                      {m.relatedVehicles.map(rv => (
                        <button
                          key={rv.id}
                          onClick={() => {
                            onSelectVehicle(rv)
                            onClose()
                          }}
                          className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 text-white font-mono text-[11px] flex items-center gap-1 transition-all"
                        >
                          <MapPin className="w-3 h-3 text-primary" />
                          {rv.registrationNumber}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-on-surface-variant animate-pulse">
              <Bot className="w-4 h-4 text-primary" />
              Analyzing live fleet telemetry coordinates...
            </div>
          )}
        </div>

        {/* Query Input */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-surface flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ask Fleet Copilot (e.g. Which vehicles are near Durgapur?)..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-surface-container-low border border-white/10 text-on-surface text-xs focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-primary/20"
          >
            <Send className="w-3.5 h-3.5" />
            Ask
          </button>
        </form>
      </div>
    </div>
  )
}
