/**
 * Mock Payments Data - VANN App
 */

import { Payment } from '@/types/route';

export const mockPayments: Payment[] = [
  {
    id: 'pay1',
    tripId: undefined,
    amount: 350.0,
    status: 'pending',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: 'Mensalidade - Janeiro 2024',
    type: 'monthly',
    parentId: 'p1',
  },
  {
    id: 'pay2',
    tripId: 'th1',
    amount: 350.0,
    status: 'paid',
    dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paidAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Cartão de Crédito',
    description: 'Mensalidade - Dezembro 2023',
    type: 'monthly',
    parentId: 'p1',
  },
  {
    id: 'pay3',
    tripId: 'th2',
    amount: 350.0,
    status: 'paid',
    dueDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paidAt: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'PIX',
    description: 'Mensalidade - Novembro 2023',
    type: 'monthly',
    parentId: 'p1',
  },
];

// Adicionar parentId ao tipo Payment temporariamente
declare module '@/types/route' {
  interface Payment {
    parentId?: string;
  }
}
