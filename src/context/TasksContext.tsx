import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useI18n } from '@/i18n/I18nContext';
import { resyncNotifications } from '@/services/notificationManager';
import { loadTasks, saveTasks } from '@/services/taskStore';
import type { Task, TaskDraft } from '@/types/task';
import { sortByStartTime } from '@/utils/date';

interface TasksContextValue {
  tasks: Task[];
  ready: boolean;
  tasksForDate: (date: string) => Task[];
  addTask: (draft: TaskDraft) => Promise<Task>;
  updateTask: (id: string, patch: Partial<TaskDraft>) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextValue | undefined>(undefined);

function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const { language, ready: i18nReady } = useI18n();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ready, setReady] = useState(false);
  const tasksRef = useRef<Task[]>([]);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    let active = true;
    loadTasks().then((loaded) => {
      if (!active) return;
      setTasks(loaded);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  // Reprograma al estar listas las tareas y el idioma, y cada vez que cambia el idioma.
  useEffect(() => {
    if (!ready || !i18nReady) return;
    resyncNotifications(tasksRef.current, language).catch((error) => {
      console.warn('No se pudieron reprogramar las notificaciones', error);
    });
  }, [ready, i18nReady, language]);

  const commit = useCallback(
    async (next: Task[]) => {
      setTasks(next);
      try {
        await saveTasks(next);
        await resyncNotifications(next, language);
      } catch (error) {
        console.warn('No se pudieron guardar las tareas', error);
      }
    },
    [language],
  );

  const addTask = useCallback(
    async (draft: TaskDraft) => {
      const task: Task = { ...draft, id: createId() };
      await commit([...tasks, task]);
      return task;
    },
    [tasks, commit],
  );

  const updateTask = useCallback(
    async (id: string, patch: Partial<TaskDraft>) => {
      const next = tasks.map((task) => (task.id === id ? { ...task, ...patch } : task));
      await commit(next);
    },
    [tasks, commit],
  );

  const removeTask = useCallback(
    async (id: string) => {
      await commit(tasks.filter((task) => task.id !== id));
    },
    [tasks, commit],
  );

  const tasksForDate = useCallback(
    (date: string) => sortByStartTime(tasks.filter((task) => task.date === date)),
    [tasks],
  );

  const value = useMemo(
    () => ({ tasks, ready, tasksForDate, addTask, updateTask, removeTask }),
    [tasks, ready, tasksForDate, addTask, updateTask, removeTask],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks(): TasksContextValue {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks debe usarse dentro de <TasksProvider>');
  }
  return context;
}
