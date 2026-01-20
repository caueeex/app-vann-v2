/**
 * Welcome Screen - VANN App
 * Primeira tela do onboarding
 */

import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primary + '15' }]}>
            <IconSymbol name="car.fill" size={64} color={colors.primary} />
          </View>
        </View>
        
        <Text style={[styles.title, { color: colors.text }]}>Bem-vindo ao VANN</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Transporte escolar inteligente, seguro e confiável
        </Text>

        <View style={styles.features}>
          <View style={styles.feature}>
            <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
            <Text style={[styles.featureText, { color: colors.text }]}>Rastreamento em tempo real</Text>
          </View>
          <View style={styles.feature}>
            <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
            <Text style={[styles.featureText, { color: colors.text }]}>Condutores verificados</Text>
          </View>
          <View style={styles.feature}>
            <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
            <Text style={[styles.featureText, { color: colors.text }]}>Comunicação direta</Text>
          </View>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Button
          title="Começar"
          variant="primary"
          size="large"
          fullWidth
          onPress={() => router.push('/(onboarding)/security')}
        />
        <Button
          title="Pular"
          variant="ghost"
          size="medium"
          fullWidth
          onPress={() => router.push('/(onboarding)/select-profile')}
          style={styles.skipButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
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
    ...Typography.styles.h1,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.styles.body,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  features: {
    width: '100%',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureText: {
    ...Typography.styles.body,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  skipButton: {
    marginTop: Spacing.sm,
  },
});
