import { ResolvedTheme } from './theme-storage'

export interface ThemeChartTokens {
  axisText: string
  gridStroke: string
  tooltipBg: string
  tooltipBorder: string
  tooltipText: string
}

export function getChartTokens(resolvedTheme: ResolvedTheme): ThemeChartTokens {
  if (resolvedTheme === 'light') {
    return {
      axisText: '#6B7280',
      gridStroke: '#E5E7EB',
      tooltipBg: '#FFFFFF',
      tooltipBorder: '#E5E7EB',
      tooltipText: '#111827',
    }
  }
  return {
    axisText: '#94A3B8',
    gridStroke: '#1E2530',
    tooltipBg: '#0F1218',
    tooltipBorder: '#1E2530',
    tooltipText: '#F9FAFB',
  }
}

export function getMapTileUrl(_resolvedTheme?: ResolvedTheme): string {
  // Always return CartoDB Voyager Light Mode Map Tiles for clear visibility regardless of UI theme
  return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
}
