/**
 * BarberHub Design System - Midnight Studio Theme
 * Premium, craft-forward color palette optimized for barber marketplace
 */

export const Colors = {
  // Primary Palette - Midnight Studio
  primary: '#0B0F14',
  secondary: '#111827',
  accent: '#D4AF37', // Premium gold
  support: '#E5E7EB',
  
  // Semantic Colors
  error: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',
  info: '#2563EB',
  
  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // UI Elements
  background: '#0B0F14',
  backgroundSecondary: '#111827',
  card: '#1A1F2E',
  cardHover: '#252B3D',
  border: '#2D3748',
  inputBackground: '#1F2937',
  
  // Text
  text: {
    primary: '#FFFFFF',
    secondary: '#E5E7EB',
    tertiary: '#9CA3AF',
    disabled: '#6B7280',
  },
  
  // Overlay
  overlay: 'rgba(11, 15, 20, 0.85)',
  overlayLight: 'rgba(11, 15, 20, 0.6)',
};

export const Typography = {
  // Font Families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Font Weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
};

export const Animation = {
  timing: {
    fast: 150,
    normal: 250,
    slow: 350,
    slowest: 500,
  },
  
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

export const Layout = {
  maxWidth: 1280,
  containerPadding: Spacing.md,
  headerHeight: 60,
  tabBarHeight: 80,
};

export default {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Animation,
  Layout,
};
