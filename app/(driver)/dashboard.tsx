/**
 * Driver Dashboard - VANN App
 * Dashboard completo para condutores com estatísticas, ações rápidas e informações relevantes
 */

import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { formatters } from '@/utils/formatters';
import { useMockData } from '@/hooks/useMockData';

export default function DriverDashboard() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { routes, getDriverById } = useMockData();

  // Dados do condutor (mock - em produção viria do contexto/backend)
  const driverId = '1';
  const driver = getDriverById(driverId);
  const driverRoutes = routes.filter((r) => r.driverId === driverId);

  // Estatísticas financeiras
  const monthlyEarnings = 4200.0;
  const monthlyExpenses = 1800.0; // Combustível, manutenção, etc
  const netProfit = monthlyEarnings - monthlyExpenses;
  const totalEarnings = 12500.0;

  // Estatísticas de rotas
  const activeRoutes = driverRoutes.filter((r) => r.status === 'scheduled' || r.status === 'in_progress').length;
  const completedRoutes = 45;
  const totalStudents = useMemo(() => {
    return driverRoutes.reduce((sum, route) => sum + route.students.length, 0);
  }, [driverRoutes]);

  // Próximas rotas do dia
  const todayRoutes = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return driverRoutes
      .filter((r) => r.date === today && (r.status === 'scheduled' || r.status === 'in_progress'))
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .slice(0, 2);
  }, [driverRoutes]);

  // Estatísticas adicionais
  const totalDistance = useMemo(() => {
    return driverRoutes.reduce((sum, route) => sum + route.totalDistance, 0);
  }, [driverRoutes]);
  const averageRouteTime = useMemo(() => {
    const times = driverRoutes.map((r) => r.totalDuration);
    return times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
  }, [driverRoutes]);

  // Mensagem emocional/contextual
  const emotionalMessage = useMemo(() => {
    if (activeRoutes > 0) {
      return { text: 'Ótimo trabalho! 🚐\nVocê tem rotas ativas hoje.', emoji: '🚐' };
    }
    if (netProfit > 3000) {
      return { text: 'Excelente mês! 💰\nSeu lucro está acima da média.', emoji: '💰' };
    }
    return { text: 'Tudo em ordem! ✨\nContinue oferecendo um serviço de qualidade.', emoji: '✨' };
  }, [activeRoutes, netProfit]);

  // Alertas (mock)
  const alerts = useMemo(() => {
    const alertsList = [];
    // Exemplo: documento vencendo
    if (Math.random() > 0.7) {
      alertsList.push({
        type: 'warning',
        icon: 'exclamationmark.triangle.fill',
        text: 'CNH vence em 30 dias',
        color: colors.warning,
      });
    }
    // Exemplo: manutenção do veículo
    if (Math.random() > 0.5) {
      alertsList.push({
        type: 'info',
        icon: 'car.fill',
        text: 'Revisão do veículo recomendada',
        color: colors.info,
      });
    }
    return alertsList;
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.greeting, { color: colors.textSecondary }]}>Olá,</Text>
              <Text style={[styles.name, { color: colors.text }]}>João Silva</Text>
            </View>
            {/* Mensagem emocional */}
            <View style={[styles.emotionalCard, { backgroundColor: colors.primary + '10' }]}>
              <Text style={[styles.emotionalText, { color: colors.text }]}>
                {emotionalMessage.emoji} {emotionalMessage.text}
              </Text>
            </View>
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
          {/* Card de Lucro do Mês */}
          <Card style={[styles.earningsCard, { backgroundColor: colors.success + '10' }]}>
            <View style={styles.earningsHeader}>
              <View style={styles.earningsHeaderLeft}>
                <IconSymbol name="creditcard.fill" size={24} color={colors.success} />
                <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Lucro do mês</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/(driver)/earnings')}
                style={styles.seeAllButton}
                accessibilityLabel="Ver todas as receitas"
              >
                <Text style={[styles.seeAllText, { color: colors.primary }]}>Ver tudo</Text>
                <IconSymbol name="chevron.right" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.cardValue, { color: colors.success }]}>
              {formatters.currency(netProfit)}
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Receitas</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {formatters.currency(monthlyEarnings)}
                </Text>
              </View>
              <View style={styles.stat}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Despesas</Text>
                <Text style={[styles.statValue, { color: colors.error }]}>
                  -{formatters.currency(monthlyExpenses)}
                </Text>
              </View>
            </View>
            <View style={styles.totalAccumulated}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total acumulado</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {formatters.currency(totalEarnings)}
              </Text>
            </View>
          </Card>

          {/* Estatísticas principais */}
          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <IconSymbol name="map.fill" size={32} color={colors.primary} />
              <Text style={[styles.statNumber, { color: colors.text }]}>{activeRoutes}</Text>
              <Text style={[styles.statText, { color: colors.textSecondary }]}>Rotas ativas</Text>
            </Card>
            <Card style={styles.statCard}>
              <IconSymbol name="checkmark.circle.fill" size={32} color={colors.success} />
              <Text style={[styles.statNumber, { color: colors.text }]}>{completedRoutes}</Text>
              <Text style={[styles.statText, { color: colors.textSecondary }]}>Concluídas</Text>
            </Card>
          </View>

          {/* Estatísticas adicionais */}
          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <IconSymbol name="person.3.fill" size={28} color={colors.primary} />
              <Text style={[styles.statNumber, { color: colors.text }]}>{totalStudents}</Text>
              <Text style={[styles.statText, { color: colors.textSecondary }]}>Alunos</Text>
            </Card>
            <Card style={styles.statCard}>
              <IconSymbol name="location.fill" size={28} color={colors.info} />
              <Text style={[styles.statNumber, { color: colors.text }]}>{totalDistance.toFixed(1)}</Text>
              <Text style={[styles.statText, { color: colors.textSecondary }]}>km total</Text>
            </Card>
            <Card style={styles.statCard}>
              <IconSymbol name="clock.fill" size={28} color={colors.warning} />
              <Text style={[styles.statNumber, { color: colors.text }]}>{averageRouteTime}</Text>
              <Text style={[styles.statText, { color: colors.textSecondary }]}>min médio</Text>
            </Card>
          </View>

          {/* Próximas rotas do dia */}
          {todayRoutes.length > 0 && (
            <Card style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <IconSymbol name="calendar" size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Próximas rotas hoje</Text>
              </View>
              {todayRoutes.map((route) => (
                <TouchableOpacity
                  key={route.id}
                  style={styles.routePreview}
                  onPress={() => router.push(`/(driver)/itinerary?routeId=${route.id}`)}
                >
                  <View style={styles.routeInfo}>
                    <Text style={[styles.routeTime, { color: colors.text }]}>{route.startTime}</Text>
                    <Text style={[styles.routeSchool, { color: colors.textSecondary }]}>
                      {route.school.name}
                    </Text>
                    <Text style={[styles.routeStudents, { color: colors.textTertiary }]}>
                      {route.students.length} aluno{route.students.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <IconSymbol name="chevron.right" size={18} color={colors.textTertiary} />
                </TouchableOpacity>
              ))}
            </Card>
          )}

          {/* Status do veículo */}
          {driver?.vehicle && (
            <Card style={styles.vehicleCard}>
              <View style={styles.vehicleHeader}>
                <View style={styles.vehicleHeaderLeft}>
                  <IconSymbol name="car.fill" size={24} color={colors.primary} />
                  <View style={styles.vehicleInfo}>
                    <Text style={[styles.vehicleModel, { color: colors.text }]}>
                      {driver.vehicle.brand} {driver.vehicle.model}
                    </Text>
                    <Text style={[styles.vehiclePlate, { color: colors.textSecondary }]}>
                      {driver.vehicle.plate}
                    </Text>
                  </View>
                </View>
                {driver.vehicle.verified && (
                  <View style={[styles.verifiedBadge, { backgroundColor: colors.success + '20' }]}>
                    <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
                    <Text style={[styles.verifiedText, { color: colors.success }]}>Verificado</Text>
                  </View>
                )}
              </View>
              <View style={styles.vehicleStats}>
                <View style={styles.vehicleStat}>
                  <Text style={[styles.vehicleStatLabel, { color: colors.textSecondary }]}>Capacidade</Text>
                  <Text style={[styles.vehicleStatValue, { color: colors.text }]}>
                    {driver.vehicle.capacity} lugares
                  </Text>
                </View>
                <View style={styles.vehicleStat}>
                  <Text style={[styles.vehicleStatLabel, { color: colors.textSecondary }]}>Ano</Text>
                  <Text style={[styles.vehicleStatValue, { color: colors.text }]}>
                    {driver.vehicle.year}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.vehicleSeeAllButton}
                onPress={() => router.push('/(driver)/vehicle')}
                accessibilityLabel="Ver detalhes do veículo"
              >
                <Text style={[styles.vehicleSeeAllText, { color: colors.primary }]}>Ver tudo</Text>
                <IconSymbol name="chevron.right" size={16} color={colors.primary} />
              </TouchableOpacity>
            </Card>
          )}

          {/* Alertas importantes */}
          {alerts.length > 0 && (
            <Card style={[styles.alertsCard, { backgroundColor: colors.warning + '10' }]}>
              <View style={styles.sectionHeader}>
                <IconSymbol name="exclamationmark.triangle.fill" size={20} color={colors.warning} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Atenção</Text>
              </View>
              {alerts.map((alert, index) => (
                <View key={index} style={styles.alertItem}>
                  <IconSymbol name={alert.icon as any} size={18} color={alert.color} />
                  <Text style={[styles.alertText, { color: colors.text }]}>{alert.text}</Text>
                </View>
              ))}
            </Card>
          )}

          {/* Ações rápidas */}
          <View style={styles.quickActions}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: Spacing.md }]}>
              Ações rápidas
            </Text>
            <View style={styles.actionsGrid}>
              <View style={styles.quickActionCard}>
                <Card
                  style={styles.quickActionCardContent}
                  onPress={() => router.push('/(driver)/routes')}
                >
                  <IconSymbol name="map.fill" size={24} color={colors.primary} />
                  <Text style={[styles.quickActionText, { color: colors.text }]}>Gerenciar rotas</Text>
                </Card>
              </View>
              <View style={styles.quickActionCard}>
                <Card
                  style={styles.quickActionCardContent}
                  onPress={() => router.push('/(driver)/students')}
                >
                  <IconSymbol name="person.3.fill" size={24} color={colors.primary} />
                  <Text style={[styles.quickActionText, { color: colors.text }]}>Consultar alunos</Text>
                </Card>
              </View>
              <View style={styles.quickActionCard}>
                <Card
                  style={styles.quickActionCardContent}
                  onPress={() => router.push('/(driver)/expenses')}
                >
                  <IconSymbol name="creditcard.fill" size={24} color={colors.primary} />
                  <Text style={[styles.quickActionText, { color: colors.text }]}>Despesas</Text>
                </Card>
              </View>
              <View style={styles.quickActionCard}>
                <Card
                  style={styles.quickActionCardContent}
                  onPress={() => router.push('/(driver)/reports')}
                >
                  <IconSymbol name="chart.bar.fill" size={24} color={colors.primary} />
                  <Text style={[styles.quickActionText, { color: colors.text }]}>Relatórios</Text>
                </Card>
              </View>
            </View>
          </View>
        </View>
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
    marginBottom: Spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    ...Typography.styles.body,
  },
  name: {
    ...Typography.styles.h2,
    marginBottom: Spacing.sm,
  },
  emotionalCard: {
    padding: Spacing.sm,
    borderRadius: 8,
    marginTop: Spacing.sm,
  },
  emotionalText: {
    ...Typography.styles.bodySmall,
    fontSize: Typography.fontSize.sm,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  cards: {
    gap: Spacing.md,
  },
  earningsCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  earningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  earningsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  seeAllText: {
    ...Typography.styles.bodySmall,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
  },
  cardLabel: {
    ...Typography.styles.bodySmall,
    fontWeight: Typography.fontWeight.medium,
  },
  cardValue: {
    ...Typography.styles.h1,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    ...Typography.styles.caption,
    marginBottom: Spacing.xs,
    fontSize: Typography.fontSize.xs,
  },
  statValue: {
    ...Typography.styles.h4,
    fontSize: Typography.fontSize.base,
  },
  totalAccumulated: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
    alignItems: 'center',
    minHeight: 100,
  },
  statNumber: {
    ...Typography.styles.h3,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    fontSize: Typography.fontSize.xl,
  },
  statText: {
    ...Typography.styles.bodySmall,
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
  },
  sectionCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.styles.h4,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
  },
  routePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  routeInfo: {
    flex: 1,
  },
  routeTime: {
    ...Typography.styles.h4,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    marginBottom: Spacing.xs,
  },
  routeSchool: {
    ...Typography.styles.bodySmall,
    marginBottom: Spacing.xs,
  },
  routeStudents: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
  },
  vehicleCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  vehicleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleModel: {
    ...Typography.styles.h4,
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.xs,
  },
  vehiclePlate: {
    ...Typography.styles.bodySmall,
    fontSize: Typography.fontSize.sm,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  verifiedText: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  vehicleStats: {
    flexDirection: 'row',
    gap: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  vehicleStat: {
    flex: 1,
  },
  vehicleStatLabel: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
    marginBottom: Spacing.xs,
  },
  vehicleStatValue: {
    ...Typography.styles.bodySmall,
    fontSize: Typography.fontSize.sm,
  },
  vehicleSeeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  vehicleSeeAllText: {
    ...Typography.styles.bodySmall,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
  },
  alertsCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  alertText: {
    ...Typography.styles.bodySmall,
    fontSize: Typography.fontSize.sm,
    flex: 1,
  },
  quickActions: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.xs,
  },
  quickActionCard: {
    width: '50%',
    paddingHorizontal: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  quickActionCardContent: {
    width: '100%',
    padding: Spacing.lg,
    alignItems: 'center',
    minHeight: 110,
    justifyContent: 'center',
  },
  quickActionText: {
    ...Typography.styles.bodySmall,
    fontSize: Typography.fontSize.sm,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});
