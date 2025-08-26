export const theme = {
  colors: {
    // Base colors matching the original dark theme
    background: '#252525', // oklch(0.145 0 0)
    foreground: '#FBFBFB', // oklch(0.985 0 0)
    card: '#343434', // oklch(0.205 0 0)
    cardForeground: '#FBFBFB',
    
    // Primary orange color
    primary: '#f97316',
    primaryForeground: '#252525',
    
    // Secondary colors  
    secondary: '#424242', // oklch(0.269 0 0)
    secondaryForeground: '#FBFBFB',
    
    // Muted colors
    muted: '#424242',
    mutedForeground: '#B4B4B4', // oklch(0.708 0 0)
    
    // Accent colors
    accent: '#424242', 
    accentForeground: '#FBFBFB',
    
    // Destructive colors
    destructive: '#DC2626',
    destructiveForeground: '#FECACA',
    
    // Border and input colors
    border: '#424242',
    input: '#424242',
    inputBackground: '#343434',
    
    // Ring color for focus states
    ring: '#f97316',
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  
  // Border radius
  radius: {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  // Font weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Font families
  fontFamily: {
    regular: 'Lexend-Regular',
    medium: 'Lexend-Medium',
    semibold: 'Lexend-SemiBold',
    bold: 'Lexend-Bold',
  },
};

export type Theme = typeof theme;