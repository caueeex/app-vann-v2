/**
 * Forgot Password Screen - VANN App
 */

import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Header } from '@/components/ui/Header';
import { validators } from '@/utils/validators';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = async () => {
    const emailError = validators.email(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);
    setError('');

    // Simular envio de email
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setEmailSent(true);
    setIsLoading(false);
  };

  if (emailSent) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Email enviado" showBack />
        <View style={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}>
          <Text style={[styles.title, { color: colors.text }]}>Verifique seu email</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Enviamos um link de recuperação para {email}
          </Text>
          <Button
            title="Voltar ao login"
            variant="primary"
            size="large"
            fullWidth
            onPress={() => router.push('/(auth)/login')}
            style={styles.button}
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="Esqueci minha senha" showBack />
      <View style={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <Text style={[styles.title, { color: colors.text }]}>Recuperar senha</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Digite seu email e enviaremos um link para redefinir sua senha
        </Text>

        <Input
          label="Email"
          placeholder="seu@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={error}
          leftIcon="envelope"
          required
          style={styles.input}
        />

        <Button
          title="Enviar link"
          variant="primary"
          size="large"
          fullWidth
          loading={isLoading}
          onPress={handleSendEmail}
          style={styles.button}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    justifyContent: 'center',
  },
  title: {
    ...Typography.styles.h2,
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.styles.body,
    marginBottom: Spacing.xl,
  },
  input: {
    marginBottom: Spacing.lg,
  },
  button: {
    marginTop: Spacing.md,
  },
});
