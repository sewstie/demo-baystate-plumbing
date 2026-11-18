export const calendarDate = (day: string) => new Date(`${day}T12:00:00Z`);
export const dayKey = (date: Date) => date.toISOString().slice(0, 10);
export function moveDay(day: string, days: number) {
  const date = calendarDate(day);
  date.setUTCDate(date.getUTCDate() + days);
  return dayKey(date);
}
export function moveMonth(day: string, months: number) {
  const date = calendarDate(day), originalDay = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(originalDay, lastDay));
  return dayKey(date);
}
export function monthWeeks(day: string) {
  const first = `${day.slice(0, 7)}-01`, start = moveDay(first, -calendarDate(first).getUTCDay());
  return Array.from({ length: 6 }, (_, week) => Array.from({ length: 7 }, (_, weekday) => moveDay(start, week * 7 + weekday)));
}
export const dateLabel = (day: string) => new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(calendarDate(day));
