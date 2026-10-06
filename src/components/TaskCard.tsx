import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useI18n } from '@/i18n/I18nContext';
import { useTheme } from '@/theme/ThemeContext';
import type { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onDelete?: () => void;
  highlighted?: boolean;
}

export function TaskCard({ task, onPress, onDelete, highlighted = false }: TaskCardProps) {
  const { colors } = useTheme();
  const { t } = useI18n();

  const isFixed = task.timeMode === 'fixed';
  const timeLabel = isFixed
    ? `${task.startTime} · ${t('card.fixed')}`
    : `${task.startTime} – ${task.endTime ?? ''}`;
  const a11yLabel = isFixed
    ? t('a11y.taskFixed', { title: task.title, start: task.startTime })
    : t('a11y.taskRange', { title: task.title, start: task.startTime, end: task.endTime ?? '' });

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: highlighted ? colors.primary : colors.border,
        },
      ]}
    >
      <View style={[styles.stripe, { backgroundColor: task.color }]} />
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={a11yLabel}
        style={({ pressed }) => [styles.content, { opacity: pressed && onPress ? 0.7 : 1 }]}
      >
        <Text style={[styles.time, { color: colors.primary }]}>{timeLabel}</Text>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {task.title}
        </Text>
        {task.notes ? (
          <Text style={[styles.notes, { color: colors.textMuted }]} numberOfLines={2}>
            {task.notes}
          </Text>
        ) : null}
      </Pressable>

      {highlighted ? (
        <Text style={[styles.badge, { color: colors.primary }]}>{t('tasks.editing')}</Text>
      ) : null}

      {onDelete ? (
        <Pressable
          onPress={onDelete}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={t('a11y.deleteTask', { title: task.title })}
          style={({ pressed }) => [styles.deleteButton, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Ionicons name="trash-outline" size={19} color={colors.danger} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingRight: 10,
    overflow: 'hidden',
  },
  stripe: {
    width: 5,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    gap: 2,
  },
  time: {
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  notes: {
    fontSize: 13,
  },
  badge: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  deleteButton: {
    padding: 6,
  },
});
