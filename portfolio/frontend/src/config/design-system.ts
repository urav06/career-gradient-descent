const PHI = 1.618033988749;

export const designSystem = {
  // Layout system - golden ratio for major proportions, practical values for details
  layout: {
    maxWidth: '64rem',           // 1024px - clean breakpoint
    mobileBreak: '48rem',        // 768px - standard mobile break
    headerHeight: '4rem',        // 64px - clean, not φ-forced
    scrollThreshold: 150,        // Practical scroll trigger
    gutter: '1.5rem',           // 24px - standard gutter
  },

  // Spacing system - practical with golden ratio influence
  spacing: {
    xs: '0.25rem',              // 4px - micro spacing
    xs2: '0.375rem',            // 6px - compact spacing
    sm: '0.5rem',               // 8px - small spacing  
    md: '1rem',                 // 16px - base spacing
    lg: '1.5rem',               // 24px - large spacing
    xl: '3rem',                 // 48px - section spacing
    xxl: '6rem',                // 96px - major section spacing
  },

  // Component dimensions - practical sizing
  components: {
    profilePhoto: {
      mobile: '7rem',             // 112px - clean mobile size
      desktop: '10rem',           // 160px - clean desktop size  
      header: '2.25rem',          // 36px - fits 4rem header nicely
    },
    cards: {
      borderRadius: '0.75rem',    // 12px - modern, clean radius
      padding: '1.5rem',          // 24px - comfortable padding
    },
    contextMenu: {
      minWidth: 160,              // Clean number
      borderRadius: '0.5rem',     // 8px - subtle radius
    },
    icons: {
      xs: 12,                     // Small icons for compact spaces
      sm: 14,                     // Small icons
      md: 16,                     // Standard icons
      lg: 18,                     // Large icons
    }
  },

  // Animation timing using golden ratio
  animations: {
    fast: Math.round(200 / PHI),        // ~123ms
    medium: 200,                        // 200ms  
    slow: Math.round(200 * PHI),        // ~324ms
    spring: {
      type: "spring" as const,
      damping: Math.round(PHI * 12),    // ~19
      stiffness: Math.round(PHI * 120), // ~194
    },
    easing: [0.25, 0.46, 0.45, 0.94] as const, // Custom easing curve
  },

  // Typography scale - Tailwind-inspired with golden ratio for major jumps
  typography: {
    xs: '0.75rem',              // 12px - readable small text
    sm: '0.875rem',             // 14px - body small
    base: '1rem',               // 16px - base body
    lg: '1.125rem',             // 18px - large body
    xl: '1.5rem',               // 24px - heading small
    xxl: '3rem',                // 48px - major heading (φ * base * 3)
    '2xl': '2rem',              // 32px - section headings
    '4xl': '3rem',              // 48px - hero headings
    '5xl': '4rem',              // 64px - large hero
  },

  // Breakpoints for consistent responsive design
  breakpoints: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px',
  }
} as const;

// Color palette type definition
type StatusColor = { bg: string; text: string; ring: string; dot: string; };
type ColorPalette = {
  background: string; backgroundMuted: string; text: string; textMuted: string; textSubtle: string;
  accent: string; border: string; borderMuted: string; card: string; cardHover: string; ring: string; overlay: string;
  statusColors: { [K in 'green' | 'orange' | 'yellow' | 'red' | 'blue' | 'purple']: StatusColor; };
  gradients: { heading: string; card: string; separator: string; };
  hover: { text: string; accent: string; border: string; shadow: string; scale: string; };
  tech: { bg: string; text: string; hover: string; };
  toast: { bg: string; text: string; border: string; };
};

