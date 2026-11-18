import { useEffect, useId, useRef, useState, type KeyboardEvent, type Ref } from 'react';
import { Check, ChevronDown } from 'lucide-react';
interface Props {
  value?: string; options: { value: string; label: string }[]; label: string; placeholder: string; empty: string; error?: string;
  onChange: (value: string) => void; onBlur: () => void; inputRef: Ref<HTMLButtonElement>;
}
export default function TimeSelect({ value, options, label, placeholder, empty, error, onChange, onBlur, inputRef }: Props) {
  const id = useId(), panel = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false), [active, setActive] = useState(0);
  const search = useRef({ text: '', time: 0 });
  const selected = options.find(option => option.value === value);
  const highlighted = Math.max(0, Math.min(active, options.length - 1));
  useEffect(() => {
    if (!open) return;
    const close = () => panel.current?.hidePopover();
    addEventListener('resize', close); document.addEventListener('scroll', close, true);
    return () => { removeEventListener('resize', close); document.removeEventListener('scroll', close, true); };
  }, [open]);
  function show(index = Math.max(0, options.findIndex(option => option.value === value))) {
    const popup = panel.current, button = trigger.current;
    if (!popup || !button) return;
    const rect = button.getBoundingClientRect(), height = options.length * 48 + 16;
    const bottom = window.innerHeight - (document.querySelector('.mobile-dock')?.getBoundingClientRect().height || 0) - 12;
    popup.style.width = `${rect.width}px`; popup.style.left = `${rect.left}px`;
    popup.style.top = `${rect.bottom + 8 + height > bottom ? Math.max(8, rect.top - height - 8) : rect.bottom + 8}px`;
    setActive(index); popup.showPopover();
  }
  function select(index: number) { if (options[index]) onChange(options[index].value); panel.current?.hidePopover(); }
  function navigate(event: KeyboardEvent<HTMLButtonElement>) {
    const expanded = panel.current?.matches(':popover-open');
    if (event.key === 'Tab') { if (expanded) select(highlighted); return; }
    if (event.key === 'Escape') { if (expanded) { event.preventDefault(); panel.current?.hidePopover(); } return; }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      if (!expanded) return show(event.key === 'End' ? options.length - 1 : undefined);
      if (event.key === 'Enter' || event.key === ' ') return select(highlighted);
      setActive(event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : Math.max(0, Math.min(options.length - 1, highlighted + (event.key === 'ArrowDown' ? 1 : -1))));
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const text = (Date.now() - search.current.time > 700 ? '' : search.current.text) + event.key.toLowerCase();
      search.current = { text, time: Date.now() };
      const index = options.findIndex(option => option.label.toLowerCase().startsWith(text));
      if (index >= 0) { if (!expanded) show(index); else setActive(index); }
    }
  }
  return <div className="picker-field">
    <label id={`${id}-label`} htmlFor={`${id}-trigger`}>{label}</label>
    <button id={`${id}-trigger`} type="button" role="combobox" className="picker-trigger" ref={node => { trigger.current = node; if (typeof inputRef === 'function') inputRef(node); else if (inputRef) inputRef.current = node; }}
      aria-labelledby={`${id}-label`} aria-haspopup="listbox" aria-expanded={open} aria-controls={`${id}-options`} aria-activedescendant={open && options[highlighted] ? `${id}-option-${highlighted}` : undefined} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
      onBlur={onBlur} onKeyDown={navigate} onClick={() => panel.current?.matches(':popover-open') ? panel.current.hidePopover() : show()}>
      <span className={!selected ? 'picker-placeholder' : undefined}>{selected?.label || placeholder}</span><ChevronDown size={20} aria-hidden="true" />
    </button>
    {error && <span id={`${id}-error`} role="alert">{error}</span>}
    <div id={`${id}-options`} ref={panel} popover="auto" role="listbox" aria-labelledby={`${id}-label`} className="picker-options" onToggle={event => setOpen(event.newState === 'open')} onPointerDown={event => event.preventDefault()}>
      {options.map((option, index) => <div id={`${id}-option-${index}`} key={option.value} role="option" aria-selected={option.value === value} className={highlighted === index ? 'is-active' : undefined} onPointerMove={() => setActive(index)} onClick={() => select(index)}><span>{option.label}</span>{option.value === value && <Check size={18} aria-hidden="true" />}</div>)}
      {!options.length && <p className="picker-empty">{empty}</p>}
    </div>
  </div>;
}
