/**
 * Add Expense Modal Component - VANN App
 * Modal para cadastrar novas despesas
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
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Button } from './Button';
import { IconSymbol } from './icon-symbol';
import { ExpenseCategory } from '@/types/expenses';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface ExpenseFormData {
  date: string; // YYYY-MM-DD
  amount: string;
  category: ExpenseCategory | '';
  description: string;
  notes?: string;
}

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ExpenseFormData) => void;
}

const CATEGORIES: Array<{ value: ExpenseCategory; label: string; icon: string }> = [
  { value: 'maintenance', label: 'Manutenção', icon: 'wrench.and.screwdriver.fill' },
  { value: 'fuel', label: 'Combustível', icon: 'fuelpump.fill' },
  { value: 'tire', label: 'Pneus', icon: 'circle.fill' },
  { value: 'insurance', label: 'Seguro', icon: 'shield.fill' },
  { value: 'parking', label: 'Estacionamento', icon: 'parkingsign.fill' },
  { value: 'toll', label: 'Pedágio', icon: 'road.lanes' },
  { value: 'cleaning', label: 'Lavagem', icon: 'sparkles' },
  { value: 'documentation', label: 'Documentação', icon: 'doc.fill' },
  { value: 'other', label: 'Outros', icon: 'ellipsis.circle.fill' },
];

export function AddExpenseModal({ visible, onClose, onSubmit }: AddExpenseModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const [formData, setFormData] = useState<ExpenseFormData>({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    description: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Resetar formulário quando o modal abrir
  useEffect(() => {
    if (visible) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: '',
        description: '',
        notes: '',
      });
      setErrors({});
    }
  }, [visible]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.date)) {
        newErrors.date = 'Data inválida. Use o formato YYYY-MM-DD';
      }
    }

    if (!formData.amount || formData.amount.trim() === '') {
      newErrors.amount = 'Valor é obrigatório';
    } else {
      const amount = parseFloat(formData.amount.replace(/[^\d,.-]/g, '').replace(',', '.'));
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Valor deve ser um número maior que zero';
      }
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = 'Descrição é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleAmountChange = (text: string) => {
    // Permitir apenas números, vírgula e ponto
    const cleaned = text.replace(/[^\d,.-]/g, '');
    setFormData({ ...formData, amount: cleaned });
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
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: colors.background,
                },
              ]}
            >
              {/* Header */}
              <View style={styles.modalHeader}>
                <View style={styles.headerLeft}>
                  <View style={[styles.headerIcon, { backgroundColor: colors.primary + '20' }]}>
                    <IconSymbol name="plus.circle.fill" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.headerInfo}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>Nova Despesa</Text>
                    <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                      Cadastre uma nova despesa
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <IconSymbol name="xmark.circle.fill" size={24} color={colors.textTertiary} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                  styles.scrollContent,
                  { paddingBottom: Spacing.md },
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* Data */}
                <View style={styles.fieldContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Data <Text style={{ color: colors.error }}>*</Text>
                  </Text>
                  <View
                    style={[
                      styles.inputContainer,
                      {
                        backgroundColor: colors.card,
                        borderColor: errors.date ? colors.error : colors.border,
                        borderWidth: errors.date ? 2 : 1,
                      },
                    ]}
                  >
                    <IconSymbol name="calendar" size={18} color={colors.textSecondary} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      value={formData.date}
                      onChangeText={(text) => setFormData({ ...formData, date: text })}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor={colors.textTertiary}
                    />
                  </View>
                  {errors.date && (
                    <Text style={[styles.errorText, { color: colors.error }]}>{errors.date}</Text>
                  )}
                </View>

                {/* Valor */}
                <View style={styles.fieldContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Valor (R$) <Text style={{ color: colors.error }}>*</Text>
                  </Text>
                  <View
                    style={[
                      styles.inputContainer,
                      {
                        backgroundColor: colors.card,
                        borderColor: errors.amount ? colors.error : colors.border,
                        borderWidth: errors.amount ? 2 : 1,
                      },
                    ]}
                  >
                    <IconSymbol name="creditcard.fill" size={18} color={colors.textSecondary} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      value={formData.amount}
                      onChangeText={handleAmountChange}
                      placeholder="0,00"
                      placeholderTextColor={colors.textTertiary}
                      keyboardType="decimal-pad"
                    />
                  </View>
                  {errors.amount && (
                    <Text style={[styles.errorText, { color: colors.error }]}>{errors.amount}</Text>
                  )}
                </View>

                {/* Categoria */}
                <View style={styles.fieldContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Categoria <Text style={{ color: colors.error }}>*</Text>
                  </Text>
                  <View style={styles.categoriesGrid}>
                    {CATEGORIES.map((category) => {
                      const isSelected = formData.category === category.value;
                      const categoryColor = getCategoryColor(category.value);
                      return (
                        <TouchableOpacity
                          key={category.value}
                          style={[
                            styles.categoryButton,
                            {
                              backgroundColor: isSelected
                                ? categoryColor + '20'
                                : colors.backgroundSecondary,
                              borderColor: isSelected ? categoryColor : colors.border,
                              borderWidth: isSelected ? 2 : 1,
                            },
                          ]}
                          onPress={() => setFormData({ ...formData, category: category.value })}
                        >
                          <View
                            style={[
                              styles.categoryIcon,
                              { backgroundColor: isSelected ? categoryColor + '30' : colors.card },
                            ]}
                          >
                            <IconSymbol
                              name={category.icon as any}
                              size={20}
                              color={isSelected ? categoryColor : colors.textSecondary}
                            />
                          </View>
                          <Text
                            style={[
                              styles.categoryLabel,
                              {
                                color: isSelected ? categoryColor : colors.text,
                                fontWeight: isSelected
                                  ? Typography.fontWeight.semiBold
                                  : Typography.fontWeight.regular,
                              },
                            ]}
                          >
                            {category.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  {errors.category && (
                    <Text style={[styles.errorText, { color: colors.error }]}>{errors.category}</Text>
                  )}
                </View>

                {/* Descrição */}
                <View style={styles.fieldContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Descrição <Text style={{ color: colors.error }}>*</Text>
                  </Text>
                  <View
                    style={[
                      styles.textAreaContainer,
                      {
                        backgroundColor: colors.card,
                        borderColor: errors.description ? colors.error : colors.border,
                        borderWidth: errors.description ? 2 : 1,
                      },
                    ]}
                  >
                    <TextInput
                      style={[styles.textArea, { color: colors.text }]}
                      value={formData.description}
                      onChangeText={(text) => setFormData({ ...formData, description: text })}
                      placeholder="Ex: Abastecimento - Diesel"
                      placeholderTextColor={colors.textTertiary}
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                  {errors.description && (
                    <Text style={[styles.errorText, { color: colors.error }]}>
                      {errors.description}
                    </Text>
                  )}
                </View>

                {/* Observações (opcional) */}
                <View style={styles.fieldContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>Observações (opcional)</Text>
                  <View
                    style={[
                      styles.textAreaContainer,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <TextInput
                      style={[styles.textArea, { color: colors.text }]}
                      value={formData.notes}
                      onChangeText={(text) => setFormData({ ...formData, notes: text })}
                      placeholder="Ex: Posto Shell - 50 litros"
                      placeholderTextColor={colors.textTertiary}
                      multiline
                      numberOfLines={2}
                    />
                  </View>
                </View>
              </ScrollView>

              {/* Footer com ações */}
              <View
                style={[
                  styles.modalFooter,
                  {
                    paddingBottom: insets.bottom + Spacing.md,
                    backgroundColor: colors.background,
                  },
                ]}
              >
                <Button
                  title="Cancelar"
                  variant="outline"
                  size="medium"
                  onPress={onClose}
                  style={styles.actionButton}
                />
                <Button
                  title="Salvar"
                  variant="primary"
                  size="medium"
                  onPress={handleSubmit}
                  style={styles.actionButton}
                  leftIcon={<IconSymbol name="checkmark" size={18} color="#FFFFFF" />}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
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
    maxHeight: SCREEN_HEIGHT * 0.95,
    height: SCREEN_HEIGHT * 0.95,
  },
  keyboardView: {
    flex: 1,
    height: '100%',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    width: '100%',
    height: '100%',
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
    flexShrink: 0,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontSize: Typography.fontSize.sm,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  scrollView: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  fieldContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    ...Typography.styles.bodySmall,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    minHeight: 52,
  },
  input: {
    ...Typography.styles.body,
    flex: 1,
    fontSize: Typography.fontSize.base,
  },
  textAreaContainer: {
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 80,
  },
  textArea: {
    ...Typography.styles.body,
    fontSize: Typography.fontSize.base,
    textAlignVertical: 'top',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryButton: {
    width: '30%',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryLabel: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
  },
  errorText: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
    marginTop: Spacing.xs,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    flexShrink: 0,
  },
  actionButton: {
    flex: 1,
  },
});
