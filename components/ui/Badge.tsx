/**
 * Badge Component - VANN App
 * Badges de status, verificado, ads, etc.
 */

import React from 'react';
import { View, Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing, BorderRadius } from '@/constants/theme';
import { IconSymbol } from './icon-symbol';

export type BadgeVariant = 'verified' | 'ads' | 'success' | 'warning' | 'error' | 'info' | 'default';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: string;
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export function Badge({ label, variant = 'default', icon, size = 'medium', style }: BadgeProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getBadgeStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      borderRadius: BorderRadius.full,
    };

    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
      },
      medium: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
      },
    };

    const variantStyles: Record<BadgeVariant, ViewStyle> = {
      verified: {
        backgroundColor: colors.success + '20',
      },
      ads: {
        backgroundColor: colors.primary + '20',
      },
      success: {
        backgroundColor: colors.success + '20',
      },
      warning: {
        backgroundColor: colors.warning + '20',
      },
      error: {
        backgroundColor: colors.error + '20',
      },
      info: {
        backgroundColor: colors.info + '20',
      },
      default: {
        backgroundColor: colors.backgroundSecondary,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextStyle = (): TextStyle => {
    const variantTextStyles: Record<BadgeVariant, TextStyle> = {
      verified: { color: colors.success },
      ads: { color: colors.primary },
      success: { color: colors.success },
      warning: { color: colors.warning },
      error: { color: colors.error },
      info: { color: colors.info },
      default: { color: colors.text },
    };

    return {
      ...Typography.styles.caption,
      ...variantTextStyles[variant],
      fontSize: size === 'small' ? Typography.fontSize.xs : Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.medium,
    };
  };

  const getIconColor = (): string => {
    const variantColors: Record<BadgeVariant, string> = {
      verified: colors.success,
      ads: colors.primary,
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
      info: colors.info,
      default: colors.text,
    };
    return variantColors[variant];
  };

  return (
    <View style={[getBadgeStyle(), style]}>
      {icon && (
        <IconSymbol
          name={icon}
          size={size === 'small' ? 12 : 14}
          color={getIconColor()}
          style={{ marginRight: Spacing.xs }}
        />
      )}
      <Text style={getTextStyle()}>{label}</Text>
    </View>
  );
}
