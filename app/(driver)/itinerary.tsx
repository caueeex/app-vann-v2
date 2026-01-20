/**
 * Driver Itinerary Screen - VANN App
 * Tela de itinerário do condutor com informações detalhadas da rota
 */

import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useMockData } from '@/hooks/useMockData';
import { formatters } from '@/utils/formatters';

export default function DriverItineraryScreen() {
  const router = useRouter();
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { getRouteById } = useMockData();
  const [showEditModal, setShowEditModal] = useState(false);

  const route = getRouteById(routeId || '');

  if (!route) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Rota não encontrada" showBack />
      </View>
    );
  }

  // Preparar dados
  const sortedStudents = [...route.students].sort((a, b) => a.pickupOrder - b.pickupOrder);
  
  // Primeiro ponto de pickup (local de partida)
  const firstPickup = sortedStudents[0]?.pickupLocation;
  const pickupAddress = firstPickup?.address || 'Endereço não disponível';

  // Configuração de status
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

  const statusConfig = getStatusConfig(route.status);

  const handleStartRoute = () => {
    // Navegar para a página de rota ativa com o mapa
    router.push(`/(driver)/route-active?routeId=${routeId}`);
  };

  const handleEditRoute = () => {
    // Ação de editar rota
    setShowEditModal(true);
  };


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Itinerário" showBack />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Card de informações da rota */}
        <Card style={styles.routeInfoCard} padding="large">
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
        </Card>

        {/* Card de instrução */}
        <Card style={styles.instructionCard} padding="medium">
          <View style={styles.instructionHeader}>
            <View style={[styles.instructionIconContainer, { backgroundColor: colors.primary + '10' }]}>
              <IconSymbol name="info.circle.fill" size={20} color={colors.primary} />
            </View>
            <View style={styles.instructionContent}>
              <Text style={[styles.instructionTitle, { color: colors.text }]}>
                Instruções
              </Text>
              <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
                Espere no local de partida próximo de {pickupAddress}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: colors.primary + '10' }]}
              onPress={handleEditRoute}
              activeOpacity={0.7}
            >
              <IconSymbol name="pencil" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Lista de alunos ordenada */}
        <Card style={styles.studentsCard} padding="large">
          <View style={styles.studentsHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Ordem de Coleta
            </Text>
            <Badge
              label={`${sortedStudents.length} ${sortedStudents.length === 1 ? 'parada' : 'paradas'}`}
              variant="default"
              size="small"
            />
          </View>
          
          <View style={styles.studentsList}>
            {sortedStudents.map((student, index) => (
              <View key={student.id} style={styles.studentItem}>
                <View style={[styles.orderBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.orderText}>{student.pickupOrder}</Text>
                </View>
                <View style={styles.studentInfo}>
                  <Text style={[styles.studentName, { color: colors.text }]}>
                    {student.student.name}
                  </Text>
                  <View style={styles.studentMeta}>
                    <IconSymbol name="location.fill" size={12} color={colors.textTertiary} />
                    <Text style={[styles.studentAddress, { color: colors.textTertiary }]} numberOfLines={1}>
                      {student.pickupLocation.address}
                    </Text>
                  </View>
                </View>
                {index < sortedStudents.length - 1 && (
                  <View style={[styles.connector, { borderColor: colors.border }]} />
                )}
              </View>
            ))}
            {/* Destino final - Escola */}
            <View style={styles.studentItem}>
              <View style={[styles.orderBadge, { backgroundColor: colors.success }]}>
                <IconSymbol name="building.2.fill" size={14} color="#FFFFFF" />
              </View>
              <View style={styles.studentInfo}>
                <Text style={[styles.studentName, { color: colors.text }]}>
                  {route.school.name}
                </Text>
                <View style={styles.studentMeta}>
                  <IconSymbol name="location.fill" size={12} color={colors.textTertiary} />
                  <Text style={[styles.studentAddress, { color: colors.textTertiary }]} numberOfLines={1}>
                    {route.school.address.street}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* Botão Iniciar Rota */}
        <Button
          title={route.status === 'scheduled' ? 'Iniciar rota' : 'Continuar rota'}
          variant="primary"
          size="large"
          fullWidth
          leftIcon={
            <IconSymbol
              name={route.status === 'scheduled' ? 'play.fill' : 'arrow.right'}
              size={20}
              color="#FFFFFF"
            />
          }
          onPress={handleStartRoute}
          style={styles.startRouteButton}
        />
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
    paddingTop: Spacing.lg,
  },
  routeInfoCard: {
    marginBottom: Spacing.md,
    ...Shadows.sm,
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
  routeInfo: {
    marginTop: Spacing.md,
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
  instructionCard: {
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  instructionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionContent: {
    flex: 1,
  },
  instructionTitle: {
    ...Typography.styles.h4,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    marginBottom: Spacing.xs,
  },
  instructionText: {
    ...Typography.styles.bodySmall,
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentsCard: {
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  studentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.styles.h4,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
  },
  studentsList: {
    gap: Spacing.xs,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    position: 'relative',
    paddingLeft: Spacing.xs,
  },
  orderBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  orderText: {
    ...Typography.styles.bodySmall,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: '#FFFFFF',
  },
  studentInfo: {
    flex: 1,
    paddingTop: 2,
  },
  studentName: {
    ...Typography.styles.bodySmall,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.xs / 2,
  },
  studentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs / 2,
  },
  studentAddress: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
    flex: 1,
  },
  connector: {
    position: 'absolute',
    left: 13,
    top: 28,
    width: 2,
    height: 20,
    borderLeftWidth: 2,
    borderStyle: 'dashed',
  },
  startRouteButton: {
    marginBottom: Spacing.md,
  },
});
