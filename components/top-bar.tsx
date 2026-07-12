'use client'

import React, { useEffect, useState } from 'react'
import { Bell, Settings, User, Search, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

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

  useEffect(() => {
    const storedName = localStorage.getItem('user_name')
    const storedRole = localStorage.getItem('user_role')
    if (storedName) setUserName(storedName)
    if (storedRole) setUserRole(storedRole)
  }, [])

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 h-16 flex items-center justify-between px-6 border-b border-[#27272A] bg-[#09090B]/90 backdrop-blur-md z-30 transition-all">
      <div className="flex items-center gap-4">
        <div>
          {title && (
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-bold text-[#FAFAFA] tracking-tight">{title}</h1>
              {subtitle && (
                <>
                  <span className="text-[#27272A]">•</span>
                  <span className="text-xs text-[#A1A1AA] font-medium">{subtitle}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Role switcher indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111113] border border-[#27272A] text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FF5A36]" />
          <span className="text-[#A1A1AA]">Active Role:</span>
          <span className="font-bold text-[#FAFAFA]">{userRole}</span>
        </div>

        {showNotifications && (
          <button
            title="Notifications"
            className="relative p-2 rounded-xl text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#18181B] border border-transparent hover:border-[#27272A] transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF5A36]" />
          </button>
        )}

        <button
          title="Settings"
          className="p-2 rounded-xl text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#18181B] border border-transparent hover:border-[#27272A] transition-all"
        >
          <Settings className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-[#27272A] mx-1" />

        {/* User profile button */}
        <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#111113] border border-[#27272A] hover:border-[#3F3F46] transition-all">
          <div className="w-6 h-6 rounded-lg bg-[#FF5A36]/20 border border-[#FF5A36]/40 flex items-center justify-center text-[11px] font-bold text-[#FF5A36]">
            {userName.charAt(0)}
          </div>
          <span className="hidden sm:inline text-xs font-semibold text-[#FAFAFA]">
            {userName}
          </span>
        </button>
      </div>
    </header>
  )
}
