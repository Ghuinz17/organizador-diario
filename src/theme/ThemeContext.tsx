import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';

import { palettes, type ThemeColors, type ThemeMode } from './colors';

const STORAGE_KEY = '@organizador-diario/theme-mode';

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  ready: boolean;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [storedMode, setStoredMode] = useState<ThemeMode | null>(null);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!active) return;
        if (value === 'light' || value === 'dark') {
          setStoredMode(value);
        } else {
          setStoredMode(systemScheme === 'dark' ? 'dark' : 'light');
        }
      })
      .catch(() => {
        if (active) setStoredMode(systemScheme === 'dark' ? 'dark' : 'light');
      });
    return () => {
      active = false;
    };
  }, [systemScheme]);

  const mode: ThemeMode = storedMode ?? (systemScheme === 'dark' ? 'dark' : 'light');

  const setMode = useCallback((next: ThemeMode) => {
    setStoredMode(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch((error) => {
      console.warn('No se pudo guardar la preferencia de tema', error);
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  const value = useMemo(
    () => ({
      mode,
      colors: palettes[mode],
      isDark: mode === 'dark',
      ready: storedMode !== null,
      toggleTheme,
      setMode,
    }),
    [mode, storedMode, toggleTheme, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de <ThemeProvider>');
  }
  return context;
}
