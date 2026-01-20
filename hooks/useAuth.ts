/**
 * useAuth Hook - VANN App
 * Hook para autenticação
 */

import { useAuth as useAuthContext } from '@/contexts/AuthContext';

export function useAuth() {
  return useAuthContext();
}
