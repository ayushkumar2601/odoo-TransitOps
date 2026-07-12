'use client'

import React, { createContext, useContext } from 'react'
import { ThemeMode, ResolvedTheme } from './theme-storage'

export interface ThemeContextValue {
  theme: ThemeMode
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  resolvedTheme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
})

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}
