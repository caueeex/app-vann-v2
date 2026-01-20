/**
 * StudentPin Component - VANN App
 * Pin customizado com foto do aluno para o mapa
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface StudentPinProps {
  photo?: string;
  name: string;
  size?: number;
  order?: number;
}

export function StudentPin({ photo, name, size = 48, order }: StudentPinProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Placeholder para foto ausente
  const placeholderSource = {
    uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=${colors.primary.replace('#', '')}&color=FFFFFF&bold=true`,
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.photoContainer, { ...Shadows.md }]}>
        {photo ? (
          <ExpoImage
            source={{ uri: photo }}
            style={[styles.photo, { width: size - 4, height: size - 4, borderRadius: (size - 4) / 2 }]}
            contentFit="cover"
            placeholder={placeholderSource}
          />
        ) : (
          <ExpoImage
            source={placeholderSource}
            style={[styles.photo, { width: size - 4, height: size - 4, borderRadius: (size - 4) / 2 }]}
            contentFit="cover"
          />
        )}
      </View>
      {order !== undefined && (
        <View style={[styles.orderBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.orderText}>{order}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoContainer: {
    borderRadius: BorderRadius.full,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  photo: {
    backgroundColor: '#E0E0E0',
  },
  orderBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  orderText: {
    ...Typography.styles.caption,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
  },
});
