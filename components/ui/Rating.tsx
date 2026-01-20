/**
 * Rating Component - VANN App
 * Sistema de avaliações com estrelas
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { IconSymbol } from './icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Spacing } from '@/constants/theme';
import { Rating as RatingType } from '@/types/common';

interface RatingProps {
  rating: RatingType;
  maxRating?: RatingType;
  size?: number;
  readonly?: boolean;
  onRatingChange?: (rating: RatingType) => void;
  showValue?: boolean;
  style?: ViewStyle;
}

export function Rating({
  rating,
  maxRating = 5,
  size = 20,
  readonly = false,
  onRatingChange,
  showValue = false,
  style,
}: RatingProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handlePress = (value: RatingType) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.stars}>
        {Array.from({ length: maxRating }, (_, index) => {
          const value = (index + 1) as RatingType;
          const isFilled = value <= rating;

          return (
            <TouchableOpacity
              key={value}
              onPress={() => handlePress(value)}
              disabled={readonly}
              activeOpacity={readonly ? 1 : 0.7}
              accessibilityLabel={`Avaliar ${value} estrelas`}
              accessibilityRole="button"
            >
              <IconSymbol
                name={isFilled ? 'star.fill' : 'star'}
                size={size}
                color={isFilled ? colors.primary : colors.border}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      {showValue && (
        <View style={styles.valueContainer}>
          <IconSymbol
            name="star.fill"
            size={size * 0.7}
            color={colors.primary}
            style={styles.valueIcon}
          />
          <IconSymbol
            name="star.fill"
            size={size * 0.7}
            color={colors.primary}
            style={styles.valueIcon}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  valueContainer: {
    flexDirection: 'row',
    marginLeft: Spacing.sm,
  },
  valueIcon: {
    marginRight: 2,
  },
});
