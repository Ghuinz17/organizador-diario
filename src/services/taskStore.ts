import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_TASK_COLOR, type Task, type TaskTimeMode } from '@/types/task';

const STORAGE_KEY = '@organizador-diario/tasks';

/**
 * Normaliza las tareas guardadas para aceptar versiones antiguas
 * (sin timeMode, creadas cuando todas las tareas tenían inicio y fin).
 */
function normalizeTask(raw: unknown): Task | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const candidate = raw as Partial<Task>;
  if (
    typeof candidate.id !== 'string' ||
    typeof candidate.title !== 'string' ||
    typeof candidate.date !== 'string' ||
    typeof candidate.startTime !== 'string'
  ) {
    return null;
  }

  const timeMode: TaskTimeMode =
    candidate.timeMode ?? (candidate.endTime ? 'range' : 'fixed');
  const endTime = timeMode === 'range' ? candidate.endTime : undefined;

  return {
    id: candidate.id,
    title: candidate.title,
    notes: typeof candidate.notes === 'string' ? candidate.notes : undefined,
    date: candidate.date,
    timeMode: endTime ? 'range' : 'fixed',
    startTime: candidate.startTime,
    endTime,
    color: typeof candidate.color === 'string' ? candidate.color : DEFAULT_TASK_COLOR,
  };
}

export async function loadTasks(): Promise<Task[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalizeTask)
      .filter((task): task is Task => task !== null);
  } catch (error) {
    console.warn('No se pudieron cargar las tareas guardadas', error);
    return [];
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
