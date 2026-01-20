/**
 * Chat Screen - VANN App
 */

import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing, Shadows } from '@/constants/theme';
import { Header } from '@/components/ui/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useMockData } from '@/hooks/useMockData';
import { formatters } from '@/utils/formatters';
import { messageTemplates } from '@/mocks/messages';

export default function ChatScreen() {
  const router = useRouter();
  const { driverId } = useLocalSearchParams<{ driverId: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { getDriverById, getMessagesByDriverId } = useMockData();

  const driver = getDriverById(driverId || '');
  const messages = getMessagesByDriverId(driverId || '');
  const [message, setMessage] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    // Simular envio
    setMessage('');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title={driver?.name || 'Chat'} showBack />
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.message,
              msg.senderId === 'parent' ? styles.messageRight : styles.messageLeft,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                msg.senderId === 'parent'
                  ? {
                      backgroundColor: colors.primary,
                      borderBottomRightRadius: 4,
                    }
                  : {
                      backgroundColor: colors.card,
                      borderBottomLeftRadius: 4,
                      ...Shadows.sm,
                    },
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  msg.senderId === 'parent' ? { color: '#FFFFFF' } : { color: colors.text },
                ]}
              >
                {msg.content}
              </Text>
              <View style={styles.messageFooter}>
                <Text
                  style={[
                    styles.messageTime,
                    msg.senderId === 'parent' ? { color: '#FFFFFF80' } : { color: colors.textTertiary },
                  ]}
                >
                  {formatters.relativeTime(msg.timestamp)}
                </Text>
                {msg.senderId === 'parent' && (
                  <IconSymbol
                    name={msg.status === 'read' ? 'checkmark.circle.fill' : 'checkmark.circle'}
                    size={12}
                    color={msg.status === 'read' ? '#FFFFFF' : '#FFFFFF80'}
                    style={styles.statusIcon}
                  />
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      {showTemplates && (
        <View style={[styles.templatesContainer, { backgroundColor: colors.card }]}>
          {messageTemplates.map((template, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.template, { borderColor: colors.border }]}
              onPress={() => {
                setMessage(template);
                setShowTemplates(false);
              }}
            >
              <Text style={[styles.templateText, { color: colors.text }]}>{template}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + Spacing.sm, backgroundColor: colors.background }]}>
        <TouchableOpacity
          onPress={() => setShowTemplates(!showTemplates)}
          style={styles.templateButton}
        >
          <IconSymbol name="text.bubble.fill" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder="Digite uma mensagem..."
          placeholderTextColor={colors.textTertiary}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          onPress={handleSend}
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          disabled={!message.trim()}
        >
          <IconSymbol name="paperplane.fill" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.md,
  },
  message: {
    marginBottom: Spacing.sm,
  },
  messageLeft: {
    alignItems: 'flex-start',
  },
  messageRight: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: Spacing.md,
    borderRadius: 16,
  },
  messageText: {
    ...Typography.styles.body,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    justifyContent: 'flex-end',
  },
  messageTime: {
    ...Typography.styles.caption,
    fontSize: 10,
  },
  statusIcon: {
    marginLeft: 2,
  },
  templatesContainer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    maxHeight: 200,
  },
  templatesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  templatesTitle: {
    ...Typography.styles.bodySmall,
    fontWeight: Typography.fontWeight.medium,
  },
  template: {
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  templateText: {
    ...Typography.styles.bodySmall,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  templateButton: {
    padding: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.styles.body,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
