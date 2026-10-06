import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useTheme } from '@/theme/ThemeContext';

interface TimePickerFieldProps {
  label: string;
  /** Valor controlado en formato 24h: HH:mm */
  value: string;
  onChange: (value: string) => void;
}

function sanitize(raw: string): string {
  return raw.replace(/[^0-9]/g, '').slice(0, 2);
}

function isValid(hours: string, minutes: string): boolean {
  if (hours.length === 0 || minutes.length === 0) return false;
  const hh = Number(hours);
  const mm = Number(minutes);
  return hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59;
}

function format(hours: string, minutes: string): string {
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}

/**
 * Campo de hora sin dependencias nativas: dos casillas numéricas (HH y MM).
 * Solo emite valores completos y válidos hacia el formulario.
 */
export function TimePickerField({ label, value, onChange }: TimePickerFieldProps) {
  const { colors } = useTheme();
  const [hours, setHours] = useState(value.slice(0, 2));
  const [minutes, setMinutes] = useState(value.slice(3, 5));

  // Ajuste de estado durante el render (patrón recomendado por React en lugar de un effect).
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setHours(value.slice(0, 2));
    setMinutes(value.slice(3, 5));
  }

  const handleChange = (part: 'hours' | 'minutes', raw: string) => {
    const clean = sanitize(raw);
    if (part === 'hours') {
      setHours(clean);
      if (clean.length === 2 && isValid(clean, minutes)) onChange(format(clean, minutes));
    } else {
      setMinutes(clean);
      if (clean.length === 2 && isValid(hours, clean)) onChange(format(hours, clean));
    }
  };

  const handleBlur = (part: 'hours' | 'minutes') => {
    const paddedHours = hours.padStart(2, '0');
    const paddedMinutes = minutes.padStart(2, '0');
    if (isValid(paddedHours, paddedMinutes)) {
      const next = format(paddedHours, paddedMinutes);
      setHours(paddedHours);
      setMinutes(paddedMinutes);
      if (next !== value) onChange(next);
    } else if (part === 'hours') {
      setHours(hours.length === 1 ? paddedHours : hours);
    } else {
      setMinutes(minutes.length === 1 ? paddedMinutes : minutes);
    }
  };

  const inputStyle = [
    styles.input,
    { color: colors.text, backgroundColor: colors.surfaceAlt, borderColor: colors.border },
  ];

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      <View style={styles.row}>
        <TextInput
          value={hours}
          onChangeText={(text) => handleChange('hours', text)}
          onBlur={() => handleBlur('hours')}
          placeholder="HH"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          maxLength={2}
          selectTextOnFocus
          style={inputStyle}
          accessibilityLabel={`${label}: horas`}
        />
        <Text style={[styles.separator, { color: colors.textMuted }]}>:</Text>
        <TextInput
          value={minutes}
          onChangeText={(text) => handleChange('minutes', text)}
          onBlur={() => handleBlur('minutes')}
          placeholder="MM"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          maxLength={2}
          selectTextOnFocus
          style={inputStyle}
          accessibilityLabel={`${label}: minutos`}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  separator: {
    fontSize: 18,
    fontWeight: '600',
  },
});
