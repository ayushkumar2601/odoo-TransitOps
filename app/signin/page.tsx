'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/loading-spinner'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Truck,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Sparkles
} from 'lucide-react'

const TRANSITOPS_ROLES = [
  {
    role: 'Fleet Manager',
    name: 'Aditya Banerjee',
    email: 'fleet@transitops.io',
    password: 'transit2026',
    destination: '/dashboard',
    description: 'Executive fleet command & telemetry'
  },
  {
    role: 'Dispatcher',
    name: 'Rohan Sengupta',
    email: 'dispatch@transitops.io',
    password: 'transit2026',
    destination: '/trips',
    description: 'Haulage dispatch & route lifecycle'
  },
  {
    role: 'Safety Officer',
    name: 'Priya Chatterjee',
    email: 'safety@transitops.io',
    password: 'transit2026',
    destination: '/vehicle-documents',
    description: 'Compliance & document audit ledger'
  },
  {
    role: 'Financial Analyst',
    name: 'Sneha Ghosh',
    email: 'finance@transitops.io',
    password: 'transit2026',
    destination: '/expenses',
    description: 'Fuel economics & cost analytics'
  },
  {
    role: 'Driver',
    name: 'Rajesh Roy',
    email: 'driver@transitops.io',
    password: 'transit2026',
    destination: '/driver-portal',
    description: 'Driver haulage & trip assignment'
  }
]

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState('Fleet Manager')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [autofillToast, setAutofillToast] = useState('')
  const [showDemoDropdown, setShowDemoDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDemoDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectDemoRole = (roleItem: typeof TRANSITOPS_ROLES[0]) => {
    setEmail(roleItem.email)
    setPassword(roleItem.password)
    setSelectedRole(roleItem.role)
    setShowDemoDropdown(false)
    setError('')
    setAutofillToast(`Autofilled credentials for ${roleItem.role}`)
    setTimeout(() => setAutofillToast(''), 3500)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    setIsLoading(true)

    try {
      const matchRole = TRANSITOPS_ROLES.find(r => r.email.toLowerCase() === email.toLowerCase())
      const roleToUse = matchRole ? matchRole.role : selectedRole
      const nameToUse = matchRole ? matchRole.name : email.split('@')[0]
      const destination = matchRole ? matchRole.destination : '/dashboard'

      localStorage.setItem('user_name', nameToUse)
      localStorage.setItem('user_email', email)
      localStorage.setItem('user_role', roleToUse)

      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: roleToUse })
      }).catch(() => {})

      router.push(destination)
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0C0E14] text-white flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Warm orangish background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF5A36]/12 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Minimal Dark 2-Column Card */}
      <div className="w-full max-w-4xl bg-[#11141D] border border-white/10 rounded-3xl p-3 md:p-4 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch relative z-10">
        
        {/* Left Column — Truck Image Panel */}
        <div
          className="relative md:col-span-6 rounded-2xl overflow-hidden min-h-[300px] md:min-h-[530px] flex flex-col justify-between p-6 md:p-8 border border-white/10 shadow-inner group"
          style={{
            backgroundImage: 'url(/hero.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Orangish & Dark gradient mask over image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0E14] via-[#0C0E14]/40 to-black/30 group-hover:via-[#FF5A36]/10 transition-colors duration-700" />

          {/* Top Bar inside image card */}
          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FF5A36] flex items-center justify-center shadow-lg shadow-[#FF5A36]/30">
                <Truck className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">TransitOps</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/90 hover:text-white text-xs font-semibold hover:bg-black/70 transition-all"
            >
              Back to website <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Bottom Caption matching minimal layout */}
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight tracking-tight">
              Enterprise Haulage,<br />Autonomous Fleet.
            </h2>
            <p className="text-xs text-white/75 mt-2 max-w-xs leading-relaxed">
              Real-time corridor telemetry, AI predictive maintenance, and complete operational governance.
            </p>

            {/* Minimal pagination indicator dots */}
            <div className="flex items-center gap-1.5 mt-6">
              <span className="w-2 h-1 rounded-full bg-white/40" />
              <span className="w-6 h-1 rounded-full bg-[#FF5A36]" />
              <span className="w-2 h-1 rounded-full bg-white/40" />
            </div>
          </div>
        </div>

        {/* Right Column — Minimal Form Area */}
        <div className="md:col-span-6 flex flex-col justify-center px-4 md:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Sign in
            </h1>
            <p className="text-xs text-white/50 mt-1">
              Enter your email and password to access your portal
            </p>
          </div>

          {/* Autofill notification toast */}
          {autofillToast && (
            <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-[#FF5A36]/15 border border-[#FF5A36]/40 text-[#FF5A36] text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {autofillToast}
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@transitops.io"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-[#171A24] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#FF5A36] focus:ring-1 focus:ring-[#FF5A36] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-11 pr-11 py-3 bg-[#171A24] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#FF5A36] focus:ring-1 focus:ring-[#FF5A36] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#FF5A36] hover:bg-[#E04826] disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-[#FF5A36]/25 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Minimal Separator */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative px-3 bg-[#11141D] text-[11px] font-semibold text-white/40 uppercase tracking-wider">
              Or explore demo
            </span>
          </div>

          {/* Demo Dropdown Button & Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowDemoDropdown(!showDemoDropdown)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#171A24] hover:bg-[#1C202C] border border-white/10 text-white text-xs font-semibold flex items-center justify-between transition-all"
            >
              <span className="flex items-center gap-2 text-white/80">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
                Select Demo Role & Autofill
              </span>
              <ChevronDown
                className={`w-4 h-4 text-white/50 transition-transform duration-200 ${
                  showDemoDropdown ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Options */}
            {showDemoDropdown && (
              <div className="absolute left-0 right-0 bottom-full mb-2 bg-[#171A24] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-30 divide-y divide-white/5">
                {TRANSITOPS_ROLES.map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => handleSelectDemoRole(r)}
                    className="w-full px-4 py-3 text-left hover:bg-[#FF5A36]/15 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#FF5A36] transition-colors">
                        {r.role}
                      </div>
                      <div className="text-[10px] text-white/50 mt-0.5">
                        {r.description}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-white/40 group-hover:text-white/80">
                      {r.destination}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
