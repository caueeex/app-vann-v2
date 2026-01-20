/**
 * Earnings Types - VANN App
 * Tipos para receitas do condutor
 */

export interface Earnings {
  id: string;
  driverId: string;
  date: string; // YYYY-MM-DD
  amount: number;
  type: 'route' | 'monthly' | 'bonus' | 'refund';
  description: string;
  routeId?: string;
  parentId?: string;
  studentId?: string;
  status: 'pending' | 'paid' | 'cancelled';
  paidAt?: string;
  createdAt: string;
}

export interface EarningsSummary {
  total: number;
  monthly: number;
  pending: number;
  thisMonth: number;
  lastMonth: number;
  growth: number; // percentage
}

export interface MonthlyEarnings {
  month: string; // YYYY-MM
  total: number;
  routes: number;
  averagePerRoute: number;
}
