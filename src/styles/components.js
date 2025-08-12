// Shared styled components for glassmorphism effects with nature colors
export const glassStyles = {
  primary: "bg-gradient-to-br from-emerald-500/20 to-teal-600/20 backdrop-blur-lg border border-white/20 shadow-xl",
  secondary: "bg-gradient-to-br from-green-400/15 to-blue-500/15 backdrop-blur-md border border-white/10 shadow-lg",
  accent: "bg-gradient-to-br from-cyan-400/25 to-emerald-500/25 backdrop-blur-xl border border-white/30 shadow-2xl",
  subtle: "bg-white/5 backdrop-blur-sm border border-white/5 shadow-md"
};

export const gradientBackgrounds = {
  main: "bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900",
  overlay: "bg-gradient-to-t from-emerald-900/80 via-teal-800/60 to-cyan-700/40",
  card: "bg-gradient-to-br from-emerald-600/30 via-teal-500/20 to-cyan-600/30",
  button: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
};

export const animationClasses = {
  fadeIn: "animate-in fade-in duration-500",
  slideUp: "animate-in slide-in-from-bottom-4 duration-300",
  slideDown: "animate-in slide-in-from-top-4 duration-300",
  scaleIn: "animate-in zoom-in-95 duration-200",
  pulse: "animate-pulse",
  bounce: "animate-bounce"
};

export const textStyles = {
  heading: "text-white font-bold tracking-tight",
  subheading: "text-emerald-100 font-semibold",
  body: "text-emerald-50",
  muted: "text-emerald-200/70",
  accent: "text-cyan-300"
};

export const buttonVariants = {
  primary: `${gradientBackgrounds.button} text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95`,
  secondary: `${glassStyles.secondary} text-emerald-100 font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200`,
  ghost: "text-emerald-200 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200",
  icon: "text-emerald-200 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200"
};

export const inputStyles = {
  base: `${glassStyles.primary} text-white placeholder-emerald-300/50 px-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 outline-none transition-all duration-200`,
  file: `${glassStyles.secondary} text-emerald-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-500 file:text-white file:font-medium hover:file:bg-emerald-600 transition-all duration-200`
};

export const cardStyles = {
  default: `${glassStyles.primary} rounded-2xl p-6`,
  compact: `${glassStyles.secondary} rounded-xl p-4`,
  interactive: `${glassStyles.primary} rounded-2xl p-6 hover:bg-white/10 cursor-pointer transition-all duration-300 hover:scale-[1.02]`,
  floating: `${glassStyles.accent} rounded-2xl p-6 hover:shadow-3xl transition-all duration-300`
};

export const visualizerStyles = {
  container: `${glassStyles.primary} rounded-2xl p-4 overflow-hidden`,
  bar: "bg-gradient-to-t from-emerald-500 to-cyan-400 rounded-t-sm transition-all duration-75",
  wave: "stroke-cyan-400 fill-none stroke-2",
  glow: "filter drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
};

export const playerStyles = {
  container: `${cardStyles.default} space-y-6`,
  controls: "flex items-center justify-center space-x-4",
  progress: `${glassStyles.subtle} rounded-full h-2 overflow-hidden`,
  progressBar: "bg-gradient-to-r from-emerald-400 to-cyan-400 h-full rounded-full transition-all duration-100",
  playButton: `${buttonVariants.primary} !p-4 rounded-full`,
  controlButton: buttonVariants.icon,
  timeDisplay: `${textStyles.muted} text-sm font-mono`
};

export const trackListStyles = {
  container: `${cardStyles.default} space-y-4`,
  item: `${glassStyles.secondary} rounded-xl p-4 flex items-center space-x-4 hover:bg-white/10 cursor-pointer transition-all duration-200`,
  activeItem: `${glassStyles.accent} rounded-xl p-4 flex items-center space-x-4 ring-2 ring-cyan-400/50`,
  uploadArea: `${glassStyles.primary} border-2 border-dashed border-emerald-400/50 rounded-xl p-8 text-center hover:border-cyan-400/50 transition-all duration-300`,
  dragActive: "border-cyan-400 bg-cyan-400/10 scale-[1.02]"
};

export const layoutStyles = {
  container: "min-h-screen p-4 space-y-6",
  grid: "grid grid-cols-1 lg:grid-cols-2 gap-6",
  flexCenter: "flex items-center justify-center",
  spaceBetween: "flex items-center justify-between"
};

// Utility functions for dynamic styling
export const getGlassEffect = (intensity = 'primary') => glassStyles[intensity] || glassStyles.primary;

export const combineClasses = (...classes) => classes.filter(Boolean).join(' ');

export const getResponsiveText = (size = 'base') => {
  const sizes = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl'
  };
  return sizes[size] || sizes.base;
};