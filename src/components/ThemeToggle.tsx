import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { useI18n } from '@/i18n/I18nContext';
import { useTheme } from '@/theme/ThemeContext';

/** Icono de sol en tema claro, de luna en tema oscuro. Va en la cabecera del stack. */
export function ThemeToggle() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { t } = useI18n();

  return (
    <Pressable
      onPress={toggleTheme}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={isDark ? t('a11y.themeToLight') : t('a11y.themeToDark')}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.6 : 1,
        },
      ]}
    >
      <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
