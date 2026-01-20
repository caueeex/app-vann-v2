/**
 * Input Component - VANN App
 * Inputs modernos com validação visual, labels e estados bem definidos
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { IconSymbol } from './icon-symbol';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  required?: boolean;
  success?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  required,
  secureTextEntry,
  success,
  ...props
}: InputProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;
  const iconColorAnim = useRef(new Animated.Value(0)).current;

  const hasError = !!error;
  const showPasswordToggle = secureTextEntry;
  const hasSuccess = success && !hasError && !isFocused;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(borderAnim, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(shadowAnim, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(iconColorAnim, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isFocused, borderAnim, shadowAnim, iconColorAnim]);

  // Cores dinâmicas baseadas no estado
  const borderColor = hasError
    ? colors.error
    : hasSuccess
    ? colors.success
    : borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.border, colors.primary],
      });

  const backgroundColor = isFocused ? colors.background : colors.card;

  const getIconColor = (defaultColor: string) => {
    if (hasError) return colors.error;
    if (hasSuccess) return colors.success;
    if (isFocused) return colors.primary;
    return defaultColor;
  };

  const shadowOpacity = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.08],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
          {required && <Text style={{ color: colors.error }}> *</Text>}
        </Text>
      )}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            backgroundColor,
            borderColor,
            borderWidth: borderAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 2],
            }),
            borderRadius: BorderRadius.lg,
            shadowOpacity,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: isFocused ? 2 : 0,
          },
        ]}
      >
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <IconSymbol
              name={leftIcon}
              size={18}
              color={getIconColor(colors.icon)}
            />
          </View>
        )}
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              paddingLeft: leftIcon ? Spacing['2xl'] : Spacing.md,
              paddingRight: rightIcon || showPasswordToggle ? Spacing['2xl'] : Spacing.md,
            },
          ]}
          placeholderTextColor={colors.textTertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          accessibilityLabel={label}
          accessibilityHint={helperText}
          {...props}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            accessibilityLabel={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
            activeOpacity={0.7}
          >
            <IconSymbol
              name={isPasswordVisible ? 'eye.slash' : 'eye'}
              size={18}
              color={getIconColor(colors.icon)}
            />
          </TouchableOpacity>
        )}
        {rightIcon && !showPasswordToggle && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={onRightIconPress}
            accessibilityLabel="Ação"
            activeOpacity={0.7}
          >
            <IconSymbol name={rightIcon} size={18} color={getIconColor(colors.icon)} />
          </TouchableOpacity>
        )}
        {hasSuccess && (
          <View style={styles.successIconContainer}>
            <IconSymbol name="checkmark.circle.fill" size={18} color={colors.success} />
          </View>
        )}
      </Animated.View>
      {error && (
        <Animated.View style={styles.messageContainer}>
          <Text style={[styles.errorText, { color: colors.error }]} accessibilityLiveRegion="polite">
            {error}
          </Text>
        </Animated.View>
      )}
      {helperText && !error && (
        <View style={styles.messageContainer}>
          <Text style={[styles.helperText, { color: colors.textTertiary }]}>{helperText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.styles.bodySmall,
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.sm,
    fontWeight: Typography.fontWeight.semiBold,
    letterSpacing: 0.2,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52, // Altura mais confortável
    borderWidth: 1,
    shadowColor: '#000',
  },
  input: {
    ...Typography.styles.body,
    flex: 1,
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    paddingVertical: Spacing.md,
    borderWidth: 0,
  },
  leftIconContainer: {
    position: 'absolute',
    left: Spacing.md,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
  },
  rightIconContainer: {
    position: 'absolute',
    right: Spacing.md,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
  },
  successIconContainer: {
    position: 'absolute',
    right: Spacing.md,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  errorText: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.fontSize.xs * Typography.lineHeight.normal,
  },
  helperText: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.fontSize.xs * Typography.lineHeight.normal,
  },
});
