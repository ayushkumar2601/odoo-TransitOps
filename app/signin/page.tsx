'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GlassPanel } from '@/components/glass-panel'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Mail, Lock, Eye, EyeOff, Truck, ShieldCheck, Zap } from 'lucide-react'

const TRANSITOPS_ROLES = [
  {
    role: 'Fleet Manager',
    name: 'Aditya Banerjee',
    email: 'fleet@transitops.io',
    password: 'transit2026',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  {
    role: 'Dispatcher',
    name: 'Rohan Sengupta',
    email: 'dispatch@transitops.io',
    password: 'transit2026',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  },
  {
    role: 'Safety Officer',
    name: 'Priya Chatterjee',
    email: 'safety@transitops.io',
    password: 'transit2026',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  },
  {
    role: 'Financial Analyst',
    name: 'Sneha Ghosh',
    email: 'finance@transitops.io',
    password: 'transit2026',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  },
  {
    role: 'Driver',
    name: 'Rajesh Roy',
    email: 'driver@transitops.io',
    password: 'transit2026',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  }
]

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('fleet@transitops.io')
  const [password, setPassword] = useState('transit2026')
  const [selectedRole, setSelectedRole] = useState('Fleet Manager')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleQuickSelect = (roleItem: typeof TRANSITOPS_ROLES[0]) => {
    setEmail(roleItem.email)
    setPassword(roleItem.password)
    setSelectedRole(roleItem.role)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const matchRole = TRANSITOPS_ROLES.find(r => r.email.toLowerCase() === email.toLowerCase())
      const roleToUse = matchRole ? matchRole.role : selectedRole
      const nameToUse = matchRole ? matchRole.name : email.split('@')[0]

      localStorage.setItem('user_name', nameToUse)
      localStorage.setItem('user_email', email)
      localStorage.setItem('user_role', roleToUse)

      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: roleToUse })
      }).catch(() => {})

      if (roleToUse === 'Driver') {
        router.push('/driver-portal')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Failed to authenticate')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase mb-4">
            <Truck className="w-4 h-4" />
            Hackathon 2026 Edition
          </div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight">TransitOps OS</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Sign in to access your Fleet & Transport Operations portal
          </p>
        </div>

        {/* Quick Demo Role Picker Card */}
        <div className="p-5 rounded-2xl bg-surface-container-low border border-white/10 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-primary flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Quick Fill Hackathon Credentials
            </span>
            <span className="text-[11px] text-on-surface-variant">Password: transit2026</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {TRANSITOPS_ROLES.map((r) => (
              <button
                key={r.role}
                type="button"
                onClick={() => handleQuickSelect(r)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  email === r.email
                    ? 'bg-primary/15 border-primary text-on-surface shadow-md'
                    : 'bg-white/5 border-white/10 hover:border-white/20 text-on-surface-variant'
                }`}
              >
                <div className="text-xs font-bold text-on-surface">{r.role}</div>
                <div className="text-[11px] font-mono text-primary truncate mt-0.5">{r.email}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <GlassPanel className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs text-on-surface-variant font-semibold uppercase mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fleet@transitops.io"
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-white/10 rounded-xl text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary/50 transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-on-surface-variant font-semibold uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-surface-container-low border border-white/10 rounded-xl text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary/50 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 px-6 py-3.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-on-primary font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Entering Operations Portal...</span>
                </>
              ) : (
                'Sign In to TransitOps'
              )}
            </button>
          </form>
        </GlassPanel>
      </div>
    </div>
  )
}
