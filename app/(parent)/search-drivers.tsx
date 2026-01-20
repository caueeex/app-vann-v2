/**
 * Search Drivers Screen - VANN App
 */

import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing, Shadows } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { Header } from '@/components/ui/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FilterModal, FilterOptions } from '@/components/ui/FilterModal';
import { useMockData } from '@/hooks/useMockData';

export default function SearchDriversScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { drivers, routes } = useMockData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  // Extrair opções de filtro dos dados disponíveis
  const filterOptions = useMemo(() => {
    const cities = new Set<string>();
    const neighborhoods = new Set<string>();
    const schools = new Set<string>();

    routes.forEach((route) => {
      // Cidade da escola
      if (route.school.address.city) {
        cities.add(route.school.address.city);
      }
      // Nome da escola
      schools.add(route.school.name);
      // Bairros dos alunos (extrair do endereço)
      route.students.forEach((student) => {
        const addressParts = student.pickupLocation.address.split(',');
        if (addressParts.length > 1) {
          // Assumindo que o bairro pode estar no endereço
          neighborhoods.add(addressParts[addressParts.length - 1].trim());
        }
      });
    });

    return {
      cities: Array.from(cities).sort(),
      neighborhoods: Array.from(neighborhoods).sort(),
      schools: Array.from(schools).sort(),
    };
  }, [routes]);

  // Filtrar condutores
  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      // Filtro por nome
      const matchesName = !searchQuery || driver.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro por cidade, bairro e escola (baseado nas rotas do condutor)
      const driverRoutes = routes.filter((r) => r.driverId === driver.id);
      
      let matchesCity = true;
      let matchesNeighborhood = true;
      let matchesSchool = true;

      if (filters.city) {
        matchesCity = driverRoutes.some((r) => r.school.address.city === filters.city);
      }

      if (filters.neighborhood) {
        matchesNeighborhood = driverRoutes.some((r) =>
          r.students.some((s) => s.pickupLocation.address.includes(filters.neighborhood || ''))
        );
      }

      if (filters.school) {
        matchesSchool = driverRoutes.some((r) => r.school.name === filters.school);
      }

      return matchesName && matchesCity && matchesNeighborhood && matchesSchool;
    });
  }, [drivers, routes, searchQuery, filters]);

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Buscar condutores" />
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
              {filters.city && (
                <View style={[styles.filterChip, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.filterChipText, { color: colors.primary }]}>
                    {filters.city}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setFilters({ ...filters, city: undefined })}
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
              {filters.school && (
                <View style={[styles.filterChip, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.filterChipText, { color: colors.primary }]}>
                    {filters.school}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setFilters({ ...filters, school: undefined })}
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

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={setFilters}
        cities={filterOptions.cities}
        neighborhoods={filterOptions.neighborhoods}
        schools={filterOptions.schools}
        currentFilters={filters}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        {filteredDrivers.map((driver) => (
          <Card
            key={driver.id}
            style={styles.driverCard}
            onPress={() => router.push(`/(parent)/driver-profile/${driver.id}`)}
          >
            <View style={styles.driverHeader}>
              <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
                <IconSymbol name="person.fill" size={32} color={colors.primary} />
                {driver.verified && (
                  <View style={[styles.verifiedBadge, { backgroundColor: colors.success }]}>
                    <IconSymbol name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
              </View>
              <View style={styles.driverInfo}>
                <View style={styles.driverNameRow}>
                  <Text style={[styles.driverName, { color: colors.text }]}>{driver.name}</Text>
                  {driver.verified && <Badge label="Verificado" variant="verified" size="small" />}
                  {driver.adsActive && <Badge label="Ads" variant="ads" size="small" />}
                </View>
                <View style={styles.ratingRow}>
                  <Rating rating={Math.round(driver.rating) as any} size={16} readonly />
                  <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                    {driver.rating.toFixed(1)} ({driver.totalRatings} avaliações)
                  </Text>
                </View>
                <View style={styles.vehicleRow}>
                  <IconSymbol name="car.fill" size={14} color={colors.textTertiary} />
                  <Text style={[styles.vehicleText, { color: colors.textTertiary }]}>
                    {driver.vehicle.brand} {driver.vehicle.model} • {driver.vehicle.capacity} lugares
                  </Text>
                </View>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.textTertiary} />
            </View>
          </Card>
        ))}
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
  driverCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  driverHeader: {
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
    position: 'relative',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  driverInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  driverName: {
    ...Typography.styles.h4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  ratingText: {
    ...Typography.styles.bodySmall,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  vehicleText: {
    ...Typography.styles.caption,
  },
});
