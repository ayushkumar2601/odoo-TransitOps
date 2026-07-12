'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ThemeContext } from './theme-context'
import {
  ThemeMode,
  ResolvedTheme,
  getStoredTheme,
  saveStoredTheme,
  resolveSystemTheme
} from './theme-storage'

export interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: ThemeMode
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const pathname = usePathname()
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark')
  const [mounted, setMounted] = useState(false)

  // Check if current route enforces forceDarkMode (e.g., Command Center War Room)
  const isForceDarkMode = Boolean(pathname && pathname.startsWith('/command-center'))

  useEffect(() => {
    const stored = getStoredTheme()
    setThemeState(stored)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    let effectiveTheme: ResolvedTheme
    if (isForceDarkMode) {
      effectiveTheme = 'dark'
    } else if (theme === 'system') {
      effectiveTheme = resolveSystemTheme()
    } else {
      effectiveTheme = theme
    }

    setResolvedTheme(effectiveTheme)

    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(effectiveTheme)
  }, [theme, isForceDarkMode, mounted])

  // Listen for system theme changes when mode is 'system'
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      if (theme === 'system' && !isForceDarkMode) {
        const nextTheme: ResolvedTheme = mediaQuery.matches ? 'dark' : 'light'
        setResolvedTheme(nextTheme)
        const root = document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(nextTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, isForceDarkMode])

  const setTheme = (nextTheme: ThemeMode) => {
    setThemeState(nextTheme)
    saveStoredTheme(nextTheme)
  }

  const toggleTheme = () => {
    const next: ThemeMode = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
