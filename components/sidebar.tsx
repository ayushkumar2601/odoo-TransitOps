'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Truck,
  Users,
  MapPin,
  Wrench,
  Receipt,
  BarChart3,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  UserCheck,
  FileText,
  Mail,
  FileSpreadsheet,
  Navigation,
  Radio,
  Cpu,
  MonitorPlay,
  FileBarChart,
  Leaf,
  RotateCcw
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  roles: string[] // Allowed roles
}

const allNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst', 'Driver', 'Admin']
  },
  {
    label: 'Live Operations',
    href: '/live-operations',
    icon: <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />,
    roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Admin']
  },
  {
    label: 'Vehicles Registry',
    href: '/vehicles',
    icon: <Truck className="w-5 h-5" />,
    roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst', 'Admin']
  },
  {
    label: 'Vehicle Documents',
    href: '/vehicle-documents',
    icon: <FileText className="w-5 h-5" />,
    roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst', 'Admin']
  },
  {
    label: 'Driver Governance',
    href: '/drivers',
    icon: <Users className="w-5 h-5" />,
    roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Admin']
  },
  {
    label: 'Driver Portal',
    href: '/driver-portal',
    icon: <Navigation className="w-5 h-5" />,
    roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Driver', 'Admin']
  },
  {
    label: 'Trip Dispatching',
    href: '/trips',
    icon: <MapPin className="w-5 h-5" />,
    roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Admin']
  },
  {
    label: 'Workshop & Maintenance',
    href: '/maintenance',
    icon: <Wrench className="w-5 h-5" />,
    roles: ['Fleet Manager', 'Admin']
  },
  {
    label: 'Fuel & Expenses',
    href: '/expenses',
    icon: <Receipt className="w-5 h-5" />,
    roles: ['Fleet Manager', 'Financial Analyst', 'Admin']
  },
  {
    label: 'Email Reminders',
    href: '/emails',
    icon: <Mail className="w-5 h-5" />,
    roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst', 'Admin']
  },
  {
    label: 'BI Analytics & ROI',
    href: '/analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ['Fleet Manager', 'Financial Analyst', 'Admin']
  },
  {
    label: 'Enterprise Audit Log',
    href: '/audit-log',
    icon: <FileSpreadsheet className="w-5 h-5" />,
    roles: ['Fleet Manager', 'Safety Officer', 'Admin']
  },
  {
    label: 'War Room',
    href: '/command-center',
    icon: <MonitorPlay className="w-5 h-5 text-rose-400" />,
    roles: ['Fleet Manager', 'Admin']
  },
  {
    label: 'Fleet Replay',
    href: '/replay',
    icon: <RotateCcw className="w-5 h-5" />,
    roles: ['Fleet Manager', 'Dispatcher', 'Admin']
  },
  {
    label: 'Daily Briefing',
    href: '/briefing',
    icon: <FileBarChart className="w-5 h-5" />,
    roles: ['Fleet Manager', 'Financial Analyst', 'Admin']
  },
  {
    label: 'Sustainability',
    href: '/sustainability',
    icon: <Leaf className="w-5 h-5 text-emerald-400" />,
    roles: ['Fleet Manager', 'Financial Analyst', 'Admin']
  }
]

export const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [userRole, setUserRole] = useState('Fleet Manager')
  const [userName, setUserName] = useState('Aditya Banerjee')

  useEffect(() => {
    const role = localStorage.getItem('user_role') || 'Fleet Manager'
    const name = localStorage.getItem('user_name') || 'Aditya Banerjee'
    setUserRole(role)
    setUserName(name)
  }, [])

  const isActive = (href: string) => pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  const handleSignOut = () => {
    localStorage.removeItem('user_role')
    localStorage.removeItem('user_name')
    localStorage.removeItem('user_email')
    router.push('/signin')
  }

  // Filter navigation links based on user role
  const visibleNavItems = allNavItems.filter(item =>
    item.roles.includes(userRole) || userRole === 'Admin'
  )

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'Dispatcher':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30'
      case 'Safety Officer':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
      case 'Financial Analyst':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30'
      case 'Admin':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30'
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    }
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-surface-container p-2 border border-white/10 hover:border-white/20 transition-colors rounded-lg"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-on-surface" />
        ) : (
          <Menu className="w-5 h-5 text-on-surface" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-surface-container-low border-r border-white/10 flex flex-col transition-transform duration-300 z-40 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-inner">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-on-surface tracking-tight">TransitOps</h1>
              <p className="text-[11px] text-primary font-mono mt-0.5">Fleet Operations OS</p>
            </div>
          </div>
        </div>

        {/* User Profile & Role Badge */}
        <div className="px-5 py-3.5 border-b border-white/10 bg-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-on-surface-variant flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Role Profile
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getRoleBadgeStyle(userRole)}`}>
              {userRole}
            </span>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <UserCheck className="w-4 h-4 text-on-surface-variant shrink-0" />
            <span className="text-xs font-semibold text-on-surface truncate">{userName}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-primary/20 border border-primary/40 text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface border border-transparent'
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-on-surface-variant hover:bg-rose-500/10 hover:text-rose-400 rounded-xl transition-all duration-200 text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Switch Role / Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden md:block w-64 shrink-0" />
    </>
  )
}
