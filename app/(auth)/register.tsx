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
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Header } from '@/components/ui/Header';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/contexts/UserContext';
// Validação removida temporariamente

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
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors] = useState<Record<string, string>>({});

  const handleRegister = async () => {
    // Validação removida temporariamente - permite cadastro direto
    if (!userRole) {
      router.push('/(onboarding)/select-profile');
      return;
    }

    try {
      await register({
        email: formData.email || 'teste@vann.com',
        password: formData.password || '123456',
        name: formData.name || 'Usuário Teste',
        phone: formData.phone || '(11) 99999-9999',
        role: userRole,
      });
      router.replace(userRole === 'parent' ? '/(parent)/dashboard' : '/(driver)/dashboard');
    } catch (error) {
      // Em caso de erro, redirecionar mesmo assim
      router.replace(userRole === 'parent' ? '/(parent)/dashboard' : '/(driver)/dashboard');
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
            label="Telefone"
            placeholder="(11) 99999-9999"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
            leftIcon="phone"
          />

          <Input
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
            leftIcon="lock"
          />

          <Input
            label="Confirmar senha"
            placeholder="Digite a senha novamente"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            secureTextEntry
            leftIcon="lock"
          />

          <Button
            title="Criar conta"
            variant="primary"
            size="large"
            fullWidth
            loading={isLoading}
            onPress={handleRegister}
            style={styles.registerButton}
          />

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
