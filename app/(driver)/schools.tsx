/**
 * Driver Schools Screen - VANN App
 */

import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { EmptyState } from '@/components/ui/EmptyState';

export default function DriverSchoolsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const schools = [
    { id: '1', name: 'Escola Municipal São Paulo', address: 'Rua das Flores, 123' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Escolas" showBack />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        {schools.length === 0 ? (
          <EmptyState
            icon="building.2.fill"
            title="Nenhuma escola cadastrada"
            description="Cadastre escolas para associar alunos às rotas"
            actionLabel="Cadastrar escola"
            onAction={() => {
              // Ação de cadastrar
            }}
          />
        ) : (
          schools.map((school) => (
            <Card key={school.id} style={styles.schoolCard}>
              <View style={styles.schoolHeader}>
                <IconSymbol name="building.2.fill" size={32} color={colors.primary} />
                <View style={styles.schoolInfo}>
                  <Text style={[styles.schoolName, { color: colors.text }]}>{school.name}</Text>
                  <Text style={[styles.schoolAddress, { color: colors.textSecondary }]}>
                    {school.address}
                  </Text>
                </View>
              </View>
              <Button
                title="Gerenciar alunos"
                variant="outline"
                size="medium"
                fullWidth
                onPress={() => {
                  // Ação de gerenciar
                }}
                style={styles.actionButton}
              />
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  schoolCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  schoolHeader: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  schoolInfo: {
    flex: 1,
  },
  schoolName: {
    ...Typography.styles.h4,
    marginBottom: Spacing.xs,
  },
  schoolAddress: {
    ...Typography.styles.bodySmall,
  },
  actionButton: {
    marginTop: Spacing.sm,
  },
});
