/**
 * Driver Expenses Screen - VANN App
 * Página de despesas do condutor com categorias e filtros
 */

import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Badge } from '@/components/ui/Badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { formatters } from '@/utils/formatters';
import { useMockData } from '@/hooks/useMockData';
import { Expense, ExpenseCategory, ExpenseSummary } from '@/types/expenses';
import { AddExpenseModal, ExpenseFormData } from '@/components/ui/AddExpenseModal';

type FilterType = 'all' | 'thisMonth' | 'lastMonth' | ExpenseCategory;

export default function DriverExpensesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { getExpensesByDriverId } = useMockData();
  const [filter, setFilter] = useState<FilterType>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [localExpenses, setLocalExpenses] = useState<Expense[]>([]);
  const EXPENSES_PER_PAGE = 5; // Quantas despesas mostrar por página

  // Dados do condutor (mock - em produção viria do contexto/backend)
  const driverId = '1';
  const mockExpenses = getExpensesByDriverId(driverId);
  
  // Combinar despesas mockadas com as locais (adicionadas pelo usuário)
  const allExpenses = useMemo(() => {
    return [...mockExpenses, ...localExpenses];
  }, [mockExpenses, localExpenses]);

  // Calcular resumo de despesas
  const summary: ExpenseSummary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const thisMonthExpenses = allExpenses.filter((e) => {
      const date = new Date(e.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const lastMonthExpenses = allExpenses.filter((e) => {
      const date = new Date(e.date);
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    });

    const total = allExpenses.reduce((sum, e) => sum + e.amount, 0);
    const thisMonth = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const growth = lastMonthTotal > 0 ? ((thisMonth - lastMonthTotal) / lastMonthTotal) * 100 : 0;

    // Agrupar por categoria
    const byCategory: Record<ExpenseCategory, number> = {
      maintenance: 0,
      fuel: 0,
      tire: 0,
      insurance: 0,
      parking: 0,
      toll: 0,
      cleaning: 0,
      documentation: 0,
      other: 0,
    };

    thisMonthExpenses.forEach((expense) => {
      byCategory[expense.category] += expense.amount;
    });

    return {
      total,
      monthly: thisMonth,
      thisMonth,
      lastMonth: lastMonthTotal,
      byCategory,
      growth: Math.round(growth),
    };
  }, [allExpenses]);

  // Filtrar despesas
  const filteredExpenses = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let filtered = allExpenses;

    switch (filter) {
      case 'thisMonth':
        filtered = allExpenses.filter((e) => {
          const date = new Date(e.date);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });
        break;
      case 'lastMonth':
        filtered = allExpenses.filter((e) => {
          const date = new Date(e.date);
          return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        });
        break;
      case 'all':
        filtered = allExpenses;
        break;
      default:
        // Filtro por categoria
        filtered = allExpenses.filter((e) => e.category === filter);
        break;
    }

    return filtered.sort((a, b) => b.date.localeCompare(a.date));
  }, [allExpenses, filter]);

  // Calcular paginação
  const totalPages = Math.ceil(filteredExpenses.length / EXPENSES_PER_PAGE);
  const paginatedExpenses = useMemo(() => {
    const startIndex = currentPage * EXPENSES_PER_PAGE;
    const endIndex = startIndex + EXPENSES_PER_PAGE;
    return filteredExpenses.slice(startIndex, endIndex);
  }, [filteredExpenses, currentPage]);

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

  const handleAddExpense = (formData: ExpenseFormData) => {
    // Converter valor para número
    const amount = parseFloat(formData.amount.replace(/[^\d,.-]/g, '').replace(',', '.'));
    
    // Criar nova despesa
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      driverId: driverId,
      vehicleId: 'v1', // Mock - em produção viria do contexto
      date: formData.date,
      amount: amount,
      category: formData.category as ExpenseCategory,
      description: formData.description,
      notes: formData.notes || undefined,
      createdAt: new Date().toISOString(),
    };

    // Adicionar à lista local (em produção, seria uma chamada de API)
    setLocalExpenses((prev) => [newExpense, ...prev]);
    
    // Resetar página para mostrar a nova despesa
    setCurrentPage(0);
    setFilter('all');
  };

  const getCategoryIcon = (category: ExpenseCategory) => {
    switch (category) {
      case 'maintenance':
        return 'wrench.and.screwdriver.fill';
      case 'fuel':
        return 'fuelpump.fill';
      case 'tire':
        return 'circle.fill';
      case 'insurance':
        return 'shield.fill';
      case 'parking':
        return 'parkingsign.fill';
      case 'toll':
        return 'road.lanes';
      case 'cleaning':
        return 'sparkles';
      case 'documentation':
        return 'doc.fill';
      case 'other':
        return 'ellipsis.circle.fill';
      default:
        return 'creditcard.fill';
    }
  };

  const getCategoryLabel = (category: ExpenseCategory) => {
    switch (category) {
      case 'maintenance':
        return 'Manutenção';
      case 'fuel':
        return 'Combustível';
      case 'tire':
        return 'Pneus';
      case 'insurance':
        return 'Seguro';
      case 'parking':
        return 'Estacionamento';
      case 'toll':
        return 'Pedágio';
      case 'cleaning':
        return 'Lavagem';
      case 'documentation':
        return 'Documentação';
      case 'other':
        return 'Outros';
      default:
        return 'Despesa';
    }
  };

  const getCategoryColor = (category: ExpenseCategory) => {
    switch (category) {
      case 'maintenance':
        return colors.warning;
      case 'fuel':
        return colors.primary;
      case 'tire':
        return colors.info;
      case 'insurance':
        return colors.error;
      case 'parking':
        return colors.textSecondary;
      case 'toll':
        return colors.primary;
      case 'cleaning':
        return colors.info;
      case 'documentation':
        return colors.warning;
      case 'other':
        return colors.textTertiary;
      default:
        return colors.text;
    }
  };

  // Obter categorias únicas
  const uniqueCategories = useMemo(() => {
    const categoriesSet = new Set<ExpenseCategory>();
    allExpenses.forEach((expense) => {
      categoriesSet.add(expense.category);
    });
    return Array.from(categoriesSet);
  }, [allExpenses]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Despesas" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Resumo de despesas */}
        <View style={styles.summarySection}>
          <Card style={[styles.summaryCard, { backgroundColor: colors.error + '10' }]}>
            <View style={styles.summaryHeader}>
              <IconSymbol name="creditcard.fill" size={24} color={colors.error} />
              <Text style={[styles.summaryTitle, { color: colors.text }]}>Total de despesas</Text>
            </View>
            <Text style={[styles.summaryValue, { color: colors.error }]}>
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
                    color={summary.growth > 0 ? colors.error : colors.success}
                  />
                  <Text
                    style={[
                      styles.growthText,
                      { color: summary.growth > 0 ? colors.error : colors.success },
                    ]}
                  >
                    {Math.abs(summary.growth)}%
                  </Text>
                </View>
              )}
            </Card>

            <Card style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Mês passado</Text>
              <Text style={[styles.summaryAmount, { color: colors.text }]}>
                {formatters.currency(summary.lastMonth)}
              </Text>
            </Card>
          </View>
        </View>

        {/* Resumo por categoria */}
        <Card style={styles.categoriesCard}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="chart.pie.fill" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Despesas por Categoria</Text>
          </View>
          <View style={styles.categoriesGrid}>
            {Object.entries(summary.byCategory)
              .filter(([_, amount]) => amount > 0)
              .sort(([_, a], [__, b]) => b - a)
              .slice(0, 6)
              .map(([category, amount]) => (
                <View key={category} style={styles.categoryItem}>
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: getCategoryColor(category as ExpenseCategory) + '20' },
                    ]}
                  >
                    <IconSymbol
                      name={getCategoryIcon(category as ExpenseCategory) as any}
                      size={20}
                      color={getCategoryColor(category as ExpenseCategory)}
                    />
                  </View>
                  <Text style={[styles.categoryLabel, { color: colors.textSecondary }]}>
                    {getCategoryLabel(category as ExpenseCategory)}
                  </Text>
                  <Text style={[styles.categoryAmount, { color: colors.text }]}>
                    {formatters.currency(amount)}
                  </Text>
                </View>
              ))}
          </View>
        </Card>

        {/* Filtros */}
        <View style={styles.filtersSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
            {(['all', 'thisMonth', 'lastMonth'] as FilterType[]).map((filterOption) => (
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
                      : 'Mês passado'}
                </Text>
              </TouchableOpacity>
            ))}
            {uniqueCategories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: filter === category ? colors.primary : colors.backgroundSecondary,
                    borderColor: filter === category ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => handleFilterChange(category)}
              >
                <IconSymbol
                  name={getCategoryIcon(category) as any}
                  size={14}
                  color={filter === category ? '#FFFFFF' : getCategoryColor(category)}
                />
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: filter === category ? '#FFFFFF' : colors.text,
                      fontWeight:
                        filter === category
                          ? Typography.fontWeight.semiBold
                          : Typography.fontWeight.regular,
                    },
                  ]}
                >
                  {getCategoryLabel(category)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lista de despesas */}
        <View style={styles.expensesSection}>
          <View style={styles.resultsHeader}>
            <Text style={[styles.resultsTitle, { color: colors.text }]}>
              {filteredExpenses.length} {filteredExpenses.length === 1 ? 'despesa encontrada' : 'despesas encontradas'}
            </Text>
          </View>

          {filteredExpenses.length === 0 ? (
            <Card style={styles.emptyCard}>
              <IconSymbol name="creditcard" size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Nenhuma despesa encontrada
              </Text>
            </Card>
          ) : (
            <>
              {paginatedExpenses.map((expense) => (
                <Card key={expense.id} style={styles.expenseCard}>
                  <View style={styles.expenseHeader}>
                    <View
                      style={[
                        styles.expenseIconContainer,
                        { backgroundColor: getCategoryColor(expense.category) + '20' },
                      ]}
                    >
                      <IconSymbol
                        name={getCategoryIcon(expense.category) as any}
                        size={20}
                        color={getCategoryColor(expense.category)}
                      />
                    </View>
                    <View style={styles.expenseInfo}>
                      <Text style={[styles.expenseDescription, { color: colors.text }]}>
                        {expense.description}
                      </Text>
                      <View style={styles.expenseMeta}>
                        <Badge
                          label={getCategoryLabel(expense.category)}
                          variant="default"
                          size="small"
                        />
                        <Text style={[styles.expenseDate, { color: colors.textTertiary }]}>
                          {formatters.date(expense.date)}
                        </Text>
                      </View>
                      {expense.notes && (
                        <Text style={[styles.expenseNotes, { color: colors.textSecondary }]}>
                          {expense.notes}
                        </Text>
                      )}
                    </View>
                    <View style={styles.expenseAmountContainer}>
                      <Text style={[styles.expenseAmount, { color: colors.error }]}>
                        -{formatters.currency(expense.amount)}
                      </Text>
                    </View>
                  </View>
                </Card>
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
                        {filteredExpenses.length} {filteredExpenses.length === 1 ? 'despesa' : 'despesas'} no total
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
                            backgroundColor: index === currentPage ? colors.primary : colors.border,
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

      {/* Botão FAB para adicionar despesa */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            bottom: insets.bottom + Spacing.lg,
          },
        ]}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.8}
        accessibilityLabel="Adicionar nova despesa"
      >
        <IconSymbol name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modal de adicionar despesa */}
      <AddExpenseModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddExpense}
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
  categoriesCard: {
    padding: Spacing.md,
    marginBottom: Spacing.xl,
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  categoryItem: {
    width: '30%',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  categoryLabel: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
  },
  categoryAmount: {
    ...Typography.styles.bodySmall,
    fontWeight: Typography.fontWeight.semiBold,
    textAlign: 'center',
  },
  filtersSection: {
    marginBottom: Spacing.xl,
  },
  filters: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  filterText: {
    ...Typography.styles.bodySmall,
    fontSize: Typography.fontSize.sm,
  },
  expensesSection: {
    gap: Spacing.md,
  },
  resultsHeader: {
    marginBottom: Spacing.sm,
  },
  resultsTitle: {
    ...Typography.styles.h4,
    fontWeight: Typography.fontWeight.semiBold,
  },
  expenseCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  expenseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  expenseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  expenseDescription: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.medium,
  },
  expenseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  expenseDate: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
  },
  expenseNotes: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
    fontStyle: 'italic',
  },
  expenseAmountContainer: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    ...Typography.styles.h4,
    fontWeight: Typography.fontWeight.bold,
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
