/**
 * ThemeContext - VANN App
 * Contexto de tema claro/escuro
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme } from '@/hooks/use-color-scheme';

type ColorScheme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  effectiveColorScheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useSystemColorScheme();
  // Forçar tema claro por padrão
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');

  const effectiveColorScheme = 'light'; // Sempre usar tema claro

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        setColorScheme,
        effectiveColorScheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
