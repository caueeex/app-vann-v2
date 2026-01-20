/**
 * Student Detail Modal Component - VANN App
 * Modal de detalhes do aluno com opções de editar e excluir
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Button } from './Button';
import { IconSymbol } from './icon-symbol';
import { Child } from '@/types/user';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface StudentWithRouteInfo extends Child {
  routeId: string;
  routeStartTime: string;
  routeEndTime?: string;
  pickupOrder: number;
  routeStatus: string;
}

interface StudentDetailModalProps {
  visible: boolean;
  onClose: () => void;
  student: StudentWithRouteInfo | null;
  onEdit?: (student: StudentWithRouteInfo) => void;
  onDelete?: (studentId: string) => void;
}

export function StudentDetailModal({
  visible,
  onClose,
  student,
  onEdit,
  onDelete,
}: StudentDetailModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const handleEdit = () => {
    if (student && onEdit) {
      onEdit(student);
      onClose();
    }
  };

  const handleDelete = () => {
    if (!student) return;

    Alert.alert(
      'Excluir Aluno',
      `Tem certeza que deseja excluir ${student.name} da rota?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            if (onDelete) {
              onDelete(student.id);
            }
            onClose();
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!visible || !student) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={styles.modalContentContainer}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.background,
                paddingBottom: insets.bottom + Spacing.md,
              },
            ]}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.headerLeft}>
                <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
                  <IconSymbol name="person.fill" size={32} color={colors.primary} />
                </View>
                <View style={styles.headerInfo}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>{student.name}</Text>
                  <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                    {student.age} anos
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <IconSymbol name="xmark.circle.fill" size={24} color={colors.textTertiary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {/* Informações do Aluno */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Informações Pessoais</Text>
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <View style={[styles.infoIcon, { backgroundColor: colors.primary + '20' }]}>
                      <IconSymbol name="person.fill" size={18} color={colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Nome</Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>{student.name}</Text>
                    </View>
                  </View>
                  <View style={styles.infoRow}>
                    <View style={[styles.infoIcon, { backgroundColor: colors.primary + '20' }]}>
                      <IconSymbol name="calendar" size={18} color={colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Idade</Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>{student.age} anos</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Escola */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Escola</Text>
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <View style={[styles.infoIcon, { backgroundColor: colors.primary + '20' }]}>
                      <IconSymbol name="building.2.fill" size={18} color={colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Nome da Escola</Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>{student.school.name}</Text>
                    </View>
                  </View>
                  {student.school.address.address && (
                    <View style={styles.infoRow}>
                      <View style={[styles.infoIcon, { backgroundColor: colors.primary + '20' }]}>
                        <IconSymbol name="location.fill" size={18} color={colors.primary} />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Endereço</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                          {student.school.address.address}
                        </Text>
                        {(student.school.address.city || student.school.address.state) && (
                          <Text style={[styles.infoSubValue, { color: colors.textTertiary }]}>
                            {student.school.address.city}
                            {student.school.address.city && student.school.address.state && ', '}
                            {student.school.address.state}
                          </Text>
                        )}
                      </View>
                    </View>
                  )}
                  {student.school.phone && (
                    <View style={styles.infoRow}>
                      <View style={[styles.infoIcon, { backgroundColor: colors.primary + '20' }]}>
                        <IconSymbol name="phone.fill" size={18} color={colors.primary} />
                      </View>
                      <View style={styles.infoContent}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Telefone</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{student.school.phone}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>

              {/* Localização de Coleta */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Localização de Coleta</Text>
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <View style={[styles.infoIcon, { backgroundColor: colors.primary + '20' }]}>
                      <IconSymbol name="location.fill" size={18} color={colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Endereço</Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>
                        {student.pickupLocation.address || 'Endereço não informado'}
                      </Text>
                      {(student.pickupLocation.city || student.pickupLocation.state) && (
                        <Text style={[styles.infoSubValue, { color: colors.textTertiary }]}>
                          {student.pickupLocation.city}
                          {student.pickupLocation.city && student.pickupLocation.state && ', '}
                          {student.pickupLocation.state}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>

              {/* Informações da Rota */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Informações da Rota</Text>
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <View style={[styles.infoIcon, { backgroundColor: colors.primary + '20' }]}>
                      <IconSymbol name="clock.fill" size={18} color={colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Horário</Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>
                        {student.routeStartTime}
                        {student.routeEndTime && ` - ${student.routeEndTime}`}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.infoRow}>
                    <View style={[styles.infoIcon, { backgroundColor: colors.primary + '20' }]}>
                      <IconSymbol name="list.number" size={18} color={colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Ordem de Coleta</Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>
                        {student.pickupOrder}º aluno a ser coletado
                      </Text>
                    </View>
                  </View>
                  <View style={styles.infoRow}>
                    <View style={[styles.infoIcon, { backgroundColor: colors.primary + '20' }]}>
                      <IconSymbol name="checkmark.circle.fill" size={18} color={colors.primary} />
                    </View>
                    <View style={styles.infoContent}>
                      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Status da Rota</Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>
                        {student.routeStatus === 'scheduled'
                          ? 'Agendada'
                          : student.routeStatus === 'in_progress'
                            ? 'Em andamento'
                            : student.routeStatus === 'completed'
                              ? 'Concluída'
                              : 'Cancelada'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Footer com ações */}
            <View style={styles.modalFooter}>
              <Button
                title="Editar"
                variant="outline"
                size="medium"
                onPress={handleEdit}
                style={styles.actionButton}
                leftIcon={<IconSymbol name="pencil" size={18} color={colors.primary} />}
              />
              <Button
                title="Excluir"
                variant="danger"
                size="medium"
                onPress={handleDelete}
                style={styles.actionButton}
                leftIcon={<IconSymbol name="trash.fill" size={18} color="#FFFFFF" />}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContentContainer: {
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.9,
    ...Shadows.lg,
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  modalTitle: {
    ...Typography.styles.h3,
    fontWeight: Typography.fontWeight.bold,
  },
  modalSubtitle: {
    ...Typography.styles.body,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  scrollView: {
    flexGrow: 0,
    flexShrink: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.styles.h4,
    fontWeight: Typography.fontWeight.semiBold,
    marginBottom: Spacing.md,
  },
  infoCard: {
    gap: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  infoLabel: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
  },
  infoValue: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.medium,
  },
  infoSubValue: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  actionButton: {
    flex: 1,
  },
});
