import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { useTasks } from '@/context/TasksContext';
import { useI18n } from '@/i18n/I18nContext';
import { scheduleTestNotification } from '@/services/notificationManager';
import { useTheme } from '@/theme/ThemeContext';
import type { Task, TaskDraft } from '@/types/task';
import { formatLongDate } from '@/utils/date';

export function TaskScreen() {
  const params = useLocalSearchParams<{ date: string }>();
  const date = typeof params.date === 'string' ? params.date : '';
  const { colors } = useTheme();
  const { t, language } = useI18n();
  const { tasksForDate, addTask, updateTask, removeTask } = useTasks();
  const [editingId, setEditingId] = useState<string | null>(null);

  const dayTasks = tasksForDate(date);
  const editing = dayTasks.find((task) => task.id === editingId) ?? null;

  const handleSave = (draft: TaskDraft) => {
    if (editing) {
      return updateTask(editing.id, draft).then(() => setEditingId(null));
    }
    return addTask(draft).then(() => undefined);
  };

  const handleDelete = (task: Task) => {
    Alert.alert(
      t('delete.confirmTitle'),
      t('delete.confirmMessage', { title: task.title }),
      [
        { text: t('delete.cancel'), style: 'cancel' },
        {
          text: t('delete.confirm'),
          style: 'destructive',
          onPress: () => {
            setEditingId((current) => (current === task.id ? null : current));
            void removeTask(task.id);
          },
        },
      ],
    );
  };

  const handleTestNotification = async () => {
    try {
      const result = await scheduleTestNotification(language);
      if (result === 'denied') {
        Alert.alert(t('notif.testTitle'), t('tasks.testNotification.denied'));
      } else {
        Alert.alert(t('notif.testTitle'), t('tasks.testNotification.ok'));
      }
    } catch (error) {
      console.warn('No se pudo programar la notificación de prueba', error);
      Alert.alert(t('notif.testTitle'), t('tasks.testNotification.error'));
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.dateTitle, { color: colors.text }]}>
        {formatLongDate(date, language)}
      </Text>

      {dayTasks.length === 0 && !editing ? (
        <View
          style={[
            styles.empty,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Ionicons name="list-outline" size={28} color={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            {t('tasks.emptyDay')}
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {dayTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              highlighted={task.id === editingId}
              onPress={() => setEditingId(task.id === editingId ? null : task.id)}
              onDelete={() => handleDelete(task)}
            />
          ))}
        </View>
      )}

      <TaskForm
        key={editing?.id ?? 'nueva'}
        date={date}
        initial={editing}
        onSave={handleSave}
        onDelete={editing ? () => handleDelete(editing) : undefined}
        onCancelEdit={editing ? () => setEditingId(null) : undefined}
      />

      <View style={[styles.infoBox, { borderColor: colors.border }]}>
        <Ionicons name="notifications-outline" size={16} color={colors.primary} />
        <Text style={[styles.infoText, { color: colors.textMuted }]}>{t('tasks.info')}</Text>
      </View>

      <Pressable
        onPress={handleTestNotification}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.testButton,
          { borderColor: colors.primary, opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Ionicons name="notifications-outline" size={17} color={colors.primary} />
        <Text style={[styles.testText, { color: colors.primary }]}>
          {t('tasks.testNotification')}
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
  dateTitle: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'capitalize',
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 11,
  },
  testText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
