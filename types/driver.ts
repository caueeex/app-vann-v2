/**
 * Driver Types - VANN App
 */

import { Location, RouteStatus, StudentStatus, Coordinates } from './common';
import { Child, School } from './user';

export interface Route {
  id: string;
  driverId: string;
  schoolId: string;
  school: School;
  status: RouteStatus;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime?: string; // HH:mm
  students: RouteStudent[];
  currentLocation?: Coordinates;
  startedAt?: string;
  completedAt?: string;
  totalDistance?: number; // in km
  totalDuration?: number; // in minutes
}

export interface RouteStudent {
  id: string;
  studentId: string;
  student: Child;
  pickupOrder: number;
  status: StudentStatus;
  pickupLocation: Location;
  pickedUpAt?: string;
  deliveredAt?: string;
  notes?: string;
}

export interface Itinerary {
  routeId: string;
  stops: ItineraryStop[];
  estimatedDuration: number; // total in minutes
  estimatedDistance: number; // total in km
}

export interface ItineraryStop {
  id: string;
  studentId: string;
  studentName: string;
  location: Location;
  order: number;
  estimatedArrival: string; // HH:mm
  estimatedDuration: number; // minutes from previous stop
  status: 'pending' | 'completed' | 'skipped';
}

export interface DriverStats {
  totalRoutes: number;
  completedRoutes: number;
  activeRoutes: number;
  totalEarnings: number;
  monthlyEarnings: number;
  averageRating: number;
  totalStudents: number;
}

export interface AdsConfig {
  enabled: boolean;
  investment: number; // monthly investment
  priority: number; // 1-10
  reach: number; // estimated views per month
  clicks: number;
  conversions: number;
}
