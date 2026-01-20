/**
 * Student Filter Modal Component - VANN App
 * Modal de filtros para busca de alunos
 */

import React, { useState, useEffect } from 'react';
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

export interface StudentFilterOptions {
  school?: string;
  neighborhood?: string;
  time?: string;
}

interface StudentFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: StudentFilterOptions) => void;
  schools: Array<{ id: string; name: string }>;
  neighborhoods: string[];
  times: string[];
  currentFilters?: StudentFilterOptions;
}

export function StudentFilterModal({
  visible,
  onClose,
  onApply,
  schools,
  neighborhoods,
  times,
  currentFilters = {},
}: StudentFilterModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const [selectedSchool, setSelectedSchool] = useState<string | undefined>(currentFilters.school);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | undefined>(
    currentFilters.neighborhood
  );
  const [selectedTime, setSelectedTime] = useState<string | undefined>(currentFilters.time);

  useEffect(() => {
    if (visible) {
      setSelectedSchool(currentFilters.school);
      setSelectedNeighborhood(currentFilters.neighborhood);
      setSelectedTime(currentFilters.time);
    }
  }, [visible, currentFilters]);

  const handleApply = () => {
    onApply({
      school: selectedSchool,
      neighborhood: selectedNeighborhood,
      time: selectedTime,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedSchool(undefined);
    setSelectedNeighborhood(undefined);
    setSelectedTime(undefined);
  };

  const hasFilters = selectedSchool || selectedNeighborhood || selectedTime;

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
              {/* Filtro por Escola */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: colors.text }]}>Escola</Text>
                <View style={styles.optionsContainer}>
                  {schools.map((school) => (
                    <TouchableOpacity
                      key={school.id}
                      style={[
                        styles.option,
                        {
                          backgroundColor:
                            selectedSchool === school.id ? colors.primary + '20' : colors.card,
                          borderColor: selectedSchool === school.id ? colors.primary : colors.border,
                        },
                      ]}
                      onPress={() => setSelectedSchool(selectedSchool === school.id ? undefined : school.id)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          {
                            color: selectedSchool === school.id ? colors.primary : colors.text,
                            fontWeight:
                              selectedSchool === school.id
                                ? Typography.fontWeight.bold
                                : Typography.fontWeight.normal,
                          },
                        ]}
                      >
                        {school.name}
                      </Text>
                      {selectedSchool === school.id && (
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

              {/* Filtro por Horário */}
              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: colors.text }]}>Horário</Text>
                <View style={styles.optionsContainer}>
                  {times.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.option,
                        {
                          backgroundColor:
                            selectedTime === time ? colors.primary + '20' : colors.card,
                          borderColor: selectedTime === time ? colors.primary : colors.border,
                        },
                      ]}
                      onPress={() => setSelectedTime(selectedTime === time ? undefined : time)}
                    >
                      <IconSymbol
                        name="clock.fill"
                        size={16}
                        color={selectedTime === time ? colors.primary : colors.icon}
                      />
                      <Text
                        style={[
                          styles.optionText,
                          {
                            color: selectedTime === time ? colors.primary : colors.text,
                            fontWeight:
                              selectedTime === time
                                ? Typography.fontWeight.bold
                                : Typography.fontWeight.normal,
                          },
                        ]}
                      >
                        {time}
                      </Text>
                      {selectedTime === time && (
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
