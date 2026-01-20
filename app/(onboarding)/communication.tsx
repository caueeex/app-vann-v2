/**
 * Communication Screen - VANN App
 * Tela sobre comunicação e avaliações
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

export default function CommunicationScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Comunicação" showBack />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
            <IconSymbol name="message.fill" size={64} color={colors.primary} />
          </View>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Comunicação direta</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Converse diretamente com o condutor e avalie o serviço
        </Text>

        <View style={styles.features}>
          <View style={styles.featureCard}>
            <IconSymbol name="message.fill" size={32} color={colors.primary} />
            <Text style={[styles.featureTitle, { color: colors.text }]}>Chat em tempo real</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Troque mensagens diretamente com o condutor
            </Text>
          </View>

          <View style={styles.featureCard}>
            <IconSymbol name="star.fill" size={32} color={colors.primary} />
            <Text style={[styles.featureTitle, { color: colors.text }]}>Avaliações</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Avalie o serviço e ajude outros pais a escolherem
            </Text>
          </View>

          <View style={styles.featureCard}>
            <IconSymbol name="bell.badge.fill" size={32} color={colors.primary} />
            <Text style={[styles.featureTitle, { color: colors.text }]}>Notificações</Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              Receba atualizações sobre viagens, pagamentos e mensagens
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
          onPress={() => router.push('/(onboarding)/select-profile')}
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
