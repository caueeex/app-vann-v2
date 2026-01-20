/**
 * Select Profile Screen - VANN App
 * Seleção de perfil: Pai ou Condutor
 */

import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing, BorderRadius } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { useUser } from '@/contexts/UserContext';

export default function SelectProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { setUserRole } = useUser();

  const handleSelectProfile = (role: 'parent' | 'driver') => {
    setUserRole(role);
    router.push('/(auth)/register');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Selecione seu perfil" showBack />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Como você quer usar o VANN?</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Escolha o perfil que melhor descreve você
        </Text>

        <View style={styles.cards}>
          <Card
            style={[styles.profileCard, { borderColor: colors.primary }]}
            onPress={() => handleSelectProfile('parent')}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol name="person.fill" size={48} color={colors.primary} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Sou pai/responsável</Text>
            <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
              Busco transporte seguro para meus filhos
            </Text>
          </Card>

          <Card
            style={[styles.profileCard, { borderColor: colors.primary }]}
            onPress={() => handleSelectProfile('driver')}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol name="car.fill" size={48} color={colors.primary} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Sou condutor</Text>
            <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
              Ofereço transporte escolar seguro
            </Text>
          </Card>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    justifyContent: 'center',
  },
  title: {
    ...Typography.styles.h2,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.styles.body,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  cards: {
    gap: Spacing.lg,
    marginTop: Spacing.xl,
  },
  profileCard: {
    borderWidth: 2,
    padding: Spacing.xl,
    alignItems: 'center',
    minHeight: 200,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    ...Typography.styles.h3,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  cardDescription: {
    ...Typography.styles.body,
    textAlign: 'center',
  },
});
