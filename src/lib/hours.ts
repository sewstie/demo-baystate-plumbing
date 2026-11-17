import type { Site } from '@/schemas/site';
export function availableNow(hours: Site['hours'], now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: hours.timeZone, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now).map(p => [p.type, p.value]));
  const day = hours.days[['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday)];
  const time = `${parts.hour}:${parts.minute}`;
  return Boolean(day && time >= day.open && time < day.close);
}
