/**
 * CSV Export Utilities - VANN App
 * Funções para exportar dados para CSV (simulado)
 */

import { Alert } from 'react-native';

export interface CSVExportOptions {
  filename: string;
  headers: string[];
  rows: (string | number)[][];
}

/**
 * Converte dados para formato CSV
 */
export function convertToCSV(headers: string[], rows: (string | number)[][]): string {
  // Escapa valores que contêm vírgulas ou aspas
  const escapeValue = (value: string | number): string => {
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Cria a linha de cabeçalho
  const headerLine = headers.map(escapeValue).join(',');

  // Cria as linhas de dados
  const dataLines = rows.map((row) => row.map(escapeValue).join(','));

  // Combina tudo
  return [headerLine, ...dataLines].join('\n');
}

/**
 * Exporta dados para CSV (simulado - apenas mostra alerta)
 */
export async function exportToCSV(options: CSVExportOptions): Promise<boolean> {
  try {
    // Simula um delay de processamento
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const csvContent = convertToCSV(options.headers, options.rows);
    const rowCount = options.rows.length;

    // Mostra alerta simulando exportação bem-sucedida
    Alert.alert(
      'Exportação Concluída',
      `O arquivo "${options.filename}.csv" foi gerado com sucesso!\n\n` +
        `Total de registros: ${rowCount}\n\n` +
        `Em produção, este arquivo seria salvo e disponibilizado para download.`,
      [{ text: 'OK' }]
    );

    // Log do conteúdo para debug (apenas em desenvolvimento)
    if (__DEV__) {
      console.log(`CSV gerado: ${options.filename}`);
      console.log(`Cabeçalhos: ${options.headers.join(', ')}`);
      console.log(`Total de linhas: ${rowCount}`);
      console.log(`Preview (primeiras 3 linhas):\n${csvContent.split('\n').slice(0, 4).join('\n')}`);
    }

    return true;
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    Alert.alert('Erro', 'Não foi possível exportar o arquivo CSV.');
    return false;
  }
}

/**
 * Formata data para CSV (formato brasileiro)
 */
export function formatDateForCSV(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR');
}

/**
 * Formata valor monetário para CSV
 */
export function formatCurrencyForCSV(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
