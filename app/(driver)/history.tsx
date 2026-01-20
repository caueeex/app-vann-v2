/**
 * Driver History Screen - VANN App
 */

import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { formatters } from '@/utils/formatters';
import { mockTripHistory } from '@/mocks/routes';

export default function DriverHistoryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Histórico" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        {mockTripHistory.map((trip) => (
          <Card key={trip.id} style={styles.tripCard}>
            <View style={styles.tripHeader}>
              <View>
                <Text style={[styles.tripDate, { color: colors.text }]}>
                  {formatters.date(trip.date)}
                </Text>
                <Text style={[styles.tripSchool, { color: colors.textSecondary }]}>
                  {trip.school.name}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
                <Text style={[styles.statusText, { color: colors.success }]}>Concluída</Text>
              </View>
            </View>
            <View style={styles.tripInfo}>
              <View style={styles.infoRow}>
                <IconSymbol name="person.3.fill" size={16} color={colors.icon} />
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                  {trip.students.length} alunos
                </Text>
              </View>
              {trip.duration && (
                <View style={styles.infoRow}>
                  <IconSymbol name="clock.fill" size={16} color={colors.icon} />
                  <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                    {trip.duration} min
                  </Text>
                </View>
              )}
            </View>
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
  tripDate: {
    ...Typography.styles.h4,
    marginBottom: Spacing.xs,
  },
  tripSchool: {
    ...Typography.styles.bodySmall,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    ...Typography.styles.caption,
    fontWeight: Typography.fontWeight.medium,
  },
  tripInfo: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  infoText: {
    ...Typography.styles.bodySmall,
  },
});
