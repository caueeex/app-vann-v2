/**
 * Validators - VANN App
 * Funções de validação de formulários
 */

export const validators = {
  email: (email: string): string | null => {
    if (!email) return 'Email é obrigatório';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Email inválido';
    return null;
  },

  password: (password: string): string | null => {
    if (!password) return 'Senha é obrigatória';
    if (password.length < 6) return 'Senha deve ter no mínimo 6 caracteres';
    return null;
  },

  phone: (phone: string): string | null => {
    if (!phone) return 'Telefone é obrigatório';
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!phoneRegex.test(phone)) return 'Telefone inválido';
    return null;
  },

  cpf: (cpf: string): string | null => {
    if (!cpf) return 'CPF é obrigatório';
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(cpf)) return 'CPF inválido';
    return null;
  },

  required: (value: string, fieldName: string): string | null => {
    if (!value || value.trim() === '') return `${fieldName} é obrigatório`;
    return null;
  },

  minLength: (value: string, min: number, fieldName: string): string | null => {
    if (value.length < min) return `${fieldName} deve ter no mínimo ${min} caracteres`;
    return null;
  },
};
