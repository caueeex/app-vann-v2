/**
 * Reports Screen - VANN App
 * Página de relatórios com exportação para CSV
 */

import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing, BorderRadius } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { formatters } from '@/utils/formatters';
import { useMockData } from '@/hooks/useMockData';
import { exportToCSV, formatDateForCSV, formatCurrencyForCSV } from '@/utils/csv-export';

type ReportType = 'earnings' | 'expenses' | 'students' | 'routes' | 'summary';
type PeriodType = 'thisMonth' | 'lastMonth' | 'last3Months' | 'last6Months' | 'thisYear' | 'all';

export default function ReportsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const {
    getEarningsByDriverId,
    getExpensesByDriverId,
    routes,
    drivers,
  } = useMockData();

  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('thisMonth');
  const [isExporting, setIsExporting] = useState(false);

  // Dados do condutor (mock - em produção viria do contexto/backend)
  const driverId = '1';
  const driver = drivers.find((d) => d.id === driverId);
  const driverRoutes = routes.filter((r) => r.driverId === driverId);
  const allEarnings = getEarningsByDriverId(driverId);
  const allExpenses = getExpensesByDriverId(driverId);

  // Calcular período
  const getDateRange = (period: PeriodType): { start: Date; end: Date } => {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    let start: Date;

    switch (period) {
      case 'thisMonth':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'lastMonth':
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end.setMonth(now.getMonth() - 1);
        end.setDate(new Date(now.getFullYear(), now.getMonth(), 0).getDate());
        break;
      case 'last3Months':
        start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case 'last6Months':
        start = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case 'thisYear':
        start = new Date(now.getFullYear(), 0, 1);
        break;
      case 'all':
      default:
        start = new Date(2000, 0, 1); // Data muito antiga para pegar tudo
        break;
    }

    return { start, end };
  };

  // Filtrar dados por período
  const { start, end } = getDateRange(selectedPeriod);

  const filteredEarnings = useMemo(() => {
    return allEarnings.filter((earning) => {
      const date = new Date(earning.date);
      return date >= start && date <= end;
    });
  }, [allEarnings, start, end]);

  const filteredExpenses = useMemo(() => {
    return allExpenses.filter((expense) => {
      const date = new Date(expense.date);
      return date >= start && date <= end;
    });
  }, [allExpenses, start, end]);

  const filteredRoutes = useMemo(() => {
    return driverRoutes.filter((route) => {
      const date = new Date(route.date);
      return date >= start && date <= end;
    });
  }, [driverRoutes, start, end]);

  // Obter todos os alunos únicos das rotas
  const allStudents = useMemo(() => {
    const studentsMap = new Map();
    driverRoutes.forEach((route) => {
      route.students.forEach((student) => {
        if (!studentsMap.has(student.id)) {
          studentsMap.set(student.id, {
            ...student,
            routeId: route.id,
            routeDate: route.date,
            routeStatus: route.status,
          });
        }
      });
    });
    return Array.from(studentsMap.values());
  }, [driverRoutes]);

  // Função para exportar receitas
  const exportEarnings = async () => {
    setIsExporting(true);
    try {
      const headers = ['Data', 'Valor', 'Tipo', 'Descrição', 'Status', 'Data de Pagamento'];
      const rows = filteredEarnings.map((earning) => [
        formatDateForCSV(earning.date),
        formatCurrencyForCSV(earning.amount),
        earning.type === 'route' ? 'Rota' : earning.type === 'monthly' ? 'Mensal' : earning.type === 'bonus' ? 'Bônus' : 'Reembolso',
        earning.description,
        earning.status === 'paid' ? 'Pago' : earning.status === 'pending' ? 'Pendente' : 'Cancelado',
        earning.paidAt ? formatDateForCSV(earning.paidAt) : '-',
      ]);

      await exportToCSV({
        filename: `receitas_${selectedPeriod}_${new Date().toISOString().split('T')[0]}`,
        headers,
        rows,
      });
    } catch (error) {
      console.error('Erro ao exportar receitas:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Função para exportar despesas
  const exportExpenses = async () => {
    setIsExporting(true);
    try {
      const headers = ['Data', 'Valor', 'Categoria', 'Descrição', 'Observações'];
      const rows = filteredExpenses.map((expense) => [
        formatDateForCSV(expense.date),
        formatCurrencyForCSV(expense.amount),
        getCategoryLabel(expense.category),
        expense.description,
        expense.notes || '-',
      ]);

      await exportToCSV({
        filename: `despesas_${selectedPeriod}_${new Date().toISOString().split('T')[0]}`,
        headers,
        rows,
      });
    } catch (error) {
      console.error('Erro ao exportar despesas:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Função para exportar alunos
  const exportStudents = async () => {
    setIsExporting(true);
    try {
      const headers = ['Nome', 'Idade', 'Escola', 'Endereço da Escola', 'Telefone da Escola', 'Endereço de Coleta', 'Data da Rota', 'Status da Rota'];
      const rows = allStudents.map((student) => [
        student.name,
        `${student.age} anos`,
        student.school.name,
        student.school.address.address || '-',
        student.school.phone || '-',
        student.pickupLocation.address || '-',
        formatDateForCSV(student.routeDate),
        student.routeStatus === 'scheduled' ? 'Agendada' : student.routeStatus === 'in_progress' ? 'Em andamento' : student.routeStatus === 'completed' ? 'Concluída' : 'Cancelada',
      ]);

      await exportToCSV({
        filename: `alunos_${new Date().toISOString().split('T')[0]}`,
        headers,
        rows,
      });
    } catch (error) {
      console.error('Erro ao exportar alunos:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Função para exportar rotas
  const exportRoutes = async () => {
    setIsExporting(true);
    try {
      const headers = ['Data', 'Horário', 'Status', 'Distância (km)', 'Duração (min)', 'Número de Alunos', 'Endereço de Origem', 'Endereço de Destino'];
      const rows = filteredRoutes.map((route) => [
        formatDateForCSV(route.date),
        `${route.startTime} - ${route.endTime || 'N/A'}`,
        route.status === 'scheduled' ? 'Agendada' : route.status === 'in_progress' ? 'Em andamento' : route.status === 'completed' ? 'Concluída' : 'Cancelada',
        route.totalDistance.toFixed(2),
        route.totalDuration.toString(),
        route.students.length.toString(),
        route.origin.address || '-',
        route.destination.address || '-',
      ]);

      await exportToCSV({
        filename: `rotas_${selectedPeriod}_${new Date().toISOString().split('T')[0]}`,
        headers,
        rows,
      });
    } catch (error) {
      console.error('Erro ao exportar rotas:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Função para exportar resumo completo
  const exportSummary = async () => {
    setIsExporting(true);
    try {
      const totalEarnings = filteredEarnings.reduce((sum, e) => sum + e.amount, 0);
      const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
      const netProfit = totalEarnings - totalExpenses;
      const totalRoutes = filteredRoutes.length;
      const totalStudents = allStudents.length;

      const headers = ['Métrica', 'Valor'];
      const rows = [
        ['Período', getPeriodLabel(selectedPeriod)],
        ['Total de Receitas', formatCurrencyForCSV(totalEarnings)],
        ['Total de Despesas', formatCurrencyForCSV(totalExpenses)],
        ['Lucro Líquido', formatCurrencyForCSV(netProfit)],
        ['Número de Rotas', totalRoutes.toString()],
        ['Número de Alunos', totalStudents.toString()],
        ['Média de Receita por Rota', formatCurrencyForCSV(totalRoutes > 0 ? totalEarnings / totalRoutes : 0)],
        ['Média de Despesa por Rota', formatCurrencyForCSV(totalRoutes > 0 ? totalExpenses / totalRoutes : 0)],
      ];

      await exportToCSV({
        filename: `resumo_${selectedPeriod}_${new Date().toISOString().split('T')[0]}`,
        headers,
        rows,
      });
    } catch (error) {
      console.error('Erro ao exportar resumo:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      maintenance: 'Manutenção',
      fuel: 'Combustível',
      tire: 'Pneus',
      insurance: 'Seguro',
      parking: 'Estacionamento',
      toll: 'Pedágio',
      cleaning: 'Lavagem',
      documentation: 'Documentação',
      other: 'Outros',
    };
    return labels[category] || category;
  };

  const getPeriodLabel = (period: PeriodType): string => {
    const labels: Record<PeriodType, string> = {
      thisMonth: 'Este Mês',
      lastMonth: 'Mês Passado',
      last3Months: 'Últimos 3 Meses',
      last6Months: 'Últimos 6 Meses',
      thisYear: 'Este Ano',
      all: 'Todos os Períodos',
    };
    return labels[period];
  };

  const handleExport = async () => {
    if (!selectedReport) {
      Alert.alert('Atenção', 'Selecione um tipo de relatório para exportar.');
      return;
    }

    switch (selectedReport) {
      case 'earnings':
        await exportEarnings();
        break;
      case 'expenses':
        await exportExpenses();
        break;
      case 'students':
        await exportStudents();
        break;
      case 'routes':
        await exportRoutes();
        break;
      case 'summary':
        await exportSummary();
        break;
    }
  };

  const reportTypes: Array<{ type: ReportType; label: string; icon: string; description: string }> = [
    {
      type: 'earnings',
      label: 'Receitas',
      icon: 'creditcard.fill',
      description: `${filteredEarnings.length} registros`,
    },
    {
      type: 'expenses',
      label: 'Despesas',
      icon: 'arrow.down.circle.fill',
      description: `${filteredExpenses.length} registros`,
    },
    {
      type: 'students',
      label: 'Alunos',
      icon: 'person.2.fill',
      description: `${allStudents.length} alunos`,
    },
    {
      type: 'routes',
      label: 'Rotas',
      icon: 'map.fill',
      description: `${filteredRoutes.length} rotas`,
    },
    {
      type: 'summary',
      label: 'Resumo Completo',
      icon: 'chart.bar.fill',
      description: 'Visão geral do período',
    },
  ];

  const periods: Array<{ value: PeriodType; label: string }> = [
    { value: 'thisMonth', label: 'Este Mês' },
    { value: 'lastMonth', label: 'Mês Passado' },
    { value: 'last3Months', label: 'Últimos 3 Meses' },
    { value: 'last6Months', label: 'Últimos 6 Meses' },
    { value: 'thisYear', label: 'Este Ano' },
    { value: 'all', label: 'Todos' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Relatórios" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção de Período */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="calendar" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Período</Text>
          </View>
          <View style={styles.periodsGrid}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.value}
                style={[
                  styles.periodButton,
                  {
                    backgroundColor: selectedPeriod === period.value ? colors.primary : colors.backgroundSecondary,
                    borderColor: selectedPeriod === period.value ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setSelectedPeriod(period.value)}
              >
                <Text
                  style={[
                    styles.periodText,
                    {
                      color: selectedPeriod === period.value ? '#FFFFFF' : colors.text,
                      fontWeight:
                        selectedPeriod === period.value
                          ? Typography.fontWeight.semiBold
                          : Typography.fontWeight.regular,
                    },
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Seção de Tipos de Relatório */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="doc.text.fill" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tipo de Relatório</Text>
          </View>
          <View style={styles.reportsGrid}>
            {reportTypes.map((report) => (
              <TouchableOpacity
                key={report.type}
                style={[
                  styles.reportCard,
                  {
                    backgroundColor: selectedReport === report.type ? colors.primary + '10' : colors.card,
                    borderColor: selectedReport === report.type ? colors.primary : colors.border,
                    borderWidth: selectedReport === report.type ? 2 : 1,
                  },
                ]}
                onPress={() => setSelectedReport(report.type)}
              >
                <View
                  style={[
                    styles.reportIcon,
                    { backgroundColor: selectedReport === report.type ? colors.primary + '20' : colors.backgroundSecondary },
                  ]}
                >
                  <IconSymbol
                    name={report.icon as any}
                    size={24}
                    color={selectedReport === report.type ? colors.primary : colors.textSecondary}
                  />
                </View>
                <Text
                  style={[
                    styles.reportLabel,
                    {
                      color: selectedReport === report.type ? colors.primary : colors.text,
                      fontWeight:
                        selectedReport === report.type
                          ? Typography.fontWeight.semiBold
                          : Typography.fontWeight.regular,
                    },
                  ]}
                >
                  {report.label}
                </Text>
                <Text style={[styles.reportDescription, { color: colors.textSecondary }]}>
                  {report.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Botão de Exportar */}
        <Button
          title={isExporting ? 'Exportando...' : 'Exportar para CSV'}
          variant="primary"
          size="large"
          onPress={handleExport}
          disabled={!selectedReport || isExporting}
          style={styles.exportButton}
          leftIcon={
            isExporting ? (
              <IconSymbol name="arrow.down.circle" size={20} color="#FFFFFF" />
            ) : (
              <IconSymbol name="square.and.arrow.down.fill" size={20} color="#FFFFFF" />
            )
          }
        />

        {/* Informações */}
        <Card style={[styles.infoCard, { backgroundColor: colors.info + '10' }]}>
          <View style={styles.infoHeader}>
            <IconSymbol name="info.circle.fill" size={20} color={colors.info} />
            <Text style={[styles.infoTitle, { color: colors.text }]}>Sobre a Exportação</Text>
          </View>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Os relatórios serão exportados em formato CSV e você poderá compartilhá-los via email, mensagens ou
            salvá-los no dispositivo. O arquivo contém todas as informações do período selecionado.
          </Text>
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
    paddingTop: Spacing.md,
  },
  sectionCard: {
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
  periodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  periodButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  periodText: {
    ...Typography.styles.bodySmall,
    fontSize: Typography.fontSize.sm,
  },
  reportsGrid: {
    gap: Spacing.md,
  },
  reportCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  reportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportLabel: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.medium,
    flex: 1,
  },
  reportDescription: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
  },
  exportButton: {
    marginBottom: Spacing.xl,
  },
  infoCard: {
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  infoTitle: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.semiBold,
  },
  infoText: {
    ...Typography.styles.bodySmall,
    lineHeight: Typography.fontSize.base * 1.5,
  },
});
