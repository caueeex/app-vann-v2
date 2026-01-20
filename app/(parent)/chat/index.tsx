/**
 * Chat List Screen - VANN App
 * Lista de conversas do parent
 */

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Header } from '@/components/ui/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useMockData } from '@/hooks/useMockData';
import { formatters } from '@/utils/formatters';

export default function ChatListScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { drivers, getMessagesByDriverId } = useMockData();

  // Buscar conversas com mensagens
  const conversations = drivers.map((driver) => {
    const messages = getMessagesByDriverId(driver.id);
    const lastMessage = messages[messages.length - 1];
    // Contar mensagens não lidas (do driver que não foram lidas)
    const unreadCount = messages.filter(
      (m) => m.senderId === 'driver' && m.status !== 'read'
    ).length;

    return {
      driver,
      lastMessage,
      unreadCount,
      hasMessages: messages.length > 0,
    };
  }).filter((conv) => conv.hasMessages);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Conversas" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        {conversations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconContainer, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol name="message.fill" size={48} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Nenhuma conversa</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Suas conversas com condutores aparecerão aqui
            </Text>
          </View>
        ) : (
          conversations.map((conversation) => (
            <Card
              key={conversation.driver.id}
              style={styles.chatCard}
              onPress={() => router.push(`/(parent)/chat/${conversation.driver.id}`)}
            >
              <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
                <IconSymbol name="person.fill" size={24} color={colors.primary} />
                {conversation.driver.verified && (
                  <View style={[styles.verifiedBadge, { backgroundColor: colors.success }]}>
                    <IconSymbol name="checkmark" size={10} color="#FFFFFF" />
                  </View>
                )}
              </View>
              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={[styles.chatName, { color: colors.text }]}>
                    {conversation.driver.name}
                  </Text>
                  {conversation.lastMessage && (
                    <Text style={[styles.chatTime, { color: colors.textTertiary }]}>
                      {formatters.relativeTime(conversation.lastMessage.timestamp)}
                    </Text>
                  )}
                </View>
                {conversation.lastMessage && (
                  <View style={styles.chatPreview}>
                    <Text
                      style={[styles.chatPreviewText, { color: colors.textSecondary }]}
                      numberOfLines={1}
                    >
                      {conversation.lastMessage.content}
                    </Text>
                    {conversation.unreadCount > 0 && (
                      <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                        <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
              <IconSymbol name="chevron.right" size={18} color={colors.textTertiary} />
            </Card>
          ))
        )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.styles.h3,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    ...Typography.styles.body,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.medium,
  },
  chatTime: {
    ...Typography.styles.caption,
  },
  chatPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  chatPreviewText: {
    ...Typography.styles.bodySmall,
    flex: 1,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    ...Typography.styles.caption,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
  },
});
