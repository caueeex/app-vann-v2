/**
 * Common Types - VANN App
 */

export type UserRole = 'parent' | 'driver';

export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export type RouteStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export type StudentStatus = 'waiting' | 'picked_up' | 'in_transit' | 'delivered';

export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

export type NotificationType = 'trip' | 'payment' | 'message' | 'system' | 'security';

export type Rating = 1 | 2 | 3 | 4 | 5;

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface TimeRange {
  start: string; // HH:mm format
  end: string; // HH:mm format
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
