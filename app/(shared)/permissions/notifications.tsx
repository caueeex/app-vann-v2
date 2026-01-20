/**
 * Notifications Permission Screen - VANN App
 */

import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { usePermissions } from '@/hooks/usePermissions';

export default function NotificationsPermissionScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { requestNotificationPermission } = usePermissions();

  const handleRequest = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      router.back();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Permissão de notificações" showBack />
      <View style={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
            <IconSymbol name="bell.fill" size={64} color={colors.primary} />
          </View>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Permitir notificações</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Receba alertas sobre viagens, pagamentos e mensagens importantes.
        </Text>
        <Button
          title="Permitir notificações"
          variant="primary"
          size="large"
          fullWidth
          onPress={handleRequest}
          style={styles.button}
        />
        <Button
          title="Não agora"
          variant="ghost"
          size="medium"
          fullWidth
          onPress={() => router.back()}
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    justifyContent: 'center',
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
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.styles.body,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  button: {
    marginBottom: Spacing.md,
  },
});
