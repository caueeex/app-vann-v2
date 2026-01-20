/**
 * User Types - VANN App
 */

import { UserRole, UserStatus, Location, Rating } from './common';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Parent extends User {
  role: 'parent';
  children: Child[];
  defaultLocation?: Location;
  paymentMethods: PaymentMethod[];
}

export interface Child {
  id: string;
  name: string;
  age: number;
  school: School;
  pickupLocation: Location;
  parentId: string;
  photo?: string;
}

export interface School {
  id: string;
  name: string;
  address: Location;
  phone?: string;
  email?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export interface Driver extends User {
  role: 'driver';
  cpf: string;
  cnh: string;
  vehicle: Vehicle;
  rating: number;
  totalRatings: number;
  verified: boolean;
  adsActive: boolean;
  adsInvestment?: number;
  routes: string[]; // Route IDs
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year: number;
  color: string;
  capacity: number;
  photos: string[];
  verified: boolean;
  insuranceExpiry?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  driverId: string;
  rating: Rating;
  comment?: string;
  createdAt: string;
}
