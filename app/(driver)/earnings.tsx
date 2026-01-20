/**
 * Driver Earnings Screen - VANN App
 * Página detalhada de receitas do condutor
 */

import { useMemo, useState } from 'react';
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
import { Earnings, EarningsSummary } from '@/types/earnings';

type FilterType = 'all' | 'paid' | 'pending' | 'thisMonth' | 'lastMonth';

export default function DriverEarningsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { getEarningsByDriverId } = useMockData();
  const [filter, setFilter] = useState<FilterType>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const MONTHS_PER_PAGE = 3; // Quantos meses mostrar por página

  // Dados do condutor (mock - em produção viria do contexto/backend)
  const driverId = '1';
  const allEarnings = getEarningsByDriverId(driverId);

  // Calcular resumo de receitas
  const summary: EarningsSummary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const thisMonthEarnings = allEarnings.filter((e) => {
      const date = new Date(e.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear && e.status === 'paid';
    });

    const lastMonthEarnings = allEarnings.filter((e) => {
      const date = new Date(e.date);
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear && e.status === 'paid';
    });

    const total = allEarnings.filter((e) => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);
    const monthly = thisMonthEarnings.reduce((sum, e) => sum + e.amount, 0);
    const pending = allEarnings.filter((e) => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);
    const thisMonth = thisMonthEarnings.reduce((sum, e) => sum + e.amount, 0);
    const lastMonthTotal = lastMonthEarnings.reduce((sum, e) => sum + e.amount, 0);
    const growth = lastMonthTotal > 0 ? ((thisMonth - lastMonthTotal) / lastMonthTotal) * 100 : 0;

    return {
      total,
      monthly,
      pending,
      thisMonth,
      lastMonth: lastMonthTotal,
      growth: Math.round(growth),
    };
  }, [allEarnings]);

  // Filtrar receitas
  const filteredEarnings = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    switch (filter) {
      case 'paid':
        return allEarnings.filter((e) => e.status === 'paid');
      case 'pending':
        return allEarnings.filter((e) => e.status === 'pending');
      case 'thisMonth':
        return allEarnings.filter((e) => {
          const date = new Date(e.date);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });
      case 'lastMonth':
        return allEarnings.filter((e) => {
          const date = new Date(e.date);
          return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        });
      default:
        return allEarnings;
    }
  }, [allEarnings, filter]);

  // Agrupar receitas por mês
  const earningsByMonth = useMemo(() => {
    const grouped: Record<string, Earnings[]> = {};
    filteredEarnings.forEach((earning) => {
      const monthKey = earning.date.substring(0, 7); // YYYY-MM
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(earning);
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([month, earnings]) => ({
        month,
        earnings: earnings.sort((a, b) => b.date.localeCompare(a.date)),
        total: earnings.filter((e) => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0),
      }));
  }, [filteredEarnings]);

  // Calcular paginação
  const totalPages = Math.ceil(earningsByMonth.length / MONTHS_PER_PAGE);
  const paginatedMonths = useMemo(() => {
    const startIndex = currentPage * MONTHS_PER_PAGE;
    const endIndex = startIndex + MONTHS_PER_PAGE;
    return earningsByMonth.slice(startIndex, endIndex);
  }, [earningsByMonth, currentPage]);

  // Resetar página quando o filtro mudar
  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setCurrentPage(0);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getTypeIcon = (type: Earnings['type']) => {
    switch (type) {
      case 'route':
        return 'map.fill';
      case 'monthly':
        return 'creditcard.fill';
      case 'bonus':
        return 'star.fill';
      case 'refund':
        return 'arrow.uturn.backward';
      default:
        return 'dollarsign.circle.fill';
    }
  };

  const getTypeLabel = (type: Earnings['type']) => {
    switch (type) {
      case 'route':
        return 'Rota';
      case 'monthly':
        return 'Mensalidade';
      case 'bonus':
        return 'Bônus';
      case 'refund':
        return 'Reembolso';
      default:
        return 'Receita';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Receitas" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Resumo de receitas */}
        <View style={styles.summarySection}>
          <Card style={[styles.summaryCard, { backgroundColor: colors.success + '10' }]}>
            <View style={styles.summaryHeader}>
              <IconSymbol name="creditcard.fill" size={24} color={colors.success} />
              <Text style={[styles.summaryTitle, { color: colors.text }]}>Total acumulado</Text>
            </View>
            <Text style={[styles.summaryValue, { color: colors.success }]}>
              {formatters.currency(summary.total)}
            </Text>
          </Card>

          <View style={styles.summaryGrid}>
            <Card style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Este mês</Text>
              <Text style={[styles.summaryAmount, { color: colors.text }]}>
                {formatters.currency(summary.thisMonth)}
              </Text>
              {summary.growth !== 0 && (
                <View style={styles.growthContainer}>
                  <IconSymbol
                    name={summary.growth > 0 ? 'arrow.up' : 'arrow.down'}
                    size={12}
                    color={summary.growth > 0 ? colors.success : colors.error}
                  />
                  <Text
                    style={[
                      styles.growthText,
                      { color: summary.growth > 0 ? colors.success : colors.error },
                    ]}
                  >
                    {Math.abs(summary.growth)}%
                  </Text>
                </View>
              )}
            </Card>

            <Card style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Pendentes</Text>
              <Text style={[styles.summaryAmount, { color: colors.warning }]}>
                {formatters.currency(summary.pending)}
              </Text>
            </Card>
          </View>
        </View>

        {/* Filtros */}
        <View style={styles.filtersSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
            {(['all', 'thisMonth', 'lastMonth', 'paid', 'pending'] as FilterType[]).map((filterOption) => (
              <TouchableOpacity
                key={filterOption}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: filter === filterOption ? colors.primary : colors.backgroundSecondary,
                    borderColor: filter === filterOption ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => handleFilterChange(filterOption)}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: filter === filterOption ? '#FFFFFF' : colors.text,
                      fontWeight:
                        filter === filterOption
                          ? Typography.fontWeight.semiBold
                          : Typography.fontWeight.regular,
                    },
                  ]}
                >
                  {filterOption === 'all'
                    ? 'Todas'
                    : filterOption === 'thisMonth'
                      ? 'Este mês'
                      : filterOption === 'lastMonth'
                        ? 'Mês passado'
                        : filterOption === 'paid'
                          ? 'Recebidas'
                          : 'Pendentes'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lista de receitas agrupadas por mês */}
        <View style={styles.earningsSection}>
          {earningsByMonth.length === 0 ? (
            <Card style={styles.emptyCard}>
              <IconSymbol name="creditcard" size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Nenhuma receita encontrada
              </Text>
            </Card>
          ) : (
            <>
              {paginatedMonths.map(({ month, earnings, total }) => (
                <View key={month} style={styles.monthGroup}>
                <View style={styles.monthHeader}>
                  <Text style={[styles.monthTitle, { color: colors.text }]}>
                    {new Date(month + '-01').toLocaleDateString('pt-BR', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                  <Text style={[styles.monthTotal, { color: colors.textSecondary }]}>
                    {formatters.currency(total)}
                  </Text>
                </View>

                {earnings.map((earning) => (
                  <Card key={earning.id} style={styles.earningCard}>
                    <View style={styles.earningHeader}>
                      <View style={[styles.earningIconContainer, { backgroundColor: colors.primary + '20' }]}>
                        <IconSymbol
                          name={getTypeIcon(earning.type) as any}
                          size={20}
                          color={colors.primary}
                        />
                      </View>
                      <View style={styles.earningInfo}>
                        <Text style={[styles.earningDescription, { color: colors.text }]} numberOfLines={1}>
                          {earning.description}
                        </Text>
                        <View style={styles.earningMeta}>
                          <Text style={[styles.earningType, { color: colors.textSecondary }]}>
                            {getTypeLabel(earning.type)}
                          </Text>
                          <Text style={[styles.earningDate, { color: colors.textTertiary }]}>
                            {formatters.date(earning.date)}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.earningAmountContainer}>
                        <Text style={[styles.earningAmount, { color: colors.text }]}>
                          {formatters.currency(earning.amount)}
                        </Text>
                        <Badge
                          label={earning.status === 'paid' ? 'Recebido' : 'Pendente'}
                          variant={earning.status === 'paid' ? 'success' : 'warning'}
                          size="small"
                        />
                      </View>
                    </View>
                    {earning.paidAt && (
                      <View style={styles.earningFooter}>
                        <IconSymbol name="checkmark.circle.fill" size={14} color={colors.success} />
                        <Text style={[styles.paidAtText, { color: colors.textSecondary }]}>
                          Recebido em {formatters.date(earning.paidAt)}
                        </Text>
                      </View>
                    )}
                  </Card>
                ))}
                </View>
              ))}

              {/* Controles de paginação */}
              {totalPages > 1 && (
                <Card style={[styles.paginationCard, { backgroundColor: colors.backgroundSecondary }]}>
                  <View style={styles.paginationContainer}>
                    <TouchableOpacity
                      style={[
                        styles.paginationButton,
                        {
                          backgroundColor: currentPage === 0 ? colors.border : colors.primary,
                          opacity: currentPage === 0 ? 0.5 : 1,
                        },
                      ]}
                      onPress={handlePreviousPage}
                      disabled={currentPage === 0}
                      accessibilityLabel="Página anterior"
                    >
                      <IconSymbol
                        name="chevron.left"
                        size={20}
                        color={currentPage === 0 ? colors.textTertiary : '#FFFFFF'}
                      />
                    </TouchableOpacity>

                    <View style={styles.paginationInfo}>
                      <Text style={[styles.paginationText, { color: colors.text }]}>
                        Página {currentPage + 1} de {totalPages}
                      </Text>
                      <Text style={[styles.paginationSubtext, { color: colors.textSecondary }]}>
                        {earningsByMonth.length} {earningsByMonth.length === 1 ? 'mês' : 'meses'} no total
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.paginationButton,
                        {
                          backgroundColor: currentPage === totalPages - 1 ? colors.border : colors.primary,
                          opacity: currentPage === totalPages - 1 ? 0.5 : 1,
                        },
                      ]}
                      onPress={handleNextPage}
                      disabled={currentPage === totalPages - 1}
                      accessibilityLabel="Próxima página"
                    >
                      <IconSymbol
                        name="chevron.right"
                        size={20}
                        color={currentPage === totalPages - 1 ? colors.textTertiary : '#FFFFFF'}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Indicadores de página */}
                  <View style={styles.paginationDots}>
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.paginationDot,
                          {
                            backgroundColor:
                              index === currentPage ? colors.primary : colors.border,
                            width: index === currentPage ? 24 : 8,
                          },
                        ]}
                        onPress={() => setCurrentPage(index)}
                        accessibilityLabel={`Ir para página ${index + 1}`}
                      />
                    ))}
                  </View>
                </Card>
              )}
            </>
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
  summarySection: {
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  summaryCard: {
    padding: Spacing.lg,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  summaryTitle: {
    ...Typography.styles.bodySmall,
    fontWeight: Typography.fontWeight.medium,
  },
  summaryValue: {
    ...Typography.styles.h1,
    fontSize: Typography.fontSize['3xl'],
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  summaryItem: {
    flex: 1,
    padding: Spacing.md,
  },
  summaryLabel: {
    ...Typography.styles.caption,
    marginBottom: Spacing.xs,
  },
  summaryAmount: {
    ...Typography.styles.h3,
    marginBottom: Spacing.xs,
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  growthText: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  filtersSection: {
    marginBottom: Spacing.xl,
  },
  filters: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  filterText: {
    ...Typography.styles.bodySmall,
    fontSize: Typography.fontSize.sm,
  },
  earningsSection: {
    gap: Spacing.xl,
  },
  monthGroup: {
    gap: Spacing.md,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  monthTitle: {
    ...Typography.styles.h4,
    textTransform: 'capitalize',
  },
  monthTotal: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.semiBold,
  },
  earningCard: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  earningHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  earningIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earningInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  earningDescription: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.medium,
  },
  earningMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  earningType: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
  },
  earningDate: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
  },
  earningAmountContainer: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  earningAmount: {
    ...Typography.styles.h4,
    fontWeight: Typography.fontWeight.bold,
  },
  earningFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  paidAtText: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
  },
  emptyCard: {
    padding: Spacing['2xl'],
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyText: {
    ...Typography.styles.body,
    textAlign: 'center',
  },
  paginationCard: {
    padding: Spacing.md,
    marginTop: Spacing.xl,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  paginationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationInfo: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  paginationText: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.semiBold,
  },
  paginationSubtext: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
  },
});
