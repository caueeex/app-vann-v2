/**
 * Onboarding Layout - VANN App
 */

import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="security" />
      <Stack.Screen name="tracking" />
      <Stack.Screen name="communication" />
      <Stack.Screen name="select-profile" />
    </Stack>
  );
}
