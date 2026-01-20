/**
 * Driver Routes Screen - VANN App
 * Tela de rotas do condutor com UX/UI aprimorada
 */

import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { CreateRouteModal } from '@/components/ui/CreateRouteModal';
import { useMockData } from '@/hooks/useMockData';
import { formatters } from '@/utils/formatters';
import { Route } from '@/types/driver';
import { mockChildren, mockSchool1, mockSchool2, mockSchool3 } from '@/mocks/routes';

export default function DriverRoutesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { routes } = useMockData();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [localRoutes, setLocalRoutes] = useState<Route[]>([]);

  // Filtrar rotas do condutor (mock - em produção viria do contexto)
  const driverId = '1';
  const mockDriverRoutes = routes.filter((r) => r.driverId === driverId);
  
  // Combinar rotas mockadas com as locais (criadas pelo usuário)
  const driverRoutes = useMemo(() => {
    return [...mockDriverRoutes, ...localRoutes];
  }, [mockDriverRoutes, localRoutes]);

  // Agrupar rotas por data
  const groupedRoutes = useMemo(() => {
    const grouped: { [key: string]: typeof driverRoutes } = {};
    driverRoutes.forEach((route) => {
      const dateKey = route.date;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(route);
    });
    return grouped;
  }, [driverRoutes]);

  // Ordenar datas
  const sortedDates = useMemo(() => {
    return Object.keys(groupedRoutes).sort((a, b) => a.localeCompare(b));
  }, [groupedRoutes]);

  const getStatusConfig = (status: string) => {
    if (status === 'scheduled') {
      return {
        label: 'Agendada',
        bgColor: colors.primary + '15',
        textColor: colors.primary,
        icon: 'clock.fill',
      };
    }
    if (status === 'in_progress') {
      return {
        label: 'Em andamento',
        bgColor: colors.info + '15',
        textColor: colors.info,
        icon: 'play.fill',
      };
    }
    return {
      label: 'Concluída',
      bgColor: colors.success + '15',
      textColor: colors.success,
      icon: 'checkmark.circle.fill',
    };
  };

  if (driverRoutes.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Minhas rotas" />
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconContainer, { backgroundColor: colors.primary + '10' }]}>
            <IconSymbol name="map.fill" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Nenhuma rota encontrada</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Suas rotas agendadas aparecerão aqui
          </Text>
        </View>
      </View>
    );
  }

  // Obter escolas únicas dos alunos disponíveis
  const availableSchools = useMemo(() => {
    const schoolsMap = new Map();
    mockChildren.forEach((child) => {
      if (!schoolsMap.has(child.school.id)) {
        schoolsMap.set(child.school.id, child.school);
      }
    });
    return Array.from(schoolsMap.values());
  }, []);

  // Handler para criar nova rota
  const handleCreateRoute = (routeData: Omit<Route, 'id'>) => {
    const newRoute: Route = {
      ...routeData,
      id: `route-${Date.now()}`,
    };
    setLocalRoutes((prev) => [newRoute, ...prev]);
    setShowCreateModal(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Minhas rotas" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {sortedDates.map((date) => (
          <View key={date} style={styles.dateSection}>
            <View style={styles.dateHeader}>
              <IconSymbol name="calendar" size={18} color={colors.primary} />
              <Text style={[styles.dateLabel, { color: colors.text }]}>
                {formatters.date(date)}
              </Text>
              <View style={[styles.dateBadge, { backgroundColor: colors.primary + '10' }]}>
                <Text style={[styles.dateBadgeText, { color: colors.primary }]}>
                  {groupedRoutes[date].length}
                </Text>
              </View>
            </View>

            {groupedRoutes[date].map((route) => {
              const statusConfig = getStatusConfig(route.status);
              return (
                <Card key={route.id} style={styles.routeCard} padding="large">
                  {/* Header da rota */}
                  <View style={styles.routeHeader}>
                    <View style={styles.routeHeaderLeft}>
                      <Text style={[styles.routeSchool, { color: colors.text }]}>
                        {route.school.name}
                      </Text>
                      <View style={styles.routeMeta}>
                        <IconSymbol name="location.fill" size={14} color={colors.textTertiary} />
                        <Text style={[styles.routeAddress, { color: colors.textTertiary }]}>
                          {route.school.address.street}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
                      <IconSymbol name={statusConfig.icon as any} size={12} color={statusConfig.textColor} />
                      <Text style={[styles.statusText, { color: statusConfig.textColor }]}>
                        {statusConfig.label}
                      </Text>
                    </View>
                  </View>

                  {/* Preview do mapa */}
                  <TouchableOpacity
                    style={styles.mapPreview}
                    onPress={() => router.push(`/(driver)/itinerary?routeId=${route.id}`)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.mapPlaceholder, { backgroundColor: colors.backgroundSecondary }]}>
                      <View style={[styles.mapIconContainer, { backgroundColor: colors.primary + '20' }]}>
                        <IconSymbol name="map.fill" size={36} color={colors.primary} />
                      </View>
                      <Text style={[styles.mapText, { color: colors.text }]}>
                        {route.students.length} {route.students.length === 1 ? 'parada' : 'paradas'}
                      </Text>
                      <View style={styles.mapPins}>
                        {route.students.slice(0, 4).map((_, index) => (
                          <View
                            key={index}
                            style={[styles.pin, { backgroundColor: colors.primary }]}
                          />
                        ))}
                        {route.students.length > 4 && (
                          <Text style={[styles.pinText, { color: colors.textSecondary }]}>
                            +{route.students.length - 4}
                          </Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Informações da rota */}
                  <View style={styles.routeInfo}>
                    <View style={styles.infoItem}>
                      <View style={[styles.infoIconContainer, { backgroundColor: colors.primary + '10' }]}>
                        <IconSymbol name="clock.fill" size={16} color={colors.primary} />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Horário</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                          {route.startTime} - {route.endTime}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.infoItem}>
                      <View style={[styles.infoIconContainer, { backgroundColor: colors.info + '10' }]}>
                        <IconSymbol name="person.3.fill" size={16} color={colors.info} />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Alunos</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                          {route.students.length} {route.students.length === 1 ? 'aluno' : 'alunos'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.infoItem}>
                      <View style={[styles.infoIconContainer, { backgroundColor: colors.warning + '10' }]}>
                        <IconSymbol name="location.fill" size={16} color={colors.warning} />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Distância</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                          {route.totalDistance.toFixed(1)} km
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Ações */}
                  <View style={styles.actions}>
                    <Button
                      title="Ver itinerário"
                      variant="outline"
                      size="small"
                      onPress={() => router.push(`/(driver)/itinerary?routeId=${route.id}`)}
                      style={[styles.actionButton, styles.secondaryButton]}
                      textStyle={styles.buttonText}
                      leftIcon={<IconSymbol name="map.fill" size={14} color={colors.primary} />}
                    />
                    <Button
                      title={route.status === 'scheduled' ? 'Iniciar rota' : 'Continuar'}
                      variant="primary"
                      size="small"
                      onPress={() => router.push(`/(driver)/itinerary?routeId=${route.id}`)}
                      style={styles.actionButton}
                      textStyle={styles.buttonText}
                      leftIcon={
                        <IconSymbol
                          name={route.status === 'scheduled' ? 'play.fill' : 'arrow.right'}
                          size={14}
                          color="#FFFFFF"
                        />
                      }
                    />
                  </View>
                </Card>
              );
            })}
          </View>
        ))}
      </ScrollView>

      {/* Botão FAB para criar nova rota */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            bottom: insets.bottom + Spacing.lg,
          },
        ]}
        onPress={() => setShowCreateModal(true)}
        activeOpacity={0.8}
        accessibilityLabel="Criar nova rota"
      >
        <IconSymbol name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modal de criar rota */}
      <CreateRouteModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateRoute}
        availableStudents={mockChildren}
        availableSchools={availableSchools}
      />
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
    paddingTop: Spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
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
    textAlign: 'center',
  },
  emptyText: {
    ...Typography.styles.body,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  dateSection: {
    marginBottom: Spacing.xl,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  dateLabel: {
    ...Typography.styles.h4,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    flex: 1,
  },
  dateBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    minWidth: 24,
    alignItems: 'center',
  },
  dateBadgeText: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
  },
  routeCard: {
    marginBottom: Spacing.md,
    // O padding é controlado pelo prop padding="large" do Card
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  routeHeaderLeft: {
    flex: 1,
    marginRight: Spacing.md,
  },
  routeSchool: {
    ...Typography.styles.h4,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    marginBottom: Spacing.xs,
  },
  routeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  routeAddress: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
  },
  mapPreview: {
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  mapIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  mapText: {
    ...Typography.styles.bodySmall,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    marginTop: Spacing.xs,
  },
  mapPins: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  pin: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  pinText: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
    marginLeft: Spacing.xs,
  },
  routeInfo: {
    marginBottom: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
    marginBottom: 2,
  },
  infoValue: {
    ...Typography.styles.bodySmall,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'stretch',
    marginTop: Spacing.xs,
  },
  actionButton: {
    flex: 1,
    minHeight: 44,
    // Usar flexBasis para garantir que os botões dividam o espaço igualmente
    flexBasis: 0,
  },
  buttonText: {
    fontSize: Typography.fontSize.sm,
  },
  secondaryButton: {
    borderWidth: 1.5,
  },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
    elevation: 8,
  },
});
