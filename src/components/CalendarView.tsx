import { StyleSheet, View } from 'react-native';
import { Calendar, type CalendarProps, type DateData } from 'react-native-calendars';

import { useI18n } from '@/i18n/I18nContext';
import { useTheme } from '@/theme/ThemeContext';

type MarkedDates = NonNullable<CalendarProps['markedDates']>;
type CalendarTheme = NonNullable<CalendarProps['theme']>;

interface CalendarViewProps {
  selected: string;
  markedDates: MarkedDates;
  onDayPress: (date: DateData) => void;
}

export type { DateData, MarkedDates };

export function CalendarView({ selected, markedDates, onDayPress }: CalendarViewProps) {
  const { colors, mode } = useTheme();
  const { language } = useI18n();

  const theme: CalendarTheme = {
    calendarBackground: colors.surface,
    dayTextColor: colors.text,
    textSectionTitleColor: colors.textMuted,
    monthTextColor: colors.primary,
    arrowColor: colors.primary,
    disabledArrowColor: colors.textMuted,
    todayTextColor: colors.primary,
    todayBackgroundColor: colors.primarySoft,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: colors.onPrimary,
    dotColor: colors.primary,
    textDisabledColor: colors.textMuted,
    textMonthFontSize: 16,
    textDayFontSize: 15,
    textDayHeaderFontSize: 13,
  };

  const merged: MarkedDates = {
    ...markedDates,
    [selected]: {
      ...(markedDates[selected] ?? {}),
      selected: true,
      selectedColor: colors.primary,
      disableTouchEvent: false,
    },
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Calendar
        // El componente memoriza el tema y el locale al montarse: remontamos al cambiar de modo o idioma.
        key={`${mode}-${language}`}
        initialDate={selected}
        firstDay={1}
        onDayPress={onDayPress}
        markedDates={merged}
        markingType="dot"
        theme={theme}
        enableSwipeMonths
        hideExtraDays
        style={styles.calendar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  calendar: {
    paddingBottom: 8,
  },
});
