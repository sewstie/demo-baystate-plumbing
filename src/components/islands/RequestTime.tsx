import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { requestSchema, localDay, type RepairRequest } from '@/lib/repair-request';
import type { Site } from '@/schemas/site';
import RequestSuccess from './RequestSuccess';
interface Props { content: Site['booking']; service: string; range: string; onBack: () => void }
export default function RequestTime({ content: c, service, range, onBack }: Props) {
  const [submitted, setSubmitted] = useState<RepairRequest | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<RepairRequest>({ resolver: zodResolver(requestSchema), defaultValues: { window: '0' } });
  if (submitted) return <RequestSuccess request={submitted} content={c} service={service} range={range} onBack={onBack} />;
  return <form className="request-form" onSubmit={handleSubmit(setSubmitted)} noValidate>
    <h3 tabIndex={-1} ref={node => node?.focus({ preventScroll: true })}>{c.title}</h3><p>{c.notice}</p>
    {(['name', 'contact', 'day'] as const).map(field => <label key={field}>{c[field]}<input {...register(field)} type={field === 'day' ? 'date' : 'text'} min={field === 'day' ? localDay() : undefined} autoComplete={field === 'name' ? 'name' : undefined} aria-invalid={!!errors[field]} aria-describedby={errors[field] ? `${field}-error` : undefined} />{errors[field] && <span id={`${field}-error`} role="alert">{errors[field]?.message}</span>}</label>)}
    <label>{c.window}<select {...register('window')}>{c.windows.map((w,i) => <option key={w} value={i}>{w}</option>)}</select></label>
    <div className="estimate-controls"><button type="button" className="text-link" onClick={onBack}>{c.back}</button><button className="button" type="submit">{c.submit}</button></div>
  </form>;
}
