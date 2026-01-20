/**
 * Parent Profile Screen - VANN App
 */

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/hooks/useAuth';

export default function ParentProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: 'person.fill', label: 'Editar perfil', route: '/(parent)/edit-profile' },
    { icon: 'bell.fill', label: 'Notificações', route: '/(shared)/notifications' },
    { icon: 'creditcard.fill', label: 'Pagamentos', route: '/(shared)/payments' },
    { icon: 'shield.fill', label: 'Central de segurança', route: '/(shared)/security-center' },
    { icon: 'gearshape.fill', label: 'Configurações', route: '/(shared)/settings' },
    { icon: 'doc.text.fill', label: 'Termos de uso', route: '/(shared)/terms' },
    { icon: 'lock.shield.fill', label: 'Privacidade', route: '/(shared)/privacy' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Perfil" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        <Card style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
            <IconSymbol name="person.fill" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{user?.name || 'Usuário'}</Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email}</Text>
        </Card>

        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
              onPress={() => router.push(item.route as any)}
            >
              <IconSymbol name={item.icon as any} size={24} color={colors.icon} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
              <IconSymbol name="chevron.right" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.error + '20' }]}
          onPress={logout}
        >
          <IconSymbol name="arrow.right.square.fill" size={24} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Sair</Text>
        </TouchableOpacity>
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
  profileCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  name: {
    ...Typography.styles.h2,
    marginBottom: Spacing.xs,
  },
  email: {
    ...Typography.styles.body,
  },
  menu: {
    marginBottom: Spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    gap: Spacing.md,
  },
  menuLabel: {
    ...Typography.styles.body,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.sm,
  },
  logoutText: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.medium,
  },
});
