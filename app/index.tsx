/**
 * Initial Screen - VANN App
 * Tela inicial que redireciona baseado no estado de autenticação
 */

import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/contexts/UserContext';
import { SplashScreen } from '@/components/SplashScreen';

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const { setUserRole } = useUser();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    if (showSplash || isLoading) return;

    if (!isAuthenticated) {
      // Redirecionar para login (tela inicial)
      router.replace('/(auth)/login');
    } else if (user) {
      // Redirecionar baseado no tipo de usuário
      setUserRole(user.role);
      if (user.role === 'parent') {
        router.replace('/(parent)/dashboard');
      } else {
        router.replace('/(driver)/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, user, router, setUserRole, showSplash]);

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} duration={2500} />;
  }

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
