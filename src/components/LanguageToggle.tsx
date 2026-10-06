import { Pressable, StyleSheet, Text } from 'react-native';

import { useI18n } from '@/i18n/I18nContext';
import { useTheme } from '@/theme/ThemeContext';
import type { Language } from '@/i18n/translations';

const FLAG: Record<Language, string> = { es: '🇪🇸', en: '🇬🇧' };
const CODE: Record<Language, string> = { es: 'ES', en: 'EN' };

/** Chip con la bandera e inicial del idioma actual; al pulsar, alterna ES ↔ EN. */
export function LanguageToggle() {
  const { colors } = useTheme();
  const { language, toggleLanguage, t } = useI18n();

  return (
    <Pressable
      onPress={toggleLanguage}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={language === 'es' ? t('a11y.languageToEn') : t('a11y.languageToEs')}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.6 : 1,
        },
      ]}
    >
      <Text style={styles.flag}>{FLAG[language]}</Text>
      <Text style={[styles.code, { color: colors.text }]}>{CODE[language]}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 9,
  },
  flag: {
    fontSize: 15,
    lineHeight: 18,
  },
  code: {
    fontSize: 12,
    fontWeight: '700',
  },
});
