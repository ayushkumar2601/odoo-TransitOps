export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'transitops-theme'

export function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark'
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored
    }
  } catch (err) {
    console.warn('Unable to access localStorage for theme preference:', err)
  }
  return 'system'
}

export function saveStoredTheme(theme: ThemeMode): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch (err) {
    console.warn('Unable to save theme preference to localStorage:', err)
  }
}

export function resolveSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark'
  try {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  } catch (err) {
    return 'dark'
  }
}
