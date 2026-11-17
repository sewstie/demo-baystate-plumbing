import { useMemo } from 'react';
import type { Site } from '@/schemas/site';
import { calendarFile, type RepairRequest } from '@/lib/repair-request';
interface Props { request: RepairRequest; content: Site['booking']; service: string; range: string; onBack: () => void }
export default function RequestSuccess({ request, content: c, service, range, onBack }: Props) {
  const values = [request.name, request.contact, service, request.day, c.windows[Number(request.window)], range];
  const email = [`To: ${c.ownerEmail}`, `Subject: Demo repair request: ${service}`, '', ...c.ownerLabels.map((label, i) => `${label}: ${values[i]}`), '', c.notice].join('\n');
  const calendar = useMemo(() => calendarFile(request, c.calendarTitle, email), [request, c.calendarTitle, email]);
  return <div className="request-success"><p className="demo-tag">{c.notice}</p><h3 tabIndex={-1} ref={node => node?.focus({ preventScroll: true })}>{c.success}</h3><p>{c.note}</p>
    <figure><figcaption>{c.emailTitle}</figcaption><pre>{email}</pre></figure>
    <a className="button" download="demo-repair-request.ics" href={`data:text/calendar;charset=utf-8,${encodeURIComponent(calendar)}`}>{c.calendar}</a>
    <button className="text-link" onClick={onBack}>{c.back}</button>
  </div>;
}
