/**
 * Settings Screen - VANN App
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

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const editProfileRoute =
    user?.role === 'driver' ? '/(driver)/edit-profile' : '/(parent)/edit-profile';

  const sections = [
    {
      title: 'Conta',
      items: [
        { icon: 'person.fill', label: 'Editar perfil', route: editProfileRoute },
        { icon: 'key.fill', label: 'Alterar senha', route: '/(auth)/reset-password' },
      ],
    },
    {
      title: 'Privacidade',
      items: [
        { icon: 'lock.shield.fill', label: 'Política de privacidade', route: '/(shared)/privacy' },
        { icon: 'doc.text.fill', label: 'Termos de uso', route: '/(shared)/terms' },
      ],
    },
    {
      title: 'Notificações',
      items: [
        { icon: 'bell.fill', label: 'Gerenciar notificações', route: '/(shared)/notifications' },
      ],
    },
    {
      title: 'Ajuda',
      items: [
        { icon: 'questionmark.circle.fill', label: 'Central de ajuda', route: null },
        { icon: 'envelope.fill', label: 'Contato', route: null },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Configurações" showBack />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        {sections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {section.title}
            </Text>
            <Card style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.menuItem,
                    itemIndex < section.items.length - 1 && { borderBottomColor: colors.border },
                  ]}
                  onPress={() => item.route && router.push(item.route as any)}
                >
                  <IconSymbol name={item.icon as any} size={24} color={colors.icon} />
                  <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                  <IconSymbol name="chevron.right" size={20} color={colors.textTertiary} />
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}
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
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.styles.bodySmall,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  sectionCard: {
    padding: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    gap: Spacing.md,
  },
  menuLabel: {
    ...Typography.styles.body,
    flex: 1,
  },
});
