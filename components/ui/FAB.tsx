/**
 * FAB (Floating Action Button) Component - VANN App
 * Botão flutuante para ações principais
 */

import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { IconSymbol } from './icon-symbol';

interface FABProps {
  icon: string;
  onPress: () => void;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary';
}

export function FAB({
  icon,
  onPress,
  style,
  size = 'medium',
  variant = 'primary',
}: FABProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const sizeStyles: Record<string, ViewStyle> = {
    small: { width: 48, height: 48 },
    medium: { width: 56, height: 56 },
    large: { width: 64, height: 64 },
  };

  const iconSizes: Record<string, number> = {
    small: 20,
    medium: 24,
    large: 28,
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.fab,
          sizeStyles[size],
          {
            backgroundColor: variant === 'primary' ? colors.primary : colors.backgroundSecondary,
            ...Shadows.lg,
          },
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel="Ação principal"
      >
        <IconSymbol
          name={icon as any}
          size={iconSizes[size]}
          color={variant === 'primary' ? '#FFFFFF' : colors.text}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fab: {
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.lg,
  },
});
