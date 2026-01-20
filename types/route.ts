/**
 * Route Types - VANN App
 */

import { Location, Coordinates, PaymentStatus } from './common';
import { Driver, Vehicle } from './user';
import { RouteStudent, School } from './driver';

export interface TrackingRoute {
  id: string;
  driver: {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
  };
  vehicle: {
    id: string;
    plate: string;
    model: string;
    brand: string;
    color: string;
    photo?: string;
  };
  school: School;
  currentLocation?: Coordinates;
  nextStop?: {
    studentName: string;
    location: Location;
    estimatedArrival: string;
  };
  students: RouteStudent[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  startedAt?: string;
  estimatedCompletion?: string;
}

export interface TripHistory {
  id: string;
  routeId: string;
  date: string;
  driver: {
    id: string;
    name: string;
    avatar?: string;
  };
  vehicle: {
    plate: string;
    model: string;
  };
  school: {
    name: string;
    address: string;
  };
  students: Array<{
    id: string;
    name: string;
    status: 'completed' | 'cancelled';
  }>;
  status: 'completed' | 'cancelled';
  duration?: number; // minutes
  distance?: number; // km
  rating?: number;
  reviewed: boolean;
}

export interface Payment {
  id: string;
  tripId?: string;
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  paidAt?: string;
  paymentMethod?: string;
  description: string;
  type: 'monthly' | 'trip' | 'penalty' | 'refund';
}

export interface Contract {
  id: string;
  driverId: string;
  parentId: string;
  childId: string;
  startDate: string;
  endDate?: string;
  monthlyFee: number;
  status: 'pending' | 'active' | 'cancelled' | 'expired';
  signedAt?: string;
  cancelledAt?: string;
  terms: string;
  version: string;
}
