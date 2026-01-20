/**
 * Driver Ads Screen - VANN App
 */

import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { formatters } from '@/utils/formatters';
// Slider será implementado com componente nativo ou biblioteca futura

export default function DriverAdsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const [investment, setInvestment] = useState(500);
  const [enabled, setEnabled] = useState(true);

  const priority = Math.min(10, Math.floor(investment / 50));
  const estimatedReach = investment * 20;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Configuração de Ads" showBack />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={[styles.statusLabel, { color: colors.text }]}>Ads ativos</Text>
            <View style={[styles.toggle, { backgroundColor: enabled ? colors.success : colors.border }]}>
              <Text style={styles.toggleText}>{enabled ? 'ON' : 'OFF'}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.investmentCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Investimento mensal</Text>
          <Text style={[styles.investmentValue, { color: colors.primary }]}>
            {formatters.currency(investment)}
          </Text>
          <View style={[styles.sliderContainer, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.sliderTrack,
                {
                  width: `${(investment / 2000) * 100}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
          <View style={styles.sliderControls}>
            <Text
              style={[styles.sliderButton, { color: colors.text }]}
              onPress={() => setInvestment(Math.max(0, investment - 50))}
            >
              -
            </Text>
            <Text
              style={[styles.sliderButton, { color: colors.text }]}
              onPress={() => setInvestment(Math.min(2000, investment + 50))}
            >
              +
            </Text>
          </View>
          <View style={styles.sliderLabels}>
            <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>R$ 0</Text>
            <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>R$ 2.000</Text>
          </View>
        </Card>

        <Card style={styles.statsCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Resultados estimados</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.text }]}>{priority}/10</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Prioridade</Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {estimatedReach.toLocaleString()}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Alcance/mês</Text>
            </View>
          </View>
        </Card>

        <Button
          title={enabled ? 'Desativar ads' : 'Ativar ads'}
          variant={enabled ? 'outline' : 'primary'}
          size="large"
          fullWidth
          onPress={() => setEnabled(!enabled)}
          style={styles.actionButton}
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
  statusCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    ...Typography.styles.h4,
  },
  toggle: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  toggleText: {
    ...Typography.styles.bodySmall,
    color: '#FFFFFF',
    fontWeight: Typography.fontWeight.bold,
  },
  investmentCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.styles.h4,
    marginBottom: Spacing.md,
  },
  investmentValue: {
    ...Typography.styles.h1,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  sliderContainer: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginBottom: Spacing.sm,
  },
  sliderTrack: {
    height: '100%',
    borderRadius: 4,
  },
  sliderControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  sliderButton: {
    ...Typography.styles.h3,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  sliderLabel: {
    ...Typography.styles.caption,
  },
  statsCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...Typography.styles.h2,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.styles.bodySmall,
  },
  actionButton: {
    marginTop: Spacing.lg,
  },
});
