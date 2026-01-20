/**
 * Mock Routes Data - VANN App
 */

import { Route, TrackingRoute, TripHistory } from '@/types/route';
import { School } from '@/types/user';
import { Child } from '@/types/user';

const mockSchool1: School = {
  id: 's1',
  name: 'Escola Municipal São Paulo',
  address: {
    latitude: -23.5505,
    longitude: -46.6333,
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
  },
  phone: '(11) 3456-7890',
  email: 'contato@escolasp.com.br',
};

const mockSchool2: School = {
  id: 's2',
  name: 'Colégio Dom Pedro II',
  address: {
    latitude: -23.5605,
    longitude: -46.6443,
    address: 'Av. Brigadeiro, 500',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01321-000',
  },
  phone: '(11) 3123-4567',
  email: 'contato@colegiodompedro.com.br',
};

const mockSchool3: School = {
  id: 's3',
  name: 'Escola Estadual Vila Mariana',
  address: {
    latitude: -23.5705,
    longitude: -46.6543,
    address: 'Rua Domingos de Morais, 200',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '04010-000',
  },
  phone: '(11) 3234-5678',
  email: 'contato@eevilamariana.com.br',
};

const mockChildren: Child[] = [
  {
    id: 'c1',
    name: 'Lucas Silva',
    age: 8,
    school: mockSchool1,
    pickupLocation: {
      latitude: -23.5515,
      longitude: -46.6343,
      address: 'Av. Paulista, 1000, Bela Vista',
      city: 'São Paulo',
      state: 'SP',
    },
    parentId: 'p1',
  },
  {
    id: 'c2',
    name: 'Sophia Costa',
    age: 7,
    school: mockSchool1,
    pickupLocation: {
      latitude: -23.5525,
      longitude: -46.6353,
      address: 'Rua Augusta, 500, Consolação',
      city: 'São Paulo',
      state: 'SP',
    },
    parentId: 'p2',
  },
  {
    id: 'c3',
    name: 'Pedro Santos',
    age: 9,
    school: mockSchool2,
    pickupLocation: {
      latitude: -23.5615,
      longitude: -46.6453,
      address: 'Rua dos Três Irmãos, 200, Vila Madalena',
      city: 'São Paulo',
      state: 'SP',
    },
    parentId: 'p3',
  },
  {
    id: 'c4',
    name: 'Ana Oliveira',
    age: 10,
    school: mockSchool3,
    pickupLocation: {
      latitude: -23.5715,
      longitude: -46.6553,
      address: 'Rua Vergueiro, 300, Vila Mariana',
      city: 'São Paulo',
      state: 'SP',
    },
    parentId: 'p4',
  },
];

export const mockRoutes: Route[] = [
  {
    id: 'r1',
    driverId: '1',
    schoolId: 's1',
    school: mockSchool1,
    status: 'scheduled',
    date: new Date().toISOString().split('T')[0],
    startTime: '07:00',
    endTime: '08:30',
    students: [
      {
        id: 'rs1',
        studentId: 'c1',
        student: mockChildren[0],
        pickupOrder: 1,
        status: 'waiting',
        pickupLocation: mockChildren[0].pickupLocation,
      },
      {
        id: 'rs2',
        studentId: 'c2',
        student: mockChildren[1],
        pickupOrder: 2,
        status: 'waiting',
        pickupLocation: mockChildren[1].pickupLocation,
      },
    ],
    totalDistance: 15.5,
    totalDuration: 90,
  },
  {
    id: 'r2',
    driverId: '1',
    schoolId: 's2',
    school: mockSchool2,
    status: 'scheduled',
    date: new Date().toISOString().split('T')[0],
    startTime: '13:00',
    endTime: '14:30',
    students: [
      {
        id: 'rs3',
        studentId: 'c3',
        student: mockChildren[2],
        pickupOrder: 1,
        status: 'waiting',
        pickupLocation: mockChildren[2].pickupLocation,
      },
    ],
    totalDistance: 12.0,
    totalDuration: 75,
  },
  {
    id: 'r3',
    driverId: '2',
    schoolId: 's3',
    school: mockSchool3,
    status: 'scheduled',
    date: new Date().toISOString().split('T')[0],
    startTime: '07:30',
    endTime: '09:00',
    students: [
      {
        id: 'rs4',
        studentId: 'c4',
        student: mockChildren[3],
        pickupOrder: 1,
        status: 'waiting',
        pickupLocation: mockChildren[3].pickupLocation,
      },
    ],
    totalDistance: 18.0,
    totalDuration: 90,
  },
];

export const mockTrackingRoutes: TrackingRoute[] = [
  {
    id: 'tr1',
    driver: {
      id: '1',
      name: 'João Silva',
      phone: '(11) 98765-4321',
    },
    vehicle: {
      id: 'v1',
      plate: 'ABC-1234',
      model: 'Sprinter',
      brand: 'Mercedes-Benz',
      color: 'Branco',
    },
    school: mockSchool1,
    currentLocation: {
      lat: -23.5515,
      lng: -46.6343,
    },
    nextStop: {
      studentName: 'Lucas Silva',
      location: mockChildren[0].pickupLocation,
      estimatedArrival: '07:15',
    },
    students: mockRoutes[0].students,
    status: 'in_progress',
    startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    estimatedCompletion: '08:30',
  },
];

// Exportar alunos e escolas para uso em outras partes do app
export { mockChildren, mockSchool1, mockSchool2, mockSchool3 };

export const mockTripHistory: TripHistory[] = [
  {
    id: 'th1',
    routeId: 'r1',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    driver: {
      id: '1',
      name: 'João Silva',
    },
    vehicle: {
      plate: 'ABC-1234',
      model: 'Sprinter',
    },
    school: {
      name: 'Escola Municipal São Paulo',
      address: 'Rua das Flores, 123',
    },
    students: [
      {
        id: 'c1',
        name: 'Lucas Silva',
        status: 'completed',
      },
    ],
    status: 'completed',
    duration: 85,
    distance: 14.2,
    rating: 5,
    reviewed: true,
  },
  {
    id: 'th2',
    routeId: 'r2',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    driver: {
      id: '1',
      name: 'João Silva',
    },
    vehicle: {
      plate: 'ABC-1234',
      model: 'Sprinter',
    },
    school: {
      name: 'Escola Municipal São Paulo',
      address: 'Rua das Flores, 123',
    },
    students: [
      {
        id: 'c1',
        name: 'Lucas Silva',
        status: 'completed',
      },
    ],
    status: 'completed',
    duration: 90,
    distance: 15.5,
    rating: undefined,
    reviewed: false,
  },
];
