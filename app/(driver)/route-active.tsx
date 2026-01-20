/**
 * Route Active Screen - VANN App
 * Tela de rota ativa com mapa e informações em tempo real
 */

import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LeafletMap } from '@/components/ui/LeafletMap';
import { useMockData } from '@/hooks/useMockData';

export default function RouteActiveScreen() {
  const router = useRouter();
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { getRouteById } = useMockData();
  
  // Estado para rastrear progresso da rota (mock)
  const [deliveredStudents, setDeliveredStudents] = useState<string[]>([]);
  const [studentsOnBoard, setStudentsOnBoard] = useState<string[]>([]);
  const [currentDistance, setCurrentDistance] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0); // em minutos

  const route = getRouteById(routeId || '');

  if (!route) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Rota não encontrada" showBack />
      </View>
    );
  }

  // Preparar dados para o mapa
  const sortedStudents = [...route.students].sort((a, b) => a.pickupOrder - b.pickupOrder);
  
  // Criar marcadores para o mapa
  const markers = [
    // Marcadores dos alunos
    ...sortedStudents.map((student) => ({
      id: student.id,
      coordinate: {
        latitude: student.pickupLocation.latitude,
        longitude: student.pickupLocation.longitude,
      },
      name: student.student.name,
      photo: student.student.photo,
      order: student.pickupOrder,
      type: 'student' as const,
    })),
    // Marcador da escola (destino)
    {
      id: 'school',
      coordinate: {
        latitude: route.school.address.latitude,
        longitude: route.school.address.longitude,
      },
      name: route.school.name,
      type: 'school' as const,
    },
  ];

  // Coordenadas da rota
  const routeCoordinates = [
    ...sortedStudents.map((student) => ({
      latitude: student.pickupLocation.latitude,
      longitude: student.pickupLocation.longitude,
    })),
    {
      latitude: route.school.address.latitude,
      longitude: route.school.address.longitude,
    },
  ];

  // Calcular estatísticas
  const totalStudents = route.students.length;
  const remainingStudents = totalStudents - deliveredStudents.length;
  const remainingDistance = Math.max(0, route.totalDistance - currentDistance);
  
  // Calcular tempo estimado restante (mock - baseado na distância restante)
  const avgSpeed = 40; // km/h
  const estimatedTimeRemaining = Math.round((remainingDistance / avgSpeed) * 60); // minutos

  // Formatar tempo
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const handleMarkerPress = (marker: any) => {
    console.log('Marker pressed:', marker);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Rota em Andamento" showBack />
      
      {/* Mapa Leaflet */}
      <View style={styles.mapContainer}>
        <LeafletMap
          markers={markers}
          routeCoordinates={routeCoordinates}
          onMarkerPress={handleMarkerPress}
        />
      </View>

      {/* Card de informações da rota */}
      <View style={[styles.infoContainer, { backgroundColor: colors.background, paddingBottom: insets.bottom + Spacing.md }]}>
        <Card style={styles.statsCard} padding="medium">
          <View style={styles.statsGrid}>
            {/* Distância restante */}
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: colors.warning + '10' }]}>
                <IconSymbol name="location.fill" size={20} color={colors.warning} />
              </View>
              <View style={styles.statContent}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {remainingDistance.toFixed(1)} km
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Restante
                </Text>
              </View>
            </View>

            {/* Tempo estimado */}
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: colors.primary + '10' }]}>
                <IconSymbol name="clock.fill" size={20} color={colors.primary} />
              </View>
              <View style={styles.statContent}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {formatTime(estimatedTimeRemaining)}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Tempo restante
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statsGrid}>
            {/* Alunos entregues */}
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: colors.success + '10' }]}>
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
              </View>
              <View style={styles.statContent}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {deliveredStudents.length}/{totalStudents}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Entregues
                </Text>
              </View>
            </View>

            {/* Alunos a bordo */}
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: colors.info + '10' }]}>
                <IconSymbol name="person.2.fill" size={20} color={colors.info} />
              </View>
              <View style={styles.statContent}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {studentsOnBoard.length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  A bordo
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Card de destino */}
        <Card style={styles.destinationCard} padding="medium">
          <View style={styles.destinationHeader}>
            <View style={[styles.destinationIconContainer, { backgroundColor: colors.success + '10' }]}>
              <IconSymbol name="building.2.fill" size={20} color={colors.success} />
            </View>
            <View style={styles.destinationContent}>
              <Text style={[styles.destinationLabel, { color: colors.textSecondary }]}>
                Destino
              </Text>
              <Text style={[styles.destinationName, { color: colors.text }]}>
                {route.school.name}
              </Text>
              <View style={styles.destinationMeta}>
                <IconSymbol name="location.fill" size={12} color={colors.textTertiary} />
                <Text style={[styles.destinationAddress, { color: colors.textTertiary }]} numberOfLines={1}>
                  {route.school.address.street}
                </Text>
              </View>
            </View>
            <Badge
              label={`${remainingStudents} restantes`}
              variant="default"
              size="small"
            />
          </View>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  infoContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    ...Shadows.lg,
    shadowOffset: { width: 0, height: -4 },
  },
  statsCard: {
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    ...Typography.styles.h3,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 2,
  },
  statLabel: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
  },
  destinationCard: {
    ...Shadows.sm,
  },
  destinationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  destinationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  destinationContent: {
    flex: 1,
  },
  destinationLabel: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
    marginBottom: 2,
  },
  destinationName: {
    ...Typography.styles.h4,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    marginBottom: Spacing.xs / 2,
  },
  destinationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs / 2,
  },
  destinationAddress: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
    flex: 1,
  },
});
