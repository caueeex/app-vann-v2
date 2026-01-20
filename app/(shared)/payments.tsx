/**
 * Payments Screen - VANN App
 */

import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useMockData } from '@/hooks/useMockData';
import { formatters } from '@/utils/formatters';

export default function PaymentsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { getPaymentsByParentId } = useMockData();

  const payments = getPaymentsByParentId('p1');
  const pendingPayments = payments.filter((p) => p.status === 'pending');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Pagamentos" showBack />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        {pendingPayments.length > 0 && (
          <Card
            style={[
              styles.alertCard,
              {
                backgroundColor: colors.warning + '10',
                borderLeftWidth: 4,
                borderLeftColor: colors.warning,
              },
            ]}
          >
            <View style={styles.alertHeader}>
              <IconSymbol name="exclamationmark.triangle.fill" size={20} color={colors.warning} />
              <Text style={[styles.alertTitle, { color: colors.text }]}>Pagamentos pendentes</Text>
            </View>
            {pendingPayments.map((payment) => (
              <View key={payment.id} style={styles.paymentRow}>
                <View style={styles.paymentInfo}>
                  <Text style={[styles.paymentDescription, { color: colors.text }]}>
                    {payment.description}
                  </Text>
                  <View style={styles.paymentMeta}>
                    <IconSymbol name="calendar" size={12} color={colors.textTertiary} />
                    <Text style={[styles.paymentDue, { color: colors.textSecondary }]}>
                      Vence em {formatters.date(payment.dueDate)}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.paymentAmount, { color: colors.warning }]}>
                  {formatters.currency(payment.amount)}
                </Text>
              </View>
            ))}
            <Button
              title="Pagar agora"
              variant="primary"
              size="medium"
              fullWidth
              onPress={() => {
                // Ação de pagar
              }}
              style={styles.payButton}
            />
          </Card>
        )}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Histórico</Text>
        {payments
          .filter((p) => p.status === 'paid')
          .map((payment) => (
            <Card key={payment.id} style={styles.paymentCard}>
              <View style={styles.paymentRow}>
                <View>
                  <Text style={[styles.paymentDescription, { color: colors.text }]}>
                    {payment.description}
                  </Text>
                  <Text style={[styles.paymentDate, { color: colors.textSecondary }]}>
                    Pago em {payment.paidAt ? formatters.date(payment.paidAt) : 'N/A'}
                  </Text>
                </View>
                <Text style={[styles.paymentAmount, { color: colors.success }]}>
                  {formatters.currency(payment.amount)}
                </Text>
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
  alertCard: {
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  alertTitle: {
    ...Typography.styles.h4,
    flex: 1,
  },
  paymentCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  paymentInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  paymentDescription: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.medium,
  },
  paymentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  paymentDue: {
    ...Typography.styles.bodySmall,
  },
  paymentDate: {
    ...Typography.styles.bodySmall,
  },
  paymentAmount: {
    ...Typography.styles.h4,
  },
  payButton: {
    marginTop: Spacing.md,
  },
  sectionTitle: {
    ...Typography.styles.h3,
    marginBottom: Spacing.md,
  },
});
