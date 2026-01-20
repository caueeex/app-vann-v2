/**
 * Mock Messages Data - VANN App
 */

export interface Message {
  id: string;
  driverId: string;
  parentId: string;
  senderId: string; // 'driver' | 'parent'
  content: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
  isTemplate?: boolean;
}

export const mockMessages: Message[] = [
  {
    id: 'm1',
    driverId: '1',
    parentId: 'p1',
    senderId: 'parent',
    content: 'Olá, gostaria de saber sobre a rota para a escola.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'read',
  },
  {
    id: 'm2',
    driverId: '1',
    parentId: 'p1',
    senderId: 'driver',
    content: 'Olá! A rota sai às 7h da manhã. Posso passar mais detalhes se precisar.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: 'read',
  },
  {
    id: 'm3',
    driverId: '1',
    parentId: 'p1',
    senderId: 'parent',
    content: 'Perfeito, obrigada!',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'read',
  },
  {
    id: 'm4',
    driverId: '1',
    parentId: 'p1',
    senderId: 'driver',
    content: 'De nada! Qualquer dúvida, estou à disposição.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'delivered',
  },
];

export const messageTemplates = [
  'Olá, gostaria de mais informações sobre a rota.',
  'Qual o horário de saída?',
  'A van já saiu?',
  'Obrigada pelo serviço!',
  'Preciso alterar o ponto de coleta.',
];
