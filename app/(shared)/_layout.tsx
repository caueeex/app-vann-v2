/**
 * Shared Layout - VANN App
 * Telas compartilhadas entre pais e condutores
 */

import { Stack } from 'expo-router';

export default function SharedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="permissions/location" />
      <Stack.Screen name="permissions/notifications" />
      <Stack.Screen name="permissions/camera" />
      <Stack.Screen name="security-center" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="contracts/[id]" />
      <Stack.Screen name="payments" />
      <Stack.Screen name="terms" />
      <Stack.Screen name="privacy" />
    </Stack>
  );
}
