/**
 * Register Screen - VANN App
 */

import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Header } from '@/components/ui/Header';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/contexts/UserContext';
import { validators } from '@/utils/validators';

export default function RegisterScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { register, isLoading } = useAuth();
  const { userRole } = useUser();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
  });
  const [authError, setAuthError] = useState('');
  const onlyDigits = (value: string) => value.replace(/\D/g, '').slice(0, 11);

  const handleRegister = async () => {
    setAuthError('');
    if (!userRole) {
      router.push('/(onboarding)/select-profile');
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || formData.cpf.length !== 11) {
      setAuthError('Preencha nome, email e CPF com 11 digitos.');
      return;
    }

    const emailError = validators.email(formData.email.trim());
    if (emailError) {
      setAuthError(emailError);
      return;
    }

    try {
      await register({
        email: formData.email.trim(),
        cpf: formData.cpf,
        name: formData.name.trim(),
        role: userRole,
      });
      router.replace('/');
    } catch {
      setAuthError('Nao foi possivel criar a conta. Revise os dados e tente novamente.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="Criar conta" showBack />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Input
            label="Nome completo"
            placeholder="Seu nome"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            leftIcon="person"
          />

          <Input
            label="Email"
            placeholder="seu@email.com"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            leftIcon="envelope"
          />

          <Input
            label="CPF"
            placeholder="Apenas numeros (11 digitos)"
            value={formData.cpf}
            onChangeText={(text) => setFormData({ ...formData, cpf: onlyDigits(text) })}
            keyboardType="number-pad"
            leftIcon="lock"
          />
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            Seu CPF sera sua senha inicial no primeiro acesso.
          </Text>

          <Button
            title="Criar conta"
            variant="primary"
            size="large"
            fullWidth
            loading={isLoading}
            onPress={handleRegister}
            style={styles.registerButton}
          />
          {!!authError && (
            <Text style={[styles.authErrorText, { color: colors.error }]}>
              {authError}
            </Text>
          )}

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Já tem uma conta?{' '}
            </Text>
            <Button
              title="Entrar"
              variant="ghost"
              size="small"
              onPress={() => router.push('/(auth)/login')}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  form: {
    flex: 1,
  },
  registerButton: {
    marginTop: Spacing.md,
  },
  authErrorText: {
    ...Typography.styles.caption,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  helperText: {
    ...Typography.styles.caption,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  footerText: {
    ...Typography.styles.body,
  },
});
