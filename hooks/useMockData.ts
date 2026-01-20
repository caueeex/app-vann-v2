/**
 * useMockData Hook - VANN App
 * Hook para acessar dados mockados
 */

import { useMemo } from 'react';
import { mockDrivers } from '@/mocks/drivers';
import { mockRoutes } from '@/mocks/routes';
import { mockMessages } from '@/mocks/messages';
import { mockContracts } from '@/mocks/contracts';
import { mockNotifications } from '@/mocks/notifications';
import { mockPayments } from '@/mocks/payments';
import { mockEarnings } from '@/mocks/earnings';
import { mockVehicleValidations } from '@/mocks/vehicle-validations';
import { mockExpenses } from '@/mocks/expenses';

export function useMockData() {
  const drivers = useMemo(() => mockDrivers, []);
  const routes = useMemo(() => mockRoutes, []);
  const messages = useMemo(() => mockMessages, []);
  const contracts = useMemo(() => mockContracts, []);
  const notifications = useMemo(() => mockNotifications, []);
  const payments = useMemo(() => mockPayments, []);
  const earnings = useMemo(() => mockEarnings, []);
  const vehicleValidations = useMemo(() => mockVehicleValidations, []);
  const expenses = useMemo(() => mockExpenses, []);

  const getDriverById = (id: string) => {
    return drivers.find((driver) => driver.id === id);
  };

  const getRouteById = (id: string) => {
    return routes.find((route) => route.id === id);
  };

  const getMessagesByDriverId = (driverId: string) => {
    return messages.filter((msg) => msg.driverId === driverId);
  };

  const getContractsByParentId = (parentId: string) => {
    return contracts.filter((contract) => contract.parentId === parentId);
  };

  const getNotificationsByUserId = (userId: string) => {
    return notifications.filter((notif) => notif.userId === userId);
  };

  const getPaymentsByParentId = (parentId: string) => {
    return payments.filter((payment) => payment.parentId === parentId);
  };

  const getEarningsByDriverId = (driverId: string) => {
    return earnings.filter((earning) => earning.driverId === driverId);
  };

  const getValidationsByVehicleId = (vehicleId: string) => {
    return vehicleValidations.filter((validation) => validation.vehicleId === vehicleId);
  };

  const getExpensesByDriverId = (driverId: string) => {
    return expenses.filter((expense) => expense.driverId === driverId);
  };

  return {
    drivers,
    routes,
    messages,
    contracts,
    notifications,
    payments,
    earnings,
    vehicleValidations,
    expenses,
    getDriverById,
    getRouteById,
    getMessagesByDriverId,
    getContractsByParentId,
    getNotificationsByUserId,
    getPaymentsByParentId,
    getEarningsByDriverId,
    getValidationsByVehicleId,
    getExpensesByDriverId,
  };
}