// Color palettes for each theme - single source of truth
const colorPalettes = {
  default: {
    // Base colors
    background: 'bg-white dark:bg-black',
    backgroundMuted: 'bg-gray-50 dark:bg-gray-950',
    text: 'text-gray-900 dark:text-gray-100',
    textMuted: 'text-gray-600 dark:text-gray-400',
    textSubtle: 'text-gray-500 dark:text-gray-500',
    accent: 'text-blue-600 dark:text-blue-400',
    border: 'border-gray-200 dark:border-gray-700',
    borderMuted: 'border-gray-100 dark:border-gray-800',
    card: 'bg-gray-50/50 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-700/60',
    cardHover: 'bg-gray-100/60 dark:bg-gray-800',
    ring: 'ring-gray-200 dark:ring-gray-600',
    overlay: 'bg-white/95 dark:bg-gray-800/95',

    // Status colors
    statusColors: {
      green: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-800 dark:text-green-400', ring: 'ring-green-200 dark:ring-green-800', dot: 'bg-green-500' },
      orange: { bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-800 dark:text-orange-400', ring: 'ring-orange-200 dark:ring-orange-800', dot: 'bg-orange-500' },
      yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-800 dark:text-yellow-400', ring: 'ring-yellow-200 dark:ring-yellow-800', dot: 'bg-yellow-500' },
      red: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-800 dark:text-red-400', ring: 'ring-red-200 dark:ring-red-800', dot: 'bg-red-500' },
      blue: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-800 dark:text-blue-400', ring: 'ring-blue-200 dark:ring-blue-800', dot: 'bg-blue-500' },
      purple: { bg: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-purple-800 dark:text-purple-400', ring: 'ring-purple-200 dark:ring-purple-800', dot: 'bg-purple-500' }
    },

    // Gradients
    gradients: {
      heading: 'from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300',
      card: 'from-blue-50/20 to-purple-50/20 group-hover:from-blue-100/60 group-hover:to-purple-100/60 dark:from-blue-900/0 dark:to-purple-900/0 dark:group-hover:from-blue-900/20 dark:group-hover:to-purple-900/20',
      separator: 'from-transparent via-gray-300 dark:via-gray-600 to-transparent'
    },

    // Interactive states
    hover: {
      text: 'hover:text-gray-900 dark:hover:text-gray-100',
      accent: 'hover:text-blue-600 dark:hover:text-blue-400',
      border: 'hover:border-gray-300 dark:hover:border-gray-600',
      shadow: 'hover:shadow-lg hover:shadow-gray-300/40 dark:hover:shadow-xl dark:hover:shadow-gray-900/50',
      scale: 'hover:scale-110'
    },

    // Tech stack badges
    tech: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-600 dark:text-gray-400',
      hover: 'hover:bg-gray-200 dark:hover:bg-gray-700'
    },

    // Toast notifications
    toast: {
      bg: 'bg-gray-900/95 dark:bg-gray-100/95',
      text: 'text-white dark:text-gray-900',
      border: 'border-gray-700/20 dark:border-gray-300/20'
    }
  },
  
  minimal: {
    // Minimal theme with more muted palette
    background: 'bg-gray-50 dark:bg-gray-950',
    backgroundMuted: 'bg-white dark:bg-black',
    text: 'text-gray-800 dark:text-gray-200',
    textMuted: 'text-gray-600 dark:text-gray-400',
    textSubtle: 'text-gray-500 dark:text-gray-500',
    accent: 'text-gray-900 dark:text-gray-100',
    border: 'border-gray-100 dark:border-gray-800',
    borderMuted: 'border-gray-50 dark:border-gray-900',
    card: 'bg-white dark:bg-gray-900',
    cardHover: 'bg-gray-100 dark:bg-gray-800',
    ring: 'ring-gray-100 dark:ring-gray-800',
    overlay: 'bg-white/95 dark:bg-gray-900/95',

    // Minimal status colors (more muted)
    statusColors: {
      green: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', ring: 'ring-gray-200 dark:ring-gray-700', dot: 'bg-gray-400' },
      orange: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', ring: 'ring-gray-200 dark:ring-gray-700', dot: 'bg-gray-400' },
      yellow: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', ring: 'ring-gray-200 dark:ring-gray-700', dot: 'bg-gray-400' },
      red: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', ring: 'ring-gray-200 dark:ring-gray-700', dot: 'bg-gray-400' },
      blue: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', ring: 'ring-gray-200 dark:ring-gray-700', dot: 'bg-gray-400' },
      purple: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', ring: 'ring-gray-200 dark:ring-gray-700', dot: 'bg-gray-400' }
    },

    gradients: {
      heading: 'from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400',
      card: 'from-gray-50/0 to-gray-100/0 group-hover:from-gray-50/50 group-hover:to-gray-100/50 dark:group-hover:from-gray-800/20 dark:group-hover:to-gray-900/20',
      separator: 'from-transparent via-gray-200 dark:via-gray-700 to-transparent'
    },

    hover: {
      text: 'hover:text-gray-900 dark:hover:text-gray-100',
      accent: 'hover:text-gray-800 dark:hover:text-gray-200',
      border: 'hover:border-gray-200 dark:hover:border-gray-700',
      shadow: 'hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-gray-800/50',
      scale: 'hover:scale-105'
    },

    tech: {
      bg: 'bg-gray-50 dark:bg-gray-900',
      text: 'text-gray-600 dark:text-gray-400',
      hover: 'hover:bg-gray-100 dark:hover:bg-gray-800'
    },

    toast: {
      bg: 'bg-gray-800/95 dark:bg-gray-200/95',
      text: 'text-white dark:text-gray-800',
      border: 'border-gray-600/20 dark:border-gray-400/20'
    }
  }
} as const;

// Theme generation function - produces identical objects to previous structure
const generateTheme = (palette: ColorPalette) => ({
  ...palette,
  status: palette.statusColors, // Rename statusColors to status for API compatibility
});

// Generate themes - produces identical output to original 400-line version
const themes = {
  default: generateTheme(colorPalettes.default),
  minimal: generateTheme(colorPalettes.minimal)
} as const;

// Export current theme (easily switchable)
export const currentTheme = themes.default;
