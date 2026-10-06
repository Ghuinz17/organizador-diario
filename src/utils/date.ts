import type { Task } from '@/types/task';

const WEEKDAYS = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
];

const WEEKDAYS_SHORT = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

const MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const MONTHS_SHORT = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

const EN_WEEKDAYS = [
  { weekdayLong: 'Sunday', weekdayShort: 'Sun' },
  { weekdayLong: 'Monday', weekdayShort: 'Mon' },
  { weekdayLong: 'Tuesday', weekdayShort: 'Tue' },
  { weekdayLong: 'Wednesday', weekdayShort: 'Wed' },
  { weekdayLong: 'Thursday', weekdayShort: 'Thu' },
  { weekdayLong: 'Friday', weekdayShort: 'Fri' },
  { weekdayLong: 'Saturday', weekdayShort: 'Sat' },
];

const EN_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const EN_MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** Convierte una Date local a ISO (YYYY-MM-DD). */
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

/** Combina una fecha ISO y una hora HH:mm en una Date local. Devuelve null si no es válida. */
export function combineDateAndTime(isoDate: string, time: string): Date | null {
  const [year, month, day] = isoDate.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  if ([year, month, day, hours, minutes].some(Number.isNaN)) return null;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  const result = new Date(year, month - 1, day, hours, minutes, 0, 0);
  return Number.isNaN(result.getTime()) ? null : result;
}

export function isValidTime(value: string): boolean {
  return /^\d{2}:\d{2}$/.test(value) && combineDateAndTime('2000-01-01', value) !== null;
}

/** "2026-10-06" → "martes, 6 de octubre de 2026" (es) / "Tuesday, October 6, 2026" (en) */
export function formatLongDate(isoDate: string, language: 'es' | 'en' = 'es'): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  if ([year, month, day].some(Number.isNaN)) return isoDate;
  const date = new Date(year, month - 1, day);
  if (language === 'en') {
    const en = EN_WEEKDAYS[date.getDay()];
    return `${en.weekdayLong}, ${EN_MONTHS[month - 1]} ${day}, ${year}`;
  }
  return `${WEEKDAYS[date.getDay()]}, ${day} de ${MONTHS[month - 1]} de ${year}`;
}

/** "2026-10-06" → "mar, 6 oct" (es) / "Tue, Oct 6" (en) */
export function formatShortDate(isoDate: string, language: 'es' | 'en' = 'es'): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  if ([year, month, day].some(Number.isNaN)) return isoDate;
  const date = new Date(year, month - 1, day);
  if (language === 'en') {
    const en = EN_WEEKDAYS[date.getDay()];
    return `${en.weekdayShort}, ${EN_MONTHS_SHORT[month - 1]} ${day}`;
  }
  return `${WEEKDAYS_SHORT[date.getDay()]}, ${day} ${MONTHS_SHORT[month - 1]}`;
}

/** Ordena tareas por hora de inicio (HH:mm con ceros a la izquierda). */
export function sortByStartTime(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => a.startTime.localeCompare(b.startTime));
}
