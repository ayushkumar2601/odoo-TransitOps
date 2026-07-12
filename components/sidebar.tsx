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
  MonitorPlay,
  FileBarChart,
  Leaf,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  roles: string[]
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard className="w-4 h-4" />,
        roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst', 'Driver', 'Admin'],
      },
      {
        label: 'Operations War Room',
        href: '/command-center',
        icon: <MonitorPlay className="w-4 h-4 text-[#FF5A36]" />,
        roles: ['Fleet Manager', 'Admin'],
      },
    ],
  },
  {
    title: 'Operations',
    items: [
      {
        label: 'Live Fleet Map',
        href: '/live-operations',
        icon: <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />,
        roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Admin'],
      },
      {
        label: 'Trip Dispatching',
        href: '/trips',
        icon: <MapPin className="w-4 h-4" />,
        roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Admin'],
      },
      {
        label: 'Route Playback',
        href: '/replay',
        icon: <RotateCcw className="w-4 h-4" />,
        roles: ['Fleet Manager', 'Dispatcher', 'Admin'],
      },
    ],
  },
  {
    title: 'Fleet',
    items: [
      {
        label: 'Vehicle Registry',
        href: '/vehicles',
        icon: <Truck className="w-4 h-4" />,
        roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst', 'Admin'],
      },
      {
        label: 'Vehicle Documents',
        href: '/vehicle-documents',
        icon: <FileText className="w-4 h-4" />,
        roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst', 'Admin'],
      },
      {
        label: 'Driver Governance',
        href: '/drivers',
        icon: <Users className="w-4 h-4" />,
        roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Admin'],
      },
      {
        label: 'Driver Portal',
        href: '/driver-portal',
        icon: <Navigation className="w-4 h-4" />,
        roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Driver', 'Admin'],
      },
    ],
  },
  {
    title: 'Maintenance',
    items: [
      {
        label: 'Workshop Control',
        href: '/maintenance',
        icon: <Wrench className="w-4 h-4" />,
        roles: ['Fleet Manager', 'Admin'],
      },
      {
        label: 'Fuel & Expenses',
        href: '/expenses',
        icon: <Receipt className="w-4 h-4" />,
        roles: ['Fleet Manager', 'Financial Analyst', 'Admin'],
      },
    ],
  },
  {
    title: 'Analytics',
    items: [
      {
        label: 'BI Analytics & ROI',
        href: '/analytics',
        icon: <BarChart3 className="w-4 h-4" />,
        roles: ['Fleet Manager', 'Financial Analyst', 'Admin'],
      },
      {
        label: 'Executive Briefing',
        href: '/briefing',
        icon: <FileBarChart className="w-4 h-4" />,
        roles: ['Fleet Manager', 'Financial Analyst', 'Admin'],
      },
      {
        label: 'Sustainability ESG',
        href: '/sustainability',
        icon: <Leaf className="w-4 h-4 text-emerald-400" />,
        roles: ['Fleet Manager', 'Financial Analyst', 'Admin'],
      },
    ],
  },
  {
    title: 'Administration',
    items: [
      {
        label: 'Audit Log',
        href: '/audit-log',
        icon: <FileSpreadsheet className="w-4 h-4" />,
        roles: ['Fleet Manager', 'Safety Officer', 'Admin'],
      },
      {
        label: 'Email Reminders',
        href: '/emails',
        icon: <Mail className="w-4 h-4" />,
        roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst', 'Admin'],
      },
    ],
  },
]

export const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpenMobile, setIsOpenMobile] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [userRole, setUserRole] = useState('Fleet Manager')
  const [userName, setUserName] = useState('Aditya Banerjee')
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const role = localStorage.getItem('user_role') || 'Fleet Manager'
    const name = localStorage.getItem('user_name') || 'Aditya Banerjee'
    setUserRole(role)
    setUserName(name)
  }, [])

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  const handleSignOut = () => {
    localStorage.removeItem('user_role')
    localStorage.removeItem('user_name')
    localStorage.removeItem('user_email')
    router.push('/signin')
  }

  const toggleGroup = (title: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

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
        return 'bg-[#FF5A36]/15 text-[#FF5A36] border-[#FF5A36]/30'
    }
  }

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsOpenMobile(!isOpenMobile)}
        className="fixed top-4 left-4 z-50 md:hidden bg-[#111113] p-2.5 border border-[#27272A] hover:border-[#3F3F46] transition-colors rounded-xl shadow-lg"
        aria-label="Toggle Navigation"
      >
        {isOpenMobile ? (
          <X className="w-5 h-5 text-[#FAFAFA]" />
        ) : (
          <Menu className="w-5 h-5 text-[#FAFAFA]" />
        )}
      </button>

      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white dark:bg-[#0B0E13] border-r border-[var(--border)] flex flex-col transition-all duration-300 z-40 md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 w-60' : '-translate-x-full'
        } ${isCollapsed ? 'md:w-20' : 'md:w-60'}`}
      >
        {/* Header Logo */}
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-[#FF6A3D] text-white flex items-center justify-center font-bold shadow-lg shadow-[#FF6A3D]/20">
              <Truck className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-[var(--text-primary)] tracking-tight leading-tight">
                  TransitOps
                </span>
                <span className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold tracking-wider">
                  Enterprise OS
                </span>
              </div>
            )}
          </Link>

          {/* Collapsible toggle (Desktop only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* User Role Profile */}
        {!isCollapsed && (
          <div className="mx-3 my-3 p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#FF6A3D]" />
                Workspace Role
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRoleBadgeStyle(
                  userRole
                )}`}
              >
                {userRole}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              <span className="text-xs font-semibold text-[var(--text-primary)] truncate">
                {userName}
              </span>
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-2 space-y-4 overflow-y-auto">
          {navGroups.map((group) => {
            const items = group.items.filter(
              (item) => item.roles.includes(userRole) || userRole === 'Admin'
            )
            if (items.length === 0) return null

            const isGroupCollapsed = collapsedGroups[group.title]

            return (
              <div key={group.title} className="space-y-1">
                {/* Group Title header */}
                {!isCollapsed ? (
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className="w-full flex items-center justify-between px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <span>{group.title}</span>
                    {isGroupCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                ) : (
                  <div className="border-t border-[var(--border)]/60 my-2" />
                )}

                {/* Nav Items */}
                {!isGroupCollapsed &&
                  items.map((item) => {
                    const active = isActive(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpenMobile(false)}
                        title={isCollapsed ? item.label : undefined}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                          active
                            ? 'bg-[#FF6A3D]/15 text-[#FF6A3D] border border-[#FF6A3D]/30 font-semibold shadow-sm'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] border border-transparent'
                        }`}
                      >
                        <span className="shrink-0">{item.icon}</span>
                        {!isCollapsed && <span className="text-sm truncate">{item.label}</span>}
                      </Link>
                    )
                  })}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--border)]">
          <button
            onClick={handleSignOut}
            title="Switch Role / Sign Out"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-rose-500/10 hover:text-rose-500 transition-all text-xs font-semibold"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Switch Role / Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div
        className={`hidden md:block shrink-0 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      />
    </>
  )
}
