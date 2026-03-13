import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Colors = {
  // Primary palette
  primary: '#2d1810',
  primaryLight: '#3d2314',
  secondary: '#d4a857',
  secondaryDark: '#b8922e',
  accent: '#3a6b1c',
  accentLight: '#4a8b2c',
  destructive: '#8b4343',

  // Background colors
  background: '#1a0e08',
  backgroundCard: '#2d1810',
  backgroundElevated: '#3d2314',
  backgroundOverlay: 'rgba(0, 0, 0, 0.7)',

  // Surface colors
  parchment: '#eae5dd',
  parchmentDark: '#d4cfc7',
  leather: '#3d2314',
  leatherLight: '#5c3d2e',

  // Text colors
  textPrimary: '#eae5dd',
  textSecondary: '#b8a88a',
  textMuted: '#8a7a62',
  textDark: '#2d1810',
  textGold: '#d4a857',

  // Status colors
  xpPurple: '#7743d0',
  xpPurpleLight: '#9b6be0',
  gold: '#d4a857',
  goldDark: '#b8922e',
  success: '#3a6b1c',
  warning: '#d4a857',
  error: '#8b4343',
  info: '#4a7ab5',

  // Rarity colors
  common: '#9CA3AF',
  uncommon: '#22C55E',
  rare: '#3B82F6',
  epic: '#A855F7',
  legendary: '#F59E0B',

  // Tier colors
  grandTier: '#d4a857',
  mainTier: '#8b7355',
  sideTier: '#6b8e5a',

  // UI colors
  border: '#5c3d2e',
  borderLight: 'rgba(212, 168, 87, 0.3)',
  divider: 'rgba(212, 168, 87, 0.15)',
  inputBackground: 'rgba(60, 35, 20, 0.8)',
  tabActive: '#d4a857',
  tabInactive: '#8a7a62',

  // Nav colors
  navBackground: 'rgba(26, 14, 8, 0.95)',
  navBorder: 'rgba(212, 168, 87, 0.3)',
  navGlow: 'rgba(212, 168, 87, 0.2)',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const Fonts = {
  display: 'Cinzel',
  displayBold: 'Cinzel-Bold',
  body: 'CrimsonText',
  bodyBold: 'CrimsonText-Bold',
  bodyItalic: 'CrimsonText-Italic',
  tech: 'System',
};

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  '2xl': 22,
  '3xl': 26,
  '4xl': 32,
  '5xl': 40,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
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
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  gold: {
    shadowColor: '#d4a857',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
};

export { SCREEN_WIDTH, SCREEN_HEIGHT };
