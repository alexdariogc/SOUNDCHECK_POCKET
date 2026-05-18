/**
 * Dark UI palette — matches splash-dark (cyan → blue → magenta on black).
 * Light splash uses magenta/cyan on white; in-app UI stays dark for now.
 */
export const colors = {
  background: '#000000',
  surface: '#0d1118',
  surfaceElevated: '#151c28',
  border: '#252f42',

  text: '#ffffff',
  textMuted: '#94a3b8',

  accent: '#00e5ff',
  accentMuted: '#0a2e3d',
  accentSecondary: '#2979ff',
  accentTertiary: '#d500f9',

  onAccent: '#000814',

  success: '#34d399',
  danger: '#f472b6',
  warning: '#fbbf24',

  successSurface: '#0a1a14',
  accentSurface: '#0a121c',
  dangerSurface: '#1a0a14',

  meterFill: '#00e5ff',
  meterHot: '#d500f9',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
