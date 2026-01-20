/**
 * Terms Screen - VANN App
 */

import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing } from '@/constants/theme';
import { Header } from '@/components/ui/Header';

export default function TermsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Termos de uso" showBack />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        <Text style={[styles.title, { color: colors.text }]}>Termos de Uso - VANN</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Estes termos de uso regem o uso do aplicativo VANN. Ao utilizar o aplicativo, você
          concorda com estes termos.
        </Text>
        <Text style={[styles.section, { color: colors.text }]}>1. Aceitação dos Termos</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Ao acessar e usar o VANN, você aceita estar vinculado a estes termos de uso.
        </Text>
        <Text style={[styles.section, { color: colors.text }]}>2. Uso do Serviço</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          O VANN é uma plataforma que conecta pais e condutores de transporte escolar. Você
          concorda em usar o serviço apenas para fins legais e de acordo com estes termos.
        </Text>
        <Text style={[styles.section, { color: colors.text }]}>3. Responsabilidades</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Os usuários são responsáveis por manter a segurança de suas contas e informações.
        </Text>
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
  title: {
    ...Typography.styles.h2,
    marginBottom: Spacing.lg,
  },
  section: {
    ...Typography.styles.h4,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  text: {
    ...Typography.styles.body,
    marginBottom: Spacing.md,
    lineHeight: 24,
  },
});
