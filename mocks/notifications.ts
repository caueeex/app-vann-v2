/**
 * Mock Notifications Data - VANN App
 */

import { NotificationType } from '@/types/common';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'p1',
    type: 'trip',
    title: 'Rota iniciada',
    message: 'João Silva iniciou a rota para a escola. Acompanhe em tempo real.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
    actionUrl: '/parent/tracking/r1',
    metadata: { routeId: 'r1', driverId: '1' },
  },
  {
    id: 'n2',
    userId: 'p1',
    type: 'payment',
    title: 'Pagamento pendente',
    message: 'Sua mensalidade de R$ 350,00 vence em 3 dias.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    actionUrl: '/shared/payments',
    metadata: { paymentId: 'pay1', amount: 350.0 },
  },
  {
    id: 'n3',
    userId: 'p1',
    type: 'message',
    title: 'Nova mensagem',
    message: 'João Silva enviou uma mensagem.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: '/parent/chat/1',
    metadata: { driverId: '1' },
  },
  {
    id: 'n4',
    userId: 'p1',
    type: 'system',
    title: 'Bem-vindo ao VANN!',
    message: 'Seu cadastro foi realizado com sucesso. Comece a buscar condutores.',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: 'n5',
    userId: 'p1',
    type: 'security',
    title: 'Van verificada',
    message: 'A van do condutor João Silva foi verificada e aprovada.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    metadata: { driverId: '1' },
  },
];
