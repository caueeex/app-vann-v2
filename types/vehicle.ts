/**
 * Vehicle Types - VANN App
 * Tipos para informações e validações do veículo
 */

export interface VehicleValidation {
  id: string;
  vehicleId: string;
  type: ValidationType;
  status: ValidationStatus;
  expiryDate?: string; // YYYY-MM-DD
  issueDate?: string; // YYYY-MM-DD
  documentNumber?: string;
  issuingAgency?: string;
  notes?: string;
  lastUpdated: string;
}

export type ValidationType =
  | 'detran_inspection' // Vistoria DETRAN
  | 'city_inspection' // Vistoria Prefeitura
  | 'tachograph' // Tacógrafo
  | 'licensing' // Licenciamento
  | 'insurance' // Seguro
  | 'crlv' // CRLV (Certificado de Registro e Licenciamento de Veículo)
  | 'ipva' // IPVA
  | 'maintenance'; // Manutenção

export type ValidationStatus = 'valid' | 'expiring_soon' | 'expired' | 'pending' | 'not_required';

// Importar Vehicle do user.ts
import { Vehicle } from './user';

export interface VehicleDetails extends Vehicle {
  validations: VehicleValidation[];
  registrationNumber?: string; // Número do chassi
  renavam?: string; // Registro Nacional de Veículos Automotores
  fuelType?: 'gasoline' | 'ethanol' | 'diesel' | 'flex' | 'electric';
  mileage?: number; // Quilometragem atual
  lastMaintenance?: string; // Data da última manutenção
  nextMaintenance?: string; // Data da próxima manutenção
}
