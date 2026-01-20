/**
 * InteractiveMap Component - VANN App
 * Mapa placeholder interativo com zoom, pan e marcadores
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { StudentPin } from './StudentPin';
import { IconSymbol } from './icon-symbol';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MapMarker {
  id: string;
  coordinate: Coordinate;
  title?: string;
  photo?: string;
  name: string;
  order?: number;
  type?: 'student' | 'school' | 'vehicle';
}

interface InteractiveMapProps {
  markers: MapMarker[];
  routeCoordinates?: Coordinate[];
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onMarkerPress?: (marker: MapMarker) => void;
  arrivalInfo?: {
    time: string;
    distance?: string;
  };
}

export function InteractiveMap({
  markers,
  routeCoordinates = [],
  initialRegion,
  onMarkerPress,
  arrivalInfo,
}: InteractiveMapProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scaleAnim.addListener(({ value }) => setScale(value));
    translateXAnim.addListener(({ value }) => setTranslateX(value));
    translateYAnim.addListener(({ value }) => setTranslateY(value));

    return () => {
      scaleAnim.removeAllListeners();
      translateXAnim.removeAllListeners();
      translateYAnim.removeAllListeners();
    };
  }, []);

  // Calcular região inicial baseada nos marcadores
  const calculateInitialRegion = () => {
    if (initialRegion) return initialRegion;

    if (markers.length === 0) {
      return {
        latitude: -23.5505,
        longitude: -46.6333,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }

    const lats = markers.map((m) => m.coordinate.latitude);
    const lngs = markers.map((m) => m.coordinate.longitude);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latDelta = (maxLat - minLat) * 1.5 || 0.05;
    const lngDelta = (maxLng - minLng) * 1.5 || 0.05;

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    };
  };

  const region = calculateInitialRegion();

  // Converter coordenadas para posições na tela (simplificado para placeholder)
  const coordinateToPosition = (coord: Coordinate) => {
    // Normalizar coordenadas relativas à região
    const latOffset = coord.latitude - region.latitude;
    const lngOffset = coord.longitude - region.longitude;
    
    const latRatio = 0.5 + latOffset / region.latitudeDelta;
    const lngRatio = 0.5 + lngOffset / region.longitudeDelta;

    // Converter para posições na tela
    const baseX = lngRatio * SCREEN_WIDTH;
    const baseY = (1 - latRatio) * SCREEN_HEIGHT;

    return {
      x: baseX * scale + translateX + SCREEN_WIDTH * (1 - scale) / 2,
      y: baseY * scale + translateY + SCREEN_HEIGHT * (1 - scale) / 2,
    };
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        scaleAnim.setOffset(scale);
        translateXAnim.setOffset(translateX);
        translateYAnim.setOffset(translateY);
      },
      onPanResponderMove: (evt, gestureState) => {
        // Pan (arrastar)
        translateXAnim.setValue(gestureState.dx);
        translateYAnim.setValue(gestureState.dy);
      },
      onPanResponderRelease: () => {
        scaleAnim.flattenOffset();
        translateXAnim.flattenOffset();
        translateYAnim.flattenOffset();

        const currentScale = scaleAnim._value;
        const currentX = translateXAnim._value;
        const currentY = translateYAnim._value;

        setScale(currentScale);
        setTranslateX(currentX);
        setTranslateY(currentY);
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Mapa placeholder com ruas */}
      <View style={[styles.mapBackground, { backgroundColor: colors.backgroundSecondary }]}>
        {/* Simulação de ruas */}
        <View style={styles.streetContainer}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              style={[
                styles.street,
                {
                  backgroundColor: colors.border,
                  top: `${i * 15}%`,
                  left: `${(i % 2) * 30}%`,
                },
              ]}
            />
          ))}
        </View>

        {/* Linha de rota */}
        {routeCoordinates.length > 1 && (
          <Animated.View
            style={[
              styles.routeLineContainer,
              {
                transform: [
                  { scale: scaleAnim },
                  { translateX: translateXAnim },
                  { translateY: translateYAnim },
                ],
              },
            ]}
          >
            {routeCoordinates.map((coord, index) => {
              if (index === 0) return null;
              const prev = routeCoordinates[index - 1];
              const start = coordinateToPosition(prev);
              const end = coordinateToPosition(coord);

              const dx = end.x - start.x;
              const dy = end.y - start.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);

              return (
                <View
                  key={index}
                  style={[
                    styles.routeLine,
                    {
                      backgroundColor: colors.primary,
                      left: start.x,
                      top: start.y,
                      width: distance,
                      transform: [{ rotate: `${angle}deg` }],
                    },
                  ]}
                />
              );
            })}
          </Animated.View>
        )}

        {/* Marcadores */}
        <Animated.View
          style={[
            styles.markersContainer,
            {
              transform: [
                { scale: scaleAnim },
                { translateX: translateXAnim },
                { translateY: translateYAnim },
              ],
            },
          ]}
        >
          {markers.map((marker) => {
            const position = coordinateToPosition(marker.coordinate);

            if (marker.type === 'school') {
              return (
                <TouchableOpacity
                  key={marker.id}
                  style={[styles.schoolMarker, { left: position.x - 12, top: position.y - 24 }]}
                  onPress={() => onMarkerPress?.(marker)}
                >
                  <View style={[styles.schoolPin, { backgroundColor: colors.error }]}>
                    <IconSymbol name="location.fill" size={20} color="#FFFFFF" />
                  </View>
                  {arrivalInfo && (
                    <View style={[styles.arrivalInfo, { backgroundColor: colors.card }]}>
                      <Text style={[styles.arrivalLabel, { color: colors.textSecondary }]}>
                        Chegada
                      </Text>
                      <Text style={[styles.arrivalTime, { color: colors.text }]}>
                        {arrivalInfo.time}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }

            if (marker.type === 'vehicle') {
              return (
                <TouchableOpacity
                  key={marker.id}
                  style={[styles.vehicleMarker, { left: position.x - 12, top: position.y - 12 }]}
                  onPress={() => onMarkerPress?.(marker)}
                >
                  <View style={[styles.vehiclePin, { backgroundColor: colors.error }]}>
                    <IconSymbol name="car.fill" size={16} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              );
            }

            // Student marker
            return (
              <TouchableOpacity
                key={marker.id}
                style={[styles.marker, { left: position.x - 24, top: position.y - 24 }]}
                onPress={() => onMarkerPress?.(marker)}
              >
                <StudentPin photo={marker.photo} name={marker.name} size={48} order={marker.order} />
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </View>

      {/* Controles de zoom */}
      <View style={styles.zoomControls}>
        <TouchableOpacity
          style={[styles.zoomButton, { backgroundColor: colors.card, ...Shadows.md }]}
          onPress={() => {
            const newScale = Math.min(scale * 1.2, 3);
            Animated.spring(scaleAnim, {
              toValue: newScale,
              useNativeDriver: true,
              tension: 100,
              friction: 8,
            }).start();
            setScale(newScale);
          }}
          activeOpacity={0.7}
        >
          <IconSymbol name="plus" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.zoomButton, { backgroundColor: colors.card, ...Shadows.md }]}
          onPress={() => {
            const newScale = Math.max(scale / 1.2, 0.5);
            Animated.spring(scaleAnim, {
              toValue: newScale,
              useNativeDriver: true,
              tension: 100,
              friction: 8,
            }).start();
            setScale(newScale);
          }}
          activeOpacity={0.7}
        >
          <IconSymbol name="minus" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  mapBackground: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  streetContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  street: {
    position: 'absolute',
    width: '40%',
    height: 2,
    opacity: 0.3,
  },
  routeLineContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  routeLine: {
    position: 'absolute',
    height: 4,
    opacity: 0.8,
    transformOrigin: 'left center',
  },
  markersContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  marker: {
    position: 'absolute',
  },
  schoolMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  schoolPin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  vehicleMarker: {
    position: 'absolute',
  },
  vehiclePin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  arrivalInfo: {
    marginTop: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    minWidth: 80,
  },
  arrivalLabel: {
    ...Typography.styles.caption,
    fontSize: 10,
  },
  arrivalTime: {
    ...Typography.styles.bodySmall,
    fontWeight: Typography.fontWeight.bold,
  },
  zoomControls: {
    position: 'absolute',
    right: Spacing.md,
    bottom: Spacing.xl,
    gap: Spacing.xs,
    flexDirection: 'column',
  },
  zoomButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
});
