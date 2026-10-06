import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CalendarView, type DateData, type MarkedDates } from '@/components/CalendarView';
import { TaskCard } from '@/components/TaskCard';
import { useTasks } from '@/context/TasksContext';
import { useI18n } from '@/i18n/I18nContext';
import { useTheme } from '@/theme/ThemeContext';
import type { Task } from '@/types/task';
import { formatShortDate, todayISO } from '@/utils/date';

export function CalendarScreen() {
  const { colors } = useTheme();
  const { t, language } = useI18n();
  const { tasks, tasksForDate, removeTask } = useTasks();
  const [selected, setSelected] = useState(todayISO());

  const markedDates = useMemo<MarkedDates>(() => {
    const acc: MarkedDates = {};
    for (const task of tasks) {
      const existing = acc[task.date];
      acc[task.date] = existing
        ? { ...existing, marked: true }
        : { marked: true, dotColor: task.color };
    }
    return acc;
  }, [tasks]);

  const dayTasks = tasksForDate(selected);

  const openTaskScreen = (date: string) => {
    router.push({ pathname: '/task/[date]', params: { date } });
  };

  const handleDayPress = (day: DateData) => {
    setSelected(day.dateString);
  };

  const confirmDelete = (task: Task) => {
    Alert.alert(
      t('delete.confirmTitle'),
      t('delete.confirmMessage', { title: task.title }),
      [
        { text: t('delete.cancel'), style: 'cancel' },
        {
          text: t('delete.confirm'),
          style: 'destructive',
          onPress: () => void removeTask(task.id),
        },
      ],
    );
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <CalendarView
        selected={selected}
        markedDates={markedDates}
        onDayPress={handleDayPress}
      />

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {formatShortDate(selected, language)}
        </Text>
        <Pressable
          onPress={() => openTaskScreen(selected)}
          accessibilityRole="button"
          hitSlop={8}
          style={({ pressed }) => [styles.manageButton, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={[styles.manageText, { color: colors.primary }]}>
            {t('calendar.manageDay')}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </Pressable>
      </View>

      {dayTasks.length === 0 ? (
        <View
          style={[
            styles.empty,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Ionicons name="calendar-clear-outline" size={28} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            {t('calendar.emptyDay')}
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {dayTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => openTaskScreen(selected)}
              onDelete={() => confirmDelete(task)}
            />
          ))}
        </View>
      )}

      <Pressable
        onPress={() => openTaskScreen(selected)}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.addButton,
          { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <Ionicons name="add" size={22} color={colors.onPrimary} />
        <Text style={[styles.addText, { color: colors.onPrimary }]}>
          {t('calendar.newTask')}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 14,
    paddingBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  manageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  empty: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  list: {
    gap: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
  },
  addText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
