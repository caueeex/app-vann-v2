/**
 * Vehicle Details Screen - VANN App
 * Página detalhada com informações e validações do veículo
 */

import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing, BorderRadius } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Badge } from '@/components/ui/Badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { formatters } from '@/utils/formatters';
import { useMockData } from '@/hooks/useMockData';
import { VehicleValidation, ValidationType } from '@/types/vehicle';

export default function VehicleDetailsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { getDriverById, getValidationsByVehicleId } = useMockData();

  // Dados do condutor (mock - em produção viria do contexto/backend)
  const driverId = '1';
  const driver = getDriverById(driverId);
  const vehicle = driver?.vehicle;

  // Buscar validações do veículo
  const validations = useMemo(() => {
    if (!vehicle) return [];
    return getValidationsByVehicleId(vehicle.id);
  }, [vehicle, getValidationsByVehicleId]);

  // Agrupar validações por status
  const validationsByStatus = useMemo(() => {
    const grouped = {
      valid: validations.filter((v) => v.status === 'valid'),
      expiring_soon: validations.filter((v) => v.status === 'expiring_soon'),
      expired: validations.filter((v) => v.status === 'expired'),
      pending: validations.filter((v) => v.status === 'pending'),
    };
    return grouped;
  }, [validations]);

  // Informações adicionais do veículo (mock)
  const vehicleDetails = useMemo(() => {
    if (!vehicle) return null;
    return {
      registrationNumber: '9BWZZZ377VT004251',
      renavam: '12345678901',
      fuelType: 'diesel' as const,
      mileage: 45000,
      lastMaintenance: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
  }, [vehicle]);

  const getValidationIcon = (type: ValidationType) => {
    switch (type) {
      case 'detran_inspection':
        return 'doc.text.fill';
      case 'city_inspection':
        return 'building.2.fill';
      case 'tachograph':
        return 'speedometer';
      case 'licensing':
        return 'creditcard.fill';
      case 'insurance':
        return 'shield.fill';
      case 'crlv':
        return 'doc.fill';
      case 'ipva':
        return 'dollarsign.circle.fill';
      case 'maintenance':
        return 'wrench.and.screwdriver.fill';
      default:
        return 'checkmark.circle.fill';
    }
  };

  const getValidationLabel = (type: ValidationType) => {
    switch (type) {
      case 'detran_inspection':
        return 'Vistoria DETRAN';
      case 'city_inspection':
        return 'Vistoria Prefeitura';
      case 'tachograph':
        return 'Tacógrafo';
      case 'licensing':
        return 'Licenciamento';
      case 'insurance':
        return 'Seguro';
      case 'crlv':
        return 'CRLV';
      case 'ipva':
        return 'IPVA';
      case 'maintenance':
        return 'Manutenção';
      default:
        return 'Validação';
    }
  };

  const getStatusBadgeVariant = (status: VehicleValidation['status']) => {
    switch (status) {
      case 'valid':
        return 'success';
      case 'expiring_soon':
        return 'warning';
      case 'expired':
        return 'error';
      case 'pending':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: VehicleValidation['status']) => {
    switch (status) {
      case 'valid':
        return 'Válido';
      case 'expiring_soon':
        return 'Vencendo em breve';
      case 'expired':
        return 'Vencido';
      case 'pending':
        return 'Pendente';
      default:
        return 'Não requerido';
    }
  };

  const getDaysUntilExpiry = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!vehicle) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Veículo" />
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Veículo não encontrado
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Detalhes do Veículo" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Informações principais do veículo */}
        <Card style={[styles.mainCard, { backgroundColor: colors.primary + '10' }]}>
          <View style={styles.mainHeader}>
            <View style={[styles.vehicleIconContainer, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol name="car.fill" size={32} color={colors.primary} />
            </View>
            <View style={styles.mainInfo}>
              <Text style={[styles.vehicleName, { color: colors.text }]}>
                {vehicle.brand} {vehicle.model}
              </Text>
              <Text style={[styles.vehiclePlate, { color: colors.textSecondary }]}>{vehicle.plate}</Text>
              {vehicle.verified && (
                <View style={styles.verifiedContainer}>
                  <Badge label="Verificado" variant="verified" size="small" />
                </View>
              )}
            </View>
          </View>
        </Card>

        {/* Informações técnicas */}
        <Card style={styles.infoCard}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="info.circle.fill" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Informações Técnicas</Text>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Ano</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{vehicle.year}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Cor</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{vehicle.color}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Capacidade</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {vehicle.capacity} lugares
              </Text>
            </View>
            {vehicleDetails && (
              <>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Combustível</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {vehicleDetails.fuelType === 'diesel'
                      ? 'Diesel'
                      : vehicleDetails.fuelType === 'gasoline'
                        ? 'Gasolina'
                        : vehicleDetails.fuelType === 'flex'
                          ? 'Flex'
                          : vehicleDetails.fuelType === 'electric'
                            ? 'Elétrico'
                            : 'Etanol'}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Quilometragem</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {vehicleDetails.mileage?.toLocaleString('pt-BR')} km
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Chassi</Text>
                  <Text style={[styles.infoValue, { color: colors.text, fontSize: Typography.fontSize.xs }]}>
                    {vehicleDetails.registrationNumber}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>RENAVAM</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {vehicleDetails.renavam}
                  </Text>
                </View>
              </>
            )}
          </View>
        </Card>

        {/* Manutenção */}
        {vehicleDetails && (
          <Card style={styles.maintenanceCard}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="wrench.and.screwdriver.fill" size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Manutenção</Text>
            </View>
            <View style={styles.maintenanceInfo}>
              <View style={styles.maintenanceItem}>
                <Text style={[styles.maintenanceLabel, { color: colors.textSecondary }]}>
                  Última manutenção
                </Text>
                <Text style={[styles.maintenanceValue, { color: colors.text }]}>
                  {formatters.date(vehicleDetails.lastMaintenance)}
                </Text>
              </View>
              <View style={styles.maintenanceItem}>
                <Text style={[styles.maintenanceLabel, { color: colors.textSecondary }]}>
                  Próxima manutenção
                </Text>
                <Text style={[styles.maintenanceValue, { color: colors.warning }]}>
                  {formatters.date(vehicleDetails.nextMaintenance)}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Resumo de validações */}
        <Card style={styles.summaryCard}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="checkmark.shield.fill" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Status das Validações</Text>
          </View>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: colors.success + '20' }]}>
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
              </View>
              <Text style={[styles.summaryNumber, { color: colors.text }]}>
                {validationsByStatus.valid.length}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Válidas</Text>
            </View>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: colors.warning + '20' }]}>
                <IconSymbol name="exclamationmark.triangle.fill" size={20} color={colors.warning} />
              </View>
              <Text style={[styles.summaryNumber, { color: colors.text }]}>
                {validationsByStatus.expiring_soon.length}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Vencendo</Text>
            </View>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: colors.error + '20' }]}>
                <IconSymbol name="xmark.circle.fill" size={20} color={colors.error} />
              </View>
              <Text style={[styles.summaryNumber, { color: colors.text }]}>
                {validationsByStatus.expired.length}
              </Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Vencidas</Text>
            </View>
          </View>
        </Card>

        {/* Lista de validações */}
        <View style={styles.validationsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: Spacing.md }]}>
            Validações e Documentos
          </Text>

          {validations.length === 0 ? (
            <Card style={styles.emptyCard}>
              <IconSymbol name="doc.text" size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Nenhuma validação encontrada
              </Text>
            </Card>
          ) : (
            validations.map((validation) => {
              const daysUntilExpiry = getDaysUntilExpiry(validation.expiryDate);
              return (
                <Card key={validation.id} style={styles.validationCard}>
                  <View style={styles.validationHeader}>
                    <View
                      style={[
                        styles.validationIconContainer,
                        { backgroundColor: colors.primary + '20' },
                      ]}
                    >
                      <IconSymbol
                        name={getValidationIcon(validation.type) as any}
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.validationInfo}>
                      <Text style={[styles.validationTitle, { color: colors.text }]}>
                        {getValidationLabel(validation.type)}
                      </Text>
                      {validation.documentNumber && (
                        <Text style={[styles.validationDocument, { color: colors.textSecondary }]}>
                          {validation.documentNumber}
                        </Text>
                      )}
                    </View>
                    <Badge
                      label={getStatusLabel(validation.status)}
                      variant={getStatusBadgeVariant(validation.status)}
                      size="small"
                    />
                  </View>

                  <View style={styles.validationDetails}>
                    {validation.issuingAgency && (
                      <View style={styles.validationDetailRow}>
                        <IconSymbol name="building.2.fill" size={14} color={colors.icon} />
                        <Text style={[styles.validationDetailText, { color: colors.textSecondary }]}>
                          {validation.issuingAgency}
                        </Text>
                      </View>
                    )}
                    {validation.issueDate && (
                      <View style={styles.validationDetailRow}>
                        <IconSymbol name="calendar" size={14} color={colors.icon} />
                        <Text style={[styles.validationDetailText, { color: colors.textSecondary }]}>
                          Emitido em {formatters.date(validation.issueDate)}
                        </Text>
                      </View>
                    )}
                    {validation.expiryDate && (
                      <View style={styles.validationDetailRow}>
                        <IconSymbol
                          name={
                            validation.status === 'expired'
                              ? 'exclamationmark.triangle.fill'
                              : validation.status === 'expiring_soon'
                                ? 'clock.fill'
                                : 'calendar'
                          }
                          size={14}
                          color={
                            validation.status === 'expired'
                              ? colors.error
                              : validation.status === 'expiring_soon'
                                ? colors.warning
                                : colors.icon
                          }
                        />
                        <Text
                          style={[
                            styles.validationDetailText,
                            {
                              color:
                                validation.status === 'expired'
                                  ? colors.error
                                  : validation.status === 'expiring_soon'
                                    ? colors.warning
                                    : colors.textSecondary,
                              fontWeight:
                                validation.status === 'expired' || validation.status === 'expiring_soon'
                                  ? Typography.fontWeight.semiBold
                                  : Typography.fontWeight.regular,
                            },
                          ]}
                        >
                          {validation.status === 'expired'
                            ? `Vencido em ${formatters.date(validation.expiryDate)}`
                            : daysUntilExpiry !== null && daysUntilExpiry <= 30
                              ? `Vence em ${daysUntilExpiry} ${daysUntilExpiry === 1 ? 'dia' : 'dias'} (${formatters.date(validation.expiryDate)})`
                              : `Válido até ${formatters.date(validation.expiryDate)}`}
                        </Text>
                      </View>
                    )}
                  </View>

                  {validation.notes && (
                    <View style={styles.validationNotes}>
                      <Text style={[styles.validationNotesText, { color: colors.textTertiary }]}>
                        {validation.notes}
                      </Text>
                    </View>
                  )}
                </Card>
              );
            })
          )}
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
    paddingTop: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    ...Typography.styles.body,
    textAlign: 'center',
  },
  mainCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  vehicleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  vehicleName: {
    ...Typography.styles.h2,
    fontSize: Typography.fontSize.xl,
  },
  vehiclePlate: {
    ...Typography.styles.body,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
  },
  verifiedContainer: {
    marginTop: Spacing.xs,
  },
  infoCard: {
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
    fontWeight: Typography.fontWeight.semiBold,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  infoItem: {
    width: '48%',
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
  maintenanceCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  maintenanceInfo: {
    gap: Spacing.md,
  },
  maintenanceItem: {
    gap: Spacing.xs,
  },
  maintenanceLabel: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
  },
  maintenanceValue: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.medium,
  },
  summaryCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: Spacing.md,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
    gap: Spacing.xs,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  summaryNumber: {
    ...Typography.styles.h2,
    fontSize: Typography.fontSize.xl,
  },
  summaryLabel: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
  },
  validationsSection: {
    marginBottom: Spacing.xl,
  },
  validationCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  validationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  validationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  validationInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  validationTitle: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.semiBold,
  },
  validationDocument: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
  },
  validationDetails: {
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  validationDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  validationDetailText: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
  },
  validationNotes: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  validationNotesText: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
    fontStyle: 'italic',
  },
  emptyCard: {
    padding: Spacing['2xl'],
    alignItems: 'center',
    gap: Spacing.md,
  },
});
