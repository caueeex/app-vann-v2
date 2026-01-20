/**
 * BottomSheet Component - VANN App
 * Bottom sheets com gesture handler
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from './icon-symbol';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DRAG_THRESHOLD = 100;

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  snapPoints?: number[]; // percentages of screen height
  defaultSnapPoint?: number; // index in snapPoints
}

export function BottomSheet({
  visible,
  onClose,
  children,
  title,
  snapPoints = [50, 90],
  defaultSnapPoint = 0,
}: BottomSheetProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const lastGestureY = useRef(0);

  const currentSnapIndex = useRef(defaultSnapPoint);
  const isDragging = useRef(false);

  useEffect(() => {
    if (visible) {
      const targetY = SCREEN_HEIGHT * (1 - snapPoints[defaultSnapPoint] / 100);
      Animated.spring(translateY, {
        toValue: targetY,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
      currentSnapIndex.current = defaultSnapPoint;
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, defaultSnapPoint, snapPoints, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        isDragging.current = true;
        lastGestureY.current = 0;
        translateY.setOffset(translateY._value);
        translateY.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        translateY.setValue(gestureState.dy);
        lastGestureY.current = gestureState.dy;
      },
      onPanResponderRelease: (_, gestureState) => {
        isDragging.current = false;
        translateY.flattenOffset();

        const currentY = translateY._value;
        const velocity = gestureState.vy;

        // Determine next snap point
        let nextSnapIndex = currentSnapIndex.current;

        if (Math.abs(velocity) > 0.5 || Math.abs(gestureState.dy) > DRAG_THRESHOLD) {
          if (velocity > 0 || gestureState.dy > 0) {
            // Dragging down
            nextSnapIndex = Math.max(0, currentSnapIndex.current - 1);
          } else {
            // Dragging up
            nextSnapIndex = Math.min(snapPoints.length - 1, currentSnapIndex.current + 1);
          }
        }

        // If dragged down significantly, close
        if (gestureState.dy > SCREEN_HEIGHT * 0.3 || nextSnapIndex < 0) {
          onClose();
          return;
        }

        currentSnapIndex.current = nextSnapIndex;
        const targetY = SCREEN_HEIGHT * (1 - snapPoints[nextSnapIndex] / 100);

        Animated.spring(translateY, {
          toValue: targetY,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }).start();
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={onClose}
      />
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingBottom: insets.bottom,
            transform: [{ translateY }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handleContainer}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
        </View>
        {title && (
          <View style={styles.header}>
            <View style={styles.titlePlaceholder} />
          </View>
        )}
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: SCREEN_HEIGHT * 0.95,
    padding: Spacing.lg,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    marginBottom: Spacing.md,
  },
  titlePlaceholder: {
    height: 24,
  },
});
