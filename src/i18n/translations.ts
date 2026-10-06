export type Language = 'es' | 'en';

const es = {
  // Cabeceras
  'app.title': 'Organizador Diario',
  'header.dayTasks': 'Tareas del día',
  // Pantalla de calendario
  'calendar.manageDay': 'Gestionar día',
  'calendar.newTask': 'Nueva tarea',
  'calendar.emptyDay': 'Sin tareas para este día. Pulsa «Nueva tarea» para añadir la primera.',
  // Pantalla de tareas
  'tasks.emptyDay': 'Todavía no hay tareas este día. Crea la primera con el formulario de abajo.',
  'tasks.info':
    'Al guardar, la app programa un aviso local en la hora de inicio de cada tarea: «Termina X → empieza Y».',
  'tasks.editing': 'editando',
  'tasks.testNotification': 'Probar notificación (5 s)',
  'tasks.testNotification.ok': 'Notificación de prueba programada: llegará en 5 segundos.',
  'tasks.testNotification.denied': 'No hay permisos de notificación. Actívalos en Ajustes del sistema.',
  'tasks.testNotification.error': 'No se pudo programar la notificación de prueba.',
  // Tarjeta de tarea
  'card.fixed': 'hora fija',
  // Formulario
  'form.new': 'Nueva tarea',
  'form.edit': 'Editar tarea',
  'form.title': 'Título',
  'form.titlePlaceholder': 'Ej. Reunión de equipo',
  'form.timeMode': 'Horario',
  'form.timeMode.range': 'Inicio y fin',
  'form.timeMode.fixed': 'Hora fija',
  'form.start': 'Inicio',
  'form.end': 'Fin',
  'form.color': 'Color',
  'form.notes': 'Notas (opcional)',
  'form.notesPlaceholder': 'Detalles, lugar, enlace…',
  'form.save': 'Añadir tarea',
  'form.saveChanges': 'Guardar cambios',
  'form.delete': 'Eliminar tarea',
  'form.cancelEdit': 'Cancelar edición',
  'form.error.title': 'Escribe un título para la tarea.',
  'form.error.hours': 'Introduce horas válidas (00:00 – 23:59).',
  'form.error.order': 'La hora de fin debe ser posterior a la hora de inicio.',
  // Eliminar
  'delete.confirmTitle': 'Eliminar tarea',
  'delete.confirmMessage': '¿Eliminar «{title}»?',
  'delete.cancel': 'Cancelar',
  'delete.confirm': 'Eliminar',
  // Accesibilidad
  'a11y.themeToLight': 'Cambiar al tema claro',
  'a11y.themeToDark': 'Cambiar al tema oscuro',
  'a11y.languageToEn': 'Cambiar idioma a inglés',
  'a11y.languageToEs': 'Cambiar idioma a español',
  'a11y.taskRange': 'Tarea {title}, de {start} a {end}',
  'a11y.taskFixed': 'Tarea {title}, a las {start}',
  'a11y.deleteTask': 'Eliminar tarea {title}',
  // Notificaciones
  'notif.title': 'Hora de cambiar de tarea',
  'notif.first': 'Comienza «{title}»',
  'notif.switch': 'Termina «{prev}» → empieza «{title}»',
  'notif.next': 'Empieza «{title}»',
  'notif.channel': 'Cambios de tarea',
  'notif.channelDescription': 'Avisos al llegar la hora de cambiar de una tarea a otra',
  'notif.testTitle': 'Notificación de prueba',
  'notif.testBody': 'Si ves esto, las notificaciones locales funcionan correctamente.',
} as const;

export type TranslationKey = keyof typeof es;

const en: Record<TranslationKey, string> = {
  'app.title': 'Organizador Diario',
  'header.dayTasks': 'Day tasks',
  'calendar.manageDay': 'Manage day',
  'calendar.newTask': 'New task',
  'calendar.emptyDay': 'No tasks for this day. Tap “New task” to add the first one.',
  'tasks.emptyDay': 'There are no tasks on this day yet. Create the first one with the form below.',
  'tasks.info':
    'When you save, the app schedules a local notification at each task start time: “Ends X → starts Y”.',
  'tasks.editing': 'editing',
  'tasks.testNotification': 'Test notification (5 s)',
  'tasks.testNotification.ok': 'Test notification scheduled: it will arrive in 5 seconds.',
  'tasks.testNotification.denied': 'Notification permissions are not granted. Enable them in system Settings.',
  'tasks.testNotification.error': 'Could not schedule the test notification.',
  'card.fixed': 'fixed time',
  'form.new': 'New task',
  'form.edit': 'Edit task',
  'form.title': 'Title',
  'form.titlePlaceholder': 'e.g. Team meeting',
  'form.timeMode': 'Schedule',
  'form.timeMode.range': 'Start and end',
  'form.timeMode.fixed': 'Fixed time',
  'form.start': 'Start',
  'form.end': 'End',
  'form.color': 'Color',
  'form.notes': 'Notes (optional)',
  'form.notesPlaceholder': 'Details, place, link…',
  'form.save': 'Add task',
  'form.saveChanges': 'Save changes',
  'form.delete': 'Delete task',
  'form.cancelEdit': 'Cancel editing',
  'form.error.title': 'Enter a title for the task.',
  'form.error.hours': 'Enter valid times (00:00 – 23:59).',
  'form.error.order': 'The end time must be after the start time.',
  'delete.confirmTitle': 'Delete task',
  'delete.confirmMessage': 'Delete “{title}”?',
  'delete.cancel': 'Cancel',
  'delete.confirm': 'Delete',
  'a11y.themeToLight': 'Switch to light theme',
  'a11y.themeToDark': 'Switch to dark theme',
  'a11y.languageToEn': 'Switch language to English',
  'a11y.languageToEs': 'Switch language to Spanish',
  'a11y.taskRange': 'Task {title}, from {start} to {end}',
  'a11y.taskFixed': 'Task {title} at {start}',
  'a11y.deleteTask': 'Delete task {title}',
  'notif.title': 'Time to switch tasks',
  'notif.first': 'Starts “{title}”',
  'notif.switch': 'Ends “{prev}” → starts “{title}”',
  'notif.next': 'Starts “{title}”',
  'notif.channel': 'Task switches',
  'notif.channelDescription': 'Alerts when it is time to move from one task to another',
  'notif.testTitle': 'Test notification',
  'notif.testBody': 'If you see this, local notifications are working correctly.',
};

export const translations: Record<Language, Record<TranslationKey, string>> = { es, en };

export const DEFAULT_LANGUAGE: Language = 'es';

/** Traducción plana con soporte de parámetros {nombre}. */
export function translate(
  language: Language,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  let text = translations[language][key] ?? translations[DEFAULT_LANGUAGE][key];
  if (params) {
    for (const [name, value] of Object.entries(params)) {
      text = text.split(`{${name}}`).join(String(value));
    }
  }
  return text;
}
