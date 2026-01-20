/**
 * Tracking Screen - VANN App
 * Tela sobre rastreamento em tempo real
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

export default function TrackingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Rastreamento" showBack />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
            <IconSymbol name="location.fill" size={64} color={colors.primary} />
          </View>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Rastreamento em tempo real</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Acompanhe a localização da van e do seu filho a qualquer momento
        </Text>

        <View style={styles.features}>
          <View style={styles.featureCard}>
            <IconSymbol name="map.fill" size={32} color={colors.primary} />
            <Text style={[styles.featureTitle, { color: colors.text }]}>Mapa interativo</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Visualize a rota completa e a localização atual da van
            </Text>
          </View>

          <View style={styles.featureCard}>
            <IconSymbol name="clock.fill" size={32} color={colors.primary} />
            <Text style={[styles.featureTitle, { color: colors.text }]}>Tempo estimado</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Saiba exatamente quando a van chegará ao ponto de coleta
            </Text>
          </View>

          <View style={styles.featureCard}>
            <IconSymbol name="bell.fill" size={32} color={colors.primary} />
            <Text style={[styles.featureTitle, { color: colors.text }]}>Notificações</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Receba alertas quando a van estiver chegando ou sair
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
          onPress={() => router.push('/(onboarding)/communication')}
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
