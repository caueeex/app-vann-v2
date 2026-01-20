/**
 * Contract Screen - VANN App
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
import { useMockData } from '@/hooks/useMockData';
import { formatters } from '@/utils/formatters';

export default function ContractScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { contracts } = useMockData();

  const contract = contracts.find((c) => c.id === id);

  if (!contract) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Contrato não encontrado" showBack />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Contrato" showBack />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        <Card style={styles.infoCard}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Valor mensal</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {formatters.currency(contract.monthlyFee)}
          </Text>
        </Card>

        <Card style={styles.termsCard}>
          <Text style={[styles.termsTitle, { color: colors.text }]}>Termos do contrato</Text>
          <Text style={[styles.termsText, { color: colors.text }]}>{contract.terms}</Text>
        </Card>

        {contract.status === 'pending' && (
          <Button
            title="Aceitar contrato"
            variant="primary"
            size="large"
            fullWidth
            onPress={() => {
              // Ação de aceitar
              router.back();
            }}
            style={styles.acceptButton}
          />
        )}
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
  infoCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  infoLabel: {
    ...Typography.styles.bodySmall,
    marginBottom: Spacing.xs,
  },
  infoValue: {
    ...Typography.styles.h2,
  },
  termsCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  termsTitle: {
    ...Typography.styles.h4,
    marginBottom: Spacing.md,
  },
  termsText: {
    ...Typography.styles.body,
    lineHeight: 24,
  },
  acceptButton: {
    marginTop: Spacing.lg,
  },
});
