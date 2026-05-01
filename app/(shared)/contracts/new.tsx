/**
 * New contract flow — navegação até revisão do contrato (demo/mock até API existir).
 */

import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useMockData } from '@/hooks/useMockData';

function singleParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default function NewContractScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ driverId?: string | string[] }>();
  const driverId = singleParam(params.driverId);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { getDriverById, contracts } = useMockData();

  const driver = driverId ? getDriverById(driverId) : undefined;

  const contractPreview =
    driverId != null ? contracts.find((c) => c.driverId === driverId) : contracts[0];

  const handleContinue = () => {
    if (contractPreview) {
      router.replace(`/(shared)/contracts/${contractPreview.id}`);
      return;
    }
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Novo contrato" showBack />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        {!driverId && (
          <Card style={styles.card}>
            <Text style={[styles.body, { color: colors.error }]}>
              Condutor não informado. Volte e tente novamente.
            </Text>
          </Card>
        )}

        {driverId && !driver && (
          <Card style={styles.card}>
            <Text style={[styles.body, { color: colors.text }]}>
              Não encontramos os dados deste condutor no modo demo.
            </Text>
          </Card>
        )}

        {driver && (
          <>
            <Card style={styles.card}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Condutor</Text>
              <Text style={[styles.title, { color: colors.text }]}>{driver.name}</Text>
              <Text style={[styles.body, { color: colors.textSecondary }]}>
                Você será direcionado para revisar e aceitar o contrato digital.
              </Text>
            </Card>

            <Button
              title={contractPreview ? 'Continuar para revisão' : 'Voltar'}
              variant="primary"
              size="large"
              fullWidth
              onPress={handleContinue}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  card: {
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  label: {
    ...Typography.styles.caption,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
  },
  title: {
    ...Typography.styles.h3,
    marginBottom: Spacing.sm,
  },
  body: {
    ...Typography.styles.body,
  },
});
