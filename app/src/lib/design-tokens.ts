/**
 * AgentVerse Design Tokens — Indra Brand Design System
 * Based on template_padrao.html (mandatory baseline)
 * 
 * C-Level / Premium / Fortune 500 / Clean
 */

export const tokens = {
  colors: {
    // Indra Brand Palette
    deep:       '#002B3A',
    dark:       '#003E50',
    primary:    '#06596E',
    secondary:  '#346679',
    teal:       '#3F96AE',
    cyan:       '#00B0BD',
    light:      '#7A9CAE',
    blueGray:   '#B3C1DA',
    sky:        '#BADFF3',
    warmGray:   '#B0B4BD',
    offWhite:   '#F2F5F6',
    white:      '#FFFFFF',

    // Status Colors
    success:    '#27AE60',
    warning:    '#FF9800',
    error:      '#E91E63',
    gold:       '#FFC107',

    // Border
    border:     'rgba(255, 255, 255, 0.08)',
    borderHover: 'rgba(0, 176, 189, 0.3)',

    // Card Surface
    cardSurface: '#003E50',

    // Graphite Theme Override
    graphite: {
      deep:       '#121214',
      dark:       '#1a1a1e',
      primary:    '#2b2b30',
      secondary:  '#3e3e46',
      teal:       '#8a909a',
      cyan:       '#d1d5db',
      light:      '#9ca3af',
      blueGray:   '#e5e7eb',
      sky:        '#f3f4f6',
      warmGray:   '#6b7280',
      offWhite:   '#f9fafb',
      cardSurface: '#1e1e24',
    }
  },

  typography: {
    fontSans: "'Inter', 'Segoe UI', -apple-system, sans-serif",
    fontMono: "'JetBrains Mono', 'SF Mono', monospace",
  },

  spacing: {
    sidebarWidth: '260px',
    topbarHeight: '56px',
    contentPadding: '24px 32px',
    gridGap: '20px',
    borderRadius: '8px',
  },

  animations: {
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easingSpring: 'cubic-bezier(0.16, 1, 0.3, 1)',
    duration: '0.3s',
    hoverLift: 'translateY(-3px)',
  },
} as const

export type ThemeVariant = 'classic' | 'graphite'
export type DensityVariant = 'spacious' | 'compact'
export type LayoutVariant = 'sidebar' | 'topbar'
export type StyleVariant = 'operational' | 'executive'
