import { z } from 'zod';
export const localDay = (now = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
export function availableWindows(day: string, now = new Date()) {
  const today = localDay(now);
  const hour = Number(new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', hourCycle: 'h23' }).format(now));
  return [12, 16].flatMap((end, index) => day > today || day === today && hour < end ? [String(index)] : []);
}
export function minimumRequestDay(now = new Date()) {
  const today = localDay(now);
  if (availableWindows(today, now).length) return today;
  const tomorrow = new Date(`${today}T12:00:00Z`);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  return tomorrow.toISOString().slice(0, 10);
}
export const requestSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.').max(100),
  contact: z.string().trim().refine(v => z.email().safeParse(v).success || /^[+()\d .-]+$/.test(v) && v.replace(/\D/g, '').length >= 10 && v.replace(/\D/g, '').length <= 15, 'Enter an email address or phone number.'),
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a day.').refine(v => !v || !isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0,10) === v && v >= minimumRequestDay(), 'Choose an available day.'),
  window: z.enum(['0', '1'], { error: 'Choose a time window.' }),
}).refine(request => availableWindows(request.day).includes(request.window), { path: ['window'], message: 'Choose an available time window.' });
export type RepairRequest = z.infer<typeof requestSchema>;
const escape = (s: string) => s.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/[,;]/g, '\\$&');
export function calendarFile(request: RepairRequest, title: string, description: string) {
  const end = new Date(`${request.day}T12:00:00Z`); end.setUTCDate(end.getUTCDate() + 1);
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Repair demo//EN', 'BEGIN:VEVENT', `UID:${crypto.randomUUID()}@repair-demo`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0,15)}Z`, `DTSTART;VALUE=DATE:${request.day.replace(/-/g, '')}`, `DTEND;VALUE=DATE:${end.toISOString().slice(0,10).replace(/-/g, '')}`, `SUMMARY:${escape(title)}`, `DESCRIPTION:${escape(description)}`, 'STATUS:TENTATIVE', 'END:VEVENT', 'END:VCALENDAR'];
  return lines.map(line => { let folded = '', count = 0; for (const char of line) { const bytes = new TextEncoder().encode(char).length; if (count + bytes > 74) { folded += '\r\n '; count = 1; } folded += char; count += bytes; } return folded; }).join('\r\n');
}
