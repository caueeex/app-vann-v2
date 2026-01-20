/**
 * Security Screen - VANN App
 * Tela sobre segurança do app
 */

import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Header } from '@/components/ui/Header';

export default function SecurityScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Segurança" showBack />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
            <IconSymbol name="shield.fill" size={64} color={colors.primary} />
          </View>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Segurança em primeiro lugar</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          No VANN, a segurança dos seus filhos é nossa prioridade máxima
        </Text>

        <View style={styles.features}>
          <View style={styles.featureCard}>
            <IconSymbol name="checkmark.shield.fill" size={32} color={colors.success} />
            <Text style={[styles.featureTitle, { color: colors.text }]}>Condutores verificados</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Todos os condutores passam por verificação de documentos e antecedentes
            </Text>
          </View>

          <View style={styles.featureCard}>
            <IconSymbol name="car.fill" size={32} color={colors.success} />
            <Text style={[styles.featureTitle, { color: colors.text }]}>Vans verificadas</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Veículos inspecionados e com documentação em dia
            </Text>
          </View>

          <View style={styles.featureCard}>
            <IconSymbol name="location.fill" size={32} color={colors.success} />
            <Text style={[styles.featureTitle, { color: colors.text }]}>Rastreamento 24/7</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Acompanhe a localização em tempo real durante todo o trajeto
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Button
          title="Continuar"
          variant="primary"
          size="large"
          fullWidth
          onPress={() => router.push('/(onboarding)/tracking')}
        />
      </View>
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
    paddingTop: Spacing.xl,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Typography.styles.h2,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.styles.body,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  features: {
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  featureCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  featureTitle: {
    ...Typography.styles.h4,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  featureDescription: {
    ...Typography.styles.bodySmall,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
});
