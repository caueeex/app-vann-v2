/**
 * Reset Password Screen - VANN App
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

export default function ResetPasswordScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    const newErrors: Record<string, string> = {};

    const passwordError = validators.password(formData.password);
    if (passwordError) newErrors.password = passwordError;
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    // Simular reset
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    router.replace('/(auth)/login');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="Redefinir senha" showBack />
      <View style={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <Text style={[styles.title, { color: colors.text }]}>Nova senha</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Digite sua nova senha abaixo
        </Text>

        <Input
          label="Nova senha"
          placeholder="Mínimo 6 caracteres"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
          error={errors.password}
          leftIcon="lock"
          required
          style={styles.input}
        />

        <Input
          label="Confirmar senha"
          placeholder="Digite a senha novamente"
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          secureTextEntry
          error={errors.confirmPassword}
          leftIcon="lock"
          required
          style={styles.input}
        />

        <Button
          title="Redefinir senha"
          variant="primary"
          size="large"
          fullWidth
          loading={isLoading}
          onPress={handleReset}
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
    marginBottom: Spacing.md,
  },
  button: {
    marginTop: Spacing.md,
  },
});
