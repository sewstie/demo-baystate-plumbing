import { useId, useRef, useState, type KeyboardEvent, type Ref } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { calendarDate, dateLabel, monthWeeks, moveDay, moveMonth } from '@/lib/calendar';
import { localDay } from '@/lib/repair-request';
import type { Site } from '@/schemas/site';
interface Props {
  value: string; min: string; content: Site['booking']['datePicker']; label: string; error?: string;
  onChange: (value: string) => void; onBlur: () => void; inputRef: Ref<HTMLButtonElement>;
}
export default function DatePicker({ value, min, content: c, label, error, onChange, onBlur, inputRef }: Props) {
  const id = useId(), dialog = useRef<HTMLDialogElement>(null), trigger = useRef<HTMLButtonElement | null>(null);
  const [active, setActive] = useState(value || min);
  const [month, setMonth] = useState(active);
  const [open, setOpen] = useState(false);
  const monthTitle = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'long', year: 'numeric' }).format(calendarDate(month));
  const weekdays = monthWeeks(month)[0];
  function focusDay(day: string) {
    const next = day < min ? min : day;
    setActive(next); setMonth(next);
    requestAnimationFrame(() => dialog.current?.querySelector<HTMLButtonElement>(`[data-day="${next}"]`)?.focus());
  }
  function show() {
    setOpen(true); dialog.current?.showModal(); focusDay(value && value >= min ? value : min);
  }
  function select(day: string) { onChange(day); dialog.current?.close(); }
  function navigate(event: KeyboardEvent<HTMLButtonElement>, day: string) {
    const weekday = calendarDate(day).getUTCDay();
    const offsets: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, Home: -weekday, End: 6 - weekday };
    if (event.key in offsets) { event.preventDefault(); focusDay(moveDay(day, offsets[event.key])); }
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault(); focusDay(moveMonth(day, (event.key === 'PageUp' ? -1 : 1) * (event.shiftKey ? 12 : 1)));
    }
  }
  function changeMonth(amount: number) {
    const next = moveMonth(active, amount);
    setActive(next < min ? min : next); setMonth(next < min ? min : next);
  }
  return <div className="picker-field">
    <label id={`${id}-label`} htmlFor={`${id}-trigger`}>{label}</label>
    <button id={`${id}-trigger`} type="button" className="picker-trigger" ref={node => { trigger.current = node; if (typeof inputRef === 'function') inputRef(node); else if (inputRef) inputRef.current = node; }}
      aria-labelledby={`${id}-label ${id}-value`} aria-haspopup="dialog" aria-expanded={open} aria-controls={`${id}-dialog`} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} onClick={show} onBlur={onBlur}>
      <span id={`${id}-value`} className={!value ? 'picker-placeholder' : undefined}>{value ? dateLabel(value) : c.placeholder}</span><CalendarDays size={20} aria-hidden="true" />
    </button>
    {error && <span id={`${id}-error`} role="alert">{error}</span>}
    <dialog id={`${id}-dialog`} className="calendar-dialog" ref={dialog} aria-modal="true" aria-labelledby={`${id}-title`} aria-describedby={`${id}-help`}
      onClose={() => { setOpen(false); trigger.current?.focus({ preventScroll: true }); }} onClick={event => { if (event.target === event.currentTarget) { const r = event.currentTarget.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) event.currentTarget.close(); } }}>
      <div className="calendar-heading"><h3 id={`${id}-title`}>{label}</h3><button className="calendar-icon" type="button" aria-label={c.close} onClick={() => dialog.current?.close()}><X size={20} aria-hidden="true" /></button></div>
      <div className="calendar-month"><button className="calendar-icon" type="button" disabled={month.slice(0, 7) <= min.slice(0, 7)} aria-label={c.previous} onClick={() => changeMonth(-1)}><ChevronLeft size={20} aria-hidden="true" /></button><strong id={`${id}-month`} aria-live="polite">{monthTitle}</strong><button className="calendar-icon" type="button" aria-label={c.next} onClick={() => changeMonth(1)}><ChevronRight size={20} aria-hidden="true" /></button></div>
      <table className="calendar-grid" role="grid" aria-labelledby={`${id}-month`}>
        <thead><tr>{weekdays.map(day => <th key={day} scope="col"><abbr title={new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', weekday: 'long' }).format(calendarDate(day))}>{new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', weekday: 'short' }).format(calendarDate(day))}</abbr></th>)}</tr></thead>
        <tbody>{monthWeeks(month).map(week => <tr key={week[0]}>{week.map(day => <td key={day} aria-selected={day === value}>
          <button type="button" data-day={day} className={day.slice(0, 7) !== month.slice(0, 7) ? 'calendar-outside' : undefined} disabled={day < min} tabIndex={day === active ? 0 : -1} aria-label={dateLabel(day)} aria-current={day === localDay() ? 'date' : undefined} onKeyDown={event => navigate(event, day)} onClick={() => select(day)}>{calendarDate(day).getUTCDate()}</button>
        </td>)}</tr>)}</tbody>
      </table>
      <p id={`${id}-help`} className="calendar-help">{c.help}</p>
      <button type="button" className="text-link calendar-earliest" onClick={() => focusDay(min)}>{c.earliest}</button>
    </dialog>
  </div>;
}
