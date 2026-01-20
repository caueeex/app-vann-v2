/**
 * Security Center Screen - VANN App
 */

import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Header } from '@/components/ui/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useMockData } from '@/hooks/useMockData';

export default function SecurityCenterScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { getDriverById } = useMockData();
  const driver = getDriverById('1');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Central de segurança" showBack />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        {driver && (
          <>
            <Card style={styles.driverCard}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Condutor</Text>
              <Text style={[styles.driverName, { color: colors.text }]}>{driver.name}</Text>
              <Text style={[styles.driverPhone, { color: colors.textSecondary }]}>
                {driver.phone}
              </Text>
              {driver.verified && <Badge label="Verificado" variant="verified" style={styles.badge} />}
            </Card>

            <Card style={styles.vehicleCard}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Van</Text>
              <Text style={[styles.vehicleInfo, { color: colors.text }]}>
                {driver.vehicle.brand} {driver.vehicle.model}
              </Text>
              <Text style={[styles.vehiclePlate, { color: colors.textSecondary }]}>
                Placa: {driver.vehicle.plate}
              </Text>
              {driver.vehicle.verified && (
                <Badge label="Van verificada" variant="verified" style={styles.badge} />
              )}
            </Card>
          </>
        )}

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
  driverCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.styles.h4,
    marginBottom: Spacing.sm,
  },
  driverName: {
    ...Typography.styles.h3,
    marginBottom: Spacing.xs,
  },
  driverPhone: {
    ...Typography.styles.body,
    marginBottom: Spacing.sm,
  },
  vehicleCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  vehicleInfo: {
    ...Typography.styles.body,
    marginBottom: Spacing.xs,
  },
  vehiclePlate: {
    ...Typography.styles.bodySmall,
    marginBottom: Spacing.sm,
  },
  badge: {
    marginTop: Spacing.sm,
  },
  emergencyButton: {
    marginTop: Spacing.xl,
  },
});
