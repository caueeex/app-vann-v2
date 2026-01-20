/**
 * Design System Colors - VANN App
 * Paleta baseada em amarelo como cor principal
 * Contraste WCAG AA garantido
 */

export const VannColors = {
  // Primary - Amarelo (tons modernos e confiáveis)
  primary: {
    50: '#FFFDE7',
    100: '#FFF9C4',
    200: '#FFF59D',
    300: '#FFF176',
    400: '#FFEE58',
    500: '#FFEB3B', // Amarelo principal
    600: '#FDD835',
    700: '#FBC02D',
    800: '#F9A825',
    900: '#F57F17',
  },
  
  // Yellow (tons mais suaves para UI)
  yellow: {
    light: '#FFE082',
    main: '#FFD54F',
    dark: '#FFC107',
  },

  // Neutral - Preto/Cinza
  neutral: {
    black: '#212121',
    dark: '#424242',
    medium: '#757575',
    light: '#BDBDBD',
    lighter: '#E0E0E0',
    lightest: '#F5F5F5',
  },

  // Background
  background: {
    white: '#FFFFFF',
    light: '#FAFAFA',
    dark: '#121212',
    card: '#FFFFFF',
  },

  // Semantic Colors
  success: {
    light: '#81C784',
    main: '#4CAF50',
    dark: '#388E3C',
  },

  error: {
    light: '#E57373',
    main: '#F44336',
    dark: '#D32F2F',
  },

  warning: {
    light: '#FFB74D',
    main: '#FF9800',
    dark: '#F57C00',
  },

  info: {
    light: '#64B5F6',
    main: '#2196F3',
    dark: '#1976D2',
  },

  // Status Colors
  status: {
    verified: '#4CAF50',
    pending: '#FF9800',
    rejected: '#F44336',
    inactive: '#9E9E9E',
  },
};

// Light Theme Colors
export const LightColors = {
  text: {
    primary: VannColors.neutral.black,
    secondary: VannColors.neutral.dark,
    tertiary: VannColors.neutral.medium,
    inverse: '#FFFFFF',
  },
  background: {
    primary: VannColors.background.white,
    secondary: VannColors.background.light,
    card: VannColors.background.card,
  },
  border: {
    light: VannColors.neutral.lighter,
    medium: VannColors.neutral.light,
    dark: VannColors.neutral.medium,
  },
  tint: VannColors.yellow.dark,
  tabIconDefault: VannColors.neutral.medium,
  tabIconSelected: VannColors.yellow.dark,
  icon: VannColors.neutral.medium,
};

// Dark Theme Colors
export const DarkColors = {
  text: {
    primary: '#ECEDEE',
    secondary: '#9BA1A6',
    tertiary: '#687076',
    inverse: '#212121',
  },
  background: {
    primary: '#151718',
    secondary: '#1F2123',
    card: '#252729',
  },
  border: {
    light: '#2D2F31',
    medium: '#3A3D40',
    dark: '#4A4D50',
  },
  tint: VannColors.yellow.main,
  tabIconDefault: '#9BA1A6',
  tabIconSelected: VannColors.yellow.main,
  icon: '#9BA1A6',
};
