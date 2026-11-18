import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { requestSchema, minimumRequestDay, availableWindows, type RepairRequest } from '@/lib/repair-request';
import type { Site } from '@/schemas/site';
import RequestSuccess from './RequestSuccess';
import DatePicker from './DatePicker';
import TimeSelect from './TimeSelect';
interface Props { content: Site['booking']; service: string; range: string; onBack: () => void }
export default function RequestTime({ content: c, service, range, onBack }: Props) {
  const [submitted, setSubmitted] = useState<{ request: RepairRequest; at: string } | null>(null);
  const [now, setNow] = useState(() => new Date());
  const { control, register, handleSubmit, watch, resetField, formState: { errors } } = useForm<RepairRequest>({ resolver: zodResolver(requestSchema), shouldFocusError: true, defaultValues: { name: '', contact: '', day: '' } });
  const focusHeading = useCallback((node: HTMLHeadingElement | null) => node?.focus({ preventScroll: true }), []);
  const minimumDay = minimumRequestDay(now);
  const windows = availableWindows(watch('day') || minimumDay, now);
  if (submitted) return <RequestSuccess request={submitted.request} submittedAt={submitted.at} content={c} service={service} range={range} onBack={onBack} />;
  return <form className="request-form" onFocusCapture={() => setNow(new Date())} onPointerDownCapture={() => setNow(new Date())} onKeyDownCapture={() => setNow(new Date())} onSubmit={handleSubmit(request => setSubmitted({ request, at: new Date().toISOString() }))} noValidate>
    <h3 tabIndex={-1} ref={focusHeading}>{c.title}</h3><p>{c.notice}</p>
    {(['name', 'contact'] as const).map(field => <label key={field}>{c[field]}<input {...register(field)} type="text" autoComplete={field === 'name' ? 'name' : undefined} aria-invalid={!!errors[field]} aria-describedby={errors[field] ? `${field}-error` : undefined} />{errors[field] && <span id={`${field}-error`} role="alert">{errors[field]?.message}</span>}</label>)}
    <Controller control={control} name="day" render={({ field }) => <DatePicker value={field.value} min={minimumDay} content={c.datePicker} label={c.day} error={errors.day?.message} inputRef={field.ref} onBlur={field.onBlur} onChange={day => { field.onChange(day); resetField('window'); }} />} />
    <Controller control={control} name="window" render={({ field }) => <TimeSelect value={field.value} label={c.window} placeholder={c.windowPlaceholder} empty={c.noWindows} options={c.windows.flatMap((label, i) => windows.includes(String(i)) ? [{ value: String(i), label }] : [])} error={errors.window?.message} inputRef={field.ref} onBlur={field.onBlur} onChange={field.onChange} />} />
    <div className="estimate-controls"><button type="button" className="text-link" onClick={onBack}>{c.back}</button><button className="button" type="submit">{c.submit}</button></div>
  </form>;
}
