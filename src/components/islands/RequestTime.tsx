import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { requestSchema, minimumRequestDay, availableWindows, type RepairRequest } from '@/lib/repair-request';
import type { Site } from '@/schemas/site';
import RequestSuccess from './RequestSuccess';
interface Props { content: Site['booking']; service: string; range: string; onBack: () => void }
export default function RequestTime({ content: c, service, range, onBack }: Props) {
  const [submitted, setSubmitted] = useState<{ request: RepairRequest; at: string } | null>(null);
  const { register, handleSubmit, watch, resetField, formState: { errors } } = useForm<RepairRequest>({ resolver: zodResolver(requestSchema), shouldFocusError: true });
  const focusHeading = useCallback((node: HTMLHeadingElement | null) => node?.focus({ preventScroll: true }), []);
  const minimumDay = minimumRequestDay();
  const windows = availableWindows(watch('day') || minimumDay);
  if (submitted) return <RequestSuccess request={submitted.request} submittedAt={submitted.at} content={c} service={service} range={range} onBack={onBack} />;
  return <form className="request-form" onSubmit={handleSubmit(request => setSubmitted({ request, at: new Date().toISOString() }))} noValidate>
    <h3 tabIndex={-1} ref={focusHeading}>{c.title}</h3><p>{c.notice}</p>
    {(['name', 'contact', 'day'] as const).map(field => <label key={field}>{c[field]}<input {...register(field, field === 'day' ? { onChange: () => resetField('window') } : {})} type={field === 'day' ? 'date' : 'text'} min={field === 'day' ? minimumDay : undefined} autoComplete={field === 'name' ? 'name' : undefined} aria-invalid={!!errors[field]} aria-describedby={errors[field] ? `${field}-error` : undefined} />{errors[field] && <span id={`${field}-error`} role="alert">{errors[field]?.message}</span>}</label>)}
    <label>{c.window}<select {...register('window')} aria-invalid={!!errors.window} aria-describedby={errors.window ? 'window-error' : undefined}><option value="">{c.windowPlaceholder}</option>{c.windows.map((w,i) => windows.includes(String(i)) && <option key={w} value={i}>{w}</option>)}</select>{errors.window && <span id="window-error" role="alert">{errors.window.message}</span>}</label>
    <div className="estimate-controls"><button type="button" className="text-link" onClick={onBack}>{c.back}</button><button className="button" type="submit">{c.submit}</button></div>
  </form>;
}
