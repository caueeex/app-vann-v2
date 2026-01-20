/**
 * Expenses Types - VANN App
 * Tipos para despesas do condutor
 */

export interface Expense {
  id: string;
  driverId: string;
  date: string; // YYYY-MM-DD
  amount: number;
  category: ExpenseCategory;
  description: string;
  vehicleId?: string;
  receipt?: string; // URL da foto do recibo
  notes?: string;
  createdAt: string;
}

export type ExpenseCategory =
  | 'maintenance' // Manutenção do veículo
  | 'fuel' // Combustível (diesel, gasolina, etc)
  | 'tire' // Pneus
  | 'insurance' // Seguro do veículo
  | 'parking' // Estacionamento
  | 'toll' // Pedágio
  | 'cleaning' // Lavagem
  | 'documentation' // Documentação (licenciamento, etc)
  | 'other'; // Outros

export interface ExpenseSummary {
  total: number;
  monthly: number;
  thisMonth: number;
  lastMonth: number;
  byCategory: Record<ExpenseCategory, number>;
  growth: number; // percentage
}

export interface MonthlyExpenses {
  month: string; // YYYY-MM
  total: number;
  count: number;
  averagePerExpense: number;
}
