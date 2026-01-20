/**
 * Theme Configuration - VANN App
 * Sistema de tema com paleta amarela como cor principal
 */

import { Platform } from 'react-native';
import { LightColors, DarkColors, VannColors } from './colors';
import { Typography, Spacing, BorderRadius, Shadows } from './typography';

const tintColorLight = VannColors.yellow.dark; // #FFC107
const tintColorDark = VannColors.yellow.main; // #FFD54F

export const Colors = {
  light: {
    text: LightColors.text.primary,
    textSecondary: LightColors.text.secondary,
    textTertiary: LightColors.text.tertiary,
    background: LightColors.background.primary,
    backgroundSecondary: LightColors.background.secondary,
    card: LightColors.background.card,
    tint: tintColorLight,
    icon: LightColors.icon,
    tabIconDefault: LightColors.tabIconDefault,
    tabIconSelected: LightColors.tabIconSelected,
    border: LightColors.border.light,
    borderMedium: LightColors.border.medium,
    // Semantic colors
    success: VannColors.success.main,
    error: VannColors.error.main,
    warning: VannColors.warning.main,
    info: VannColors.info.main,
    // Primary colors
    primary: VannColors.yellow.dark,
    primaryLight: VannColors.yellow.main,
    primaryLighter: VannColors.yellow.light,
  },
  dark: {
    text: DarkColors.text.primary,
    textSecondary: DarkColors.text.secondary,
    textTertiary: DarkColors.text.tertiary,
    background: DarkColors.background.primary,
    backgroundSecondary: DarkColors.background.secondary,
    card: DarkColors.background.card,
    tint: tintColorDark,
    icon: DarkColors.icon,
    tabIconDefault: DarkColors.tabIconDefault,
    tabIconSelected: DarkColors.tabIconSelected,
    border: DarkColors.border.light,
    borderMedium: DarkColors.border.medium,
    // Semantic colors
    success: VannColors.success.light,
    error: VannColors.error.light,
    warning: VannColors.warning.light,
    info: VannColors.info.light,
    // Primary colors
    primary: VannColors.yellow.main,
    primaryLight: VannColors.yellow.light,
    primaryLighter: VannColors.yellow.light,
  },
};

export const Fonts = Typography.fontFamily;

// Export design tokens
export { Typography, Spacing, BorderRadius, Shadows, VannColors };
