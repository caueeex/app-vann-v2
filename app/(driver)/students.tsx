/**
 * Students Search Screen - VANN App
 * Página de consulta de alunos seguindo o padrão da busca de condutores
 */

import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing, Shadows } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/ui/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { StudentFilterModal, StudentFilterOptions } from '@/components/ui/StudentFilterModal';
import { StudentDetailModal } from '@/components/ui/StudentDetailModal';
import { useMockData } from '@/hooks/useMockData';
import { Child } from '@/types/user';
import { RouteStudent } from '@/types/driver';

interface StudentWithRoute extends Child {
  routeId: string;
  routeStartTime: string;
  routeEndTime?: string;
  pickupOrder: number;
  routeStatus: string;
}

export default function StudentsSearchScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { routes, getDriverById } = useMockData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<StudentFilterOptions>({});
  const [selectedStudent, setSelectedStudent] = useState<StudentWithRoute | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  // Dados do condutor (mock - em produção viria do contexto/backend)
  const driverId = '1';
  const driver = getDriverById(driverId);
  const driverRoutes = routes.filter((r) => r.driverId === driverId);

  // Extrair todos os alunos únicos das rotas do condutor
  const allStudents: StudentWithRoute[] = useMemo(() => {
    const studentsMap = new Map<string, StudentWithRoute>();

    driverRoutes.forEach((route) => {
      route.students.forEach((routeStudent: RouteStudent) => {
        const studentId = routeStudent.student.id;
        if (!studentsMap.has(studentId)) {
          studentsMap.set(studentId, {
            ...routeStudent.student,
            routeId: route.id,
            routeStartTime: route.startTime,
            routeEndTime: route.endTime,
            pickupOrder: routeStudent.pickupOrder,
            routeStatus: route.status,
          });
        }
      });
    });

    return Array.from(studentsMap.values());
  }, [driverRoutes]);

  // Extrair opções de filtro dos dados disponíveis
  const filterOptions = useMemo(() => {
    const schoolsMap = new Map<string, { id: string; name: string }>();
    const neighborhoodsSet = new Set<string>();
    const timesSet = new Set<string>();

    allStudents.forEach((student) => {
      // Escolas
      if (!schoolsMap.has(student.school.id)) {
        schoolsMap.set(student.school.id, {
          id: student.school.id,
          name: student.school.name,
        });
      }

      // Bairros (extrair do endereço)
      if (student.pickupLocation.address) {
        const parts = student.pickupLocation.address.split(',');
        if (parts.length >= 3) {
          neighborhoodsSet.add(parts[2].trim());
        }
      }

      // Horários
      timesSet.add(student.routeStartTime);
    });

    return {
      schools: Array.from(schoolsMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
      neighborhoods: Array.from(neighborhoodsSet).sort(),
      times: Array.from(timesSet).sort(),
    };
  }, [allStudents]);

  // Filtrar alunos
  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      // Filtro por nome
      const matchesName = !searchQuery || student.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro por escola
      const matchesSchool = !filters.school || student.school.id === filters.school;

      // Filtro por bairro
      let matchesNeighborhood = true;
      if (filters.neighborhood) {
        const address = student.pickupLocation.address || '';
        const parts = address.split(',');
        const neighborhood = parts.length >= 3 ? parts[2].trim() : '';
        matchesNeighborhood = neighborhood.toLowerCase().includes(filters.neighborhood.toLowerCase());
      }

      // Filtro por horário
      const matchesTime = !filters.time || student.routeStartTime === filters.time;

      return matchesName && matchesSchool && matchesNeighborhood && matchesTime;
    });
  }, [allStudents, searchQuery, filters]);

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Consultar Alunos" />
      <View style={styles.searchRow}>
        <View style={[styles.searchContainer, { backgroundColor: colors.card, ...Shadows.sm }]}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Buscar por nome..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <IconSymbol name="xmark.circle.fill" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: activeFiltersCount > 0 ? colors.primary : colors.card,
              ...Shadows.sm,
            },
          ]}
          onPress={() => setShowFilters(true)}
        >
          <IconSymbol
            name="list.bullet"
            size={20}
            color={activeFiltersCount > 0 ? '#FFFFFF' : colors.icon}
          />
          {activeFiltersCount > 0 && (
            <View style={[styles.filterBadge, { backgroundColor: '#FFFFFF' }]}>
              <Text style={[styles.filterBadgeText, { color: colors.primary }]}>
                {activeFiltersCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Chips de filtros ativos */}
      {activeFiltersCount > 0 && (
        <View style={styles.activeFiltersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.activeFilters}>
              {filters.school && (
                <View style={[styles.filterChip, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.filterChipText, { color: colors.primary }]}>
                    {filterOptions.schools.find((s) => s.id === filters.school)?.name || filters.school}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setFilters({ ...filters, school: undefined })}
                    style={styles.filterChipClose}
                  >
                    <IconSymbol name="xmark.circle.fill" size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              )}
              {filters.neighborhood && (
                <View style={[styles.filterChip, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.filterChipText, { color: colors.primary }]}>
                    {filters.neighborhood}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setFilters({ ...filters, neighborhood: undefined })}
                    style={styles.filterChipClose}
                  >
                    <IconSymbol name="xmark.circle.fill" size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              )}
              {filters.time && (
                <View style={[styles.filterChip, { backgroundColor: colors.primary + '20' }]}>
                  <IconSymbol name="clock.fill" size={14} color={colors.primary} />
                  <Text style={[styles.filterChipText, { color: colors.primary }]}>
                    {filters.time}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setFilters({ ...filters, time: undefined })}
                    style={styles.filterChipClose}
                  >
                    <IconSymbol name="xmark.circle.fill" size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}

      <StudentFilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={setFilters}
        schools={filterOptions.schools}
        neighborhoods={filterOptions.neighborhoods}
        times={filterOptions.times}
        currentFilters={filters}
      />
      <StudentDetailModal
        visible={showStudentModal}
        onClose={() => {
          setShowStudentModal(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        onEdit={(student) => {
          // TODO: Implementar edição do aluno
          console.log('Editar aluno:', student);
          // Aqui você pode navegar para uma tela de edição ou abrir um modal de edição
        }}
        onDelete={(studentId) => {
          // TODO: Implementar exclusão do aluno
          console.log('Excluir aluno:', studentId);
          // Aqui você pode remover o aluno da rota
        }}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        {filteredStudents.length === 0 ? (
          <Card style={styles.emptyCard}>
            <IconSymbol name="person.3" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Nenhum aluno encontrado
            </Text>
            {(searchQuery || activeFiltersCount > 0) && (
              <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                Tente ajustar a busca ou os filtros
              </Text>
            )}
          </Card>
        ) : (
          filteredStudents.map((student) => (
            <Card
              key={student.id}
              style={styles.studentCard}
              onPress={() => {
                setSelectedStudent(student);
                setShowStudentModal(true);
              }}
            >
              <View style={styles.studentHeader}>
                <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
                  <IconSymbol name="person.fill" size={32} color={colors.primary} />
                </View>
                <View style={styles.studentInfo}>
                  <View style={styles.studentNameRow}>
                    <Text style={[styles.studentName, { color: colors.text }]}>{student.name}</Text>
                  </View>
                  <View style={styles.studentDetailsRow}>
                    <IconSymbol name="calendar" size={14} color={colors.textTertiary} />
                    <Text style={[styles.studentDetailText, { color: colors.textTertiary }]}>
                      {student.age} anos
                    </Text>
                  </View>
                  <View style={styles.studentDetailsRow}>
                    <IconSymbol name="building.2.fill" size={14} color={colors.textTertiary} />
                    <Text style={[styles.studentDetailText, { color: colors.textTertiary }]} numberOfLines={1}>
                      {student.school.name}
                    </Text>
                  </View>
                  <View style={styles.studentDetailsRow}>
                    <IconSymbol name="location.fill" size={14} color={colors.textTertiary} />
                    <Text style={[styles.studentDetailText, { color: colors.textTertiary }]} numberOfLines={1}>
                      {student.pickupLocation.address || 'Endereço não informado'}
                    </Text>
                  </View>
                  <View style={styles.studentDetailsRow}>
                    <IconSymbol name="clock.fill" size={14} color={colors.textTertiary} />
                    <Text style={[styles.studentDetailText, { color: colors.textTertiary }]}>
                      {student.routeStartTime}
                      {student.routeEndTime && ` - ${student.routeEndTime}`} • Ordem: {student.pickupOrder}º
                    </Text>
                  </View>
                </View>
                <IconSymbol name="chevron.right" size={20} color={colors.textTertiary} />
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    gap: Spacing.sm,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    ...Typography.styles.caption,
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
  },
  activeFiltersContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  activeFilters: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
    gap: Spacing.xs,
  },
  filterChipText: {
    ...Typography.styles.caption,
    fontWeight: Typography.fontWeight.medium,
  },
  filterChipClose: {
    padding: 2,
  },
  searchInput: {
    flex: 1,
    ...Typography.styles.body,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  studentCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  studentHeader: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  studentNameRow: {
    marginBottom: Spacing.xs,
  },
  studentName: {
    ...Typography.styles.h4,
  },
  studentDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  studentDetailText: {
    ...Typography.styles.caption,
    flex: 1,
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
  emptySubtext: {
    ...Typography.styles.caption,
    textAlign: 'center',
    fontSize: Typography.fontSize.sm,
  },
});
