'use client'

import React, { useEffect, useState } from 'react'
import { Bell, Settings, User, Search, ShieldCheck, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/lib/theme/theme-context'

interface TopBarProps {
  title?: string
  showNotifications?: boolean
  subtitle?: string
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle,
  showNotifications = true,
}) => {
  const [userName, setUserName] = useState('Aditya Banerjee')
  const [userRole, setUserRole] = useState('Fleet Manager')
  const { resolvedTheme, toggleTheme } = useTheme()

  useEffect(() => {
    const storedName = localStorage.getItem('user_name')
    const storedRole = localStorage.getItem('user_role')
    if (storedName) setUserName(storedName)
    if (storedRole) setUserRole(storedRole)
  }, [])

  return (
    <header className="fixed top-0 left-0 md:left-60 right-0 h-16 flex items-center justify-between px-6 border-b border-[var(--border)] bg-white/90 dark:bg-[#07090D]/90 backdrop-blur-md z-30 transition-all">
      <div className="flex items-center gap-4">
        <div>
          {title && (
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">{title}</h1>
              {subtitle && (
                <>
                  <span className="text-[var(--border)]">•</span>
                  <span className="text-xs text-[var(--text-secondary)] font-medium">{subtitle}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Role switcher indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border)] text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FF6A3D]" />
          <span className="text-[var(--text-secondary)]">Active Role:</span>
          <span className="font-bold text-[var(--text-primary)]">{userRole}</span>
        </div>

        {showNotifications && (
          <button
            title="Notifications"
            className="relative p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] border border-transparent hover:border-[var(--border)] transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6A3D]" />
          </button>
        )}

        {/* Theme Toggle Button (Notifications -> Theme Toggle -> Settings) */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
          className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] border border-transparent hover:border-[var(--border)] transition-all flex items-center justify-center"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500 transition-transform duration-200 hover:-rotate-12" />
          )}
        </button>

        <button
          title="Settings"
          className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] border border-transparent hover:border-[var(--border)] transition-all"
        >
          <Settings className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-[var(--border)] mx-1" />

        {/* User profile button */}
        <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border)] hover:border-[#FF6A3D]/40 transition-all">
          <div className="w-6 h-6 rounded-lg bg-[#FF6A3D]/15 border border-[#FF6A3D]/30 flex items-center justify-center text-[11px] font-bold text-[#FF6A3D]">
            {userName.charAt(0)}
          </div>
          <span className="hidden sm:inline text-xs font-semibold text-[var(--text-primary)]">
            {userName}
          </span>
        </button>
      </div>
    </header>
  )
}
