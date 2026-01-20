/**
 * Privacy Screen - VANN App
 */

import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing } from '@/constants/theme';
import { Header } from '@/components/ui/Header';

export default function PrivacyScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Política de privacidade" showBack />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        <Text style={[styles.title, { color: colors.text }]}>Política de Privacidade - VANN</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Esta política descreve como coletamos, usamos e protegemos suas informações pessoais.
        </Text>
        <Text style={[styles.section, { color: colors.text }]}>1. Coleta de Informações</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Coletamos informações que você nos fornece diretamente, como nome, email, telefone e
          localização.
        </Text>
        <Text style={[styles.section, { color: colors.text }]}>2. Uso das Informações</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Utilizamos suas informações para fornecer, manter e melhorar nossos serviços.
        </Text>
        <Text style={[styles.section, { color: colors.text }]}>3. Proteção de Dados</Text>
        <Text style={[styles.text, { color: colors.text }]}>
          Implementamos medidas de segurança para proteger suas informações contra acesso não
          autorizado.
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
