import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { TimePickerField } from '@/components/TimePickerField';
import { useI18n } from '@/i18n/I18nContext';
import { useTheme } from '@/theme/ThemeContext';
import {
  DEFAULT_TASK_COLOR,
  TASK_COLORS,
  type Task,
  type TaskDraft,
  type TaskTimeMode,
} from '@/types/task';
import { isValidTime } from '@/utils/date';

interface TaskFormProps {
  /** Fecha (ISO) a la que pertenece la tarea. */
  date: string;
  /** Tarea en edición; null para crear una nueva. */
  initial?: Task | null;
  onSave: (draft: TaskDraft) => void;
  onDelete?: () => void;
  onCancelEdit?: () => void;
}

const DEFAULT_START_TIME = '09:00';
const DEFAULT_END_TIME = '10:00';

export function TaskForm({ date, initial = null, onSave, onDelete, onCancelEdit }: TaskFormProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [timeMode, setTimeMode] = useState<TaskTimeMode>(initial?.timeMode ?? 'range');
  const [startTime, setStartTime] = useState(initial?.startTime ?? DEFAULT_START_TIME);
  const [endTime, setEndTime] = useState(initial?.endTime ?? DEFAULT_END_TIME);
  const [color, setColor] = useState(initial?.color ?? DEFAULT_TASK_COLOR);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError(t('form.error.title'));
      return;
    }
    if (!isValidTime(startTime) || (timeMode === 'range' && !isValidTime(endTime))) {
      setError(t('form.error.hours'));
      return;
    }
    if (timeMode === 'range' && endTime <= startTime) {
      setError(t('form.error.order'));
      return;
    }

    setError(null);
    setSaving(true);
    try {
      await onSave({
        title: trimmedTitle,
        notes: notes.trim() ? notes.trim() : undefined,
        date,
        timeMode,
        startTime,
        endTime: timeMode === 'range' ? endTime : undefined,
        color,
      });
      if (!initial) {
        setTitle('');
        setNotes('');
      }
    } finally {
      setSaving(false);
    }
  };

  const modeOptions: { value: TaskTimeMode; label: string }[] = [
    { value: 'range', label: t('form.timeMode.range') },
    { value: 'fixed', label: t('form.timeMode.fixed') },
  ];

  return (
    <View style={[styles.form, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.heading, { color: colors.text }]}>
        {initial ? t('form.edit') : t('form.new')}
      </Text>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.textMuted }]}>{t('form.title')}</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder={t('form.titlePlaceholder')}
          placeholderTextColor={colors.textMuted}
          style={[
            styles.textInput,
            { color: colors.text, backgroundColor: colors.surfaceAlt, borderColor: colors.border },
          ]}
          returnKeyType="done"
          accessibilityLabel={t('form.title')}
        />
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.textMuted }]}>{t('form.timeMode')}</Text>
        <View style={[styles.segment, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
          {modeOptions.map((option) => {
            const active = option.value === timeMode;
            return (
              <Pressable
                key={option.value}
                onPress={() => setTimeMode(option.value)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[
                  styles.segmentItem,
                  active && { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: active ? colors.onPrimary : colors.textMuted },
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.timesRow}>
        <TimePickerField label={t('form.start')} value={startTime} onChange={setStartTime} />
        {timeMode === 'range' ? (
          <TimePickerField label={t('form.end')} value={endTime} onChange={setEndTime} />
        ) : null}
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.textMuted }]}>{t('form.color')}</Text>
        <View style={styles.colorsRow}>
          {TASK_COLORS.map((swatch) => {
            const selected = swatch === color;
            return (
              <Pressable
                key={swatch}
                onPress={() => setColor(swatch)}
                accessibilityRole="button"
                accessibilityLabel={`Color ${swatch}`}
                style={[
                  styles.swatch,
                  { backgroundColor: swatch, borderColor: selected ? colors.text : 'transparent' },
                ]}
              >
                {selected ? <Ionicons name="checkmark" size={16} color="#FFFFFF" /> : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.textMuted }]}>{t('form.notes')}</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder={t('form.notesPlaceholder')}
          placeholderTextColor={colors.textMuted}
          multiline
          style={[
            styles.textInput,
            styles.notesInput,
            { color: colors.text, backgroundColor: colors.surfaceAlt, borderColor: colors.border },
          ]}
          accessibilityLabel={t('form.notes')}
        />
      </View>

      {error ? (
        <View style={[styles.errorBox, { backgroundColor: colors.surfaceAlt }]}>
          <Ionicons name="alert-circle" size={16} color={colors.danger} />
          <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
        </View>
      ) : null}

      <Pressable
        onPress={handleSave}
        disabled={saving}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.saveButton,
          { backgroundColor: colors.primary, opacity: pressed || saving ? 0.7 : 1 },
        ]}
      >
        <Ionicons name="checkmark" size={18} color={colors.onPrimary} />
        <Text style={[styles.saveText, { color: colors.onPrimary }]}>
          {initial ? t('form.saveChanges') : t('form.save')}
        </Text>
      </Pressable>

      {initial && onDelete ? (
        <Pressable onPress={onDelete} accessibilityRole="button" style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={16} color={colors.danger} />
          <Text style={[styles.deleteText, { color: colors.danger }]}>{t('form.delete')}</Text>
        </Pressable>
      ) : null}

      {initial && onCancelEdit ? (
        <Pressable onPress={onCancelEdit} accessibilityRole="button" style={styles.cancelButton}>
          <Text style={[styles.cancelText, { color: colors.textMuted }]}>
            {t('form.cancelEdit')}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  heading: {
    fontSize: 17,
    fontWeight: '700',
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  notesInput: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  segment: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    padding: 3,
    gap: 3,
  },
  segmentItem: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colorsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  swatch: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 12,
  },
  saveText: {
    fontSize: 15,
    fontWeight: '700',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  cancelText: {
    fontSize: 13,
  },
});
