/**
 * Filter Modal Component - VANN App
 * Modal de filtros para busca de condutores
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Button } from './Button';
import { IconSymbol } from './icon-symbol';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface FilterOptions {
  city?: string;
  neighborhood?: string;
  school?: string;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  cities: string[];
  neighborhoods: string[];
  schools: string[];
  currentFilters?: FilterOptions;
}

export function FilterModal({
  visible,
  onClose,
  onApply,
  cities,
  neighborhoods,
  schools,
  currentFilters = {},
}: FilterModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const [selectedCity, setSelectedCity] = useState<string | undefined>(currentFilters.city);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | undefined>(
    currentFilters.neighborhood
  );
  const [selectedSchool, setSelectedSchool] = useState<string | undefined>(currentFilters.school);

  const handleApply = () => {
    onApply({
      city: selectedCity,
      neighborhood: selectedNeighborhood,
      school: selectedSchool,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedCity(undefined);
    setSelectedNeighborhood(undefined);
    setSelectedSchool(undefined);
  };

  const hasFilters = selectedCity || selectedNeighborhood || selectedSchool;

  if (!visible) return null;

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
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Filtros</Text>
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
                {/* Filtro por Cidade */}
                <View style={styles.filterSection}>
                  <Text style={[styles.filterLabel, { color: colors.text }]}>Cidade</Text>
                  <View style={styles.optionsContainer}>
                    {cities.map((city) => (
                      <TouchableOpacity
                        key={city}
                        style={[
                          styles.option,
                          {
                            backgroundColor:
                              selectedCity === city ? colors.primary + '20' : colors.card,
                            borderColor: selectedCity === city ? colors.primary : colors.border,
                          },
                        ]}
                        onPress={() => setSelectedCity(selectedCity === city ? undefined : city)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            {
                              color: selectedCity === city ? colors.primary : colors.text,
                              fontWeight:
                                selectedCity === city
                                  ? Typography.fontWeight.bold
                                  : Typography.fontWeight.normal,
                            },
                          ]}
                        >
                          {city}
                        </Text>
                        {selectedCity === city && (
                          <IconSymbol name="checkmark" size={16} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Filtro por Bairro */}
                <View style={styles.filterSection}>
                  <Text style={[styles.filterLabel, { color: colors.text }]}>Bairro</Text>
                  <View style={styles.optionsContainer}>
                    {neighborhoods.map((neighborhood) => (
                      <TouchableOpacity
                        key={neighborhood}
                        style={[
                          styles.option,
                          {
                            backgroundColor:
                              selectedNeighborhood === neighborhood
                                ? colors.primary + '20'
                                : colors.card,
                            borderColor:
                              selectedNeighborhood === neighborhood ? colors.primary : colors.border,
                          },
                        ]}
                        onPress={() =>
                          setSelectedNeighborhood(
                            selectedNeighborhood === neighborhood ? undefined : neighborhood
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.optionText,
                            {
                              color:
                                selectedNeighborhood === neighborhood ? colors.primary : colors.text,
                              fontWeight:
                                selectedNeighborhood === neighborhood
                                  ? Typography.fontWeight.bold
                                  : Typography.fontWeight.normal,
                            },
                          ]}
                        >
                          {neighborhood}
                        </Text>
                        {selectedNeighborhood === neighborhood && (
                          <IconSymbol name="checkmark" size={16} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Filtro por Escola */}
                <View style={styles.filterSection}>
                  <Text style={[styles.filterLabel, { color: colors.text }]}>Escola</Text>
                  <View style={styles.optionsContainer}>
                    {schools.map((school) => (
                      <TouchableOpacity
                        key={school}
                        style={[
                          styles.option,
                          {
                            backgroundColor:
                              selectedSchool === school ? colors.primary + '20' : colors.card,
                            borderColor: selectedSchool === school ? colors.primary : colors.border,
                          },
                        ]}
                        onPress={() => setSelectedSchool(selectedSchool === school ? undefined : school)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            {
                              color: selectedSchool === school ? colors.primary : colors.text,
                              fontWeight:
                                selectedSchool === school
                                  ? Typography.fontWeight.bold
                                  : Typography.fontWeight.normal,
                            },
                          ]}
                        >
                          {school}
                        </Text>
                        {selectedSchool === school && (
                          <IconSymbol name="checkmark" size={16} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title="Limpar filtros"
                variant="outline"
                size="medium"
                onPress={handleReset}
                style={styles.resetButton}
                disabled={!hasFilters}
              />
              <Button
                title="Aplicar filtros"
                variant="primary"
                size="medium"
                onPress={handleApply}
                style={styles.applyButton}
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
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.85,
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
  modalTitle: {
    ...Typography.styles.h3,
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
  filterSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  filterLabel: {
    ...Typography.styles.h4,
    marginBottom: Spacing.md,
    fontWeight: Typography.fontWeight.medium,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  option: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  optionText: {
    ...Typography.styles.bodySmall,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  resetButton: {
    flex: 1,
  },
  applyButton: {
    flex: 1,
  },
});
