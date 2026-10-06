export type TaskTimeMode = 'range' | 'fixed';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  /** Fecha en formato ISO: YYYY-MM-DD */
  date: string;
  /**
   * 'range' → la tarea ocupa de startTime a endTime.
   * 'fixed' → solo tiene una hora concreta (startTime) y endTime no existe.
   */
  timeMode: TaskTimeMode;
  /** Hora de inicio en formato 24h: HH:mm */
  startTime: string;
  /** Hora de fin (solo en modo 'range'), formato 24h: HH:mm */
  endTime?: string;
  /** Color de acento en formato hex */
  color: string;
}

export type TaskDraft = Omit<Task, 'id'>;

export const TASK_COLORS = ['#2563EB', '#16A34A', '#F59E0B', '#8B5CF6', '#EC4899'];

export const DEFAULT_TASK_COLOR = TASK_COLORS[0];
