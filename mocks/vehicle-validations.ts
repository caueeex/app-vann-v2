/**
 * Mock Vehicle Validations Data - VANN App
 * Dados mockados de validações do veículo
 */

import { VehicleValidation } from '@/types/vehicle';

export const mockVehicleValidations: VehicleValidation[] = [
  // Validações do veículo 1 (João Silva)
  {
    id: 'val1',
    vehicleId: 'v1',
    type: 'detran_inspection',
    status: 'valid',
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 meses
    issueDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    documentNumber: 'VIST-2024-001234',
    issuingAgency: 'DETRAN-SP',
    notes: 'Vistoria realizada com sucesso',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'val2',
    vehicleId: 'v1',
    type: 'city_inspection',
    status: 'valid',
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 meses
    issueDate: new Date(Date.now() - 270 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    documentNumber: 'PREFEITURA-2024-5678',
    issuingAgency: 'Prefeitura de São Paulo',
    notes: 'Vistoria municipal aprovada',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'val3',
    vehicleId: 'v1',
    type: 'tachograph',
    status: 'expiring_soon',
    expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 dias
    issueDate: new Date(Date.now() - 345 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    documentNumber: 'TACO-2024-9012',
    issuingAgency: 'INMETRO',
    notes: 'Tacógrafo em dia, renovação próxima',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'val4',
    vehicleId: 'v1',
    type: 'licensing',
    status: 'valid',
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 ano
    issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    documentNumber: 'LIC-2024-3456',
    issuingAgency: 'DETRAN-SP',
    notes: 'Licenciamento 2024 pago',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'val5',
    vehicleId: 'v1',
    type: 'insurance',
    status: 'valid',
    expiryDate: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // ~6.5 meses
    issueDate: new Date(Date.now() - 165 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    documentNumber: 'APOL-2024-7890',
    issuingAgency: 'Seguradora XYZ',
    notes: 'Seguro em vigor',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'val6',
    vehicleId: 'v1',
    type: 'crlv',
    status: 'valid',
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 ano
    issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    documentNumber: 'CRLV-2024-1234',
    issuingAgency: 'DETRAN-SP',
    notes: 'CRLV digital válido',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'val7',
    vehicleId: 'v1',
    type: 'ipva',
    status: 'valid',
    expiryDate: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    issueDate: new Date(Date.now() - 165 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    documentNumber: 'IPVA-2024-5678',
    issuingAgency: 'Secretaria da Fazenda',
    notes: 'IPVA 2024 pago',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'val8',
    vehicleId: 'v1',
    type: 'maintenance',
    status: 'expiring_soon',
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias
    issueDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    documentNumber: 'MANUT-2024-9012',
    issuingAgency: 'Oficina Autorizada',
    notes: 'Última revisão realizada, próxima em 30 dias',
    lastUpdated: new Date().toISOString(),
  },
];
