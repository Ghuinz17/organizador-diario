import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { LocaleConfig } from 'react-native-calendars';

import {
  DEFAULT_LANGUAGE,
  translate,
  type Language,
  type TranslationKey,
} from './translations';

const STORAGE_KEY = '@organizador-diario/language';

// Locales de react-native-calendars (xdate). Deben existir ANTES del primer render
// del calendario; setLanguage muta defaultLocale antes de provocar el re-render.
LocaleConfig.locales.es = {
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  monthNamesShort: [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ],
  dayNames: [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy',
};

LocaleConfig.locales.en = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  dayNames: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today',
};

LocaleConfig.defaultLocale = DEFAULT_LANGUAGE;

interface I18nContextValue {
  language: Language;
  ready: boolean;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!active) return;
        if (value === 'en' || value === 'es') {
          LocaleConfig.defaultLocale = value;
          setLanguageState(value);
        }
        setReady(true);
      })
      .catch(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const setLanguage = useCallback((next: Language) => {
    // Se aplica antes del setState para que el calendario lea el locale ya actualizado.
    LocaleConfig.defaultLocale = next;
    setLanguageState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch((error) => {
      console.warn('No se pudo guardar el idioma', error);
    });
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((current) => {
      const next: Language = current === 'es' ? 'en' : 'es';
      LocaleConfig.defaultLocale = next;
      AsyncStorage.setItem(STORAGE_KEY, next).catch((error) => {
        console.warn('No se pudo guardar el idioma', error);
      });
      return next;
    });
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) =>
      translate(language, key, params),
    [language],
  );

  const value = useMemo(
    () => ({ language, ready, t, setLanguage, toggleLanguage }),
    [language, ready, t, setLanguage, toggleLanguage],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n debe usarse dentro de <I18nProvider>');
  }
  return context;
}
