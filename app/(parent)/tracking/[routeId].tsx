/**
 * Tracking Screen - VANN App
 */

import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useMockData } from '@/hooks/useMockData';
import { mockTrackingRoutes } from '@/mocks/routes';

export default function TrackingScreen() {
  const router = useRouter();
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { getRouteById } = useMockData();

  const route = getRouteById(routeId || '');
  const trackingRoute = mockTrackingRoutes.find((r) => r.id === routeId);

  if (!route && !trackingRoute) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Rota não encontrada" showBack />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Rastreamento" showBack />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        <Card style={styles.mapCard}>
          <View style={[styles.mapPlaceholder, { backgroundColor: colors.backgroundSecondary }]}>
            <View style={[styles.mapIconContainer, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol name="map.fill" size={48} color={colors.primary} />
            </View>
            <Text style={[styles.mapText, { color: colors.text }]}>Mapa em tempo real</Text>
            <Text style={[styles.mapSubtext, { color: colors.textSecondary }]}>
              Rastreamento ativo
            </Text>
          </View>
        </Card>

        <Card style={styles.infoCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Informações da rota</Text>
          <View style={styles.infoRow}>
            <IconSymbol name="person.fill" size={20} color={colors.icon} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              Condutor: {trackingRoute?.driver.name || route?.driver?.name || 'N/A'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <IconSymbol name="car.fill" size={20} color={colors.icon} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              {trackingRoute?.vehicle.brand || route?.vehicle?.brand} {trackingRoute?.vehicle.model || route?.vehicle?.model} - {trackingRoute?.vehicle.plate || route?.vehicle?.plate}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <IconSymbol name="clock.fill" size={20} color={colors.icon} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              Tempo estimado: {trackingRoute?.estimatedCompletion || route?.estimatedCompletion || 'Calculando...'}
            </Text>
          </View>
        </Card>

        <Card style={[styles.statusCard, { backgroundColor: colors.success + '10' }]}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusIndicator, { backgroundColor: colors.success }]} />
            <View style={styles.statusContent}>
              <Text style={[styles.statusText, { color: colors.text }]}>Em andamento</Text>
              <Text style={[styles.statusSubtext, { color: colors.textSecondary }]}>
                Rota iniciada há 15 minutos
              </Text>
            </View>
            <View style={[styles.statusPulse, { backgroundColor: colors.success + '30' }]} />
          </View>
        </Card>

        <Button
          title="Botão de emergência"
          variant="danger"
          size="large"
          fullWidth
          leftIcon={<IconSymbol name="exclamationmark.triangle.fill" size={20} color="#FFFFFF" />}
          onPress={() => {
            // Ação de emergência
          }}
          style={styles.emergencyButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  mapCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  mapPlaceholder: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  mapText: {
    ...Typography.styles.h4,
    marginTop: Spacing.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  mapSubtext: {
    ...Typography.styles.bodySmall,
    marginTop: Spacing.xs,
  },
  infoCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.styles.h4,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  infoText: {
    ...Typography.styles.body,
  },
  statusCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusContent: {
    flex: 1,
  },
  statusText: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: 2,
  },
  statusSubtext: {
    ...Typography.styles.caption,
  },
  statusPulse: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.3,
  },
  emergencyButton: {
    marginTop: Spacing.lg,
  },
});
