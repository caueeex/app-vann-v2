/**
 * Route Optimizer - VANN App
 * Algoritmo para otimizar ordem de coleta de alunos
 */

import { Location } from '@/types/common';
import { Child } from '@/types/user';

export interface StudentWithLocation {
  id: string;
  student: Child;
  pickupLocation: Location;
}

/**
 * Calcula distância aproximada entre duas coordenadas (Haversine)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Otimiza a ordem de coleta usando algoritmo Nearest Neighbor (vizinho mais próximo)
 * Começa do ponto de origem e sempre escolhe o aluno mais próximo ainda não coletado
 */
export function optimizeRouteOrder(
  students: StudentWithLocation[],
  originLocation?: Location
): StudentWithLocation[] {
  if (students.length === 0) return [];

  // Se não há origem definida, usa a primeira localização como origem
  const origin = originLocation || {
    latitude: students[0].pickupLocation.latitude,
    longitude: students[0].pickupLocation.longitude,
    address: 'Origem',
  };

  const optimized: StudentWithLocation[] = [];
  const remaining = [...students];
  let currentLat = origin.latitude;
  let currentLon = origin.longitude;

  while (remaining.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = calculateDistance(
      currentLat,
      currentLon,
      remaining[0].pickupLocation.latitude,
      remaining[0].pickupLocation.longitude
    );

    // Encontra o aluno mais próximo
    for (let i = 1; i < remaining.length; i++) {
      const distance = calculateDistance(
        currentLat,
        currentLon,
        remaining[i].pickupLocation.latitude,
        remaining[i].pickupLocation.longitude
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    // Adiciona o mais próximo à rota otimizada
    const nearest = remaining.splice(nearestIndex, 1)[0];
    optimized.push(nearest);

    // Atualiza posição atual
    currentLat = nearest.pickupLocation.latitude;
    currentLon = nearest.pickupLocation.longitude;
  }

  return optimized;
}

/**
 * Calcula distância total da rota em km
 */
export function calculateTotalDistance(
  students: StudentWithLocation[],
  schoolLocation: Location,
  originLocation?: Location
): number {
  if (students.length === 0) return 0;

  let totalDistance = 0;
  const origin = originLocation || {
    latitude: students[0].pickupLocation.latitude,
    longitude: students[0].pickupLocation.longitude,
    address: 'Origem',
  };

  // Distância da origem até o primeiro aluno
  if (students.length > 0) {
    totalDistance += calculateDistance(
      origin.latitude,
      origin.longitude,
      students[0].pickupLocation.latitude,
      students[0].pickupLocation.longitude
    );
  }

  // Distâncias entre alunos consecutivos
  for (let i = 0; i < students.length - 1; i++) {
    totalDistance += calculateDistance(
      students[i].pickupLocation.latitude,
      students[i].pickupLocation.longitude,
      students[i + 1].pickupLocation.latitude,
      students[i + 1].pickupLocation.longitude
    );
  }

  // Distância do último aluno até a escola
  if (students.length > 0) {
    totalDistance += calculateDistance(
      students[students.length - 1].pickupLocation.latitude,
      students[students.length - 1].pickupLocation.longitude,
      schoolLocation.latitude,
      schoolLocation.longitude
    );
  }

  return totalDistance;
}

/**
 * Calcula tempo estimado da rota em minutos
 * Assume velocidade média de 40 km/h em área urbana
 * + 2 minutos por parada (coleta de aluno)
 */
export function calculateEstimatedDuration(
  distance: number,
  numberOfStops: number
): number {
  const AVERAGE_SPEED_KMH = 40; // km/h
  const TIME_PER_STOP_MINUTES = 2; // minutos por parada

  const travelTime = (distance / AVERAGE_SPEED_KMH) * 60; // minutos
  const stopTime = numberOfStops * TIME_PER_STOP_MINUTES;

  return Math.round(travelTime + stopTime);
}
