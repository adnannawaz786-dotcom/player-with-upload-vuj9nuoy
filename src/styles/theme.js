// Glassmorphism and nature color theme configuration
export const colors = {
  // Nature-inspired primary colors
  forest: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  ocean: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  earth: {
    50: '#fefbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  sage: {
    50: '#f6f7f6',
    100: '#e3e8e3',
    200: '#c7d2c7',
    300: '#a3b5a3',
    400: '#7a9479',
    500: '#5a7759',
    600: '#475f46',
    700: '#3a4d39',
    800: '#313f30',
    900: '#2a352a',
  }
};

// Glassmorphism effects
export const glass = {
  light: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  medium: {
    background: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  dark: {
    background: 'rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  },
  nature: {
    background: 'rgba(34, 197, 94, 0.1)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(34, 197, 94, 0.15)',
  }
};

// Gradient backgrounds
export const gradients = {
  forest: 'linear-gradient(135deg, #065f46 0%, #047857 25%, #059669 50%, #10b981 75%, #34d399 100%)',
  ocean: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 25%, #0284c7 50%, #0ea5e9 75%, #38bdf8 100%)',
  sunset: 'linear-gradient(135deg, #92400e 0%, #b45309 25%, #d97706 50%, #f59e0b 75%, #fbbf24 100%)',
  sage: 'linear-gradient(135deg, #2a352a 0%, #313f30 25%, #3a4d39 50%, #475f46 75%, #5a7759 100%)',
  nature: 'linear-gradient(135deg, #065f46 0%, #0c4a6e 50%, #92400e 100%)',
  ethereal: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(14, 165, 233, 0.3) 50%, rgba(251, 191, 36, 0.3) 100%)'
};

// Animation configurations
export const animations = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  float: {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  },
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }
};

// Typography scale
export const typography = {
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  }
};

// Spacing system
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '6rem',
};

// Border radius values
export const borderRadius = {
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

// Shadow system
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  nature: '0 10px 25px rgba(34, 197, 94, 0.15)',
  glow: '0 0 20px rgba(34, 197, 94, 0.3)',
};

// Component-specific theme configurations
export const components = {
  button: {
    primary: {
      background: gradients.forest,
      color: 'white',
      shadow: shadows.nature,
      hover: {
        transform: 'translateY(-2px)',
        shadow: shadows.glow,
      }
    },
    secondary: {
      ...glass.light,
      color: colors.forest[700],
      hover: {
        background: 'rgba(255, 255, 255, 0.3)',
      }
    },
    ghost: {
      background: 'transparent',
      color: colors.forest[600],
      border: `1px solid ${colors.forest[300]}`,
      hover: {
        background: colors.forest[50],
      }
    }
  },
  card: {
    default: {
      ...glass.medium,
      borderRadius: borderRadius.xl,
    },
    elevated: {
      ...glass.medium,
      borderRadius: borderRadius.xl,
      boxShadow: shadows.xl,
    }
  },
  input: {
    default: {
      ...glass.light,
      borderRadius: borderRadius.lg,
      border: `1px solid ${colors.sage[300]}`,
      focus: {
        border: `2px solid ${colors.forest[400]}`,
        boxShadow: `0 0 0 3px ${colors.forest[100]}`,
      }
    }
  }
};

// Audio visualizer colors
export const visualizer = {
  bars: [
    colors.forest[400],
    colors.ocean[400],
    colors.earth[400],
    colors.sage[400],
    colors.forest[500],
    colors.ocean[500],
    colors.earth[500],
    colors.sage[500],
  ],
  background: 'rgba(0, 0, 0, 0.1)',
  glow: 'rgba(34, 197, 94, 0.3)',
};

// Responsive breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Added natureColors grouping for convenient import
export const natureColors = {
  forest: colors.forest,
  ocean: colors.ocean,
  earth: colors.earth,
  sage: colors.sage,
};

export const themeColors = colors;
export const glassMorphism = glass;

