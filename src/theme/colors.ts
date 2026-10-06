export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  primary: string;
  primarySoft: string;
  onPrimary: string;
  border: string;
  danger: string;
  success: string;
}

export const lightColors: ThemeColors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',
  text: '#0F172A',
  textMuted: '#64748B',
  primary: '#2563EB',
  primarySoft: '#DBEAFE',
  onPrimary: '#FFFFFF',
  border: '#E2E8F0',
  danger: '#DC2626',
  success: '#16A34A',
};

export const darkColors: ThemeColors = {
  background: '#0B1220',
  surface: '#111A2C',
  surfaceAlt: '#1A2438',
  text: '#E2E8F0',
  textMuted: '#94A3B8',
  primary: '#60A5FA',
  primarySoft: '#1E3A8A',
  onPrimary: '#0B1220',
  border: '#1E293B',
  danger: '#F87171',
  success: '#4ADE80',
};

export const palettes: Record<ThemeMode, ThemeColors> = {
  light: lightColors,
  dark: darkColors,
};
