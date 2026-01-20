/**
 * Create Route Modal Component - VANN App
 * Modal para criar nova rota com seleção de alunos e drag and drop
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Button } from './Button';
import { IconSymbol } from './icon-symbol';
import { Card } from './Card';
import { Child, School } from '@/types/user';
import { Route } from '@/types/driver';
import { optimizeRouteOrder, calculateTotalDistance, calculateEstimatedDuration } from '@/utils/route-optimizer';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CreateRouteModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (route: Omit<Route, 'id'>) => void;
  availableStudents: Child[];
  availableSchools: School[];
}

interface SelectedStudent {
  id: string;
  student: Child;
  order: number;
}

export function CreateRouteModal({
  visible,
  onClose,
  onSubmit,
  availableStudents,
  availableSchools,
}: CreateRouteModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [routeDate, setRouteDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('07:00');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<SelectedStudent[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragTargetIndex, setDragTargetIndex] = useState<number | null>(null);

  // Resetar formulário quando o modal abrir
  useEffect(() => {
    if (visible) {
      setSelectedSchool(null);
      setRouteDate(new Date().toISOString().split('T')[0]);
      setStartTime('07:00');
      setSearchQuery('');
      setSelectedStudents([]);
      setDraggedIndex(null);
    }
  }, [visible]);

  // Filtrar alunos disponíveis
  const filteredStudents = useMemo(() => {
    let filtered = availableStudents;

    // Filtrar por escola selecionada
    if (selectedSchool) {
      filtered = filtered.filter((s) => s.school.id === selectedSchool.id);
    }

    // Filtrar por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.school.name.toLowerCase().includes(query) ||
          s.pickupLocation.address?.toLowerCase().includes(query)
      );
    }

    // Remover alunos já selecionados
    const selectedIds = new Set(selectedStudents.map((s) => s.id));
    filtered = filtered.filter((s) => !selectedIds.has(s.id));

    return filtered;
  }, [availableStudents, selectedSchool, searchQuery, selectedStudents]);

  // Adicionar aluno à rota
  const handleAddStudent = (student: Child) => {
    const newOrder = selectedStudents.length + 1;
    setSelectedStudents([...selectedStudents, { id: student.id, student, order: newOrder }]);
  };

  // Remover aluno da rota
  const handleRemoveStudent = (studentId: string) => {
    const updated = selectedStudents.filter((s) => s.id !== studentId);
    // Reordenar
    const reordered = updated.map((s, index) => ({ ...s, order: index + 1 }));
    setSelectedStudents(reordered);
  };

  // Otimizar rota automaticamente
  const handleOptimizeRoute = () => {
    if (selectedStudents.length === 0 || !selectedSchool) {
      Alert.alert('Atenção', 'Selecione uma escola e adicione alunos à rota.');
      return;
    }

    const studentsWithLocation = selectedStudents.map((s) => ({
      id: s.id,
      student: s.student,
      pickupLocation: s.student.pickupLocation,
    }));

    const optimized = optimizeRouteOrder(studentsWithLocation, undefined);
    const reordered = optimized.map((s, index) => ({
      id: s.id,
      student: s.student,
      order: index + 1,
    }));

    setSelectedStudents(reordered);
    Alert.alert('Rota Otimizada', 'A ordem dos alunos foi otimizada para o menor trajeto possível.');
  };

  // Calcular distância e tempo estimado
  const routeStats = useMemo(() => {
    if (selectedStudents.length === 0 || !selectedSchool) {
      return { distance: 0, duration: 0 };
    }

    const studentsWithLocation = selectedStudents.map((s) => ({
      id: s.id,
      student: s.student,
      pickupLocation: s.student.pickupLocation,
    }));

    const distance = calculateTotalDistance(studentsWithLocation, selectedSchool.address);
    const duration = calculateEstimatedDuration(distance, selectedStudents.length);

    return { distance, duration };
  }, [selectedStudents, selectedSchool]);

  // Calcular horário de término estimado
  const estimatedEndTime = useMemo(() => {
    if (!startTime || routeStats.duration === 0) return '';

    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + routeStats.duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;

    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  }, [startTime, routeStats.duration]);

  // Validar e salvar rota
  const handleSubmit = () => {
    if (!selectedSchool) {
      Alert.alert('Atenção', 'Selecione uma escola.');
      return;
    }

    if (selectedStudents.length === 0) {
      Alert.alert('Atenção', 'Adicione pelo menos um aluno à rota.');
      return;
    }

    if (!routeDate || !startTime) {
      Alert.alert('Atenção', 'Preencha a data e horário da rota.');
      return;
    }

    const routeStudents = selectedStudents.map((s, index) => ({
      id: `rs-${Date.now()}-${index}`,
      studentId: s.student.id,
      student: s.student,
      pickupOrder: s.order,
      status: 'waiting' as const,
      pickupLocation: s.student.pickupLocation,
    }));

    const newRoute: Omit<Route, 'id'> = {
      driverId: '1', // Mock - em produção viria do contexto
      schoolId: selectedSchool.id,
      school: selectedSchool,
      status: 'scheduled',
      date: routeDate,
      startTime,
      endTime: estimatedEndTime,
      students: routeStudents,
      totalDistance: routeStats.distance,
      totalDuration: routeStats.duration,
    };

    onSubmit(newRoute);
    onClose();
  };

  // Função para atualizar preview durante o drag (não reordena, apenas mostra onde vai ficar)
  const handleDragUpdate = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) {
      setDragTargetIndex(null);
      return;
    }
    // Apenas atualiza o índice alvo para mostrar visualmente onde vai ficar
    // Não reordena a lista ainda para evitar "pulos"
    setDragTargetIndex(toIndex);
  };

  // Função para finalizar a reordenação (chamada ao soltar)
  const moveStudent = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) {
      setDragTargetIndex(null);
      return;
    }
    
    // Agora sim reordena a lista
    const newStudents = [...selectedStudents];
    const [moved] = newStudents.splice(fromIndex, 1);
    newStudents.splice(toIndex, 0, moved);
    const reordered = newStudents.map((s, index) => ({ ...s, order: index + 1 }));
    setSelectedStudents(reordered);
    setDragTargetIndex(null);
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
      <GestureHandlerRootView style={{ flex: 1 }}>
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
                      <Text style={[styles.modalTitle, { color: colors.text }]}>Nova Rota</Text>
                      <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                        Crie uma nova rota de transporte
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <IconSymbol name="xmark.circle.fill" size={24} color={colors.textTertiary} />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.scrollView}
                  contentContainerStyle={[styles.scrollContent, { paddingBottom: Spacing.md }]}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {/* Seleção de Escola */}
                  <View style={styles.fieldContainer}>
                    <Text style={[styles.label, { color: colors.text }]}>
                      Escola <Text style={{ color: colors.error }}>*</Text>
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.schoolsScroll}>
                      {availableSchools.map((school) => (
                        <TouchableOpacity
                          key={school.id}
                          style={[
                            styles.schoolButton,
                            {
                              backgroundColor:
                                selectedSchool?.id === school.id ? colors.primary : colors.backgroundSecondary,
                              borderColor: selectedSchool?.id === school.id ? colors.primary : colors.border,
                            },
                          ]}
                          onPress={() => setSelectedSchool(school)}
                        >
                          <Text
                            style={[
                              styles.schoolText,
                              {
                                color: selectedSchool?.id === school.id ? '#FFFFFF' : colors.text,
                                fontWeight:
                                  selectedSchool?.id === school.id
                                    ? Typography.fontWeight.semiBold
                                    : Typography.fontWeight.regular,
                              },
                            ]}
                          >
                            {school.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Data e Horário */}
                  <View style={styles.row}>
                    <View style={[styles.fieldContainer, { flex: 1, marginRight: Spacing.sm }]}>
                      <Text style={[styles.label, { color: colors.text }]}>
                        Data <Text style={{ color: colors.error }}>*</Text>
                      </Text>
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <IconSymbol name="calendar" size={18} color={colors.textSecondary} />
                        <TextInput
                          style={[styles.input, { color: colors.text }]}
                          value={routeDate}
                          onChangeText={setRouteDate}
                          placeholder="YYYY-MM-DD"
                          placeholderTextColor={colors.textTertiary}
                        />
                      </View>
                    </View>
                    <View style={[styles.fieldContainer, { flex: 1 }]}>
                      <Text style={[styles.label, { color: colors.text }]}>
                        Horário <Text style={{ color: colors.error }}>*</Text>
                      </Text>
                      <View
                        style={[
                          styles.inputContainer,
                          {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <IconSymbol name="clock.fill" size={18} color={colors.textSecondary} />
                        <TextInput
                          style={[styles.input, { color: colors.text }]}
                          value={startTime}
                          onChangeText={setStartTime}
                          placeholder="HH:mm"
                          placeholderTextColor={colors.textTertiary}
                        />
                      </View>
                    </View>
                  </View>

                  {/* Estatísticas da Rota */}
                  {selectedStudents.length > 0 && selectedSchool && (
                    <Card style={[styles.statsCard, { backgroundColor: colors.info + '10' }]}>
                      <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                          <IconSymbol name="person.3.fill" size={20} color={colors.info} />
                          <Text style={[styles.statValue, { color: colors.text }]}>
                            {selectedStudents.length} {selectedStudents.length === 1 ? 'aluno' : 'alunos'}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <IconSymbol name="location.fill" size={20} color={colors.info} />
                          <Text style={[styles.statValue, { color: colors.text }]}>
                            {routeStats.distance.toFixed(1)} km
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <IconSymbol name="clock.fill" size={20} color={colors.info} />
                          <Text style={[styles.statValue, { color: colors.text }]}>
                            ~{routeStats.duration} min
                          </Text>
                        </View>
                      </View>
                      {estimatedEndTime && (
                        <Text style={[styles.estimatedTime, { color: colors.textSecondary }]}>
                          Previsão de término: {estimatedEndTime}
                        </Text>
                      )}
                    </Card>
                  )}

                  {/* Alunos Selecionados (com drag and drop) */}
                  {selectedStudents.length > 0 && (
                    <View style={styles.fieldContainer}>
                      <View style={styles.sectionHeader}>
                        <View style={styles.sectionHeaderLeft}>
                          <Text style={[styles.label, { color: colors.text }]}>
                            Ordem de Coleta ({selectedStudents.length})
                          </Text>
                          <Text style={[styles.helpText, { color: colors.textTertiary }]}>
                            Arraste para reordenar
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={[styles.optimizeButton, { backgroundColor: colors.primary + '20' }]}
                          onPress={handleOptimizeRoute}
                        >
                          <IconSymbol name="sparkles" size={16} color={colors.primary} />
                          <Text style={[styles.optimizeText, { color: colors.primary }]}>Otimizar</Text>
                        </TouchableOpacity>
                      </View>
                      <Card style={styles.selectedStudentsCard}>
                        {selectedStudents.map((item, index) => {
                          // Calcular offset visual para mostrar onde o item arrastado vai ficar
                          const isTargetPosition =
                            draggedIndex !== null &&
                            dragTargetIndex !== null &&
                            index === dragTargetIndex &&
                            index !== draggedIndex;
                          
                          // Lógica corrigida para movimento dos itens adjacentes:
                          // Se arrastando para BAIXO (draggedIndex < dragTargetIndex):
                          //   - Itens entre draggedIndex+1 e dragTargetIndex devem se mover para CIMA
                          // Se arrastando para CIMA (draggedIndex > dragTargetIndex):
                          //   - Itens entre dragTargetIndex e draggedIndex-1 devem se mover para BAIXO
                          const shouldShiftUp =
                            draggedIndex !== null &&
                            dragTargetIndex !== null &&
                            draggedIndex < dragTargetIndex && // Arrastando para baixo
                            index > draggedIndex && // Item está depois do arrastado
                            index <= dragTargetIndex; // Item está até a posição alvo
                          
                          const shouldShiftDown =
                            draggedIndex !== null &&
                            dragTargetIndex !== null &&
                            draggedIndex > dragTargetIndex && // Arrastando para cima
                            index < draggedIndex && // Item está antes do arrastado
                            index >= dragTargetIndex; // Item está a partir da posição alvo

                          return (
                            <AnimatedItemWrapper
                              key={item.id}
                              shouldShiftUp={shouldShiftUp}
                              shouldShiftDown={shouldShiftDown}
                            >
                              <DraggableStudentItem
                                student={item.student}
                                order={item.order}
                                index={index}
                                totalItems={selectedStudents.length}
                                isDragging={draggedIndex === index}
                                isTargetPosition={isTargetPosition}
                                onRemove={() => handleRemoveStudent(item.id)}
                                onMoveUp={index > 0 ? () => moveStudent(index, index - 1) : undefined}
                                onMoveDown={
                                  index < selectedStudents.length - 1
                                    ? () => moveStudent(index, index + 1)
                                    : undefined
                                }
                                onDragStart={() => setDraggedIndex(index)}
                                onDragUpdate={(fromIndex, toIndex) => handleDragUpdate(fromIndex, toIndex)}
                                onDragEnd={(fromIndex, toIndex) => {
                                  moveStudent(fromIndex, toIndex);
                                  setDraggedIndex(null);
                                }}
                                colors={colors}
                              />
                            </AnimatedItemWrapper>
                          );
                        })}
                      </Card>
                    </View>
                  )}

                  {/* Busca de Alunos */}
                  <View style={styles.fieldContainer}>
                    <Text style={[styles.label, { color: colors.text }]}>Adicionar Alunos</Text>
                    <View
                      style={[
                        styles.inputContainer,
                        {
                          backgroundColor: colors.card,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <IconSymbol name="magnifyingglass" size={18} color={colors.textSecondary} />
                      <TextInput
                        style={[styles.input, { color: colors.text }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Buscar por nome, escola ou endereço..."
                        placeholderTextColor={colors.textTertiary}
                      />
                    </View>
                  </View>

                  {/* Lista de Alunos Disponíveis */}
                  {filteredStudents.length > 0 ? (
                    <View style={styles.studentsList}>
                      {filteredStudents.map((student) => (
                        <Card key={student.id} style={styles.studentCard}>
                          <View style={styles.studentInfo}>
                            <View style={[styles.studentIcon, { backgroundColor: colors.primary + '20' }]}>
                              <IconSymbol name="person.fill" size={20} color={colors.primary} />
                            </View>
                            <View style={styles.studentDetails}>
                              <Text style={[styles.studentName, { color: colors.text }]}>{student.name}</Text>
                              <Text style={[styles.studentSchool, { color: colors.textSecondary }]}>
                                {student.school.name}
                              </Text>
                              <Text style={[styles.studentAddress, { color: colors.textTertiary }]}>
                                {student.pickupLocation.address || 'Endereço não informado'}
                              </Text>
                            </View>
                          </View>
                          <TouchableOpacity
                            style={[styles.addButton, { backgroundColor: colors.primary }]}
                            onPress={() => handleAddStudent(student)}
                          >
                            <IconSymbol name="plus" size={18} color="#FFFFFF" />
                          </TouchableOpacity>
                        </Card>
                      ))}
                    </View>
                  ) : (
                    searchQuery.trim() && (
                      <View style={styles.emptyState}>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                          Nenhum aluno encontrado
                        </Text>
                      </View>
                    )
                  )}
                </ScrollView>

                {/* Footer */}
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
                    title="Criar Rota"
                    variant="primary"
                    size="medium"
                    onPress={handleSubmit}
                    style={styles.actionButton}
                    disabled={selectedStudents.length === 0 || !selectedSchool}
                    leftIcon={<IconSymbol name="checkmark" size={18} color="#FFFFFF" />}
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

// Componente wrapper animado para os itens que se movem durante o drag
interface AnimatedItemWrapperProps {
  children: React.ReactNode;
  shouldShiftUp: boolean;
  shouldShiftDown: boolean;
}

function AnimatedItemWrapper({ children, shouldShiftUp, shouldShiftDown }: AnimatedItemWrapperProps) {
  const shiftOffset = useSharedValue(0);

  useEffect(() => {
    if (shouldShiftUp) {
      // Animar para cima durante o drag
      shiftOffset.value = withSpring(-ITEM_HEIGHT, {
        damping: 25,
        stiffness: 300,
      });
    } else if (shouldShiftDown) {
      // Animar para baixo durante o drag
      shiftOffset.value = withSpring(ITEM_HEIGHT, {
        damping: 25,
        stiffness: 300,
      });
    } else {
      // Resetar imediatamente sem animação quando o drag termina
      shiftOffset.value = 0;
    }
  }, [shouldShiftUp, shouldShiftDown]);

  const shiftStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: shiftOffset.value }],
  }));

  return <Animated.View style={[styles.draggableItemWrapper, shiftStyle]}>{children}</Animated.View>;
}

// Componente para item de aluno com drag and drop
interface DraggableStudentItemProps {
  student: Child;
  order: number;
  index: number;
  totalItems: number;
  isDragging?: boolean;
  isTargetPosition?: boolean;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDragStart: () => void;
  onDragUpdate: (fromIndex: number, toIndex: number) => void;
  onDragEnd: (fromIndex: number, toIndex: number) => void;
  colors: any;
}

const ITEM_HEIGHT = 80; // Altura aproximada de cada item

function DraggableStudentItem({
  student,
  order,
  index,
  totalItems,
  isDragging: externalIsDragging = false,
  isTargetPosition = false,
  onRemove,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragUpdate,
  onDragEnd,
  colors,
}: DraggableStudentItemProps) {
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const lastNotifiedIndex = useSharedValue(index);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
      translateY.value = 0; // Sempre começa do zero
      lastNotifiedIndex.value = index;
      runOnJS(onDragStart)();
    })
    .onUpdate((event) => {
      // O translateY acompanha diretamente o movimento do dedo
      // Isso garante movimento suave e responsivo
      translateY.value = event.translationY;

      // Calcular novo índice baseado na posição do movimento
      // Usa 70% da altura do item como threshold
      const threshold = ITEM_HEIGHT * 0.7;
      const indexOffset = Math.round(event.translationY / threshold);
      const newIndex = Math.max(0, Math.min(totalItems - 1, index + indexOffset));

      // Só notificar se o índice realmente mudou
      // Isso evita múltiplas atualizações e "pulos"
      if (newIndex !== lastNotifiedIndex.value && newIndex !== index) {
        lastNotifiedIndex.value = newIndex;
        runOnJS(onDragUpdate)(index, newIndex);
      }
    })
    .onEnd((event) => {
      isDragging.value = false;
      
      // Calcular índice final baseado na posição final do movimento
      const threshold = ITEM_HEIGHT * 0.7;
      const indexOffset = Math.round(event.translationY / threshold);
      const finalIndex = Math.max(0, Math.min(totalItems - 1, index + indexOffset));
      
      // Resetar imediatamente sem animação
      translateY.value = 0;
      
      // Notificar a reordenação final (isso vai reposicionar o item instantaneamente)
      runOnJS(onDragEnd)(index, finalIndex);
      lastNotifiedIndex.value = index;
    })
    .minDistance(2) // Mínimo de 2px para ativar (muito sensível)
    .activeOffsetY([-5, 5]) // Ativa com movimento vertical de 5px
    .failOffsetX([-30, 30]); // Falha com movimento horizontal de 30px

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      zIndex: isDragging.value ? 1000 : 1,
      opacity: isDragging.value ? 0.98 : 1,
      elevation: isDragging.value ? 15 : 0,
      shadowOpacity: isDragging.value ? 0.5 : 0,
      shadowRadius: isDragging.value ? 15 : 0,
      shadowOffset: { width: 0, height: isDragging.value ? 8 : 0 },
      shadowColor: isDragging.value ? '#000000' : 'transparent',
    };
  });

  const dragHandleStyle = useAnimatedStyle(() => {
    return {
      opacity: isDragging.value ? 1 : 0.7,
      transform: [{ scale: isDragging.value ? 1.1 : 1 }],
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: isDragging.value
        ? colors.primary + '10'
        : isTargetPosition
          ? colors.info + '05'
          : 'transparent',
      borderWidth: isDragging.value ? 2 : isTargetPosition ? 1 : 0,
      borderColor: isDragging.value
        ? colors.primary + '40'
        : isTargetPosition
          ? colors.info + '30'
          : 'transparent',
      borderRadius: isDragging.value || isTargetPosition ? BorderRadius.md : 0,
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.draggableItem, animatedStyle, containerStyle]}>
        <View style={styles.draggableItemContent}>
          <View style={[styles.orderBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.orderText}>{order}</Text>
          </View>
          <Animated.View style={[styles.dragHandle, dragHandleStyle]}>
            <View style={[styles.dragHandleBar, { backgroundColor: colors.primary }]} />
            <View style={[styles.dragHandleBar, { backgroundColor: colors.primary }]} />
          </Animated.View>
          <View style={styles.draggableContent}>
            <View style={styles.draggableInfo}>
              <Text style={[styles.draggableName, { color: colors.text }]}>{student.name}</Text>
              <Text style={[styles.draggableAddress, { color: colors.textSecondary }]}>
                {student.pickupLocation.address || 'Endereço não informado'}
              </Text>
            </View>
            <View style={styles.draggableActions}>
              {onMoveUp && (
                <TouchableOpacity
                  style={[styles.moveButton, { backgroundColor: colors.backgroundSecondary }]}
                  onPress={onMoveUp}
                >
                  <IconSymbol name="chevron.up" size={16} color={colors.text} />
                </TouchableOpacity>
              )}
              {onMoveDown && (
                <TouchableOpacity
                  style={[styles.moveButton, { backgroundColor: colors.backgroundSecondary }]}
                  onPress={onMoveDown}
                >
                  <IconSymbol name="chevron.down" size={16} color={colors.text} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.removeButton, { backgroundColor: colors.error + '20' }]}
                onPress={onRemove}
              >
                <IconSymbol name="xmark" size={16} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
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
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
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
    borderWidth: 1,
  },
  input: {
    ...Typography.styles.body,
    flex: 1,
    fontSize: Typography.fontSize.base,
  },
  schoolsScroll: {
    marginTop: Spacing.sm,
  },
  schoolButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  schoolText: {
    ...Typography.styles.bodySmall,
    fontSize: Typography.fontSize.sm,
  },
  statsCard: {
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.sm,
  },
  statItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statValue: {
    ...Typography.styles.bodySmall,
    fontWeight: Typography.fontWeight.semiBold,
  },
  estimatedTime: {
    ...Typography.styles.caption,
    textAlign: 'center',
    fontSize: Typography.fontSize.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionHeaderLeft: {
    flex: 1,
    gap: Spacing.xs,
  },
  helpText: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
    fontStyle: 'italic',
  },
  optimizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  optimizeText: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
  },
  selectedStudentsCard: {
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  draggableItemWrapper: {
    minHeight: ITEM_HEIGHT,
  },
  draggableItem: {
    minHeight: ITEM_HEIGHT,
    marginBottom: Spacing.xs,
  },
  draggableItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm,
    backgroundColor: 'transparent',
  },
  dragHandle: {
    paddingHorizontal: Spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
    marginRight: Spacing.xs,
  },
  dragHandleBar: {
    width: 3,
    height: 16,
    borderRadius: 2,
  },
  orderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderText: {
    ...Typography.styles.bodySmall,
    color: '#FFFFFF',
    fontWeight: Typography.fontWeight.bold,
  },
  draggableContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  draggableInfo: {
    flex: 1,
  },
  draggableName: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.medium,
  },
  draggableAddress: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
  },
  draggableActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  moveButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentsList: {
    gap: Spacing.sm,
  },
  studentCard: {
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  studentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentDetails: {
    flex: 1,
    gap: Spacing.xs,
  },
  studentName: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.medium,
  },
  studentSchool: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
  },
  studentAddress: {
    ...Typography.styles.caption,
    fontSize: Typography.fontSize.xs,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.styles.body,
    textAlign: 'center',
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
