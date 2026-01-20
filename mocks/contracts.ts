/**
 * Mock Contracts Data - VANN App
 */

import { Contract } from '@/types/route';

export const mockContracts: Contract[] = [
  {
    id: 'c1',
    driverId: '1',
    parentId: 'p1',
    childId: 'c1',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    monthlyFee: 350.0,
    status: 'active',
    signedAt: '2023-12-15T10:00:00Z',
    terms: `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE TRANSPORTE ESCOLAR

1. OBJETO
O presente contrato tem por objeto a prestação de serviços de transporte escolar do menor [NOME DA CRIANÇA], matriculado na [NOME DA ESCOLA].

2. VALOR
O valor mensal do serviço é de R$ 350,00 (trezentos e cinquenta reais), a ser pago até o dia 5 de cada mês.

3. HORÁRIOS
- Saída: 07:00h
- Retorno: 14:30h

4. OBRIGAÇÕES DO CONTRATADO
- Transportar o menor com segurança e pontualidade
- Manter veículo em condições adequadas
- Comunicar atrasos ou imprevistos

5. OBRIGAÇÕES DO CONTRATANTE
- Efetuar pagamento em dia
- Comunicar ausências com antecedência
- Estar presente no ponto de coleta no horário combinado

6. RESCISÃO
O contrato pode ser rescindido por qualquer das partes mediante aviso prévio de 30 dias.

São Paulo, 15 de dezembro de 2023.
    `,
    version: '1.0',
  },
  {
    id: 'c2',
    driverId: '1',
    parentId: 'p1',
    childId: 'c1',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    monthlyFee: 320.0,
    status: 'expired',
    signedAt: '2022-12-10T10:00:00Z',
    terms: 'Contrato anterior - versão 2023',
    version: '1.0',
  },
];
