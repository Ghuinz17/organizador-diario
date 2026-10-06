import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { translate, type Language } from '@/i18n/translations';
import type { Task } from '@/types/task';
import { combineDateAndTime, sortByStartTime } from '@/utils/date';

const ANDROID_CHANNEL_ID = 'task-changes';

// Decide qué hacer con las notificaciones recibidas con la app en primer plano.
// Los campos son los de SDK 52+ (shouldShowBanner/shouldShowList); shouldShowAlert ya no existe.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/** En Android 13+ sin canal creado el sistema no muestra el prompt de permisos. */
export async function ensureAndroidChannel(language: Language): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: translate(language, 'notif.channel'),
    description: translate(language, 'notif.channelDescription'),
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#2563EB',
  });
}

export async function requestPermissionsAsync(language: Language): Promise<boolean> {
  await ensureAndroidChannel(language);
  const isGranted = (status: Notifications.NotificationPermissionsStatus): boolean =>
    status.granted ||
    status.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;

  const current = await Notifications.getPermissionsAsync();
  if (isGranted(current)) return true;
  const requested = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });
  return isGranted(requested);
}

export async function cancelAllTaskNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Reprograma, para todas las tareas, un aviso en su hora de inicio:
 * la primera anuncia su comienzo; las siguientes anuncian el cambio respecto
 * a la anterior si esa termina (modo rango). Solo programa horas futuras.
 */
export async function scheduleTaskNotifications(
  tasks: Task[],
  language: Language,
): Promise<string[]> {
  const granted = await requestPermissionsAsync(language);
  if (!granted) return [];

  const now = Date.now();
  const byDate = new Map<string, Task[]>();
  for (const task of tasks) {
    const dayTasks = byDate.get(task.date) ?? [];
    dayTasks.push(task);
    byDate.set(task.date, dayTasks);
  }

  const identifiers: string[] = [];
  for (const [date, dayTasks] of byDate) {
    const sorted = sortByStartTime(dayTasks);
    for (let index = 0; index < sorted.length; index += 1) {
      const task = sorted[index];
      const triggerDate = combineDateAndTime(date, task.startTime);
      if (!triggerDate || triggerDate.getTime() <= now) continue;

      const previous = sorted[index - 1];
      const previousEnds = previous?.timeMode === 'range' && previous.endTime;
      const body = previous
        ? previousEnds
          ? translate(language, 'notif.switch', {
              prev: previous.title,
              title: task.title,
            })
          : translate(language, 'notif.next', { title: task.title })
        : translate(language, 'notif.first', { title: task.title });

      try {
        const identifier = await Notifications.scheduleNotificationAsync({
          content: {
            title: translate(language, 'notif.title'),
            body,
            data: { url: `/task/${date}` },
            sound: 'default',
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: triggerDate,
            channelId: ANDROID_CHANNEL_ID,
          },
        });
        identifiers.push(identifier);
      } catch (error) {
        console.warn(`No se pudo programar la notificación de "${task.title}"`, error);
      }
    }
  }
  return identifiers;
}

/**
 * Recalcula todas las notificaciones pendientes (al iniciar la app, tras cada
 * cambio en las tareas o al cambiar el idioma). Las notificaciones locales
 * sobreviven a los reinicios, así que este proceso retira duplicados y avisos
 * de tareas eliminadas.
 */
export async function resyncNotifications(
  tasks: Task[],
  language: Language,
): Promise<void> {
  await cancelAllTaskNotifications();
  // Sin tareas no tiene sentido pedir permisos todavía.
  if (tasks.length === 0) return;
  await scheduleTaskNotifications(tasks, language);
}

export type TestNotificationResult = 'granted' | 'denied';

/** Programa una notificación de prueba a 5 segundos para verificar el sistema. */
export async function scheduleTestNotification(
  language: Language,
): Promise<TestNotificationResult> {
  const granted = await requestPermissionsAsync(language);
  if (!granted) return 'denied';
  await Notifications.scheduleNotificationAsync({
    content: {
      title: translate(language, 'notif.testTitle'),
      body: translate(language, 'notif.testBody'),
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
      channelId: ANDROID_CHANNEL_ID,
    },
  });
  return 'granted';
}

export async function getScheduledNotificationsCount(): Promise<number> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.length;
}
