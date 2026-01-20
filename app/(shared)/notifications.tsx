/**
 * Notifications Screen - VANN App
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
import { useMockData } from '@/hooks/useMockData';
import { formatters } from '@/utils/formatters';

export default function NotificationsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { getNotificationsByUserId } = useMockData();

  const notifications = getNotificationsByUserId('p1');

  const getIcon = (type: string) => {
    switch (type) {
      case 'trip':
        return 'map.fill';
      case 'payment':
        return 'creditcard.fill';
      case 'message':
        return 'message.fill';
      case 'security':
        return 'shield.fill';
      default:
        return 'bell.fill';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Notificações" showBack />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        {notifications.map((notif) => (
          <Card
            key={notif.id}
            style={[
              styles.notificationCard,
              !notif.read && {
                backgroundColor: colors.primary + '08',
                borderLeftWidth: 4,
                borderLeftColor: colors.primary,
              },
            ]}
            onPress={() => {
              // Navegar para ação da notificação
            }}
          >
            <View style={styles.notificationHeader}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor:
                      notif.type === 'trip'
                        ? colors.primary + '20'
                        : notif.type === 'payment'
                          ? colors.warning + '20'
                          : notif.type === 'security'
                            ? colors.success + '20'
                            : colors.info + '20',
                  },
                ]}
              >
                <IconSymbol
                  name={getIcon(notif.type) as any}
                  size={20}
                  color={
                    notif.type === 'trip'
                      ? colors.primary
                      : notif.type === 'payment'
                        ? colors.warning
                        : notif.type === 'security'
                          ? colors.success
                          : colors.info
                  }
                />
              </View>
              <View style={styles.notificationContent}>
                <View style={styles.notificationTitleRow}>
                  <Text style={[styles.notificationTitle, { color: colors.text }]}>
                    {notif.title}
                  </Text>
                  {!notif.read && (
                    <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
                  )}
                </View>
                <Text style={[styles.notificationMessage, { color: colors.textSecondary }]}>
                  {notif.message}
                </Text>
                <Text style={[styles.notificationTime, { color: colors.textTertiary }]}>
                  {formatters.relativeTime(notif.timestamp)}
                </Text>
              </View>
            </View>
          </Card>
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
  notificationCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  notificationHeader: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  notificationTitle: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.medium,
    flex: 1,
  },
  notificationMessage: {
    ...Typography.styles.bodySmall,
    marginBottom: Spacing.xs,
  },
  notificationTime: {
    ...Typography.styles.caption,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
});
