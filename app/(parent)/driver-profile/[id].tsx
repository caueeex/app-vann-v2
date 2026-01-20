/**
 * Driver Profile Screen - VANN App
 */

import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Typography, Spacing } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useMockData } from '@/hooks/useMockData';
import { mockReviews } from '@/mocks/drivers';

export default function DriverProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { getDriverById } = useMockData();

  const driver = getDriverById(id || '');

  if (!driver) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Condutor não encontrado" showBack />
      </View>
    );
  }

  const reviews = mockReviews.filter((r) => r.driverId === driver.id);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Perfil do condutor" showBack />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        <Card style={[styles.profileCard, { backgroundColor: colors.primary + '05' }]}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol name="person.fill" size={48} color={colors.primary} />
              {driver.verified && (
                <View style={[styles.verifiedBadge, { backgroundColor: colors.success }]}>
                  <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
                </View>
              )}
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.name, { color: colors.text }]}>{driver.name}</Text>
                {driver.verified && <Badge label="Verificado" variant="verified" />}
              </View>
              <View style={styles.ratingRow}>
                <Rating rating={Math.round(driver.rating) as any} size={20} readonly />
                <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                  {driver.rating.toFixed(1)} ({driver.totalRatings} avaliações)
                </Text>
              </View>
              {driver.adsActive && (
                <View style={styles.adsIndicator}>
                  <IconSymbol name="flame.fill" size={14} color={colors.primary} />
                  <Text style={[styles.adsText, { color: colors.primary }]}>
                    Anúncio ativo
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Card>

        <Card style={styles.infoCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Informações da van</Text>
          <View style={styles.infoRow}>
            <IconSymbol name="car.fill" size={20} color={colors.icon} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              {driver.vehicle.brand} {driver.vehicle.model} {driver.vehicle.year}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <IconSymbol name="number" size={20} color={colors.icon} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              Placa: {driver.vehicle.plate}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <IconSymbol name="person.3.fill" size={20} color={colors.icon} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              Capacidade: {driver.vehicle.capacity} lugares
            </Text>
          </View>
        </Card>

        {reviews.length > 0 && (
          <Card style={styles.reviewsCard}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Avaliações</Text>
            {reviews.map((review) => (
              <View key={review.id} style={styles.review}>
                <View style={styles.reviewHeader}>
                  <Text style={[styles.reviewName, { color: colors.text }]}>
                    {review.userName}
                  </Text>
                  <Rating rating={review.rating} size={16} readonly />
                </View>
                {review.comment && (
                  <Text style={[styles.reviewComment, { color: colors.textSecondary }]}>
                    {review.comment}
                  </Text>
                )}
              </View>
            ))}
          </Card>
        )}

        <View style={styles.actions}>
          <Button
            title="Enviar mensagem"
            variant="outline"
            size="large"
            fullWidth
            leftIcon={<IconSymbol name="message.fill" size={20} color={colors.primary} />}
            onPress={() => router.push(`/(parent)/chat/${driver.id}`)}
            style={styles.actionButton}
          />
          <Button
            title="Contratar"
            variant="primary"
            size="large"
            fullWidth
            leftIcon={<IconSymbol name="checkmark.circle.fill" size={20} color="#FFFFFF" />}
            onPress={() => router.push(`/(shared)/contracts/new?driverId=${driver.id}`)}
            style={styles.actionButton}
          />
        </View>
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
  profileCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  adsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  adsText: {
    ...Typography.styles.caption,
    fontWeight: Typography.fontWeight.medium,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  name: {
    ...Typography.styles.h2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  ratingText: {
    ...Typography.styles.body,
  },
  infoCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.styles.h4,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  infoItem: {
    flex: 1,
    minWidth: '30%',
    padding: Spacing.sm,
    borderRadius: 12,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  infoLabel: {
    ...Typography.styles.caption,
    textAlign: 'center',
  },
  infoValue: {
    ...Typography.styles.bodySmall,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
  },
  reviewsCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  review: {
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  reviewName: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.medium,
  },
  reviewComment: {
    ...Typography.styles.bodySmall,
    marginTop: Spacing.xs,
  },
  actions: {
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  actionButton: {
    marginBottom: 0,
  },
});
