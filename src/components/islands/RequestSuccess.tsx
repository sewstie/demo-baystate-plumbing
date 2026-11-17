import { useMemo } from 'react';
import type { Site } from '@/schemas/site';
import { calendarFile, type RepairRequest } from '@/lib/repair-request';
interface Props { request: RepairRequest; submittedAt: string; content: Site['booking']; service: string; range: string; onBack: () => void }
export default function RequestSuccess({ request, submittedAt, content: c, service, range, onBack }: Props) {
  const day = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${request.day}T12:00:00Z`));
  const submitted = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(new Date(submittedAt));
  const values = [request.name, request.contact, service, day, c.windows[Number(request.window)], range];
  const email = [`To: ${c.ownerEmail}`, `Subject: Demo repair request: ${service}`, '', `${c.submittedLabel}: ${submitted}`, ...c.ownerLabels.map((label, i) => `${label}: ${values[i]}`), '', c.notice].join('\n');
  const calendar = useMemo(() => calendarFile(request, c.calendarTitle, email), [request, c.calendarTitle, email]);
  return <div className="request-success"><h3 tabIndex={-1} ref={node => node?.focus({ preventScroll: true })}>{c.success}</h3><p>{c.submittedLabel}: {submitted}</p><p className="demo-tag">{c.notice}</p><p>{c.note}</p>
    <figure><figcaption>{c.emailTitle}</figcaption><pre>{email}</pre></figure>
    <a className="button" download="demo-repair-request.ics" href={`data:text/calendar;charset=utf-8,${encodeURIComponent(calendar)}`}>{c.calendar}</a>
    <button className="text-link" onClick={onBack}>{c.back}</button>
  </div>;
}
