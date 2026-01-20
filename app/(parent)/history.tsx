/**
 * History Screen - VANN App
 */

import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Rating } from '@/components/ui/Rating';
import { Header } from '@/components/ui/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useMockData } from '@/hooks/useMockData';
import { formatters } from '@/utils/formatters';
import { mockTripHistory } from '@/mocks/routes';

export default function HistoryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Histórico de viagens" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        {mockTripHistory.map((trip) => (
          <Card
            key={trip.id}
            style={styles.tripCard}
            onPress={() => router.push(`/(parent)/tracking/${trip.routeId}`)}
          >
            <View style={styles.tripHeader}>
              <View style={styles.tripInfo}>
                <View style={styles.tripDateRow}>
                  <IconSymbol name="calendar" size={16} color={colors.icon} />
                  <Text style={[styles.tripDate, { color: colors.text }]}>
                    {formatters.date(trip.date)}
                  </Text>
                </View>
                <View style={styles.tripDriverRow}>
                  <View style={[styles.driverAvatar, { backgroundColor: colors.primary + '20' }]}>
                    <IconSymbol name="person.fill" size={16} color={colors.primary} />
                  </View>
                  <Text style={[styles.tripDriver, { color: colors.textSecondary }]}>
                    {trip.driver.name}
                  </Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
                <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
                <Text style={[styles.statusText, { color: colors.success }]}>Concluída</Text>
              </View>
            </View>
            <View style={styles.tripInfo}>
              <View style={styles.tripRow}>
                <IconSymbol name="car.fill" size={16} color={colors.icon} />
                <Text style={[styles.tripText, { color: colors.textSecondary }]}>
                  {trip.vehicle.model} - {trip.vehicle.plate}
                </Text>
              </View>
              {trip.duration && (
                <View style={styles.tripRow}>
                  <IconSymbol name="clock.fill" size={16} color={colors.icon} />
                  <Text style={[styles.tripText, { color: colors.textSecondary }]}>
                    {trip.duration} min
                  </Text>
                </View>
              )}
            </View>
            {trip.rating ? (
              <View style={styles.ratingContainer}>
                <Rating rating={trip.rating} size={16} readonly />
              </View>
            ) : (
              <View style={styles.ratingContainer}>
                <Text style={[styles.rateText, { color: colors.primary }]}>Avaliar viagem</Text>
              </View>
            )}
          </Card>
        ))}
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
  tripCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  tripInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  tripDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  tripDate: {
    ...Typography.styles.h4,
  },
  tripDriverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  driverAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripDriver: {
    ...Typography.styles.bodySmall,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    gap: Spacing.xs,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    ...Typography.styles.caption,
    fontWeight: Typography.fontWeight.medium,
  },
  tripInfo: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  tripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  tripText: {
    ...Typography.styles.bodySmall,
  },
  ratingContainer: {
    marginTop: Spacing.sm,
  },
  rateText: {
    ...Typography.styles.bodySmall,
    fontWeight: Typography.fontWeight.medium,
  },
});
