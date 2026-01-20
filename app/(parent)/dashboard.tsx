/**
 * Parent Dashboard - VANN App
 */

import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useMockData } from '@/hooks/useMockData';
import { formatters } from '@/utils/formatters';

export default function ParentDashboard() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { getPaymentsByParentId, routes, getDriverById } = useMockData();
  const [showVannProtect, setShowVannProtect] = useState(true); // Mostrar apenas nas primeiras semanas

  const payments = getPaymentsByParentId('p1');
  const pendingPayment = payments.find((p) => p.status === 'pending');
  const totalSpent = payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  // Buscar condutor ativo (primeiro condutor das rotas)
  const activeDriver = useMemo(() => {
    const activeRoute = routes.find((r) => r.status === 'in_progress' || r.status === 'scheduled');
    if (activeRoute) {
      return getDriverById(activeRoute.driverId);
    }
    return null;
  }, [routes, getDriverById]);

  // Calcular estatísticas do usuário
  const userStats = useMemo(() => {
    // Mock data - em produção viria do backend
    const totalTrips = 48;
    const onTimeTrips = 46; // 96% de pontualidade
    const averageTripTime = 30; // minutos
    const totalTimeSaved = totalTrips * averageTripTime; // minutos economizados
    const daysUsing = Math.floor((Date.now() - new Date('2024-01-15').getTime()) / (1000 * 60 * 60 * 24));

    return {
      totalTrips,
      onTimePercentage: Math.round((onTimeTrips / totalTrips) * 100),
      hoursSaved: Math.round(totalTimeSaved / 60),
      daysUsing,
    };
  }, []);

  // Verificar se há rastreamento ativo
  const hasActiveTracking = routes.some((r) => r.status === 'in_progress');

  // Buscar última viagem para preview
  const lastTrip = useMemo(() => {
    // Mock - em produção viria do histórico
    return {
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      driverName: 'João Silva',
      rating: 5,
      status: 'completed',
    };
  }, []);

  // Mensagem emocional baseada no estado
  const emotionalMessage = useMemo(() => {
    if (hasActiveTracking) {
      return { text: 'Tudo certo hoje 😊\nLucas está a caminho da escola com segurança.', emoji: '😊' };
    }
    if (pendingPayment) {
      return { text: 'Você tem um pagamento pendente.\nRegularize para continuar usando.', emoji: '⚠️' };
    }
    return { text: 'Tudo em ordem! ✨\nSeus filhos estão seguros com a VANN.', emoji: '✨' };
  }, [hasActiveTracking, pendingPayment]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
          <View style={styles.headerContent}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Olá,</Text>
            <Text style={[styles.name, { color: colors.text }]}>Maria Silva</Text>
          </View>
          <TouchableOpacity
            style={[styles.notificationButton, { backgroundColor: colors.backgroundSecondary }]}
            onPress={() => router.push('/(shared)/notifications')}
            accessibilityLabel="Notificações"
          >
            <IconSymbol name="bell.fill" size={20} color={colors.text} />
            <View style={[styles.badge, { backgroundColor: colors.error }]} />
          </TouchableOpacity>
        </View>

        <View style={styles.cards}>
          {/* Card VANN Protege - Mostrar apenas nas primeiras semanas */}
          {showVannProtect && (
            <Card style={[styles.vannProtectCard, { backgroundColor: colors.primary + '08' }]}>
              <View style={styles.vannProtectHeader}>
                <View style={styles.vannProtectTitleRow}>
                  <IconSymbol name="checkmark.circle.fill" size={20} color={colors.primary} />
                  <Text style={[styles.vannProtectTitle, { color: colors.text }]}>VANN Protege</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowVannProtect(false)}
                  style={styles.vannProtectClose}
                >
                  <IconSymbol name="xmark" size={16} color={colors.textTertiary} />
                </TouchableOpacity>
              </View>
              <View style={styles.vannProtectFeatures}>
                <View style={styles.vannProtectFeature}>
                  <IconSymbol name="checkmark" size={14} color={colors.success} />
                  <Text style={[styles.vannProtectFeatureText, { color: colors.textSecondary }]}>
                    Condutores verificados
                  </Text>
                </View>
                <View style={styles.vannProtectFeature}>
                  <IconSymbol name="checkmark" size={14} color={colors.success} />
                  <Text style={[styles.vannProtectFeatureText, { color: colors.textSecondary }]}>
                    Rastreamento em tempo real
                  </Text>
                </View>
                <View style={styles.vannProtectFeature}>
                  <IconSymbol name="checkmark" size={14} color={colors.success} />
                  <Text style={[styles.vannProtectFeatureText, { color: colors.textSecondary }]}>
                    Contratos digitais
                  </Text>
                </View>
              </View>
            </Card>
          )}

          {/* Estatísticas do usuário */}
          <Card style={[styles.statsCard, { backgroundColor: colors.card }]}>
            <View style={styles.statsHeader}>
              <IconSymbol name="chart.bar.fill" size={20} color={colors.primary} />
              <Text style={[styles.statsTitle, { color: colors.text }]}>Seu histórico na VANN</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.text }]}>{userStats.totalTrips}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>viagens</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.success }]}>
                  {userStats.onTimePercentage}%
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>pontualidade</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {userStats.hoursSaved}h
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>economizadas</Text>
              </View>
            </View>
          </Card>

          <Card style={[styles.summaryCard, { backgroundColor: colors.primary + '10' }]}>
            <View style={styles.summaryHeader}>
              <IconSymbol name="creditcard.fill" size={24} color={colors.primary} />
              <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Gastos do mês</Text>
            </View>
            <Text style={[styles.cardValue, { color: colors.text }]}>
              {formatters.currency(totalSpent)}
            </Text>
            <View style={styles.summaryFooter}>
              <Text style={[styles.summaryFooterText, { color: colors.textSecondary }]}>
                {payments.filter((p) => p.status === 'paid').length} pagamentos realizados
              </Text>
            </View>
          </Card>

          {/* Indicador de confiança do condutor */}
          {activeDriver && (
            <Card
              style={styles.driverTrustCard}
              onPress={() => router.push(`/(parent)/driver-profile/${activeDriver.id}`)}
            >
              <View style={styles.driverTrustHeader}>
                <View style={[styles.driverAvatar, { backgroundColor: colors.primary + '20' }]}>
                  <IconSymbol name="person.fill" size={24} color={colors.primary} />
                  {activeDriver.verified && (
                    <View style={[styles.verifiedBadge, { backgroundColor: colors.success }]}>
                      <IconSymbol name="checkmark" size={10} color="#FFFFFF" />
                    </View>
                  )}
                </View>
                <View style={styles.driverTrustInfo}>
                  <View style={styles.driverTrustNameRow}>
                    <Text style={[styles.driverTrustName, { color: colors.text }]}>
                      {activeDriver.name}
                    </Text>
                    {activeDriver.verified && (
                      <Badge label="Verificado" variant="verified" size="small" />
                    )}
                  </View>
                  <View style={styles.driverTrustRating}>
                    <Rating rating={Math.round(activeDriver.rating) as any} size={14} readonly />
                    <Text style={[styles.driverTrustRatingText, { color: colors.textSecondary }]}>
                      {activeDriver.rating.toFixed(1)} ({activeDriver.totalRatings} avaliações)
                    </Text>
                  </View>
                </View>
                <IconSymbol name="chevron.right" size={18} color={colors.textTertiary} />
              </View>
            </Card>
          )}

          {/* Atalhos contextuais dinâmicos */}
          {hasActiveTracking ? (
            <Card
              style={[styles.actionCard, { borderLeftWidth: 4, borderLeftColor: colors.primary }]}
              onPress={() => router.push('/(parent)/tracking/r1')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: colors.primary + '20' }]}>
                <IconSymbol name="location.fill" size={24} color={colors.primary} />
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: colors.text }]}>Rastreamento ativo</Text>
                <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                  Lucas está a caminho da escola
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.primary} />
            </Card>
          ) : pendingPayment ? (
            <Card
              style={[styles.alertCard, { backgroundColor: colors.warning + '20' }]}
              onPress={() => router.push('/(shared)/payments')}
            >
              <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.warning} />
              <View style={styles.alertContent}>
                <Text style={[styles.alertTitle, { color: colors.text }]}>Pagamento pendente</Text>
                <Text style={[styles.alertText, { color: colors.textSecondary }]}>
                  {formatters.currency(pendingPayment.amount)} - Vence em 3 dias
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.warning} />
            </Card>
          ) : (
            <Card
              style={[styles.actionCard, { borderLeftWidth: 4, borderLeftColor: colors.primary }]}
              onPress={() => router.push('/(parent)/search-drivers')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: colors.primary + '20' }]}>
                <IconSymbol name="magnifyingglass" size={24} color={colors.primary} />
              </View>
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: colors.text }]}>Encontrar condutor</Text>
                <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                  Busque condutores verificados na sua região
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.primary} />
            </Card>
          )}
        </View>

        {/* Mensagem emocional */}
        <Card style={[styles.emotionalCard, { backgroundColor: colors.primary + '05' }]}>
          <Text style={[styles.emotionalText, { color: colors.text }]}>{emotionalMessage.text}</Text>
        </Card>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Status das crianças</Text>
            <TouchableOpacity onPress={() => router.push('/(parent)/history')}>
              <Text style={[styles.sectionLink, { color: colors.primary }]}>Ver histórico</Text>
            </TouchableOpacity>
          </View>
          <Card style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View style={[styles.statusIndicator, { backgroundColor: colors.success }]} />
              <View style={styles.statusInfo}>
                <Text style={[styles.statusName, { color: colors.text }]}>Lucas Silva</Text>
                <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                  Em rota para escola
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Preview do histórico rápido */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Última viagem</Text>
          <Card
            style={styles.lastTripCard}
            onPress={() => router.push('/(parent)/history')}
          >
            <View style={styles.lastTripHeader}>
              <View style={styles.lastTripInfo}>
                <View style={styles.lastTripDateRow}>
                  <IconSymbol name="calendar" size={16} color={colors.icon} />
                  <Text style={[styles.lastTripDate, { color: colors.text }]}>
                    {formatters.date(lastTrip.date)}
                  </Text>
                </View>
                <Text style={[styles.lastTripDriver, { color: colors.textSecondary }]}>
                  {lastTrip.driverName}
                </Text>
              </View>
              {lastTrip.rating && (
                <View style={styles.lastTripRating}>
                  <Rating rating={lastTrip.rating} size={14} readonly />
                </View>
              )}
            </View>
            <View style={styles.lastTripFooter}>
              <Text style={[styles.lastTripLink, { color: colors.primary }]}>
                Ver histórico completo →
              </Text>
            </View>
          </Card>
        </View>

        {/* Próximos eventos */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Próximos eventos</Text>
          <Card style={styles.eventCard}>
            <View style={styles.eventRow}>
              <View style={[styles.eventIconContainer, { backgroundColor: colors.warning + '20' }]}>
                <IconSymbol name="creditcard.fill" size={18} color={colors.warning} />
              </View>
              <View style={styles.eventInfo}>
                <Text style={[styles.eventTitle, { color: colors.text }]}>Próximo pagamento</Text>
                <Text style={[styles.eventText, { color: colors.textSecondary }]}>
                  {pendingPayment
                    ? `Vence em 3 dias - ${formatters.currency(pendingPayment.amount)}`
                    : 'Nenhum pagamento pendente'}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.quickActions}>
          <Card
            style={styles.quickAction}
            onPress={() => router.push('/(parent)/search-drivers')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol name="magnifyingglass" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.quickActionText, { color: colors.text }]}>Buscar condutores</Text>
          </Card>
          <Card
            style={styles.quickAction}
            onPress={() => router.push('/(parent)/history')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol name="clock.fill" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.quickActionText, { color: colors.text }]}>Histórico</Text>
          </Card>
        </View>

        {/* Suporte rápido */}
        <Card
          style={[styles.supportCard, { backgroundColor: colors.backgroundSecondary }]}
          onPress={() => {
            // Em produção, abriria chat de suporte ou FAQ
            console.log('Abrir suporte');
          }}
        >
          <View style={styles.supportContent}>
            <View style={[styles.supportIconContainer, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol name="message.fill" size={20} color={colors.primary} />
            </View>
            <View style={styles.supportInfo}>
              <Text style={[styles.supportTitle, { color: colors.text }]}>Falar com a VANN</Text>
              <Text style={[styles.supportText, { color: colors.textSecondary }]}>
                Precisa de ajuda? Estamos aqui para você
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={18} color={colors.textTertiary} />
          </View>
        </Card>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    flex: 1,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  greeting: {
    ...Typography.styles.body,
  },
  name: {
    ...Typography.styles.h2,
  },
  cards: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  summaryCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  cardLabel: {
    ...Typography.styles.bodySmall,
    fontWeight: Typography.fontWeight.medium,
  },
  cardValue: {
    ...Typography.styles.h1,
    marginBottom: Spacing.sm,
  },
  summaryFooter: {
    marginTop: Spacing.xs,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  summaryFooterText: {
    ...Typography.styles.caption,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    ...Typography.styles.h4,
    marginBottom: Spacing.xs,
  },
  alertText: {
    ...Typography.styles.bodySmall,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    ...Typography.styles.h4,
    marginBottom: Spacing.xs,
  },
  actionText: {
    ...Typography.styles.bodySmall,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.styles.h3,
    marginBottom: Spacing.md,
  },
  statusCard: {
    padding: Spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  statusIndicatorContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusAction: {
    padding: Spacing.xs,
  },
  statusInfo: {
    flex: 1,
  },
  statusName: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: 2,
  },
  statusText: {
    ...Typography.styles.bodySmall,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  quickAction: {
    flex: 1,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  quickActionText: {
    ...Typography.styles.bodySmall,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
  },
  vannProtectCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  vannProtectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  vannProtectTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  vannProtectTitle: {
    ...Typography.styles.h4,
    fontWeight: Typography.fontWeight.bold,
  },
  vannProtectClose: {
    padding: Spacing.xs,
  },
  vannProtectFeatures: {
    gap: Spacing.xs,
  },
  vannProtectFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  vannProtectFeatureText: {
    ...Typography.styles.bodySmall,
  },
  statsCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statsTitle: {
    ...Typography.styles.h4,
    fontWeight: Typography.fontWeight.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: Spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    ...Typography.styles.h2,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.styles.caption,
    textAlign: 'center',
  },
  driverTrustCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  driverTrustHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  driverTrustInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  driverTrustNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  driverTrustName: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.medium,
  },
  driverTrustRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  driverTrustRatingText: {
    ...Typography.styles.caption,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionLink: {
    ...Typography.styles.bodySmall,
    fontWeight: Typography.fontWeight.medium,
  },
  emotionalCard: {
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  emotionalText: {
    ...Typography.styles.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  lastTripCard: {
    padding: Spacing.md,
  },
  lastTripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  lastTripInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  lastTripDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  lastTripDate: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.medium,
  },
  lastTripDriver: {
    ...Typography.styles.bodySmall,
  },
  lastTripRating: {
    marginLeft: Spacing.sm,
  },
  lastTripFooter: {
    marginTop: Spacing.xs,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  lastTripLink: {
    ...Typography.styles.bodySmall,
    fontWeight: Typography.fontWeight.medium,
  },
  eventCard: {
    padding: Spacing.md,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  eventIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.xs,
  },
  eventText: {
    ...Typography.styles.bodySmall,
  },
  supportCard: {
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  supportContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  supportIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportInfo: {
    flex: 1,
  },
  supportTitle: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.xs,
  },
  supportText: {
    ...Typography.styles.bodySmall,
  },
});
