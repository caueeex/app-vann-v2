/**
 * Driver Layout - VANN App
 * Tabs Navigator para condutores
 */

import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { HapticTab } from '@/components/haptic-tab';
import { Spacing } from '@/constants/theme';

export default function DriverLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].primary,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopWidth: 1,
          borderTopColor: Colors[colorScheme ?? 'light'].border,
          paddingTop: Spacing.sm,
          paddingBottom: Math.max(insets.bottom, Spacing.sm),
          height: 60 + Math.max(insets.bottom - Spacing.sm, 0),
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
        tabBarItemStyle: {
          paddingVertical: Spacing.xs,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <IconSymbol name="house.fill" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="routes"
        options={{
          title: 'Rotas',
          tabBarIcon: ({ color }) => <IconSymbol name="map.fill" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color }) => <IconSymbol name="clock.fill" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <IconSymbol name="person.fill" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="itinerary"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="schools"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="ads"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="earnings"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="vehicle"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="students"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="expenses"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="reports"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="route-active"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="edit-profile"
        options={{ href: null }}
      />
    </Tabs>
  );
}
